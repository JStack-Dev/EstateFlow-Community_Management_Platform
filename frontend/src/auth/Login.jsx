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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
        return;
      }

      // Guardar tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Obtener usuario inmediatamente
      const userRes = await fetch(`${API_URL}/api/auth/me/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!userRes.ok) throw new Error("Error obteniendo usuario");

      const userData = await userRes.json();

      console.log("USER DATA:", userData);

      setUser(userData);

      navigate("/portal");
    } catch (err) {
      console.error("ERROR LOGIN:", err);
      setError("No se pudo conectar con el servidor");
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

        <button type="submit" style={styles.button}>
          Iniciar sesión
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
  },
  footer: {
    textAlign: "center",
  },
  error: {
    color: "red",
  },
};