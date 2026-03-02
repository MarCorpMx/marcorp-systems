import { AppointmentStatus } from "../../shared/config/appointment-status.config";

/*export type AppointmentStatus =
  | 'confirmada'
  | 'pendiente'
  | 'cancelada'
  | 'no_asistio';*/

export interface Reminder {
  whatsapp: boolean;
  email: boolean;
  sent: boolean;
}

export interface Appointment {
  id: number;
  date: string; // 👈 importante si luego filtras por día
  time: string;
  client: string;
  service: string;
  status: AppointmentStatus;
  reminders?: Reminder;
}

export interface CreateAppointmentDto {
  date: string;
  time: string;
  client_id: number;
  service_id: number;
  status?: AppointmentStatus;
  reminder_whatsapp?: boolean;
  reminder_email?: boolean;
}


/*export interface Appointment {
  id: number;
  time: string;
  client: string;
  service: string;
  status: AppointmentStatus;
  reminders?: Reminder;
}*/