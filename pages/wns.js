//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import AppContext from '../src/components/AppContext';
import Toolbar from '../src/components/Toolbar';
import { withLayout } from '../src/components/Layout';

const Page = () => {
  const { config } = useContext(AppContext);

  const handleRefresh = () => {};

  const handleOpen = () => {
    window.open(config.wns.console, '_blank');
  };

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
    </Fragment>
  );
};

export default withLayout(Page);
