/**
 * 光线分析引擎
 * 优先使用 Web Worker，回退到主线程
 */
import logger from './logger.js';

let worker = null;
let workerReady = false;

function getGrayPixel(data, idx) {
  return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
}

function getRegionBrightness(imageData, box) {
  const { data, width } = imageData;
  const x0 = Math.max(0, Math.round(box.x));
  const y0 = Math.max(0, Math.round(box.y));
  const x1 = Math.min(width, Math.round(box.x + box.width));
  const y1 = Math.min(imageData.height, Math.round(box.y + box.height));

  let sum = 0;
  let count = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const idx = (y * width + x) * 4;
      sum += getGrayPixel(data, idx);
      count++;
    }
  }

  return count > 0 ? sum / count / 255 : 0;
}

function analyzeSync(imageData, faceBox) {
  const { width, height } = imageData;
  const issues = [];
  const metrics = {};

  const fx = Math.round(faceBox.x);
  const fy = Math.round(faceBox.y);
  const fw = Math.round(faceBox.width);
  const fh = Math.round(faceBox.height);

  const faceBrightness = getRegionBrightness(imageData, {
    x: fx,
    y: fy,
    width: fw,
    height: fh,
  });
  metrics.faceBrightness = Math.round(faceBrightness * 100);

  const bgBoxes = [
    { x: 0, y: 0, width: width, height: fy },
    { x: 0, y: fy + fh, width: width, height: height - fy - fh },
    { x: 0, y: fy, width: fx, height: fh },
    { x: fx + fw, y: fy, width: width - fx - fw, height: fh },
  ];

  let bgSum = 0;
  let bgCount = 0;
  for (const box of bgBoxes) {
    if (box.width <= 0 || box.height <= 0) {
      continue;
    }
    const b = getRegionBrightness(imageData, box);
    const area = box.width * box.height;
    bgSum += b * area;
    bgCount += area;
  }
  const bgBrightness = bgCount > 0 ? bgSum / bgCount : faceBrightness;
  metrics.backgroundBrightness = Math.round(bgBrightness * 100);

  const leftBox = { x: fx, y: fy, width: fw / 2, height: fh };
  const rightBox = { x: fx + fw / 2, y: fy, width: fw / 2, height: fh };

  const leftBrightness = getRegionBrightness(imageData, leftBox);
  const rightBrightness = getRegionBrightness(imageData, rightBox);
  metrics.leftBrightness = Math.round(leftBrightness * 100);
  metrics.rightBrightness = Math.round(rightBrightness * 100);

  const maxLR = Math.max(leftBrightness, rightBrightness);
  const asymmetry = maxLR > 0 ? Math.abs(leftBrightness - rightBrightness) / maxLR : 0;
  metrics.asymmetry = Math.round(asymmetry * 100);

  const topBox = { x: fx, y: fy, width: fw, height: fh / 3 };
  const midBox = { x: fx, y: fy + fh / 3, width: fw, height: fh / 3 };
  const botBox = { x: fx, y: fy + (2 * fh) / 3, width: fw, height: fh / 3 };

  const topBrightness = getRegionBrightness(imageData, topBox);
  const midBrightness = getRegionBrightness(imageData, midBox);
  const botBrightness = getRegionBrightness(imageData, botBox);
  metrics.topBrightness = Math.round(topBrightness * 100);
  metrics.midBrightness = Math.round(midBrightness * 100);
  metrics.botBrightness = Math.round(botBrightness * 100);

  if (faceBrightness < 0.35 && bgBrightness > faceBrightness + 0.15) {
    issues.push({
      type: 'face_dark',
      label: '脸太暗了',
      severity: bgBrightness - faceBrightness > 0.3 ? 'high' : 'medium',
      detail: '人脸亮度明显低于环境，可能是背光',
    });
  }

  if (asymmetry > 0.25) {
    const darkSide = leftBrightness < rightBrightness ? 'left' : 'right';
    issues.push({
      type: 'asymmetry',
      label: '脸上有阴影',
      severity: asymmetry > 0.4 ? 'high' : 'medium',
      detail: `脸一侧亮一侧暗（${darkSide === 'left' ? '左' : '右'}侧偏暗）`,
      darkSide,
    });
  }

  const topMidRatio = midBrightness > 0 ? topBrightness / midBrightness : 1;
  const botMidRatio = midBrightness > 0 ? botBrightness / midBrightness : 1;

  if (topMidRatio > 1.5 && topMidRatio > botMidRatio) {
    issues.push({
      type: 'top_light',
      label: '光线方向不对',
      severity: 'medium',
      detail: '光线主要来自上方，可能是顶灯',
    });
  }

  if (faceBrightness < 0.2) {
    if (!issues.find((i) => i.type === 'face_dark')) {
      issues.push({
        type: 'low_light',
        label: '光线太暗',
        severity: 'high',
        detail: '整体环境光线不足',
      });
    }
  }

  if (issues.length === 0) {
    issues.push({
      type: 'good',
      label: '光线不错',
      severity: 'none',
      detail: '光线条件良好，直接拍吧',
    });
  }

  issues.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2, none: 3 };
    return (order[a.severity] || 2) - (order[b.severity] || 2);
  });

  return { issues, metrics };
}

function initWorker() {
  try {
    worker = new Worker('./js/lighting-analyzer.worker.js', { type: 'module' });
    worker.onmessage = null;
    worker.onerror = (e) => {
      logger.error('LightingAnalyzer', 'Worker错误', e.message);
      workerReady = false;
      worker = null;
    };
    workerReady = true;
    logger.info('LightingAnalyzer', 'Web Worker 已初始化');
  } catch (e) {
    logger.warn('LightingAnalyzer', 'Web Worker 不可用，使用主线程模式:', e.message);
    workerReady = false;
    worker = null;
  }
}

async function analyze(imageData, faceBox) {
  if (!worker || !workerReady) {
    initWorker();
  }

  if (worker && workerReady) {
    try {
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Worker超时'));
        }, 5000);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          if (e.data.error) {
            reject(new Error(e.data.error));
          } else {
            resolve(e.data.result);
          }
        };

        worker.postMessage({ id: Date.now(), imageData, faceBox });
      });

      logger.info('LightingAnalyzer', 'Worker 分析完成');
      return result;
    } catch (err) {
      logger.warn('LightingAnalyzer', 'Worker失败，回退主线程:', err.message);
      workerReady = false;
    }
  }

  return analyzeSync(imageData, faceBox);
}

export default { analyze };
