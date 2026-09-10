const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface UserNasabah {
  id: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  saldoPoin: number;
  foto?: string | null;
}

export interface UserAdminBank {
  id: string;
  namaUnit: string;
  namaPengelola: string;
  telp: string;
}

export interface UserProfile {
  id: string;
  username: string;
  role: 'NASABAH' | 'ADMIN';
  nasabah?: UserNasabah | null;
  adminBank?: UserAdminBank | null;
}

export interface AuthResponse {
  message: string;
  data: {
    id: string;
    username: string;
    role: 'NASABAH' | 'ADMIN';
    nasabah?: UserNasabah | null;
    adminBank?: UserAdminBank | null;
    token: string;
  };
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Utility error handler to format NestJS exception responses cleanly
 */
function handleApiError(errorData: any): string {
  if (!errorData) return 'Terjadi kesalahan sistem. Silakan coba lagi.';
  if (typeof errorData.message === 'string') {
    return errorData.message;
  }
  if (Array.isArray(errorData.message)) {
    return errorData.message.join(', ');
  }
  return 'Gagal memproses permintaan.';
}

/**
 * Login API endpoint call
 */
export async function loginApi(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(handleApiError(resData));
  }

  return resData;
}

/**
 * Register Nasabah (Warga) API endpoint call
 */
export async function registerNasabahApi(formData: FormData): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/nasabah/register`, {
    method: 'POST',
    body: formData, // multipart/form-data
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(handleApiError(resData));
  }

  return resData;
}

/**
 * Register Admin Bank Sampah API endpoint call
 */
export async function registerAdminApi(data: {
  username: string;
  password: string;
  namaUnit: string;
  namaPengelola: string;
  telp: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(handleApiError(resData));
  }

  return resData;
}

/**
 * Get current user profile (GET /auth/me)
 */
export async function getMeApi(token: string): Promise<{ message: string; data: UserProfile }> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(handleApiError(resData));
  }

  return resData;
}
