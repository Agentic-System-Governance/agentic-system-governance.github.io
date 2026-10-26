(() => {
  'use strict';
  // The URL is the shared source of truth. Browser preferences never override it.
  const lang = new URLSearchParams(window.location.search).get('lang') === 'zh' ? 'zh' : 'en';
  window.WikiLocale = Object.freeze({
    lang,
    pick: (zh, en) => lang === 'zh' ? zh : en
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
})();
