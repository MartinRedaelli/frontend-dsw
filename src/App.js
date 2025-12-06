import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/navbar';
import LoginPage from './pages/LoginPage';
import VentasPage from './pages/VentasPage';
import StockPage from './pages/StockPage';
import ClientesPage from './pages/ClientesPage';
import EmpleadosPage from './pages/EmpleadosPage';
import SucursalesPage from './pages/SucursalesPage';
import CargaVenta from './components/CargaVenta';
import DashboardPage from './pages/DashboardPage'; 
import DetalleVenta from './components/DetalleVenta'; 
import { getToken, getUsuarioActual } from './services/authService'; 
import './styles/index.css';

const PrivateRoute = ({ children, roleRequired }) => {
    const isAuthenticated = !!getToken();
    const user = getUsuarioActual();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (!roleRequired || user.rol === roleRequired) {
        return children;
    }

    return <Navigate to={user.rol === 'admin' ? "/dashboard" : "/"} />;
};

const InitialRedirect = () => {
    const isAuthenticated = !!getToken();
    const user = getUsuarioActual();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.rol === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Navigate to="/ventas" replace />;
};


function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando aplicación...</div>;
    }

    return (
        <Router>
            <div className="App">
                <NavBar />
                <main>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        
                        <Route path="/" element={<InitialRedirect />} /> 
                        
                        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

                        <Route path="/ventas" element={<PrivateRoute><VentasPage /></PrivateRoute>} />
                        <Route path="/cargaventa/nueva" element={<PrivateRoute><CargaVenta /></PrivateRoute>} />
                        <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
                        <Route path="/sucursales" element={<PrivateRoute><SucursalesPage /></PrivateRoute>} />
                        <Route path="/stock" element={<PrivateRoute><StockPage /></PrivateRoute>} />

                        <Route path="/empleados" element={<PrivateRoute roleRequired="admin"><EmpleadosPage /></PrivateRoute>} />
              
                        <Route path="/detalle_venta/:idVenta" element={<PrivateRoute><DetalleVenta /></PrivateRoute>} />
                        <Route path="/cargaventa/:idVenta" element={<PrivateRoute><CargaVenta /></PrivateRoute>} />

                        <Route path="*" element={<InitialRedirect />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;