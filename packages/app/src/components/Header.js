//
// Copyright 2020 Wireline, Inc.
//

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';

import config from '../config';

const styles = (theme) => ({
  title: {
    display: 'flex',
    flex: 1
  },

  offset: theme.mixins.toolbar,
});

const Header = ({ classes }) => (
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
            <HelpIcon />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>

    <div className={classes.offset} />
  </Fragment>
);

export default withStyles(styles)(Header);
