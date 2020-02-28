//
// Copyright 2020 DxOS
//

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useRouter } from 'next/router';

import components from '../components';

const useStyles = makeStyles(() => ({
  list: {
    padding: 0
  }
}));

const Sidebar = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <List aria-label="items" className={classes.list}>
      {components.map(({ path, title, icon: Icon }) => (
        <ListItem button selected={path === router.pathname} key={path} onClick={() => router.push(path)}>
          <ListItemIcon classes={{ root: classes.icon }}>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
