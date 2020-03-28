//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/ClearAll';
import grey from '@material-ui/core/colors/grey';

import Toolbar from './Toolbar';

const useStyles = makeStyles(theme => ({

  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden'
  },

  container: {
    display: 'flex',
    flex: 1,
    overflow: 'scroll',
    backgroundColor: grey[100],
  },

  log: {
    padding: theme.spacing(1),
    fontFamily: 'monospace'
  }
}));

const Log = ({ log, onClear }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Toolbar variant="dense">
        <div>
          <IconButton onClick={onClear} title="Clear log">
            <ClearIcon />
          </IconButton>
        </div>
      </Toolbar>
      <div className={classes.container}>
        <div className={classes.log}>
          { log.reverse().map((line, i) => <div key={i}>{line}</div>) }
        </div>
      </div>
    </div>
  );
};

export default Log;
