//
// Copyright 2020 DxOS
//

import React from 'react';

import YesIcon from '@material-ui/icons/CheckCircleOutline';
import NoIcon from '@material-ui/icons/RadioButtonUnchecked';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

// TODO(telackey): Use theme colors.
export const BooleanIcon = ({ yes = false, error = false }) => {
  return (yes
    ? <YesIcon style={{ color: green[500] }} />
    : <NoIcon style={{ color: error ? red[500] : 'transparent' }} />
  );
};
