import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch(
        "http://localhost:8000/api/incidents/",
        {
          method: "POST",
          credentials: "include",
          body: data,
        }
      );

      if (response.ok) {
        navigate("/resident/requests");
      } else {
        alert("Error submitting request.");
      }
    } catch (error) {
      alert("Connection error.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 style={styles.heading}>Request Service</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Service Title</label>
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
          <label style={styles.label}>Category</label>
          <select
            name="category"
            style={styles.input}
            value={formData.category}
            onChange={handleChange}
          >
            <option value="ELECTRICITY">Electricity</option>
            <option value="PLUMBING">Plumbing</option>
            <option value="SECURITY">Security</option>
            <option value="GARDENING">Gardening</option>
            <option value="CLEANING">Cleaning</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Location</label>
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
          <label style={styles.label}>Urgency Level</label>
          <select
            name="urgency"
            style={styles.input}
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Description</label>
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
          <label style={styles.label}>Attach Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div style={styles.previewContainer}>
            <img src={preview} alt="Preview" style={styles.preview} />
          </div>
        )}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
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
