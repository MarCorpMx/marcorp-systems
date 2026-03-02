import { AppointmentStatus } from "../../shared/config/appointment-status.config";

export interface ClientApi {
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    birth_date: string | null;
    last_appointment: string | null;
    notes_count: number;
    status: 'activo' | 'inactivo' | 'riesgo';
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