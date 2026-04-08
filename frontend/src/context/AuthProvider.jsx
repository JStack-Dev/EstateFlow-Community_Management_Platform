import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../utils/apiClient";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    window.location.href = "/#/login";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me/");

        if (!res) return logout(); // 🔥 clave

        if (!res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error usuario:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        isAuthenticated: !!user,
        isAdmin: role === "ADMIN",
        isStaff: role === "STAFF" || role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}