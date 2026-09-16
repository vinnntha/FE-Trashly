const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-trashly-production.up.railway.app/api/v1";

export class ApiError extends Error {
  statusCode?: number;
  data?: unknown;

  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Format NestJS exception responses cleanly
 */
function formatErrorMessage(errorData: unknown): string {
  if (!errorData || typeof errorData !== "object") {
    return "Terjadi kesalahan sistem. Silakan coba lagi.";
  }
  const err = errorData as Record<string, unknown>;
  if (typeof err.message === "string") {
    return err.message;
  }
  if (Array.isArray(err.message)) {
    return err.message.join(", ");
  }
  return "Gagal memproses permintaan.";
}

/**
 * Unified API Client for Trashly frontend with Bearer token authentication
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("trashly_token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let resData: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      resData = await response.json();
    } catch {
      resData = null;
    }
  }

  if (!response.ok) {
    const message = formatErrorMessage(resData);
    throw new ApiError(message, response.status, resData);
  }

  // If response wraps in { message, data }, return data or full response
  return resData as T;
}
