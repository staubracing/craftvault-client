import type { Color, ApiResponse } from '../types';
import { getAll, getOne, request } from './client';

export const colorsApi = {
  getAll: () => getAll<Color>('/colors'),
  getByDmcCode: (code: string) => request<ApiResponse<Color>>(`/colors/dmc/${code}`),
  getById: (id: string) => getOne<Color>('/colors', id),
};
