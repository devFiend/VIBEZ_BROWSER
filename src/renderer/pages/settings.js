/**
 * Vibez Browser — Settings Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const selectSearchEngine = document.getElementById('select-search-engine');
  const selectPrivacyPreset = document.getElementById('select-privacy-preset');
  const toggleFingerprinting = document.getElementById('toggle-fingerprinting');
  const toggleCryptominers = document.getElementById('toggle-cryptominers');
  const selectFocusDuration = document.getElementById('select-focus-duration');

  if (!window.vibezApi || !window.vibezApi.getSettings) return;

  const currentSettings = await window.vibezApi.getSettings();

  if (selectSearchEngine && currentSettings.defaultSearch) {
    selectSearchEngine.value = currentSettings.defaultSearch;
    selectSearchEngine.addEventListener('change', async () => {
      await window.vibezApi.updateSettings({ defaultSearch: selectSearchEngine.value });
    });
  }

  if (selectPrivacyPreset && currentSettings.privacyPreset) {
    selectPrivacyPreset.value = currentSettings.privacyPreset;
    selectPrivacyPreset.addEventListener('change', async () => {
      await window.vibezApi.updateSettings({ privacyPreset: selectPrivacyPreset.value });
    });
  }

  if (toggleFingerprinting) {
    toggleFingerprinting.checked = currentSettings.blockFingerprinting !== false;
    toggleFingerprinting.addEventListener('change', async () => {
      await window.vibezApi.updateSettings({ blockFingerprinting: toggleFingerprinting.checked });
    });
  }

  if (toggleCryptominers) {
    toggleCryptominers.checked = currentSettings.blockCryptoMiners !== false;
    toggleCryptominers.addEventListener('change', async () => {
      await window.vibezApi.updateSettings({ blockCryptoMiners: toggleCryptominers.checked });
    });
  }

  if (selectFocusDuration && currentSettings.focusDuration) {
    selectFocusDuration.value = String(currentSettings.focusDuration);
    selectFocusDuration.addEventListener('change', async () => {
      await window.vibezApi.updateSettings({ focusDuration: parseInt(selectFocusDuration.value, 10) });
    });
  }
});
