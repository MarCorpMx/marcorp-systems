export interface Organization {
  id: number;
  name: string;
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
}