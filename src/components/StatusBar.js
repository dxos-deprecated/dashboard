//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AboutIcon from '@material-ui/icons/PowerSettingsNew';
import grey from '@material-ui/core/colors/grey';

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

const StatusBar = ({ config }) => {
  const classes = useStyles();

  const { build: { name, buildDate, version } } = config;

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      <div>
        <span>{`${name}/${version}`}</span>
        <span className={classes.build}> {moment(buildDate).format('L')}</span>
      </div>

      <div style={{ textAlign: 'center' }}>© DxOS.org</div>

      <div style={{ textAlign: 'right' }}>
        <Link href="/console/about">
          <IconButton edge="start" color="inherit" aria-label="about">
            <AboutIcon />
          </IconButton>
        </Link>
      </div>
    </Toolbar>
  );
};

export default StatusBar;
