//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

import Timer from './Timer';

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(1),
    overflowY: 'scroll'
  },

  timer: {
    display: 'flex',
    flexShrink: 0,
    padding: theme.spacing(1),
  },
}));

const Content = ({ children, updated }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        {children}
      </div>

      {updated && (
        <div className={classes.timer}>
          <Timer start={updated} />
        </div>
      )}
    </div>
  );
};

export default Content;
