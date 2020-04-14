//
// Copyright 2020 Wireline, Inc.
//

import { getConfig } from '../../../lib/server/config';

export default async (req, res) => {
  res.json({ result: { config: await getConfig() } });
};
