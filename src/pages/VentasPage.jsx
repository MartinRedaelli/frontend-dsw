import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVentas from '../hooks/useHookVen'; 
import DetalleVenta from '../components/DetalleVenta';
import './VentasPage.css';

function VentasPage() {
  const { ventas, fetchVentas, requestSort, error } = useVentas();
  
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    fetchVentas(valor);
  };

  const handleDetalleClick = (venta) => {
    setVentaSeleccionada(venta);
    setIsModalOpen(true);
  };

  const handleNuevaVenta = () => {
    navigate('/cargaventa/nueva');
  };

  const thStyle = { cursor: 'pointer', userSelect: 'none' };

  return (
    <div id="form-ventas-container">
      <header className="App-header" id="header-ventas">
        <input
          type="text"
          id="filtro-clientes"
          placeholder="Buscar por cliente o vendedor..."
          onChange={handleFilterChange}
          value={filtro}
        />
      </header>

      <div id="form-venta-inputs" className="div-container" style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          id="nueva-venta-btn"
          onClick={handleNuevaVenta}
        >
          + Nueva Venta
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div id="tabla-ventas-container">
        <table id="tabla-ventas" className="tabla-negra">
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort('idVenta')}>ID</th>
              <th style={thStyle} onClick={() => requestSort('montoTotal')}>Monto Total</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoEmp')}>Vendedor</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoCli')}>Cliente</th>
              <th style={thStyle} onClick={() => requestSort('fechaHoraVenta')}>Fecha y Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron ventas.
                </td>
              </tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>#{venta.idVenta}</td>
                  <td style={{ fontWeight: 'bold', color: '#4caf50' }}>
                    ${Number(venta.montoTotal).toFixed(2)}
                  </td>
                  <td>{venta.nombre_apellidoEmp}</td>
                  <td>{venta.nombre_apellidoCli}</td>
                  <td>{new Date(venta.fechaHoraVenta).toLocaleString()}</td>
                  <td>
                    <button 
                      className="detallebtn" 
                      onClick={() => handleDetalleClick(venta)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && ventaSeleccionada && (
        <DetalleVenta
          venta={ventaSeleccionada}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default VentasPage;