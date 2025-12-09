import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

function useStock() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const [productos, setProductos] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [formData, setFormData] = useState({
    articulo: '',
    descripcion: '',
    cantidad: '',
    monto: '',
    idProducto: '',
  });
  const [filters, setFilters] = useState({
    estado: 'Disponible',
    nombreProducto: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: 'idProducto', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const sendRequest = async (url, method = 'GET', body = null) => {
    const token = getToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };

  const fetchProductos = useCallback(async () => {
    const nombreProducto = filters.nombreProducto || '';
    const maxLimit = 40;  
    const minLimit = 5;
    const validatedLimit = limit > maxLimit ? maxLimit : (limit < minLimit ? minLimit : limit);
    
    const totalPages = Math.ceil(totalProductos / validatedLimit) || 1;
    const validatedPage = page >= totalPages ? totalPages - 1 : (page < 0 ? 0 : page);
  
    const url = `${API_BASE_URL}stock?producto=${encodeURIComponent(nombreProducto)}&pagina=${validatedPage}&limite=${validatedLimit}`;
  
    try {
      const data = await sendRequest(url);
      
      if (data && Array.isArray(data.productos)) {
        setProductos(data.productos);
        setTotalProductos(data.totalProductos);
      } else if (data) {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }, [page, limit, filters, totalProductos]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setPage(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.idProducto ? updateProducto(formData.idProducto, formData) : createProducto(formData);
  };

  const createProducto = (producto) => {
    sendRequest('`${API_BASE_URL}stock', 'POST', producto)
      .then(() => {
        fetchProductos();
        resetForm();
      })
      .catch((error) => console.error('Error al ingresar el producto:', error));
  };

  const updateProducto = (id, producto) => {
    sendRequest(`${API_BASE_URL}stock/${id}`, 'PUT', producto)
      .then(() => {
        fetchProductos();
        resetForm();
      })
      .catch((error) => console.error('Error al actualizar el producto:', error));
  };

  const resetForm = () => {
    setFormData({ articulo: '', descripcion: '', cantidad: '', monto: '', idProducto: '' });
  };

  const handleEdit = (producto) => {
    setFormData({
      idProducto: producto.idProducto,
      articulo: producto.articulo,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      monto: producto.monto,
    });
  };

  const handleElim = (idProducto, estadoActual) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas cambiar el estado de este producto?');
    
    const nuevoEstado = (estadoActual === 'Disponible' || estadoActual === 'Alta') 
                        ? 'No Disponible' 
                        : 'Disponible'; // Si no es Disponible, lo activamos

    if (confirmDelete) {
      sendRequest(`${API_BASE_URL}stockelim/${idProducto}`, 'PUT', { estado: nuevoEstado }) 
        .then(() => fetchProductos())
        .catch((error) => console.error('Error al eliminar el producto:', error));
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

 const sortedProductos = [...productos].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (['monto', 'cantidad', 'idProducto'].includes(sortConfig.key)) {
        valA = Number(valA);
        valB = Number(valB);
    } else {
        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return {
    sortedProductos,
    formData,
    filters,
    handleInputChange,
    handleFilterChange,
    handleSubmit,
    handleEdit,
    handleElim,
    requestSort,
    resetForm,
    page,
    limit,
    setPage,
    setLimit,
    totalProductos,
  };
}

export default useStock;