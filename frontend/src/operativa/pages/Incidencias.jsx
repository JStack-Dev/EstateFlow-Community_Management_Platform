import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function IncidenciasOperativa() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIncidents = async () => {
    try {
      const response = await apiFetch("/api/incidents/");
      if (!response || !response.ok) throw new Error("Error");
      const data = await response.json();
      setIncidents(data);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/api/incidents/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (response && response.ok) {
        loadIncidents();
      } else {
        alert("No se pudo actualizar el estado");
      }
    } catch (err) {
      console.error("Error actualizando incidencia:", err);
      alert("Error de conexión");
    }
  };

  const statusColor = (status) => {
    if (status === "OPEN") return "#f59e0b";
    if (status === "IN_PROGRESS") return "#3b82f6";
    if (status === "RESOLVED") return "#10b981";
    return "#6b7280";
  };

  return (
    <div>
      <h1 style={styles.title}>Gestión de Incidencias</h1>
      <p style={styles.subtitle}>Administra las incidencias reportadas por los residentes.</p>

      {loading ? (
        <p>Cargando incidencias...</p>
      ) : incidents.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Urgencia</th>
              <th>Fecha</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.title}</td>
                <td>{inc.location}</td>
                <td>
                  <span style={{ ...styles.badge, backgroundColor: statusColor(inc.status) }}>
                    {inc.status}
                  </span>
                </td>
                <td>{inc.urgency}</td>
                <td>{new Date(inc.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    value={inc.status}
                    onChange={(e) => updateStatus(inc.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="OPEN">Abierta</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="RESOLVED">Resuelta</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: "28px", marginBottom: "10px" },
  subtitle: { marginBottom: "30px", color: "#6b7280" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white" },
  badge: { color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" },
  select: { padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db" },
};
