//
// Copyright 2020 DxOS
//

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useRouter } from 'next/router';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  list: {
    padding: 0
  },

  icon: {
    color: theme.palette.grey[500]
  },

  selected: {
    color: theme.palette.primary.main
  },
}));

const Sidebar = ({ modules }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <List aria-label="items" className={classes.list}>
      {modules.map(({ path, title, icon: Icon }) => (
        <ListItem button selected={path === router.pathname} key={path} onClick={() => router.push(path)}>
          <ListItemIcon classes={{ root: classes.icon }}>
            <Icon className={clsx(classes.icon, path === router.pathname && classes.selected)} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
