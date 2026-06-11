export interface ProfileProgressLevel {
    key:
    | 'starter'
    | 'growing'
    | 'professional'
    | 'optimized';
    label: string;
    color?: string;
}

export interface ProfileProgressMissingField {
    field: string;
    label: string;

    isExternal?: boolean;
    route?: string | null;
}

export interface ProfileProgress {
    percentage: number;
    completed: number;
    total: number;

    level: ProfileProgressLevel;

    missing: ProfileProgressMissingField[];
}

export interface DashboardKpis {
    appointments_today: number;
    income_today: number;
    no_show_today: number;
}

export interface NextAppointment {
    id: number;

    start_datetime: string;
    end_datetime: string;

    status: string;

    client_name: string;

    service_name: string;

    reference_code: string;
}

export interface TodayAppointment {
    id: number;

    start_datetime: string;
    end_datetime: string;

    status: string;

    client_name: string;

    service_name: string;

    reference_code: string;
}

export interface RecentActivity {
    type:
    | 'appointment_created'
    | 'appointment_cancelled'
    | 'appointment_completed'
    | 'client_created';

    title: string;

    description?: string;

    created_at: string;
}

export interface DashboardBranch {
    id: number;
    name: string;
}

export interface DashboardData {

    branch: DashboardBranch;

    profile_completion: ProfileProgress;

    kpis: DashboardKpis;

    next_appointment: NextAppointment | null;

    today_appointments: TodayAppointment[];

    recent_activity: RecentActivity[];

}

export interface DashboardResponse {
    data: DashboardData;
}