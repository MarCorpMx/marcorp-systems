export interface RecurringBlock {
  id?: number;
  day_of_week: number; // 0-6
  start: string;
  end: string;
  label?: string; // "Comida", "Break", etc
}