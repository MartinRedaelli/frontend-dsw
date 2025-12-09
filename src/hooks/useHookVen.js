import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, logout } from '../services/authService';

const useVentas = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
 
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 🆕 Nuevos estados para el detalle de la venta
  const [detalleVenta, setDetalleVenta] = useState(null); // Para almacenar el detalle de la venta
  const [loadingDetalle, setLoadingDetalle] = useState(false); // Para el estado de carga del detalle
  const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(null); // ID de la venta cuyo detalle se está cargando
 
  const [sortConfig, setSortConfig] = useState({ key: 'idVenta', direction: 'descending' });

  // Función para obtener la lista de ventas (ya existente)
  const fetchVentas = useCallback(async (filtro = '') => {
    setLoading(true);
    const token = getToken();
    
    // ... (Lógica de fetchVentas) ...
    const params = new URLSearchParams();
    if (filtro) params.append('filtro', filtro);
    params.append('pagina', page);
    params.append('limite', limit);

    const url = `${API_BASE_URL}ventas?${params.toString()}`;

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
      
      if (data.ventas && Array.isArray(data.ventas)) {
          setVentas(data.ventas);
          setTotalVentas(data.total || 0); 
      } else if (Array.isArray(data)) {
          setVentas(data);
          setTotalVentas(data.length);
      } else {
          setVentas([]);
          setTotalVentas(0);
      }
      
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, API_BASE_URL]); 

  const fetchDetalleVenta = useCallback(async (idVenta) => {
    if (!idVenta) {
      setDetalleVenta(null);
      return;
    }
    
    setVentaSeleccionadaId(idVenta);
    setLoadingDetalle(true);
    setDetalleVenta(null); 
    const token = getToken();

    try {
      const response = await fetch(`${API_BASE_URL}ventas/${idVenta}/detalle`, {
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

      if (Array.isArray(data)) {
        setDetalleVenta(data);
      } else {
        console.error('Error: La respuesta de detalle no es un array', data);
        setDetalleVenta([]);
      }
    } catch (error) {
      console.error('Error fetching detalle de venta:', error);
      setDetalleVenta([]);
    } finally {
      setLoadingDetalle(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedVentas = useMemo(() => {
    let items = [...ventas];
    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'fechaHoraVenta') {
            const dateA = new Date(valA);
            const dateB = new Date(valB);
            if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }

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
    return items;
  }, [ventas, sortConfig]);

  return { 
    ventas: sortedVentas, 
    totalVentas,
    page, setPage, limit, setLimit, 
    fetchVentas, 
    requestSort, 
    sortConfig, 
    error, 
    loading,
    detalleVenta,
    loadingDetalle,
    fetchDetalleVenta,
    ventaSeleccionadaId
  };
};

export default useVentas;