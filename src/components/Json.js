//
// Copyright 2020 DxOS
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree';

const Json = ({ json }) => {
  return (
    <JSONTree
      data={json || {}}
      theme="ashes"
      hideRoot={true}
      sortObjectKeys={true}
      shouldExpandNode={() => true}
      getItemString={() => <span />}
      valueRenderer={raw => {
        // Strip quotes (makes triple-click copy-and-paste easier).
        if (typeof raw === 'string' && raw.length) {
          raw = raw.substring(1, raw.length - 1);
        }

        return raw;
      }}
    />
  );
};

export default Json;
