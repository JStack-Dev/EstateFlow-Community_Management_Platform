import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔥 evita doble submit

    setError(null);
    setLoading(true);

    try {
      // -----------------------
      // LOGIN (TOKEN)
      // -----------------------
      const loginRes = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData?.detail || "Credenciales incorrectas");
        return;
      }

      // -----------------------
      // GUARDAR TOKENS
      // -----------------------
      localStorage.setItem("access", loginData.access);
      localStorage.setItem("refresh", loginData.refresh);

      // -----------------------
      // OBTENER USUARIO
      // -----------------------
      const userRes = await fetch("http://127.0.0.1:8000/api/auth/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.access}`,
        },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setError("Error obteniendo usuario");
        return;
      }

      // -----------------------
      // GUARDAR USUARIO GLOBAL
      // -----------------------
      setUser(userData);

      // -----------------------
      // REDIRECCIÓN
      // -----------------------
      navigate("/portal");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>EstateFlow</h1>

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

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <div style={styles.footer}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
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
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  title: {
    textAlign: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
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
    textAlign: "center",
  },
};