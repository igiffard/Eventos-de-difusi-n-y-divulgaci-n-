export type CalendarViewMode = 'day' | 'week' | 'month' | 'year';

export type EventCategory = 
  | 'Ambiental'
  | 'Académico'
  | 'Institucional'
  | 'Comunitario'
  | 'Científico'
  | 'Cultural'
  | 'Gubernamental';

export type EventStatus = 
  | 'confirmado'
  | 'pendiente'
  | 'asistido'
  | 'no_asistido'
  | 'cancelado';

export type ReminderTiming = 
  | '1_hour'
  | '2_hours'
  | '1_day'
  | '2_days'
  | '1_week';

export interface EventAttendance {
  projectedAttendees: number;
  actualAttendees?: number;
  delegationNames?: string[];
  notes?: string;
  satisfactionRating?: number; // 1 to 5
}

export interface EventReminder {
  enabled: boolean;
  timing: ReminderTiming;
  customMinutes?: number;
  notified?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  organizer: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  description: string;
  additionalNotes?: string;
  category: EventCategory;
  status: EventStatus;
  attendance: EventAttendance;
  reminder: EventReminder;
  badgeColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  personalAccessToken: string;
  lastSyncedAt?: string;
}

export type ActiveTab = 'dashboard' | 'calendar' | 'history' | 'stats' | 'reminders' | 'print_preview';
