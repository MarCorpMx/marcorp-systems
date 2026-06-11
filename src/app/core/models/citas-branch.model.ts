export interface BranchModel {

  id: number;

  // identidad
  name: string;
  tagline: string;
  description: string;
  slug: string;
  reference_prefix: string | null;

  // estado
  is_primary: boolean;
  is_active: boolean;
  locked_by_plan: boolean;

  is_blocked: boolean;
  blocked_reason: string | null;
  blocked_at: string | null;

  // contacto
  phone: any | null;
  whatsapp_phone: any | null;

  email: string | null;
  website: string | null;

  social_links: Record<string, string> | null;

  // visibilidad
  show_phone: boolean;
  show_email: boolean;
  show_website: boolean;
  show_whatsapp: boolean;
  show_social_links: boolean;
  show_address: boolean;

  // ubicación
  country: string | null;
  state: string | null;
  city: string | null;
  zip_code: string | null;
  address: string | null;

  latitude: number | null;
  longitude: number | null;

  // branding
  theme_key: string | null;

  primary_color: string | null;
  secondary_color: string | null;

  logo_url: string | null;

  white_label: boolean;

  // dominio
  primary_domain: string | null;

  domains: string[] | null;

  force_https: boolean;

  // configuración
  timezone: string;

  metadata: any | null;

  // auditoría
  created_at: string;
  updated_at: string;

  // Por si lo necesitamos
  manager?: string;
}

 

export interface ApiMeta {
  organization_branches_count: number;
}

export interface BranchResponse {
  data: BranchModel[];
  meta: ApiMeta;
}

// Para cuando se consulten los datos de una sucursal en especifico

/*
export interface BranchDetailsResponse {
  branch: BranchModel;
  stats: BranchStats;
}*/

// en back
/*return [
    'branch' => [...],

    'stats' => [
        'services_count' => 25,
        'staff_count' => 8,
        'appointments_today' => 17,
        'appointments_month' => 380,
        'clients_count' => 542,
    ]
];
*/