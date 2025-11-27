import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);

  const sendRequest = async (url, method = 'GET', body = null) => {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
    const options = { method, headers, body: body ? JSON.stringify(body) : null };

    try {
      const response = await fetch(url, options);
      if (response.status === 401 || response.status === 403) { logout(); return null; }
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchEmpleados = useCallback(async (nombre = '') => {
    const url = nombre 
      ? `http://localhost:3500/empleados?nombre=${encodeURIComponent(nombre)}`
      : 'http://localhost:3500/empleados';
    const data = await sendRequest(url);
    setEmpleados(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { fetchEmpleados(); }, [fetchEmpleados]);

  const createEmpleado = async (empleado) => {
    await sendRequest('http://localhost:3500/empleados', 'POST', empleado);
    fetchEmpleados();
  };

  const updateEmpleado = async (id, empleado) => {
    await sendRequest(`http://localhost:3500/empleados/${id}`, 'PUT', empleado);
    fetchEmpleados();
  };

  return { empleados, fetchEmpleados, createEmpleado, updateEmpleado, error };
};

export default useEmpleados;