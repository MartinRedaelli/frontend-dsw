import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useVentas from '../hooks/useHookVen'; 
import DetalleVenta from '../components/DetalleVenta';
import '../styles/VentasPage.css';

import { TablePagination, TableFooter, TableRow, IconButton } from '@mui/material';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft as KeyboardArrowLeftIcon,
          KeyboardArrowRight as KeyboardArrowRightIcon, LastPage as LastPageIcon,
          ReceiptLong as ReceiptIcon } from '@mui/icons-material';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => { onPageChange(event, 0); };
  const handleBackButtonClick = (event) => { onPageChange(event, page - 1); };
  const handleNextButtonClick = (event) => { onPageChange(event, page + 1); };
  const handleLastPageButtonClick = (event) => { onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)); };

  return (
    <div style={{ flexShrink: 0, marginLeft: 20 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="primera página">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="página anterior">
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="página siguiente">
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="última página">
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

function VentasPage() {
  const { 
    ventas, 
    fetchVentas, 
    requestSort, 
    error,
    page,
    setPage,
    limit,
    setLimit,
    totalVentas
  } = useVentas();
  
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentas(filtro);
  }, [page, limit, filtro]); 

  const handleFilterChange = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    setPage(0);
  };

  const handleDetalleClick = (venta) => {
    setVentaSeleccionada(venta);
    setIsModalOpen(true);
  };

  const handleNuevaVenta = () => {
    navigate('/cargaventa/nueva');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const thStyle = { cursor: 'pointer', userSelect: 'none' };

  return (
    
    <div className="page-container">

      <div className="page-title">
        <ReceiptIcon fontSize="large" className="ventas-icon" />
        Historial de Ventas
      </div>

      <div className="form-container">
        <input
          type="text"
          id="filtro-clientes"
          placeholder="Buscar por cliente o vendedor"
          onChange={handleFilterChange}
          value={filtro}
          className="input-filtro"
        />
      </div>

      <div id="form-venta-inputs" className="div-container">
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
              <th style={thStyle} onClick={() => requestSort('idVenta')}>ID ↕</th>
              <th style={thStyle} onClick={() => requestSort('montoTotal')}>Monto Total ↕</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoEmp')}>Vendedor ↕</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoCli')}>Cliente ↕</th>
              <th style={thStyle} onClick={() => requestSort('fechaHoraVenta')}>Fecha y Hora ↕</th>
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
                  <td className="monto-total-cell">
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
          
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={6}
                count={totalVentas}
                rowsPerPage={limit}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Filas por página' },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>

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