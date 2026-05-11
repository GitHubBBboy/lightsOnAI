/**
 * Toast 通知组件
 * 替代 alert()，提供更好的用户体验
 */
import { el } from './safe-dom.js';
import logger from './logger.js';

let container = null;
let timer = null;

function init() {
  if (container) {
    return;
  }
  container = el('div', { id: 'toast-container', 'aria-live': 'polite' });
  document.body.appendChild(container);
}

function show(message, type = 'info', duration = 3000) {
  if (!container) {
    init();
  }

  if (timer) {
    clearTimeout(timer);
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  const toastEl = el(
    'div',
    {
      className: `toast toast-${type}`,
      role: 'status',
      textContent: '',
    },
    [
      el('span', { className: 'toast-icon', textContent: icons[type] || '' }),
      el('span', { className: 'toast-message', textContent: message }),
    ]
  );

  container.appendChild(toastEl);

  requestAnimationFrame(() => {
    toastEl.classList.add('toast-show');
  });

  logger.debug('Toast', '显示通知', { type, message });

  timer = setTimeout(() => dismissToast(toastEl), duration);
}

function dismissToast(toastEl) {
  if (!toastEl || !toastEl.parentNode) {
    return;
  }
  toastEl.classList.remove('toast-show');
  toastEl.classList.add('toast-hide');
  setTimeout(() => {
    if (toastEl.parentNode) {
      toastEl.parentNode.removeChild(toastEl);
    }
  }, 300);
}

export default { show, init };
