import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config/api";
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
    setError(null);
    setLoading(true);

    // 🔥 DEBUG CLAVE
    console.log("LOGIN DATA:", formData);

    try {
      const res = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setError(data?.detail || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const userRes = await fetch(`${API_URL}/api/auth/me/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!userRes.ok) {
        throw new Error("Error obteniendo usuario");
      }

      const userData = await userRes.json();

      console.log("USER DATA:", userData);

      setUser(userData);

      navigate("/portal");

    } catch (err) {
      console.error("ERROR LOGIN:", err);
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