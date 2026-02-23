
/*export interface StaffModel {
  id: number;
  name: string;
}

export interface ServiceVariantModel {
  id: number;
  name: string;
  duration_minutes: number;
  price?: number;
  max_capacity: number;
  mode: ServiceMode;
  includes_material: boolean;
  active: boolean;
  staff: StaffModel[];
}

export interface ServiceModel {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  variants: ServiceVariantModel[];
  created_at?: string;
  updated_at?: string;
}*/

export type ServiceMode = 'online' | 'presential' | 'hybrid'; // 

export interface ServiceVariantModel {
  id: number;
  duration_minutes: number;
  price?: number;
  mode: ServiceMode;
}

export interface ServiceModel {
  id: number;
  name: string;
  description?: string;
  color?: string;
  active: boolean;
  variants: ServiceVariantModel[];
  created_at?: string;
  updated_at?: string;

  // 👇 PROPIEDADES DERIVADAS PARA TU UI
  duration_minutes?: number;
  price?: number;
  mode?: 'online' | 'presential' | 'hybrid';
}


export interface CreateServiceDto {
  name: string;
  description?: string;
  active?: boolean;
  variants: CreateServiceVariantDto[];
}

export interface CreateServiceVariantDto {
  name: string;
  duration_minutes: number;
  price?: number;
  max_capacity: number;
  mode: ServiceMode;
  includes_material?: boolean;
  active?: boolean;
  staff_ids?: number[];
}