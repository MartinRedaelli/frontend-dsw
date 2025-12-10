import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

function useStock() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
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
        throw new Error(errorData.error || 'Request error');
      }

      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  };

  const fetchProducts = useCallback(async () => {
    const nombreProducto = filters.nombreProducto || '';
    const maxLimit = 40;  
    const minLimit = 5;
    const validatedLimit = limit > maxLimit ? maxLimit : (limit < minLimit ? minLimit : limit);
    
    const totalPages = Math.ceil(totalProducts / validatedLimit) || 1;
    const validatedPage = page >= totalPages ? totalPages - 1 : (page < 0 ? 0 : page);
  
    const url = `${API_BASE_URL}stock?producto=${encodeURIComponent(nombreProducto)}&pagina=${validatedPage}&limite=${validatedLimit}`;
  
    try {
      const data = await sendRequest(url);
      
      if (data && Array.isArray(data.productos)) {
        setProducts(data.productos);
        setTotalProducts(data.totalProductos);
      } else if (data) {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [page, limit, filters, totalProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    formData.idProducto ? updateProduct(formData.idProducto, formData) : createProduct(formData);
  };

  const createProduct = (product) => {
    sendRequest(`${API_BASE_URL}stock`, 'POST', product)
      .then(() => {
        fetchProducts();
        resetForm();
      })
      .catch((error) => console.error('Error creating product:', error));
  };

  const updateProduct = (id, product) => {
    sendRequest(`${API_BASE_URL}stock/${id}`, 'PUT', product)
      .then(() => {
        fetchProducts();
        resetForm();
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const resetForm = () => {
    setFormData({ articulo: '', descripcion: '', cantidad: '', monto: '', idProducto: '' });
  };

  const handleEdit = (product) => {
    setFormData({
      idProducto: product.idProducto,
      articulo: product.articulo,
      descripcion: product.descripcion,
      cantidad: product.cantidad,
      monto: product.monto,
    });
  };

  const handleDelete = (productId, currentStatus) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas cambiar el estado de este producto?');
    
    const newStatus = (currentStatus === 'Disponible' || currentStatus === 'Alta') 
                      ? 'No Disponible' 
                      : 'Disponible';

    if (confirmDelete) {
      sendRequest(`${API_BASE_URL}stockelim/${productId}`, 'PUT', { estado: newStatus }) 
        .then(() => fetchProducts())
        .catch((error) => console.error('Error deleting product:', error));
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
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
    sortedProducts,
    formData,
    filters,
    handleInputChange,
    handleFilterChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    requestSort,
    resetForm,
    page,
    limit,
    setPage,
    setLimit,
    totalProducts,
  };
}

export default useStock;