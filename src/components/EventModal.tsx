import { useState, useEffect, FormEvent } from 'react';
import { CalendarEvent, EventCategory, EventStatus, ReminderTiming } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  Users, 
  Bell, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Star,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Mail,
  ArrowLeft,
  Smartphone,
  BookOpen
} from 'lucide-react';
import { CATEGORY_COLORS, StatusBadge } from './CategoryBadge';
import { FormattedTextWithLinks } from '../utils/textUtils';
import { generateEventShareSummary, copyTextToClipboard } from '../utils/shareUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: CalendarEvent | null;
  initialDate?: string;
  initialHour?: string;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

const CATEGORIES: EventCategory[] = [
  'Ambiental',
  'Académico',
  'Institucional',
  'Comunitario',
  'Científico',
  'Cultural',
  'Gubernamental'
];

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'pendiente', label: 'Pendiente de confirmación' },
  { value: 'asistido', label: 'Asistido (Completado)' },
  { value: 'no_asistido', label: 'No asistido' },
  { value: 'cancelado', label: 'Cancelado por organizador' }
];

const REMINDER_OPTIONS: { value: ReminderTiming; label: string }[] = [
  { value: '1_hour', label: '1 hora antes' },
  { value: '2_hours', label: '2 horas antes' },
  { value: '1_day', label: '1 día antes (24 hrs)' },
  { value: '2_days', label: '2 días antes' },
  { value: '1_week', label: '1 semana antes' }
];

