#!/usr/bin/env node

const { resolve } = require('path');
const { spawn } = require('child_process');

const cmd = 'npx';
const args = ['next', 'start', ...process.argv.slice(2)];
const options = {
  cwd: resolve(__dirname, '..'),
  stdio: 'inherit',
  customFds: [0, 1, 2],
  env: {
    NEXT_TELEMETRY_DISABLED: 1,
    ...process.env
  }
};

const proc = spawn(cmd, args, options);

proc.on('close', (code, signal) => {
  if (code !== null) {
    process.exit(code);
  }
  if (signal) {
    if (signal === 'SIGKILL') {
      process.exit(137);
    }
    console.log(`got signal ${signal}, exiting`);
    process.exit(1);
  }
  process.exit(0);
});

proc.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
