import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Clock, Package } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Package as Pkg } from "@/types";
import {
  PageHeader,
  Button,
  Input,
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

export default function Paquetes() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    resident: "",
    carrier: "",
    tracking_number: "",
    description: "",
  });

  const loadPackages = async () => {
    try {
      const res = await apiFetch("/api/packages/staff/");
      if (!res || !res.ok) throw new Error();
      const data: Pkg[] = await res.json();
      setPackages(data);
    } catch {
      console.error("Error cargando paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createPackage = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiFetch("/api/packages/staff/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res || !res.ok) {
        setError("No se pudo registrar el paquete");
        return;
      }
      setForm({ resident: "", carrier: "", tracking_number: "", description: "" });
      setShowForm(false);
      loadPackages();
    } catch {
      setError("Error de conexión");
    }
  };

  const deliverPackage = async (id: number) => {
    try {
      const res = await apiFetch(`/api/packages/deliver/${id}/`, { method: "PATCH" });
      if (res && res.ok) {
        loadPackages();
      } else {
        alert("No se pudo marcar como entregado");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de paquetería"
        description="Registra y controla la entrega de paquetes."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Registrar paquete
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
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <form onSubmit={createPackage} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input name="resident" placeholder="ID del residente" value={form.resident} onChange={handleChange} required />
                  <Input name="carrier" placeholder="Empresa transportista" value={form.carrier} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input name="tracking_number" placeholder="Número de seguimiento" value={form.tracking_number} onChange={handleChange} />
                  <Input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
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
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No hay paquetes registrados." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Seguimiento</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium text-ink-900">{pkg.carrier}</TableCell>
                  <TableCell className="font-mono text-xs">{pkg.tracking_number}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>
                    {pkg.delivered ? (
                      <Badge variant="success">
                        <CheckCircle2 className="h-3 w-3" />
                        Entregado
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <Clock className="h-3 w-3" />
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!pkg.delivered && (
                      <Button size="sm" variant="secondary" onClick={() => deliverPackage(pkg.id)}>
                        Marcar entregado
                      </Button>
                    )}
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
