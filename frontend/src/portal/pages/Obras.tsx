import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, HardHat } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Work } from "@/types";
import {
  PageHeader,
  Button,
  Input,
  Textarea,
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

export default function Obras() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    company: "",
    workers_count: 1,
  });

  const loadWorks = async () => {
    const res = await apiFetch("/api/works/resident/");
    if (res && res.ok) {
      const data: Work[] = await res.json();
      setWorks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createWork = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await apiFetch("/api/works/resident/", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res || !res.ok) {
      setError("Error registrando obra");
      return;
    }

    setForm({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      company: "",
      workers_count: 1,
    });
    setShowForm(false);
    loadWorks();
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Obras"
        description="Registra obras en tu vivienda para autorización de accesos."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Registrar obra
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
              <form onSubmit={createWork} className="flex flex-col gap-4">
                <Input
                  name="title"
                  placeholder="Tipo de obra"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Descripción de la obra..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
                  <Input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input name="company" placeholder="Empresa" value={form.company} onChange={handleChange} />
                  <Input type="number" name="workers_count" value={form.workers_count} onChange={handleChange} min={1} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Registrar</Button>
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
      ) : works.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No tienes obras registradas." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium text-ink-900">{w.title}</TableCell>
                  <TableCell>{new Date(w.start_date).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{new Date(w.end_date).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <Badge>{w.status}</Badge>
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
