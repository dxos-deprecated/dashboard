//
// Copyright 2020 DxOS
//

import moment from 'moment';
import superagent from 'superagent';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MuiLink from '@material-ui/core/Link';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import MuiTableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import { Registry } from '@wirelineio/registry-client';

import { request } from '../src/http';
import { withLayout } from '../src/components/Layout';
import AppContext from '../src/components/AppContext';
import Toolbar from '../src/components/Toolbar';
import Json from '../src/components/Json';
import Content from '../src/components/Content';

import Error from '../src/components/Error';
import Timer from '../src/components/Timer';

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

const useStyles = makeStyles(theme => ({
  table: {
    tableLayout: 'fixed'
  },

  colShort: {
    width: 160
  },

  types: {
    display: 'flex',
    flex: 1,
    marginLeft: theme.spacing(3)
  },

  selected: {
    backgroundColor: grey[300]
  }
}));

const types = [
  { key: null, label: 'ALL' },
  { key: 'wrn:bot', label: 'Bot' },
  { key: 'wrn:pad', label: 'Pad' },
  { key: 'wrn:type', label: 'Type' }
];

const Page = () => {
  const { config } = useContext(AppContext);
  const [type, setType] = useState(types[0].key);
  const [status, setStatus] = useState({});
  const [records, setRecords] = useState([]);
  const [error, setError] = useState();
  const classes = useStyles();
  const registry = new Registry(config.wns.endpoint);

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

    registry.queryRecords({ type })
      .then(records => setRecords(records))
      .catch(error => setError(String(error)));
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
  useEffect(() => {
    registry.queryRecords({ type })
      .then(records => setRecords(records))
      .catch(error => setError(String(error)));
  }, [type]);

  const { result, ts } = status;

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
        </div>
        <div className={classes.types}>
          <ButtonGroup
            disableRipple
            disableFocusRipple
            variant="outlined"
            color="primary"
            size="small"
            aria-label="text primary button group"
          >
            {types.map(t => (
              <Button
                key={t.key}
                className={t.key === type && classes.selected}
                onClick={() => setType(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div>
          <MuiLink href={config.wns.console} rel="noreferrer" target="_blank">
            <OpenIcon />
          </MuiLink>
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
