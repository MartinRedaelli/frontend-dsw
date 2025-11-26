import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

const useSucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState(null);

  const sendRequest = async (url, method = 'GET', body = null) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const options = { method, headers, body: body ? JSON.stringify(body) : null };

    try {
      const response = await fetch(url, options);

      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }

      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (err) {
      console.error('Error en sendRequest:', err);
      setError(err.message);
      return null;
    }
  };

  const fetchSucursales = useCallback(async (filtro = '') => {
    const url = filtro 
      ? `http://localhost:3500/sucursales?filtro=${encodeURIComponent(filtro)}`
      : 'http://localhost:3500/sucursales';
    
    const data = await sendRequest(url);
    setSucursales(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  return {
    sucursales,
    fetchSucursales,
    error
  };
};

export default useSucursales;