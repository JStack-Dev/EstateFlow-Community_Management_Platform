import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function Panel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/api/incidents/stats/")
      .then((res) => res && res.ok ? res.json() : null)
      .then((data) => data && setStats(data))
      .catch((err) => console.error("Error cargando métricas:", err));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Panel Operativo</h1>
      <p style={styles.subtitle}>Resumen general de actividad y tareas pendientes.</p>

      {stats ? (
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
      ) : (
        <p>Cargando métricas...</p>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: "28px", marginBottom: "10px" },
  subtitle: { marginBottom: "30px", color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  value: { fontSize: "32px", fontWeight: "bold", marginTop: "10px" },
};
