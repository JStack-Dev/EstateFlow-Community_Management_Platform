import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function Accesos() {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAccesses = async () => {
    try {
      const response = await apiFetch("/api/access/staff/");
      if (!response || !response.ok) throw new Error("Error");
      const data = await response.json();
      setAccesses(data);
    } catch (err) {
      console.error("Error cargando accesos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccesses();
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Control de Accesos</h1>
      <p style={styles.subtitle}>Autoriza accesos de empresas, visitas y proveedores.</p>

      {loading ? (
        <p>Cargando accesos...</p>
      ) : accesses.length === 0 ? (
        <p>No hay autorizaciones de acceso registradas.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Visitante</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Residente</th>
            </tr>
          </thead>
          <tbody>
            {accesses.map((a) => (
              <tr key={a.id}>
                <td>{a.visitor_name}</td>
                <td>{a.visitor_dni}</td>
                <td>{a.visit_date}</td>
                <td>{a.resident_name || a.resident || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: "28px", marginBottom: "10px" },
  subtitle: { marginBottom: "30px", color: "#6b7280" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white" },
};
