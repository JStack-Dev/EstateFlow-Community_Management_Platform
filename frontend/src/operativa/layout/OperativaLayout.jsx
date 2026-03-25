import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

export default function OperativaLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/logout/`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>EstateFlow Operativa</h2>

        <nav style={styles.nav}>
          <Link to="/operativa" style={styles.link}>Panel</Link>
          <Link to="/operativa/incidencias" style={styles.link}>Incidencias</Link>
          <Link to="/operativa/paquetes" style={styles.link}>Paquetería</Link>
          <Link to="/operativa/accesos" style={styles.link}>Control accesos</Link>
        </nav>

        <button onClick={handleLogout} style={styles.logout}>
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  logout: {
    padding: "10px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: "40px",
  },
};