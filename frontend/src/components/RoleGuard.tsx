import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-ink-500">No estás autenticado</p>
      </div>
    );
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-ink-500">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
