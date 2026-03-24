import { useEffect, useState } from "react";

export default function Reservas() {

  const API = "http://localhost:8000/api/reservations/";
  const FACILITIES_API = "http://localhost:8000/api/reservations/facilities/";

  const [reservations, setReservations] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [form, setForm] = useState({
    facility: "",
    date: "",
    start_time: "",
    end_time: ""
  });

  const loadReservations = async () => {

    const response = await fetch(API, {
      credentials: "include"
    });

    const data = await response.json();

    setReservations(data);

  };

  const loadFacilities = async () => {

    const response = await fetch(FACILITIES_API, {
      credentials: "include"
    });

    const data = await response.json();

    setFacilities(data);

  };

  useEffect(() => {

    loadReservations();
    loadFacilities();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const createReservation = async (e) => {

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
      alert("No se pudo crear la reserva");
      return;
    }

    setForm({
      facility: "",
      date: "",
      start_time: "",
      end_time: ""
    });

    loadReservations();

  };

  return (

    <div>

      <h1>Reservas</h1>

      <form onSubmit={createReservation} style={styles.form}>

        <select
          name="facility"
          value={form.facility}
          onChange={handleChange}
          required
        >

          <option value="">Seleccionar instalación</option>

          {facilities.map(f => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}

        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <button>Crear reserva</button>

      </form>

      <h2>Mis reservas</h2>

      <table style={styles.table}>

        <thead>
          <tr>
            <th>Instalación</th>
            <th>Fecha</th>
            <th>Inicio</th>
            <th>Fin</th>
          </tr>
        </thead>

        <tbody>

          {reservations.map(r => (

            <tr key={r.id}>

              <td>{r.facility_name}</td>

              <td>{r.date}</td>

              <td>{r.start_time}</td>

              <td>{r.end_time}</td>

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
    gap: "10px",
    marginBottom: "30px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};