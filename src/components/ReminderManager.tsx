import { useState } from 'react';
import { CalendarEvent } from '../types';
import { formatReadableDate, formatShortDate, formatTime12h } from '../utils/dateUtils';
import { 
  Bell, 
  BellRing, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { CategoryBadge, StatusBadge } from './CategoryBadge';

interface ReminderManagerProps {
  events: CalendarEvent[];
  onToggleReminder: (eventId: string, enabled: boolean) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function ReminderManager({ events, onToggleReminder, onSelectEvent }: ReminderManagerProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testAlertSent, setTestAlertSent] = useState(false);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification('Recordatorios Automáticos Activados', {
            body: 'Recibirás avisos previos para tus eventos institucionales.',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Error requesting notification permission', err);
      }
    }
  };

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio playback not permitted or unavailable');
    }
  };

  const handleTestReminder = () => {
    playNotificationSound();
    setTestAlertSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Alerta de Prueba: EXPO AMBIENTE 2026', {
        body: 'Faltan 24 horas para la actividad en las instalaciones del CEARTE.',
      });
    }
    setTimeout(() => setTestAlertSent(false), 3500);
  };

  // Filter events with active reminders
  const reminderEvents = events.filter(e => e.reminder.enabled);

  const timingLabels: Record<string, string> = {
    '1_hour': '1 hora antes',
    '2_hours': '2 horas antes',
    '1_day': '1 día antes',
    '2_days': '2 días antes',
    '1_week': '1 semana antes'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Sistema de Recordatorios Automáticos
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {reminderEvents.length} activos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Notificaciones visuales y sonoras para que no se pase ninguna invitación o compromiso institucional
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {notificationPermission !== 'granted' ? (
            <button
              onClick={requestPermission}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Habilitar Notificaciones de Escritorio</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Notificaciones de navegador permitidas</span>
            </div>
          )}

          <button
            onClick={handleTestReminder}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>{testAlertSent ? '¡Sonido emitido!' : 'Probar Alerta Sonora'}</span>
          </button>
        </div>
      </div>

      {/* Upcoming Event Alert Spotlight (Calculated dynamically) */}
      {(() => {
        const sortedUpcoming = [...reminderEvents].sort((a, b) => a.date.localeCompare(b.date));
        const nextEvent = sortedUpcoming[0];
        if (!nextEvent) return null;

        return (
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <BellRing className="w-3.5 h-3.5" />
                Próxima Actividad Programada con Recordatorio
              </div>

              <h3 
                onClick={() => onSelectEvent(nextEvent)}
                className="text-xl sm:text-2xl font-bold font-display cursor-pointer hover:text-emerald-300 transition-colors"
              >
                {nextEvent.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {nextEvent.organizer} en {nextEvent.location}. {formatReadableDate(nextEvent.date)}, {nextEvent.startTime} - {nextEvent.endTime}.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recordatorio: <strong>{timingLabels[nextEvent.reminder.timing] || '1 día antes'}</strong>
                </span>
                {nextEvent.attendance.delegationNames && nextEvent.attendance.delegationNames.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Comitiva: {nextEvent.attendance.delegationNames.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Active Reminders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Programación de Recordatorios por Actividad
          </h3>
          <span className="text-xs text-slate-500">
            Total {reminderEvents.length} eventos monitoreados
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {reminderEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No hay recordatorios activos configurados. Activa uno al crear o editar un evento.
            </div>
          ) : (
            reminderEvents.map(evt => (
              <div 
                key={evt.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={evt.category} size="sm" />
                    <span className="text-xs font-bold text-slate-800">
                      {formatReadableDate(evt.date)}
                    </span>
                    <span className="text-xs text-slate-500">
                      a las {evt.startTime}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectEvent(evt)}
                    className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer"
                  >
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {evt.organizer} • {evt.location}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-800">
                      Aviso: {timingLabels[evt.reminder.timing] || '1 día antes'}
                    </div>
                    <div className="text-[11px] text-emerald-700 flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Activo
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleReminder(evt.id, false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
