export const API_BASE_URL = "http://localhost:8087";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function limpiarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    limpiarSesion();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return res;
}
