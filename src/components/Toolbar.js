//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import MuiToolbar from '@material-ui/core/Toolbar';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(theme => ({
  toolbar: {
    backgroundColor: grey[200],

    '& > button': {
      margin: theme.spacing(0.5),
    }
  }
}));

const Toolbar = ({ children }) => {
  const classes = useStyles();

  return (
    <MuiToolbar variant="dense" disableGutters className={classes.toolbar}>
      {children}
    </MuiToolbar>
  );
};

export default Toolbar;
