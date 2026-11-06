// ics.ts - Gerador e Baixador de Eventos de Calendário iCalendar (.ics) para Agenda Discente

export interface IcsEventOptions {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  rrule?: string; // Recorrência semanal/diária se aplicável
}

export function downloadIcs(options: IcsEventOptions, filename: string = 'evento-cagp.ics'): void {
  if (typeof window === 'undefined') return;

  function formatIcsDate(d: Date): string {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const startStr = formatIcsDate(options.startDate);
  const endStr = formatIcsDate(options.endDate);
  const stampStr = formatIcsDate(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAGP FAFICH UFMG//Super App Discente//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cagp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@cagp.ufmg.br`,
    `DTSTAMP:${stampStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    options.rrule ? `RRULE:${options.rrule}` : null,
    `SUMMARY:${options.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${options.description.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    options.location ? `LOCATION:${options.location.replace(/,/g, '\\,')}` : null,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const icsContent = lines.join('\r\n');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Eventos Canônicos Pré-configurados
export function downloadRu1815Ics(): void {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 15, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 30, 0);

  downloadIcs(
    {
      title: '🍽️ Jantar no RU II Setorial (FAFICH/UFMG)',
      description: 'Lembrete diário: Chegar ao RU II Setorial antes do fechamento rigoroso das catracas às 19h30. Valor: R$ 5,60.',
      location: 'Restaurante Universitário Setorial II — Campus Pampulha UFMG',
      startDate: start,
      endDate: end,
      rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
    },
    'ru2-jantar-18h15.ics'
  );
}

export function downloadCircular2230Ics(): void {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 30, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 45, 0);

  downloadIcs(
    {
      title: '🚌 Último Circular Noturno FAFICH (UFMG)',
      description: 'Alerta para saída da sala de aula antes da última viagem do Circular Interno às 22h45 saindo da FAFICH/Praça de Serviços.',
      location: 'Ponto do Circular Noturno — FAFICH / Praça de Serviços UFMG',
      startDate: start,
      endDate: end,
      rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
    },
    'circular-noturno-22h30.ics'
  );
}

export function downloadAac120dIcs(
  certTitle: string = 'Protocolo Semestral de Certificados AAC',
  deadlineDate?: Date
): void {
  const targetDate = deadlineDate ? new Date(deadlineDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const start = new Date(targetDate);
  start.setHours(9, 0, 0, 0);
  const end = new Date(targetDate);
  end.setHours(17, 0, 0, 0);

  downloadIcs(
    {
      title: `🚨 Prazo Fatal 120 Dias AAC: ${certTitle}`,
      description: `Art. 15, § 4º do Regulamento do Curso N-20229: Prazo fatal de 120 dias corridos para protocolar o certificado no Colegiado (Sala F-2039) ou via e-mail coordgestaopublica@gmail.com.`,
      location: 'Secretaria do Colegiado Sala F-2039 (coordgestaopublica@gmail.com)',
      startDate: start,
      endDate: end,
    },
    `prazo-120d-${certTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}.ics`
  );
}
