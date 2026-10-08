import { 
  LayoutDashboard,
  Calendar as CalendarIcon, 
  Clock, 
  BarChart3, 
  Bell, 
  Printer, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Search,
  X,
  CalendarRange
} from 'lucide-react';
import { ActiveTab, CalendarViewMode } from '../types';
import { MONTH_NAMES_ES, formatReadableDate } from '../utils/dateUtils';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onNewEventClick: () => void;
  pendingRemindersCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchStartDate: string;
  setSearchStartDate: (d: string) => void;
  searchEndDate: string;
  setSearchEndDate: (d: string) => void;
  matchingEventsCount: number;
  totalEventsCount: number;
  onClearSearch: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  currentDate,
  setCurrentDate,
  onNewEventClick,
  pendingRemindersCount,
  searchQuery,
  setSearchQuery,
  searchStartDate,
  setSearchStartDate,
  searchEndDate,
  setSearchEndDate,
  matchingEventsCount,
  totalEventsCount,
  onClearSearch
}: NavbarProps) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const hasActiveSearch = Boolean(
    searchQuery.trim() !== '' || searchStartDate !== '' || searchEndDate !== ''
  );

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'year') {
      next.setFullYear(currentYear - 1);
    } else if (viewMode === 'month') {
      next.setMonth(currentMonth - 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'year') {
      next.setFullYear(currentYear + 1);
    } else if (viewMode === 'month') {
      next.setMonth(currentMonth + 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 24));
  };

  const handleQuickMonthRange = (year: number, monthZeroIndexed: number) => {
    const mStr = String(monthZeroIndexed + 1).padStart(2, '0');
    const lastDay = new Date(year, monthZeroIndexed + 1, 0).getDate();
    const start = `${year}-${mStr}-01`;
    const end = `${year}-${mStr}-${String(lastDay).padStart(2, '0')}`;

    if (searchStartDate === start && searchEndDate === end) {
      setSearchStartDate('');
      setSearchEndDate('');
    } else {
      setSearchStartDate(start);
      setSearchEndDate(end);
      setCurrentDate(new Date(year, monthZeroIndexed, 1));
    }
  };

  const getNavigationLabel = () => {
    if (viewMode === 'year') {
      return `${currentYear}`;
    }
    if (viewMode === 'month') {
      return `${MONTH_NAMES_ES[currentMonth]} ${currentYear}`;
    }
    if (viewMode === 'week') {
      return `${MONTH_NAMES_ES[currentMonth]} ${currentYear}`;
    }
    return formatReadableDate(
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    );
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner with Brand and Global Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display">
                  Calendario de Eventos & Registro Histórico
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gestión de invitaciones, registro de asistencia, recordatorios y difusión institucional
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="btn-new-event"
              onClick={onNewEventClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Registrar Evento</span>
            </button>

            <button
              id="btn-quick-print"
              onClick={() => setActiveTab('print_preview')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
              title="Vista previa para impresión y exportar PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar by Activity and/or Dates */}
        <div className="py-2.5 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Activity Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-search-activity"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por actividad, sede, organizador, ponente o palabra clave..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Borrar texto de búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Range Pickers & Quick Month Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <CalendarRange className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <label htmlFor="global-search-start-date" className="text-slate-500 font-medium">
                Desde:
              </label>
              <input
                id="global-search-start-date"
                type="date"
                value={searchStartDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchStartDate(val);
                  if (val) {
                    const [y, m, d] = val.split('-').map(Number);
                    setCurrentDate(new Date(y, m - 1, d));
                  }
                }}
                className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
              />
              <span className="text-slate-300">|</span>
              <label htmlFor="global-search-end-date" className="text-slate-500 font-medium">
                Hasta:
              </label>
              <input
                id="global-search-end-date"
                type="date"
                value={searchEndDate}
                min={searchStartDate || undefined}
                onChange={(e) => setSearchEndDate(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
              />
            </div>

            {/* Quick Month Filter Buttons */}
            <div className="flex items-center gap-1">
              {[
                { label: 'Sep', month: 8 },
                { label: 'Oct', month: 9 },
                { label: 'Nov', month: 10 }
              ].map(({ label, month }) => {
                const mStr = String(month + 1).padStart(2, '0');
                const isSelected = searchStartDate.startsWith(`2026-${mStr}`) && searchEndDate.startsWith(`2026-${mStr}`);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleQuickMonthRange(2026, month)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    title={`Filtrar actividades de ${MONTH_NAMES_ES[month]} 2026`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Active Search Status & Clear Button */}
            {hasActiveSearch && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg tabular-nums">
                  {matchingEventsCount} de {totalEventsCount}
                </span>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-1 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 shrink-0">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Panel General</span>
            </button>

            <button
              id="nav-tab-calendar"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendario</span>
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Registro Histórico</span>
            </button>

            <button
              id="nav-tab-stats"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Estadísticas</span>
            </button>

            <button
              id="nav-tab-reminders"
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer relative ${
                activeTab === 'reminders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Recordatorios</span>
              {pendingRemindersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-print-preview"
              onClick={() => setActiveTab('print_preview')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'print_preview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </nav>

          {/* Calendar specific view modes (Day, Week, Month, Year) */}
          {activeTab === 'calendar' && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg shrink-0 ml-3">
              {(['day', 'week', 'month', 'year'] as CalendarViewMode[]).map((mode) => {
                const labels: Record<CalendarViewMode, string> = {
                  day: 'Día',
                  week: 'Semana',
                  month: 'Mes',
                  year: 'Año'
                };
                return (
                  <button
                    key={mode}
                    id={`btn-view-${mode}`}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      viewMode === mode
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date Navigator (Visible on Calendar Tab) */}
        {activeTab === 'calendar' && (
          <div className="flex items-center justify-between py-2.5 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-prev"
                onClick={handlePrev}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-nav-next"
                onClick={handleNext}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                id="btn-nav-today"
                onClick={handleToday}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                Ir a Septiembre 2026
              </button>
            </div>

            <div className="text-base sm:text-lg font-bold text-slate-800 tracking-tight font-display">
              {getNavigationLabel()}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Modo interactivo</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
