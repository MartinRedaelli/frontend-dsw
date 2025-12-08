const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!data.token) {
            throw new Error(data.error || 'Credenciales incorrectas');
        }

        localStorage.setItem('usuario', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        return data.user;
    } catch (error) {
        throw error;
    }
};


export const resetPasswordDirect = async (email, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/auth/reset-direct`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al restablecer contraseña');
        }

        return data;
    } catch (error) {
        throw error;
    }
};



export const logout = () => {
    localStorage.clear();
    window.location.href = '/';
};

export const getUsuarioActual = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};