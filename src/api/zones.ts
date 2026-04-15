import type { Zone, ZoneDetail, ZoneCreateInput, ZoneQueryParams } from '../types';
import { getAll, getOne, create, update, remove } from './client';

export const zonesApi = {
  getAll: (params?: ZoneQueryParams) => getAll<Zone>('/zones', params as Record<string, string | boolean | number | undefined>),
  getById: (id: string) => getOne<ZoneDetail>('/zones', id),
  create: (data: ZoneCreateInput) => create<Zone, ZoneCreateInput>('/zones', data),
  update: (id: string, data: Partial<ZoneCreateInput>) => update<Zone, ZoneCreateInput>('/zones', id, data),
  remove: (id: string) => remove('/zones', id),
};
