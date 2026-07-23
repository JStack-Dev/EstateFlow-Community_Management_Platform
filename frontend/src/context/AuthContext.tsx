import { createContext, useEffect, useState, type ReactNode } from "react";
import API_URL from "../config/api";
import { apiFetch } from "../utils/apiClient";
import type { AuthContextValue, User } from "../types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch("/api/auth/me/");
        if (!res || !res.ok) throw new Error("No autenticado");
        const data: User = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté activo.");
    }

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const data = await res.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const resUser = await apiFetch("/api/auth/me/");
    if (!resUser || !resUser.ok) throw new Error("Error obteniendo usuario");

    const userData: User = await resUser.json();
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: role === "ADMIN",
        isStaff: role === "STAFF" || role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
