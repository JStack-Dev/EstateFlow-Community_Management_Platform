export default function Topbar() {
  return (
    <div style={styles.topbar}>
      <div style={styles.left}>
        <img
          src="/EstateFlow-Community_Management_Platform/logo.png"
          alt="EstateFlow"
          style={styles.logo}
        />
        <div style={styles.title}>
          Luxury Residential Operations Platform
        </div>
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

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    height: "40px",
    objectFit: "contain",
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