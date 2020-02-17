//
// Copyright 2020 DxOS
//

import moment from 'moment';
import superagent from 'superagent';
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

import { request } from '../src/http';
import AppContext from '../src/components/AppContext';
import Toolbar from '../src/components/Toolbar';
import Json from '../src/components/Json';
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

  const handleRefresh = async () => {
    try {
      const response = await superagent.post(config.wns.endpoint, { query: '{ getStatus { version } }' });
      const { body: { data: { getStatus } } } = response;

      setStatus({ result: { ...getStatus, started: 'true' }, ts: Date.now() });
    } catch (error) {
      console.error(error);
      setStatus({ result: { started: 'false' }, ts: Date.now() });

      if (!String(error).match(/network is offline/)) {
        setError(String(error));
      }
    }

    const recordsResponse = await superagent.post(config.wns.endpoint, { query: `{ queryRecords(attributes:[]) {
      id
      type
      name
      version
    }}` });
    const { body: { data: { queryRecords: records } } } = recordsResponse;

    setRecords(records);
  };

  const handleOpen = () => {
    window.open(config.wns.console, '_blank');
  };

  const handleStart = async () => {
    const { error } = await request('/api/wns?command=start');
    if (error) {
      setError(error);
    } else {
      setError(null);
    }

    await handleRefresh();
  };

  const handleStop = async () => {
    setError(null);
    const { error } = await request('/api/wns?command=shutdown');
    if (error) {
      setError(error);
    }

    await handleRefresh();
  };

  useEffect(() => { handleRefresh(); }, []);

  const { result, ts } = status;

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
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
                <TableCell>Name</TableCell>
                <TableCell className={classes.colShort}>Version</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map(({ id, type, name, version, created }) => (
                <TableRow key={id} size="small">
                  <TableCell>{id}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{version}</TableCell>
                  <TableCell>{moment(created).fromNow()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Json json={result} />
        {ts && <Timer start={ts} />}

        <Error message={error} onClose={() => setError(null)} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
