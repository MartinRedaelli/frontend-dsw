import React, { useState } from 'react';
import useBranches from '../hooks/useBranches';
import Modal from '../components/BranchModal';
import { Store as StoreIcon } from '@mui/icons-material';
import '../styles/BranchesPage.css';

const BranchesPage = () => {
  const { branches, fetchBranches, error } = useBranches();
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    fetchBranches(e.target.value);
  };

  const handleViewDetails = (branch) => {
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBranch(null);
  };

  return (
    <div className="page-container">

      <div className="page-title">
        <StoreIcon fontSize="large" className="branch-icon" />
        Red de Sucursales
      </div>

      <div className="form-container">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Buscar por nombre o dirección"
          className="input-filter"
        />

        {error && <p className="error-text">Error: {error}</p>}
      </div>

      <div className="card-container">
        {branches.map((branch) => (
          <div key={branch.idSucursal} className="card">
            <h3 className="card-title">{branch.nombreSucursal}</h3>

            <div className="card-text">
              <p><strong>ID:</strong> #{branch.idSucursal}</p>
              <p><strong>Dirección:</strong> {branch.direccion}</p>
            </div>

            <div className="card-button-container">
              <button
                className="card-button btn-branch"
                onClick={() => handleViewDetails(branch)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <p className="no-results">No se encontraron sucursales.</p>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={closeModal}
        branch={selectedBranch}
      />
    </div>
  );
};

export default BranchesPage;