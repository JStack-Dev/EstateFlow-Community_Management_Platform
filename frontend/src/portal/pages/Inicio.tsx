import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Package,
  UserCheck,
  HardHat,
} from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import { PageHeader, StatCard, Spinner } from "@/components/ui";

export default function Inicio() {
  const [stats, setStats] = useState({
    incidents: 0,
    reservations: 0,
    packages: 0,
    accesses: 0,
    works: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
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

        setStats({
          incidents: data[0]?.length || 0,
          reservations: data[1]?.length || 0,
          packages: data[2]?.length || 0,
          accesses: data[3]?.length || 0,
          works: data[4]?.length || 0,
        });
      } catch {
        console.error("Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const cards = [
    { label: "Incidencias abiertas", value: stats.incidents, icon: <AlertCircle className="h-5 w-5" /> },
    { label: "Reservas activas", value: stats.reservations, icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Paquetes pendientes", value: stats.packages, icon: <Package className="h-5 w-5" /> },
    { label: "Visitas autorizadas", value: stats.accesses, icon: <UserCheck className="h-5 w-5" /> },
    { label: "Obras activas", value: stats.works, icon: <HardHat className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel de control"
        description="Resumen de tu actividad en la urbanización."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            className="motion-delay"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-base font-semibold text-ink-900">Bienvenido a EstateFlow</h3>
        <p className="mt-2 text-sm text-ink-500">
          Desde aquí puedes gestionar todas tus necesidades como residente: reportar
          incidencias, reservar instalaciones comunes, autorizar accesos de visitas,
          registrar obras y consultar tus paquetes.
        </p>
      </motion.div>
    </div>
  );
}
