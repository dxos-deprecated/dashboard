//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AboutIcon from '@material-ui/icons/PowerSettingsNew';
import grey from '@material-ui/core/colors/grey';

import Link from 'next/link';

import AppContext from './AppContext';

const useStyles = makeStyles(() => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 32,
    color: grey[100],
    backgroundColor: grey[900],

    '&> div': {
      flex: 1
    }
  },

  build: {
    color: grey[500],
  }
}));

const StatusBar = () => {
  const { config: { build: { name, buildDate, version } } } = useContext(AppContext);
  const classes = useStyles();

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      <div>
        <span>{`${name}/${version}`}</span>
        <span className={classes.build}> {moment(buildDate).format('L')}</span>
      </div>

      <div style={{ textAlign: 'center' }}>© DxOS.org</div>

      <div style={{ textAlign: 'right' }}>
        <Link href="/about">
          <IconButton edge="start" color="inherit" aria-label="about">
            <AboutIcon />
          </IconButton>
        </Link>
      </div>
    </Toolbar>
  );
};

export default StatusBar;
