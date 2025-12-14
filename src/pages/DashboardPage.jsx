import React from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import useDashboard from '../hooks/useDashboard'; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import '../styles/DashboardPage.css';

const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('es-AR', { 
        style: 'currency', 
        currency: 'ARS',
        minimumFractionDigits: 2 
    });
};

const DashboardPage = () => {
    const stats = useDashboard(); 

    if (stats.loading) {
        return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    }

    return (
        <Box p={3}>
            <div className="page-title dashboard-title">
                <DashboardIcon fontSize="large" className="dashboard-icon" />
                Panel de Control
            </div>

            {stats.error && <Alert severity="error" mb={3}>{stats.error}</Alert>}

            <Grid container spacing={3} className="dashboard-grid">
                {/* Card 1: Monthly Sales */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card monthly-sales-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Ventas del Mes
                            </Typography>
                            <Typography variant="h3" className="card-number" color="success">
                                {stats.monthlySales}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Transacciones registradas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 2: Monthly Revenue */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card monthly-revenue-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Ingresos del Mes
                            </Typography>
                            <Typography variant="h3" className="card-number revenue-amount">
                                {formatCurrency(stats.monthlyRevenue)}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Total facturado
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 3: Low Stock */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card low-stock-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Stock Bajo
                            </Typography>
                            <Typography variant="h3" className="card-number">
                                {stats.lowStockProducts.length}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Productos por reponer
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 4: Out of Stock */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card className="dashboard-card out-of-stock-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Productos Sin Stock
                            </Typography>
                            <List dense className="card-list">
                                {stats.outOfStockProducts.slice(0, 3).map((product) => (
                                    <ListItem key={product.idProducto}>
                                        <ListItemText 
                                            primary={product.articulo}
                                            secondary={product.descripcion || "Sin descripción"}
                                        />
                                    </ListItem>
                                ))}
                                {stats.outOfStockProducts.length === 0 && (
                                    <ListItem>
                                        <ListItemText 
                                            primary="¡Excelente!"
                                            secondary="No hay productos sin stock"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 5: Top Products */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card className="dashboard-card top-products-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Productos Más Vendidos
                            </Typography>
                            <List dense className="card-list">
                                {stats.bestSellingProducts.slice(0, 3).map((product, index) => (
                                    <ListItem key={product.idProducto}>
                                        <ListItemText 
                                            primary={`${index + 1}. ${product.articulo}`}
                                            secondary={`${product.total_vendido} unidades vendidas`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 6: Top Sellers */}
                <Grid item xs={12} lg={4}>
                    <Card className="dashboard-card top-sellers-card">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Top Vendedores
                            </Typography>
                            <List dense className="card-list">
                                {stats.topSellers.slice(0, 3).map((seller) => (
                                    <ListItem key={seller.idEmpleado}>
                                        <ListItemText 
                                            primary={seller.nombre_apellidoEmp}
                                            secondary={`${seller.total_ventas} ventas - ${formatCurrency(seller.total_monto)}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
