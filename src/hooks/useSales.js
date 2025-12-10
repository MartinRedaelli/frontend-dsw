import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, logout } from '../services/authService';

const useSales = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [saleDetail, setSaleDetail] = useState(null); 
  const [loadingDetail, setLoadingDetail] = useState(false); 
  const [selectedSaleId, setSelectedSaleId] = useState(null); 
  
  const [sortConfig, setSortConfig] = useState({ key: 'idVenta', direction: 'descending' });

  const fetchSales = useCallback(async (filter = '') => {
    setLoading(true);
    const token = getToken();
    
    const params = new URLSearchParams();
    if (filter) params.append('filtro', filter);
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
          setSales(data.ventas);
          setTotalSales(data.total || 0); 
      } else if (Array.isArray(data)) {
          setSales(data);
          setTotalSales(data.length);
      } else {
          setSales([]);
          setTotalSales(0);
      }
      
    } catch (err) {
      console.error(err);
      setError('Connection error');
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, API_BASE_URL]); 

  const fetchSaleDetail = useCallback(async (saleId) => {
    if (!saleId) {
      setSaleDetail(null);
      return;
    }
    
    setSelectedSaleId(saleId);
    setLoadingDetail(true);
    setSaleDetail(null); 
    const token = getToken();

    try {
      const response = await fetch(`${API_BASE_URL}ventas/${saleId}/detalle`, {
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
        setSaleDetail(data);
      } else {
        console.error('Error: Detail response is not an array', data);
        setSaleDetail([]);
      }
    } catch (error) {
      console.error('Error fetching sale detail:', error);
      setSaleDetail([]);
    } finally {
      setLoadingDetail(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedSales = useMemo(() => {
    let items = [...sales];
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
  }, [sales, sortConfig]);

  return { 
    sales: sortedSales, 
    totalSales,
    page, setPage, limit, setLimit, 
    fetchSales, 
    requestSort, 
    sortConfig, 
    error, 
    loading,
    saleDetail,
    loadingDetail,
    fetchSaleDetail,
    selectedSaleId
  };
};

export default useSales;