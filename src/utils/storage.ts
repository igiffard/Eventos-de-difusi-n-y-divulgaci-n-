import { CalendarEvent, GitHubSyncConfig } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';
import { calculateDurationHours } from './dateUtils';

const STORAGE_KEY_EVENTS = 'calendario_eventos_historico_v1';
const STORAGE_KEY_GITHUB = 'calendario_github_sync_config_v1';

const MOCK_FICTITIOUS_IDS = new Set([
  'evt-mesa-gestion-hidrica-2026',
  'evt-feria-innovacion-2026',
  'evt-congreso-sustentabilidad-2026',
  'evt-foro-energia-2026-past',
  'evt-simposio-comunitario-2026-past',
  'evt-jornada-reforestacion-2025-past'
]);

export function loadEventsFromStorage(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clean out any fictitious events that were saved previously
      let cleaned = parsed.filter(e => !MOCK_FICTITIOUS_IDS.has(e.id));
      
      // Merge or update the Expo Ensenada event if it has old description without links
      const ensenadaInit = INITIAL_EVENTS.find(e => e.id === 'evt-expo-uabc-ensenada-2026');
      if (ensenadaInit) {
        cleaned = cleaned.map(e => {
          if (e.id === 'evt-expo-uabc-ensenada-2026' && (!e.description.includes('forms.gle') || e.title === 'Expo UABC Campus Ensenada')) {
            return {
              ...e,
              title: ensenadaInit.title,
              description: ensenadaInit.description,
              attendance: {
                ...e.attendance,
                notes: ensenadaInit.attendance.notes
              }
            };
          }
          return e;
        });
      }

      // Merge in any of the INITIAL_EVENTS if missing (e.g. deadline event)
      const existingIds = new Set(cleaned.map(e => e.id));
      INITIAL_EVENTS.forEach(initEvt => {
        if (!existingIds.has(initEvt.id)) {
          cleaned.push(initEvt);
        }
      });

      // Update storage so fictitious items are permanently removed
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(cleaned));
      return cleaned;
    }
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  } catch (err) {
    console.error('Error loading events from storage', err);
    return INITIAL_EVENTS;
  }
}

export function saveEventsToStorage(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving events to storage', err);
  }
}

export function loadGitHubConfig(): GitHubSyncConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GITHUB);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading github config', err);
  }
  return {
    owner: '',
    repo: '',
    branch: 'main',
    filePath: 'data/events.json',
    personalAccessToken: ''
  };
}

export function saveGitHubConfig(config: GitHubSyncConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving github config', err);
  }
}

/**
 * Generate .ics (iCalendar) file string for export to Google Calendar / Outlook
 */
export function generateICalendarData(events: CalendarEvent[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendario de Eventos Institucionales//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Calendario de Eventos y Registro Histórico',
    'X-WR-TIMEZONE:America/Tijuana'
  ];

  events.forEach(evt => {
    const cleanDate = evt.date.replace(/-/g, '');
    const startParts = (evt.startTime || '09:00').replace(':', '') + '00';
    const endParts = (evt.endTime || '10:00').replace(':', '') + '00';
    const dtStart = `${cleanDate}T${startParts}`;
    const dtEnd = `${cleanDate}T${endParts}`;

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${evt.id}@calendario-institucional`);
    ics.push(`DTSTAMP:${cleanDate}T000000Z`);
    ics.push(`DTSTART:${dtStart}`);
    ics.push(`DTEND:${dtEnd}`);
    ics.push(`SUMMARY:${evt.title.replace(/,/g, '\\,')}`);
    ics.push(`LOCATION:${(evt.location || '').replace(/,/g, '\\,')}`);
    const descParts = [
      evt.description,
      evt.additionalNotes ? `Notas adicionales: ${evt.additionalNotes}` : '',
      `Organiza: ${evt.organizer}`
    ].filter(Boolean).join('\\n');
    ics.push(`DESCRIPTION:${descParts.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`);
    ics.push(`STATUS:${evt.status === 'cancelado' ? 'CANCELLED' : 'CONFIRMED'}`);
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Download arbitrary content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculate full analytics & statistics
 */
export interface EventStatsSummary {
  totalEvents: number;
  attendedEvents: number;
  pendingEvents: number;
  confirmedEvents: number;
  cancelledEvents: number;
  attendanceRate: number;
  totalDelegationHours: number;
  totalAttendeesRecorded: number;
  byCategory: Record<string, { count: number; attended: number }>;
  byYear: Record<string, number>;
  byMonthCurrentYear: Record<string, number>;
  topOrganizers: { name: string; count: number }[];
}

export function calculateEventStats(events: CalendarEvent[], currentYear: number): EventStatsSummary {
  let attended = 0;
  let pending = 0;
  let confirmed = 0;
  let cancelled = 0;
  let totalHours = 0;
  let totalAttendees = 0;

  const byCategory: Record<string, { count: number; attended: number }> = {};
  const byYear: Record<string, number> = {};
  const byMonthCurrentYear: Record<string, number> = {
    'Ene': 0, 'Feb': 0, 'Mar': 0, 'Abr': 0, 'May': 0, 'Jun': 0,
    'Jul': 0, 'Ago': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dic': 0
  };
  const organizerCount: Record<string, number> = {};

  const monthKeys = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  events.forEach(evt => {
    // Status counts
    if (evt.status === 'asistido') {
      attended++;
      const duration = calculateDurationHours(evt.startTime, evt.endTime);
      const headcount = evt.attendance.actualAttendees || evt.attendance.projectedAttendees || 1;
      totalHours += duration * headcount;
      totalAttendees += headcount;
    } else if (evt.status === 'confirmado') {
      confirmed++;
    } else if (evt.status === 'pendiente') {
      pending++;
    } else if (evt.status === 'cancelado') {
      cancelled++;
    }

    // Category
    if (!byCategory[evt.category]) {
      byCategory[evt.category] = { count: 0, attended: 0 };
    }
    byCategory[evt.category].count++;
    if (evt.status === 'asistido') {
      byCategory[evt.category].attended++;
    }

    // Year breakdown
    const yearStr = evt.date.substring(0, 4);
    byYear[yearStr] = (byYear[yearStr] || 0) + 1;

    // Month breakdown for specified year
    if (parseInt(yearStr, 10) === currentYear) {
      const monthIdx = parseInt(evt.date.substring(5, 7), 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        byMonthCurrentYear[monthKeys[monthIdx]]++;
      }
    }

    // Organizers
    if (evt.organizer) {
      const trimmed = evt.organizer.trim();
      organizerCount[trimmed] = (organizerCount[trimmed] || 0) + 1;
    }
  });

  const completedOrAttended = attended;
  const eligibleForAttendance = events.filter(e => e.status === 'asistido' || e.status === 'no_asistido').length;
  const attendanceRate = eligibleForAttendance > 0 
    ? Math.round((completedOrAttended / eligibleForAttendance) * 100) 
    : (events.length > 0 ? Math.round((attended / events.length) * 100) : 0);

  const topOrganizers = Object.entries(organizerCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalEvents: events.length,
    attendedEvents: attended,
    pendingEvents: pending,
    confirmedEvents: confirmed,
    cancelledEvents: cancelled,
    attendanceRate,
    totalDelegationHours: Math.round(totalHours),
    totalAttendeesRecorded: totalAttendees,
    byCategory,
    byYear,
    byMonthCurrentYear,
    topOrganizers
  };
}
