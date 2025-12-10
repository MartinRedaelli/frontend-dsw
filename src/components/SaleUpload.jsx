import React, { useState } from 'react';
import useSaleUpload from '../hooks/useSaleUpload';
import '../styles/SaleUpload.css';

function SaleUpload() {
  const {
    articles,
    clients,
    selectedProduct,
    setSelectedProduct,
    selectedClient,
    setSelectedClient,
    quantity,
    setQuantity,
    addArticleToSale,
    saleProducts, 
    saleTotal,
    removeArticleFromSale,
    finishSale 
  } = useSaleUpload();

  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const currentClient = clients.find(c => c.idCliente === selectedClient);
  const currentProduct = selectedProduct;

  const handleClientSelect = (value) => {
    const foundClient = clients.find(client => 
      `${client.nombre_apellidoCli} (DNI: ${client.dni})` === value
    );
    
    if (foundClient) {
      setSelectedClient(foundClient.idCliente);
      setClientSearch(value);
    } else if (value === '') {
      setSelectedClient('');
      setClientSearch('');
    }
  };

  const handleProductSelect = (value) => {
    const productName = value.split(' - $')[0];
    const foundProduct = articles.find(product => 
      product.articulo === productName
    );
    
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setProductSearch(value);
    } else if (value === '') {
      setSelectedProduct(null);
      setProductSearch('');
    }
  };

  return (
    <div id="sale-detail-upload">
      <h1 id="title-sale">Nueva Venta</h1>

      <div id="sale-form">
        <div className="form-row">
  
          <div className="form-group">
            <label className="form-label">Cliente:</label>
            <div className="search-container">
              <input
                type="text"
                id="client-input"
                className="input-style search-input"
                placeholder="Buscar por nombre o DNI..."
                list="clients-list"
                value={clientSearch || (currentClient ? `${currentClient.nombre_apellidoCli} (DNI: ${currentClient.dni})` : '')}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  handleClientSelect(e.target.value);
                }}
                onBlur={() => {
                  if (!currentClient && clientSearch) {
                    setClientSearch('');
                  }
                }}
              />
              
              <datalist id="clients-list">
                {clients.map(client => (
                  <option 
                    key={client.idCliente} 
                    value={`${client.nombre_apellidoCli} (DNI: ${client.dni})`}
                  />
                ))}
              </datalist>

            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Artículo:</label>
            <div className="search-container">
              <input
                type="text"
                id="product-input"
                className="input-style search-input"
                placeholder="Buscar producto..."
                list="products-list"
                value={productSearch || (currentProduct ? `${currentProduct.articulo} - $${currentProduct.monto} (Stock: ${currentProduct.cantidad})` : '')}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  handleProductSelect(e.target.value);
                }}
                onBlur={() => {
                  if (!currentProduct && productSearch) {
                    setProductSearch('');
                  }
                }}
              />
              
              <datalist id="products-list">
                {articles.map(product => (
                  <option 
                    key={product.idProducto}
                    value={`${product.articulo} - $${product.monto} (Stock: ${product.cantidad})`}
                  />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group small-input">
            <label className="form-label">Cantidad:</label>
            <input
              type="number"
              id="quantity-input"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="input-style"
            />
          </div>
        </div>

        <button id="add-button" onClick={addArticleToSale} className="card-button">
          Agregar al Carrito
        </button>
      </div>

      <div id="sale-products">
        <div className="table-responsive-wrapper"> 
          <table id="products-table">
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
              {saleProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.articulo}</td>
                  <td>{product.cantidad}</td>
                  <td>${product.monto || product.precio}</td>
                  <td>${product.subtotal}</td>
                  <td>
                    <button 
                      id={`delete-button-${index}`} 
                      onClick={() => removeArticleFromSale(product.idProducto)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div id="sale-total">
          <h3>Total Venta: ${saleTotal.toFixed(2)}</h3>
        </div>

        <button id="finish-btn" onClick={finishSale} className="card-button">
          Finalizar Venta
        </button>
      </div>
    </div>
  );
}

export default SaleUpload;