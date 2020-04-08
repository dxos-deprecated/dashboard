//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { apiRequest } from '../lib/request';
import { getDyanmicConfig } from '../lib/config';

import ControlButtons from '../components/ControlButtons';
import Content from '../components/Content';
import Error from '../components/Error';
import Log from '../components/Log';
import TableCell from '../components/TableCell';
import Toolbar from '../components/Toolbar';
import Layout from '../components/Layout';

const LOG_POLL_INTERVAL = 3 * 1000;

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
  }
}));

const Page = ({ config }) => {
  const classes = useStyles();
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const { bots = [], ...stats } = result;
  const [log, setLog] = useState([]);

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/bots', { command: 'status' });
    setStatus({ ...status, ts: Date.now() });
  };

  const handleStart = async () => {
    const { ts, error } = await apiRequest('/api/bots', { command: 'start' });
    if (error) {
      setStatus({ ts, error });
    } else {
      await handleRefresh();
    }
  };

  const handleStop = async () => {
    const status = await apiRequest('/api/bots', { command: 'stop' });
    setStatus(status);
  };

  const handleLogClear = () => setLog([]);

  useEffect(() => {
    handleRefresh();

    // Polling for logs.
    const logInterval = setInterval(async () => {
      const { result, error } = await apiRequest('/api/bots', { command: 'log' });
      setStatus({ error });
      if (!error) {
        setLog(result);
      }
    }, LOG_POLL_INTERVAL);

    return () => {
      clearInterval(logInterval);
    };
  }, []);

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
                <TableCell>Type</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Spec</TableCell>
                <TableCell>Started</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bots.map(({ type, spec, party, started }, i) => (
                // TODO(burdon): Use id for key.
                <TableRow key={i} size="small">
                  <TableCell>{type}</TableCell>
                  <TableCell>{party}</TableCell>
                  <TableCell>{spec}</TableCell>
                  <TableCell>{moment(started).fromNow()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <JsonTreeView data={stats} />

        <Log log={log} onClear={handleLogClear} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Layout>
  );
};

Page.getInitialProps = async () => ({ config: await getDyanmicConfig() });

export default Page;
