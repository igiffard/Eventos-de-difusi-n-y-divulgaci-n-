import { useMemo, useState } from 'react';
import { CalendarEvent } from '../types';
import { calculateEventStats } from '../utils/storage';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Calendar, 
  TrendingUp, 
  PieChart, 
  Building2, 
  Award, 
  BarChart, 
  AlertCircle 
} from 'lucide-react';
import { CATEGORY_COLORS } from './CategoryBadge';

interface AttendanceStatsProps {
  events: CalendarEvent[];
}

export function AttendanceStats({ events }: AttendanceStatsProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Extract all available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    events.forEach(e => {
      const y = parseInt(e.date.substring(0, 4), 10);
      if (!isNaN(y)) years.add(y);
    });
    if (!years.has(2026)) years.add(2026);
    return Array.from(years).sort().reverse();
  }, [events]);

  const stats = useMemo(() => {
    return calculateEventStats(events, selectedYear);
  }, [events, selectedYear]);

  const monthCounts = Object.values(stats.byMonthCurrentYear) as number[];
  const maxMonthValue = Math.max(1, ...monthCounts);

  return (
    <div className="space-y-6">
      {/* Header with year selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Estadísticas de Asistencia & Desempeño
          </h2>
          <p className="text-xs text-slate-500">
            Análisis de cumplimiento de invitaciones, horas delegadas y distribución temática
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Año de análisis:</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xs"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Actividades
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {stats.totalEvents}
            </div>
            <div className="text-[11px] text-slate-400">
              Registradas en historial
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tasa de Asistencia
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {stats.attendanceRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.attendedEvents} de {stats.totalEvents} atendidos
            </div>
          </div>
        </div>

        {/* Delegated Hours */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Horas Acumuladas
            </div>
            <div className="text-2xl font-extrabold text-indigo-600 font-display">
              {stats.totalDelegationHours} hrs
            </div>
            <div className="text-[11px] text-slate-400">
              Tiempo de representación
            </div>
          </div>
        </div>

        {/* Total Attendees / Delegation */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Asistencias Reales
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-display">
              {stats.totalAttendeesRecorded}
            </div>
            <div className="text-[11px] text-slate-400">
              Personas delegadas
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Bar Graph for Selected Year */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Distribución Mensual de Eventos ({selectedYear})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Frecuencia de invitaciones y convocatorias</span>
        </div>

        <div className="grid grid-cols-12 gap-1.5 sm:gap-2 items-end h-48 pt-6 border-b border-slate-200 pb-2">
          {Object.entries(stats.byMonthCurrentYear).map(([monthName, countVal]) => {
            const count = Number(countVal) || 0;
            const heightPercent = maxMonthValue > 0 ? (count / maxMonthValue) * 100 : 0;
            const isHigh = count > 0;

            return (
              <div key={monthName} className="flex flex-col items-center gap-1 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {count}
                </span>
                <div className="w-full bg-slate-100 rounded-t-md relative flex items-end h-32 overflow-hidden">
                  <div
                    style={{ height: `${Math.max(heightPercent, count > 0 ? 12 : 0)}%` }}
                    className={`w-full transition-all duration-500 rounded-t-md ${
                      isHigh
                        ? 'bg-emerald-600 group-hover:bg-emerald-700'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
                  {monthName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown & Top Organizers in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Participación por Categoría Temática
            </h3>
          </div>

          <div className="space-y-3">
            {Object.keys(stats.byCategory).length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">Sin datos disponibles</div>
            ) : (
              Object.entries(stats.byCategory).map(([cat, rawData]) => {
                const data = rawData as { count: number; attended: number };
                const percent = stats.totalEvents > 0 ? Math.round((data.count / stats.totalEvents) * 100) : 0;
                const catColor = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['Institucional'];

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${catColor.dot}`} />
                        {cat}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {data.count} eventos ({data.attended} asistidos, {percent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full ${catColor.dot}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Organizers */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Organizaciones con Mayor Vinculación
            </h3>
          </div>

          <div className="space-y-3">
            {stats.topOrganizers.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">Sin datos disponibles</div>
            ) : (
              stats.topOrganizers.map((org, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5 max-w-[80%]">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate" title={org.name}>
                      {org.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    {org.count} {org.count === 1 ? 'invitación' : 'invitaciones'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
