
  (function () {
    'use strict';
    var key = 'artify-theme-mode';
    var modes = ['system', 'light', 'dark'];
    function valid(value) { return modes.indexOf(value) >= 0 ? value : 'system'; }
    function systemTheme() {
      return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function resolve(mode) { return mode === 'system' ? systemTheme() : mode; }
    function saved() { try { return valid(localStorage.getItem(key)); } catch (_) { return 'system'; } }
    function apply(mode, notify) {
      mode = valid(mode);
      var theme = resolve(mode);
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      if (notify) window.dispatchEvent(new CustomEvent('artify:theme-change', { detail: { mode: mode, theme: theme } }));
      return mode;
    }
    var current = apply(saved(), false);
    window.ArtifyTheme = {
      getMode: function () { return current; },
      getTheme: function () { return resolve(current); },
      setMode: function (mode) {
        current = valid(mode);
        try { localStorage.setItem(key, current); } catch (_) {}
        apply(current, true);
      }
    };
    if (typeof window.matchMedia === 'function') {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var changed = function () { if (current === 'system') apply('system', true); };
      if (mq.addEventListener) mq.addEventListener('change', changed);
      else if (mq.addListener) mq.addListener(changed);
    }
  }());
  