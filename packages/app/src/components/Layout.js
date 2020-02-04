//
// Copyright 2020 Wireline, Inc.
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(2),
  }
}));

const withLayout = Page => () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Paper square className={classes.container}>
        <Page />
      </Paper>
    </div>
  );
};

export default withLayout;
