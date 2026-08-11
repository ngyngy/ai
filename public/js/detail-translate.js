// 详情页动态翻译模块 — 根据用户选择的语言对详情内容进行实时翻译
// 分批并发请求 + 渐进式渲染：翻译完一段就显示一段
(function() {
  'use strict';

  var CACHE = {};          // 内存缓存 (本页生命周期)
  var STORAGE_PREFIX = 'nav_dtl_';
  var loadingEl = null;

  function storageGet(text, lang) {
    try {
      var key = STORAGE_PREFIX + lang + '_' + simpleHash(text);
      return sessionStorage.getItem(key);
    } catch(e) { return null; }
  }

  function storageSet(text, lang, translation) {
    try {
      var key = STORAGE_PREFIX + lang + '_' + simpleHash(text);
      sessionStorage.setItem(key, translation);
    } catch(e) {}
  }

  function simpleHash(s) {
    var h = 0;
    for (var i = 0; i < Math.min(s.length, 200); i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return (h >>> 0).toString(36);
  }

  function showLoading() {
    if (loadingEl) return;
    var body = document.querySelector('.td-content-body');
    if (!body) return;
    loadingEl = document.createElement('div');
    loadingEl.className = 'td-translate-loading';
    loadingEl.textContent = I18N ? (I18N.t('detail.translating') || '\u7ffb\u8bd1\u4e2d...') : '\u7ffb\u8bd1\u4e2d...';
    body.insertBefore(loadingEl, body.firstChild);
  }

  function hideLoading() {
    if (loadingEl) { loadingEl.remove(); loadingEl = null; }
  }

  function restoreOriginals(lang) {
    var els = document.querySelectorAll('[data-orig-detail-text]');
    els.forEach(function(el) {
      var orig = el.getAttribute('data-orig-detail-text');
      if (orig) el.textContent = orig;
    });
    hideLoading();
  }

  // 批量翻译 + 立即更新 DOM
  async function fetchAndApply(batchTexts, targetLang) {
    try {
      var resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: batchTexts, target: targetLang })
      });
      var data = await resp.json();
      if (!data.results) return;

      // 更新每个匹配的元素
      var els = document.querySelectorAll('[data-orig-detail-text]');
      els.forEach(function(el) {
        var orig = el.getAttribute('data-orig-detail-text');
        var tl = data.results[orig];
        if (tl && tl !== orig) {
          el.textContent = tl;
          CACHE[targetLang + '::' + orig] = tl;
          storageSet(orig, targetLang, tl);
        }
      });
    } catch(e) {
      console.warn('Translation batch failed:', e.message);
    }
  }

  // 主翻译函数
  async function translate(lang) {
    if (lang === 'zh-CN') { restoreOriginals(lang); return; }

    var els = document.querySelectorAll('[data-orig-detail-text]');
    if (!els.length) return;

    // 收集所有待翻译文本（去重，同时检查缓存）
    var uncached = [];
    els.forEach(function(el) {
      var orig = el.getAttribute('data-orig-detail-text');
      if (!orig) return;

      // 检查缓存
      if (CACHE[lang + '::' + orig]) {
        el.textContent = CACHE[lang + '::' + orig];
        return;
      }
      var cached = storageGet(orig, lang);
      if (cached) {
        el.textContent = cached;
        CACHE[lang + '::' + orig] = cached;
        return;
      }

      if (uncached.indexOf(orig) === -1) {
        uncached.push(orig);
      }
    });

    if (uncached.length === 0) return;

    showLoading();

    // 分 2 批并发发送，每批 5-8 条
    // 全部同时发起，渐进式渲染——哪批先回来就先显示
    var mid = Math.ceil(uncached.length / 2);
    var batch1 = uncached.slice(0, mid);
    var batch2 = uncached.slice(mid);

    var promises = [fetchAndApply(batch1, lang)];
    if (batch2.length > 0) {
      promises.push(fetchAndApply(batch2, lang));
    }

    await Promise.all(promises);
    hideLoading();
  }

  // 监听语言切换
  document.addEventListener('langchange', function(e) {
    var newLang = (e.detail && e.detail.lang) || (I18N && I18N.getLang && I18N.getLang()) || 'zh-CN';
    translate(newLang);
  });

  window.DetailTranslate = {
    translate: translate,
    restore: restoreOriginals
  };
})();
