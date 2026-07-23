import API_URL from "../config/api";

async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Refresh inválido");

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access as string;
}

function buildHeaders(options: RequestInit = {}): Record<string, string> {
  const access = localStorage.getItem("access");
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: access ? `Bearer ${access}` : "",
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response | null> {
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(options),
  });

  if (response.status === 401) {
    try {
      const newAccess = await refreshAccessToken();
      const refreshedOptions: RequestInit = {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${newAccess}`,
          "Content-Type": "application/json",
        },
      };
      if (options.body instanceof FormData) {
        delete (refreshedOptions.headers as Record<string, string>)["Content-Type"];
      }
      response = await fetch(`${API_URL}${endpoint}`, refreshedOptions);
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/#/login";
      return null;
    }
  }

  return response;
}
