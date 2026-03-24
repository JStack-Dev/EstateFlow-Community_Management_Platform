export default function Topbar() {
  return (
    <div style={styles.topbar}>
      <div style={styles.title}>
        Luxury Residential Operations Platform
      </div>
      <div style={styles.user}>
        Admin
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "70px",
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#374151",
  },
  user: {
    fontSize: "14px",
    color: "#6b7280",
  },
};
