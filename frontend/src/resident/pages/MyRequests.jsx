import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiFetch("/api/incidents/")
      .then((res) => res && res.json())
      .then((data) => data && setRequests(data));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>Mis solicitudes de servicio</h1>

      <div style={styles.list}>
        {requests.length === 0 && (
          <p style={styles.empty}>No has enviado ninguna solicitud todavía.</p>
        )}

        {requests.map((req) => (
          <div key={req.id} style={styles.card}>
            <div style={styles.header}>
              <h3 style={styles.title}>{req.title}</h3>
              <StatusBadge status={req.status} />
            </div>

            <p style={styles.location}>{req.location}</p>

            <div style={styles.footer}>
              <span>Urgencia: {req.urgency}</span>
              <span>
                Creada: {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>

            {req.resolution_time && (
              <div style={styles.resolution}>
                Resuelta en {req.resolution_time} horas
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    OPEN: "#2563eb",
    IN_PROGRESS: "#f59e0b",
    RESOLVED: "#16a34a",
  };

  return (
    <span
      style={{
        backgroundColor: colors[status],
        color: "white",
        padding: "5px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
}

const styles = {
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
  },
  location: {
    color: "#6b7280",
    marginBottom: "15px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#6b7280",
  },
  resolution: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: "500",
  },
  empty: {
    color: "#6b7280",
  },
};