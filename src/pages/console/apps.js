//
// Copyright 2020 DxOS
//

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

export { getServerSideProps } from '../../lib/server/config';

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
  }
}));

const Page = ({ config }) => {
  const classes = useStyles();
  const { ifMounted } = useIsMounted();
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const [records, setRecords] = useState([]);
  const { registry } = useRegistry(config);

  const { ...stats } = result;

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = () => {
    registry.queryRecords({ type: 'wrn:app' })
      .then(records => ifMounted(() => setRecords(records)))
      .catch(({ errors }) => ifMounted(() => setStatus({ error: errors })));
  };

  const handleStart = async () => {
    const status = await httpGet('/console/api/apps', { command: 'start' });
    ifMounted(() => {
      setStatus(status);
      handleRefresh();
    });
  };

  const handleStop = async () => {
    const status = await httpGet('/console/api/apps', { command: 'stop' });
    ifMounted(() => {
      setStatus(status);
      handleRefresh();
    });
  };

  useEffect(ignorePromise(handleRefresh), []);

  const sorter = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

  // TODO(burdon): Test if deployed.
  // TODO(burdon): WNS should have path.
  const getAppUrl = name => getServiceUrl(config, 'app.server', { path: name });

  return (
    <Layout config={config}>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>

        <ControlButtons onStart={handleStart} onStop={handleStop}  />
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
              {records.sort(sorter).map(({ id, name, version, attributes: { displayName } }) => {
                const link = getAppUrl(name);

                return (
                  <TableRow key={id} size="small">
                    <TableCell monospace>{name}</TableCell>
                    <TableCell monospace>{version}</TableCell>
                    <TableCell>{displayName}</TableCell>
                    <TableCell monospace>
                      {link && (
                        <Link href={link} target={name}>{link}</Link>
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
