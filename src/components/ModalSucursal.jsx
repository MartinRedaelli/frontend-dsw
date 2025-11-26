import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ModalSucursal = ({ open, onClose, sucursal }) => {
  if (!sucursal) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {sucursal.nombreSucursal}
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>ID Sistema:</strong> #{sucursal.idSucursal}
        </Typography>
        <Typography variant="body1">
          <strong>Dirección:</strong> {sucursal.direccion}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalSucursal;