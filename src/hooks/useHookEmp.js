// import { useState, useEffect, useCallback } from 'react';
// import { getToken, logout } from '../services/authService';

// const useEmpleados = () => {
//   const [empleados, setEmpleados] = useState([]);
//   const [error, setError] = useState(null);

//   const sendRequest = async (url, method = 'GET', body = null) => {
//     const token = getToken();
//     const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
//     const options = { method, headers, body: body ? JSON.stringify(body) : null };

//     try {
//       const response = await fetch(url, options);
//       if (response.status === 401 || response.status === 403) { logout(); return null; }
//       if (!response.ok) throw new Error(response.statusText);
//       return await response.json();
//     } catch (err) {
//       setError(err.message);
//       return null;
//     }
//   };

//   const fetchEmpleados = useCallback(async (nombre = '') => {
//     const url = nombre 
//       ? `http://localhost:3500/empleados?nombre=${encodeURIComponent(nombre)}`
//       : 'http://localhost:3500/empleados';
//     const data = await sendRequest(url);
//     setEmpleados(Array.isArray(data) ? data : []);
//   }, []);

//   useEffect(() => { fetchEmpleados(); }, [fetchEmpleados]);

//   const createEmpleado = async (empleado) => {
//     await sendRequest('http://localhost:3500/empleados', 'POST', empleado);
//     fetchEmpleados();
//   };

//   const updateEmpleado = async (id, empleado) => {
//     await sendRequest(`http://localhost:3500/empleados/${id}`, 'PUT', empleado);
//     fetchEmpleados();
//   };

//   return { empleados, fetchEmpleados, createEmpleado, updateEmpleado, error };
// };

// export default useEmpleados;

import { useState, useEffect, useCallback, useRef } from "react";
import { getToken, logout } from "../services/authService";

const API = "http://localhost:3500/empleados";

const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => () => (isMounted.current = false), []);

  const sendRequest = useCallback(async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }

      if (!response.ok) {
        // Mejor manejo de errores HTTP para debug
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`); 
      }
      
      if (response.status === 204) return {}; // No Content
      
      return await response.json();
    } catch (err) {
      // Asegurarse de que el error se guarde y muestre en el componente
      if (isMounted.current) setError(err.message);
      return null;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);


// ===============================
//     TRAER EMPLEADOS + ROLES
// ===============================
  const fetchEmpleados = useCallback(
    async (nombre = "") => {
      const url = nombre
        ? `${API}?nombre=${encodeURIComponent(nombre)}`
        : API;

      const data = await sendRequest(url);
      
      // 👈 AÑADE ESTA LÍNEA AQUÍ
      console.log("Datos recibidos del API (Empleados y Roles):", data); 
      
      // Asegurarse de que data sea un array (incluso si está vacío)
      if (!Array.isArray(data)) {
          // Opcional: registrar si la respuesta no es un array
          if (data !== null) { 
              console.error("La respuesta del API no es un array:", data);
          }
          return; 
      }

      if (isMounted.current) {
        setEmpleados(data);

        
        const rolesUnicos = data.reduce((acc, emp) => {
          if (emp.idrol && !acc.some(r => r.idrol === emp.idrol)) {
            acc.push({
              idrol: emp.idrol,
              rol: emp.rol,
            });
          }
          return acc;
        }, []);

        setRoles(rolesUnicos);
      }
    },
    [sendRequest]
  );  // 👈 CARGA INICIAL: Asegura que se llame fetchEmpleados al montar.


  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]); 

  const createEmpleado = useCallback(
    async (empleado) => {
      await sendRequest(API, "POST", empleado);
      fetchEmpleados();
    },
    [fetchEmpleados, sendRequest]
  );

  const updateEmpleado = useCallback(
    async (id, empleado) => {
      await sendRequest(`${API}/${id}`, "PUT", empleado);
      fetchEmpleados();
    },
    [fetchEmpleados, sendRequest]
  );

  return {
    empleados,
    roles,
    loading,
    error,
    fetchEmpleados,
    createEmpleado,
    updateEmpleado,
  };
};

export default useEmpleados;