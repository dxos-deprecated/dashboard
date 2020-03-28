//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MuiTableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';

import { noPromise, httpRequest } from '../lib/request';
import { withLayout } from '../hooks';

import AppContext from '../components/AppContext';
import Toolbar from '../components/Toolbar';
import Content from '../components/Content';
import Error from '../components/Error';
import Json from '../components/Json';

const TableCell = ({ children, ...rest }) => (
  <MuiTableCell
    {...rest}
    style={{
      overflow: 'hidden',
      verticalAlign: 'top',
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
  const { config } = useContext(AppContext);
  const [{ ts, result: { version, channels = [] } = {}, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    const status = await httpRequest(config.services.signal.server);
    setStatus(status);
  };

  useEffect(noPromise(handleRefresh), []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>
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
                  <TableCell>{channel}</TableCell>
                  <TableCell>
                    {peers.map(peer => <div key={peer}>{ peer }</div>)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Json json={{ version }} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
