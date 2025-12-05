import React from 'react';
import useCargaVenta from '../hooks/useHookCargaVenta';
import '../styles/CargaVenta.css'; 
import { TextField, Autocomplete } from '@mui/material';

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

  return (
    <div id="detalle-cargar-venta">
      <h1 id="titulo-venta">Nueva Venta</h1>

      <div id="formulario-venta">
        
        <div className="form-row">
  
  <div className="form-group">
    <label className="form-label">Cliente:</label>
    <Autocomplete
      id="select-cliente"
      options={clientes}
      getOptionLabel={(c) => `${c.nombre_apellidoCli} (DNI: ${c.dni})`}
      value={clientes.find(c => c.idCliente === clienteSeleccionado) || null}
      onChange={(event, newValue) => {
        setClienteSeleccionado(newValue ? newValue.idCliente : '');
      }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" placeholder="Buscar Cliente" />
      )}
    />
  </div>

  <div className="form-group">
    <label className="form-label">Artículo:</label>
    <Autocomplete 
      id="select-articulo"
      options={articulos}
      getOptionLabel={(a) => `${a.articulo} - $${a.monto} (Stock: ${a.cantidad})`}
      value={productoSeleccionado}
      onChange={(event, newValue) => {
        setProductoSeleccionado(newValue); 
      }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" placeholder="Buscar Producto" />
      )}
      isOptionEqualToValue={(option, value) => option.idProducto === value.idProducto}
    />
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

        <button id="boton-finalizar" onClick={finalizarVenta} className="card-button">Finalizar Venta</button>
      </div>
    </div>
  );
}

export default CargaVenta;