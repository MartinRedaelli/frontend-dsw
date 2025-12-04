import React, { useEffect, useState } from 'react';
import useStock from '../hooks/useHookStock';
import { getUsuarioActual } from '../services/authService';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import { IconButton, Paper, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import {  Edit as EditIcon,  AddCircle as AddCircleIcon } from '@mui/icons-material';
import '../styles/StockPage.css';

function StockPage() {
  const {
    sortedProductos,
    formData,
    filters,
    handleInputChange,
    handleFilterChange,
    handleSubmit,
    handleEdit,
    handleElim,
    requestSort,
    resetForm,
    page,
    limit,
    setPage,  
    setLimit,
    totalProductos,
  } = useStock();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getUsuarioActual();
    if (user && user.rol === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="page-container">

      <div className="page-title">
        <InventoryIcon fontSize="large" className="stock-icon" />
        Control de Stock
      </div>

<div className="form-container form-container-stock">
        <input
          type="text"
          name="nombreProducto"
          value={filters.nombreProducto}
          onChange={handleFilterChange}
          placeholder="Buscar por artículo o descripción"
          className="input-filtro"
        />
      </div>
      
      {isAdmin && (
  <div className="form-card form-container-stock">
    <Typography variant="h6" className="form-title">
      {formData.idProducto ? (
        <>
          <EditIcon sx={{ mr: 1 }} />
          Editar Producto
        </>
      ) : (
        <>
          <AddCircleIcon sx={{ mr: 1 }} />
          Nuevo Producto
        </>
      )}
    </Typography>
    
    <form onSubmit={handleSubmit} className="form-content">
      <div className="form-row">
        <div className="form-field">
          <input
            type="text"
            name="articulo"
            value={formData.articulo}
            onChange={handleInputChange}
            placeholder="Artículo"
            required
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
            required
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
            placeholder="Cant."
            required
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleInputChange}
            placeholder="Precio ($)"
            required
            className="form-input"
          />
        </div>
      </div>
      
      <div className="form-buttons">
        <button type="submit" className="btn-submit btn-agregar">
          {formData.idProducto ? 'Guardar Cambios' : 'Agregar'}
        </button>
        
        {formData.idProducto && (
          <button type="button" className="btn-cancel" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  </div>
)}

<div className="table-responsive">
        <table className="stock-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('articulo')}>Artículo</th>
              <th onClick={() => requestSort('descripcion')}>Descripción</th>
              <th onClick={() => requestSort('cantidad')}>Stock</th>
              <th onClick={() => requestSort('monto')}>Precio</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedProductos.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.articulo}</td>
                <td>{producto.descripcion}</td>
                <td className={producto.cantidad < 5 ? 'stock-low' : 'stock-ok'}>
                  {producto.cantidad}
                </td>
                <td>{`$${(producto.monto ? Number(producto.monto).toFixed(2) : '0.00')}`}</td>
                

                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(producto)}> Editar</button>
                    <button className="btn-delete" onClick={() => handleElim(producto.idProducto, producto.estado)} > Borrar </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={isAdmin ? 5 : 4} 
                count={totalProductos}
                rowsPerPage={limit}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Filas por página' },
                  native: true,
                }}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setLimit(Number(e.target.value))}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </table>
      </div>
    </div>
  );
}


function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

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

export default StockPage;