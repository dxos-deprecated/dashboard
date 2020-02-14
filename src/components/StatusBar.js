//
// Copyright 2020 DxOS
//

import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import AppContext from './AppContext';

const useStyles = makeStyles(() => ({
  toolbar: {
    height: 32,
    color: grey[100],
    backgroundColor: grey[800]
  }
}));

const StatusBar = () => {
  const classes = useStyles();
  const { config: { title, version } } = useContext(AppContext);

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      <div>{`${title} v${version}`}</div>
    </Toolbar>
  );
};

export default StatusBar;
