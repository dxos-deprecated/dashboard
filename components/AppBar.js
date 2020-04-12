//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';
import MuiLink from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import PublicIcon from '@material-ui/icons/Public';

import DxOSIcon from './icons/DXOS';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.denseToolbar,

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
  }
}));

const AppBar = ({ config }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <MuiAppBar position="fixed">
        <Toolbar variant="dense">
          <Link href="/console">
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
      </MuiAppBar>

      <div className={classes.offset} />
    </Fragment>
  );
};

export default AppBar;
