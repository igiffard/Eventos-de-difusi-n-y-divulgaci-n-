import { CalendarEvent } from '../../types';
import { MONTH_NAMES_ES, getMonthDays, formatDateKey } from '../../utils/dateUtils';
import { Calendar, ChevronRight } from 'lucide-react';

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectMonth: (monthIndex: number) => void;
  onSelectDate: (dateKey: string) => void;
}

export function YearView({ currentDate, events, onSelectMonth, onSelectDate }: YearViewProps) {
  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Group events by month for the current year
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach(evt => {
    if (!eventsByDate[evt.date]) {
      eventsByDate[evt.date] = [];
    }
    eventsByDate[evt.date].push(evt);
  });

  const todayKey = formatDateKey(new Date());

  return (
    <div className="space-y-6">
      {/* Annual Summary Stats Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Resumen Anual {year}
          </h2>
          <p className="text-xs text-slate-500">
            Vista general de los 12 meses. Haz clic en cualquier mes o día para ver su programación.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Días con eventos programados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-600">Alta actividad (2+ eventos)</span>
          </div>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {months.map((monthIndex) => {
          const days = getMonthDays(year, monthIndex);
          const monthEvents = events.filter(e => {
            const [ey, em] = e.date.split('-').map(Number);
            return ey === year && em === monthIndex + 1;
          });

          return (
            <div
              key={monthIndex}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 sm:p-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Month title */}
                <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-100">
                  <button
                    onClick={() => onSelectMonth(monthIndex)}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer font-display"
                  >
                    <span>{MONTH_NAMES_ES[monthIndex]}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    monthEvents.length > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {monthEvents.length} {monthEvents.length === 1 ? 'evento' : 'eventos'}
                  </span>
                </div>

                {/* Day initials */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                  <span>D</span>
                </div>

                {/* Mini calendar cells */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {days.map((cell, cIdx) => {
                    const cellEvents = eventsByDate[cell.dateKey] || [];
                    const hasEvents = cellEvents.length > 0;
                    const isMultiple = cellEvents.length > 1;

                    return (
                      <button
                        key={cIdx}
                        onClick={() => onSelectDate(cell.dateKey)}
                        disabled={!cell.isCurrentMonth}
                        title={
                          hasEvents
                            ? `${cell.dateKey}: ${cellEvents.map(e => e.title).join(', ')}`
                            : cell.dateKey
                        }
                        className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center text-[11px] font-medium transition-all ${
                          !cell.isCurrentMonth
                            ? 'opacity-20 cursor-default'
                            : hasEvents
                            ? isMultiple
                              ? 'bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-2xs'
                              : 'bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-2xs'
                            : cell.isToday
                            ? 'border border-emerald-500 text-emerald-700 font-bold hover:bg-slate-100'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cell.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month quick summary snippet */}
              {monthEvents.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                  {monthEvents.slice(0, 2).map(evt => (
                    <div
                      key={evt.id}
                      onClick={() => onSelectDate(evt.date)}
                      className="text-[11px] text-slate-600 hover:text-slate-900 truncate flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-700">{evt.date.substring(8)}:</span>
                      <span className="truncate">{evt.title}</span>
                    </div>
                  ))}
                  {monthEvents.length > 2 && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      +{monthEvents.length - 2} actividades adicionales
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
