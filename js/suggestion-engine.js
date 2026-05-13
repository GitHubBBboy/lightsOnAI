import i18n from './i18n.js';
import suggestionDatabase from './suggestion-database.js';

function calculateParams(suggestion, metrics) {
  if (!suggestion.params) {
    return null;
  }

  const params = JSON.parse(JSON.stringify(suggestion.params));

  if (metrics && metrics.brightnessDiff) {
    const intensity = Math.min(1, metrics.brightnessDiff / 100);
    if (params.intensity === null || params.intensity === undefined) {
      params.intensity = intensity;
    }

    if (params.position && params.position.distance === null) {
      if (intensity > 0.7) {
        params.position.distance = { zh: '0.5-1米', en: '0.5-1m' };
      } else if (intensity > 0.4) {
        params.position.distance = { zh: '1-1.5米', en: '1-1.5m' };
      } else {
        params.position.distance = { zh: '1.5-2米', en: '1.5-2m' };
      }
    }
  }

  if (metrics && metrics.asymmetry && params.position) {
    const angle = Math.round(metrics.asymmetry * 45);
    if (params.position.angle === null || params.position.angle === undefined) {
      params.position.angle = angle;
    }
  }

  return params;
}

function detectScenario(imageData, faceBox) {
  const features = {
    scenario: 'selfie',
    confidence: 0.5,
  };

  if (!imageData || !faceBox) {
    return features;
  }

  const faceArea = faceBox.width * faceBox.height;
  const imageArea = imageData.width * imageData.height;
  const faceRatio = faceArea / imageArea;

  if (faceRatio > 0.3) {
    features.scenario = 'selfie';
    features.confidence = 0.7;
  } else if (faceRatio > 0.15) {
    features.scenario = 'portrait';
    features.confidence = 0.6;
  } else {
    features.scenario = 'portrait';
    features.confidence = 0.5;
  }

  const faceCenterX = faceBox.x + faceBox.width / 2;
  const faceCenterY = faceBox.y + faceBox.height / 2;
  const imageCenterX = imageData.width / 2;
  const imageCenterY = imageData.height / 2;

  if (Math.abs(faceCenterX - imageCenterX) < imageData.width * 0.2 && faceCenterY < imageCenterY) {
    features.confidence = Math.min(0.9, features.confidence + 0.2);
  }

  return features;
}

function filterByScenario(suggestions, scenario) {
  return suggestions.filter((s) => {
    if (!s.scenario || s.scenario.length === 0) {
      return true;
    }
    return s.scenario.includes(scenario);
  });
}

function filterByConditions(suggestions, userConditions) {
  return suggestions.filter((s) => {
    if (!s.conditions) {
      return true;
    }

    if (userConditions.indoor !== undefined && s.conditions.indoor !== userConditions.indoor) {
      return false;
    }
    if (userConditions.outdoor !== undefined && s.conditions.outdoor !== userConditions.outdoor) {
      return false;
    }
    if (userConditions.daytime !== undefined && s.conditions.daytime !== userConditions.daytime) {
      return false;
    }
    if (
      userConditions.nighttime !== undefined &&
      s.conditions.nighttime !== userConditions.nighttime
    ) {
      return false;
    }

    return true;
  });
}

function sortByLevel(suggestions, severity) {
  if (severity === 'high') {
    return suggestions.sort((a, b) => b.level - a.level);
  } else {
    return suggestions.sort((a, b) => a.level - b.level);
  }
}

function getLocalizedText(textObj) {
  const lang = i18n.getLang();
  if (typeof textObj === 'string') {
    return textObj;
  }
  return textObj[lang] || textObj['zh'] || '';
}

function getLocalizedArray(arrObj) {
  const lang = i18n.getLang();
  if (Array.isArray(arrObj)) {
    return arrObj;
  }
  return arrObj[lang] || arrObj['zh'] || [];
}

