//
// Copyright 2020 DxOS
//

import debug from 'debug';
import pick from 'lodash.pick';
import si from 'systeminformation';

import config from '../../src/config';

const log = debug('dxos:xbox');

const num = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

const size = (n, unit) => {
  const units = {
    K: 3,
    M: 6,
    G: 9,
    T: 12,
  };

  const power = units[unit] || 0;

  return num.format(Math.round(n / (10 ** power))) + (unit ? ` ${unit}` : '');
};

export default async (req, res) => {
  console.log(JSON.stringify(config));

  // https://www.npmjs.com/package/systeminformation
  const cpu = await si.cpu();
  const mem = await si.mem();

  log(JSON.stringify({ cpu, mem }, undefined, 2));

  const status = {
    version: config.version,
    cpu: pick(cpu, 'brand', 'cores', 'cache'),
    mem: {
      total: size(mem.total, 'M'),
      free: size(mem.free, 'M'),
      used: size(mem.used, 'M'),
      swaptotal: size(mem.swaptotal, 'M')
    }
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(status));
};
