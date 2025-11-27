import React, { useState } from 'react';
import useEmpleados from '../hooks/useHookEmp';
import useSucursales from '../hooks/useHookSuc'; 
import {
  Paper, Typography, TextField, Button, Grid, InputAdornment, MenuItem, Alert, Chip
} from '@mui/material';
import {
  Search as SearchIcon, Badge as BadgeIcon, Save as SaveIcon, 
  Cancel as CancelIcon, Edit as EditIcon, Store as StoreIcon
} from '@mui/icons-material';
import './EmpleadosPage.css';

const EmpleadosPage = () => {
  const { empleados, fetchEmpleados, createEmpleado, updateEmpleado, error } = useEmpleados();
  const { sucursales } = useSucursales(); 

  const [formData, setFormData] = useState({
    DNI_CUIL: '', nombre_apellidoEmp: '', contacto: '', sucursal: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await updateEmpleado(formData.DNI_CUIL, formData);
    } else {
      await createEmpleado(formData);
    }
    resetForm();
  };

  const handleEdit = (emp) => {
    setFormData({
      DNI_CUIL: emp.DNI_CUIL,
      nombre_apellidoEmp: emp.nombre_apellidoEmp,
      contacto: emp.contacto,
      sucursal: emp.idSucursal 
    });
    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ DNI_CUIL: '', nombre_apellidoEmp: '', contacto: '', sucursal: '' });
    setIsEditMode(false);
  };

  return (
    <div className="page-container">
      <div className="empleados-header">
        <BadgeIcon className="header-icon-empleado" />
        <Typography variant="h4" component="h1" className="page-title">Gestión de Personal</Typography>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Buscador */}
      <Paper elevation={0} className="search-card" sx={{ mb: 3, p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <TextField
          fullWidth variant="outlined" placeholder="Buscar empleado..." size="small"
          onChange={(e) => fetchEmpleados(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
        />
      </Paper>

      <Paper elevation={0} className="form-card-empleado">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#5e35b1' }}>
          {isEditMode ? 'Editar Empleado' : 'Nuevo Empleado'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="DNI / CUIL" name="DNI_CUIL" size="small" value={formData.DNI_CUIL} onChange={handleInputChange} required disabled={isEditMode} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Nombre Completo" name="nombre_apellidoEmp" size="small" value={formData.nombre_apellidoEmp} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Contacto" name="contacto" size="small" value={formData.contacto} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField select fullWidth label="Sucursal" name="sucursal" size="small" value={formData.sucursal} onChange={handleInputChange} required>
                {sucursales.map((suc) => (
                  <MenuItem key={suc.idSucursal} value={suc.idSucursal}>{suc.nombreSucursal}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {isEditMode && <Button variant="outlined" color="secondary" onClick={resetForm} startIcon={<CancelIcon />}>Cancelar</Button>}
              <Button type="submit" variant="contained" sx={{ bgcolor: '#5e35b1' }} startIcon={<SaveIcon />}>{isEditMode ? 'Modificar' : 'Ingresar'}</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <div className="card-container">
        {empleados.map((emp) => (
          <div key={emp.DNI_CUIL} className="card">
            <h3 className="card-title">{emp.nombre_apellidoEmp}</h3>
            <div className="card-text">
              <p><strong>DNI:</strong> {emp.DNI_CUIL}</p>
              <p><strong>Contacto:</strong> {emp.contacto}</p>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                <StoreIcon fontSize="small" />
                <span>{emp.nombreSucursal || 'Sin asignar'}</span>
              </div>
            </div>
            <div className="card-button-container">
              <button className="card-button" onClick={() => handleEdit(emp)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <EditIcon fontSize="small" /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpleadosPage;