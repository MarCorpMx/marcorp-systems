export interface WorkingDay {
  start: string;
  end: string;
}

export interface ScheduleSettings {
  default_appointment_duration: number;
  break_between_appointments: number;
  working_hours: {
    [day: string]: WorkingDay;
  };
  holidays: string[];
  rules: string;
}