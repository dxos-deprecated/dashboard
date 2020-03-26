//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

import Timer from './Timer';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white'
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll'
  },

  timer: {
    display: 'flex',
    flexShrink: 0
  },
}));

const Content = ({ children, updated }) => {
  const classes = useStyles();

  // TODO(burdon): Move Timer to statusbar.
  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        {children}
      </div>

      <div className={classes.timer}>
        <Timer start={updated} />
      </div>
    </div>
  );
};

export default Content;
