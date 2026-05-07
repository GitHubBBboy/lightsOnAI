/**
 * 应用主控制器
 * 协调各模块完成上传→分析→建议的完整流程
 */
import { el } from './safe-dom.js';
import logger from './logger.js';
import Toast from './toast.js';
import ErrorBoundary from './error-boundary.js';
import FaceDetector from './face-detector.js';
import LightingAnalyzer from './lighting-analyzer.js';
import SuggestionEngine from './suggestion-engine.js';
import ImageLoader from './camera.js';
import HistoryModule from './history.js';

const views = {
  upload: document.getElementById('view-upload'),
  result: document.getElementById('view-result'),
  history: document.getElementById('view-history'),
};

const elements = {
  fileInput: document.getElementById('file-input'),
  btnUpload: document.getElementById('btn-upload'),
  btnHistory: document.getElementById('btn-history'),
  btnBackHistory: document.getElementById('btn-back-history'),
  btnReanalyze: document.getElementById('btn-reanalyze'),
  resultImage: document.getElementById('result-image'),
  issueIcon: document.getElementById('issue-icon'),
  issueLabel: document.getElementById('issue-label'),
  issueDetail: document.getElementById('issue-detail'),
  suggestionList: document.getElementById('suggestion-list'),
  loadingOverlay: document.getElementById('loading-overlay'),
  historyList: document.getElementById('history-list'),
  emptyHistory: document.getElementById('empty-history'),
};

let currentView = 'upload';
let currentSuggestions = [];
let isAnalyzing = false;

function switchView(viewName) {
  for (const [name, viewEl] of Object.entries(views)) {
    if (viewEl) {
      viewEl.classList.toggle('hidden', name !== viewName);
    }
  }
  currentView = viewName;
}

function showLoading(show) {
  if (elements.loadingOverlay) {
    elements.loadingOverlay.classList.toggle('hidden', !show);
  }
}

async function analyzeImage(imageData) {
  if (isAnalyzing) {return;}
  isAnalyzing = true;

  showLoading(true);

  try {
    const faceBox = await FaceDetector.detectFace(imageData);

    if (!faceBox) {
      logger.warn('App', '未检测到人脸');
      Toast.show('没找到人脸，请上传一张包含人脸的照片哦', 'warning');
      showLoading(false);
      isAnalyzing = false;
      return;
    }

    const analysisResult = await LightingAnalyzer.analyze(imageData, faceBox);

    displayResult(analysisResult.issues, analysisResult.metrics, imageData);

    const thumbnail = ImageLoader.getDataURL();
    const record = {
      thumbnail,
      issues: analysisResult.issues,
      suggestions: currentSuggestions,
    };

    await HistoryModule.add(record);
    logger.info('App', '分析完成并保存记录');

  } catch (e) {
    logger.error('App', '分析过程出错:', e.message);
    Toast.show('分析出错了，请重试', 'error');
  } finally {
    showLoading(false);
    isAnalyzing = false;
  }
}

function displayResult(issues, metrics, imageData) {
  if (!issues || issues.length === 0) {return;}

  const primaryIssue = issues[0];
  const iconMap = {
    face_dark: '🌑',
    asymmetry: '🌓',
    top_light: '💡',
    low_light: '🔦',
    good: '✨',
  };

  if (elements.issueIcon) {
    elements.issueIcon.textContent = iconMap[primaryIssue.type] || '🔍';
    elements.issueIcon.className = 'issue-icon';
    if (primaryIssue.severity) {
      elements.issueIcon.classList.add('severity-' + primaryIssue.severity);
    }
  }

  if (elements.issueLabel) {
    elements.issueLabel.textContent = primaryIssue.label || '';
    elements.issueLabel.className = 'issue-label';
    if (primaryIssue.severity) {
      elements.issueLabel.classList.add('severity-' + primaryIssue.severity);
    }
  }

  if (elements.issueDetail) {
    elements.issueDetail.textContent = primaryIssue.detail || '';
  }

  currentSuggestions = SuggestionEngine.generate(issues);

  renderSuggestions(currentSuggestions);

  if (elements.resultImage && imageData instanceof ImageData) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
    elements.resultImage.src = tempCanvas.toDataURL('image/jpeg', 0.8);
  }

  switchView('result');
}

