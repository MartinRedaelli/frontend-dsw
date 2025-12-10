import React, { useState } from 'react';
import { login } from '../services/authService';
import { 
    Container, Paper, TextField, Button, Typography, Alert, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText 
} from '@mui/material';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const userStr = localStorage.getItem('user');
            let destination = '/sales'; // Default para vendedor
            
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.rol === 'admin' || user.role === 'admin') {
                    destination = '/dashboard';
                }
            }
            
            window.location.href = destination;
            
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
        setResetEmail('');
        setNewPassword('');
        setResetMessage('');
        setResetError('');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleResetSubmit = async () => {
        setResetError('');
        setResetMessage('');
        
        if(!resetEmail || !newPassword) {
            setResetError('Por favor completa ambos campos.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:3500/auth/reset-direct', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    ...(token && { 'Authorization': `Bearer ${token}` }) 
                },
                body: JSON.stringify({ email: resetEmail, newPassword: newPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al restablecer contraseña.');
            }

            setResetMessage('Contraseña actualizada correctamente! Ya puedes ingresar.');
            setTimeout(() => {
                setOpenModal(false);
            }, 2500);
        } catch (err) {
            setResetError(err.message);
        }
    };

    return (
        <div className="login-container">
            <Container component="main" maxWidth="xs">
                <Paper elevation={0} className="login-paper">
                    <Typography component="h1" variant="h5" className="login-title">
                        Bienvenido
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            className="login-button"
                            disableElevation 
                        >
                            Ingresar
                        </Button>
                        <Button 
                            fullWidth 
                            variant="text" 
                            className="forgot-password-btn"
                            onClick={handleOpenModal}
                            sx={{ mt: 2, textTransform: 'none', color: '#555' }}
                        >
                            Olvide mi contraseña
                        </Button>
                    </Box>
                </Paper>
            </Container>
            
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Restablecer Contraseña</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Ingresa su correo electrónico y la nueva contraseña que deseas utilizar.
                    </DialogContentText>

                    {resetError && <Alert severity="error" sx={{ mb: 2 }}>{resetError}</Alert>}
                    {resetMessage && <Alert severity="success" sx={{ mb: 2 }}>{resetMessage}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        id="resetEmail"
                        label="Correo Electrónico del Usuario"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="newPassword"
                        label="Nueva Contraseña"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
                    <Button onClick={handleResetSubmit} variant="contained" color="primary">
                        Cambiar Contraseña
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoginPage;