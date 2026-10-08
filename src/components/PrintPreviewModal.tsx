import { useState, useMemo } from 'react';
import { CalendarEvent } from '../types';
import { 
  formatReadableDate, 
  formatShortDate, 
  MONTH_NAMES_ES, 
  calculateDurationHours, 
  getMonthDays,
  DAY_NAMES_SHORT_ES
} from '../utils/dateUtils';
import { 
  Printer, 
  FileText, 
  CheckCircle2, 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Download, 
  Eye,
  FileSpreadsheet,
  CheckSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { FormattedTextWithLinks } from '../utils/textUtils';
import { CategoryBadge, StatusBadge } from './CategoryBadge';

interface PrintPreviewModalProps {
  events: CalendarEvent[];
  currentDate: Date;
  onClose: () => void;
}

export function PrintPreviewModal({ events, currentDate, onClose }: PrintPreviewModalProps) {
  const [reportType, setReportType] = useState<'dossier' | 'monthly_calendar' | 'attendance_summary'>('dossier');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);
  const [includeFullDescription, setIncludeFullDescription] = useState<boolean>(true);

  // Filter events according to report selection
  const reportEvents = useMemo(() => {
    return events
      .filter(evt => {
        const [ey, em] = evt.date.split('-').map(Number);
        if (reportType === 'monthly_calendar') {
          return ey === selectedYear && em === selectedMonth + 1;
        }
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, reportType, selectedMonth, selectedYear]);

  const totalAttended = reportEvents.filter(e => e.status === 'asistido').length;
  const totalDelegates = reportEvents.reduce((acc, curr) => acc + (curr.attendance.actualAttendees || curr.attendance.projectedAttendees || 0), 0);
  const totalHours = reportEvents.reduce((acc, curr) => acc + calculateDurationHours(curr.startTime, curr.endTime), 0);

  // Grid cells for printable calendar
  const monthDays = useMemo(() => {
    return getMonthDays(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(evt => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Vista Preliminar para Impresión & Exportación PDF
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Formato Carta / A4 Oficial
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Previsualiza exactamente cómo se emitirá el reporte en tu impresora local o en el diálogo "Guardar como PDF"
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onClose}
            className="flex-1 md:flex-initial px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar Vista Previa
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Mandar a Impresora / PDF</span>
          </button>
        </div>
      </div>

      {/* Configuration bar (Hidden during print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs no-print">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Formato de Reporte:</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 font-medium cursor-pointer"
            >
              <option value="dossier">Dossier Ejecutivo de Actividades (Detallado)</option>
              <option value="monthly_calendar">Agenda Gráfica Mensual (Rejilla de Calendario)</option>
              <option value="attendance_summary">Tabla Resumen de Asistencia y Acuerdos</option>
            </select>
          </div>

          {reportType === 'monthly_calendar' && (
            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700">Mes:</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 cursor-pointer"
              >
                {MONTH_NAMES_ES.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 cursor-pointer"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={includeSignatures}
              onChange={e => setIncludeSignatures(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Líneas de Firma y Aprobación</span>
          </label>

          {reportType === 'dossier' && (
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeFullDescription}
                onChange={e => setIncludeFullDescription(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Descripciones completas</span>
            </label>
          )}
        </div>
      </div>

      {/* PRINTABLE AREA (A4 / Letter Clean Preview) */}
      <div className="printable-area max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-md p-8 sm:p-12 text-slate-900 font-sans space-y-6">
        {/* Official Header */}
        <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 mb-1">
              Bitácora Institucional de Vinculación y Eventos
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
              {reportType === 'monthly_calendar' 
                ? `Agenda Oficial - ${MONTH_NAMES_ES[selectedMonth]} ${selectedYear}`
                : reportType === 'attendance_summary'
                ? 'Resumen Ejecutivo de Asistencia y Participación'
                : 'Informe Oficial de Registro de Eventos'}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Seguimiento de convocatorias, representación institucional y estadísticas de cumplimiento
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 font-mono space-y-0.5 shrink-0">
            <div><strong>Emisión:</strong> {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Folio:</strong> EVT-{selectedYear}-{reportEvents.length.toString().padStart(3, '0')}</div>
            <div className="font-bold text-emerald-800">Estatus: Oficial Aprobado</div>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Actividades
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              {reportEvents.length}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Eventos Cumplidos
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-display mt-0.5">
              {totalAttended}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Personas Delegadas
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              {totalDelegates}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Horas Acumuladas
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              {totalHours} hrs
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: DOSSIER EJECUTIVO (Cards detalladas con salto de página)    */}
        {/* =================================================================== */}
        {reportType === 'dossier' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Desglose Cronológico de Actividades Registradas</span>
              <span className="font-normal text-slate-500 lowercase">({reportEvents.length} eventos)</span>
            </h2>

            {reportEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm italic">
                No hay actividades registradas en este período.
              </div>
            ) : (
              <div className="space-y-4">
                {reportEvents.map((evt, index) => {
                  const hours = calculateDurationHours(evt.startTime, evt.endTime);

                  return (
                    <div 
                      key={evt.id} 
                      className="p-4 rounded-xl border border-slate-200 page-break-inside-avoid space-y-2 bg-white"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-base text-slate-900 font-display leading-snug">
                            {evt.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-800">
                            {evt.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-700 uppercase">
                            {evt.status}
                          </span>
                        </div>
                      </div>

                      {/* Metadata line */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-900 block">Fecha y Horario:</span>
                          <span>{formatReadableDate(evt.date)} ({evt.startTime} - {evt.endTime}, {hours} hrs)</span>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 block">Organizador:</span>
                          <span>{evt.organizer || 'No especificado'}</span>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 block">Sede / Ubicación:</span>
                          <span>{evt.location || 'Por definir'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {includeFullDescription && evt.description && (
                        <div className="text-xs text-slate-700 leading-relaxed pt-1">
                          <span className="font-semibold text-slate-900 block mb-0.5">Descripción y Términos de Invitación: </span>
                          <FormattedTextWithLinks text={evt.description} />
                        </div>
                      )}

                      {/* Attendance detail */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 gap-2">
                        <div>
                          <span className="font-semibold text-slate-800">Comitiva participante: </span>
                          <span>{evt.attendance.delegationNames?.join(', ') || 'Personal institucional asignado'}</span>
                        </div>

                        <div className="font-semibold text-slate-800">
                          Asistencia: {evt.attendance.actualAttendees !== undefined ? `${evt.attendance.actualAttendees} asistentes confirmados` : `${evt.attendance.projectedAttendees} proyectados`}
                        </div>
                      </div>

                      {evt.attendance.notes && (
                        <div className="text-xs text-slate-600 bg-amber-50/70 p-2 rounded border border-amber-200">
                          <span className="font-semibold text-amber-900">Conclusiones / Acuerdos: </span>
                          <span>{evt.attendance.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: AGENDA GRÁFICA MENSUAL (Rejilla calendario imprimible)      */}
        {/* =================================================================== */}
        {reportType === 'monthly_calendar' && (
          <div className="space-y-4 page-break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Calendario Mensual Imprimible • {MONTH_NAMES_ES[selectedMonth]} {selectedYear}</span>
              <span className="font-normal text-slate-500 lowercase">({reportEvents.length} eventos en el mes)</span>
            </h2>

            {/* Days of week header */}
            <div className="grid grid-cols-7 border-t border-l border-r border-slate-300 bg-slate-100 text-slate-800 text-center font-bold text-xs py-1.5">
              <span>Lunes</span>
              <span>Martes</span>
              <span>Miércoles</span>
              <span>Jueves</span>
              <span>Viernes</span>
              <span>Sábado</span>
              <span>Domingo</span>
            </div>

            {/* Monthly Calendar Grid */}
            <div className="grid grid-cols-7 border border-slate-300 divide-x divide-y divide-slate-200 text-xs">
              {monthDays.map((cell, idx) => {
                const dayEvents = eventsByDate[cell.dateKey] || [];
                return (
                  <div
                    key={idx}
                    className={`min-h-[85px] p-1.5 flex flex-col justify-between ${
                      cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs ${cell.isToday ? 'bg-emerald-700 text-white px-1.5 py-0.2 rounded-full' : ''}`}>
                        {cell.dayNumber}
                      </span>
                      {dayEvents.length > 0 && cell.isCurrentMonth && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {cell.isCurrentMonth && dayEvents.map(e => (
                        <div 
                          key={e.id} 
                          className="bg-slate-100 p-1 rounded border border-slate-300 text-[10px] leading-tight font-medium text-slate-900"
                        >
                          <div className="font-bold truncate">{e.startTime} {e.title}</div>
                          {e.location && <div className="text-[9px] text-slate-500 truncate">{e.location}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: RESUMEN DE ASISTENCIA (Tabla condensada)                    */}
        {/* =================================================================== */}
        {reportType === 'attendance_summary' && (
          <div className="space-y-4 page-break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Tabla de Cumplimiento de Asistencia y Delegaciones</span>
              <span className="font-normal text-slate-500 lowercase">({reportEvents.length} registros)</span>
            </h2>

            <table className="w-full text-left text-xs border border-slate-300 divide-y divide-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2 border-r border-slate-300">Fecha</th>
                  <th className="p-2 border-r border-slate-300">Actividad / Evento</th>
                  <th className="p-2 border-r border-slate-300">Sede & Organizador</th>
                  <th className="p-2 border-r border-slate-300 text-center">Estado</th>
                  <th className="p-2 border-r border-slate-300 text-center">Asistentes</th>
                  <th className="p-2">Comitiva Asignada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="p-2 whitespace-nowrap font-medium border-r border-slate-200">
                      {formatShortDate(evt.date)}
                      <div className="text-[10px] text-slate-500">{evt.startTime} - {evt.endTime}</div>
                    </td>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                      {evt.title}
                      <div className="text-[10px] font-normal text-slate-500">{evt.category}</div>
                    </td>
                    <td className="p-2 text-slate-700 border-r border-slate-200">
                      <div>{evt.organizer}</div>
                      <div className="text-[10px] text-slate-500">{evt.location}</div>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap border-r border-slate-200">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.status === 'asistido' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap font-bold text-slate-900 border-r border-slate-200">
                      {evt.attendance.actualAttendees !== undefined ? evt.attendance.actualAttendees : evt.attendance.projectedAttendees}
                    </td>
                    <td className="p-2 text-[11px] text-slate-600">
                      {evt.attendance.delegationNames?.join(', ') || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures Area */}
        {includeSignatures && (
          <div className="pt-10 page-break-inside-avoid">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-8 text-center">
              Constancia y Validación Institucional
            </div>

            <div className="grid grid-cols-2 gap-12 text-center text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-400 h-10 w-52 mx-auto" />
                <div className="font-bold text-slate-800">Coordinación de Vinculación y Eventos</div>
                <div className="text-slate-500 text-[11px]">Firma y Nombre del Responsable</div>
              </div>

              <div className="space-y-1">
                <div className="border-b border-slate-400 h-10 w-52 mx-auto" />
                <div className="font-bold text-slate-800">Dirección / Autoridad Institucional</div>
                <div className="text-slate-500 text-[11px]">Sello de Validación y Visto Bueno</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Calendario de Eventos & Registro Histórico</span>
          <span>Formato oficial de reporte institucional • Generado para impresión y PDF</span>
        </div>
      </div>
    </div>
  );
}
