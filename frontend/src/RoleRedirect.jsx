import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/current-user/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
