import type { Drill, DrillCreateInput, DrillQueryParams } from '../types';
import { getAll, getOne, create, update, remove } from './client';

export const drillsApi = {
  getAll: (params?: DrillQueryParams) => getAll<Drill>('/drills', params as Record<string, string | boolean | number | undefined>),
  getByLocation: (locationId: string) => getAll<Drill>(`/drills/by-location/${locationId}`),
  getById: (id: string) => getOne<Drill>('/drills', id),
  create: (data: DrillCreateInput) => create<Drill, DrillCreateInput>('/drills', data),
  update: (id: string, data: Partial<DrillCreateInput>) => update<Drill, DrillCreateInput>('/drills', id, data),
  remove: (id: string) => remove('/drills', id),
};
