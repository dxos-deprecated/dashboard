//
// Copyright 2020 DxOS
//

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  list: {
    padding: 0
  }
}));

const Sidebar = () => {
  const classes = useStyles();
  const router = useRouter();

  const items = [
    {
      path: '/',
      title: 'Status'
    },
    {
      path: '/wns',
      title: 'WNS'
    },
    {
      path: '/bots',
      title: 'Bots'
    },
    {
      path: '/ipfs',
      title: 'IPFS'
    },
    {
      path: '/swarm',
      title: 'Swarm'
    },
    {
      path: '/config',
      title: 'Config'
    }
  ];

  return (
    <List aria-label="items" className={classes.list}>
      {items.map(({ path, title }) => (
        <ListItem button selected={path === router.pathname} key={path} onClick={() => router.push(path)}>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
