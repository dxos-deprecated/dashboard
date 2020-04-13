//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}));

/**
 * Refreshing time display.
 */
const Timer = ({ prefix = 'Updated ', start }) => {
  const classes = useStyles();
  const [time, setTime] = useState(start);

  let interval;
  useEffect(() => {
    interval = setInterval(() => {
      setTime(Date.now());
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const text = start ? prefix + moment(time).fromNow() : String.fromCharCode(160);

  return (
    <Typography variant="caption" className={classes.root}>{text}</Typography>
  );
};

export default Timer;
