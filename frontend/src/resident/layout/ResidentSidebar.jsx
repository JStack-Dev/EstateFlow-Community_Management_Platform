import { NavLink } from "react-router-dom";

export default function ResidentSidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>EstateFlow</div>

      <nav style={styles.nav}>
        <StyledLink to="/resident">Home</StyledLink>
        <StyledLink to="/resident/requests">My Requests</StyledLink>
        <StyledLink to="/resident/new">Request Service</StyledLink>
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
        backgroundColor: isActive ? "#e5e7eb" : "transparent",
      })}
    >
      {children}
    </NavLink>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    padding: "40px 25px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "40px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    padding: "10px 15px",
    borderRadius: "8px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
  },
};
