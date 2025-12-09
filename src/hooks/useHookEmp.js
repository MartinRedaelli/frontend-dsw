import { useState, useEffect, useCallback, useRef } from "react";
import { getToken, logout } from "../services/authService";


const useEmpleados = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API = `${API_BASE_URL}empleados`;

  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false; 
        };
    }, []);

  const sendRequest = useCallback(async (url, method = "GET", body = null) => {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error("Sesión expirada");
      }

      if (!res.ok) {
        const data = await res.json().catch(() => {});
        throw new Error(data?.error || res.statusText);
      }

      if (res.status === 204) return {};
      return await res.json();

    } catch (err) {
      throw err;
    }
  }, []);

  const fetchEmpleados = useCallback(async (nombre = "") => {
    setLoading(true);
    setError(null);

    const url = nombre ? `${API}?nombre=${nombre}` : API;

    try {
      const data = await sendRequest(url);
      if (isMounted.current) setEmpleados(Array.isArray(data) ? data : []);

    } catch (err) {
      if (isMounted.current) setError(err.message);

    } finally {
      if (isMounted.current) setLoading(false);
    }

  }, [sendRequest]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const createEmpleado = useCallback(async (empleado) => {
    await sendRequest(API, "POST", empleado);
    fetchEmpleados();
  }, [sendRequest, fetchEmpleados]);

  const updateEmpleado = useCallback(async (id, empleado) => {
    await sendRequest(`${API}/${id}`, "PUT", empleado);
    fetchEmpleados();
  }, [sendRequest, fetchEmpleados]);

  return {
    empleados,
    loading,
    error,
    fetchEmpleados,
    createEmpleado,
    updateEmpleado
  };
};

export default useEmpleados;