export function EventModal({
  isOpen,
  onClose,
  eventToEdit,
  initialDate,
  initialHour,
  onSave,
  onDelete
}: EventModalProps) {
  if (!isOpen) return null;

  const isEditing = !!eventToEdit;

  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [description, setDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [category, setCategory] = useState<EventCategory>('Ambiental');
  const [status, setStatus] = useState<EventStatus>('confirmado');

  // Attendance fields
  const [projectedAttendees, setProjectedAttendees] = useState<number>(1);
  const [actualAttendees, setActualAttendees] = useState<string>('');
  const [delegationNames, setDelegationNames] = useState<string>('');
  const [attendanceNotes, setAttendanceNotes] = useState<string>('');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);

  // Reminder fields
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTiming, setReminderTiming] = useState<ReminderTiming>('1_day');

  // Inline delete confirmation state (avoids browser confirm dialog getting blocked in iframes)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  // Share summary states
  const [showShareView, setShowShareView] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [includeDelegationInShare, setIncludeDelegationInShare] = useState<boolean>(true);

  // Load existing or default values
  useEffect(() => {
    setIsConfirmingDelete(false);
    setShowShareView(false);
    setCopied(false);
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setOrganizer(eventToEdit.organizer || '');
      setLocation(eventToEdit.location || '');
      setDate(eventToEdit.date);
      setStartTime(eventToEdit.startTime || '09:00');
      setEndTime(eventToEdit.endTime || '13:00');
      setDescription(eventToEdit.description || '');
      setAdditionalNotes(eventToEdit.additionalNotes || '');
      setCategory(eventToEdit.category || 'Ambiental');
      setStatus(eventToEdit.status || 'confirmado');

      setProjectedAttendees(eventToEdit.attendance.projectedAttendees || 1);
      setActualAttendees(eventToEdit.attendance.actualAttendees !== undefined ? String(eventToEdit.attendance.actualAttendees) : '');
      setDelegationNames(eventToEdit.attendance.delegationNames?.join(', ') || '');
      setAttendanceNotes(eventToEdit.attendance.notes || '');
      setSatisfactionRating(eventToEdit.attendance.satisfactionRating || 5);

      setReminderEnabled(eventToEdit.reminder.enabled);
      setReminderTiming(eventToEdit.reminder.timing || '1_day');
    } else {
      // Defaults for new event
      setTitle('');
      setOrganizer('');
      setLocation('Instalaciones del CEARTE');
      setDate(initialDate || '2026-09-24');
      setStartTime(initialHour || '09:00');
      setEndTime('13:00');
      setDescription('');
      setAdditionalNotes('');
      setCategory('Ambiental');
      setStatus('confirmado');
      setProjectedAttendees(3);
      setActualAttendees('');
      setDelegationNames('');
      setAttendanceNotes('');
      setSatisfactionRating(5);
      setReminderEnabled(true);
      setReminderTiming('1_day');
    }
  }, [eventToEdit, initialDate, initialHour]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const delegationList = delegationNames
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const actualCount = actualAttendees.trim() !== '' ? parseInt(actualAttendees, 10) : undefined;

    const savedEvent: CalendarEvent = {
      id: eventToEdit ? eventToEdit.id : `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      organizer: organizer.trim(),
      location: location.trim(),
      date,
      startTime,
      endTime,
      description: description.trim(),
      additionalNotes: additionalNotes.trim(),
      category,
      status,
      attendance: {
        projectedAttendees: Number(projectedAttendees) || 1,
        actualAttendees: actualCount,
        delegationNames: delegationList,
        notes: attendanceNotes.trim(),
        satisfactionRating: status === 'asistido' ? satisfactionRating : undefined
      },
      reminder: {
        enabled: reminderEnabled,
        timing: reminderTiming,
        notified: eventToEdit ? eventToEdit.reminder.notified : false
      },
      createdAt: eventToEdit ? eventToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedEvent);
    onClose();
  };

  const handleQuickExpoAmbienteExample = () => {
    setTitle('EXPO AMBIENTE 2026');
    setOrganizer('Secretaría de Medio Ambiente y Desarrollo Sustentable');
    setLocation('Instalaciones del CEARTE (Centro Estatal de las Artes)');
    setDate('2026-09-24');
    setStartTime('09:00');
    setEndTime('13:00');
    setDescription('En esta ocasión el tema está enfocado en la reducción de residuos, particularmente aquellos derivados del uso de plásticos de un solo uso.');
    setAdditionalNotes('Contexto científico: Impacto de microplásticos en ecosistemas costeros de Baja California.\nPonentes invitados: Dra. Elena Ramos (IIO), Ing. Carlos Méndez.\nLogística: Montaje de módulo a las 08:00 h; llevar extensión eléctrica de uso rudo y material impreso.');
    setCategory('Ambiental');
    setStatus('confirmado');
    setProjectedAttendees(5);
    setDelegationNames('Dra. Elena Ramos, Ing. Carlos Mendez');
    setReminderEnabled(true);
    setReminderTiming('1_day');
  };

  const handleAppendNoteTemplate = (snippet: string) => {
    setAdditionalNotes(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n${snippet}` : snippet;
    });
  };

  const shareSummary = generateEventShareSummary({
    title,
    organizer,
    location,
    date,
    startTime,
    endTime,
    category,
    status,
    description,
    additionalNotes,
    delegationNames,
    projectedAttendees,
    attendanceNotes,
    includeDelegation: includeDelegationInShare
  });

  const handleCopyShareSummary = async () => {
    const success = await copyTextToClipboard(shareSummary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title.trim() || 'Actividad en Calendario',
          text: shareSummary
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing natively', err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 transition-all my-6"
        onClick={e => e.stopPropagation()}
      >
        {showShareView ? (
          <div className="flex flex-col max-h-[85vh]">
            {/* Share Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowShareView(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Volver a la edición del evento"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Compartir Resumen del Evento</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Formato estructurado para WhatsApp, Telegram, correo y mensajería
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[65vh]">
              {/* Quick Action Channels */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Canales de distribución rápida
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyShareSummary}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      copied
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white hover:bg-emerald-50/60 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mb-1 text-white animate-bounce" />
                        <span className="text-center font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mb-1 text-emerald-600" />
                        <span className="text-center">Copiar Resumen</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareSummary)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border bg-emerald-50 hover:bg-emerald-100/90 border-emerald-200 text-emerald-900 text-xs font-bold transition-all shadow-2xs group"
                  >
                    <MessageCircle className="w-5 h-5 mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-center">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=&text=${encodeURIComponent(shareSummary)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border bg-sky-50 hover:bg-sky-100/90 border-sky-200 text-sky-900 text-xs font-bold transition-all shadow-2xs group"
                  >
                    <Send className="w-5 h-5 mb-1 text-sky-600 group-hover:scale-110 transition-transform" />
                    <span className="text-center">Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent('Resumen: ' + (title.trim() || 'Actividad'))}&body=${encodeURIComponent(shareSummary)}`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200 text-indigo-900 text-xs font-bold transition-all shadow-2xs group"
                  >
                    <Mail className="w-5 h-5 mb-1 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-center">Correo</span>
                  </a>
                </div>

                {/* Native share on mobile / modern desktop */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
                    >
                      <Smartphone className="w-4 h-4 text-slate-600" />
                      <span>Abrir menú de compartir del dispositivo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-2">
                <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDelegationInShare}
                    onChange={e => setIncludeDelegationInShare(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Incluir comitiva asignada y notas institucionales en el texto</span>
                </label>
                {copied && (
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Copiado al portapapeles
                  </span>
                )}
              </div>

              {/* Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Vista previa del texto generado:
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyShareSummary}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar texto</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-64 border border-slate-800 select-all selection:bg-emerald-600 selection:text-white">
                    {shareSummary}
                  </pre>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Tip: El texto incluye etiquetas con asteriscos (*negrita*) para que WhatsApp y Telegram resalten los encabezados automáticamente al enviarlo.
                </p>
              </div>
            </div>

            {/* Share Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowShareView(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Edición</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await handleCopyShareSummary();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar y Cerrar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {isEditing ? 'Editar Actividad / Evento' : 'Registrar Nuevo Evento en Calendario'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lleva el control de fechas, sede, descripción y asistencia institucional
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareView(true)}
                  disabled={!title.trim()}
                  title={!title.trim() ? 'Ingresa un título para compartir' : 'Compartir resumen de la actividad'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    title.trim()
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

        {/* Quick template button */}
        {!isEditing && (
          <div className="bg-emerald-50/70 px-5 sm:px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>¿Deseas autocompletar el ejemplo solicitado?</span>
            </div>
            <button
              type="button"
              onClick={handleQuickExpoAmbienteExample}
              className="text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100/50 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Cargar EXPO AMBIENTE 2026
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Título de la Actividad / Evento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. EXPO AMBIENTE 2026"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Organizer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Organizador / Quien Invita</span>
              </label>
              <input
                type="text"
                value={organizer}
                onChange={e => setOrganizer(e.target.value)}
                placeholder="Ej. Secretaría de Medio Ambiente y Desarrollo Sustentable"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Sede / Lugar</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ej. Instalaciones del CEARTE"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hora Inicio</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hora Fin</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Estado del Evento
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
              >
                {STATUSES.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Descripción Detallada y Términos de la Invitación</span>
              </span>
              {description.includes('http') && (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Enlaces detectados
                </span>
              )}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej. En esta ocasión el tema está enfocado en la reducción de residuos..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 leading-relaxed font-sans"
            />
            {description.includes('http') && (
              <div className="mt-2 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-slate-700">
                <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider mb-1">
                  Vista previa de enlaces interactivos:
                </span>
                <FormattedTextWithLinks text={description} />
              </div>
            )}
          </div>

          {/* Additional Notes (Scientific Context, Speakers, Logistics) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notas Adicionales (Contexto Científico, Ponentes, Logística)</span>
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAppendNoteTemplate('• Contexto científico: ')}
                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                >
                  + Contexto Científico
                </button>
                <button
                  type="button"
                  onClick={() => handleAppendNoteTemplate('• Ponentes / Conferencistas: ')}
                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                >
                  + Ponentes
                </button>
                <button
                  type="button"
                  onClick={() => handleAppendNoteTemplate('• Logística específica: ')}
                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                >
                  + Logística
                </button>
              </div>
            </div>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="Registra información extendida: contexto científico o académico, nombres de ponentes/conferencistas, requerimientos técnicos, horarios de montaje o logística específica..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 leading-relaxed font-sans placeholder:text-slate-400"
            />
            {additionalNotes.includes('http') && (
              <div className="mt-2 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-slate-700">
                <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider mb-1">
                  Enlaces en notas adicionales:
                </span>
                <FormattedTextWithLinks text={additionalNotes} />
              </div>
            )}
          </div>

          {/* Attendance Tracking Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Registro de Asistencia y Participación Institucional
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Asistentes Proyectados (Invitación)
                </label>
                <input
                  type="number"
                  min="1"
                  value={projectedAttendees}
                  onChange={e => setProjectedAttendees(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Asistentes Reales (Si ya ocurrió)
                </label>
                <input
                  type="number"
                  min="0"
                  value={actualAttendees}
                  onChange={e => setActualAttendees(e.target.value)}
                  placeholder="Ej. 5"
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Comitiva o Delegados Asignados (Separados por coma)
              </label>
              <input
                type="text"
                value={delegationNames}
                onChange={e => setDelegationNames(e.target.value)}
                placeholder="Ej. Dra. Elena Ramos, Ing. Carlos Mendez, Lic. Sofía Valenzuela"
                className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Notas y Conclusiones de la Asistencia
              </label>
              <input
                type="text"
                value={attendanceNotes}
                onChange={e => setAttendanceNotes(e.target.value)}
                placeholder="Ej. Se entregaron constancias y se coordinó minuta de acuerdos."
                className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900"
              />
            </div>

            {status === 'asistido' && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-xs text-slate-700 font-medium">
                  Calificación de la Participación / Relevancia:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className="cursor-pointer p-0.5"
                    >
                      <Star 
                        className={`w-4 h-4 ${star <= satisfactionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Automatic Reminder Section */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Recordatorio Automático
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={e => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {reminderEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Tiempo de Notificación Previa
                  </label>
                  <select
                    value={reminderTiming}
                    onChange={e => setReminderTiming(e.target.value as ReminderTiming)}
                    className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900"
                  >
                    {REMINDER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center pt-4">
                  El sistema emitirá alerta en pantalla y notificación del navegador al aproximarse la hora.
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 border-t border-slate-200 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {isEditing && onDelete ? (
                <div>
                  {!isConfirmingDelete ? (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar Actividad</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-1.5 rounded-lg">
                      <span className="text-xs text-rose-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ¿Confirmar borrado?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(eventToEdit.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded shadow-xs transition-colors cursor-pointer"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setShowShareView(true)}
                disabled={!title.trim()}
                title={!title.trim() ? 'Ingresa un título para compartir' : 'Generar resumen para WhatsApp, Telegram o correo'}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer w-full sm:w-auto ${
                  title.trim()
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-2xs'
                    : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed'
                }`}
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Compartir Resumen</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios' : 'Registrar en Calendario'}</span>
              </button>
            </div>
          </div>
        </form>
      </>
    )}
  </div>
</div>
  );
}
