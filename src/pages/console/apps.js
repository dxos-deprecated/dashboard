//
// Copyright 2020 DxOS
//

import debug from 'debug';
import IpfsHttpClient from 'ipfs-http-client';

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { getServiceUrl, httpGet, ignorePromise } from '../../lib/util';
import { useIsMounted, useRegistry } from '../../hooks';

import Content from '../../components/Content';
import Error from '../../components/Error';
import TableCell from '../../components/TableCell';
import Toolbar from '../../components/Toolbar';
import Layout from '../../components/Layout';
import ControlButtons from '../../components/ControlButtons';

const SERVICE_NAME = 'app-server';

export { getServerSideProps } from '../../lib/server/config';

const log = debug('dxos:dashboard:apps');
const APP_PATH_PREFIX = 'app';

const useStyles = makeStyles(() => ({
  tableContainer: {
    flex: 1,
    overflowY: 'scroll'
  },

  table: {
    tableLayout: 'fixed',

    '& th': {
      fontVariant: 'all-small-caps',
      fontSize: 18
    }
  },

  colShort: {
    width: 160
  },

  action: {
    textAlign: 'right'
  },

  available: {
    fontWeight: 'bold'
  },

  missing: {
    fontStyle: 'italic'
  }
}));

const Page = ({ config }) => {
  const classes = useStyles();
  const { ifMounted } = useIsMounted();
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const [records, setRecords] = useState([]);
  const [available, setAvailable] = useState(null);
  const { registry } = useRegistry(config);

  // TODO(telackey): This doesn't make sense to do SSR, so bail.
  if (!registry) {
    return null;
  }

  const { ...stats } = result;

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    try {
      const ipfs = IpfsHttpClient(getServiceUrl(config, 'ipfs.server', { absolute: true }));
      const records = await registry.queryRecords({ type: 'wrn:app' });
      ifMounted(() => setRecords(records));

      const refs = new Set();
      for await (const ref of ipfs.refs.local()) {
        if (ref.err) {
          log(ref.err);
        } else {
          refs.add(ref.ref);
        }
      }
      ifMounted(() => setAvailable(refs));
    } catch (error) {
      const message = String(error);
      ifMounted(() => setStatus({ ts: Date.now(), error: message }));
    }
  };

  const handleStart = async () => {
    const status = await httpGet('/api/service', { service: SERVICE_NAME, command: 'start' });
    ifMounted(() => {
      setStatus(status);
      handleRefresh();
    });
  };

  const handleStop = async () => {
    const status = await httpGet('/api/service', { service: SERVICE_NAME, command: 'stop' });
    ifMounted(() => {
      setStatus(status);
      handleRefresh();
    });
  };

  useEffect(ignorePromise(handleRefresh), []);

  const sorter = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

  // TODO(burdon): WNS should have path.
  // TODO(burdon): Test if app is deployed.
  const getAppUrl = ({ name, version }) => {
    const base = getServiceUrl(config, 'app.server');
    const pathComponents = [base];

    // `wire app serve` always expects /wrn/ to prefix the path of an app to load. That is OK in the production
    // config where we can make it part of the the route, but in development it must be prepended since we don't
    // want to make it part of services.app.server.
    if (!base.startsWith(`/${APP_PATH_PREFIX}`) && !base.endsWith(`/${APP_PATH_PREFIX}`)) {
      pathComponents.push(APP_PATH_PREFIX);
    }

    pathComponents.push(`${name}@${version}`);
    return `${pathComponents.join('/')}/`;
  };

  return (
    <Layout config={config}>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>

        <ControlButtons onStart={handleStart} onStop={handleStop} />
      </Toolbar>

      <Content updated={ts}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell className={classes.colShort}>Version</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.sort(sorter).map(({ id, name, version, attributes:
                { displayName, publicUrl, package: hash } }) => {
                const link = getAppUrl({ id, name, version, publicUrl });

                return (
                  <TableRow key={id} size="small">
                    <TableCell monospace>{name}</TableCell>
                    <TableCell monospace>{version}</TableCell>
                    <TableCell>{displayName}</TableCell>
                    <TableCell monospace>
                      {link && (
                        <Link
                          href={link}
                          target={name}
                          className={available && available.has(hash) ?
                            classes.available : classes.missing}
                        >{link}
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <JsonTreeView data={stats} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Layout>
  );
};

export default Page;
