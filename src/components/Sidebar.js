//
// Copyright 2020 DxOS
//

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import BotsIcon from '@material-ui/icons/Android';
import StatsIcon from '@material-ui/icons/Equalizer';
import RegistryIcon from '@material-ui/icons/Storage';
import IPFSIcon from '@material-ui/icons/GraphicEq';
import ConfigIcon from '@material-ui/icons/Settings';

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
      title: 'Status',
      icon: StatsIcon
    },
    {
      path: '/wns',
      title: 'Naming Service',
      icon: RegistryIcon
    },
    {
      path: '/bots',
      title: 'Bots',
      icon: BotsIcon
    },
    {
      path: '/ipfs',
      title: 'IPFS',
      icon: IPFSIcon
    },
    {
      path: '/config',
      title: 'Config',
      icon: ConfigIcon
    }
  ];

  return (
    <List aria-label="items" className={classes.list}>
      {items.map(({ path, title, icon: Icon = BotsIcon }) => (
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
