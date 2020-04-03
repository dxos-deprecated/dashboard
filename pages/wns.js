//
// Copyright 2020 DxOS
//

import get from 'lodash.get';
import moment from 'moment';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import RefreshIcon from '@material-ui/icons/Refresh';

import { apiRequest } from '../lib/request';
import { withLayout, useRegistry, useIsMounted } from '../hooks';

import AppContext from '../components/AppContext';
import ControlButtons from '../components/ControlButtons';
import Content from '../components/Content';
import Error from '../components/Error';
import JsonTreeView from '../components/JsonTreeView';
import Log from '../components/Log';
import Section from '../components/Section';
import TableCell from '../components/TableCell';
import Toolbar from '../components/Toolbar';
import { ignorePromise, safeParseJson } from '../lib/util';

const LOG_POLL_INTERVAL = 3 * 1000;

const useStyles = makeStyles(theme => ({
  buttons: {
    marginLeft: theme.spacing(2)
  },

  tableContainer: {
    flex: 1,
    overflowY: 'scroll'
  },

  table: {
    tableLayout: 'fixed',

    '& th': {
      fontVariant: 'all-small-caps',
      fontSize: 18,
      cursor: 'ns-resize'
    }
  },

  colShort: {
    width: 160
  },

  selected: {},
}));

const types = [
  { key: null, label: 'ALL' },
  { key: 'wrn:app', label: 'App' },
  { key: 'wrn:bot', label: 'Bot' },
  { key: 'wrn:bot-factory', label: 'Bot Factory' },
  { key: 'wrn:type', label: 'Type' }
];

/**
 * Render IPFS links in package.
 * @param {string} ipfsConsoleUrl
 * @param {string} type
 * @param {string} pkg
 */
const PackageLink = ({ ipfsConsoleUrl, type, pkg }) => {
  const obj = safeParseJson(pkg);

  if (!obj) {
    // Not an object, must be a CID.
    return <Link href={`${ipfsConsoleUrl}/#/explore/${pkg}`} target="ipfs">{pkg}</Link>;
  }

  // eslint-disable-next-line default-case
  switch (type) {
    case 'wrn:bot': {
      const packageLinks = [];

      Object.keys(obj).forEach(platform => {
        Object.keys(obj[platform]).forEach(arch => {
          const cid = obj[platform][arch];
          packageLinks.push(
            <Fragment>
              <Link key={cid} href={`${ipfsConsoleUrl}/#/explore/${cid}`} title={cid} target="ipfs">{platform}/{arch}: {cid}</Link>
              <br />
            </Fragment>
          );
        });
      });

      return <Fragment>{packageLinks}</Fragment>;
    }
  }

  return null;
};

const Page = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const { config } = useContext(AppContext);
  const [{ ts, result, error } = {}, setStatus] = useState({});
  const [type, setType] = useState(types[0].key);
  const [records, setRecords] = useState([]);
  const [log, setLog] = useState([]);
  const [{ sort, ascend }, setSort] = useState({ sort: 'type', ascend: true });
  const [ipfsConsoleUrl, setIpfsConsoleUrl] = useState();
  const { registry, endpoint, local } = useRegistry(config);

  const handleRefresh = async () => {
    // TODO(burdon): Format records.
    registry.getStatus()
      .then(result => {
        if (isMounted.current) {
          setStatus({ ts: Date.now(), result });
        }
      })
      .catch(() => {
        // TODO(burdon): Should return an Error.
        // const errors = [new Error('HTTP Error')];
        const errors = [{ message: 'HTTP Error' }];
        if (isMounted.current) {
          setStatus({ ts: Date.now(), error: errors.map(({ message }) => message) });
        }
      });

    registry.queryRecords({ type })
      .then(records => {
        if (isMounted.current) {
          setRecords(records);
        }
      })
      .catch(() => {
        // TODO(burdon): Should return an Error.
        const errors = [{ message: 'HTTP Error' }];
        if (isMounted.current) {
          setStatus({ error: errors.map(({ message }) => message) });
        }
      });

    const { result } = await apiRequest('/api/ipfs', { command: 'webui' });
    setIpfsConsoleUrl(result);
  };

  const handleStart = !local ? undefined : async () => {
    const { ts, error } = await apiRequest('/api/wns', { command: 'start' });
    if (error) {
      setStatus({ ts, error });
    } else {
      await handleRefresh();
    }
  };

  const handleStop = !local ? undefined : async () => {
    const status = await apiRequest('/api/wns', { command: 'shutdown' });
    setStatus(status);
  };

  const handleOpen = () => {
    window.open(endpoint, '_wns_');
  };

  // TODO(burdon): Set polling timestamp to now.
  const handleLogClear = () => setLog([]);

  const handleResetErrors = () => setStatus({ ts, result, error: undefined });

  useEffect(ignorePromise(handleRefresh), [type]);

  // Polling for logs.
  if (local) {
    useEffect(() => {
      const logInterval = setInterval(async () => {
        const { result = [] } = await apiRequest('/api/wns', { command: 'log' });
        setLog(result);
      }, LOG_POLL_INTERVAL);

      return () => {
        clearInterval(logInterval);
      };
    }, []);
  }

  // TODO(burdon): Factor out.
  const sortBy = field => () => setSort({ sort: field, ascend: (field === sort ? !ascend : true) });
  const sorter = (item1, item2) => {
    const a = get(item1, sort);
    const b = get(item2, sort);
    const dir = ascend ? 1 : -1;
    return (a < b) ? -1 * dir : (a > b) ? dir : 0;
  };

  return (
    <Fragment>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
          <ButtonGroup
            className={classes.buttons}
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

        <ControlButtons onStart={handleStart} onStop={handleStop} onOpen={handleOpen} />
      </Toolbar>

      <Content updated={ts}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell onClick={sortBy('type')} className={classes.colShort}>Type</TableCell>
                <TableCell onClick={sortBy('name')}>Name</TableCell>
                <TableCell onClick={sortBy('version')} className={classes.colShort}>Version</TableCell>
                <TableCell onClick={sortBy('attributes.displayName')}>Description</TableCell>
                <TableCell onClick={sortBy('attributes.package')}>Package Hash</TableCell>
                <TableCell onClick={sortBy('createTime')} className={classes.colShort}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.sort(sorter)
                .map(({ id, type, name, version, createTime, attributes: { displayName, package: pkg } }) => (
                  <TableRow key={id} size="small">
                    <TableCell>{type}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{version}</TableCell>
                    <TableCell>{displayName}</TableCell>
                    <TableCell title={pkg}>
                      {pkg && <PackageLink ipfsConsoleUrl={ipfsConsoleUrl} type={type} pkg={pkg} />}
                    </TableCell>
                    <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Section label="Properties">
          <JsonTreeView data={result} expanded={['sync']} label="status" />
        </Section>

        {local && (
          <Section label="Log">
            <Log log={log} onClear={handleLogClear} />
          </Section>
        )}
      </Content>

      <Error message={error} onClose={handleResetErrors} />
    </Fragment>
  );
};

export default withLayout(Page);
