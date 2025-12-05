import React, { useState } from 'react';
import useCargaVenta from '../hooks/useHookCargaVenta';
import '../styles/CargaVenta.css';

function CargaVenta() {
  const {
    articulos,
    clientes,
    productoSeleccionado,
    setProductoSeleccionado,
    clienteSeleccionado,
    setClienteSeleccionado,
    cantidad,
    setCantidad,
    agregarArticuloAVenta,
    productosVenta, 
    totalVenta,
    eliminarArticuloAVenta,
    finalizarVenta 
  } = useCargaVenta();

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  const clienteActual = clientes.find(c => c.idCliente === clienteSeleccionado);
  const productoActual = productoSeleccionado;

  const handleClienteSelect = (value) => {
    const clienteEncontrado = clientes.find(cliente => 
      `${cliente.nombre_apellidoCli} (DNI: ${cliente.dni})` === value
    );
    
    if (clienteEncontrado) {
      setClienteSeleccionado(clienteEncontrado.idCliente);
      setBusquedaCliente(value);
    } else if (value === '') {
      setClienteSeleccionado('');
      setBusquedaCliente('');
    }
  };

  const handleProductoSelect = (value) => {
    const productoNombre = value.split(' - $')[0];
    const productoEncontrado = articulos.find(producto => 
      producto.articulo === productoNombre
    );
    
    if (productoEncontrado) {
      setProductoSeleccionado(productoEncontrado);
      setBusquedaProducto(value);
    } else if (value === '') {
      setProductoSeleccionado(null);
      setBusquedaProducto('');
    }
  };

  return (
    <div id="detalle-cargar-venta">
      <h1 id="titulo-venta">Nueva Venta</h1>

      <div id="formulario-venta">
        <div className="form-row">
  
          <div className="form-group">
            <label className="form-label">Cliente:</label>
            <div className="search-container">
              <input
                type="text"
                id="input-cliente"
                className="input-style search-input"
                placeholder="Buscar por nombre o DNI..."
                list="lista-clientes"
                value={busquedaCliente || (clienteActual ? `${clienteActual.nombre_apellidoCli} (DNI: ${clienteActual.dni})` : '')}
                onChange={(e) => {
                  setBusquedaCliente(e.target.value);
                  handleClienteSelect(e.target.value);
                }}
                onBlur={() => {
                  if (!clienteActual && busquedaCliente) {
                    setBusquedaCliente('');
                  }
                }}
              />
              
              <datalist id="lista-clientes">
                {clientes.map(cliente => (
                  <option 
                    key={cliente.idCliente} 
                    value={`${cliente.nombre_apellidoCli} (DNI: ${cliente.dni})`}
                  />
                ))}
              </datalist>

            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Artículo:</label>
            <div className="search-container">
              <input
                type="text"
                id="input-producto"
                className="input-style search-input"
                placeholder="Buscar producto..."
                list="lista-productos"
                value={busquedaProducto || (productoActual ? `${productoActual.articulo} - $${productoActual.monto} (Stock: ${productoActual.cantidad})` : '')}
                onChange={(e) => {
                  setBusquedaProducto(e.target.value);
                  handleProductoSelect(e.target.value);
                }}
                onBlur={() => {
                  if (!productoActual && busquedaProducto) {
                    setBusquedaProducto('');
                  }
                }}
              />
              
              <datalist id="lista-productos">
                {articulos.map(producto => (
                  <option 
                    key={producto.idProducto}
                    value={`${producto.articulo} - $${producto.monto} (Stock: ${producto.cantidad})`}
                  />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group small-input">
            <label className="form-label">Cantidad:</label>
            <input
              type="number"
              id="input-cantidad"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              className="input-style"
            />
          </div>
        </div>

        <button id="boton-agregar" onClick={agregarArticuloAVenta} className="card-button">
          Agregar al Carrito
        </button>
      </div>

      <div id="productos-en-venta">
        <table id="tabla-productos">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosVenta.map((producto, index) => (
              <tr key={index}>
                <td>{producto.articulo}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.monto || producto.precio}</td>
                <td>${producto.subtotal}</td>
                <td>
                  <button 
                    id={`boton-eliminar-${index}`} 
                    onClick={() => eliminarArticuloAVenta(producto.idProducto)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="total-venta">
          <h3>Total Venta: ${totalVenta.toFixed(2)}</h3>
        </div>

        <button id="boton-finalizar" onClick={finalizarVenta} className="card-button">
          Finalizar Venta
        </button>
      </div>
    </div>
  );
}

export default CargaVenta;