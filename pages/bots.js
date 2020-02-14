//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';

import Toolbar from '../src/components/Toolbar';
import withLayout from '../src/components/Layout';

const Page = () => {
  const handleRefresh = () => {};
  const handleStart = () => {};
  const handleStop = () => {};

  return (
    <Fragment>
      <Toolbar>
        <Button color="primary" onClick={handleRefresh}>Refresh</Button>
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleStop}>Stop</Button>
      </Toolbar>
    </Fragment>
  );
};

export default withLayout(Page);
