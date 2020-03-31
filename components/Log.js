//
// Copyright 2020 Wireline, Inc.
//

import clsx from 'clsx';
import moment from 'moment';
import React, { Fragment } from 'react';

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
    display: 'inline-block',
    marginRight: 8,
    width: 32
  },
  level_info: {
    color: grey[700],
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

const Log = ({ log, onClear }) => {
  const classes = useStyles();

  const levels = {
    'I': classes.level_info,
    'W': classes.level_warn,
    'E': classes.level_error
  };

  // TODO(burdon): Parse in backend and normalize numbers.
  const Line = ({ message }) => {
    // https://regex101.com/
    const patterns = [
      {
        // 2020-03-30T18:02:43.189Z bot-factory
        pattern: /()(.+Z)\s+(.+)/,
        transform: ([datetime]) => moment(datetime)
      },
      {
        // I[2020-03-30|15:29:05.436] Executed block module=state height=11533 validTxs=0 invalidTxs=0
        pattern: /(.)\[(.+)\|(.+)]\s+(.+)/,
        transform: ([date, time]) => moment(`${date} ${time}`)
      },
      {
        // [cors] 2020/03/30 15:28:53 Handler: Actual request
        pattern: /\[(\w+)] (\S+) (\S+)\s+(.+)/,
        transform: ([date, time]) => moment(`${date.replace(/\//g, '-')} ${time}`)
      }
    ];

    patterns.some(({ pattern, transform }) => {
      const match = message.match(pattern);
      if (match) {
        const [, level = 'I', ...rest] = match;
        const datetime = transform(rest).format('YYYY-MM-DD HH:mm:ss');
        const text = match[match.length - 1];

        message = (
          <Fragment>
            <span className={clsx(classes.level, levels[level])}>{level}</span>
            <span className={classes.ts}>{datetime}</span>
            <span>{text}</span>
          </Fragment>
        );

        return true;
      }

      return false;
    });

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
