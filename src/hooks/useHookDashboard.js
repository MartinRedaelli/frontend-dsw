import { useState, useEffect } from 'react';
import { getUsuarioActual, getToken } from '../services/authService';

const useHookDashboard = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [stats, setStats] = useState({
        ventasMes: 0,
        ingresosMes: 0,
        productosPocoStock: [],
        productosSinStock: [],
        productosMasVendidos: [],
        topVendedores: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const user = getUsuarioActual();
        if (!user || user.rol !== 'admin') {
            setStats(prev => ({ ...prev, loading: false, error: 'Acceso no autorizado' }));
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const token = getToken();
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch(`${API_BASE_URL}/api/dashboard/estadisticas`, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                setStats({
                    ventasMes: data.ventas || 0,
                    ingresosMes: data.ingresos || 0,
                    productosPocoStock: data.productosPocoStock || [],
                    productosSinStock: data.productosSinStock || [],
                    productosMasVendidos: data.productosMasVendidos || [],
                    topVendedores: data.topVendedores || [],
                    loading: false,
                    error: null
                });

            } catch (err) {
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: `Error al cargar datos: ${err.message}`
                }));
            }
        };

        fetchDashboardData();
    }, []);

    return stats;
};

export default useHookDashboard;