import { createContext, useEffect, useState } from "react";
import API_URL from "../config/api"; // 🔥 IMPORTANTE

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me/`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const role = user && typeof user === "object" ? user.role : null;

  const isAuthenticated = !!user;
  const isAdmin = role === "ADMIN";
  const isStaff = role === "STAFF" || role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}