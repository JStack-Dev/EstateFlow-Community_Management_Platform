import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Incident } from "@/types";
import {
  PageHeader,
  Button,
  Input,
  Textarea,
  Select,
  Alert,
  Badge,
  Spinner,
  Card,
  CardContent,
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

const urgencyVariant: Record<string, "default" | "warning" | "danger"> = {
  NORMAL: "default",
  HIGH: "warning",
  CRITICAL: "danger",
};

export default function Incidencias() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "INFRASTRUCTURE",
    urgency: "NORMAL",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createIncident = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await apiFetch("/api/incidents/", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res || !res.ok) {
        setError("Error al crear incidencia");
        setSubmitting(false);
        return;
      }

      setForm({
        title: "",
        description: "",
        location: "",
        category: "INFRASTRUCTURE",
        urgency: "NORMAL",
      });
      setShowForm(false);
      loadIncidents();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mis incidencias"
        description="Reporta y consulta incidencias de tu vivienda o zonas comunes."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Nueva incidencia
          </Button>
        }
      />

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              <form onSubmit={createIncident} className="flex flex-col gap-4">
                <Input
                  name="title"
                  placeholder="Título de la incidencia"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Describe el problema..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="location"
                  placeholder="Ubicación (ej: garaje bloque A)"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select name="category" value={form.category} onChange={handleChange}>
                    <option value="INFRASTRUCTURE">Infraestructura</option>
                    <option value="ELECTRICITY">Electricidad</option>
                    <option value="PLUMBING">Fontanería</option>
                    <option value="SECURITY">Seguridad</option>
                    <option value="GARDENING">Jardinería</option>
                    <option value="CLEANING">Limpieza</option>
                    <option value="EMERGENCY">Emergencia</option>
                  </Select>
                  <Select name="urgency" value={form.urgency} onChange={handleChange}>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Spinner className="h-4 w-4" /> : "Crear incidencia"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : incidents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No has reportado ninguna incidencia todavía." />
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
                  <TableCell>
                    <Badge variant={urgencyVariant[inc.urgency]}>
                      {inc.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-ink-400">
                    {new Date(inc.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
