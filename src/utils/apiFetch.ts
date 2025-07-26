import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const BASE_URL = "http://localhost:3000/api";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T> {
  method?: HTTPMethod;
  body?: T;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function apiFetch<T = unknown, B = unknown>(
  endpoint: string,
  options: RequestOptions<B> = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data: body,
    signal,
    withCredentials: true,
  };

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    let message = "API call failed";

    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError<{ message?: string }>;
      message = apiError.response?.data.message ?? message;
    }

    throw new Error(message);
  }
}

export default apiFetch;
