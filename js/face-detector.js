/**
 * 人脸检测模块
 * 优先使用 MediaPipe Face Detector，回退到肤色检测
 * 支持重试机制、多肤色适配、多尺度检测
 */
import logger from './logger.js';

let mpFaceDetector = null;
let mpLoaded = false;
let mpRetryCount = 0;
const MP_MAX_RETRIES = 2;
const MP_RETRY_DELAY_MS = 1500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initMediaPipe() {
  if (mpLoaded) {
    return;
  }
  if (mpRetryCount >= MP_MAX_RETRIES) {
    return;
  }

  try {
    const { FaceDetector, FilesetResolver } =
      await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    );
    mpFaceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
      },
      runningMode: 'IMAGE',
    });
    mpLoaded = true;
    mpRetryCount = 0;
    logger.info('FaceDetector', 'MediaPipe 初始化成功');
  } catch (e) {
    mpRetryCount++;
    logger.warn(
      'FaceDetector',
      `MediaPipe 加载失败 (${mpRetryCount}/${MP_MAX_RETRIES}):`,
      e.message
    );
    if (mpRetryCount < MP_MAX_RETRIES) {
      await delay(MP_RETRY_DELAY_MS);
      return initMediaPipe();
    }
    logger.warn('FaceDetector', 'MediaPipe 重试耗尽，后续将使用回退方案');
  }
}

function rgbToYCbCr(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return { y, cb, cr };
}

function isSkinPixel(r, g, b) {
  const { y, cb, cr } = rgbToYCbCr(r, g, b);
  if (y < 20 || y > 240) {
    return false;
  }
  if (cb < 72 || cb > 135) {
    return false;
  }
  if (cr < 128 || cr <= cb) {
    return false;
  }
  if (cr > 180) {
    return false;
  }
  const hue = Math.atan2(cb - 128, cr - 128);
  if (hue < 0.35 || hue > 1.05) {
    return false;
  }
  return true;
}

function isImageTooDark(imageData) {
  const { data } = imageData;
  let sum = 0;
  const sampleStep = 10;
  let count = 0;
  for (let i = 0; i < data.length; i += sampleStep * 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    count++;
  }
  const avgBrightness = sum / count;
  return avgBrightness < 30;
}

function enhanceContrast(imageData) {
  const { data, width, height } = imageData;
  const enhanced = new ImageData(width, height);
  const enhancedData = enhanced.data;

  let minVal = 255,
    maxVal = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (gray < minVal) {
      minVal = gray;
    }
    if (gray > maxVal) {
      maxVal = gray;
    }
  }

  const range = maxVal - minVal;
  if (range < 10) {
    for (let i = 0; i < data.length; i++) {
      enhancedData[i] = data[i];
    }
    return enhanced;
  }

  const scale = 255 / range;
  for (let i = 0; i < data.length; i += 4) {
    enhancedData[i] = Math.min(255, Math.max(0, (data[i] - minVal) * scale));
    enhancedData[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - minVal) * scale));
    enhancedData[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - minVal) * scale));
    enhancedData[i + 3] = data[i + 3];
  }

  return enhanced;
}

function createScaledImageData(imageData, scale) {
  const { data, width, height } = imageData;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
  const scaled = new ImageData(newWidth, newHeight);

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.round(x / scale);
      const srcY = Math.round(y / scale);
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (y * newWidth + x) * 4;
      scaled.data[dstIdx] = data[srcIdx];
      scaled.data[dstIdx + 1] = data[srcIdx + 1];
      scaled.data[dstIdx + 2] = data[srcIdx + 2];
      scaled.data[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  return scaled;
}

function downsampleImageData(imageData, maxDim) {
  const { width, height } = imageData;
  const longer = Math.max(width, height);
  if (longer <= maxDim) {
    return imageData;
  }
  const scale = maxDim / longer;
  return createScaledImageData(imageData, scale);
}

function detectSkinRegion(imageData) {
  const { data, width, height } = imageData;
  const skinMask = new Uint8Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isSkinPixel(r, g, b)) {
      skinMask[i / 4] = 1;
    }
  }

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  let skinCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (skinMask[y * width + x]) {
        skinCount++;
        if (x < minX) {
          minX = x;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (y > maxY) {
          maxY = y;
        }
      }
    }
  }

  return { minX, minY, maxX, maxY, skinCount, totalPixels: width * height };
}

