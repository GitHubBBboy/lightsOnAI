/**
 * 人脸检测模块
 * 优先使用 MediaPipe Face Detector，回退到肤色检测
 */
import logger from './logger.js';

let mpFaceDetector = null;
let mpLoaded = false;
let mpLoadFailed = false;

async function initMediaPipe() {
  if (mpLoaded || mpLoadFailed) {return;}
  try {
    const { FaceDetector, FilesetResolver } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm/vision_bundle.mjs'
    );
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
  } catch (e) {
    logger.warn('FaceDetector', 'MediaPipe 加载失败，使用回退方案:', e.message);
    mpLoadFailed = true;
  }
}

function rgbToYCbCr(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return { y, cb, cr };
}

function isSkinPixel(r, g, b) {
  const { cb, cr } = rgbToYCbCr(r, g, b);
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
}

function skinBasedFaceDetection(imageData) {
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

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let skinCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (skinMask[y * width + x]) {
        skinCount++;
        if (x < minX) {minX = x;}
        if (x > maxX) {maxX = x;}
        if (y < minY) {minY = y;}
        if (y > maxY) {maxY = y;}
      }
    }
  }

  const totalPixels = width * height;
  const skinRatio = skinCount / totalPixels;

  if (skinRatio < 0.03 || skinRatio > 0.6) {
    return null;
  }

  const boxW = maxX - minX;
  const boxH = maxY - minY;

  if (boxW < 30 || boxH < 30 || boxW > width * 0.8 || boxH > height * 0.8) {
    return null;
  }

  const aspectRatio = boxW / boxH;
  if (aspectRatio < 0.3 || aspectRatio > 2.5) {
    return null;
  }

  const paddingX = boxW * 0.2;
  const paddingY = boxH * 0.3;

  return {
    x: Math.max(0, minX - paddingX),
    y: Math.max(0, minY - paddingY),
    width: Math.min(width - minX + paddingX, boxW + paddingX * 2),
    height: Math.min(height - minY + paddingY, boxH + paddingY * 2),
  };
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
        return {
          x: Math.round(box.originX),
          y: Math.round(box.originY),
          width: Math.round(box.width),
          height: Math.round(box.height),
        };
      }
    } catch (e) {
      logger.warn('FaceDetector', 'MediaPipe 检测失败:', e.message);
    }
  }

  return skinBasedFaceDetection(imageData);
}

export default { detectFace };
