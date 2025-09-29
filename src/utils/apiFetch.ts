import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import APIError from "./apiError";

console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Preconfigured axios instance - REMOVED default Content-Type
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // DON'T set Content-Type here - let axios set it based on the data
  timeout: 10000,
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data as unknown,
      headers: config.headers,
    });
    return config;
  },
  (error: unknown) => {
    console.error("Request Error:", error);
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data as unknown,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error("Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

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

  // Build config object
  const config: AxiosRequestConfig = {
    method,
    headers: { ...headers },
    signal,
  };

  // Add body data if present
  if (body !== undefined && body !== null && method !== "GET") {
    config.data = body;

    // IMPORTANT: Set Content-Type based on body type
    // If body is FormData, don't set Content-Type (let browser set it with boundary)
    // Otherwise, set it to application/json
    if (!(body instanceof FormData)) {
      // Safely set Content-Type for non-FormData requests
      config.headers ??= {};
      config.headers["Content-Type"] = "application/json";
    }
    // For FormData, explicitly delete Content-Type if it was set
    else if (config.headers && "Content-Type" in config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  // Inject auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Safely set Authorization header
      config.headers ??= {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No access token found for authenticated request");
    }
  }

  try {
    // Use the endpoint directly with the axios instance
    const response: AxiosResponse<T> = await apiClient(endpoint, config);
    return response.data;
  } catch (err: unknown) {
    // Narrow the error type safely
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;

      // Check for network errors
      if (!axiosError.response) {
        console.error("Network error - server might be down or CORS issue");
        throw new APIError(
          0,
          "Network error - please check if the server is running",
          { originalError: axiosError.message },
        );
      }

      throw new APIError(
        axiosError.response.status,
        axiosError.response.data.message ??
          axiosError.response.data.error ??
          axiosError.message,
        axiosError.response.data,
      );
    }

    if (err instanceof Error) {
      throw new APIError(500, err.message);
    }

    throw new APIError(500, "API call failed");
  }
}

export default apiFetch;
