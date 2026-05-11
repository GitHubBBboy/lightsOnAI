import { el } from './safe-dom.js';
import logger from './logger.js';
import Toast from './toast.js';
import ErrorBoundary from './error-boundary.js';
import FaceDetector from './face-detector.js';
import LightingAnalyzer from './lighting-analyzer.js';
import SuggestionEngine from './suggestion-engine.js';
import ImageLoader from './camera.js';
import HistoryModule from './history.js';
import i18n from './i18n.js';

const sections = {
  hero: document.getElementById('section-hero'),
  upload: document.getElementById('section-upload'),
  result: document.getElementById('section-result'),
  history: document.getElementById('section-history'),
};

const elements = {
  fileInput: document.getElementById('file-input'),
  btnUpload: document.getElementById('btn-upload'),
  btnReanalyze: document.getElementById('btn-reanalyze'),
  btnBackResult: document.getElementById('btn-back-result'),
  btnBackHome: document.getElementById('btn-back-home'),
  resultImage: document.getElementById('result-image'),
  issueIcon: document.getElementById('issue-icon'),
  issueLabel: document.getElementById('issue-label'),
  issueDetail: document.getElementById('issue-detail'),
  suggestionList: document.getElementById('suggestion-list'),
  loadingOverlay: document.getElementById('loading-overlay'),
  historyList: document.getElementById('history-list'),
  emptyHistory: document.getElementById('empty-history'),
  retryZone: document.getElementById('retry-zone'),
  btnRetry: document.getElementById('btn-retry'),
  btnNewPhoto: document.getElementById('btn-new-photo'),
  retryText: document.getElementById('retry-text'),
  navLinks: document.querySelectorAll('.nav-link'),
  btnLangSwitch: document.getElementById('btn-lang-switch'),
};

let currentView = 'home';
let currentSuggestions = [];
let isAnalyzing = false;
let cachedImageData = null;
let currentRecordId = null;

function showSection(name) {
  for (const [key, section] of Object.entries(sections)) {
    if (section) {
      section.classList.toggle('hidden', key !== name);
    }
  }
  currentView = name;

  if (elements.navLinks) {
    elements.navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === name);
    });
  }
}

function showLoading(show) {
  if (elements.loadingOverlay) {
    elements.loadingOverlay.classList.toggle('hidden', !show);
  }
}

function showRetryZone(reason) {
  if (elements.retryZone) {
    elements.retryZone.classList.remove('hidden');
  }
  if (elements.btnUpload) {
    elements.btnUpload.classList.add('hidden');
  }
  if (elements.retryText) {
    elements.retryText.textContent =
      reason === 'too_dark' ? i18n.t('retry.tooDark') : i18n.t('retry.suggestion');
  }
}

function hideRetryZone() {
  if (elements.retryZone) {
    elements.retryZone.classList.add('hidden');
  }
  if (elements.btnUpload) {
    elements.btnUpload.classList.remove('hidden');
  }
  cachedImageData = null;
}

async function analyzeImage(imageData) {
  if (isAnalyzing) {
    return;
  }
  isAnalyzing = true;

  showLoading(true);

  try {
    const detectResult = await FaceDetector.detectFace(imageData);

    if (!detectResult.faceBox) {
      logger.warn('App', '未检测到人脸', { reason: detectResult.reason });
      cachedImageData = imageData;
      if (detectResult.reason === 'too_dark') {
        Toast.show(i18n.t('toast.tooDark'), 'warning');
      } else {
        Toast.show(i18n.t('toast.noFace'), 'warning');
      }
      showRetryZone(detectResult.reason);
      showLoading(false);
      isAnalyzing = false;
      return;
    }

    hideRetryZone();

    const faceBox = detectResult.faceBox;

    const analysisResult = await LightingAnalyzer.analyze(imageData, faceBox);

    displayResult(analysisResult.issues, analysisResult.metrics, imageData);

    const thumbnail = ImageLoader.getDataURL();
    const record = {
      thumbnail,
      issues: analysisResult.issues,
      suggestions: currentSuggestions,
    };

    await HistoryModule.add(record);
    currentRecordId = record.id;
    logger.info('App', '分析完成并保存记录');
  } catch (e) {
    logger.error('App', '分析过程出错:', e.message);
    Toast.show(i18n.t('toast.error'), 'error');
  } finally {
    showLoading(false);
    isAnalyzing = false;
  }
}

