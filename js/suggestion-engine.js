/**
 * 建议规则引擎
 * 根据光线问题生成可执行建议
 */
const rules = {
  face_dark: [
    { text: '脸转向亮的方向', action: 'turn_to_light' },
    { text: '往前走两步，靠近光源', action: 'move_forward' },
    { text: '换个位置，让光照到脸上', action: 'change_position' },
  ],
  asymmetry: {
    left: [
      { text: '脸转向右边亮的那一侧', action: 'turn_right' },
      { text: '身体向右转一点', action: 'rotate_right' },
      { text: '换个位置，让光从正面来', action: 'change_position' },
    ],
    right: [
      { text: '脸转向左边亮的那一侧', action: 'turn_left' },
      { text: '身体向左转一点', action: 'rotate_left' },
      { text: '换个位置，让光从正面来', action: 'change_position' },
    ],
  },
  top_light: [
    { text: '换个位置，避开头顶灯光', action: 'avoid_top_light' },
    { text: '走到窗边，用自然光', action: 'use_window_light' },
    { text: '稍微低头，减少顶光阴影', action: 'tilt_head' },
  ],
  low_light: [
    { text: '打开房间的灯', action: 'turn_on_light' },
    { text: '走到更亮的地方拍', action: 'move_to_bright' },
    { text: '靠近窗户用自然光', action: 'use_window_light' },
  ],
  good: [
    { text: '光线很棒！直接拍就很好看～', action: 'none' },
  ],
};

function generate(issues) {
  const suggestions = [];

  for (const issue of issues) {
    if (issue.type === 'good') {
      suggestions.push(...rules.good);
      break;
    }

    let issueRules;
    if (issue.type === 'asymmetry') {
      issueRules = rules.asymmetry[issue.darkSide] || rules.asymmetry.right;
    } else {
      issueRules = rules[issue.type] || [];
    }

    for (const rule of issueRules) {
      if (!suggestions.find(s => s.text === rule.text)) {
        suggestions.push({ ...rule, issueType: issue.type });
      }
    }
  }

  return suggestions.slice(0, 3);
}

export default { generate };
