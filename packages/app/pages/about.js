//
// Copyright 2020 DxOS
//

import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';

import withLayout from '../src/components/Layout';

const Page = () => (
  <Fragment>
    <Typography>About XBox</Typography>
  </Fragment>
);

export default withLayout(Page);
