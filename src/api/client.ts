import type {
  ApiResponse,
  ApiErrorResponse,
  ApiMessageResponse,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`;
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = { ...options };
  if (!isFormData) {
    config.headers = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const body = (await response.json()) as ApiErrorResponse;
    throw new ApiError(response.status, body.message, body.errors);
  }

  return response.json() as Promise<T>;
}

function buildQuery(params?: Record<string, string | boolean | number | undefined>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return `?${qs.join('&')}`;
}

// ── Generic resource helpers ──────────────────────────

export function getAll<T>(resource: string, params?: Record<string, string | boolean | number | undefined>): Promise<ApiResponse<T[]>> {
  return request<ApiResponse<T[]>>(`${resource}${buildQuery(params)}`);
}

export function getOne<T>(resource: string, id: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(`${resource}/${id}`);
}

export function create<T, U>(resource: string, data: U): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(resource, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function update<T, U>(resource: string, id: string, data: Partial<U>): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(`${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function remove(resource: string, id: string): Promise<ApiMessageResponse> {
  return request<ApiMessageResponse>(`${resource}/${id}`, {
    method: 'DELETE',
  });
}

export { ApiError, buildQuery, request };
