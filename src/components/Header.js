//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AboutIcon from '@material-ui/icons/PowerSettingsNew';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';

import config from '../config';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flex: 1
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
            <IconButton edge="start" color="inherit" aria-label="home">
              <MenuIcon />
            </IconButton>
          </Link>
          <div className={classes.title}>
            <Typography variant="h6">{config.title}</Typography>
          </div>
          <Link href="/about">
            <IconButton edge="start" color="inherit" aria-label="about">
              <AboutIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      <div className={classes.offset} />
    </Fragment>
  );
};

export default Header;
