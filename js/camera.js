/**
 * 图片加载模块
 * 从文件加载图片并转换为 ImageData
 */

let canvasEl = null;

function init() {
  canvasEl = document.createElement('canvas');
}

function getImageDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1920;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvasEl.width = w;
      canvasEl.height = h;
      const ctx = canvasEl.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(ctx.getImageData(0, 0, w, h));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片加载失败'));
    };
    img.src = objectUrl;
  });
}

function getDataURL() {
  if (!canvasEl) {return null;}
  return canvasEl.toDataURL('image/jpeg', 0.85);
}

export default { init, getImageDataFromFile, getDataURL };
