export default function ResidentHome() {
  return (
    <div>
      <h1 style={styles.heading}>Welcome to Your Property Portal</h1>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Need Assistance?</h2>
        <p style={styles.text}>
          Our team is available 24/7 to assist you with any request.
        </p>

        <a href="/resident/new" style={styles.button}>
          Request Service
        </a>
      </div>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    maxWidth: "600px",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "15px",
  },
  text: {
    marginBottom: "25px",
    color: "#6b7280",
  },
  button: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "white",
    textDecoration: "none",
  },
};
