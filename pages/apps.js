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

import { getDyanmicConfig, getServiceUrl } from '../lib/config';
import { apiRequest } from '../lib/request';
import { ignorePromise, joinUrl } from '../lib/util';
import { useRegistry } from '../hooks';

import Content from '../components/Content';
import Error from '../components/Error';
import JsonTreeView from '../components/JsonTreeView';
import TableCell from '../components/TableCell';
import Toolbar from '../components/Toolbar';
import Layout from '../components/Layout';
import ControlButtons from '../components/ControlButtons';

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
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const [apps, setApps] = useState([]);
  const [records, setRecords] = useState([]);
  const { registry } = useRegistry(config);

  const { ...stats } = result;

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    registry.queryRecords({ type: 'wrn:app' })
      .then(records => setRecords(records))
      .catch(({ errors }) => setStatus({ error: errors }));

    const status = await apiRequest('/api/apps', { command: 'list' });
    const { result: { apps }, ...rest } = status;

    const appMap = apps.reduce((map, { wrn, port, path }) => {
      map[wrn] = { port, path };
      return map;
    }, {});

    setApps(appMap);
    setStatus(rest);
  };

  const handleStart = async () => {
    const status = await apiRequest('/api/apps', { command: 'start' });
    setStatus({ ...status, ts: Date.now() });
    await handleRefresh();
  };

  const handleStop = async () => {
    const status = await apiRequest('/api/apps', { command: 'stop' });
    setStatus({ ...status, ts: Date.now() });
    await handleRefresh();
  };

  useEffect(ignorePromise(handleRefresh), []);

  const sorter = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

  const getLink = name => {
    const appRecord = apps[`wrn:app:${name}`];
    if (appRecord) {
      const { path } = appRecord;
      return getServiceUrl(joinUrl('app.server', path));
    }
  };

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
                const link = getLink(name);

                return (
                  <TableRow key={id} size="small">
                    <TableCell>{name}</TableCell>
                    <TableCell>{version}</TableCell>
                    <TableCell>{displayName}</TableCell>
                    <TableCell>
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

Page.getInitialProps = async () => ({ config: await getDyanmicConfig() });

export default Page;
