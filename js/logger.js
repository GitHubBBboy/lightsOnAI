/**
 * 结构化日志系统
 * 统一日志格式，支持级别过滤和上下文
 */
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLevel = LOG_LEVELS.DEBUG;
let logBuffer = [];

function setLevel(level) {
  const key = level.toUpperCase();
  if (LOG_LEVELS[key] !== undefined) {
    currentLevel = LOG_LEVELS[key];
  }
}

function formatMessage(level, context, message, data) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    context,
    message,
    data: data || null,
  };

  logBuffer.push(entry);
  if (logBuffer.length > 200) {
    logBuffer = logBuffer.slice(-100);
  }

  return entry;
}

function output(entry) {
  const prefix = `[${entry.timestamp}] [${entry.level.padEnd(5)}] [${entry.context}]`;
  const args = [prefix, entry.message];
  if (entry.data) {
    args.push(entry.data);
  }

  switch (entry.level) {
    case 'DEBUG':
      console.debug(...args);
      break;
    case 'INFO':
      console.info(...args);
      break;
    case 'WARN':
      console.warn(...args);
      break;
    case 'ERROR':
      console.error(...args);
      break;
    default:
      break;
  }
}

function debug(context, message, data) {
  if (currentLevel <= LOG_LEVELS.DEBUG) {
    output(formatMessage('DEBUG', context, message, data));
  }
}

function info(context, message, data) {
  if (currentLevel <= LOG_LEVELS.INFO) {
    output(formatMessage('INFO', context, message, data));
  }
}

function warn(context, message, data) {
  if (currentLevel <= LOG_LEVELS.WARN) {
    output(formatMessage('WARN', context, message, data));
  }
}

function error(context, message, data) {
  if (currentLevel <= LOG_LEVELS.ERROR) {
    output(formatMessage('ERROR', context, message, data));
  }
}

function getRecent(count = 20) {
  return logBuffer.slice(-count);
}

export default { debug, info, warn, error, setLevel, getRecent };
