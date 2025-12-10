import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

const useBranches = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      console.error('Error in sendRequest:', err);
      setError(err.message);
      return null;
    }
  };

  const fetchBranches = useCallback(async (filter = '') => {
    setLoading(true);
    setError(null);
    
    const url = filter 
      ? `${API_BASE_URL}sucursales?filtro=${encodeURIComponent(filter)}`
      : `${API_BASE_URL}sucursales`;
    
    const data = await sendRequest(url);
    
    if (Array.isArray(data)) {
      setBranches(data);
    } else if (data && Array.isArray(data.sucursales)) {

      setBranches(data.sucursales);
    } else if (data && data.sucursal) {

      setBranches([data.sucursal]);
    } else {
      setBranches([]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    loading,
    error,
    fetchBranches
  };
};

export default useBranches;