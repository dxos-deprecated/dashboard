//
// Copyright 2019 DxOS
//

import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
  },

  palette: {
    primary: blueGrey,
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

// 475080
