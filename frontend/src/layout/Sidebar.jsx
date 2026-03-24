import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>EstateFlow</div>

      <nav style={styles.nav}>
        <StyledLink to="/">Dashboard</StyledLink>
        <StyledLink to="/operations">Operations</StyledLink>
      </nav>
    </div>
  );
}

function StyledLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        backgroundColor: isActive ? "#374151" : "transparent",
      })}
    >
      {children}
    </NavLink>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "40px 25px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "50px",
    letterSpacing: "1px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    padding: "12px 15px",
    borderRadius: "8px",
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "14px",
    transition: "background 0.2s ease",
  },
};
