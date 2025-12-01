import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, logout } from '../services/authService';

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  
  const [sortConfig, setSortConfig] = useState({ key: 'idVenta', direction: 'descending' });

  const fetchVentas = useCallback(async (filtro = '') => {
    const token = getToken();
    
    const url = filtro 
      ? `http://localhost:3500/ventas?filtro=${encodeURIComponent(filtro)}`
      : 'http://localhost:3500/ventas';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();
      
      setVentas(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
      setVentas([]);
    }
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Logica para ordenar
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedVentas = useMemo(() => {
    let itemsOrdenados = [...ventas];
    if (sortConfig.key !== null) {
      itemsOrdenados.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];


        if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
            valA = Number(valA);
            valB = Number(valB);
        } else {

              valA = valA ? valA.toString().toLowerCase() : '';
              valB = valB ? valB.toString().toLowerCase() : '';
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return itemsOrdenados;
  }, [ventas, sortConfig]);

  return { 
    ventas: sortedVentas,
    fetchVentas,
    requestSort,
    sortConfig,
    error 
  };
};

export default useVentas;