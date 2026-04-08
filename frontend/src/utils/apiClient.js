import API_URL from "../config/api";

// 🔁 REFRESH TOKEN
async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    throw new Error("Refresh inválido");
  }

  const data = await res.json();

  localStorage.setItem("access", data.access);

  return data.access;
}

// 🔥 FETCH GLOBAL
export async function apiFetch(endpoint, options = {}) {
  let access = localStorage.getItem("access");

  // 🔹 PRIMERA PETICIÓN
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: access ? `Bearer ${access}` : "",
    },
  });

  // 🔁 SI FALLA → INTENTAR REFRESH
  if (response.status === 401) {
    try {
      const newAccess = await refreshAccessToken();

      // 🔁 repetir petición
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          Authorization: `Bearer ${newAccess}`,
        },
      });
    } catch (error) {
      console.error("Refresh fallido:", error);

      // 🔥 LIMPIEZA TOTAL
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/#/login";
      return null;
    }
  }

  return response;
}