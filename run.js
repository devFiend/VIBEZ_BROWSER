/**
 * Safe runner script for Vibez Browser.
 * Unsets ELECTRON_RUN_AS_NODE so the Chromium browser shell launches cleanly.
 */

const { spawn } = require('child_process');
const path = require('path');

const electron = require('electron');
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electron, ['.', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
  windowsHide: false
});

child.on('close', (code) => {
  process.exit(code || 0);
});
