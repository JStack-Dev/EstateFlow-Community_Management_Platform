import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// 🔥 BACKEND EN PRODUCCIÓN
const API_URL = "https://estateflow-backend.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar usuario si hay token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error cargando usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔐 LOGIN
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const resUser = await fetch(`${API_URL}/api/auth/me/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!resUser.ok) throw new Error("Error obteniendo usuario");

      const userData = await resUser.json();

      setUser(userData);
    } catch (error) {
      console.error("Error en login:", error);
      setUser(null);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}