import { AppointmentStatus } from "../../shared/config/appointment-status.config";

export interface PhoneApi {
    number: string;
    internationalNumber: string;
    nationalNumber: string;
    e164Number: string;
    countryCode: string;
    dialCode: string;
}

/*
|--------------------------------------------------------------------------
| Base reutilizable
|--------------------------------------------------------------------------
*/

export interface ClientBaseApi {
    id: number;

    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    preferred_name: string | null;

    email: string | null;
    phone: PhoneApi | null;

    birth_date: string | null;
    gender: string | null;

    preferred_language: string | null;
    timezone: string | null;

    source: string | null;
    tags: string[];

    notes: string | null;

    is_active: boolean;
    is_blocked: boolean;
    blocked_reason: string | null;

    status: 'activo' | 'inactivo' | 'riesgo';
}

/*
|--------------------------------------------------------------------------
| Listado (cards)
|--------------------------------------------------------------------------
*/

export interface ClientApi extends ClientBaseApi {

    appointments_count: number;
    notes_count: number;
    pets_count: number;

    last_appointment: string | null;
}

/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

export interface ClientDetailApi extends ClientBaseApi {

    /*
    |--------------------------------------------------------------------------
    | Métricas
    |--------------------------------------------------------------------------
    */

    appointments_count: number;
    notes_count: number;
    pets_count: number;

    last_appointment: string | null;

    /*
    |--------------------------------------------------------------------------
    | Relacionados
    |--------------------------------------------------------------------------
    */

    pets: PetApi[];

    history: ClientHistoryItem[];

    notes_history: ClientNoteItem[];
}

/*
|--------------------------------------------------------------------------
| Historial
|--------------------------------------------------------------------------
*/

export interface ClientHistoryItem {

    date: string;

    service: string;

    status: AppointmentStatus;
}

/*
|--------------------------------------------------------------------------
| Notas
|--------------------------------------------------------------------------
*/

export interface ClientNoteItem {

    date: string;

    title: string;

    content: string;
}

/*
|--------------------------------------------------------------------------
| Mascotas
|--------------------------------------------------------------------------
*/

export interface PetApi {

    id: number;

    name: string;

    species: string | null;
    breed: string | null;

    gender: string | null;

    weight: number | null;
    weight_unit: string | null;

    color: string | null;

    birth_date: string | null;

    allergies: string | null;
    medical_notes: string | null;
}

/*
|--------------------------------------------------------------------------
| Payloads (NO TOCAR)
|--------------------------------------------------------------------------
*/

export interface ClientPayload {

    /*
    |--------------------------------------------------------------------------
    | Básico
    |--------------------------------------------------------------------------
    */

    first_name: string;
    last_name?: string | null;
    preferred_name?: string | null;

    email?: string | null;
    phone?: PhoneApi | null;

    /*
    |--------------------------------------------------------------------------
    | Personal
    |--------------------------------------------------------------------------
    */

    birth_date?: string | null;
    gender?: string | null;

    preferred_language?: string | null;
    timezone?: string | null;

    /*
    |--------------------------------------------------------------------------
    | CRM
    |--------------------------------------------------------------------------
    */

    source?: string | null;
    tags?: string[];

    notes?: string | null;

    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    is_active: boolean;

    /*
    |--------------------------------------------------------------------------
    | Mascotas
    |--------------------------------------------------------------------------
    */

    pets?: PetPayload[];
}

export interface PetPayload {

    name: string;

    species?: string | null;
    breed?: string | null;

    gender?: string | null;

    weight?: number | null;
    weight_unit?: string;

    color?: string | null;

    birth_date?: string | null;

    allergies?: string | null;
    medical_notes?: string | null;
}

// Selectores
export interface ClientSelectItem {
    id: number;

    full_name: string | null;
    preferred_name: string | null;

    display_name: string;

    email: string | null;
    phone: PhoneApi | null;

    pets_count: number;

    is_active: boolean;
    is_blocked: boolean;

    // opcional para pet_grooming
    pets?: PetSelectItem[];
}

export interface PetSelectItem {
    id:number;
    name:string;
    species:string|null;
    breed:string|null;
}