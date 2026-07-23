import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, UserCheck } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { VisitorAccess } from "@/types";
import {
  PageHeader,
  Button,
  Input,
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

export default function Accesos() {
  const [accesses, setAccesses] = useState<VisitorAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    visitor_name: "",
    visitor_dni: "",
    visit_date: "",
  });

  const loadAccesses = async () => {
    try {
      const res = await apiFetch("/api/access/resident/");
      if (!res || !res.ok) return;
      const data: VisitorAccess[] = await res.json();
      setAccesses(data);
    } catch {
      console.error("Error cargando accesos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccesses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createAccess = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiFetch("/api/access/resident/", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res || !res.ok) {
        setError("Error creando autorización");
        return;
      }

      setForm({ visitor_name: "", visitor_dni: "", visit_date: "" });
      setShowForm(false);
      loadAccesses();
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Accesos"
        description="Autoriza visitantes para que puedan acceder a la urbanización."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Autorizar visita
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
              <form onSubmit={createAccess} className="flex flex-col gap-4">
                <Input
                  name="visitor_name"
                  placeholder="Nombre del visitante"
                  value={form.visitor_name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="visitor_dni"
                  placeholder="DNI del visitante"
                  value={form.visitor_dni}
                  onChange={handleChange}
                />
                <Input
                  type="date"
                  name="visit_date"
                  value={form.visit_date}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit">Autorizar</Button>
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
      ) : accesses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No tienes autorizaciones de acceso registradas." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitante</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accesses.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-ink-900">{a.visitor_name}</TableCell>
                  <TableCell className="font-mono text-xs">{a.visitor_dni}</TableCell>
                  <TableCell>{new Date(a.visit_date).toLocaleDateString("es-ES")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
