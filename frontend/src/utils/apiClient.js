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

function buildHeaders(options) {
  const access = localStorage.getItem("access");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
    Authorization: access ? `Bearer ${access}` : "",
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

// 🔥 FETCH GLOBAL
export async function apiFetch(endpoint, options = {}) {
  // 🔹 PRIMERA PETICIÓN
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(options),
  });

  // 🔁 SI FALLA → INTENTAR REFRESH
  if (response.status === 401) {
    try {
      const newAccess = await refreshAccessToken();

      const refreshedOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newAccess}`,
        },
      };
      if (!(options.body instanceof FormData)) {
        refreshedOptions.headers["Content-Type"] = "application/json";
      }

      response = await fetch(`${API_URL}${endpoint}`, refreshedOptions);
    } catch (error) {
      console.error("Refresh fallido:", error);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/#/login";
      return null;
    }
  }

  return response;
}