function validateFaceBox(minX, minY, maxX, maxY, skinCount, totalPixels, width, height) {
  const skinRatio = skinCount / totalPixels;

  if (skinRatio < 0.015 || skinRatio > 0.65) {
    return { valid: false, reason: 'no_face' };
  }

  const boxW = maxX - minX;
  const boxH = maxY - minY;

  if (boxW < 20 || boxH < 20 || boxW > width * 0.85 || boxH > height * 0.85) {
    return { valid: false, reason: 'no_face' };
  }

  const aspectRatio = boxW / boxH;
  if (aspectRatio < 0.25 || aspectRatio > 3.0) {
    return { valid: false, reason: 'no_face' };
  }

  return { valid: true };
}

function buildFaceBox(minX, minY, maxX, maxY, width, height, confidence) {
  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const paddingX = boxW * 0.2;
  const paddingY = boxH * 0.3;

  return {
    x: Math.max(0, minX - paddingX),
    y: Math.max(0, minY - paddingY),
    width: Math.min(width - minX + paddingX, boxW + paddingX * 2),
    height: Math.min(height - minY + paddingY, boxH + paddingY * 2),
    confidence,
  };
}

function skinBasedFaceDetection(imageData) {
  if (isImageTooDark(imageData)) {
    return { faceBox: null, reason: 'too_dark', confidence: 0 };
  }

  const downsampled = downsampleImageData(imageData, 800);
  const enhanced = enhanceContrast(downsampled);
  const scaleBack = imageData.width / downsampled.width;

  const scales = [1.0, 0.5, 0.75];
  let bestResult = null;
  let bestConfidence = 0;

  for (const scale of scales) {
    const scaledData = scale === 1.0 ? enhanced : createScaledImageData(enhanced, scale);
    const region = detectSkinRegion(scaledData);
    const validation = validateFaceBox(
      region.minX,
      region.minY,
      region.maxX,
      region.maxY,
      region.skinCount,
      region.totalPixels,
      scaledData.width,
      scaledData.height
    );

    if (!validation.valid) {
      continue;
    }

    const skinRatio = region.skinCount / region.totalPixels;
    const boxW = region.maxX - region.minX;
    const boxH = region.maxY - region.minY;
    const aspectRatio = boxW / boxH;
    const idealAspect = 0.75;
    const aspectScore = 1 - Math.min(1, Math.abs(aspectRatio - idealAspect) / 1.5);
    const confidence = skinRatio * 0.5 + aspectScore * 0.5;

    if (confidence > bestConfidence) {
      bestConfidence = confidence;
      const invScale = scaleBack / scale;
      bestResult = buildFaceBox(
        Math.round(region.minX * invScale),
        Math.round(region.minY * invScale),
        Math.round(region.maxX * invScale),
        Math.round(region.maxY * invScale),
        imageData.width,
        imageData.height,
        Math.round(confidence * 100)
      );
    }
  }

  if (!bestResult) {
    return { faceBox: null, reason: 'no_face', confidence: 0 };
  }

  return { faceBox: bestResult, reason: 'ok', confidence: bestResult.confidence };
}

async function detectFace(imageData) {
  await initMediaPipe();

  if (mpLoaded && mpFaceDetector) {
    try {
      const result = mpFaceDetector.detect(imageData);
      if (result.detections && result.detections.length > 0) {
        let best = result.detections[0];
        let bestArea = 0;
        for (const det of result.detections) {
          const box = det.boundingBox;
          const area = box.width * box.height;
          if (area > bestArea) {
            bestArea = area;
            best = det;
          }
        }
        const box = best.boundingBox;
        const confidence = Math.round((best.categories?.[0]?.score ?? 0.9) * 100);
        return {
          faceBox: {
            x: Math.round(box.originX),
            y: Math.round(box.originY),
            width: Math.round(box.width),
            height: Math.round(box.height),
            confidence,
          },
          reason: 'ok',
          confidence,
        };
      }
      const fallback = skinBasedFaceDetection(imageData);
      if (fallback.faceBox) {
        logger.info('FaceDetector', 'MediaPipe 未检测到人脸，肤色回退成功');
      }
      return fallback;
    } catch (e) {
      logger.warn('FaceDetector', 'MediaPipe 检测失败，使用回退方案:', e.message);
    }
  }

  return skinBasedFaceDetection(imageData);
}

export default { detectFace };
