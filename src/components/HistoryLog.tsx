import { useState, useMemo } from 'react';
import { CalendarEvent, EventCategory, EventStatus } from '../types';
import { formatReadableDate, formatShortDate, formatTime12h, calculateDurationHours } from '../utils/dateUtils';
import { CategoryBadge, StatusBadge } from './CategoryBadge';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building, 
  Users, 
  Star, 
  ExternalLink, 
  Edit2,
  Trash2
} from 'lucide-react';
import { downloadFile } from '../utils/storage';
import { FormattedTextWithLinks } from '../utils/textUtils';

interface HistoryLogProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onQuickToggleAttendance: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export function HistoryLog({ events, onSelectEvent, onQuickToggleAttendance, onDeleteEvent }: HistoryLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Available years from events
  const years = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      const y = e.date.substring(0, 4);
      if (y) set.add(y);
    });
    return Array.from(set).sort().reverse();
  }, [events]);

  // Filtered and sorted events (most recent first)
  const filteredEvents = useMemo(() => {
    return events
      .filter(evt => {
        const matchesSearch = 
          evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.additionalNotes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.organizer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.attendance.delegationNames || []).some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesYear = selectedYear === 'all' || evt.date.startsWith(selectedYear);
        const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || evt.status === selectedStatus;

        return matchesSearch && matchesYear && matchesCategory && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, searchQuery, selectedYear, selectedCategory, selectedStatus]);

  // Export filtered to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Fecha',
      'Hora Inicio',
      'Hora Fin',
      'Título Actividad',
      'Organizador',
      'Sede / Lugar',
      'Categoría',
      'Estado',
      'Asistentes Proyectados',
      'Asistentes Reales',
      'Comitiva Delegada',
      'Descripción / Tema',
      'Notas Adicionales',
      'Notas de Asistencia'
    ];

    const rows = filteredEvents.map(evt => [
      `"${evt.id}"`,
      `"${evt.date}"`,
      `"${evt.startTime}"`,
      `"${evt.endTime}"`,
      `"${evt.title.replace(/"/g, '""')}"`,
      `"${(evt.organizer || '').replace(/"/g, '""')}"`,
      `"${(evt.location || '').replace(/"/g, '""')}"`,
      `"${evt.category}"`,
      `"${evt.status}"`,
      evt.attendance.projectedAttendees,
      evt.attendance.actualAttendees !== undefined ? evt.attendance.actualAttendees : '',
      `"${(evt.attendance.delegationNames || []).join('; ').replace(/"/g, '""')}"`,
      `"${(evt.description || '').replace(/"/g, '""')}"`,
      `"${(evt.additionalNotes || '').replace(/"/g, '""')}"`,
      `"${(evt.attendance.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadFile(csvContent, `registro_historico_eventos_${selectedYear}.csv`, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Registro Histórico de Actividades & Asistencia
            </h2>
            <p className="text-xs text-slate-500">
              Bitácora completa con auditoría de asistencia, delegaciones participantes y conclusiones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel / CSV</span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fichas
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, sede, comitiva..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800"
            >
              <option value="all">Todos los Años</option>
              {years.map(y => (
                <option key={y} value={y}>Año {y}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800"
            >
              <option value="all">Todas las Categorías</option>
              <option value="Ambiental">Ambiental</option>
              <option value="Académico">Académico</option>
              <option value="Institucional">Institucional</option>
              <option value="Comunitario">Comunitario</option>
              <option value="Científico">Científico</option>
              <option value="Cultural">Cultural</option>
              <option value="Gubernamental">Gubernamental</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800"
            >
              <option value="all">Todos los Estados</option>
              <option value="confirmado">Confirmado</option>
              <option value="asistido">Asistido (Completado)</option>
              <option value="pendiente">Pendiente</option>
              <option value="no_asistido">No Asistido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Count summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Mostrando <strong>{filteredEvents.length}</strong> actividades registradas</span>
          {(searchQuery || selectedYear !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedYear('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* View: Cards */}
      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
              No se encontraron actividades con los filtros seleccionados.
            </div>
          ) : (
            filteredEvents.map(evt => {
              const hours = calculateDurationHours(evt.startTime, evt.endTime);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={evt.category} />
                      <StatusBadge status={evt.status} />
                      <span className="text-xs font-semibold text-slate-600">
                        {formatReadableDate(evt.date)}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({evt.startTime} - {evt.endTime}, {hours} hrs)
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectEvent(evt)}
                      className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer font-display"
                    >
                      {evt.title}
                    </h3>

                    {evt.description && (
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <FormattedTextWithLinks text={evt.description} />
                      </div>
                    )}

                    {evt.additionalNotes && (
                      <div className="text-xs text-slate-700 leading-relaxed bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900 block uppercase tracking-wider text-[10px] mb-0.5">
                          Notas Adicionales (Contexto, Ponentes y Logística):
                        </span>
                        <FormattedTextWithLinks text={evt.additionalNotes} />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-xs text-slate-600">
                      {evt.organizer && (
                        <div className="flex items-start gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">Organiza: </span>
                            <span>{evt.organizer}</span>
                          </div>
                        </div>
                      )}

                      {evt.location && (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">Sede: </span>
                            <span>{evt.location}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">Asistencia: </span>
                          <span>
                            {evt.attendance.actualAttendees !== undefined
                              ? `${evt.attendance.actualAttendees} confirmados`
                              : `${evt.attendance.projectedAttendees} proyectados`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delegation names and notes */}
                    {(evt.attendance.delegationNames?.length || evt.attendance.notes) && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        {evt.attendance.delegationNames && evt.attendance.delegationNames.length > 0 && (
                          <div>
                            <span className="font-semibold text-slate-700">Comitiva participante: </span>
                            <span>{evt.attendance.delegationNames.join(', ')}</span>
                          </div>
                        )}
                        {evt.attendance.notes && (
                          <div>
                            <span className="font-semibold text-slate-700">Conclusiones: </span>
                            <span>{evt.attendance.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectEvent(evt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Ver detalles o modificar"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Editar</span>
                      </button>

                      {onDeleteEvent && (
                        deleteConfirmId === evt.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                            <button
                              onClick={() => {
                                onDeleteEvent(evt.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                            >
                              Borrar
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(evt.id)}
                            className="inline-flex items-center p-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Eliminar esta actividad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() => onQuickToggleAttendance(evt.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        evt.status === 'asistido'
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'border border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Marcar como evento cumplido y asistido"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{evt.status === 'asistido' ? 'Asistencia Verificada' : 'Marcar Asistido'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* View: Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3">Actividad / Evento</th>
                <th className="px-4 py-3">Organizador & Sede</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-center">Asistentes</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                    {formatShortDate(evt.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-mono">
                    {evt.startTime} - {evt.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <div 
                      onClick={() => onSelectEvent(evt)}
                      className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer max-w-xs"
                    >
                      {evt.title}
                    </div>
                    {evt.description && (
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                        {evt.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">
                    <div className="truncate font-medium text-slate-800">{evt.organizer}</div>
                    <div className="truncate text-[11px] text-slate-500">{evt.location}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <CategoryBadge category={evt.category} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={evt.status} />
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap font-medium">
                    {evt.attendance.actualAttendees !== undefined ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {evt.attendance.actualAttendees}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        ({evt.attendance.projectedAttendees} proyectados)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectEvent(evt)}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        Editar
                      </button>

                      {onDeleteEvent && (
                        deleteConfirmId === evt.id ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 p-0.5 rounded">
                            <button
                              onClick={() => {
                                onDeleteEvent(evt.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                            >
                              Borrar
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200/50 rounded cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(evt.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded cursor-pointer"
                            title="Eliminar actividad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
