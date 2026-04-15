import type {
  Project,
  ProjectDetail,
  ProjectCreateInput,
  ProjectSupply,
  ProjectSupplyCreateInput,
  ProjectQueryParams,
  ApiMessageResponse,
} from '../types';
import { getAll, getOne, create, update, remove, request } from './client';

export const projectsApi = {
  getAll: (params?: ProjectQueryParams) => getAll<Project>('/projects', params as Record<string, string | boolean | number | undefined>),
  getById: (id: string) => getOne<ProjectDetail>('/projects', id),
  create: (data: ProjectCreateInput) => create<Project, ProjectCreateInput>('/projects', data),
  update: (id: string, data: Partial<ProjectCreateInput>) => update<Project, ProjectCreateInput>('/projects', id, data),
  remove: (id: string) => remove('/projects', id),
  addSupply: (projectId: string, data: ProjectSupplyCreateInput) =>
    request<{ success: true; data: ProjectSupply }>(`/projects/${projectId}/supplies`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  removeSupply: (projectId: string, supplyId: string): Promise<ApiMessageResponse> =>
    request<ApiMessageResponse>(`/projects/${projectId}/supplies/${supplyId}`, {
      method: 'DELETE',
    }),
};
