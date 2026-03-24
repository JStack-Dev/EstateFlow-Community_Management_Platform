import { useEffect, useState } from "react";

export default function Incidencias() {

  const API = "http://localhost:8000/api/incidents/";

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "INFRASTRUCTURE",
    urgency: "NORMAL"
  });

  const [error, setError] = useState(null);

  // ------------------------------
  // CARGAR INCIDENCIAS
  // ------------------------------

  const loadIncidents = async () => {

    try {

      const response = await fetch(API, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error cargando incidencias");
      }

      const data = await response.json();

      setIncidents(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadIncidents();
  }, []);

  // ------------------------------
  // CONTROL FORMULARIO
  // ------------------------------

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ------------------------------
  // CREAR INCIDENCIA
  // ------------------------------

  const createIncident = async (e) => {

    e.preventDefault();
    setError(null);

    try {

      const response = await fetch(API, {

        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)

      });

      if (!response.ok) {

        const data = await response.json();

        console.log(data);

        setError("Error al crear incidencia");

        return;

      }

      setForm({
        title: "",
        description: "",
        location: "",
        category: "INFRASTRUCTURE",
        urgency: "NORMAL"
      });

      loadIncidents();

    } catch (err) {

      console.error(err);

      setError("Error de conexión con el servidor");

    }

  };

  // ------------------------------
  // COLOR ESTADO
  // ------------------------------

  const statusColor = (status) => {

    if (status === "OPEN") return "#f59e0b";
    if (status === "IN_PROGRESS") return "#3b82f6";
    if (status === "RESOLVED") return "#10b981";

    return "#6b7280";

  };

  return (

    <div>

      <h1 style={styles.title}>Mis Incidencias</h1>

      <p style={styles.subtitle}>
        Aquí podrás reportar incidencias de tu vivienda o zonas comunes.
      </p>

      {/* FORMULARIO */}

      <form onSubmit={createIncident} style={styles.form}>

        <input
          name="title"
          placeholder="Título de la incidencia"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <input
          name="location"
          placeholder="Ubicación (ej: garaje bloque A)"
          value={form.location}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="INFRASTRUCTURE">Infraestructura</option>
          <option value="ELECTRICITY">Electricidad</option>
          <option value="PLUMBING">Fontanería</option>
          <option value="SECURITY">Seguridad</option>
          <option value="GARDENING">Jardinería</option>
          <option value="CLEANING">Limpieza</option>
          <option value="EMERGENCY">Emergencia</option>
        </select>

        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="NORMAL">Normal</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button}>
          Crear incidencia
        </button>

      </form>

      {/* TABLA */}

      {loading ? (

        <p>Cargando incidencias...</p>

      ) : (

        <table style={styles.table}>

          <thead>
            <tr>
              <th>Título</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Urgencia</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>

            {incidents.map((incident) => (

              <tr key={incident.id}>

                <td>{incident.title}</td>

                <td>{incident.location}</td>

                <td>

                  <span style={{
                    ...styles.status,
                    backgroundColor: statusColor(incident.status)
                  }}>
                    {incident.status}
                  </span>

                </td>

                <td>{incident.urgency}</td>

                <td>
                  {new Date(incident.created_at).toLocaleDateString()}
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

  title: {
    fontSize: "28px",
    marginBottom: "10px"
  },

  subtitle: {
    marginBottom: "30px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "500px",
    marginBottom: "40px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  },

  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    minHeight: "80px"
  },

  button: {
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  error: {
    color: "red",
    fontSize: "14px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white"
  },

  status: {
    color: "white",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px"
  }

};