import i18n from './i18n.js';

const rules = {
  face_dark: [
    { action: 'turn_to_light', i18nKey: 'face_dark', index: 0 },
    { action: 'move_forward', i18nKey: 'face_dark', index: 1 },
    { action: 'change_position', i18nKey: 'face_dark', index: 2 },
  ],
  asymmetry: {
    left: [
      { action: 'turn_right', i18nKey: 'asymmetry', index: 0 },
      { action: 'rotate_right', i18nKey: 'asymmetry', index: 1 },
      { action: 'change_position', i18nKey: 'asymmetry', index: 2 },
    ],
    right: [
      { action: 'turn_left', i18nKey: 'asymmetry', index: 0 },
      { action: 'rotate_left', i18nKey: 'asymmetry', index: 1 },
      { action: 'change_position', i18nKey: 'asymmetry', index: 2 },
    ],
  },
  top_light: [
    { action: 'avoid_top_light', i18nKey: 'top_light', index: 0 },
    { action: 'use_window_light', i18nKey: 'top_light', index: 1 },
    { action: 'tilt_head', i18nKey: 'top_light', index: 2 },
  ],
  low_light: [
    { action: 'turn_on_light', i18nKey: 'low_light', index: 0 },
    { action: 'move_to_bright', i18nKey: 'low_light', index: 1 },
    { action: 'use_window_light', i18nKey: 'low_light', index: 2 },
  ],
  good: [{ action: 'none', i18nKey: 'good', index: 0 }],
};

function getSuggestionText(i18nKey, index) {
  const suggestions = i18n.t('suggestions.' + i18nKey);
  if (Array.isArray(suggestions)) {
    return suggestions[index] || '';
  }
  return '';
}

function generate(issues) {
  const suggestions = [];

  for (const issue of issues) {
    if (issue.type === 'good') {
      const goodRules = rules.good;
      for (const rule of goodRules) {
        const text = getSuggestionText(rule.i18nKey, rule.index);
        if (text) {
          suggestions.push({ text, action: rule.action, issueType: issue.type });
        }
      }
      break;
    }

    let issueRules;
    if (issue.type === 'asymmetry') {
      issueRules = rules.asymmetry[issue.darkSide] || rules.asymmetry.right;
    } else {
      issueRules = rules[issue.type] || [];
    }

    for (const rule of issueRules) {
      const text = getSuggestionText(rule.i18nKey, rule.index);
      if (text && !suggestions.find((s) => s.text === text)) {
        suggestions.push({ text, action: rule.action, issueType: issue.type });
      }
    }
  }

  return suggestions.slice(0, 3);
}

export default { generate };
