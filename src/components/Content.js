//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import Timer from './Timer';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
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
    <Paper className={classes.root}>
      <div className={classes.inner}>
        {children}
      </div>

      <div className={classes.timer}>
        <Timer start={updated} />
      </div>
    </Paper>
  );
};

export default Content;
