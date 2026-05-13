const translations = {
  zh: {
    nav: {
      home: '首页',
      history: '历史记录',
      about: '关于',
    },
    brand: {
      name: 'LightsOn',
    },
    hero: {
      badge: 'AI 驱动 · 智能分析',
      title: '用 AI 分析照片',
      titleAccent: '光线问题与补光建议',
      desc: '为摄影爱好者、自媒体创作者提供智能化的光线诊断与补光指导，让每一张照片都完美。',
    },
    upload: {
      title: '上传照片开始分析',
      subtitle: '支持 JPG、PNG、HEIC 格式',
      btnSelect: '选择照片',
      hint: '点击或拖拽照片到此处',
    },
    result: {
      title: '分析结果',
      btnBack: '← 返回',
      suggestionsHeading: '💡 补光建议',
      btnReanalyze: '重新分析',
    },
    retry: {
      tooDark: '照片太暗了，试试在明亮环境下重拍',
      suggestion: '换个角度或光线再试试？',
      btnRetry: '🔄 重试',
      btnNewPhoto: '换一张照片',
    },
    history: {
      title: '历史记录',
      btnBack: '← 返回首页',
      emptyIcon: '📸',
      emptyText: '还没有分析记录，快去上传一张照片吧',
      btnDelete: '删除',
      goodLight: '光线良好',
    },
    loading: {
      text: '正在分析光线...',
    },
    footer: 'LightsOn v0.0.2 · AI 驱动的照片光线分析工具',
    toast: {
      tooDark: '照片太暗了，请在明亮环境下拍摄后重试',
      noFace: '未检测到人脸，请上传一张包含人脸的照片哦',
      error: '分析出错了，请重试',
      loadError: '图片加载失败，请重试',
      thanks: '感谢反馈～',
      improve: '我们会改进的',
      deleted: '记录已删除',
    },
    feedback: {
      helpful: '有用 👍',
      notHelpful: '没用 👎',
      satisfactionQuestion: '这次分析准吗？',
      accurate: '准确',
      ok: '一般',
      inaccurate: '不准',
      thanks: '感谢反馈！❤️',
      thanksToast: '感谢反馈！',
      improveToast: '我们会改进的',
      reasonTitle: '哪里不准？',
      reasonSubtitle: '帮我们改进分析效果（可多选）',
      reasonLighting: '光线问题判断不对',
      reasonSuggestion: '建议不实用',
      reasonFace: '人脸没检测到',
      reasonOther: '其他',
      skip: '跳过',
      confirm: '确认',
      export: '📤 导出',
      exportSuccess: '导出成功',
      exportFail: '导出失败',
      statTotal: '总分析',
      statGood: '满意',
      statOk: '一般',
      statBad: '不满意',
      topSuggestion: '最受欢迎建议：',
    },
    issues: {
      face_dark: '面部光线不足',
      asymmetry: '光线不均匀',
      top_light: '顶光过强',
      low_light: '整体光线偏暗',
      good: '光线良好',
    },
    suggestions: {
      face_dark: [
        '尝试面向光源，让光线直接照射到面部',
        '使用反光板或白色物体反射光线到面部阴影区域',
        '在室内拍摄时，靠近窗户利用自然光',
      ],
      asymmetry: [
        '调整角度，让光线从侧面45度照射',
        '使用补光灯填充阴影一侧',
        '尝试转动身体，让光线更均匀地分布在面部',
      ],
      top_light: [
        '避免在正午阳光下拍摄',
        '寻找树荫或建筑阴影处拍摄',
        '使用帽子或遮阳物柔化顶部光线',
      ],
      low_light: ['移至更明亮的环境', '使用外置补光灯或闪光灯', '提高相机ISO感光度（注意噪点）'],
      good: ['当前光线条件良好，继续保持！'],
    },
    lang: {
      switch: 'EN',
    },
  },
  en: {
    nav: {
      home: 'Home',
      history: 'History',
      about: 'About',
    },
    brand: {
      name: 'LightsOn',
    },
    hero: {
      badge: 'AI Powered · Smart Analysis',
      title: 'Analyze Photos with AI',
      titleAccent: 'Lighting Issues & Fill Light Tips',
      desc: 'Intelligent lighting diagnosis and fill light guidance for photography enthusiasts and content creators.',
    },
    upload: {
      title: 'Upload Photo to Analyze',
      subtitle: 'Supports JPG, PNG, HEIC formats',
      btnSelect: 'Select Photo',
      hint: 'Click or drag photo here',
    },
    result: {
      title: 'Analysis Result',
      btnBack: '← Back',
      suggestionsHeading: '💡 Fill Light Suggestions',
      btnReanalyze: 'Reanalyze',
    },
    retry: {
      tooDark: 'Photo is too dark, try shooting in a brighter environment',
      suggestion: 'Try a different angle or lighting?',
      btnRetry: '🔄 Retry',
      btnNewPhoto: 'New Photo',
    },
    history: {
      title: 'History',
      btnBack: '← Back to Home',
      emptyIcon: '📸',
      emptyText: 'No analysis records yet, upload a photo to get started',
      btnDelete: 'Delete',
      goodLight: 'Good Lighting',
    },
    loading: {
      text: 'Analyzing lighting...',
    },
    footer: 'LightsOn v0.0.2 · AI-Powered Photo Lighting Analysis Tool',
    toast: {
      tooDark: 'Photo is too dark, please shoot in a brighter environment',
      noFace: 'No face detected, please upload a photo with a face',
      error: 'Analysis error, please try again',
      loadError: 'Image load failed, please try again',
      thanks: 'Thanks for feedback!',
      improve: 'We will improve',
      deleted: 'Record deleted',
    },
    feedback: {
      helpful: 'Helpful 👍',
      notHelpful: 'Not helpful 👎',
      satisfactionQuestion: 'Was this analysis accurate?',
      accurate: 'Accurate',
      ok: 'OK',
      inaccurate: 'Inaccurate',
      thanks: 'Thanks for feedback! ❤️',
      thanksToast: 'Thanks for feedback!',
      improveToast: 'We will improve',
      reasonTitle: 'What was wrong?',
      reasonSubtitle: 'Help us improve (multiple choice)',
      reasonLighting: 'Lighting issue misjudged',
      reasonSuggestion: 'Suggestions not useful',
      reasonFace: 'Face not detected',
      reasonOther: 'Other',
      skip: 'Skip',
      confirm: 'Confirm',
      export: '📤 Export',
      exportSuccess: 'Export successful',
      exportFail: 'Export failed',
      statTotal: 'Total',
      statGood: 'Satisfied',
      statOk: 'OK',
      statBad: 'Unsatisfied',
      topSuggestion: 'Top suggestion: ',
    },
    issues: {
      face_dark: 'Insufficient face lighting',
      asymmetry: 'Uneven lighting',
      top_light: 'Strong overhead light',
      low_light: 'Overall low light',
      good: 'Good lighting',
    },
    suggestions: {
      face_dark: [
        'Face the light source to let light directly illuminate your face',
        'Use a reflector or white object to bounce light onto shadowed areas',
        'When shooting indoors, move closer to windows for natural light',
      ],
      asymmetry: [
        'Adjust angle to let light hit from 45 degrees to the side',
        'Use a fill light to illuminate the shadowed side',
        'Try rotating your body for more even light distribution',
      ],
      top_light: [
        'Avoid shooting in direct noon sunlight',
        'Find shade under trees or buildings',
        'Use a hat or sunshade to soften overhead light',
      ],
      low_light: [
        'Move to a brighter environment',
        'Use external fill light or flash',
        'Increase camera ISO (watch for noise)',
      ],
      good: ['Current lighting is good, keep it up!'],
    },
    lang: {
      switch: '中文',
    },
  },
};

let currentLang = 'zh';

function init() {
  const saved = localStorage.getItem('lightson_lang');
  if (saved && (saved === 'zh' || saved === 'en')) {
    currentLang = saved;
  }
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

function getLang() {
  return currentLang;
}

function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') {
    return;
  }
  currentLang = lang;
  localStorage.setItem('lightson_lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

function updateAllText() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text && text !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    }
  });

  const elementsHtml = document.querySelectorAll('[data-i18n-html]');
  elementsHtml.forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const text = t(key);
    if (text && text !== key) {
      el.innerHTML = text;
    }
  });
}

const i18n = {
  init,
  getLang,
  setLang,
  t,
  updateAllText,
};

export default i18n;
