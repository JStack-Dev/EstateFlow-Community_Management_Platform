import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Package,
  UserCheck,
  HardHat,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import { useAuth } from "@/hooks/useAuth";
import type { Incident, Reservation, Package as Pkg, VisitorAccess, Work } from "@/types";
import {
  PageHeader,
  StatCard,
  Spinner,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
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

export default function Inicio() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [accesses, setAccesses] = useState<VisitorAccess[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const endpoints = [
          "/api/incidents/",
          "/api/reservations/",
          "/api/packages/resident/",
          "/api/access/resident/",
          "/api/works/resident/",
        ];

        const responses = await Promise.all(endpoints.map((url) => apiFetch(url)));

        const data = await Promise.all(
          responses.map(async (response) => {
            if (!response || !response.ok) return [];
            return await response.json();
          })
        );

        setIncidents(data[0] || []);
        setReservations(data[1] || []);
        setPackages(data[2] || []);
        setAccesses(data[3] || []);
        setWorks(data[4] || []);
      } catch {
        console.error("Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const openIncidents = incidents.filter((i) => i.status !== "RESOLVED");
  const pendingPackages = packages.filter((p) => !p.delivered);
  const upcomingReservations = reservations
    .filter((r) => new Date(r.date) >= new Date(new Date().toDateString()))
    .slice(0, 3);
  const recentIncidents = incidents.slice(0, 4);

  const cards = [
    { label: "Incidencias abiertas", value: openIncidents.length, icon: <AlertCircle className="h-5 w-5" />, link: "/portal/incidencias", color: "text-amber-500" },
    { label: "Reservas activas", value: reservations.length, icon: <CalendarDays className="h-5 w-5" />, link: "/portal/reservas", color: "text-blue-500" },
    { label: "Paquetes pendientes", value: pendingPackages.length, icon: <Package className="h-5 w-5" />, link: "/portal/paqueteria", color: "text-purple-500" },
    { label: "Visitas autorizadas", value: accesses.length, icon: <UserCheck className="h-5 w-5" />, link: "/portal/accesos", color: "text-emerald-500" },
    { label: "Obras registradas", value: works.length, icon: <HardHat className="h-5 w-5" />, link: "/portal/obras", color: "text-orange-500" },
  ];

  const quickActions = [
    { label: "Reportar incidencia", link: "/portal/incidencias", icon: AlertCircle },
    { label: "Reservar instalación", link: "/portal/reservas", icon: CalendarDays },
    { label: "Autorizar visita", link: "/portal/accesos", icon: UserCheck },
    { label: "Registrar obra", link: "/portal/obras", icon: HardHat },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Hola, ${user?.username || "vecino"}`}
        description="Resumen de tu actividad en Residencial Los Olivos."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link to={card.link}>
              <StatCard
                label={card.label}
                value={card.value}
                icon={<span className={card.color}>{card.icon}</span>}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.link}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-ink-200 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-tertiary text-ink-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-ink-700 text-center">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent incidents */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Incidencias recientes</CardTitle>
                <Link to="/portal/incidencias" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Ver todas →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink-400">No hay incidencias</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentIncidents.map((inc) => (
                    <div key={inc.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3 transition-colors hover:bg-surface-tertiary/40">
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

        {/* Right column: reservations + packages */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="flex flex-col gap-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Próximas reservas</CardTitle>
                <Link to="/portal/reservas" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Ver todas →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink-400">No hay reservas próximas</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingReservations.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 rounded-lg border border-ink-100 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-900">{r.facility_name || "Instalación"}</p>
                        <p className="text-xs text-ink-400">
                          {new Date(r.date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })} · {r.start_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Paquetes pendientes</CardTitle>
                <Link to="/portal/paqueteria" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Ver todos →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {pendingPackages.length === 0 ? (
                <div className="flex items-center gap-2 py-4 text-sm text-ink-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No tienes paquetes pendientes
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pendingPackages.slice(0, 3).map((pkg) => (
                    <div key={pkg.id} className="flex items-center gap-3 rounded-lg border border-ink-100 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-900">{pkg.carrier}</p>
                        <p className="text-xs text-ink-400">{pkg.description}</p>
                      </div>
                      <Badge variant="warning">
                        <Clock className="h-3 w-3" />
                        Pendiente
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
