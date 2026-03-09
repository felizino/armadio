(function () {
  var PROFILE_KEY = 'armadio-profile';

  function getProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : { name: '', lastName: '' };
    } catch {
      return { name: '', lastName: '' };
    }
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (_) {}
  }

  var nameInput = document.getElementById('profile-name');
  var lastNameInput = document.getElementById('profile-last-name');
  if (nameInput && lastNameInput) {
    var profile = getProfile();
    nameInput.value = profile.name || '';
    lastNameInput.value = profile.lastName || '';
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
})();
