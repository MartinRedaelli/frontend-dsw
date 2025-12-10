import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSales from '../hooks/useSales'; 
import SaleDetail from '../components/SaleDetail';
import '../styles/SalesPage.css';

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

function SalesPage() {
  const { 
    sales, 
    fetchSales, 
    requestSort, 
    error,
    page,
    setPage,
    limit,
    setLimit,
    totalSales
  } = useSales();
  
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales(filter);
  }, [page, limit, filter]); 

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    setPage(0);
  };

  const handleDetailClick = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const handleNewSale = () => {
    navigate('/saleupload/new');
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
        <ReceiptIcon fontSize="large" className="sales-icon" />
        Historial de Ventas
      </div>

      <div className="form-container form-container-sale">
        <input
          type="text"
          id="client-filter"
          placeholder="Buscar por cliente o vendedor"
          onChange={handleFilterChange}
          value={filter}
          className="input-filter"
        />
      </div>

      <div id="sale-form-inputs" className="div-container">
        <button
          type="button"
          id="new-sale-btn"
          onClick={handleNewSale}
          className='btn-new-sale'
        >
          + Nueva Venta
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div className="table-responsive">
        <table id="sales-table" className="black-table">
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
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron ventas.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.idVenta}>
                  <td>#{sale.idVenta}</td>
                  <td className="total-amount-cell">
                    ${Number(sale.montoTotal).toFixed(2)}
                  </td>
                  <td>{sale.nombre_apellidoEmp}</td>
                  <td>{sale.nombre_apellidoCli}</td>
                  <td>{new Date(sale.fechaHoraVenta).toLocaleString()}</td>
                  <td>
                    <button 
                      className="detail-btn" 
                      onClick={() => handleDetailClick(sale)}
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
                count={totalSales}
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

      {isModalOpen && selectedSale && (
        <SaleDetail
          sale={selectedSale}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SalesPage;