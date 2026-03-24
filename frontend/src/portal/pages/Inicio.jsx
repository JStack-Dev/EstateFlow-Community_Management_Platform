import { useEffect, useState } from "react";

export default function Inicio() {

  const [stats, setStats] = useState({
    incidents: 0,
    reservations: 0,
    packages: 0,
    accesses: 0,
    works: 0
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {

    try {

      const endpoints = [
        "http://localhost:8000/api/incidents/",
        "http://localhost:8000/api/reservations/resident/",
        "http://localhost:8000/api/packages/resident/",
        "http://localhost:8000/api/access/resident/",
        "http://localhost:8000/api/works/resident/"
      ];

      const responses = await Promise.all(
        endpoints.map(url =>
          fetch(url, { credentials: "include" })
        )
      );

      const data = await Promise.all(
        responses.map(async (response) => {

          if (!response.ok) {
            console.error("Error cargando:", response.url);
            return [];
          }

          return await response.json();

        })
      );

      setStats({
        incidents: data[0]?.length || 0,
        reservations: data[1]?.length || 0,
        packages: data[2]?.length || 0,
        accesses: data[3]?.length || 0,
        works: data[4]?.length || 0
      });

    } catch (error) {

      console.error("Error cargando dashboard", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <p>Cargando panel...</p>;
  }

  return (

    <div>

      <h1>Panel de control</h1>

      <p>
        Bienvenido a EstateFlow. Aquí tienes un resumen de tu actividad en la urbanización.
      </p>

      <div style={styles.grid}>

        <Card title="Incidencias abiertas" value={stats.incidents} />
        <Card title="Reservas" value={stats.reservations} />
        <Card title="Paquetes pendientes" value={stats.packages} />
        <Card title="Visitas autorizadas" value={stats.accesses} />
        <Card title="Obras activas" value={stats.works} />

      </div>

    </div>

  );

}

function Card({ title, value }) {

  return (

    <div style={styles.card}>

      <h3>{title}</h3>

      <p style={styles.value}>{value}</p>

    </div>

  );

}

const styles = {

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },

  value: {
    fontSize: "32px",
    fontWeight: "bold",
    marginTop: "10px"
  }

};