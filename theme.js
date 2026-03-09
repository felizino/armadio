(function () {
  const STORAGE_KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY) || LIGHT;
    } catch {
      return LIGHT;
    }
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme === DARK ? DARK : '');
  }

  function init() {
    apply(getStored());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.theme = {
    get: getStored,
    set: function (theme) {
      if (theme !== DARK && theme !== LIGHT) return;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {}
      apply(theme);
    },
    isDark: function () {
      return getStored() === DARK;
    },
    toggle: function () {
      var next = getStored() === DARK ? LIGHT : DARK;
      this.set(next);
      return next;
    }
  };
})();