function displayResult(issues, metrics, imageData) {
  if (!issues || issues.length === 0) {
    return;
  }

  const primaryIssue = issues[0];
  const iconMap = {
    face_dark: '',
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
    elements.issueLabel.textContent = i18n.t('issues.' + primaryIssue.type) || primaryIssue.label || '';
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

  showSection('result');
}

function renderSuggestions(suggestions) {
  if (!elements.suggestionList) {
    return;
  }
  elements.suggestionList.innerHTML = '';

  for (const suggestion of suggestions) {
    const feedbackState = suggestion.feedback || null;
    const isSubmitted = feedbackState !== null;

    const helpfulBtn = el('button', {
      className:
        'btn-feedback helpful' +
        (feedbackState === 'helpful' ? ' active' : '') +
        (isSubmitted && feedbackState !== 'helpful' ? ' submitted' : ''),
      textContent: i18n.t('feedback.helpful'),
      onClick: () => handleFeedback(suggestion, true),
      'aria-label': '这条建议有用',
    });

    const notHelpfulBtn = el('button', {
      className:
        'btn-feedback not-helpful' +
        (feedbackState === 'not_helpful' ? ' active' : '') +
        (isSubmitted && feedbackState !== 'not_helpful' ? ' submitted' : ''),
      textContent: i18n.t('feedback.notHelpful'),
      onClick: () => handleFeedback(suggestion, false),
      'aria-label': '这条建议没用',
    });

    const itemEl = el('div', { className: 'suggestion-item' }, [
      el('span', { className: 'suggestion-text', textContent: suggestion.text }),
      el('div', { className: 'feedback-buttons' }, [helpfulBtn, notHelpfulBtn]),
    ]);
    elements.suggestionList.appendChild(itemEl);
  }
}

async function handleFeedback(suggestion, isHelpful) {
  if (!currentRecordId) {
    return;
  }

  const records = await HistoryModule.getAll();
  const record = records.find((r) => r.id === currentRecordId);
  if (!record) {
    return;
  }

  const idx = record.suggestions.findIndex((s) => s.text === suggestion.text);

  if (idx >= 0) {
    await HistoryModule.updateFeedback(currentRecordId, idx, isHelpful ? 'helpful' : 'not_helpful');
    suggestion.feedback = isHelpful ? 'helpful' : 'not_helpful';
    renderSuggestions(currentSuggestions);
    Toast.show(isHelpful ? i18n.t('toast.thanks') : i18n.t('toast.improve'), 'success');
    logger.info('App', '用户反馈已记录', { suggestion: suggestion.text, isHelpful });
  }
}

async function loadHistory() {
  const records = await HistoryModule.getAll();

  if (!records.length) {
    if (elements.historyList) {
      elements.historyList.classList.add('hidden');
    }
    if (elements.emptyHistory) {
      elements.emptyHistory.classList.remove('hidden');
    }
    return;
  }

  if (elements.emptyHistory) {
    elements.emptyHistory.classList.add('hidden');
  }
  if (elements.historyList) {
    elements.historyList.classList.remove('hidden');
  }
  if (elements.historyList) {
    elements.historyList.innerHTML = '';
  }

  for (const record of records) {
    const issueLabels = record.issues.map((i) => i18n.t('issues.' + i.type) || i.label).filter(Boolean);
    const children = [
      el('img', {
        className: 'history-thumb',
        src: record.thumbnail,
        alt: '历史记录缩略图',
      }),
      el('div', { className: 'history-info' }, [
        el('span', {
          className: 'history-issues',
          textContent: issueLabels.join(', ') || i18n.t('history.goodLight'),
        }),
        el('span', {
          className: 'history-time',
          textContent: HistoryModule.formatTime(record.timestamp),
        }),
      ]),
      el('button', {
        className: 'btn-delete-history',
        textContent: i18n.t('history.btnDelete'),
        onClick: async () => {
          await HistoryModule.remove(record.id);
          loadHistory();
          Toast.show(i18n.t('toast.deleted'), 'info');
        },
        'aria-label': '删除此条历史记录',
      }),
    ];

    const itemEl = el('div', { className: 'history-item' }, children);

    if (elements.historyList) {
      elements.historyList.appendChild(itemEl);
    }
  }
}

function switchLanguage() {
  const currentLang = i18n.getLang();
  const newLang = currentLang === 'zh' ? 'en' : 'zh';
  i18n.setLang(newLang);
  i18n.updateAllText();
  renderSuggestions(currentSuggestions);
  loadHistory();
  logger.info('App', '语言切换', { from: currentLang, to: newLang });
}

function initEventListeners() {
  if (elements.btnUpload) {
    elements.btnUpload.addEventListener('click', () => {
      if (elements.fileInput) {
        elements.fileInput.click();
      }
    });
  }

  if (elements.fileInput) {
    elements.fileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        hideRetryZone();
        try {
          const imageData = await ImageLoader.getImageDataFromFile(file);
          await analyzeImage(imageData);
        } catch (err) {
          logger.error('App', '图片加载失败:', err.message);
          Toast.show(i18n.t('toast.loadError'), 'error');
        }
      }
      e.target.value = '';
    });
  }

  if (elements.navLinks) {
    elements.navLinks.forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const nav = link.dataset.nav;
        if (nav === 'home') {
          showSection('home');
        } else if (nav === 'history') {
          await loadHistory();
          showSection('history');
        }
      });
    });
  }

  if (elements.btnBackResult) {
    elements.btnBackResult.addEventListener('click', () => {
      currentRecordId = null;
      showSection('home');
    });
  }

  if (elements.btnBackHome) {
    elements.btnBackHome.addEventListener('click', () => showSection('home'));
  }

  if (elements.btnReanalyze) {
    elements.btnReanalyze.addEventListener('click', () => {
      currentRecordId = null;
      showSection('home');
    });
  }

  if (elements.btnRetry) {
    elements.btnRetry.addEventListener('click', async () => {
      if (cachedImageData && !isAnalyzing) {
        await analyzeImage(cachedImageData);
      }
    });
  }

  if (elements.btnNewPhoto) {
    elements.btnNewPhoto.addEventListener('click', () => {
      hideRetryZone();
      if (elements.fileInput) {
        elements.fileInput.click();
      }
    });
  }

  if (elements.btnLangSwitch) {
    elements.btnLangSwitch.addEventListener('click', switchLanguage);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (currentView !== 'home') {
        showSection('home');
      }
    }
  });

  logger.info('App', '事件监听器初始化完成');
}

async function init() {
  ErrorBoundary.init();
  Toast.init();

  i18n.init();
  i18n.updateAllText();

  ImageLoader.init();

  initEventListeners();

  logger.info('App', '应用初始化完成');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
