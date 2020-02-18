//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import PublicIcon from '@material-ui/icons/Public';

import Link from 'next/link';

import LogoIcon from '../icons/Logo';
import AppContext from './AppContext';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flex: 1
  },

  logo: {
    color: blueGrey[900]
  },

  link: {
    color: blueGrey[900]
  },

  offset: theme.mixins.toolbar
}));

const Header = () => {
  const { config } = useContext(AppContext);
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
          <div>
            <MuiLink href={config.website} className={classes.link} rel="noreferrer" target="_blank">
              <PublicIcon />
            </MuiLink>
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.offset} />
    </Fragment>
  );
};

export default Header;
