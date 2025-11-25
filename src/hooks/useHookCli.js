import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'idCliente', direction: 'ascending' });
  const [error, setError] = useState(null);

  const sendRequest = async (url, method = 'GET', body = null) => {
    const token = getToken();
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: body ? JSON.stringify(body) : null
    };

    try {
      const response = await fetch(url, options);
      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error(err);
      return null;
    }
  };

  const fetchClientes = useCallback(async (nombre = '') => {
    const url = nombre 
      ? `http://localhost:3500/clientes?nombre=${encodeURIComponent(nombre)}`
      : 'http://localhost:3500/clientes';

    const data = await sendRequest(url);
    setClientes(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const createCliente = async (cliente) => {
    await sendRequest('http://localhost:3500/clientes', 'POST', cliente);
    fetchClientes();
  };

  const updateCliente = async (id, cliente) => {
    await sendRequest(`http://localhost:3500/clientes/${id}`, 'PUT', cliente);
    fetchClientes();
  };

  const requestSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'ascending') ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const sortedClientes = [...clientes].sort((a, b) => {
    const valA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
    const valB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
    
    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  return {
    clientes: sortedClientes,
    fetchClientes,
    handleSearchClientes: fetchClientes,
    createCliente,
    updateCliente,
    requestSort,
    error
  };
};

export default useClientes;