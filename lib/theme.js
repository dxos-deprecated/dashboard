//
// Copyright 2019 DxOS
//

import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
  },

  palette: {
    primary: blue,
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          margin: 0,
          overflow: 'hidden'
        }
      }
    }
  }
});

export default theme;
