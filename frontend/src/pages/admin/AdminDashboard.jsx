import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/apiClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/api/incidents/stats/")
      .then((res) => res && res.ok ? res.json() : null)
      .then((data) => data && setStats(data))
      .catch((err) => console.error("Error cargando métricas:", err));
  }, []);

  if (!stats) return <p>Cargando métricas...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Panel de Administración</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total incidencias</h3>
          <p style={styles.value}>{stats.total}</p>
        </div>
        <div style={styles.card}>
          <h3>Abiertas</h3>
          <p style={styles.value}>{stats.open}</p>
        </div>
        <div style={styles.card}>
          <h3>En progreso</h3>
          <p style={styles.value}>{stats.in_progress}</p>
        </div>
        <div style={styles.card}>
          <h3>Resueltas</h3>
          <p style={styles.value}>{stats.resolved}</p>
        </div>
        <div style={styles.card}>
          <h3>Media resolución</h3>
          <p style={styles.value}>{stats.avg_resolution_hours}h</p>
        </div>
      </div>

      <Link to="/admin/users" style={styles.link}>
        Gestionar usuarios
      </Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  value: {
    fontSize: "32px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  link: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "white",
    textDecoration: "none",
  },
};
