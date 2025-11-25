import React, { useState, useEffect } from 'react';
import useClientes from '../hooks/useHookCli';
import { getUsuarioActual } from '../services/authService';
import {
  Paper, Typography, TextField, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, InputAdornment, Tooltip, Alert
} from '@mui/material';
import {
  Search as SearchIcon, PersonAdd as PersonAddIcon, Edit as EditIcon,
  Save as SaveIcon, Cancel as CancelIcon, People as PeopleIcon
} from '@mui/icons-material';
import './ClientesPage.css';

const ClientesPage = () => {
  const { clientes, handleSearchClientes, createCliente, updateCliente, requestSort, error: hookError } = useClientes();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ idCliente: '', dni: '', nombre_apellidoCli: '', direccion: '', contacto: '' });

  useEffect(() => {
    const user = getUsuarioActual();
    setIsAdmin(user && user.rol === 'admin');
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = formData.idCliente ? updateCliente(formData.idCliente, formData) : createCliente(formData);
    await action;
    resetForm();
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => setFormData({ idCliente: '', dni: '', nombre_apellidoCli: '', direccion: '', contacto: '' });

  return (
    <div className="page-container">
      <div className="clientes-header">
        <PeopleIcon className="header-icon" />
        <Typography variant="h4" component="h1" className="page-title">Gestión de Clientes</Typography>
      </div>

      {hookError && <Alert severity="error" sx={{ mb: 2 }}>{hookError}</Alert>}

      <Paper elevation={0} className="search-card">
        <TextField
          fullWidth variant="outlined" placeholder="Buscar cliente..." size="small"
          onChange={(e) => handleSearchClientes(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
        />
      </Paper>

      <Paper elevation={0} className="form-card">
        <Typography variant="h6" className="form-title">
          {formData.idCliente ? <EditIcon sx={{ mr: 1 }} /> : <PersonAddIcon sx={{ mr: 1 }} />}
          {formData.idCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}><TextField fullWidth label="DNI" name="dni" size="small" value={formData.dni} onChange={handleInputChange} required /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Nombre" name="nombre_apellidoCli" size="small" value={formData.nombre_apellidoCli} onChange={handleInputChange} required /></Grid>
            <Grid item xs={12} sm={3}><TextField fullWidth label="Dirección" name="direccion" size="small" value={formData.direccion} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={2}><TextField fullWidth label="Contacto" name="contacto" size="small" value={formData.contacto} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
              {formData.idCliente && <Button variant="outlined" color="secondary" onClick={resetForm} startIcon={<CancelIcon />}>Cancelar</Button>}
              <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>{formData.idCliente ? 'Guardar' : 'Registrar'}</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell onClick={() => requestSort('dni')} className="table-header-cell pointer">DNI ↕</TableCell>
              <TableCell onClick={() => requestSort('nombre_apellidoCli')} className="table-header-cell pointer">Nombre ↕</TableCell>
              <TableCell className="table-header-cell">Dirección</TableCell>
              <TableCell className="table-header-cell">Contacto</TableCell>
              {isAdmin && <TableCell align="center" className="table-header-cell">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cli) => (
              <TableRow key={cli.idCliente} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{cli.dni}</TableCell>
                <TableCell>{cli.nombre_apellidoCli}</TableCell>
                <TableCell>{cli.direccion}</TableCell>
                <TableCell>{cli.contacto}</TableCell>
                {isAdmin && (
                  <TableCell align="center">
                    <Tooltip title="Editar"><IconButton className="action-btn-edit" onClick={() => handleEdit(cli)}><EditIcon /></IconButton></Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClientesPage;