import { useEffect, useState } from "react";

export default function Accesos() {

  const API = "http://localhost:8000/api/access/resident/";

  const [accesses, setAccesses] = useState([]);

  const [form, setForm] = useState({
    visitor_name: "",
    visitor_dni: "",
    visit_date: ""
  });

  const [loading, setLoading] = useState(true);

  // ---------------------------
  // CARGAR ACCESOS
  // ---------------------------

  const loadAccesses = async () => {

    try {

      const response = await fetch(API, {
        credentials: "include"
      });

      if (!response.ok) {
        console.error("Error cargando accesos");
        return;
      }

      const data = await response.json();

      setAccesses(data);

    } catch (error) {

      console.error("Error cargando accesos", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadAccesses();
  }, []);

  // ---------------------------
  // MANEJAR FORM
  // ---------------------------

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ---------------------------
  // CREAR ACCESO
  // ---------------------------

  const createAccess = async (e) => {

    e.preventDefault();

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

        alert("Error creando autorización");

        return;

      }

      setForm({
        visitor_name: "",
        visitor_dni: "",
        visit_date: ""
      });

      loadAccesses();

    } catch (error) {

      console.error("Error creando acceso", error);

    }

  };

  return (

    <div>

      <h1>Accesos a la urbanización</h1>

      <p>
        Autoriza visitantes para que puedan acceder a la urbanización.
      </p>

      {/* FORMULARIO */}

      <form onSubmit={createAccess} style={styles.form}>

        <input
          name="visitor_name"
          placeholder="Nombre del visitante"
          value={form.visitor_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="visitor_dni"
          placeholder="DNI visitante"
          value={form.visitor_dni}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="date"
          name="visit_date"
          value={form.visit_date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button style={styles.button}>
          Autorizar visita
        </button>

      </form>

      {/* TABLA */}

      <h2>Mis autorizaciones</h2>

      {loading ? (

        <p>Cargando accesos...</p>

      ) : (

        <table style={styles.table}>

          <thead>

            <tr>
              <th>Visitante</th>
              <th>DNI</th>
              <th>Fecha</th>
            </tr>

          </thead>

          <tbody>

            {accesses.map(a => (

              <tr key={a.id}>

                <td>{a.visitor_name}</td>
                <td>{a.visitor_dni}</td>
                <td>{a.visit_date}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

const styles = {

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};