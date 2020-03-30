//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';
import StartIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/HighlightOff';

import { apiRequest } from '../lib/request';
import { useRegistry, withLayout } from '../hooks';
import { ignorePromise } from '../lib/util';

import AppContext from '../components/AppContext';
import Content from '../components/Content';
import Error from '../components/Error';
import Json from '../components/Json';
import TableCell from '../components/TableCell';
import Toolbar from '../components/Toolbar';

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

const Page = () => {
  const { config } = useContext(AppContext);
  const classes = useStyles();
  const [{ ts, result = {}, error }, setStatus] = useState({});
  const [records, setRecords] = useState([]);
  const [links, setLinks] = useState({});
  const { registry } = useRegistry(config);
  const { ...stats } = result;

  const resetError = () => setStatus({ ts, error: undefined });

  const handleRefresh = async () => {
    registry.queryRecords({ type: 'wrn:app' })
      .then(records => setRecords(records))
      .catch(({ errors }) => setStatus({ error: errors }));
  };

  const handleStart = async (name, version) => {
    // TODO(burdon): Frequently hangs (does wire serve detach?)
    const status = await apiRequest('/api/apps', { command: 'start', name, version });
    const { result: { path, port }, ...rest } = status;
    const { protocol, hostname } = window.location;
    const url = `${protocol}//${hostname}:${port || 80}${path}`;
    // TODO(burdon): This will be lost when navigating away.
    setLinks({ ...links, [name]: url });
    setStatus({ result: { url }, ...rest, ts: Date.now() });
  };

  const handlStop = async (name, version) => {
    const status = await apiRequest('/api/apps', { command: 'stop', name, version });
    setStatus({ ...status, ts: Date.now() });
  };

  useEffect(ignorePromise(handleRefresh), []);

  const sorter = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

  const getLink = name => links[name];

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
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell className={classes.colShort}>Version</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Link</TableCell>
                <TableCell className={classes.colShort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {records.sort(sorter).map(({ id, name, version, attributes: { displayName } }) => (
                <TableRow key={id} size="small">
                  <TableCell>{name}</TableCell>
                  <TableCell>{version}</TableCell>
                  <TableCell>{displayName}</TableCell>
                  <TableCell>
                    <Link href={getLink(name)} target={name}>
                      {getLink(name)}
                    </Link>
                  </TableCell>
                  <TableCell className={classes.action}>
                    <IconButton onClick={() => handleStart(name, version)} title="Start">
                      <StartIcon />
                    </IconButton>
                    <IconButton onClick={() => handlStop(name, version)} title="Stop">
                      <StopIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Json json={stats} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
