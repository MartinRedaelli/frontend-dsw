import { useState, useEffect } from 'react';
import { getCurrentUser, getToken } from '../services/authService';

const useDashboard = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [stats, setStats] = useState({
        monthlySales: 0,
        monthlyRevenue: 0,
        lowStockProducts: [],
        outOfStockProducts: [],
        bestSellingProducts: [],
        topSellers: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || user.rol !== 'admin') {
            setStats(prev => ({ ...prev, loading: false, error: 'Unauthorized access' }));
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
                
                const response = await fetch(`${API_BASE_URL}api/dashboard/estadisticas`, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                setStats({
                    monthlySales: data.ventas || 0,
                    monthlyRevenue: data.ingresos || 0,
                    lowStockProducts: data.productosPocoStock || [],
                    outOfStockProducts: data.productosSinStock || [],
                    bestSellingProducts: data.productosMasVendidos || [],
                    topSellers: data.topVendedores || [],
                    loading: false,
                    error: null
                });

            } catch (err) {
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: `Error loading data: ${err.message}`
                }));
            }
        };

        fetchDashboardData();
    }, []);

    return stats;
};

export default useDashboard;