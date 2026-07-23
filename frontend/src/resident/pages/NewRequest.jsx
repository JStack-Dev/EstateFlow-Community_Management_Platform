import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiClient";

export default function NewRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "INFRASTRUCTURE",
    location: "",
    urgency: "NORMAL",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("urgency", formData.urgency);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const response = await apiFetch("/api/incidents/", {
        method: "POST",
        body: data,
      });

      if (response && response.ok) {
        navigate("/resident/requests");
      } else {
        alert("Error al enviar la solicitud.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 style={styles.heading}>Solicitar servicio</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Título del servicio</label>
          <input
            type="text"
            name="title"
            required
            style={styles.input}
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Categoría</label>
          <select
            name="category"
            style={styles.input}
            value={formData.category}
            onChange={handleChange}
          >
            <option value="ELECTRICITY">Electricidad</option>
            <option value="PLUMBING">Fontanería</option>
            <option value="SECURITY">Seguridad</option>
            <option value="GARDENING">Jardinería</option>
            <option value="CLEANING">Limpieza</option>
            <option value="INFRASTRUCTURE">Infraestructura</option>
            <option value="EMERGENCY">Emergencia</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Ubicación</label>
          <input
            type="text"
            name="location"
            required
            style={styles.input}
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Nivel de urgencia</label>
          <select
            name="urgency"
            style={styles.input}
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Descripción</label>
          <textarea
            name="description"
            required
            style={styles.textarea}
            rows="5"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* IMAGEN */}
        <div style={styles.group}>
          <label style={styles.label}>Adjuntar foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div style={styles.previewContainer}>
            <img src={preview} alt="Vista previa" style={styles.preview} />
          </div>
        )}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  form: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    maxWidth: "600px",
  },
  group: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    resize: "none",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#111827",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
  previewContainer: {
    marginTop: "15px",
  },
  preview: {
    width: "100%",
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
};
