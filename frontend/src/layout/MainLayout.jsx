import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Topbar />
        <div style={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f6fa",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  pageContent: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
};
