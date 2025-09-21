import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import APIError from "./apiError";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3001/api";

// ✅ Preconfigured axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T> {
  method?: HTTPMethod;
  body?: T;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  requiresAuth?: boolean;
}

async function apiFetch<T = unknown, B = unknown>(
  endpoint: string,
  options: RequestOptions<B> = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    requiresAuth = false,
  } = options;

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    headers: { ...headers },
    data: body,
    signal,
  };

  // 🔑 Inject auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers ??= {};
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }
  }

  try {
    const response: AxiosResponse<T> = await apiClient.request<T>(config);
    return response.data;
  } catch (err: unknown) {
    // ✅ Narrow the error type safely
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string }>;
      throw new APIError(
        axiosError.response?.status ?? 500,
        axiosError.response?.data.message ?? axiosError.message,
        axiosError.response?.data,
      );
    }

    if (err instanceof Error) {
      throw new APIError(500, err.message);
    }

    throw new APIError(500, "API call failed");
  }
}

export default apiFetch;
