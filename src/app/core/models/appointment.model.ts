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

  staff_member_id: number;

  service_variant_id: number;

  date: string;

  time: string;

  notes?: string;

}

