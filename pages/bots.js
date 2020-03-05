//
// Copyright 2020 DxOS
//

import moment from 'moment';

import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiTableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { createId } from '@dxos/crypto';

import { apiRequest } from '../src/request';
import { withLayout } from '../src/components/Layout';
import Toolbar from '../src/components/Toolbar';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';

const LOG_POLL_INTERVAL = 3 * 1000;

const TableCell = ({ children, ...rest }) => (
  <MuiTableCell
    {...rest}
    style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
  >
    {children}
  </MuiTableCell>
);

const useStyles = makeStyles(() => ({
  table: {
    tableLayout: 'fixed'
  },

  colShort: {
    width: 160
  }
}));

const Page = () => {
  const classes = useStyles();
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const { bots = [], ...stats } = result;
  const [log, setLog] = useState([]);

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/bots?command=status');
    setStatus({ ...status, ts: Date.now() });
  };

  const handleStart = async () => {
    const { ts, error } = await apiRequest('/api/bots?command=start');
    if (error) {
      setStatus({ ts, error });
    } else {
      await handleRefresh();
    }
  };

  const handleStop = async () => {
    const status = await apiRequest('/api/bots?command=shutdown');
    setStatus(status);
  };

  useEffect(() => {
    handleRefresh();

    // Polling for logs.
    const logInterval = setInterval(async () => {
      const { result } = await apiRequest('/api/bots?command=log');
      setLog(result);
    }, LOG_POLL_INTERVAL);

    return () => {
      clearInterval(logInterval);
    };
  }, []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
        </div>
      </Toolbar>

      <Content updated={ts}>
        <TableContainer>
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
              {bots.map(({ type, spec, party, started }) => (
                <TableRow key={createId()} size="small">
                  <TableCell>{type}</TableCell>
                  <TableCell>{party}</TableCell>
                  <TableCell>{spec}</TableCell>
                  <TableCell>{moment(started).fromNow()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Json json={stats} />

        <div>
          { log && log.map((line, i) => <div key={i} className={classes.log}>{line}</div>) }
        </div>
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
