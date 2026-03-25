const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://estateflow-backend.onrender.com";

export default API_URL;