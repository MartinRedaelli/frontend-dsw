import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Person, Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon } from '@mui/icons-material';
import '../styles/Navbar.css';

const NavBar = () => {
    const [user, setUser] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    if (!user.nombre) {
        return null; 
    }
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const getActiveClass = (path) => {
        if (location.pathname !== path) return '';
        
        switch(path) {
            case '/dashboard': return 'nav-btn-active-dashboard';
            case '/sales': 
            case '/saleupload/new':
                return 'nav-btn-active-sales';
            case '/stock': return 'nav-btn-active-stock';
            case '/clients': return 'nav-btn-active-clients';
            case '/employees': return 'nav-btn-active-employees';
            case '/branches': return 'nav-btn-active-branches';
            default: return '';
        }
    };

    return (
        <AppBar position="static" className={menuOpen ? 'menu-expanded' : ''}>
            <Toolbar className="navbar-toolbar">

                <Box className="navbar-left-container">
                    <IconButton 
                        className="menu-toggle" 
                        onClick={toggleMenu} 
                        disableFocusRipple={true}
                        sx={{ display: { xs: 'block', sm: 'none' } }}>
                        {menuOpen ? <CloseIcon sx={{ color: 'white' }} /> : <MenuIcon sx={{ color: 'white' }} />}
                    </IconButton>

                    <Typography variant="h6" className="navbar-title">
                        Gestión DSW
                    </Typography>
                </Box>
                
                <Box className={`navbar-center-container ${menuOpen ? 'open' : ''}`}>
                    
                    {user.rol === 'admin' && (
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/dashboard" 
                            className={getActiveClass('/dashboard')} 
                            onClick={() => setMenuOpen(false)}>
                            Dashboard
                        </Button>
                    )}
                    
                    <Button color="inherit" component={Link} to="/sales" className={getActiveClass('/sales')} onClick={() => setMenuOpen(false)}>Ventas</Button>
                    <Button color="inherit" component={Link} to="/stock" className={getActiveClass('/stock')} onClick={() => setMenuOpen(false)}>Stock</Button>
                    <Button color="inherit" component={Link} to="/clients" className={getActiveClass('/clients')} onClick={() => setMenuOpen(false)}>Clientes</Button>
                    
                    {user.rol === 'admin' && (
                        <>
                            <Button color="inherit" component={Link} to="/employees" className={getActiveClass('/employees')} onClick={() => setMenuOpen(false)}>Empleados</Button>
                            <Button color="inherit" component={Link} to="/branches" className={getActiveClass('/branches')} onClick={() => setMenuOpen(false)}>Sucursales</Button>
                        </>
                    )}
                    <Button 
                        className="btn-logout-mobile"
                        onClick={handleLogout}
                        sx={{ display: { xs: 'block', sm: 'none' } }}> 
                        <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} /> Cerrar Sesión
                    </Button>
                </Box>

                <Box className="navbar-right-container">
                    <Typography variant="body2" className="user-name">
                        <Person className='profile-icon'/>{user.nombre}
                    </Typography>
                    <Button 
                        className="btn-logout"
                        onClick={handleLogout}> 
                        Cerrar Sesión 
                    </Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
