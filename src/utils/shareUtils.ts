import { formatReadableDate } from './dateUtils';

export interface ShareSummaryOptions {
  title: string;
  organizer?: string;
  location?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  status?: string;
  description?: string;
  additionalNotes?: string;
  delegationNames?: string;
  projectedAttendees?: number;
  attendanceNotes?: string;
  includeDelegation?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  confirmado: 'Confirmado',
  pendiente: 'Pendiente de confirmación',
  asistido: 'Asistido / Realizado',
  no_asistido: 'No asistido',
  cancelado: 'Cancelado'
};

/**
 * Builds a clear, structured text summary formatted for messaging apps
 * (WhatsApp, Telegram, Slack, Teams, Email, SMS).
 */
export function generateEventShareSummary(opts: ShareSummaryOptions): string {
  const {
    title,
    organizer = '',
    location = '',
    date,
    startTime = '',
    endTime = '',
    category = '',
    status = 'confirmado',
    description = '',
    additionalNotes = '',
    delegationNames = '',
    projectedAttendees = 1,
    attendanceNotes = '',
    includeDelegation = true
  } = opts;

  const formattedDate = formatReadableDate(date) || date;
  const timeFormatted = startTime && endTime 
    ? `${startTime} a ${endTime} h` 
    : startTime ? `${startTime} h` : '';

  const lines: string[] = [
    `📢 *RESUMEN DE ACTIVIDAD / EVENTO*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *${title.trim() || 'Actividad Institucional'}*`,
    `🗓️ *Fecha:* ${formattedDate}`
  ];

  if (timeFormatted) {
    lines.push(`⏰ *Horario:* ${timeFormatted}`);
  }

  if (location.trim()) {
    lines.push(`📍 *Sede / Lugar:* ${location.trim()}`);
  }

  if (organizer.trim()) {
    lines.push(`🏛️ *Organizador / Convoca:* ${organizer.trim()}`);
  }

  if (category) {
    const statusLabel = STATUS_LABELS[status] || status;
    lines.push(`🏷️ *Categoría:* ${category}  •  *Estado:* ${statusLabel}`);
  }

  if (description.trim()) {
    lines.push('');
    lines.push(`📝 *Detalles y Convocatoria:*`);
    lines.push(description.trim());
  }

  if (additionalNotes.trim()) {
    lines.push('');
    lines.push(`🔬 *Notas Adicionales (Contexto, Ponentes y Logística):*`);
    lines.push(additionalNotes.trim());
  }

  if (includeDelegation) {
    const comitiva = delegationNames.trim();
    if (comitiva) {
      lines.push('');
      lines.push(`👥 *Comitiva / Expositores asignados:*`);
      lines.push(comitiva);
    } else if (projectedAttendees > 1) {
      lines.push('');
      lines.push(`👥 *Participación proyectada:* ${projectedAttendees} personas`);
    }

    if (attendanceNotes.trim()) {
      lines.push('');
      lines.push(`ℹ️ *Notas institucionales:*`);
      lines.push(attendanceNotes.trim());
    }
  }

  lines.push('');
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Compartido desde el Calendario y Registro Histórico_`);

  return lines.join('\n');
}

/**
 * Copies string to clipboard with fallback for iframes/older browsers.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback if clipboard API is rejected inside iframe
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
