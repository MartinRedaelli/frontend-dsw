import React, { useEffect } from 'react';
import '../styles/DetalleVenta.css';
import useVentas from '../hooks/useHookVen';

function DetalleVenta({ venta, closeModal }) {

    const { 
        detalleVenta,   
        loadingDetalle,   
        fetchDetalleVenta 
    } = useVentas(); 

    useEffect(() => {
        if (venta && venta.idVenta) {
            fetchDetalleVenta(venta.idVenta);
        }
    }, [venta, fetchDetalleVenta]); 

    const totalCalculado = (detalleVenta || []).reduce((acc, item) => acc + Number(item.subtotal), 0);

    const renderDetalles = () => {
        if (!detalleVenta || detalleVenta.length === 0) {
            return (
                <tr>
                    <td colSpan="4">No se encontraron detalles para esta venta.</td>
                </tr>
            );
        }

        return detalleVenta.map((detalle, index) => (
            <tr key={index}>
                <td>{detalle.articulo}</td>
                <td>{detalle.descripcion}</td>
                <td>{detalle.cantidadVendida}</td>
                <td>{detalle.subtotal}</td>
            </tr>
        ));
    };

    if (loadingDetalle) {
        return <div>Cargando detalles de la venta...</div>;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-btn" onClick={closeModal}>&times;</span>
                <h2 className="titulo-venta">
                    Detalles de Venta #{venta.idVenta}
                </h2>
                <div className="table-responsive">
                    <table className="tabla-negra">
                        <thead>
                            <tr>
                                <th>Artículo</th>
                                <th>Descripción</th>
                                <th>Cantidad Vendida</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDetalles()}
                        </tbody>
                    </table>
                </div>

                <div className="total-container">
                    <div className="total-label">Total Pagado:</div>
                    <div className="total-monto">{totalCalculado.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

export default DetalleVenta;