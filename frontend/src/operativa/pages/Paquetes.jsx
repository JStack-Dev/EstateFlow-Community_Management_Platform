import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function Paquetes() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ resident: "", carrier: "", tracking_number: "", description: "" });

  const loadPackages = async () => {
    try {
      const response = await apiFetch("/api/packages/staff/");
      if (!response || !response.ok) throw new Error("Error");
      const data = await response.json();
      setPackages(data);
    } catch (err) {
      console.error("Error cargando paquetes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createPackage = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/api/packages/staff/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (response && response.ok) {
        setForm({ resident: "", carrier: "", tracking_number: "", description: "" });
        loadPackages();
      } else {
        alert("No se pudo registrar el paquete");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const deliverPackage = async (id) => {
    try {
      const response = await apiFetch(`/api/packages/deliver/${id}/`, { method: "PATCH" });
      if (response && response.ok) {
        loadPackages();
      } else {
        alert("No se pudo marcar como entregado");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Gestión de Paquetería</h1>
      <p style={styles.subtitle}>Registra y controla la entrega de paquetes.</p>

      <form onSubmit={createPackage} style={styles.form}>
        <input name="resident" placeholder="ID residente" value={form.resident} onChange={handleChange} required style={styles.input} />
        <input name="carrier" placeholder="Empresa transportista" value={form.carrier} onChange={handleChange} style={styles.input} />
        <input name="tracking_number" placeholder="Número de seguimiento" value={form.tracking_number} onChange={handleChange} style={styles.input} />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Registrar paquete</button>
      </form>

      {loading ? (
        <p>Cargando paquetes...</p>
      ) : packages.length === 0 ? (
        <p>No hay paquetes registrados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Seguimiento</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.carrier}</td>
                <td>{pkg.tracking_number}</td>
                <td>{pkg.description}</td>
                <td>{pkg.delivered ? "Entregado" : "Pendiente"}</td>
                <td>
                  {!pkg.delivered && (
                    <button onClick={() => deliverPackage(pkg.id)} style={styles.deliverBtn}>
                      Marcar entregado
                    </button>
                  )}
                </td>
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
  form: { display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" },
  button: { backgroundColor: "#111827", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" },
  deliverBtn: { backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white" },
};
