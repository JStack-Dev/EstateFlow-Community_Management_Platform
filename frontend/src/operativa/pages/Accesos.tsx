import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiClient";
import type { VisitorAccess } from "@/types";
import {
  PageHeader,
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

  useEffect(() => {
    const loadAccesses = async () => {
      try {
        const res = await apiFetch("/api/access/staff/");
        if (!res || !res.ok) throw new Error();
        const data: VisitorAccess[] = await res.json();
        setAccesses(data);
      } catch {
        console.error("Error cargando accesos");
      } finally {
        setLoading(false);
      }
    };
    loadAccesses();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Control de accesos"
        description="Autoriza accesos de empresas, visitas y proveedores."
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : accesses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No hay autorizaciones de acceso registradas." />
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
