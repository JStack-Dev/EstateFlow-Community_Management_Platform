import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle2, ListTodo, TrendingUp, Users, ArrowRight, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Incident, IncidentStats, User } from "@/types";
import {
  PageHeader,
  StatCard,
  Spinner,
  Button,
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, incRes, usersRes] = await Promise.all([
          apiFetch("/api/incidents/stats/"),
          apiFetch("/api/incidents/"),
          apiFetch("/api/users/"),
        ]);

        if (statsRes && statsRes.ok) setStats(await statsRes.json());
        if (incRes && incRes.ok) setIncidents(await incRes.json());
        if (usersRes && usersRes.ok) setUsers(await usersRes.json());
      } catch {
        console.error("Error cargando dashboard admin");
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
  const recentUsers = users.slice(0, 5);
  const activeUsers = users.filter((u) => u.is_active).length;

  const cards = [
    { label: "Total incidencias", value: stats?.total ?? 0, icon: <ListTodo className="h-5 w-5" />, color: "text-ink-500" },
    { label: "Abiertas", value: stats?.open ?? 0, icon: <AlertCircle className="h-5 w-5" />, color: "text-amber-500" },
    { label: "En progreso", value: stats?.in_progress ?? 0, icon: <Clock className="h-5 w-5" />, color: "text-blue-500" },
    { label: "Resueltas", value: stats?.resolved ?? 0, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-500" },
    { label: "Media resolución", value: `${stats?.avg_resolution_hours ?? 0}h`, icon: <TrendingUp className="h-5 w-5" />, color: "text-purple-500" },
    { label: "Usuarios activos", value: activeUsers, icon: <Users className="h-5 w-5" />, color: "text-brand-500" },
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

      {/* Critical incidents */}
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

      {/* Two columns: recent users + recent incidents */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Usuarios recientes</CardTitle>
                <Link to="/admin/users" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Ver todos →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <EmptyState message="No hay usuarios registrados." />
              ) : (
                <div className="flex flex-col gap-3">
                  {recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-sm font-semibold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{u.username}</p>
                          <p className="text-xs text-ink-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={u.role === "ADMIN" ? "brand" : u.role === "STAFF" ? "info" : "default"}>
                          {u.role}
                        </Badge>
                        {u.is_active ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="danger">Inactivo</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent incidents */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Incidencias recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <EmptyState message="No hay incidencias." />
              ) : (
                <div className="flex flex-col gap-3">
                  {incidents.slice(0, 5).map((inc) => (
                    <div key={inc.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          inc.urgency === "CRITICAL" ? "bg-red-100 text-red-600" :
                          inc.urgency === "HIGH" ? "bg-amber-100 text-amber-600" :
                          "bg-ink-100 text-ink-500"
                        }`}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{inc.title}</p>
                          <p className="text-xs text-ink-400">{inc.location}</p>
                        </div>
                      </div>
                      <Badge variant={statusVariant[inc.status]}>
                        {statusLabel[inc.status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
