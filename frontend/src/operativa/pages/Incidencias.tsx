import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiClient";
import type { Incident } from "@/types";
import {
  PageHeader,
  Badge,
  Select,
  Spinner,
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  Card,
  CardContent,
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

export default function IncidenciasOperativa() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIncidents = async () => {
    try {
      const res = await apiFetch("/api/incidents/");
      if (!res || !res.ok) throw new Error();
      const data: Incident[] = await res.json();
      setIncidents(data);
    } catch {
      console.error("Error cargando incidencias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/incidents/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res && res.ok) {
        loadIncidents();
      } else {
        alert("No se pudo actualizar el estado");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de incidencias"
        description="Administra las incidencias reportadas por los residentes."
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : incidents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No hay incidencias registradas." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Urgencia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cambiar estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell className="font-medium text-ink-900">{inc.title}</TableCell>
                  <TableCell>{inc.location}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[inc.status]}>
                      {statusLabel[inc.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{inc.urgency}</TableCell>
                  <TableCell className="text-ink-400">
                    {new Date(inc.created_at).toLocaleDateString("es-ES")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={inc.status}
                      onChange={(e) => updateStatus(inc.id, e.target.value)}
                      className="h-8 text-xs"
                    >
                      <option value="OPEN">Abierta</option>
                      <option value="IN_PROGRESS">En progreso</option>
                      <option value="RESOLVED">Resuelta</option>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
