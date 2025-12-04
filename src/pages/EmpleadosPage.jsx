import React, { useState } from 'react';
import useEmpleados from '../hooks/useHookEmp';
import useSucursales from '../hooks/useHookSuc'; 
import {
  Paper, Typography, TextField, Button, Grid, InputAdornment, MenuItem, Alert, Chip
} from '@mui/material';
import {
  Search as SearchIcon, Badge as BadgeIcon, Save as SaveIcon, 
  Cancel as CancelIcon, Edit as EditIcon, Store as StoreIcon, PersonAdd as PersonAddIcon 
} from '@mui/icons-material';

import '../styles/EmpleadosPage.css';

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
      <div className="page-title">
  <BadgeIcon fontSize="large" className="empleado-icon" />
  <span>Gestión de Personal</span>
</div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <div className="form-container form-container-empleado">
  <input
    type="text"
    placeholder="Buscar empleado"
    className="input-filtro"
    onChange={(e) => fetchEmpleados(e.target.value)}
  />
</div>

      <div className="form-card form-container-empleado">
  <Typography variant="h6" className="form-title">
    {isEditMode ? (
      <>
        <EditIcon sx={{ mr: 1 }} />
        Editar Empleado
      </>
    ) : (
      <>
        <PersonAddIcon sx={{ mr: 1 }} /> 
        Nuevo Empleado
      </>
    )}
  </Typography>
  
  <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField 
          fullWidth 
          label="DNI / CUIL" 
          name="DNI_CUIL" 
          size="small" 
          value={formData.DNI_CUIL} 
          onChange={handleInputChange} 
          required 
          disabled={isEditMode}
          className="form-field"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField 
          fullWidth 
          label="Nombre Completo" 
          name="nombre_apellidoEmp" 
          size="small" 
          value={formData.nombre_apellidoEmp} 
          onChange={handleInputChange} 
          required
          className="form-field"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField 
          fullWidth 
          label="Contacto" 
          name="contacto" 
          size="small" 
          value={formData.contacto} 
          onChange={handleInputChange}
          className="form-field"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField 
          select 
          fullWidth 
          label="Sucursal" 
          name="sucursal" 
          size="small" 
          value={formData.sucursal} 
          onChange={handleInputChange} 
          required
          className="form-field"
        >
          {sucursales.map((suc) => (
            <MenuItem key={suc.idSucursal} value={suc.idSucursal}>
              {suc.nombreSucursal}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      
      <Grid item xs={12} className="form-buttons">
        {isEditMode && (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={resetForm} 
            startIcon={<CancelIcon />}
            className="btn-cancel"
          >
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          className="btn-submit"
          startIcon={<SaveIcon />}
          sx={{ backgroundColor: '#ff9800' }}
        >
          {isEditMode ? 'Modificar' : 'Ingresar'}
        </Button>
      </Grid>
    </Grid>
  </form>
</div>

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