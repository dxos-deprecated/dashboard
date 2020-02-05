//
// Copyright 2020 Wireline, Inc.
//

import config from '../../src/config';

export default (req, res) => {
  console.log(JSON.stringify(config));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ version: config.version }));
};
