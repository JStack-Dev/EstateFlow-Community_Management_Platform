import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 MODO DEMO (sin backend)
    // Simulamos usuario logueado
    const demoRole = "TECH"; // cambia a "USER" si quieres probar

    setRole(demoRole);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (!role) {
    return <div style={{ padding: "40px" }}>Unauthorized</div>;
  }

  if (role === "USER") {
    return <Navigate to="/resident" replace />;
  }

  if (role === "TECH") {
    return <Navigate to="/operations" replace />;
  }

  return <Navigate to="/" replace />;
}