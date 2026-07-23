import { useEffect, useState } from "react";
import { User, Mail, Home, Shield } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import type { User as UserType } from "@/types";
import { PageHeader, Spinner, Card, CardContent } from "@/components/ui";

export default function Perfil() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me/");
        if (!res || !res.ok) return;
        const data: UserType = await res.json();
        setUser(data);
      } catch {
        console.error("Error cargando perfil");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-ink-500">No se pudo cargar el perfil.</p>;
  }

  const fields = [
    { label: "Usuario", value: user.username, icon: User },
    { label: "Email", value: user.email || "No disponible", icon: Mail },
    { label: "Tipo de usuario", value: user.tipo_usuario, icon: Shield },
    { label: "Vivienda", value: user.vivienda || "No asignada", icon: Home },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Mi perfil" description="Información de tu cuenta." />

      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-tertiary text-ink-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-400">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-ink-900">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
