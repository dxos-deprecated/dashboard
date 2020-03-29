//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';

const TableCell = ({ children, ...rest }) => (
  <MuiTableCell
    {...rest}
    style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}
  >
    {children}
  </MuiTableCell>
);

export default TableCell;
