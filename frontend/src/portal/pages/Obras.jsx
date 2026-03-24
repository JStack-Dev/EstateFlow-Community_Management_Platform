import { useEffect, useState } from "react";

export default function Obras() {

  const API = "http://localhost:8000/api/works/resident/";

  const [works, setWorks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    company: "",
    workers_count: 1
  });

  const loadWorks = async () => {

    const response = await fetch(API, {
      credentials: "include"
    });

    const data = await response.json();

    setWorks(data);

  };

  useEffect(() => {

    loadWorks();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const createWork = async (e) => {

    e.preventDefault();

    const response = await fetch(API, {

      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(form)

    });

    if (!response.ok) {
      alert("Error registrando obra");
      return;
    }

    setForm({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      company: "",
      workers_count: 1
    });

    loadWorks();

  };

  return (

    <div>

      <h1>Obras en vivienda</h1>

      <form onSubmit={createWork} style={styles.form}>

        <input
          name="title"
          placeholder="Tipo de obra"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Empresa"
          value={form.company}
          onChange={handleChange}
        />

        <input
          type="number"
          name="workers_count"
          value={form.workers_count}
          onChange={handleChange}
        />

        <button>Registrar obra</button>

      </form>

      <h2>Mis obras</h2>

      <table style={styles.table}>

        <thead>
          <tr>
            <th>Obra</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>

          {works.map(w => (

            <tr key={w.id}>

              <td>{w.title}</td>
              <td>{w.start_date}</td>
              <td>{w.end_date}</td>
              <td>{w.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

const styles = {

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
    maxWidth: "400px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};