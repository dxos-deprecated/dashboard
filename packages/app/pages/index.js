//
// Copyright 2020 Wireline, Inc.
//

import IpfsHttpClient, { urlSource } from 'ipfs-http-client';

import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import withLayout from '../src/components/Layout';

const Page = () => {
  const [value, setValue] = React.useState(null);

  const handleTest = async () => {
    // Set-up CORS
    // https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
    // https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
    // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
    const ipfs = IpfsHttpClient('/ip4/127.0.0.1/tcp/5001');
    const config = await ipfs.id();
    setValue(config);

    // TODO(burdon): Link to Web UI.
    // http://127.0.0.1:5001/webui
    // https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
    const data = await urlSource('https://ipfs.io/images/ipfs-logo.svg');
    const hash = await ipfs.add(data);
    console.log(hash, data);
  };

  // TODO(burdon): JSON view.

  return (
    <Fragment>
      <Typography variant="h5">Diagnostics</Typography>

      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Button variant="contained" onClick={handleTest}>Test IPFS</Button>
              </TableCell>
              <TableCell>
                <pre>{value && JSON.stringify(value)}</pre>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default withLayout(Page);
