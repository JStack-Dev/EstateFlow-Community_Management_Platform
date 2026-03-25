import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";
import API_URL from "../../config/api"; // 🔥 IMPORTANTE

export default function PortalLayout({ children }) {

  const navigate = useNavigate();

  const handleLogout = async () => {

    try {

      await fetch(`${API_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });

    } catch (error) {

      console.error("Error cerrando sesión", error);

    }

    navigate("/login");

  };

  return (

    <div style={styles.container}>

      <aside style={styles.sidebar}>

        {/* HEADER SIDEBAR */}

        <div style={styles.header}>

          <h2 style={styles.logo}>
            EstateFlow
          </h2>

          <NotificationBell />

        </div>

        {/* NAVEGACIÓN */}

        <nav style={styles.nav}>

          <Link to="/portal" style={styles.link}>
            Inicio
          </Link>

          <Link to="/portal/incidencias" style={styles.link}>
            Mis incidencias
          </Link>

          <Link to="/portal/reservas" style={styles.link}>
            Reservas
          </Link>

          <Link to="/portal/paqueteria" style={styles.link}>
            Paquetería
          </Link>

          <Link to="/portal/accesos" style={styles.link}>
            Accesos
          </Link>

          <Link to="/portal/obras" style={styles.link}>
            Obras
          </Link>

          <Link to="/portal/perfil" style={styles.link}>
            Mi perfil
          </Link>

        </nav>

        {/* BOTÓN LOGOUT */}

        <button onClick={handleLogout} style={styles.logout}>
          Cerrar sesión
        </button>

      </aside>

      {/* CONTENIDO PRINCIPAL */}

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
    backgroundColor: "#111827",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
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
    overflowY: "auto",
  }

};