import { CalendarEvent } from '../../types';
import { getMonthDays, DAY_NAMES_SHORT_ES, formatTime12h } from '../../utils/dateUtils';
import { CATEGORY_COLORS, StatusBadge } from '../CategoryBadge';
import { Clock, MapPin, Users } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (dateKey: string) => void;
}

export function MonthView({ currentDate, events, onSelectEvent, onSelectDate }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);

  // Group events by dateKey
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach(evt => {
    if (!eventsByDate[evt.date]) {
      eventsByDate[evt.date] = [];
    }
    eventsByDate[evt.date].push(evt);
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Day headers: Lun, Mar, Mié, Jue, Vie, Sáb, Dom */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2.5">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, idx) => (
          <div key={idx} className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[640px]">
        {days.map((cell, index) => {
          const dayEvents = eventsByDate[cell.dateKey] || [];
          const isSelectedMonth = cell.isCurrentMonth;

          return (
            <div
              key={index}
              onClick={() => onSelectDate(cell.dateKey)}
              className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between group cursor-pointer hover:bg-slate-50/80 ${
                isSelectedMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-400'
              } ${cell.isToday ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/20' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    cell.isToday
                      ? 'bg-emerald-600 text-white font-bold'
                      : isSelectedMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {dayEvents.length} {dayEvents.length === 1 ? 'actividad' : 'actividades'}
                  </span>
                )}
              </div>

              {/* Event Cards inside Day Cell */}
              <div className="space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                {dayEvents.map(evt => {
                  const catStyle = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Institucional'];
                  return (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className={`text-left p-1.5 rounded-md text-xs border transition-transform hover:scale-[1.02] shadow-2xs cursor-pointer ${catStyle.bg} ${catStyle.border}`}
                    >
                      <div className="font-bold truncate text-slate-900 leading-tight">
                        {evt.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-0.5 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                          {evt.startTime}
                        </span>
                        {evt.status === 'asistido' && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                            Asistido
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty state hint on hover */}
              {dayEvents.length === 0 && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-slate-400 text-center py-1">
                  + Añadir
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
