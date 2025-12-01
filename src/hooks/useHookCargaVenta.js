import { useState, useEffect } from 'react';
import { getToken, getUsuarioActual } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const useHookCargaVenta = () => {
  const [articulos, setArticulos] = useState([]);
  const [clientes, setClientes] = useState([]); 
  const [articuloSeleccionado, setArticuloSeleccionado] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [productosVenta, setProductosVenta] = useState([]); 
  const [totalVenta, setTotalVenta] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
        const token = getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const resProd = await fetch('http://localhost:3500/stock?estado=Disponible&limite=1000', { headers });
            const dataProd = await resProd.json();
            if (dataProd.productos) setArticulos(dataProd.productos);

            const resCli = await fetch('http://localhost:3500/clientes', { headers });
            const dataCli = await resCli.json();
            if (Array.isArray(dataCli)) setClientes(dataCli);

        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };
    cargarDatos();
  }, []);

  const agregarArticuloAVenta = () => {
    if (!articuloSeleccionado || cantidad <= 0) {
      alert('Seleccione un artículo válido y una cantidad mayor a 0.');
      return;
    }

    const articulo = articulos.find((a) => a.idProducto === parseInt(articuloSeleccionado));

    if (!articulo) return alert('Artículo no válido');

    if (cantidad > articulo.cantidad) {
      alert(`Stock insuficiente. Disponible: ${articulo.cantidad}.`);
      return;
    }

    const subtotal = parseFloat(articulo.monto) * cantidad;
    
    const nuevosProductos = [...productosVenta, { ...articulo, cantidad, subtotal }];
    setProductosVenta(nuevosProductos);
    calcularTotalVenta(nuevosProductos);

    setArticuloSeleccionado('');
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
      const response = await fetch('http://localhost:3500/ventas/crearVenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ventaData),
      });
  
      if (response.ok) {
          alert('Venta registrada con éxito');
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
    articuloSeleccionado,
    clienteSeleccionado,
    setArticuloSeleccionado,
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

export default useHookCargaVenta;