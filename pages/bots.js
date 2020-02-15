//
// Copyright 2020 DxOS
//

import moment from 'moment';

import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiTableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { createId } from '@wirelineio/crypto';

import { request } from '../src/http';
import Toolbar from '../src/components/Toolbar';
import Content from '../src/components/Content';
import Timer from '../src/components/Timer';
import Error from '../src/components/Error';
import { withLayout } from '../src/components/Layout';

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
  const [status, setStatus] = useState({});
  const [bots, setBots] = useState([]);
  const [error, setError] = useState();
  const { ts } = status;

  const handleRefresh = async () => {
    const { result, error } = await request('/api/bots?command=version');
    if (error) {
      setError(String(error));
    } else {
      setError(null);
      setStatus({ result, ts: Date.now() });
      setBots([
        // TODO(burdon): Test data.
        { id: createId(), type: 'ChessBot', started: moment().subtract(1, 'hour').utc() },
        { id: createId(), type: 'FileBot', started: moment().utc() },
        { id: createId(), type: 'FileBot', started: moment().utc() }
      ]);
    }
  };

  const handleStart = () => {};
  const handleStop = () => {};

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
        </div>
      </Toolbar>

      <Content>
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.colShort}>ID</TableCell>
                <TableCell className={classes.colShort}>Type</TableCell>
                <TableCell>Started</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bots.map(({ id, type, started }) => (
                <TableRow key={id} size="small">
                  <TableCell>{id}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{moment(started).fromNow()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {ts && <Timer start={ts} />}

        <Error message={error} onClose={() => setError(null)} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
