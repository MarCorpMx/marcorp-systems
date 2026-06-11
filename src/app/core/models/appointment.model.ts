import { AppointmentStatus } from "../../shared/config/appointment-status.config";

export interface Reminder {
  whatsapp: boolean;
  email: boolean;
  sent: boolean;
}

export interface AppointmentNote {
  id: number;
  type: string;
  note: string;
  created_at: string;

  user?: {
    id: number | null;
    name: string | null;
  };

  expanded: boolean;
}

export interface AppointmentModel {
  id: number;

  start: string;
  end: string;

  date: string;
  time: string;

  client: {
    id: number | null;
    name: string | null;
  };

  service: {
    id: number | null; // id del service_variant

    main: {
      id: number | null;
      name: string | null;
      color: string | null;
    } | null;

    variant: {
      name: string | null;
      duration: number | null;
      price: number | null;
    } | null;
  };

  staff: {
    id: number | null;
    name: string | null;
  };

  status: AppointmentStatus;

  mode: string,

  appointmentNotes?: AppointmentNote[],

  reminders?: Reminder;
}

export interface CreateAppointmentDto {

  client_id: number;
  pet_id?: number | null;
  staff_member_id: number;
  branch_service_variant_id: number;
  notes?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Modalidad
  |--------------------------------------------------------------------------
  */

  mode: 'online' | 'presential' | 'hybrid';

  /*
  |--------------------------------------------------------------------------
  | Meeting
  |--------------------------------------------------------------------------
  */
  meeting_url?: string | null;
  meeting_provider?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Datetime local
  |--------------------------------------------------------------------------
  */

  start_datetime_local: string;
  timezone: string;

  /*
  |--------------------------------------------------------------------------
  | Recurrencia
  |--------------------------------------------------------------------------
  */

  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    end_type: 'never' | 'occurrences' | 'date';
    occurrences?: number | null;
    end_date?: string | null;
  } | null;

}

