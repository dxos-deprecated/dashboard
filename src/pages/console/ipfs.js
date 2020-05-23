//
// Copyright 2020 DxOS
//

import IpfsHttpClient from 'ipfs-http-client';
import get from 'lodash.get';
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { JsonTreeView } from '@dxos/react-ux';

import { getServiceUrl, httpGet, ignorePromise } from '../../lib/util';
import { useIsMounted, useRegistry } from '../../hooks';

import ControlButtons from '../../components/ControlButtons';
import Content from '../../components/Content';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Toolbar from '../../components/Toolbar';
import TableCell from '../../components/TableCell';
import { BooleanIcon } from '../../components/BooleanIcon';

export { getServerSideProps } from '../../lib/server/config';

const RECORD_TYPE = 'wrn:service';
const SERVICE_TYPE = 'ipfs';
const SERVICE_NAME = 'ipfs';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    flex: 1,
    overflowY: 'scroll'
  },

  table: {
    tableLayout: 'fixed',

    '& th': {
      fontVariant: 'all-small-caps',
      fontSize: 18,
      cursor: 'ns-resize'
    }
  },

  connected: {
    fontWeight: 'bold',
  },

  disconnected: {
    fontStyle: 'italic',
  },

  colShort: {
    width: '30%'
  },

  colWide: {
  },

  colBoolean: {
    width: '10%'
  },

  caption: {
    backgroundColor: theme.palette.grey[500],
    paddingLeft: '1em',
    margin: 0
  }
}));

/**
 * NOTE: Must set-up CORS first.
 * https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
 * https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
 * https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
 *
 * @constructor
 */
const Page = ({ config }) => {
  const classes = useStyles();
  const { ifMounted } = useIsMounted();
  const [{ ts, result, error }, setStatus] = useState({});
  const [swarmPeers, setSwarmPeers] = useState([]);
  const [registeredServers, setRegisteredServers] = useState([]);

  const ipfs = IpfsHttpClient(getServiceUrl(config, 'ipfs.server', { absolute: true }));
  const { registry } = useRegistry(config);

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    try {
      const version = await ipfs.version();
      const status = await ipfs.id();
      const repoStats = await ipfs.stats.repo();
      const swarmPeers = await ipfs.swarm.peers();

      const attributes = { type: RECORD_TYPE, service: SERVICE_TYPE };
      const wnsIpfs = await registry.queryRecords(attributes);

      ifMounted(() => {
        const stats = {
          // These are BigNumbers, which are easier to handle for display as strings.
          files: repoStats.numObjects.toString(),
          size: repoStats.repoSize.toString()
        };
        status.addresses = status.addresses.map(address => String(address));

        setStatus({ ts: Date.now(), result: { version, status, stats } });
        setSwarmPeers(swarmPeers);
        setRegisteredServers(wnsIpfs);
      });
    } catch (error) {
      let message = String(error);
      if (String(error).match(/Failed to fetch/)) {
        message = [
          message, 'Make sure CORS is enabled.'
        ];
      }

      ifMounted(() => setStatus({ ts: Date.now(), error: message }));
    }
  };

  // TODO(burdon): Link to Chrome extension (info panel).
  // https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch?hl=en
  const handleStart = async () => {
    // TODO(burdon): Can we detach after matching.
    const { ts, error } = await httpGet('/api/service', { service: SERVICE_NAME, command: 'start' });
    setStatus({ ts, error });
    if (!error) {
      setTimeout(() => {
        handleRefresh();
      }, 5000);
    }
  };

  const handleStop = async () => {
    const status = await httpGet('/api/service', { service: SERVICE_NAME, command: 'stop' });
    setStatus(status);
  };

  const handleOpen = () => {
    // TODO(burdon): Convert link.
    window.open(config.services.ipfs.webui, '_ipfs_');
  };

  useEffect(ignorePromise(handleRefresh), []);

  const { version, status, stats } = result || {};

  const displayServers = registeredServers.map((service) => {
    const addresses = get(service, 'attributes.ipfs.addresses');
    const parts = addresses[0].split('/');
    const nodeId = parts[parts.length - 1];
    const connected = !!swarmPeers.find(({ peer }) => peer === nodeId);

    return {
      name: get(service, 'name'),
      version: get(service, 'version'),
      description: get(service, 'attributes.description'),
      ipfs: get(service, 'attributes.ipfs'),
      connected
    };
  });

  displayServers.sort((a, b) => {
    return a.connected && !b.connected ? -1 : b.connected && !a.connected ? 1 : b.name < a.name ? 1 : -1;
  });

  if (displayServers.length === 0) {
    displayServers.push({ name: 'None' });
  }

  return (
    <Layout config={config}>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>

        <ControlButtons onStart={handleStart} onStop={handleStop} onOpen={handleOpen} />
      </Toolbar>

      <Content updated={ts}>
        <h4 className={classes.caption}>Peers from WNS</h4>
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.colShort}>Name</TableCell>
                <TableCell className={classes.colBoolean}>Connected</TableCell>
                <TableCell className={classes.colWide}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayServers.map(({ name, description, ipfs, connected }) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <BooleanIcon yes={connected} />
                  </TableCell>
                  <TableCell>
                    <JsonTreeView data={{ description, ipfs }} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h4 className={classes.caption}>Local Status</h4>
        <JsonTreeView data={{ version, status, stats }} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Layout>
  );
};

export default Page;
