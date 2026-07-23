import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Lock, User as UserIcon, ArrowRight, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import API_URL from "@/config/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tipo_usuario: "PROPIETARIO",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      const userData = await login(formData.username, formData.password);

      if (userData.role === "ADMIN") navigate("/admin");
      else if (userData.role === "STAFF") navigate("/operativa");
      else navigate("/portal");
    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-50/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Crear cuenta</h1>
            <p className="mt-1 text-sm text-ink-500">
              Únete a la plataforma de tu urbanización
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <Alert variant="danger">{error}</Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Elige un nombre de usuario"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Tipo de usuario</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 z-10" />
                <Select
                  name="tipo_usuario"
                  value={formData.tipo_usuario}
                  onChange={handleChange}
                  className="pl-10"
                >
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="INQUILINO">Inquilino</option>
                  <option value="PERSONAL">Personal</option>
                </Select>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              {loading ? <Spinner className="h-4 w-4" /> : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
