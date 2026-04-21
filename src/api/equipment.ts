import type {
  Equipment,
  EquipmentDetail,
  EquipmentCreateInput,
  EquipmentPhoto,
  EquipmentPhotoUpdateInput,
  EquipmentQueryParams,
} from '../types';
import { getAll, getOne, create, update, remove, request } from './client';
import type { ApiResponse, ApiMessageResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export function getPhotoUrl(filePath: string): string {
  return `${BASE_URL}${filePath}`;
}

export const equipmentApi = {
  getCategories: () => request<ApiResponse<string[]>>('/equipment/categories'),
  getAll: (params?: EquipmentQueryParams) => getAll<Equipment>('/equipment', params as Record<string, string | boolean | number | undefined>),
  getByLocation: (locationId: string) => getAll<Equipment>(`/equipment/by-location/${locationId}`),
  getById: (id: string) => getOne<EquipmentDetail>('/equipment', id),
  create: (data: EquipmentCreateInput) => create<Equipment, EquipmentCreateInput>('/equipment', data),
  update: (id: string, data: Partial<EquipmentCreateInput>) => update<Equipment, EquipmentCreateInput>('/equipment', id, data),
  remove: (id: string) => remove('/equipment', id),

  // ── Photos ──────────────────────────────────
  getPhotos: (equipmentId: string) =>
    request<ApiResponse<EquipmentPhoto[]>>(`/equipment/${equipmentId}/photos`),

  uploadPhoto: (equipmentId: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    return request<ApiResponse<EquipmentPhoto>>(`/equipment/${equipmentId}/photos`, {
      method: 'POST',
      body: formData,
    });
  },

  updatePhoto: (equipmentId: string, photoId: string, data: EquipmentPhotoUpdateInput) =>
    request<ApiResponse<EquipmentPhoto>>(`/equipment/${equipmentId}/photos/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePhoto: (equipmentId: string, photoId: string) =>
    request<ApiMessageResponse>(`/equipment/${equipmentId}/photos/${photoId}`, {
      method: 'DELETE',
    }),
};
