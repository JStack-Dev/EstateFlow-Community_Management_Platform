import ResidentSidebar from "./ResidentSidebar";
import ResidentTopbar from "./ResidentTopbar";

export default function ResidentLayout({ children }) {
  return (
    <div style={styles.container}>
      <ResidentSidebar />
      <div style={styles.main}>
        <ResidentTopbar />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f9fafb",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "50px",
    overflowY: "auto",
  },
};
