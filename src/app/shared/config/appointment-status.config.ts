import {
    CheckCircle,
    Clock,
    XCircle,
    UserX,
    RotateCcw,
    Check
} from 'lucide-angular';


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
    icon: any;
}

export const APPOINTMENT_STATUS_CONFIG: Record<
    AppointmentStatus,
    AppointmentStatusConfig
> = {
    pending: {
        label: 'Pendiente',
        class: 'bg-yellow-500/10 text-yellow-400',
        icon: Clock
    },
    confirmed: {
        label: 'Confirmada',
        class: 'bg-green-500/10 text-green-400',
        icon: CheckCircle
    },
    completed: {
        label: 'Completada',
        class: 'bg-blue-500/10 text-blue-400',
        icon: Check
    },
    rescheduled: {
        label: 'Reprogramada',
        class: 'bg-purple-500/10 text-purple-400',
        icon: RotateCcw
    },
    cancelled: {
        label: 'Cancelada',
        class: 'bg-red-500/10 text-red-400',
        icon: XCircle
    },
    no_show: {
        label: 'No asistió',
        class: 'bg-gray-500/10 text-gray-400',
        icon: UserX
    }
};
