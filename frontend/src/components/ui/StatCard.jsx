export default function StatCard({ title, value, color }) {
  return (
    <div style={{ ...styles.card, borderLeft: `5px solid ${color}` }}>
      <div style={styles.title}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    fontSize: "14px",
    color: "#6b7280",
  },
  value: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#111827",
  },
};
