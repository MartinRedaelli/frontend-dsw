import React, { useState, useEffect } from 'react';
import useClients from '../hooks/useClients';
import { getCurrentUser } from '../services/authService';
import {
  Paper, Typography, TextField, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, InputAdornment, Tooltip, Alert
} from '@mui/material';
import {
  Search as SearchIcon, PersonAdd as PersonAddIcon, Edit as EditIcon,
  Save as SaveIcon, Cancel as CancelIcon, People as PeopleIcon
} from '@mui/icons-material';
import '../styles/ClientsPage.css';

const ClientsPage = () => {
  const { clients, handleSearchClients, createClient, updateClient, requestSort, error: hookError } = useClients();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ idCliente: '', dni: '', nombre_apellidoCli: '', direccion: '', contacto: '' });

  useEffect(() => {
    const user = getCurrentUser();
    setIsAdmin(user && user.rol === 'admin');
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = formData.idCliente ? updateClient(formData.idCliente, formData) : createClient(formData);
    await action;
    resetForm();
  };

  const handleEdit = (client) => {
    setFormData(client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => setFormData({ idCliente: '', dni: '', nombre_apellidoCli: '', direccion: '', contacto: '' });

  return (
    <div className="page-container">
      <div className="page-title clients-title">
        <PeopleIcon fontSize="large" className="client-icon" />
        Gestión de Clientes
      </div>

      {hookError && <Alert severity="error" sx={{ mb: 2 }}>{hookError}</Alert>}

      <div className="form-container form-container-client">
        <input
          type="text"
          placeholder="Buscar cliente"
          className="input-filter"
          onChange={(e) => handleSearchClients(e.target.value)}
        />
      </div>

      <div className="form-card form-container-client">
        <Typography variant="h6" className="form-title">
          {formData.idCliente ? <EditIcon sx={{ mr: 1 }} /> : <PersonAddIcon sx={{ mr: 1 }} />}
          {formData.idCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Typography>
        
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-row">
            <div className="form-field">
              <TextField 
                fullWidth 
                label="DNI" 
                name="dni" 
                size="small" 
                value={formData.dni} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-field">
              <TextField 
                fullWidth 
                label="Nombre" 
                name="nombre_apellidoCli" 
                size="small" 
                value={formData.nombre_apellidoCli} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-field">
              <TextField 
                fullWidth 
                label="Dirección" 
                name="direccion" 
                size="small" 
                value={formData.direccion} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-field">
              <TextField 
                fullWidth 
                label="Contacto" 
                name="contacto" 
                size="small" 
                value={formData.contacto} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="form-buttons">
            {formData.idCliente && (
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
              color="primary" 
              sx={{ backgroundColor: '#7e57c2' }}
              startIcon={<SaveIcon />}
            >
              {formData.idCliente ? 'Guardar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="table-responsive">
        <table id="clients-table" className="black-table">
          <thead> 
            <tr>
              <th onClick={() => requestSort('dni')} style={{ cursor: 'pointer', userSelect: 'none' }}>DNI ↕</th>
              <th onClick={() => requestSort('nombre_apellidoCli')} style={{ cursor: 'pointer', userSelect: 'none' }}>Nombre ↕</th>
              <th>Dirección</th>  
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              clients.map((cli) => (
                <tr key={cli.idCliente}>
                  <td style={{ fontWeight: 'bold' }}>{cli.dni}</td>
                  <td>{cli.nombre_apellidoCli}</td>
                  <td>{cli.direccion}</td>
                  <td>{cli.contacto}</td>
                  <td>
                    <button className="btn-edit btn-edit-client" onClick={() => handleEdit(cli)}> Editar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;