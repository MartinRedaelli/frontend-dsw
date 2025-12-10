import { useState, useEffect } from 'react';
import { getToken, getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const useSaleUpload = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]); 
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const [saleProducts, setSaleProducts] = useState([]); 
  const [saleTotal, setSaleTotal] = useState(0);
  
  const navigate = useNavigate();

  const safeFetch = async (url) => {
    const token = getToken();
    const response = await fetch(url, {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  useEffect(() => {
    const loadData = async () => {
        try {
            const productsData = await safeFetch(`${API_BASE_URL}stock?estado=Disponible&limite=1000`);
            if (productsData.productos) setArticles(productsData.productos);

            const clientsData = await safeFetch(`${API_BASE_URL}clientes`);
            if (Array.isArray(clientsData)) setClients(clientsData);

        } catch (error) {
            console.error("Error loading data:", error);
        }
    };
    loadData();
  }, []);

  const addArticleToSale = () => {
    if (!selectedProduct || quantity <= 0) {
      return alert('Seleccione un artículo válido y cantidad mayor a 0.');
    }

    const article = selectedProduct;

    if (quantity > article.cantidad) {
      return alert(`Stock insuficiente. Disponible: ${article.cantidad}.`);
    }

    const subtotal = parseFloat(article.monto) * quantity;
    
    const newProducts = [...saleProducts, { 
        ...article, 
        cantidad: parseInt(quantity), 
        subtotal 
    }];
    setSaleProducts(newProducts);
    calculateSaleTotal(newProducts);

    setSelectedProduct(null);
    setQuantity(1);
  };

  const calculateSaleTotal = (products) => {
    const total = products.reduce((acc, product) => acc + product.subtotal, 0);
    setSaleTotal(total);
  };

  const removeArticleFromSale = (productId) => {
    const updatedProducts = saleProducts.filter((p) => p.idProducto !== productId);
    setSaleProducts(updatedProducts);
    calculateSaleTotal(updatedProducts);
  };

  const finishSale = async () => {
    if (saleProducts.length === 0) return alert('El carrito está vacío.');
    if (!selectedClient) return alert('Seleccione un cliente.');

    const employee = getCurrentUser();

    const saleData = {
        montoTotal: saleTotal,
        DNIEmpleado: employee.dni,
        idCliente: selectedClient,
        productos: saleProducts.map(p => ({
            idProducto: p.idProducto,
            cantidadVendida: p.cantidad,
            subtotal: p.subtotal
        }))
    };

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}ventas/crearVenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData),
      });
  
      if (response.ok) {
          alert('¡Venta registrada con éxito!');
          navigate('/sales');
      } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'No se pudo guardar'));
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };
  
  return {
    articles,
    clients,
    selectedProduct,
    setSelectedProduct,
    selectedClient,
    setSelectedClient,
    quantity,
    setQuantity,
    addArticleToSale,
    removeArticleFromSale,
    finishSale,
    saleProducts,
    saleTotal
  };
};

export default useSaleUpload;