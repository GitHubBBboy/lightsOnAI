/**
 * IndexedDB 历史记录存储
 * 替代 LocalStorage，支持大容量图片存储
 */
import logger from './logger.js';

const DB_NAME = 'aibuguang_db';
const DB_VERSION = 2;
const STORE_NAME = 'history';
const MAX_RECORDS = 50;

let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        logger.info('HistoryDB', 'IndexedDB 创建成功');
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbInstance.onversionchange = () => {
        dbInstance.close();
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onerror = () => {
      logger.error('HistoryDB', 'IndexedDB 打开失败:', request.error?.message);
      reject(new Error('IndexedDB 不可用'));
    };
  });
}

async function getAll() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    logger.warn('HistoryDB', 'getAll 失败，尝试LocalStorage回退:', e.message);
    return fallbackGetAll();
  }
}

async function add(record) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const newRecord = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: Date.now(),
        thumbnail: record.thumbnail,
        issues: record.issues.map((i) => ({ type: i.type, label: i.label })),
        suggestions: record.suggestions.map((s) => ({
          text: s.text,
          feedback: null,
        })),
      };

      const request = store.add(newRecord);

      request.onsuccess = async () => {
        await enforceLimit(db);
        resolve(newRecord);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    logger.warn('HistoryDB', 'add 失败:', e.message);
    return fallbackAdd(record);
  }
}

async function updateFeedback(recordId, suggestionIndex, feedback) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(recordId);

      request.onsuccess = () => {
        const record = request.result;
        if (record && record.suggestions[suggestionIndex]) {
          record.suggestions[suggestionIndex].feedback = feedback;
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve(true);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    logger.warn('HistoryDB', 'updateFeedback 失败:', e.message);
    return false;
  }
}

async function remove(recordId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(recordId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    logger.warn('HistoryDB', 'remove 失败:', e.message);
    return false;
  }
}

async function enforceLimit(db) {
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');

    const countRequest = index.count();
    countRequest.onsuccess = () => {
      if (countRequest.result > MAX_RECORDS) {
        const getAllRequest = index.getAll();
        getAllRequest.onsuccess = () => {
          const records = getAllRequest.result || [];
          const toDelete = records.slice(MAX_RECORDS);
          for (const rec of toDelete) {
            store.delete(rec.id);
          }
          logger.info('HistoryDB', `清理了 ${toDelete.length} 条旧记录`);
        };
      }
      resolve();
    };
    countRequest.onerror = () => resolve();
  });
}

const FALLBACK_KEY = 'aibuguang_history_fallback';

function fallbackGetAll() {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function fallbackAdd(record) {
  try {
    const records = fallbackGetAll();
    records.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      thumbnail: record.thumbnail,
      issues: record.issues.map((i) => ({ type: i.type, label: i.label })),
      suggestions: record.suggestions.map((s) => ({
        text: s.text,
        feedback: null,
      })),
    });

    if (records.length > MAX_RECORDS) {
      records.length = MAX_RECORDS;
    }

    localStorage.setItem(FALLBACK_KEY, JSON.stringify(records));
    return records[0];
  } catch {
    return null;
  }
}

async function updateOverallFeedback(recordId, feedback) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(recordId);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          record.overallFeedback = {
            rating: feedback.rating,
            reasons: feedback.reasons || [],
            timestamp: Date.now(),
          };
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve(true);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    logger.warn('HistoryDB', 'updateOverallFeedback 失败:', e.message);
    return false;
  }
}

async function getStats() {
  try {
    const records = await getAll();
    const total = records.length;
    let goodCount = 0;
    let okCount = 0;
    let badCount = 0;
    const suggestionFeedback = {};

    for (const record of records) {
      if (record.overallFeedback) {
        if (record.overallFeedback.rating === 'good') {
          goodCount++;
        } else if (record.overallFeedback.rating === 'ok') {
          okCount++;
        } else if (record.overallFeedback.rating === 'bad') {
          badCount++;
        }
      }
      if (record.suggestions) {
        for (const s of record.suggestions) {
          if (s.feedback) {
            if (!suggestionFeedback[s.text]) {
              suggestionFeedback[s.text] = { helpful: 0, notHelpful: 0 };
            }
            if (s.feedback === 'helpful') {
              suggestionFeedback[s.text].helpful++;
            } else {
              suggestionFeedback[s.text].notHelpful++;
            }
          }
        }
      }
    }

    let topSuggestion = null;
    let topScore = -1;
    for (const [text, counts] of Object.entries(suggestionFeedback)) {
      const score = counts.helpful - counts.notHelpful;
      if (score > topScore) {
        topScore = score;
        topSuggestion = { text, ...counts };
      }
    }

    return { total, goodCount, okCount, badCount, topSuggestion };
  } catch (e) {
    logger.warn('HistoryDB', 'getStats 失败:', e.message);
    return { total: 0, goodCount: 0, okCount: 0, badCount: 0, topSuggestion: null };
  }
}

async function exportAll() {
  try {
    const records = await getAll();
    const exportData = records.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      issues: r.issues,
      suggestions: r.suggestions,
      overallFeedback: r.overallFeedback || null,
    }));
    return JSON.stringify(exportData, null, 2);
  } catch (e) {
    logger.warn('HistoryDB', 'exportAll 失败:', e.message);
    return '[]';
  }
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) {
    return '刚刚';
  }
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前';
  }
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前';
  }
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return month + '/' + day;
}

export default {
  getAll,
  add,
  updateFeedback,
  updateOverallFeedback,
  getStats,
  exportAll,
  remove,
  formatTime,
};
