// ── Common ──────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  is_active: boolean;
  created_at: string;
}

// ── API Response Envelope ──────────────────────────────

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiMessageResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

// ── Colors ─────────────────────────────────────────────

export interface Color extends BaseEntity {
  dmc_code: string;
  symbol?: string;
  name: string;
  hex_value?: string;
}

// ── Zones ──────────────────────────────────────────────

export interface Zone extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface ZoneDetail extends Zone {
  locations: Location[];
}

export interface ZoneCreateInput {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
}

// ── Locations ──────────────────────────────────────────

export interface Location extends BaseEntity {
  zone_id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
  zone_code: string;
  zone_name: string;
}

export interface LocationCreateInput {
  zone_id: string;
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
}

// ── Drills ─────────────────────────────────────────────

export interface Drill extends BaseEntity {
  color_id: string;
  location_id: string;
  quantity: number;
  notes?: string;
  dmc_code: string;
  color_name: string;
  hex_value?: string;
  location_code: string;
  location_name: string;
  zone_code: string;
  zone_name: string;
}

export interface DrillCreateInput {
  color_id: string;
  location_id: string;
  quantity: number;
  notes?: string;
}

// ── Equipment ──────────────────────────────────────────

export type EquipmentStatus = 'working' | 'needs_repair' | 'broken' | 'retired';

export interface Equipment extends BaseEntity {
  name: string;
  category: string;
  brand?: string;
  model?: string;
  location_id?: string;
  status: EquipmentStatus;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  purchase_location?: string;
  notes?: string;
  location_code?: string;
  location_name?: string;
  zone_code?: string;
  zone_name?: string;
}

export interface EquipmentCreateInput {
  name: string;
  category: string;
  brand?: string;
  model?: string;
  location_id?: string;
  status?: EquipmentStatus;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  purchase_location?: string;
  notes?: string;
}

// ── Supplies ───────────────────────────────────────────

export interface Supply extends BaseEntity {
  name: string;
  category: string;
  quantity: number;
  location_id?: string;
  notes?: string;
  location_code?: string;
  location_name?: string;
  zone_code?: string;
  zone_name?: string;
}

export interface SupplyCreateInput {
  name: string;
  category: string;
  quantity?: number;
  location_id?: string;
  notes?: string;
}

// ── Projects ───────────────────────────────────────────

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'abandoned';

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  last_worked_on?: string;
  notes?: string;
  updated_at: string;
}

export interface ProjectSupply {
  id: string;
  project_id: string;
  supply_id: string;
  quantity_needed?: number;
  notes?: string;
  supply_name: string;
  supply_category: string;
  supply_quantity: number;
}

export interface ProjectDetail extends Project {
  supplies: ProjectSupply[];
}

export interface ProjectCreateInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  last_worked_on?: string;
  notes?: string;
}

export interface ProjectSupplyCreateInput {
  supply_id: string;
  quantity_needed?: number;
  notes?: string;
}

// ── Query Params ───────────────────────────────────────

export interface DrillQueryParams {
  color_id?: string;
  location_id?: string;
  include_inactive?: boolean;
}

export interface EquipmentQueryParams {
  category?: string;
  status?: EquipmentStatus;
  location_id?: string;
  include_inactive?: boolean;
}

export interface SupplyQueryParams {
  search?: string;
  category?: string;
  location_id?: string;
  include_inactive?: boolean;
}

export interface ProjectQueryParams {
  status?: ProjectStatus;
  include_inactive?: boolean;
}

export interface LocationQueryParams {
  zone_id?: string;
  include_inactive?: boolean;
}

export interface ZoneQueryParams {
  include_inactive?: boolean;
}
