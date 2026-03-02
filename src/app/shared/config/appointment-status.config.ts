export type AppointmentStatus =
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'rescheduled'
    | 'cancelled'
    | 'no_show';

export interface AppointmentStatusConfig {
    label: string;
    class: string;
}

export const APPOINTMENT_STATUS_CONFIG: Record<
    AppointmentStatus,
    AppointmentStatusConfig
> = {
    pending: {
        label: 'Pendiente',
        class: 'bg-yellow-100 text-yellow-700'
    },
    confirmed: {
        label: 'Confirmada',
        class: 'bg-green-100 text-green-700'
    },
    completed: {
        label: 'Completada',
        class: 'bg-blue-100 text-blue-700'
    },
    rescheduled: {
        label: 'Reprogramada',
        class: 'bg-purple-100 text-purple-700'
    },
    cancelled: {
        label: 'Cancelada',
        class: 'bg-red-100 text-red-700'
    },
    no_show: {
        label: 'No asistió',
        class: 'bg-gray-200 text-gray-700'
    }
};