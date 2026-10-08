import { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, ActiveTab, CalendarViewMode } from './types';
import { loadEventsFromStorage, saveEventsToStorage } from './utils/storage';
import { formatDateKey, formatReadableDate, formatShortDate } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MonthView } from './components/CalendarViews/MonthView';
import { WeekView } from './components/CalendarViews/WeekView';
import { DayView } from './components/CalendarViews/DayView';
import { YearView } from './components/CalendarViews/YearView';
import { EventModal } from './components/EventModal';
import { HistoryLog } from './components/HistoryLog';
import { AttendanceStats } from './components/AttendanceStats';
import { ReminderManager } from './components/ReminderManager';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { Bell, X, Search, Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEventsFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Center initial view around September 24, 2026
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 24));

  // Global search states (by activity and/or dates)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<string>('');
  const [searchEndDate, setSearchEndDate] = useState<string>('');

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string>('2026-09-24');
  const [modalInitialHour, setModalInitialHour] = useState<string | undefined>(undefined);

  // In-app alert for triggered reminders
  const [activeNotification, setActiveNotification] = useState<{ id: string; title: string; message: string } | null>(null);

  // Synchronize to localStorage whenever events change
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  // Background timer checking for reminder alerts
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach(evt => {
        if (!evt.reminder.enabled || evt.reminder.notified) return;

        const [y, m, d] = evt.date.split('-').map(Number);
        const [h, min] = (evt.startTime || '09:00').split(':').map(Number);
        const eventTime = new Date(y, m - 1, d, h, min);

        let offsetMinutes = 1440; // 1 day default
        if (evt.reminder.timing === '1_hour') offsetMinutes = 60;
        if (evt.reminder.timing === '2_hours') offsetMinutes = 120;
        if (evt.reminder.timing === '2_days') offsetMinutes = 2880;
        if (evt.reminder.timing === '1_week') offsetMinutes = 10080;

        const reminderTriggerTime = new Date(eventTime.getTime() - offsetMinutes * 60000);

        const diffMs = now.getTime() - reminderTriggerTime.getTime();
        if (diffMs >= 0 && diffMs < 7200000) {
          setActiveNotification({
            id: evt.id,
            title: `Recordatorio: ${evt.title}`,
            message: `Actividad programada para el ${evt.date} a las ${evt.startTime} en ${evt.location || 'sede asignada'}.`
          });

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Recordatorio de Actividad: ${evt.title}`, {
              body: `Fecha: ${evt.date} - ${evt.startTime} hrs. Sede: ${evt.location}`,
            });
          }

          setEvents(prev => prev.map(e => e.id === evt.id ? { ...e, reminder: { ...e.reminder, notified: true } } : e));
        }
      });
    };

    const interval = setInterval(checkReminders, 45000);
    return () => clearInterval(interval);
  }, [events]);

  // Filtered events based on global search bar (activity text and/or dates)
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return events
      .filter(evt => {
        if (q) {
          const readableDate = formatReadableDate(evt.date).toLowerCase();
          const shortDate = formatShortDate(evt.date).toLowerCase();
          const delegationText = (evt.attendance.delegationNames || []).join(' ').toLowerCase();
          const matchesActivityOrDateText =
            evt.title.toLowerCase().includes(q) ||
            (evt.description || '').toLowerCase().includes(q) ||
            (evt.additionalNotes || '').toLowerCase().includes(q) ||
            (evt.location || '').toLowerCase().includes(q) ||
            (evt.organizer || '').toLowerCase().includes(q) ||
            (evt.category || '').toLowerCase().includes(q) ||
            (evt.attendance.notes || '').toLowerCase().includes(q) ||
            delegationText.includes(q) ||
            evt.date.includes(q) ||
            readableDate.includes(q) ||
            shortDate.includes(q);

          if (!matchesActivityOrDateText) return false;
        }

        if (searchStartDate && evt.date < searchStartDate) {
          return false;
        }

        if (searchEndDate && evt.date > searchEndDate) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const cmpDate = a.date.localeCompare(b.date);
        if (cmpDate !== 0) return cmpDate;
        return (a.startTime || '09:00').localeCompare(b.startTime || '09:00');
      });
  }, [events, searchQuery, searchStartDate, searchEndDate]);

  const hasActiveSearch = Boolean(
    searchQuery.trim() !== '' || searchStartDate !== '' || searchEndDate !== ''
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchStartDate('');
    setSearchEndDate('');
  };

  // Handler: Open modal for new event
  const handleOpenNewEvent = (initialDateStr?: string, initialHourStr?: string) => {
    setEventToEdit(null);
    setModalInitialDate(initialDateStr || formatDateKey(currentDate));
    setModalInitialHour(initialHourStr);
    setIsEventModalOpen(true);
  };

  // Handler: Open modal to edit existing event
  const handleSelectEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setModalInitialDate(event.date);
    setModalInitialHour(event.startTime);
    setIsEventModalOpen(true);
  };

  // Handler: Select a date cell from month/year view
  const handleSelectDate = (dateKey: string) => {
    const [y, m, d] = dateKey.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d));
    setViewMode('day');
  };

  // Handler: Jump to date in Calendar
  const handleJumpToCalendarDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d));
    setViewMode('month');
    setActiveTab('calendar');
  };

  // Handler: Select a month from year view
  const handleSelectMonth = (monthIndex: number) => {
    const next = new Date(currentDate);
    next.setMonth(monthIndex);
    setCurrentDate(next);
    setViewMode('month');
  };

  // Handler: Save event (create or update)
  const handleSaveEvent = (savedEvent: CalendarEvent) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === savedEvent.id);
      if (exists) {
        return prev.map(e => e.id === savedEvent.id ? savedEvent : e);
      }
      return [savedEvent, ...prev];
    });
  };

  // Handler: Delete event
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Handler: Quick toggle attendance
  const handleQuickToggleAttendance = (eventId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const nextStatus = evt.status === 'asistido' ? 'confirmado' : 'asistido';
        const actual = nextStatus === 'asistido' ? (evt.attendance.actualAttendees || evt.attendance.projectedAttendees || 1) : undefined;
        return {
          ...evt,
          status: nextStatus,
          attendance: {
            ...evt.attendance,
            actualAttendees: actual
          }
        };
      }
      return evt;
    }));
  };

  // Handler: Toggle reminder for event
  const handleToggleReminder = (eventId: string, enabled: boolean) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          reminder: {
            ...evt.reminder,
            enabled,
            notified: false
          }
        };
      }
      return evt;
    }));
  };

  const pendingRemindersCount = events.filter(e => e.reminder.enabled && !e.reminder.notified).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation & Global Search Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onNewEventClick={() => handleOpenNewEvent()}
        pendingRemindersCount={pendingRemindersCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchStartDate={searchStartDate}
        setSearchStartDate={setSearchStartDate}
        searchEndDate={searchEndDate}
        setSearchEndDate={setSearchEndDate}
        matchingEventsCount={filteredEvents.length}
        totalEventsCount={events.length}
        onClearSearch={handleClearSearch}
      />

      {/* In-App Floating Notification Banner when reminder is active */}
      {activeNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full p-4 bg-white border-2 border-emerald-500 rounded-xl shadow-xl flex items-start justify-between gap-3 animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{activeNotification.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{activeNotification.message}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
        {/* Global Search Results Panel when searching by Activity and/or Dates */}
        {hasActiveSearch && (
          <section className="bg-white rounded-xl border border-emerald-200 shadow-xs overflow-hidden no-print">
            <div className="px-4 sm:px-5 py-3 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Search className="w-4 h-4 text-emerald-700" />
                <span>
                  Resultados de búsqueda ({filteredEvents.length}{' '}
                  {filteredEvents.length === 1 ? 'actividad encontrada' : 'actividades encontradas'})
                </span>
                {searchStartDate && !searchEndDate && (
                  <button
                    type="button"
                    onClick={() => setSearchEndDate(searchStartDate)}
                    className="ml-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Filtrar solo el día {formatShortDate(searchStartDate)}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar y mostrar todo</span>
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-sm font-medium text-slate-600">
                  No se encontraron actividades que coincidan con los criterios de búsqueda o fechas seleccionadas.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Restablecer filtros de búsqueda
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {filteredEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span className="font-bold text-emerald-800">{formatReadableDate(evt.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums text-slate-700 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {evt.startTime} – {evt.endTime} h
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-600">{evt.category}</span>
                      </div>

                      <h4
                        onClick={() => handleSelectEvent(evt)}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer font-display truncate"
                      >
                        {evt.title}
                      </h4>

                      {evt.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectEvent(evt)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Ver detalles
                      </button>
                      <button
                        type="button"
                        onClick={() => handleJumpToCalendarDate(evt.date)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Ver en calendario</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 0: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <Dashboard
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onNewEventClick={() => handleOpenNewEvent()}
            onQuickToggleAttendance={handleQuickToggleAttendance}
            onNavigateTab={setActiveTab}
            onJumpToDate={handleJumpToCalendarDate}
          />
        )}

        {/* Tab 1: CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={handleSelectEvent}
                onSelectDate={handleSelectDate}
              />
            )}

            {viewMode === 'week' && (
              <WeekView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={handleSelectEvent}
                onSelectDate={handleSelectDate}
              />
            )}

            {viewMode === 'day' && (
              <DayView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={handleSelectEvent}
                onNewEventForDate={(dateKey, hour) => handleOpenNewEvent(dateKey, hour)}
              />
            )}

            {viewMode === 'year' && (
              <YearView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectMonth={handleSelectMonth}
                onSelectDate={handleSelectDate}
              />
            )}
          </div>
        )}

        {/* Tab 2: HISTORICAL LOG */}
        {activeTab === 'history' && (
          <HistoryLog
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onQuickToggleAttendance={handleQuickToggleAttendance}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {/* Tab 3: ATTENDANCE STATISTICS */}
        {activeTab === 'stats' && (
          <AttendanceStats events={filteredEvents} />
        )}

        {/* Tab 4: AUTOMATIC REMINDERS */}
        {activeTab === 'reminders' && (
          <ReminderManager
            events={filteredEvents}
            onToggleReminder={handleToggleReminder}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* Tab 5: PRINT PREVIEW & PDF */}
        {activeTab === 'print_preview' && (
          <PrintPreviewModal
            events={filteredEvents}
            currentDate={currentDate}
            onClose={() => setActiveTab('calendar')}
          />
        )}
      </main>

      {/* Modal for Creating & Editing Events */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={eventToEdit}
        initialDate={modalInitialDate}
        initialHour={modalInitialHour}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong>Calendario Institucional de Eventos 2026</strong> • Registro Histórico, Estadísticas y Agenda Científica
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('print_preview')}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Vista Preliminar de Impresión / PDF
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
