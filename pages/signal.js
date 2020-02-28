//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiTableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { noPromise, httpRequest } from '../src/request';
import { withLayout } from '../src/components/Layout';
import AppContext from '../src/components/AppContext';
import Toolbar from '../src/components/Toolbar';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';

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

  const resetError = error => setStatus({ ts, error });

  const handleRefresh = async () => {
    const status = await httpRequest(config.services.signal.server);
    setStatus(status);
  };

  useEffect(noPromise(handleRefresh), []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
        </div>
      </Toolbar>

      <Content>
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
        {ts && <Timer start={ts} />}

        <Error message={error} onClose={resetError} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
