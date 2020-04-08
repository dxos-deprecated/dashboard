//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';

import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import AppContext from './AppContext';

const useStyles = makeStyles(theme => ({
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
    width: 240,
    borderRight: `1px solid ${theme.palette.primary.dark}`
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  }
}));

const Layout = ({ config, children }) => {
  const classes = useStyles();
  const { modules, sidebar } = useContext(AppContext);

  return (
    <div className={classes.root}>
      <Header config={config} />

      <div className={classes.container}>
        {sidebar && (
          <div className={classes.sidebar}>
            <Sidebar modules={modules} />
          </div>
        )}

        <div className={classes.content}>
          {children}
        </div>
      </div>

      <StatusBar config={config} />
    </div>
  );
};

export default Layout;
