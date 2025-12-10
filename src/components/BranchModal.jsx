import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import '../styles/BranchModal.css';

const BranchModal = ({ open, onClose, branch }) => {
  if (!branch) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {branch.nombreSucursal}
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>ID Sistema:</strong> #{branch.idSucursal}
        </Typography>
        <Typography variant="body1">
          <strong>Dirección:</strong> {branch.direccion}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BranchModal;