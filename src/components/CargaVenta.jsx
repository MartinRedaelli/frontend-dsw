import React from 'react';
import useCargaVenta from '../hooks/useHookCargaVenta';
import './CargaVenta.css';

function CargaVenta() {
  const {
    articulos,
    clientes,
    articuloSeleccionado,
    setArticuloSeleccionado,
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

  return (
    <div id="detalle-cargar-venta">
      <h1 id="titulo-venta">Nueva Venta</h1>

      <div id="formulario-venta">
        
        <select 
          id="select-cliente"
          onChange={(e) => setClienteSeleccionado(e.target.value)} 
          value={clienteSeleccionado}
          style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
        >
          <option value="">-- Selecciona un Cliente --</option>
          {clientes.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.nombre_apellidoCli} (DNI: {c.dni})
            </option>
          ))}
        </select>

        <select 
          id="select-articulo"
          onChange={(e) => setArticuloSeleccionado(e.target.value)} 
          value={articuloSeleccionado}
        >
          <option value="">Selecciona un artículo</option>
          {articulos.map((articulo) => (
            <option key={articulo.idProducto} value={articulo.idProducto}>
              {articulo.articulo} - {articulo.descripcion} - ${articulo.monto}
            </option>
          ))}
        </select>

        <input
          type="number"
          id="input-cantidad"
          placeholder='Cantidad'
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
        />

        <button id="boton-agregar" onClick={agregarArticuloAVenta}>Agregar a Venta</button>
      </div>

      <div id="productos-en-venta">
        <h2 id="titulo-productos">Productos en la Venta</h2>
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
                <td>${producto.precio}</td>
                <td>${producto.subtotal}</td>
                <td>
                  <button 
                    id={`boton-eliminar-${index}`} 
                    onClick={() => eliminarArticuloAVenta(producto.idProducto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="total-venta">
          <h3>Total Venta: ${totalVenta}</h3>
        </div>

        <button id="boton-finalizar" onClick={finalizarVenta}>Finalizar Venta</button>
      </div>
    </div>
  );
}

export default CargaVenta;