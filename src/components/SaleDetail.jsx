import React, { useEffect } from 'react';
import '../styles/SaleDetail.css';
import useSales from '../hooks/useSales';

function SaleDetail({ sale, closeModal }) {

    const { 
        saleDetail,   
        loadingDetail,   
        fetchSaleDetail 
    } = useSales(); 

    useEffect(() => {
        if (sale && sale.idVenta) {
            fetchSaleDetail(sale.idVenta);
        }
    }, [sale, fetchSaleDetail]); 

    const calculatedTotal = (saleDetail || []).reduce((acc, item) => acc + Number(item.subtotal), 0);

    const renderDetails = () => {
        if (!saleDetail || saleDetail.length === 0) {
            return (
                <tr>
                    <td colSpan="4">No se encontraron detalles para esta venta.</td>
                </tr>
            );
        }

        return saleDetail.map((detail, index) => (
            <tr key={index}>
                <td>{detail.articulo}</td>
                <td>{detail.descripcion}</td>
                <td>{detail.cantidadVendida}</td>
                <td>{detail.subtotal}</td>
            </tr>
        ));
    };

    if (loadingDetail) {
        return <div>Cargando detalles de la venta...</div>;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-btn" onClick={closeModal}>&times;</span>
                <h2 className="sale-title">
                    Detalles de Venta #{sale.idVenta}
                </h2>
                <div className="table-responsive">
                    <table className="black-table">
                        <thead>
                            <tr>
                                <th>Artículo</th>
                                <th>Descripción</th>
                                <th>Cantidad Vendida</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDetails()}
                        </tbody>
                    </table>
                </div>

                <div className="total-container">
                    <div className="total-label">Total Pagado:</div>
                    <div className="total-amount">{calculatedTotal.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

export default SaleDetail;