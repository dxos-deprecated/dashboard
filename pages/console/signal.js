//
// Copyright 2020 DxOS
//

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

import { getDyanmicConfig } from '../../lib/config';
import { httpRequest } from '../../lib/request';
import { ignorePromise } from '../../lib/util';

import Content from '../../components/Content';
import ControlButtons from '../../components/ControlButtons';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import TableCell from '../../components/TableCell';
import Toolbar from '../../components/Toolbar';

const useStyles = makeStyles(() => ({
  table: {
    tableLayout: 'fixed'
  },

  colShort: {
    width: 160
  }
}));

const Page = ({ config }) => {
  const classes = useStyles();
  const [{ ts, result: { version, channels = [] } = {}, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    const status = await httpRequest(config.services.signal.api);
    setStatus(status);
  };

  const handleStart = () => {};
  const handleStop = () => {};

  useEffect(ignorePromise(handleRefresh), []);

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
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.colShort}>Channel</TableCell>
                <TableCell className={classes.colShort}>Peers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {channels.map(({ channel, peers }) => (
                <TableRow key={channel} size="small">
                  <TableCell monospace>{channel}</TableCell>
                  <TableCell monospace>
                    {peers.map(peer => <div key={peer}>{ peer }</div>)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <JsonTreeView data={{ version }} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Layout>
  );
};

Page.getInitialProps = async () => ({ config: await getDyanmicConfig() });

export default Page;
