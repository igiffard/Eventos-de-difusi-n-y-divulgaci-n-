import { useState, useMemo } from 'react';
import { CalendarEvent, ActiveTab } from '../types';
import { calculateEventStats } from '../utils/storage';
import { formatReadableDate, formatShortDate, calculateDurationHours, MONTH_NAMES_ES } from '../utils/dateUtils';
import { FormattedTextWithLinks } from '../utils/textUtils';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  CheckCircle2,
  ArrowRight,
  Plus,
  Bell,
  BarChart3,
  BookOpen,
  History,
  Check,
  CalendarDays,
  FileText
} from 'lucide-react';

interface DashboardProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onNewEventClick: () => void;
  onQuickToggleAttendance: (eventId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onJumpToDate: (dateStr: string) => void;
}

type UpcomingFilter = 'all' | 'october' | 'november' | 'scientific_academic';

const SHORT_MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export function Dashboard({
  events,
  onSelectEvent,
  onNewEventClick,
  onQuickToggleAttendance,
  onNavigateTab,
  onJumpToDate
}: DashboardProps) {
  const [upcomingFilter, setUpcomingFilter] = useState<UpcomingFilter>('all');

  // Overall attendance & institutional metrics for 2026
  const stats = useMemo(() => calculateEventStats(events, 2026), [events]);

  // Total projected attendees across all active events
  const totalProjectedParticipants = useMemo(() => {
    return events
      .filter(e => e.status !== 'cancelado')
      .reduce((sum, e) => sum + (e.attendance.actualAttendees ?? e.attendance.projectedAttendees ?? 1), 0);
  }, [events]);

  const activeRemindersCount = useMemo(() => {
    return events.filter(e => e.reminder.enabled && !e.reminder.notified && e.status !== 'cancelado').length;
  }, [events]);

  // Upcoming events: sorted chronologically (prioritizing non-cancelled events from October/November 2026 onwards or pending/confirmed)
  const upcomingEvents = useMemo(() => {
    return events
      .filter(evt => {
        if (evt.status === 'cancelado') return false;
        if (upcomingFilter === 'october') return evt.date.startsWith('2026-10');
        if (upcomingFilter === 'november') return evt.date.startsWith('2026-11');
        if (upcomingFilter === 'scientific_academic') {
          return evt.category === 'Científico' || evt.category === 'Académico';
        }
        // Default 'all': show confirmed/pending events sorted chronologically
        return evt.status === 'confirmado' || evt.status === 'pendiente';
      })
      .sort((a, b) => {
        const cmpDate = a.date.localeCompare(b.date);
        if (cmpDate !== 0) return cmpDate;
        return (a.startTime || '09:00').localeCompare(b.startTime || '09:00');
      });
  }, [events, upcomingFilter]);

  // Recent Activity Logs: sorted by updatedAt / createdAt descending
  const recentActivityLogs = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const timeA = a.updatedAt || a.createdAt || a.date;
        const timeB = b.updatedAt || b.createdAt || b.date;
        return timeB.localeCompare(timeA);
      })
      .slice(0, 6);
  }, [events]);

  // Category breakdown sorted by count
  const categoryBreakdown = useMemo(() => {
    const entries = Object.entries(stats.byCategory) as [string, { count: number; attended: number }][];
    return entries
      .map(([category, data]) => ({
        category,
        count: data.count,
        attended: data.attended,
        percentage: stats.totalEvents > 0 ? Math.round((data.count / stats.totalEvents) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  const getActivityActionLabel = (evt: CalendarEvent) => {
    if (evt.status === 'asistido') return 'Asistencia verificada y registrada';
    if (evt.createdAt !== evt.updatedAt) return 'Información de evento actualizada';
    if (evt.additionalNotes) return 'Registrado con notas de logística y contexto';
    return 'Actividad incorporada al calendario';
  };

  return (
    <div className="space-y-6">
      {/* Institutional Welcome & Overview Header */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <span>Panel de Control Institucional</span>
              <span aria-hidden="true">·</span>
              <span>Ciclo de Actividades 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">
              Resumen de Agenda, Actividad Reciente y Métricas
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Vista general de próximas convocatorias científicas y académicas, bitácora de movimientos recientes e indicadores de participación delegada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNewEventClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Actividad</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Abrir Calendario</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('history')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Bitácora Completa</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Attendance & Schedule Metrics (4 KPI Row) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Events & Confirmed */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Actividades en Agenda</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-display tabular-nums">
              {stats.totalEvents}
            </span>
            <span className="text-xs text-slate-500">registradas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
            <span className="font-semibold text-emerald-700">{stats.confirmedEvents} confirmadas</span>
            <span aria-hidden="true">·</span>
            <span>{stats.attendedEvents} realizadas</span>
          </div>
        </div>

        {/* Metric 2: Attendance Rate & Verified */}
        <div
          onClick={() => onNavigateTab('stats')}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Cumplimiento de Asistencia</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-display tabular-nums">
              {stats.attendanceRate}%
            </span>
            <span className="text-xs text-slate-500">tasa efectiva</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
            <span>{stats.attendedEvents} eventos asistidos</span>
            <span aria-hidden="true">·</span>
            <span>{stats.pendingEvents} pendientes</span>
          </div>
        </div>

        {/* Metric 3: Total Participants / Delegation */}
        <div
          onClick={() => onNavigateTab('history')}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Participación Institucional</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-display tabular-nums">
              {totalProjectedParticipants}
            </span>
            <span className="text-xs text-slate-500">participantes totales</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
            <span className="font-semibold text-slate-800">{stats.totalAttendeesRecorded} verificados</span>
            <span aria-hidden="true">·</span>
            <span>Comitivas y docentes</span>
          </div>
        </div>

        {/* Metric 4: Delegation Hours & Active Reminders */}
        <div
          onClick={() => onNavigateTab('reminders')}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Horas-Persona & Alertas</span>
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-display tabular-nums">
              {stats.totalDelegationHours}
            </span>
            <span className="text-xs text-slate-500">hrs acumuladas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
            <span className="font-semibold text-amber-700">{activeRemindersCount} recordatorios activos</span>
            <span aria-hidden="true">·</span>
            <span>Alertas automáticas</span>
          </div>
        </div>
      </section>

      {/* Main Two-Column Overview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7/12): Summary of Upcoming Events */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Próximos Eventos y Convocatorias
              </h3>
              <p className="text-xs text-slate-500">
                Actividades programadas con acceso rápido a detalles, notas adicionales y logística
              </p>
            </div>

            {/* Interactive Filter Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setUpcomingFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  upcomingFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Próximos ({events.filter(e => e.status === 'confirmado' || e.status === 'pendiente').length})
              </button>
              <button
                type="button"
                onClick={() => setUpcomingFilter('october')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  upcomingFilter === 'october'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Octubre
              </button>
              <button
                type="button"
                onClick={() => setUpcomingFilter('november')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  upcomingFilter === 'november'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Noviembre
              </button>
              <button
                type="button"
                onClick={() => setUpcomingFilter('scientific_academic')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  upcomingFilter === 'scientific_academic'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Científico / Académico
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingEvents.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-sm font-medium text-slate-600">
                  No hay eventos pendientes bajo este filtro.
                </p>
                <button
                  type="button"
                  onClick={() => setUpcomingFilter('all')}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Mostrar todos los eventos próximos
                </button>
              </div>
            ) : (
              upcomingEvents.map(evt => {
                const [, mStr, dStr] = evt.date.split('-');
                const monthIdx = parseInt(mStr, 10) - 1;
                const shortMonth = SHORT_MONTHS[monthIdx] || 'MES';
                const durationHrs = calculateDurationHours(evt.startTime, evt.endTime);

                return (
                  <div
                    key={evt.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Date Calendar Leaf */}
                      <button
                        type="button"
                        onClick={() => onJumpToDate(evt.date)}
                        title="Ver este día en el Calendario"
                        className="w-14 shrink-0 rounded-lg border border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors py-2 text-center cursor-pointer"
                      >
                        <span className="block text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                          {shortMonth}
                        </span>
                        <span className="block text-xl font-bold text-slate-900 font-display tabular-nums leading-tight">
                          {dStr}
                        </span>
                      </button>

                      {/* Event Core Information */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Clean unboxed metadata row */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                          <span className="font-semibold text-emerald-800">{evt.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-medium text-slate-700">
                            {evt.startTime} – {evt.endTime} h ({durationHrs} hrs)
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {evt.status === 'asistido'
                              ? 'Asistido'
                              : evt.status === 'confirmado'
                              ? 'Confirmado'
                              : 'Pendiente'}
                          </span>
                        </div>

                        <h4
                          onClick={() => onSelectEvent(evt)}
                          className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer font-display leading-snug"
                        >
                          {evt.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                          {evt.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{evt.location}</span>
                            </span>
                          )}
                          {evt.organizer && (
                            <span className="inline-flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{evt.organizer}</span>
                            </span>
                          )}
                        </div>

                        {evt.description && (
                          <div className="text-xs text-slate-600 line-clamp-2 pt-0.5 leading-relaxed">
                            <FormattedTextWithLinks text={evt.description} />
                          </div>
                        )}

                        {evt.additionalNotes && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-700 flex items-start gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="line-clamp-2">
                              <span className="font-semibold text-slate-800">Notas adicionales: </span>
                              <span>{evt.additionalNotes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => onSelectEvent(evt)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Detalles / Compartir
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickToggleAttendance(evt.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          evt.status === 'asistido'
                            ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{evt.status === 'asistido' ? 'Asistido' : 'Marcar asistido'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Haz clic en cualquier actividad para editar notas adicionales o compartir por WhatsApp
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <span>Ver calendario completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Right Column (5/12): Recent Activity Logs & Category Attendance Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity Logs */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Bitácora de Actividad Reciente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Últimos registros, actualizaciones y verificaciones de asistencia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('history')}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Ver historial
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivityLogs.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-medium text-emerald-700">
                      {getActivityActionLabel(evt)}
                    </span>
                    <span className="tabular-nums shrink-0">
                      {formatShortDate(evt.date)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {evt.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                    <span>{evt.organizer || 'Institucional'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {evt.attendance.actualAttendees !== undefined
                        ? `${evt.attendance.actualAttendees} asistentes confirmados`
                        : `${evt.attendance.projectedAttendees} proyectados`}
                    </span>
                  </div>

                  {(evt.attendance.notes || evt.additionalNotes) && (
                    <p className="text-xs text-slate-600 line-clamp-1 pt-0.5">
                      {evt.additionalNotes || evt.attendance.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Key Attendance & Category Breakdown */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Distribución por Categoría
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proporción de eventos registrados y asistidos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('stats')}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Métricas detalladas
              </button>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map(item => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <span className="text-slate-500 tabular-nums">
                      {item.count} {item.count === 1 ? 'evento' : 'eventos'} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${Math.max(item.percentage, 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Month Jump */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Navegación rápida por mes:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onJumpToDate('2026-09-24')}
                  className="font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer"
                >
                   {MONTH_NAMES_ES[8]}
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onJumpToDate('2026-10-19')}
                  className="font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer"
                >
                  {MONTH_NAMES_ES[9]}
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onJumpToDate('2026-11-14')}
                  className="font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer"
                >
                  {MONTH_NAMES_ES[10]}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
