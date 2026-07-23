import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarDays } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Reservation, Facility } from "@/types";
import {
  PageHeader,
  Button,
  Input,
  Select,
  Alert,
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

export default function Reservas() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    facility: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const loadReservations = async () => {
    const res = await apiFetch("/api/reservations/");
    if (res && res.ok) {
      const data: Reservation[] = await res.json();
      setReservations(data);
    }
    setLoading(false);
  };

  const loadFacilities = async () => {
    const res = await apiFetch("/api/reservations/facilities/");
    if (res && res.ok) {
      const data: Facility[] = await res.json();
      setFacilities(data);
    }
  };

  useEffect(() => {
    loadReservations();
    loadFacilities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createReservation = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await apiFetch("/api/reservations/", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res || !res.ok) {
      setError("No se pudo crear la reserva. Verifica que el horario esté disponible.");
      return;
    }

    setForm({ facility: "", date: "", start_time: "", end_time: "" });
    setShowForm(false);
    loadReservations();
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reservas"
        description="Reserva instalaciones comunes de tu urbanización."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Nueva reserva
          </Button>
        }
      />

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              <form onSubmit={createReservation} className="flex flex-col gap-4">
                <Select name="facility" value={form.facility} onChange={handleChange} required>
                  <option value="">Seleccionar instalación</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Select>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input type="date" name="date" value={form.date} onChange={handleChange} required />
                  <Input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
                  <Input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Crear reserva</Button>
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
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No tienes reservas activas." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instalación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-ink-900">{r.facility_name}</TableCell>
                  <TableCell>{new Date(r.date).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{r.start_time}</TableCell>
                  <TableCell>{r.end_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