function formatSuggestion(suggestion, metrics) {
  const formatted = {
    id: suggestion.id,
    problemType: suggestion.problemType,
    level: suggestion.level,
    text: getLocalizedText(suggestion.text),
    levelLabel: getLevelLabel(suggestion.level),
    metadata: {
      difficulty: getLocalizedText(
        suggestion.metadata.difficulty === 'easy'
          ? { zh: '简单', en: 'Easy' }
          : suggestion.metadata.difficulty === 'medium'
            ? { zh: '中等', en: 'Medium' }
            : { zh: '困难', en: 'Hard' }
      ),
      cost: getLocalizedText(
        suggestion.metadata.cost === 'free'
          ? { zh: '零成本', en: 'Free' }
          : suggestion.metadata.cost === 'low'
            ? { zh: '低成本', en: 'Low cost' }
            : suggestion.metadata.cost === 'medium'
              ? { zh: '中等成本', en: 'Medium cost' }
              : { zh: '高成本', en: 'High cost' }
      ),
      effectiveness: suggestion.metadata.effectiveness,
      tags: getLocalizedArray(suggestion.metadata.tags),
    },
  };

  if (suggestion.params) {
    formatted.params = {
      position: suggestion.params.position
        ? {
            description: getLocalizedText(suggestion.params.position.description),
            angle: suggestion.params.position.angle,
            distance: suggestion.params.position.distance
              ? getLocalizedText(suggestion.params.position.distance)
              : null,
          }
        : null,
      action: suggestion.params.action
        ? {
            description: getLocalizedText(suggestion.params.action.description),
            steps: getLocalizedArray(suggestion.params.action.steps),
          }
        : null,
      intensity: suggestion.params.intensity,
    };

    const calculatedParams = calculateParams(suggestion, metrics);
    if (calculatedParams) {
      formatted.calculatedParams = {
        position: calculatedParams.position
          ? {
              description: getLocalizedText(calculatedParams.position.description),
              angle: calculatedParams.position.angle,
              distance: calculatedParams.position.distance
                ? getLocalizedText(calculatedParams.position.distance)
                : null,
            }
          : null,
        intensity: calculatedParams.intensity,
      };
    }
  }

  return formatted;
}

function getLevelLabel(level) {
  const labels = {
    1: { zh: '零成本方案', en: 'Free Solution' },
    2: { zh: '低成本方案', en: 'Low Cost Solution' },
    3: { zh: '专业方案', en: 'Professional Solution' },
  };
  const lang = i18n.getLang();
  return labels[level] ? labels[level][lang] : '';
}

function generate(issues, options = {}) {
  const { scenario = 'selfie', userConditions = {} } = options;

  const suggestions = [];

  for (const issue of issues) {
    let candidates = suggestionDatabase[issue.type] || [];

    candidates = filterByScenario(candidates, scenario);
    candidates = filterByConditions(candidates, userConditions);
    candidates = sortByLevel(candidates, issue.severity);

    if (issue.type === 'good') {
      const goodSuggestion = candidates[0];
      if (goodSuggestion) {
        suggestions.push(formatSuggestion(goodSuggestion, issue.metrics));
      }
      break;
    }

    const levelSuggestions = {};
    for (const candidate of candidates) {
      if (!levelSuggestions[candidate.level]) {
        levelSuggestions[candidate.level] = candidate;
      }
      if (Object.keys(levelSuggestions).length >= 3) {
        break;
      }
    }

    for (let level = 1; level <= 3; level++) {
      if (levelSuggestions[level]) {
        const formatted = formatSuggestion(levelSuggestions[level], issue.metrics);
        suggestions.push(formatted);
      }
    }
  }

  return suggestions;
}

function getSuggestionById(suggestionId) {
  for (const problemType in suggestionDatabase) {
    const found = suggestionDatabase[problemType].find((s) => s.id === suggestionId);
    if (found) {
      return found;
    }
  }
  return null;
}

export default {
  generate,
  detectScenario,
  getSuggestionById,
  calculateParams,
};
