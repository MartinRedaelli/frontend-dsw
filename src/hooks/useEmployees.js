import { useState, useEffect, useCallback, useRef } from "react";
import { getToken, logout } from "../services/authService";

const useEmployees = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API = `${API_BASE_URL}empleados`;

  const [employees, setEmployees] = useState([]);
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
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Session expired");
      }

      if (!response.ok) {
        const data = await response.json().catch(() => {});
        throw new Error(data?.error || response.statusText);
      }

      if (response.status === 204) return {};
      return await response.json();

    } catch (err) {
      throw err;
    }
  }, []);

  const fetchEmployees = useCallback(async (name = "") => {
    setLoading(true);
    setError(null);

    const url = name ? `${API}?nombre=${name}` : API;

    try {
      const data = await sendRequest(url);
      if (isMounted.current) setEmployees(Array.isArray(data) ? data : []);

    } catch (err) {
      if (isMounted.current) setError(err.message);

    } finally {
      if (isMounted.current) setLoading(false);
    }

  }, [sendRequest]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = useCallback(async (employee) => {
    await sendRequest(API, "POST", employee);
    fetchEmployees();
  }, [sendRequest, fetchEmployees]);

  const updateEmployee = useCallback(async (id, employee) => {
    await sendRequest(`${API}/${id}`, "PUT", employee);
    fetchEmployees();
  }, [sendRequest, fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee
  };
};

export default useEmployees;