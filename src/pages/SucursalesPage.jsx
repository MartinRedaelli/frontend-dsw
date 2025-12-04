import React, { useState } from 'react';
import useSucursales from '../hooks/useHookSuc';
import Modal from '../components/ModalSucursal';
import { Store as StoreIcon } from '@mui/icons-material';
import '../styles/SucursalesPage.css';

const SucursalesPage = () => {
  const { sucursales, fetchSucursales, error } = useSucursales();
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    fetchSucursales(e.target.value);
  };

  const handleVerDetalles = (sucursal) => {
    setSucursalSeleccionada(sucursal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSucursalSeleccionada(null);
  };

  return (
    <div className="page-container">

      <div className="page-title">
        <StoreIcon fontSize="large" className="sucursal-icon" />
        Red de Sucursales
      </div>

      <div className="form-container">
        <input
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar por nombre o dirección"
          className="input-filtro"
        />

        {error && <p className="error-text">Error: {error}</p>}
      </div>

      <div className="card-container">
        {sucursales.map((sucursal) => (
          <div key={sucursal.idSucursal} className="card">
            <h3 className="card-title">{sucursal.nombreSucursal}</h3>

            <div className="card-text">
              <p><strong>ID:</strong> #{sucursal.idSucursal}</p>
              <p><strong>Dirección:</strong> {sucursal.direccion}</p>
            </div>

            <div className="card-button-container">
              <button
                className="card-button btn-sucursal"
                onClick={() => handleVerDetalles(sucursal)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}

        {sucursales.length === 0 && (
          <p className="no-results">No se encontraron sucursales.</p>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={closeModal}
        sucursal={sucursalSeleccionada}
      />
    </div>
  );
};

export default SucursalesPage;