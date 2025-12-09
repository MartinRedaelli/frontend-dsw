import { useState, useEffect } from 'react';
import { getToken, getUsuarioActual } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const useCargaVenta = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [articulos, setArticulos] = useState([]);
  const [clientes, setClientes] = useState([]); 
  
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  
  const [productosVenta, setProductosVenta] = useState([]); 
  const [totalVenta, setTotalVenta] = useState(0);
  
  const navigate = useNavigate();

  const fetchSeguro = async (url) => {
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
    const cargarDatos = async () => {
        try {
            const dataProd = await fetchSeguro(`${API_BASE_URL}stock?estado=Disponible&limite=1000`);
            if (dataProd.productos) setArticulos(dataProd.productos);

            const dataCli = await fetchSeguro(`${API_BASE_URL}clientes`);
            if (Array.isArray(dataCli)) setClientes(dataCli);

        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };
    cargarDatos();
  }, []);

  const agregarArticuloAVenta = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      return alert('Seleccione un artículo válido y cantidad mayor a 0.');
    }

    const articulo = productoSeleccionado;

    if (cantidad > articulo.cantidad) {
      return alert(`Stock insuficiente. Disponible: ${articulo.cantidad}.`);
    }

    const subtotal = parseFloat(articulo.monto) * cantidad;
    
    const nuevosProductos = [...productosVenta, { 
        ...articulo, 
        cantidad: parseInt(cantidad), 
        subtotal 
    }];
    setProductosVenta(nuevosProductos);
    calcularTotalVenta(nuevosProductos);

    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const calcularTotalVenta = (productos) => {
    const total = productos.reduce((acc, producto) => acc + producto.subtotal, 0);
    setTotalVenta(total);
  };

  const eliminarArticuloAVenta = (idProducto) => {
    const productosActualizados = productosVenta.filter((p) => p.idProducto !== idProducto);
    setProductosVenta(productosActualizados);
    calcularTotalVenta(productosActualizados);
  };

  const finalizarVenta = async () => {
    if (productosVenta.length === 0) return alert('El carrito está vacío.');
    if (!clienteSeleccionado) return alert('Seleccione un cliente.');

    const empleado = getUsuarioActual();

    const ventaData = {
        montoTotal: totalVenta,
        DNIEmpleado: empleado.dni,
        idCliente: clienteSeleccionado,
        productos: productosVenta.map(p => ({
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
        body: JSON.stringify(ventaData),
      });
  
      if (response.ok) {
          alert('¡Venta registrada con éxito!');
          navigate('/ventas');
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
    articulos,
    clientes,
    productoSeleccionado,
    setProductoSeleccionado,
    clienteSeleccionado,
    setClienteSeleccionado,
    cantidad,
    setCantidad,
    agregarArticuloAVenta,
    eliminarArticuloAVenta,
    finalizarVenta,
    productosVenta,
    totalVenta
  };
};

export default useCargaVenta;