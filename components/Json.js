//
// Copyright 2020 DxOS
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import JSONTree from '@dxos/react-json-tree';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}));

const Json = ({ json }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
    </div>
  );
};

export default Json;
