import { useEffect, useState } from "react";
import API_URL from "../config/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 CLAVE
          },
        });

        if (!res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error usuario:", error);
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