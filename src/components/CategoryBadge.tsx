import { EventCategory, EventStatus } from '../types';

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string; dot: string }> = {
  Ambiental: {
    bg: 'bg-emerald-50 text-emerald-800',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  Académico: {
    bg: 'bg-indigo-50 text-indigo-800',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500'
  },
  Institucional: {
    bg: 'bg-sky-50 text-sky-800',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500'
  },
  Comunitario: {
    bg: 'bg-purple-50 text-purple-800',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  },
  Científico: {
    bg: 'bg-cyan-50 text-cyan-800',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500'
  },
  Cultural: {
    bg: 'bg-rose-50 text-rose-800',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500'
  },
  Gubernamental: {
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  }
};

export const STATUS_LABELS: Record<EventStatus, { label: string; bg: string; text: string }> = {
  confirmado: {
    label: 'Confirmado',
    bg: 'bg-blue-100 text-blue-800 border-blue-200',
    text: 'text-blue-700'
  },
  pendiente: {
    label: 'Pendiente',
    bg: 'bg-amber-100 text-amber-800 border-amber-200',
    text: 'text-amber-700'
  },
  asistido: {
    label: 'Asistido',
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700'
  },
  no_asistido: {
    label: 'No Asistido',
    bg: 'bg-slate-200 text-slate-700 border-slate-300',
    text: 'text-slate-600'
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'bg-rose-100 text-rose-800 border-rose-200',
    text: 'text-rose-700'
  }
};

export function CategoryBadge({ category, showDot = true, size = 'md' }: { category: EventCategory; showDot?: boolean; size?: 'sm' | 'md' }) {
  const meta = CATEGORY_COLORS[category] || CATEGORY_COLORS['Institucional'];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${meta.bg} ${meta.border} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />}
      {category}
    </span>
  );
}

export function StatusBadge({ status }: { status: EventStatus }) {
  const meta = STATUS_LABELS[status] || STATUS_LABELS['pendiente'];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border ${meta.bg}`}>
      {meta.label}
    </span>
  );
}
