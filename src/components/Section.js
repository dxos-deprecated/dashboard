//
// Copyright 2020 DxOS
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },

  scroller: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'scroll',
  },

  header: {
    flexShrink: 0,
    paddingLeft: 6,
    paddingBottom: 2,
    backgroundColor: theme.palette.background.default,
    fontVariant: 'all-small-caps'
  },
}));

const Section = ({ label, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <div className={classes.header}>{label}</div>
      <div className={classes.scroller}>
        {children}
      </div>
    </div>
  );
};

export default Section;
