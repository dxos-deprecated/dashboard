//
// Copyright 2020 DxOS
//

import AppsIcon from '@material-ui/icons/Apps';
import BotsIcon from '@material-ui/icons/Android';
import StatsIcon from '@material-ui/icons/Equalizer';
import RegistryIcon from '@material-ui/icons/Storage';
import IPFSIcon from '@material-ui/icons/GraphicEq';
import ConfigIcon from '@material-ui/icons/Settings';
import SignalIcon from '@material-ui/icons/Traffic';

export default [
  {
    path: '/console/status',
    title: 'Status',
    icon: StatsIcon
  },
  {
    path: '/console/wns',
    title: 'WNS',
    icon: RegistryIcon
  },
  {
    path: '/console/apps',
    title: 'Apps',
    icon: AppsIcon
  },
  {
    path: '/console/bots',
    title: 'Bots',
    icon: BotsIcon
  },
  {
    path: '/console/signal',
    title: 'Signal Server',
    icon: SignalIcon
  },
  {
    path: '/console/ipfs',
    title: 'IPFS',
    icon: IPFSIcon
  },
  {
    path: '/console/config',
    title: 'Config',
    icon: ConfigIcon
  }
];