function renderSuggestions(suggestions) {
  if (!elements.suggestionList) {return;}
  elements.suggestionList.innerHTML = '';

  for (const suggestion of suggestions) {
    const itemEl = el('div', { className: 'suggestion-item' }, [
      el('span', { className: 'suggestion-text', textContent: suggestion.text }),
      el('div', { className: 'feedback-buttons' }, [
        el('button', {
          className: 'btn-feedback helpful',
          textContent: '有用 👍',
          onClick: () => handleFeedback(suggestion, true),
          'aria-label': '这条建议有用',
        }),
        el('button', {
          className: 'btn-feedback not-helpful',
          textContent: '没用 👎',
          onClick: () => handleFeedback(suggestion, false),
          'aria-label': '这条建议没用',
        }),
      ]),
    ]);
    elements.suggestionList.appendChild(itemEl);
  }
}

async function handleFeedback(suggestion, isHelpful) {
  const records = await HistoryModule.getAll();
  const lastRecord = records[0];
  if (!lastRecord) {return;}

  const idx = lastRecord.suggestions.findIndex(
    s => s.text === suggestion.text
  );

  if (idx >= 0) {
    await HistoryModule.updateFeedback(lastRecord.id, idx, isHelpful ? 'helpful' : 'not_helpful');
    Toast.show(isHelpful ? '感谢反馈～' : '我们会改进的', 'success');
    logger.info('App', '用户反馈已记录', { suggestion: suggestion.text, isHelpful });
  }
}

async function loadHistory() {
  const records = await HistoryModule.getAll();

  if (!records.length) {
    if (elements.historyList) {elements.historyList.classList.add('hidden');}
    if (elements.emptyHistory) {elements.emptyHistory.classList.remove('hidden');}
    return;
  }

  if (elements.emptyHistory) {elements.emptyHistory.classList.add('hidden');}
  if (elements.historyList) {elements.historyList.classList.remove('hidden');}
  if (elements.historyList) {elements.historyList.innerHTML = '';}

  for (const record of records) {
    const itemEl = el('div', { className: 'history-item' }, [
      el('img', {
        className: 'history-thumb',
        src: record.thumbnail,
        alt: '历史记录缩略图',
      }),
      el('div', { className: 'history-info' }, [
        el('span', {
          className: 'history-issues',
          textContent: record.issues.map(i => i.label).join(', ') || '光线良好',
        }),
        el('span', {
          className: 'history-time',
          textContent: HistoryModule.formatTime(record.timestamp),
        }),
      ]),
      el('button', {
        className: 'btn-delete-history',
        textContent: '删除',
        onClick: async () => {
          await HistoryModule.remove(record.id);
          loadHistory();
          Toast.show('记录已删除', 'info');
        },
        'aria-label': '删除此条历史记录',
      }),
    ]);

    if (elements.historyList) {
      elements.historyList.appendChild(itemEl);
    }
  }
}

function initEventListeners() {
  if (elements.btnUpload) {
    elements.btnUpload.addEventListener('click', () => {
      if (elements.fileInput) {elements.fileInput.click();}
    });
  }

  if (elements.fileInput) {
    elements.fileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        try {
          const imageData = await ImageLoader.getImageDataFromFile(file);
          await analyzeImage(imageData);
        } catch (err) {
          logger.error('App', '图片加载失败:', err.message);
          Toast.show('图片加载失败，请重试', 'error');
        }
      }
      e.target.value = '';
    });
  }

  if (elements.btnHistory) {
    elements.btnHistory.addEventListener('click', async () => {
      await loadHistory();
      switchView('history');
    });
  }

  if (elements.btnBackHistory) {
    elements.btnBackHistory.addEventListener('click', () => switchView('upload'));
  }

  if (elements.btnReanalyze) {
    elements.btnReanalyze.addEventListener('click', () => switchView('upload'));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (currentView !== 'upload') {
        switchView('upload');
      }
    }
  });

  logger.info('App', '事件监听器初始化完成');
}

async function init() {
  ErrorBoundary.init();
  Toast.init();

  ImageLoader.init();

  initEventListeners();

  logger.info('App', '应用初始化完成');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
