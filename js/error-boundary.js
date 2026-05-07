/**
 * 全局错误边界
 * 捕获未处理异常，展示友好错误UI
 */
import { el } from './safe-dom.js';
import logger from './logger.js';

let errorView = null;

function init() {
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'SCRIPT') {return;}
    event.preventDefault();
    const message = event.message || '页面发生错误';
    logger.error('ErrorBoundary', '全局错误捕获:', { message, filename: event.filename, lineno: event.lineno });
    showErrorUI(message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    const reason = event.reason;
    const message = (reason && typeof reason === 'object' ? reason.message : String(reason)) || '异步操作失败';
    logger.error('ErrorBoundary', 'Promise拒绝捕获:', { message });
    showErrorUI(message);
  });
}

function showErrorUI(message) {
  if (!errorView) {
    errorView = el('div', {
      className: 'error-overlay',
      role: 'alertdialog',
      'aria-modal': 'true',
      'aria-labelledby': 'error-title',
      'aria-describedby': 'error-desc',
    }, [
      el('div', { className: 'error-icon', textContent: '💔' }),
      el('h2', { className: 'error-title', id: 'error-title', textContent: '哎呀，出错了' }),
      el('p', { className: 'error-message', id: 'error-desc', textContent: message }),
      el('button', {
        className: 'btn-retry',
        textContent: '重新加载',
        onClick: () => location.reload(),
      }),
    ]);
  }

  const descEl = errorView.querySelector('#error-desc');
  if (descEl) {descEl.textContent = message;}

  document.body.appendChild(errorView);
}

export default { init, showErrorUI };
