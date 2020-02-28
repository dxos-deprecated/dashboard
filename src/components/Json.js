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
      valueRenderer={(raw, value) => {
        // Strip quotes (makes triple-click copy-and-paste easier).
        if (typeof value === 'string' && value.length) {
          raw = value;
        }

        return raw;
      }}
    />
  );
};

export default Json;
