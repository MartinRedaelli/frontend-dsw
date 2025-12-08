import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';


const useRoles = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
const ROLES_API_URL = `${API_BASE_URL}/roles`;
 
const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [errorRoles, setErrorRoles] = useState(null);

  const sendRequest = useCallback(async (url, method = 'GET', body = null) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };

    try {
      const response = await fetch(url, options);

      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Sesión expirada o no autorizada.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.statusText);
      }

      if (response.status === 204) return {};

      return await response.json();

    } catch (err) {
      console.error('Error en sendRequest (Roles):', err.message);
      throw err;
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    setErrorRoles(null);

    try {
      const data = await sendRequest(ROLES_API_URL);

      const normalized =
        Array.isArray(data) ? data :
        data ? [data] : [];

      setRoles(normalized);

    } catch (err) {
      setErrorRoles('Error al cargar roles: ' + err.message);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  }, [sendRequest]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loadingRoles,
    errorRoles,
    fetchRoles
  };
};

export default useRoles;
