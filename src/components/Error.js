//
// Copyright 2020 DxOS
//

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const Error = ({ message, ...rest }) => {
  return (
    <Snackbar
      open={Boolean(message)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionProps={{ exit: false }}
    >
      <Alert severity="error" {...rest}>{message}</Alert>
    </Snackbar>
  );
};

export default Error;
