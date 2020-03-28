//
// Copyright 2020 DxOS
//

import React from 'react';

import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 50
  }
}));

const Error = ({ message, ...rest }) => {
  const classes = useStyles();

  return (
    <Snackbar
      className={classes.root}
      open={Boolean(message)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionProps={{ exit: false }}
    >
      <Alert severity="error" {...rest}>{message}</Alert>
    </Snackbar>
  );
};

export default Error;
