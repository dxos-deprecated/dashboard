//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';

import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MuiLink from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import PublicIcon from '@material-ui/icons/Public';

import Link from 'next/link';

import DxOSIcon from './icons/DXOS';
import AppContext from './AppContext';

const useStyles = makeStyles((theme) => ({
  logo: {
    marginTop: 4,
    marginRight: theme.spacing(2),

    '& svg': {
      width: 64,
      height: 32
    }
  },

  title: {
    display: 'flex',
    flex: 1
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
            <div className={classes.logo}>
              <DxOSIcon />
            </div>
          </Link>
          <div className={classes.title}>
            <Typography variant="h6">{config.app.title}</Typography>
          </div>
          <div>
            <MuiLink href={config.app.website} className={classes.link} rel="noreferrer" target="_blank">
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
