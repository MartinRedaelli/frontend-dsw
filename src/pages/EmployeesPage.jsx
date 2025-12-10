import React, { useState } from 'react';
import useEmployees from '../hooks/useEmployees';
import useBranches from '../hooks/useBranches';
import useRoles from '../hooks/useRoles';

import {
  Typography, TextField, Button, Grid, MenuItem, Alert
} from '@mui/material';

import {
  Badge as BadgeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Store as StoreIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

import '../styles/EmployeesPage.css';

const EmployeesPage = () => {
  const { employees, loading, error, createEmployee, updateEmployee, fetchEmployees } = useEmployees();
  const { branches } = useBranches();
  const { roles } = useRoles();

  const [formData, setFormData] = useState({
    DNI_CUIL: '',
    nombre_apellidoEmp: '',
    contacto: '',
    sucursal: '',
    email: '',
    password: '',
    rol: '' 
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      rol: Number(formData.rol),
      sucursal: Number(formData.sucursal) 
    };

    console.log("Data to send to backend:", dataToSend);

    try {
      if (isEditMode) {
        await updateEmployee(dataToSend.DNI_CUIL, dataToSend);
      } else {
        await createEmployee(dataToSend);
      }
      resetForm();
    } catch (err) {
      console.error("Error sending employee:", err);
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      DNI_CUIL: emp.DNI_CUIL,
      nombre_apellidoEmp: emp.nombre_apellidoEmp,
      contacto: emp.contacto,
      sucursal: emp.idSucursal,
      email: emp.email,
      password: "",
      rol: emp.idRol
    });

    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      DNI_CUIL: '',
      nombre_apellidoEmp: '',
      contacto: '',
      sucursal: '',
      email: '',
      password: '',
      rol: ''
    });
    setIsEditMode(false);
  };

  return (
    <div className="page-container">

      <div className="page-title">
        <BadgeIcon fontSize="large" className="employee-icon" />
        <span>Gestión de Personal</span>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <div className="form-container form-container-employee">
        <input
          type="text"
          placeholder="Buscar empleado"
          className="input-filter"
          onChange={(e) => fetchEmployees(e.target.value)}
        />
      </div>

      <div className="form-card form-container-employee">
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
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.idSucursal} value={branch.idSucursal}>
                    {branch.nombreSucursal}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                size="small"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                size="small"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditMode}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Rol"
                name="rol"
                size="small"
                value={formData.rol}
                onChange={handleInputChange}
                required
              >
              {roles.map((roleItem, index) => (
                <MenuItem key={`${roleItem.idrol}-${index}`} value={roleItem.idrol}>
                  {roleItem.rol}
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
                >
                  Cancelar
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ backgroundColor: '#ff9800' }}
              >
                {isEditMode ? 'Modificar' : 'Registrar'}
              </Button>
            </Grid>

          </Grid>
        </form>
      </div>

      <div className="card-container">
        {!loading && employees.map((emp) => (
          <div key={emp.DNI_CUIL} className="card">
            <h3 className="card-title">{emp.nombre_apellidoEmp}</h3>
            <p><strong>DNI:</strong> {emp.DNI_CUIL}</p>
            <p><strong>Contacto:</strong> {emp.contacto}</p>

            <p><strong>Rol:</strong> {emp.rol}</p>

            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <StoreIcon fontSize="small" />
              <span>{emp.nombreSucursal}</span>
            </div>

            <div className="card-button-container">
              <button
                className="card-button"
                onClick={() => handleEdit(emp)}
              >
                <EditIcon fontSize="small" /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EmployeesPage;