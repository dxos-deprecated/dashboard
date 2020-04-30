//
// Copyright 2020 Wireline, Inc.
//

import compareVersions from 'compare-versions';
import get from 'lodash.get';
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

import { httpGet, ignorePromise } from '../lib/util';
import { useIsMounted, useRegistry } from '../hooks';

const useStyles = makeStyles(() => ({
  upgrade: {
    color: red[500],
    marginLeft: '1em'
  }
}));

const VersionCheck = ({ config }) => {
  const classes = useStyles();
  const { ifMounted } = useIsMounted();
  const [versionInfo, setVersionInfo] = useState({});
  const { registry } = useRegistry(config);

  const handleRefresh = async () => {
    const versionInfo = {};
    const status = await httpGet('/api/status');
    versionInfo.current = get(status, 'result.dxos.xbox.image');

    if (versionInfo.current) {
      versionInfo.name = versionInfo.current.substring(0, versionInfo.current.lastIndexOf('-'));
      versionInfo.version = versionInfo.current.substring(versionInfo.current.lastIndexOf('-') + 1);
      versionInfo.latest = versionInfo.version;

      const resources = await registry.queryRecords({
        type: 'wrn:resource',
        name: versionInfo.name
      });

      if (resources.length) {
        for (const resource of resources) {
          if (compareVersions(resource.version, versionInfo.latest) > 0) {
            versionInfo.latest = resource.version;
          }
        }
      }
    }

    ifMounted(() => setVersionInfo(versionInfo));
  };

  useEffect(ignorePromise(handleRefresh), []);

  return (
    <div>{versionInfo.current}
      {versionInfo.version !== versionInfo.latest && (
        <span className={classes.upgrade}>({versionInfo.latest} available)</span>
      )}
    </div>
  );
};

export default VersionCheck;
