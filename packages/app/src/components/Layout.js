//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import Header from './Header';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'scroll'
  }
}));

const withLayout = Page => () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <Paper square className={classes.inner}>
          <Page />
        </Paper>
      </div>
    </div>
  );
};

export default withLayout;
