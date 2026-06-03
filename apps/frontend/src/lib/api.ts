const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let authHeader: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("toyxona_access_token");
    if (token) authHeader = { Authorization: `Bearer ${token}` };
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};
