//
// Copyright 2020 DxOS
//

import superagent from 'superagent';
import IpfsHttpClient from 'ipfs-http-client';

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import withLayout from '../src/components/Layout';
import Timer from '../src/components/Timer';
import Json from '../src/components/Json';

const Button = withStyles({
  root: {
    width: 160
  },

  label: {
    textTransform: 'capitalize',
  }
})(MuiButton);

const Page = () => {
  const [value, setValue] = React.useState({});

  // Call API.
  const fetch = (url) => superagent.get(url)
    .then(({ body }) => ({ result: body }))
    .catch(({ response: { statusText } }) => ({ error: statusText }));

  const tests = [
    {
      key: 'test',
      title: 'Test API',
      handler: async () => {
        // https://www.npmjs.com/package/superagent
        const result = await superagent.get('/api/status');
        const { text } = result;
        return { result: JSON.parse(text) };
      }
    },
    {
      key: 'ipfs_status',
      title: 'IPFS Status',
      handler: async () => {
        // Set-up CORS
        // https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
        // https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
        // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
        // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
        try {
          const ipfs = IpfsHttpClient('/ip4/127.0.0.1/tcp/5001');
          const status = await ipfs.id();
          status.addresses = status.addresses.map(address => String(address));
          return { result: status };
        } catch (error) {
          return { error: String(error) };
        }

        // TODO(burdon): Link to Web UI.
        // http://127.0.0.1:5001/webui
        // https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
        // const data = await IpfsHttpClient.urlSource('https://ipfs.io/images/ipfs-logo.svg');
        // const hash = await ipfs.add(data);
        // console.log(hash, data);
      }
    },
    {
      key: 'ipfs_version',
      title: 'IPFS Version',
      handler: async () => {
        return fetch('/api/ipfs?command=version');
      }
    },
    {
      key: 'ipfs_start',
      title: 'IPFS Start',
      handler: async () => {
        return fetch('/api/ipfs?command=start');
      }
    },
    {
      key: 'ipfs_shutdown',
      title: 'IPFS Shutdown',
      handler: async () => {
        return fetch('/api/ipfs?command=shutdown');
      }
    },
  ];

  const exec = async (key, handler) => {
    await setValue({ ...value, [key]: { refresh: null } });
    await setValue({ ...value, [key]: { ...await handler(), refresh: Date.now() } });
  };

  return (
    <Fragment>
      <Typography variant="h5">Diagnostics</Typography>

      <TableContainer>
        <Table aria-label="simple table" size="small" style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 200 }}>Test</TableCell>
              <TableCell>Result</TableCell>
              <TableCell style={{ width: 200 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map(({ key, title, handler }) => {
              const { result, error, refresh } = value[key] || {};

              return (
                <TableRow key={key}>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    <Button
                      onClick={() => exec(key, handler)}
                      variant="contained"
                    >
                      {title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {error ? (
                      <pre>{error}</pre>
                    ) : (
                      <Json json={result} />
                    )}
                  </TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    {refresh && <Timer start={refresh} />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default withLayout(Page);
