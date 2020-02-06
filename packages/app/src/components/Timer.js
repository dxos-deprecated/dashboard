//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * Refreshing time display.
 */
const Timer = ({ start  = Date.now() }) => {
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
    <Typography className={classes.root}>{moment(time).fromNow()}</Typography>
  );
};

export default Timer;
