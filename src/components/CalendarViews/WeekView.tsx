import { CalendarEvent } from '../../types';
import { getWeekDays, formatDateKey, DAY_NAMES_ES, formatReadableDate } from '../../utils/dateUtils';
import { CATEGORY_COLORS } from '../CategoryBadge';
import { Clock, MapPin, Building, CheckCircle2 } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (dateKey: string) => void;
}

export function WeekView({ currentDate, events, onSelectEvent, onSelectDate }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate);

  // Group events by dateKey
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach(evt => {
    if (!eventsByDate[evt.date]) {
      eventsByDate[evt.date] = [];
    }
    eventsByDate[evt.date].push(evt);
  });

  const todayKey = formatDateKey(new Date());

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 7 Columns for the week */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {weekDays.map((day, idx) => {
          const dateKey = formatDateKey(day);
          const dayEvents = eventsByDate[dateKey] || [];
          const isToday = dateKey === todayKey;
          const dayName = DAY_NAMES_ES[day.getDay()];

          return (
            <div key={idx} className="min-h-[550px] flex flex-col bg-slate-50/30">
              {/* Header */}
              <div 
                onClick={() => onSelectDate(dateKey)}
                className={`p-3 text-center border-b border-slate-200 cursor-pointer transition-colors ${
                  isToday ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  {dayName}
                </div>
                <div className={`text-xl font-bold mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                  isToday ? 'bg-emerald-600 text-white' : 'text-slate-800'
                }`}>
                  {day.getDate()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {dayEvents.length === 0 ? 'Sin eventos' : `${dayEvents.length} actividad${dayEvents.length > 1 ? 'es' : ''}`}
                </div>
              </div>

              {/* Day Events Column */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {dayEvents.length === 0 ? (
                  <div 
                    onClick={() => onSelectDate(dateKey)}
                    className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>+ Añadir actividad</span>
                  </div>
                ) : (
                  dayEvents.map(evt => {
                    const cat = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Institucional'];
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:shadow-sm hover:scale-[1.01] ${cat.bg} ${cat.border}`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70 text-slate-700">
                            {evt.category}
                          </span>
                          {evt.status === 'asistido' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Asistido
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                          {evt.title}
                        </h4>

                        <div className="mt-2 space-y-1 text-xs text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{evt.startTime} - {evt.endTime}</span>
                          </div>

                          {evt.location && (
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{evt.location}</span>
                            </div>
                          )}

                          {evt.organizer && (
                            <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-600">
                              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{evt.organizer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
