//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';

import Toolbar from '../src/components/Toolbar';
import withLayout from '../src/components/Layout';

const Page = () => {
  const handleRefresh = () => {};

  return (
    <Fragment>
      <Toolbar>
        <Button color="primary" onClick={handleRefresh}>Refresh</Button>
      </Toolbar>
    </Fragment>
  );
};

export default withLayout(Page);
