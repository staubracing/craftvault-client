import type { Location, LocationCreateInput, LocationQueryParams } from '../types';
import { getAll, getOne, create, update, remove } from './client';

export const locationsApi = {
  getAll: (params?: LocationQueryParams) => getAll<Location>('/locations', params as Record<string, string | boolean | number | undefined>),
  getByZone: (zoneId: string) => getAll<Location>(`/locations`, { zone_id: zoneId }),
  getById: (id: string) => getOne<Location>('/locations', id),
  create: (data: LocationCreateInput) => create<Location, LocationCreateInput>('/locations', data),
  update: (id: string, data: Partial<LocationCreateInput>) => update<Location, LocationCreateInput>('/locations', id, data),
  remove: (id: string) => remove('/locations', id),
};
