import { useEffect, useState } from "react";
import { Package, CheckCircle2, Clock } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { Package as Pkg } from "@/types";
import {
  PageHeader,
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

export default function Paqueteria() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      const res = await apiFetch("/api/packages/resident/");
      if (res && res.ok) {
        const data: Pkg[] = await res.json();
        setPackages(data);
      }
      setLoading(false);
    };
    loadPackages();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Paquetería"
        description="Consulta el estado de tus paquetes y envíos."
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No tienes paquetes registrados." />
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium text-ink-900">{pkg.carrier}</TableCell>
                  <TableCell className="font-mono text-xs text-ink-500">{pkg.tracking_number}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
