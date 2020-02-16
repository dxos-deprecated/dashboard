//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Link from 'next/link';

import LogoIcon from './Logo';

import config from '../config';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flex: 1
  },

  logo: {
    color: blueGrey[900]
  },

  offset: theme.mixins.toolbar
}));

const Header = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Link href="/">
            <IconButton edge="start" color="inherit" aria-label="home" className={classes.logo}>
              <LogoIcon />
            </IconButton>
          </Link>
          <div className={classes.title}>
            <Typography variant="h6">{config.title}</Typography>
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.offset} />
    </Fragment>
  );
};

export default Header;
