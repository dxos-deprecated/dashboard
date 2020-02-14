//
// Copyright 2020 DxOS
//

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white'
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(1),
    overflowY: 'scroll'
  }
}));

const Content = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        {children}
      </div>
    </div>
  );
};

export default Content;
