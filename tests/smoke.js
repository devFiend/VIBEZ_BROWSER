const { app } = require('electron');

app.whenReady().then(() => {
  console.log('[VIBEZ SMOKE] SUCCESS! Electron Chromium is running!');
  console.log('[VIBEZ SMOKE] Chrome Version:', process.versions.chrome);
  console.log('[VIBEZ SMOKE] Electron Version:', process.versions.electron);
  app.quit();
});
