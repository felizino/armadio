(function () {
  var PROFILE_KEY = 'armadio-profile';

  function getProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : { name: '', lastName: '', gender: '' };
    } catch {
      return { name: '', lastName: '', gender: '' };
    }
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (_) {}
  }

  var nameInput = document.getElementById('profile-name');
  var lastNameInput = document.getElementById('profile-last-name');
  var genderSelect = document.getElementById('profile-gender');
  if (nameInput && lastNameInput) {
    var profile = getProfile();
    nameInput.value = profile.name || '';
    lastNameInput.value = profile.lastName || '';
    if (genderSelect) genderSelect.value = profile.gender || '';
    nameInput.addEventListener('input', function () {
      profile.name = nameInput.value.trim();
      saveProfile(profile);
    });
    nameInput.addEventListener('blur', function () {
      profile.name = nameInput.value.trim();
      saveProfile(profile);
    });
    lastNameInput.addEventListener('input', function () {
      profile.lastName = lastNameInput.value.trim();
      saveProfile(profile);
    });
    lastNameInput.addEventListener('blur', function () {
      profile.lastName = lastNameInput.value.trim();
      saveProfile(profile);
    });
    if (genderSelect) {
      genderSelect.addEventListener('change', function () {
        profile.gender = genderSelect.value || '';
        saveProfile(profile);
      });
    }
  }

  var toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;

  function updateToggle() {
    var isDark = window.theme && window.theme.isDark();
    toggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    if (window.theme) {
      window.theme.toggle();
      updateToggle();
    }
  });

  updateToggle();

  // ----- Your fit (body measurements) -----
  var FIT_STORAGE_KEY = 'armadio-fit';
  var FIT_UNIT_KEY = 'armadio-fit-unit';
  var FIT_KEYS = ['head', 'neck', 'chest', 'waist', 'hip', 'wrist', 'thigh', 'knee', 'ankle'];
  var FIT_RANGES = {
    head: { min: 54, max: 62, step: 0.5 },
    neck: { min: 35, max: 45, step: 0.5 },
    chest: { min: 85, max: 120, step: 1 },
    waist: { min: 70, max: 110, step: 1 },
    hip: { min: 85, max: 115, step: 1 },
    wrist: { min: 15, max: 21, step: 0.5 },
    thigh: { min: 50, max: 70, step: 1 },
    knee: { min: 35, max: 45, step: 0.5 },
    ankle: { min: 22, max: 28, step: 0.5 }
  };

  function getFit() {
    try {
      var raw = localStorage.getItem(FIT_STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (_) { return {}; }
  }

  function saveFit(data) {
    try {
      localStorage.setItem(FIT_STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getFitUnit() {
    try {
      var u = localStorage.getItem(FIT_UNIT_KEY);
      return u === 'in' ? 'in' : 'cm';
    } catch (_) { return 'cm'; }
  }

  function setFitUnit(unit) {
    try {
      localStorage.setItem(FIT_UNIT_KEY, unit === 'in' ? 'in' : 'cm');
    } catch (_) {}
  }

  function fillFitSelect(el, key, unit) {
    if (!el) return;
    var range = FIT_RANGES[key];
    if (!range) return;
    el.innerHTML = '';
    var optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.textContent = '—';
    el.appendChild(optEmpty);
    var steps = Math.round((range.max - range.min) / range.step) + 1;
    for (var i = 0; i < steps; i++) {
      var v = range.min + i * range.step;
      v = Math.round(v * 10) / 10;
      var opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = unit === 'in' ? (v / 2.54).toFixed(1) + ' in' : (range.step >= 1 ? Math.round(v) : v) + ' cm';
      el.appendChild(opt);
    }
    var data = getFit();
    var val = data[key];
    el.value = val !== undefined && val !== null && val !== '' ? String(val) : '';
    el.classList.toggle('is-placeholder', el.value === '');
  }

  function updateFitUnitDesc() {
    var desc = document.getElementById('fit-section-desc');
    if (desc) desc.textContent = 'Body measurements for sizing and shopping.';
  }

  function initFitSection() {
    var unit = getFitUnit();
    updateFitUnitDesc();

    var toggleWrap = document.querySelector('.fit-unit-toggle');
    if (toggleWrap) {
      toggleWrap.querySelectorAll('.fit-unit-btn').forEach(function (btn) {
        var u = btn.getAttribute('data-unit');
        btn.classList.toggle('is-active', u === unit);
        btn.setAttribute('aria-pressed', u === unit ? 'true' : 'false');
        btn.addEventListener('click', function () {
          if (u === unit) return;
          unit = u;
          setFitUnit(unit);
          toggleWrap.querySelectorAll('.fit-unit-btn').forEach(function (b) {
            var ub = b.getAttribute('data-unit');
            b.classList.toggle('is-active', ub === unit);
            b.setAttribute('aria-pressed', ub === unit ? 'true' : 'false');
          });
          updateFitUnitDesc();
          FIT_KEYS.forEach(function (key) {
            var el = document.getElementById('fit-' + key);
            if (el) fillFitSelect(el, key, unit);
          });
        });
      });
    }

    FIT_KEYS.forEach(function (key) {
      var el = document.getElementById('fit-' + key);
      if (!el) return;
      fillFitSelect(el, key, unit);
      if (el._fitListener) return;
      el._fitListener = true;
      el.addEventListener('change', function () {
        el.classList.toggle('is-placeholder', el.value === '');
        var next = getFit();
        var raw = el.value;
        if (raw === '') {
          delete next[key];
        } else {
          var num = parseFloat(raw);
          if (!isNaN(num)) next[key] = num;
        }
        saveFit(next);
      });
    });
  }

  initFitSection();
})();
