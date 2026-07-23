import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle2, ListTodo, Users, ArrowRight } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { IncidentStats } from "@/types";
import { PageHeader, StatCard, Spinner, Button } from "@/components/ui";

export default function AdminDashboard() {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/incidents/stats/")
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data: IncidentStats | null) => {
        if (data) setStats(data);
      })
      .catch(() => console.error("Error cargando métricas"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-ink-500">No se pudieron cargar las métricas.</p>;
  }

  const cards = [
    { label: "Total incidencias", value: stats.total, icon: <ListTodo className="h-5 w-5" /> },
    { label: "Abiertas", value: stats.open, icon: <AlertCircle className="h-5 w-5" /> },
    { label: "En progreso", value: stats.in_progress, icon: <Clock className="h-5 w-5" /> },
    { label: "Resueltas", value: stats.resolved, icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Media resolución", value: `${stats.avg_resolution_hours}h`, icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel de administración"
        description="Métricas globales y gestión del sistema."
        action={
          <Link to="/admin/users">
            <Button variant="secondary">
              <Users className="h-4 w-4" />
              Gestionar usuarios
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
