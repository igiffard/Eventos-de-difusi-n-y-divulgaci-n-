import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Parses text and replaces URLs with clickable, styled links.
 * Preserves line breaks for official invitation formats.
 */
export function FormattedTextWithLinks({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  // Regex to detect URLs (http, https, forms.gle, etc.)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split lines first to preserve formatting
  const lines = text.split('\n');

  return (
    <div className={`space-y-1 ${className}`}>
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const parts = line.split(urlRegex);

        return (
          <p key={lineIdx} className="leading-relaxed break-words">
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                // Determine label if it's a known form or clean URL
                let label = part;
                if (part.includes('forms.gle/Krbt89Gia9GN2u4C6')) {
                  label = 'Formulario: Confirmar Asistencia';
                } else if (part.includes('forms.gle/1pQYVWjPSYRw6dwX8')) {
                  label = 'Formulario: Solicitud de Mobiliario';
                } else if (part.includes('forms.gle/HjFY5JKRb9xPkWSE8')) {
                  label = 'Formulario: Registrar Proyecto (XIX Casa Abierta)';
                } else if (part.length > 35) {
                  label = part.replace(/^https?:\/\//, '').slice(0, 32) + '...';
                }

                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors mx-0.5 text-[0.95em] underline underline-offset-2"
                  >
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                );
              }
              return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
}
