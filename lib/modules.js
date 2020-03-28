//
// Copyright 2020 DxOS
//

import BotsIcon from '@material-ui/icons/Android';
import StatsIcon from '@material-ui/icons/Equalizer';
import RegistryIcon from '@material-ui/icons/Storage';
import IPFSIcon from '@material-ui/icons/GraphicEq';
import ConfigIcon from '@material-ui/icons/Settings';
import SignalIcon from '@material-ui/icons/Traffic';

export default [
  {
    path: '/',
    title: 'Status',
    icon: StatsIcon
  },
  {
    path: '/wns',
    title: 'WNS',
    icon: RegistryIcon
  },
  {
    path: '/bots',
    title: 'Bots',
    icon: BotsIcon
  },
  {
    path: '/signal',
    title: 'Signal Server',
    icon: SignalIcon
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
