import React, { useState } from 'react';
import { login } from '../services/authService';
import { Container, Paper, TextField, Button, Typography, Alert, Box } from '@mui/material';
import '../styles/LoginPage.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            window.location.href = "/ventas"; 
        } catch (err) {
            setError(err.message);
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
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;