import { AppointmentStatus } from "../../shared/config/appointment-status.config";

export interface ClientApi {
    id: number;
    first_name: string | null;
    last_name: string | null;
    preferred_name: string | null;
    email: string | null;
    phone: string | null;

    birth_date: string | null;

    gender: string | null;

    preferred_language: string | null;
    timezone: string | null;

    source: string | null;
    tags: string[] | null;
    notes: string | null;

    is_active: boolean;
    is_blocked: boolean;
    blocked_reason: string | null;

    last_appointment: string | null;
    appointments_count: number;
    notes_count: number;
    status: 'activo' | 'inactivo' | 'riesgo';

    pets?: PetApi[];
    pets_count?: number;
}

export interface PetApi {
    id?: number;

    name: string;
    species?: string | null;
    breed?: string | null;

    gender?: string | null;

    weight?: number | null;
    weight_unit?: string | null;

    color?: string | null;

    birth_date?: string | null;

    allergies?: string | null;
    medical_notes?: string | null;
}

export interface Client {
    id: number;
    name: string;
    lastAppointment: string | null;
    notesCount: number;
    status: 'activo' | 'inactivo' | 'riesgo';
}

export interface ClientDetailApi {
    id: number;
    name: string;
    status: 'activo' | 'riesgo' | 'inactivo';
    phone: any;
    email: string | null;

    history: {
        date: string;
        service: string;
        //status: 'confirmada' | 'cancelada' | 'no_asistio';
        status: AppointmentStatus
    }[];

    notes: {
        date: string;
        title: string;
        content: string;
    }[];
}

export interface ClientPayload {

    first_name: string;
    last_name?: string | null;
    preferred_name?: string | null;

    email?: string | null;
    phone?: any;

    birth_date?: string | null;
    gender?: string | null;

    preferred_language?: string | null;
    timezone?: string | null;

    source?: string | null;
    tags?: string[];
    notes?: string | null;

    is_active: boolean;

    pet?: {
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

}