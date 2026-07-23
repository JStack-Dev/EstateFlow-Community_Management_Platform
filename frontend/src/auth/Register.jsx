import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tipo_usuario: "PROPIETARIO",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      const userData = await login(formData.username, formData.password);

      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "STAFF") {
        navigate("/operativa");
      } else {
        navigate("/portal");
      }

    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <form style={styles.card} onSubmit={handleSubmit}>

        <h1 style={styles.title}>Registro</h1>

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          style={styles.input}
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          style={styles.input}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="tipo_usuario"
          style={styles.input}
          value={formData.tipo_usuario}
          onChange={handleChange}
        >
          <option value="PROPIETARIO">Propietario</option>
          <option value="INQUILINO">Inquilino</option>
          <option value="PERSONAL">Personal</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <div style={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>

      </form>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#111827",
    color: "white",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "13px",
  },
};