import { useEffect, useState } from "react";
import API_URL from "../config/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access"); // ✅ corregido

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me/`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ JWT correcto
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        setUser(null);
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