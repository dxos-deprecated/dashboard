//
// Copyright 2020 DxOS
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree';

const Json = ({ json }) => {
  return (
    <JSONTree
      data={json || {}}
      hideRoot={true}
      theme="ashes"
      sortObjectKeys={true}
      shouldExpandNode={() => true}
      getItemString={() => <span />}
    />
  );
};

export default Json;
