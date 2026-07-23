import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { User, UserRole } from "@/types";
import {
  PageHeader,
  Badge,
  Select,
  Spinner,
  Button,
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

const roleConfig: Record<UserRole, { label: string; variant: "default" | "info" | "brand" }> = {
  USER: { label: "Usuario", variant: "default" },
  STAFF: { label: "Staff", variant: "info" },
  ADMIN: { label: "Admin", variant: "brand" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/users/")
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data: User[] | null) => {
        if (data) setUsers(data);
      })
      .catch(() => console.error("Error cargando usuarios"))
      .finally(() => setLoading(false));
  }, []);

  const updateRole = async (userId: number, newRole: UserRole) => {
    const res = await apiFetch(`/api/users/${userId}/`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    if (res && res.ok) {
      const updated: User = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    }
  };

  const toggleActivo = async (user: User) => {
    const res = await apiFetch(`/api/users/${user.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !user.is_active }),
    });
    if (res && res.ok) {
      const updated: User = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de usuarios"
        description="Administra roles y estado de los usuarios del sistema."
      />

      {users.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No hay usuarios registrados." />
          </CardContent>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const role = roleConfig[user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-ink-900">{user.username}</TableCell>
                    <TableCell className="text-ink-500">{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                        className="h-8 w-28 text-xs"
                      >
                        <option value="USER">Usuario</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge>{user.tipo_usuario}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge variant="success">
                          <ShieldCheck className="h-3 w-3" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="danger">
                          <ShieldAlert className="h-3 w-3" />
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="secondary" onClick={() => toggleActivo(user)}>
                        {user.is_active ? "Desactivar" : "Activar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
