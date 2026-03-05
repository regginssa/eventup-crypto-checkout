import { IApiRes } from "@/types/api.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<IApiRes<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "API request failed");
  }

  return json as IApiRes<T>;
}
