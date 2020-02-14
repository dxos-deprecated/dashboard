//
// Copyright 2020 DxOS
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: 250
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  }
}));

export const Layout = ({ children, sidebar = true }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />

      <div className={classes.container}>
        {sidebar && (
          <div className={classes.sidebar}>
            <Sidebar />
          </div>
        )}

        <div className={classes.content}>
          {children}
        </div>
      </div>

      <StatusBar />
    </div>
  );
};

const withLayout = Page => () => {
  return (
    <Layout>
      <Page />
    </Layout>
  );
};

export default withLayout;
