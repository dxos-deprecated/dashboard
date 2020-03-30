//
// Copyright 2020 Wireline, Inc.
//

import debug from 'debug';

import { expectToThrow } from '@dxos/async';

import { exec } from './exec';

debug.enable('dxos:dashboard:exec');

test('Error', async () => {
  await expectToThrow(async () => {
    await exec('false');
  });
});

test('Basic', async () => {
  const { pid, output } = await exec('hostname');
  expect(pid).toBeTruthy();
  expect(typeof output).toBe('string');
});

test('Match', async () => {
  const { pid, output } = await exec('ping', { args: ['localhost'], match: /PING localhost/, kill: true });
  expect(pid).toBeTruthy();
  expect(output).toContain('PING localhost');
});

test('Timeout', async () => {
  await expectToThrow(async () => {
    await exec('ping', { args: ['localhost'], match: /xxx/, timeout: 500, kill: true });
  });
});

test('Detached', async () => {
  const { pid, output } = await exec('hostname', { detached: true });
  expect(pid).toBeTruthy();
  expect(output).toBeUndefined();
});
