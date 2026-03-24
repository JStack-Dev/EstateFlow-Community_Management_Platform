import { useEffect, useState } from "react";

type Stats = {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  avg_resolution_hours: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/incidents/stats/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Cargando métricas...</p>;

  return (
    <div>
      <h1>Panel Admin</h1>

      <ul>
        <li>Total: {stats.total}</li>
        <li>Abiertas: {stats.open}</li>
        <li>En progreso: {stats.in_progress}</li>
        <li>Resueltas: {stats.resolved}</li>
        <li>Media resolución: {stats.avg_resolution_hours}h</li>
      </ul>
    </div>
  );
}

<a href="/admin/users">Gestionar usuarios</a>

