export default function ChartCard({ title, children }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      {children}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginTop: "40px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
};
