export interface Organization {
  id: number;
  name: string;
  slug: string;
  reference_prefix: string;
  email: string | null;
  phone: any | null; // luego lo tipamos mejor si quieres
  website: string | null;

  country: string | null;
  state: string | null;
  city: string | null;
  zip_code: string | null;
  address: string | null;

  primary_color: string | null;
  secondary_color: string | null;

  // Facturación super electrónica
  legal_name: string | null;
  tax_id: string | null;
  tax_regime: string | null;
  invoice_zip_code: string | null;
  cfdi_email: string | null;
}