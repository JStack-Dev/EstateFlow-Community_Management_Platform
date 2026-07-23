import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle2, ListTodo, TrendingUp, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Incident, IncidentStats } from "@/types";
import {
  PageHeader,
  StatCard,
  Spinner,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
} from "@/components/ui";

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
};

const statusLabel: Record<string, string> = {
  OPEN: "Abierta",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelta",
};

export default function Panel() {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, incRes] = await Promise.all([
          apiFetch("/api/incidents/stats/"),
          apiFetch("/api/incidents/"),
        ]);

        if (statsRes && statsRes.ok) {
          const statsData: IncidentStats = await statsRes.json();
          setStats(statsData);
        }
        if (incRes && incRes.ok) {
          const incData: Incident[] = await incRes.json();
          setIncidents(incData);
        }
      } catch {
        console.error("Error cargando datos del panel");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const criticalIncidents = incidents.filter((i) => i.urgency === "CRITICAL" && i.status !== "RESOLVED");
  const recentIncidents = incidents.slice(0, 6);

  const cards = [
    { label: "Total incidencias", value: stats?.total ?? 0, icon: <ListTodo className="h-5 w-5" />, color: "text-ink-500" },
    { label: "Abiertas", value: stats?.open ?? 0, icon: <AlertCircle className="h-5 w-5" />, color: "text-amber-500" },
    { label: "En progreso", value: stats?.in_progress ?? 0, icon: <Clock className="h-5 w-5" />, color: "text-blue-500" },
    { label: "Resueltas", value: stats?.resolved ?? 0, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-500" },
    { label: "Media resolución", value: `${stats?.avg_resolution_hours ?? 0}h`, icon: <TrendingUp className="h-5 w-5" />, color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel operativo"
        description="Resumen general de actividad y tareas pendientes."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <StatCard
              label={card.label}
              value={card.value}
              icon={<span className={card.color}>{card.icon}</span>}
            />
          </motion.div>
        ))}
      </div>

      {/* Critical incidents alert */}
      {criticalIncidents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    {criticalIncidents.length} incidencia{criticalIncidents.length > 1 ? "s" : ""} crítica{criticalIncidents.length > 1 ? "s" : ""} sin resolver
                  </p>
                  <p className="text-xs text-red-700">
                    {criticalIncidents.map((i) => i.title).join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent incidents table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Incidencias recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentIncidents.length === 0 ? (
              <EmptyState message="No hay incidencias registradas." />
            ) : (
              <TableWrapper className="border-0 shadow-none">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Urgencia</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentIncidents.map((inc) => (
                      <TableRow key={inc.id}>
                        <TableCell className="font-medium text-ink-900">{inc.title}</TableCell>
                        <TableCell>{inc.location}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[inc.status]}>
                            {statusLabel[inc.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inc.urgency === "CRITICAL" ? (
                            <Badge variant="danger">Crítica</Badge>
                          ) : inc.urgency === "HIGH" ? (
                            <Badge variant="warning">Alta</Badge>
                          ) : (
                            <Badge>Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-ink-400">
                          {new Date(inc.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
