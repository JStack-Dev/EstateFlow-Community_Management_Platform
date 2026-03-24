export default function ResidentTopbar() {
  return (
    <div style={styles.topbar}>
      <div style={styles.title}>
        Luxury Property Concierge
      </div>
      <div style={styles.user}>
        Welcome back
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "80px",
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#6b7280",
  },
  user: {
    fontSize: "14px",
    color: "#374151",
  },
};
