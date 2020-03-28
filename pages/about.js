//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import { withLayout } from '../hooks';

import DxOSIcon from '../components/icons/DXOS';
import Logo from '../components/icons/Logo';

const useStyles = makeStyles(() => ({
  outer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  logo: {
    width: 256,
    height: 256,
    opacity: 0.7,
    marginRight: 64
  },

  logoMark: {
    width: 512,
    height: 256,
    color: blueGrey[200]
  }
}));

const Page = () => {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.inner}>
        <div>
          <Logo className={classes.logo} />
          <DxOSIcon className={classes.logoMark} />
        </div>
      </div>
    </div>
  );
};

export default withLayout(Page, { sidebar: false });
