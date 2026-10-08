import { CalendarEvent } from '../../types';
import { formatDateKey, formatReadableDate } from '../../utils/dateUtils';
import { CATEGORY_COLORS, StatusBadge } from '../CategoryBadge';
import { Clock, MapPin, Building, Users, AlertCircle, Plus, FileText } from 'lucide-react';
import { FormattedTextWithLinks } from '../../utils/textUtils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onNewEventForDate: (dateKey: string, initialHour?: string) => void;
}

export function DayView({ currentDate, events, onSelectEvent, onNewEventForDate }: DayViewProps) {
  const dateKey = formatDateKey(currentDate);
  const dayEvents = events.filter(e => e.date === dateKey);

  // Time slots from 07:00 to 20:00
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Day summary header */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Agenda del Día
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {formatReadableDate(dateKey)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {dayEvents.length === 0 
              ? 'No hay actividades programadas para este día.' 
              : `${dayEvents.length} actividad${dayEvents.length > 1 ? 'es' : ''} en agenda institucional.`}
          </p>
        </div>

        <button
          onClick={() => onNewEventForDate(dateKey)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Evento a este Día</span>
        </button>
      </div>

      {/* Hourly Timeline */}
      <div className="p-4 sm:p-6 divide-y divide-slate-100">
        {hours.map((hour) => {
          const hourFormatted = `${String(hour).padStart(2, '0')}:00`;
          const hourEvents = dayEvents.filter(evt => {
            const startH = parseInt(evt.startTime.split(':')[0], 10);
            return startH === hour;
          });

          return (
            <div key={hour} className="py-3 sm:py-4 flex gap-4 group">
              {/* Hour Label */}
              <div className="w-16 shrink-0 text-xs font-bold text-slate-400 text-right pt-1 font-mono">
                {hourFormatted}
              </div>

              {/* Slot content */}
              <div className="flex-1 min-h-[52px]">
                {hourEvents.length > 0 ? (
                  <div className="space-y-3">
                    {hourEvents.map(evt => {
                      const cat = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Institucional'];
                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md ${cat.bg} ${cat.border}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 text-slate-800">
                                {evt.category}
                              </span>
                              <StatusBadge status={evt.status} />
                            </div>

                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white/60 px-2 py-1 rounded">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{evt.startTime} - {evt.endTime}</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-1.5 font-display">
                            {evt.title}
                          </h3>

                          {evt.description && (
                            <div className="text-sm text-slate-700 mb-3 leading-relaxed bg-white/60 p-2 rounded border border-slate-200/50">
                              <FormattedTextWithLinks text={evt.description} />
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200/60">
                            {evt.organizer && (
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-slate-500 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-500 block uppercase">Organizador</span>
                                  <span className="font-medium text-slate-900">{evt.organizer}</span>
                                </div>
                              </div>
                            )}

                            {evt.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-500 block uppercase">Sede / Ubicación</span>
                                  <span className="font-medium text-slate-900">{evt.location}</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-500 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Asistencia / Comitiva</span>
                                <span className="font-medium text-slate-900">
                                  {evt.attendance.actualAttendees !== undefined
                                    ? `${evt.attendance.actualAttendees} asistentes confirmados`
                                    : `${evt.attendance.projectedAttendees} proyectados`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {evt.reminder.enabled && (
                            <div className="mt-3 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              Recordatorio activo ({evt.reminder.timing.replace('_', ' ')})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    onClick={() => onNewEventForDate(dateKey, hourFormatted)}
                    className="h-10 border border-transparent group-hover:border-dashed group-hover:border-slate-300 rounded-lg flex items-center px-3 text-xs text-slate-400 group-hover:text-emerald-700 group-hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      + Programar actividad a las {hourFormatted}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
