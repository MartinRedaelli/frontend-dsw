import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUsuarioActual, logout } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Person, Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon } from '@mui/icons-material';
import '../styles/navbar.css';


const NavBar = () => {
    const [user, setUser] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentUser = getUsuarioActual();
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
            case '/ventas': 
            case '/cargaventa/nueva':
                return 'nav-btn-active-ventas';
            case '/stock': return 'nav-btn-active-stock';
            case '/clientes': return 'nav-btn-active-clientes';
            case '/empleados': return 'nav-btn-active-empleados';
            case '/sucursales': return 'nav-btn-active-sucursales';
            default: return '';
        }
    };

    return (
        <AppBar position="static" className={menuOpen ? 'menu-expanded' : ''}>
            <Toolbar className="navbar-toolbar">
                <IconButton className="menu-toggle" onClick={toggleMenu} sx={{ display: { sm: 'none' } }}>
                    {menuOpen ? <CloseIcon sx={{ color: 'white' }} /> : <MenuIcon sx={{ color: 'white' }} />}
                </IconButton>


               <Typography variant="h6" className="navbar-title">
                    Gestión DSW
                </Typography>
                

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
                    
                    <Button color="inherit" component={Link} to="/ventas" className={getActiveClass('/ventas')} onClick={() => setMenuOpen(false)}>Ventas</Button>
                    <Button color="inherit" component={Link} to="/stock" className={getActiveClass('/stock')} onClick={() => setMenuOpen(false)}>Stock</Button>
                    <Button color="inherit" component={Link} to="/clientes" className={getActiveClass('/clientes')} onClick={() => setMenuOpen(false)}>Clientes</Button>
                    
                    {/* {user.rol === 'admin' && ( */}
                        <>
                            <Button color="inherit" component={Link} to="/empleados" className={getActiveClass('/empleados')} onClick={() => setMenuOpen(false)}>Empleados</Button>
                            <Button color="inherit" component={Link} to="/sucursales" className={getActiveClass('/sucursales')} onClick={() => setMenuOpen(false)}>Sucursales</Button>
                        </>
                    {/* )} */}

                </Box>

                <Box className="navbar-right-container">
                    <Typography variant="body2" className="user-name">
                        <Person className='icon-perfil'/>{user.nombre}
                    </Typography>
                </Box>
                <Button 
                className="btn-CerrarSesion"
                onClick={handleLogout}> Cerrar Sesión </Button>

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;