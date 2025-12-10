import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import StockPage from './pages/StockPage';
import ClientsPage from './pages/ClientsPage';
import EmployeesPage from './pages/EmployeesPage';
import BranchesPage from './pages/BranchesPage';
import SaleUpload from './components/SaleUpload';
import DashboardPage from './pages/DashboardPage'; 
import SaleDetail from './components/SaleDetail'; 
import { getToken, getCurrentUser } from './services/authService'; 
import './styles/index.css';

const PrivateRoute = ({ children, roleRequired }) => {
    const isAuthenticated = !!getToken();
    const user = getCurrentUser();

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
    const user = getCurrentUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.rol === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Navigate to="/sales" replace />;
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

                        <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
                        <Route path="/saleupload/new" element={<PrivateRoute><SaleUpload /></PrivateRoute>} />
                        <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
                        <Route path="/branches" element={<PrivateRoute><BranchesPage /></PrivateRoute>} />
                        <Route path="/stock" element={<PrivateRoute><StockPage /></PrivateRoute>} />

                        <Route path="/employees" element={<PrivateRoute roleRequired="admin"><EmployeesPage /></PrivateRoute>} />
                        <Route path="/saledetail/:saleId" element={<PrivateRoute><SaleDetail /></PrivateRoute>} />
                        <Route path="/saleupload/:saleId" element={<PrivateRoute><SaleUpload /></PrivateRoute>} />

                        <Route path="*" element={<InitialRedirect />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;