import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/incidents/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.id === parseInt(id));
        setRequest(found);
      });
  }, [id]);

  if (!request) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={styles.heading}>Service Request Details</h1>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>{request.title}</h2>
          <StatusBadge status={request.status} />
        </div>

        <p style={styles.description}>{request.description}</p>

        <div style={styles.infoGrid}>
          <InfoItem label="Category" value={request.category} />
          <InfoItem label="Location" value={request.location} />
          <InfoItem label="Urgency" value={request.urgency} />
          <InfoItem
            label="Created"
            value={new Date(request.created_at).toLocaleString()}
          />
          {request.resolved_at && (
            <InfoItem
              label="Resolved"
              value={new Date(request.resolved_at).toLocaleString()}
            />
          )}
          {request.resolution_time && (
            <InfoItem
              label="Resolution Time"
              value={`${request.resolution_time} hours`}
            />
          )}
        </div>

        <Timeline status={request.status} />
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
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function Timeline({ status }) {
  const steps = ["OPEN", "IN_PROGRESS", "RESOLVED"];

  return (
    <div style={styles.timeline}>
      {steps.map((step, index) => {
        const active =
          steps.indexOf(status) >= index;

        return (
          <div key={step} style={styles.timelineStep}>
            <div
              style={{
                ...styles.circle,
                backgroundColor: active
                  ? "#111827"
                  : "#d1d5db",
              }}
            />
            <span style={styles.stepLabel}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    maxWidth: "800px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
  },
  description: {
    marginBottom: "30px",
    color: "#4b5563",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "40px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: "500",
  },
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  timelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  circle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
  },
  stepLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
};
