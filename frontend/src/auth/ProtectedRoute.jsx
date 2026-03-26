import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_URL from "../config/api"; // 🔥 IMPORTANTE

export default function ProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    const checkSession = async () => {

      try {

        const response = await fetch(
          `${API_URL}/api/auth/me/`, // 🔥 AQUÍ ESTÁ LA CLAVE
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }

      } catch {
        setAuthenticated(false);
      }

      setLoading(false);
    };

    checkSession();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}