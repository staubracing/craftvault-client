import type { Supply, SupplyCreateInput, SupplyQueryParams, ApiResponse } from '../types';
import { getAll, getOne, create, update, remove, request } from './client';

export const suppliesApi = {
  getCategories: () => request<ApiResponse<string[]>>('/supplies/categories'),
  getAll: (params?: SupplyQueryParams) => getAll<Supply>('/supplies', params as Record<string, string | boolean | number | undefined>),
  getByLocation: (locationId: string) => getAll<Supply>(`/supplies/by-location/${locationId}`),
  getById: (id: string) => getOne<Supply>('/supplies', id),
  create: (data: SupplyCreateInput) => create<Supply, SupplyCreateInput>('/supplies', data),
  update: (id: string, data: Partial<SupplyCreateInput>) => update<Supply, SupplyCreateInput>('/supplies', id, data),
  remove: (id: string) => remove('/supplies', id),
};
