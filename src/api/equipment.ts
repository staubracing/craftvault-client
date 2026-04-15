import type { Equipment, EquipmentCreateInput, EquipmentQueryParams } from '../types';
import { getAll, getOne, create, update, remove, request } from './client';
import type { ApiResponse } from '../types';

export const equipmentApi = {
  getCategories: () => request<ApiResponse<string[]>>('/equipment/categories'),
  getAll: (params?: EquipmentQueryParams) => getAll<Equipment>('/equipment', params as Record<string, string | boolean | number | undefined>),
  getByLocation: (locationId: string) => getAll<Equipment>(`/equipment/by-location/${locationId}`),
  getById: (id: string) => getOne<Equipment>('/equipment', id),
  create: (data: EquipmentCreateInput) => create<Equipment, EquipmentCreateInput>('/equipment', data),
  update: (id: string, data: Partial<EquipmentCreateInput>) => update<Equipment, EquipmentCreateInput>('/equipment', id, data),
  remove: (id: string) => remove('/equipment', id),
};
