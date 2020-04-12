//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import DxOSIcon from '../../components/icons/DXOS';

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

  logoMark: {
    width: 1024,
    height: 512,
    color: blueGrey[200],
    opacity: 0.5
  }
}));

const Page = () => {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.inner}>
        <div>
          <DxOSIcon className={classes.logoMark} />
        </div>
      </div>
    </div>
  );
};

export default Page;
