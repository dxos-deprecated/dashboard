//
// Copyright 2020 DxOS
//

import React from 'react';

import YesIcon from '@material-ui/icons/CheckCircleOutline';
import NoIcon from '@material-ui/icons/RadioButtonUnchecked';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main
  },
  on: {
    color: theme.palette.primary[500]
  },
  off: {
    color: 'transparent'
  }
}));

// TODO(telackey): Use theme colors.
export const BooleanIcon = ({ yes = false, error = false }) => {
  const classes = useStyles();
  return (yes
    ? <YesIcon className={classes.on} />
    : <NoIcon className={error ? classes.error : classes.off} />
  );
};
