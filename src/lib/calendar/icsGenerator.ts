// icsGenerator.ts - Utilitário de Geração de Arquivos .ics para Calendário

export interface IcsOptions {
  title: string;
  description: string;
  location?: string;
  filename?: string;
  startDate?: Date;
  durationMinutes?: number;
}

function formatDateToICS(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

export function downloadIcs(options: IcsOptions): void {
  const now = new Date();
  const start = options.startDate || new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const duration = options.durationMinutes || 45;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const uid = `cagp-${Date.now()}@cagp-ufmg.github.io`;
  const filename = `${options.filename || 'lembrete-cagp'}.ics`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAGP FAFICH UFMG//Super App Discente//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDateToICS(now)}`,
    `DTSTART:${formatDateToICS(start)}`,
    `DTEND:${formatDateToICS(end)}`,
    `SUMMARY:${options.title}`,
    `DESCRIPTION:${options.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${options.location || 'FAFICH / UFMG - Campus Pampulha'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete CAGP UFMG',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPresetIcs(preset: 'ru-1815' | 'circular-2230' | 'secretaria-f2039'): void {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (preset === 'ru-1815') {
    tomorrow.setHours(18, 15, 0, 0);
    downloadIcs({
      title: 'Jantar no RU II Setorial (18h15) — Horário Noturno',
      description: 'Lembrete do CAGP: jante antes do horário de pico. As catracas do Restaurante Universitário II Setorial encerram o atendimento impreterivelmente às 19h30.',
      location: 'RU II Setorial — Campus Pampulha UFMG',
      filename: 'alarme-ru2-1815',
      startDate: tomorrow,
      durationMinutes: 45,
    });
  } else if (preset === 'circular-2230') {
    tomorrow.setHours(22, 30, 0, 0);
    downloadIcs({
      title: 'Últimos Circulares Noturnos FAFICH (22h30)',
      description: 'Lembrete do CAGP: dirija-se aos pontos da FAFICH/Reitoria. As últimas viagens das linhas circulares gratuitas da UFMG partem até as 22h45.',
      location: 'Ponto de Ônibus FAFICH / Reitoria UFMG',
      filename: 'alarme-circular-2230',
      startDate: tomorrow,
      durationMinutes: 20,
    });
  } else if (preset === 'secretaria-f2039') {
    tomorrow.setHours(16, 30, 0, 0);
    downloadIcs({
      title: 'Plantão Presencial Secretaria Gestão Pública (Sala F-2039)',
      description: 'Atendimento presencial com Norma Guedes na Secretaria do Curso (Sala F-2039) terças (16h30–19h30) e seg/qua no CEAG FAFICH (16h00–22h00). Contato: coordgestaopublica@gmail.com.',
      location: 'Sala F-2039 FAFICH / CEAG Sala F-2033',
      filename: 'agenda-secretaria-f2039',
      startDate: tomorrow,
      durationMinutes: 60,
    });
  }
}
