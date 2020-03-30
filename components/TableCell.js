//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';

const TableCell = ({ children, title, ...rest }) => (
  <MuiTableCell
    {...rest}
    style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}
    title={title}
  >
    {children}
  </MuiTableCell>
);

export default TableCell;
