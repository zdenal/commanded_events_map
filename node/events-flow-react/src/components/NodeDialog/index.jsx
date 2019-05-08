import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Highlight from 'react-highlight';

import 'highlight.js/styles/foundation.css';

export default ({node, isOpen, toggle}) => {
  const handleClose = () => {
    toggle(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md">
      <DialogTitle id="alert-dialog-title">{node.id}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Highlight language="elixir">{node.content}</Highlight>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
