//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  }
}));

/**
 * Refreshing time display.
 */
const Timer = ({ prefix = 'Updated ', start = Date.now() }) => {
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

  return (
    <Typography variant="caption" className={classes.root}>{prefix + moment(time).fromNow()}</Typography>
  );
};

export default Timer;
