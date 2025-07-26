const BASE_URL = "http://localhost:3000/api";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T> {
  method?: HTTPMethod;
  body?: T;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

async function apiFetch<T = unknown, B = unknown>(
  endpoint: string,
  options: RequestOptions<B> = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...headers,
    },
    credentials: "include", // Important for CORS with cookies or JWT
    signal,
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  if (!res.ok) {
    const errorText = await res.text();
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

export default apiFetch;
