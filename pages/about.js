//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '../src/components/Layout';

// TODO(burdon): Convert to SVG.
import logo from '../static/logo.png';

const useStyles = makeStyles(() => ({
  root: {
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
    width: 800,
    opacity: 0.05
  }
}));

const Page = () => {
  const classes = useStyles();

  return (
    <Layout sidebar={false}>
      <div className={classes.root}>
        <div className={classes.inner}>
          <div>
            <img alt="DxOS" src={logo} className={classes.logo} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
