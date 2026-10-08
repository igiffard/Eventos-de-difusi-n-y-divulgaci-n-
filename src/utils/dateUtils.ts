export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MONTH_NAMES_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const DAY_NAMES_ES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const DAY_NAMES_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Returns formatted date string: YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format date for friendly human reading in Spanish (e.g. "Jueves 24 de Septiembre, 2026")
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAY_NAMES_ES[date.getDay()];
  const monthName = MONTH_NAMES_ES[date.getMonth()];
  return `${dayName} ${d} de ${monthName}, ${y}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTH_NAMES_SHORT_ES[m - 1]} ${y}`;
}

/**
 * Format 24h time "09:00" to "9:00 AM"
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Calculate hours between startTime and endTime (e.g. "09:00" and "13:00" -> 4 hours)
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 1;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  return Math.max(0.5, Math.round((totalMinutes / 60) * 10) / 10);
}

/**
 * Generate 7x6 or 7x5 calendar grid cells for a month
 */
export interface MonthDayCell {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getMonthDays(year: number, month: number): MonthDayCell[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // 0 = Sunday, 1 = Monday ... We can start on Monday or Sunday (standard Sunday=0 or Monday=1)
  // Let's use Monday as start of week (common in Mexico / Latin America):
  // Monday: 0, Sunday: 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const todayKey = formatDateKey(new Date());
  const cells: MonthDayCell[] = [];

  // Previous month filler days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const key = formatDateKey(prevDate);
    cells.push({
      date: prevDate,
      dateKey: key,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: key === todayKey
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    const key = formatDateKey(currDate);
    cells.push({
      date: currDate,
      dateKey: key,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: key === todayKey
    });
  }

  // Next month filler days to complete grid (42 cells = 6 rows)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    const key = formatDateKey(nextDate);
    cells.push({
      date: nextDate,
      dateKey: key,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: key === todayKey
    });
  }

  return cells;
}

/**
 * Get 7 days of the week containing referenceDate (starting on Monday)
 */
export function getWeekDays(referenceDate: Date): Date[] {
  const date = new Date(referenceDate);
  const day = date.getDay();
  // distance to Monday:
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}
