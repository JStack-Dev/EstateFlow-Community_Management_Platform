import { useEffect, useState } from "react";

export default function Perfil() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {

    try {

      const response = await fetch(
        "http://localhost:8000/api/auth/me/",
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        console.error("Error cargando usuario");
        return;
      }

      const data = await response.json();

      setUser(data);

    } catch (error) {

      console.error("Error cargando perfil", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    return <p>No se pudo cargar el perfil.</p>;
  }

  return (

    <div>

      <h1>Mi perfil</h1>

      <div style={styles.card}>

        <div style={styles.row}>
          <strong>Usuario:</strong>
          <span>{user.username}</span>
        </div>

        <div style={styles.row}>
          <strong>Tipo de usuario:</strong>
          <span>{user.tipo_usuario}</span>
        </div>

        <div style={styles.row}>
          <strong>Vivienda:</strong>
          <span>{user.vivienda || "No asignada"}</span>
        </div>

      </div>

    </div>

  );

}

const styles = {

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    maxWidth: "400px",
    marginTop: "20px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px"
  }

};