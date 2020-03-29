//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/ClearAll';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';

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
    fontSize: 14,
    fontFamily: 'Roboto+Mono, monospace',
    whiteSpace: 'nowrap'
  },

  level: {
    marginRight: 8,
  },
  level_info: {
    color: grey[700]
  },
  level_warn: {
    color: orange[700]
  },
  level_error: {
    color: red[700]
  },

  ts: {
    marginRight: 8,
    color: green[700]
  }
}));

// E[2020-03-29|16:42:50.338] Stopping peer for error module=p2p...

const Log = ({ log, onClear }) => {
  const classes = useStyles();

  const levels = {
    'I': classes.level_info,
    'W': classes.level_warn,
    'E': classes.level_error
  };

  const Line = ({ message }) => {
    const match = message.match(/(.)\[(.+)\|(.+)\] (.+)/);
    if (match) {
      const [, level, date, ts, message] = match;
      return (
        <div>
          <span className={clsx(classes.level, levels[level])}>{level}</span>
          <span className={classes.ts}>{date}</span>
          <span className={classes.ts}>{ts}</span>
          <span>{message}</span>
        </div>
      );
    }

    return (
      <div>{message}</div>
    );
  };

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
          { log.reverse().map((line, i) => <Line key={i} message={line} />) }
        </div>
      </div>
    </div>
  );
};

export default Log;
