//
// Copyright 2020 DxOS
//

import moment from 'moment';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import { createId } from '@wirelineio/crypto';

import AppContext from '../src/components/AppContext';
import Toolbar from '../src/components/Toolbar';
import { withLayout } from '../src/components/Layout';
import Content from '../src/components/Content';

import Timer from '../src/components/Timer';
import Error from '../src/components/Error';

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
  const [records, setRecords] = useState([]);
  const [error, setError] = useState();
  const { config } = useContext(AppContext);
  const { ts } = status;

  const handleRefresh = () => {
    setError(null);
    setStatus({});
    setRecords([
      // TODO(burdon): Test data.
      { id: createId(), type: 'ChessBot', created: moment().subtract(1, 'hour').utc() },
      { id: createId(), type: 'FileBot', created: moment().utc() }
    ]);
  };

  const handleOpen = () => {
    window.open(config.wns.console, '_blank');
  };

  useEffect(() => { handleRefresh(); }, []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
        </div>
        <div>
          <IconButton edge="start" color="inherit" aria-label="home" onClick={handleOpen}>
            <OpenIcon />
          </IconButton>
        </div>
      </Toolbar>

      <Content>
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.colShort}>ID</TableCell>
                <TableCell className={classes.colShort}>Type</TableCell>
                <TableCell>Crated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map(({ id, type, created }) => (
                <TableRow key={id} size="small">
                  <TableCell>{id}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{moment(created).fromNow()}</TableCell>
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
