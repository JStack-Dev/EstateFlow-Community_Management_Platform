import { useEffect, useState } from "react";
import API_URL from "../config/api"; // 🔥 IMPORTANTE

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/incidents/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>My Service Requests</h1>

      <div style={styles.list}>
        {requests.length === 0 && (
          <p style={styles.empty}>No requests submitted yet.</p>
        )}

        {requests.map((req) => (
          <div key={req.id} style={styles.card}>
            <div style={styles.header}>
              <h3 style={styles.title}>{req.title}</h3>
              <StatusBadge status={req.status} />
            </div>

            <p style={styles.location}>{req.location}</p>

            <div style={styles.footer}>
              <span>Urgency: {req.urgency}</span>
              <span>
                Created: {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>

            {req.resolution_time && (
              <div style={styles.resolution}>
                Resolved in {req.resolution_time} hours
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