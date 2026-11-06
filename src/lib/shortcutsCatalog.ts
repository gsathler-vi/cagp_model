// shortcutsCatalog.ts - Catálogo Oficial de Atalhos Rápidos Discentes (Super App CAGP UFMG)
import { route } from './paths';

export interface ShortcutItem {
  id: string;
  label: string;
  fullLabel: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  category: 'Essencial' | 'Acadêmico' | 'Ferramentas' | 'Institucional';
  isAction?: boolean;
  actionEvent?: string;
  match: string[];
}

export const SHORTCUTS_CATALOG: ShortcutItem[] = [
  {
    id: 'hoje',
    label: 'Início',
    fullLabel: '1. Hoje & Campus',
    description: 'Bússola discente, status dos restaurantes e notícias do dia.',
    href: route('/'),
    icon: 'bi-compass',
    color: '#8B1E2D',
    category: 'Essencial',
    match: ['^/$', '^/index\\.html$'],
  },
  {
    id: 'calouros',
    label: 'Calouros',
    fullLabel: 'Guia do Calouro',
    description: 'Checklist interativo de 30 dias, rotina noturna e atendimento FAFICH.',
    href: route('/calouros'),
    icon: 'bi-backpack',
    color: '#15803D',
    category: 'Essencial',
    match: ['^/calouros'],
  },
  {
    id: 'passaporte',
    label: 'Passaporte',
    fullLabel: 'Passaporte Discente',
    description: 'Identidade acadêmica, anel de integralização e cofre local.',
    href: '#passaporte',
    icon: 'bi-person-badge',
    color: '#8B1E2D',
    category: 'Essencial',
    isAction: true,
    actionEvent: 'cagp:open-passport',
    match: [],
  },
  {
    id: 'campus',
    label: 'RU & Ônibus',
    fullLabel: 'Rotina do Campus (RU & Circular)',
    description: 'Horários do RU II Setorial, circular noturno e secretarias.',
    href: '#campus',
    icon: 'bi-clock-history',
    color: '#0A0A0A',
    category: 'Ferramentas',
    isAction: true,
    actionEvent: 'cagp:open-campus',
    match: [],
  },
  {
    id: 'curso',
    label: 'Curso',
    fullLabel: '2. O Curso & Colegiado',
    description: 'PPC 2020, Regulamento do Curso, Colegiado DCP e matriz.',
    href: route('/curso'),
    icon: 'bi-mortarboard',
    color: '#005A9C',
    category: 'Acadêmico',
    match: ['^/curso'],
  },
  {
    id: 'percurso',
    label: 'Grade',
    fullLabel: '3. Currículo & Grade 10P',
    description: 'Grade curricular de 10 períodos, catálogo de optativas e grafo.',
    href: route('/percurso'),
    icon: 'bi-diagram-3',
    color: '#15803D',
    category: 'Acadêmico',
    match: ['^/percurso', '^/optativas'],
  },
  {
    id: 'acg',
    label: 'Calc 600h',
    fullLabel: 'Calculadora 600h (Extensão & AAC)',
    description: 'Simulador de integralização de horas e guardião de certificados (120 dias).',
    href: route('/acg'),
    icon: 'bi-calculator',
    color: '#8B1E2D',
    category: 'Ferramentas',
    match: ['^/acg'],
  },
  {
    id: 'estagio',
    label: 'Estágio',
    fullLabel: 'Estágio Supervisionado & Art. 41',
    description: 'Normas de estágio e checklist de dispensa por atuação profissional.',
    href: route('/estagio'),
    icon: 'bi-briefcase',
    color: '#B45309',
    category: 'Ferramentas',
    match: ['^/estagio', '^/estagio-tcc'],
  },
  {
    id: 'tcc',
    label: 'TCC',
    fullLabel: 'TCC & Monografia Final',
    description: 'Orientação, comitê de ética e cronograma de defesa de TCC A e B.',
    href: route('/tcc'),
    icon: 'bi-journal-check',
    color: '#5B2E85',
    category: 'Acadêmico',
    match: ['^/tcc'],
  },
  {
    id: 'pesquisa',
    label: 'Pesquisa',
    fullLabel: 'Pesquisa & Grupos DCP',
    description: 'Projetos de iniciação científica, laboratórios e extensão.',
    href: route('/pesquisa'),
    icon: 'bi-lightbulb',
    color: '#2A6264',
    category: 'Acadêmico',
    match: ['^/pesquisa'],
  },
  {
    id: 'documentos',
    label: 'Acervo',
    fullLabel: '4. Acervo & Normas',
    description: 'Regulamentos, PPC, formulários oficiais e histórico do curso.',
    href: route('/documentos'),
    icon: 'bi-folder2-open',
    color: '#B45309',
    category: 'Institucional',
    match: ['^/documentos'],
  },
  {
    id: 'faq',
    label: 'FAQ',
    fullLabel: 'Perguntas Frequentes & Ajuda',
    description: 'Respostas para dúvidas sobre matrícula, prazos e procedimentos acadêmicos.',
    href: route('/faq'),
    icon: 'bi-question-circle',
    color: '#005A9C',
    category: 'Institucional',
    match: ['^/faq'],
  },
  {
    id: 'sobre',
    label: 'CAGP',
    fullLabel: '5. O Centro Acadêmico',
    description: 'História do CAGP, representação discente e estatuto da entidade.',
    href: route('/sobre'),
    icon: 'bi-people',
    color: '#0A0A0A',
    category: 'Institucional',
    match: ['^/sobre'],
  },
  {
    id: 'gestao',
    label: 'Gestão',
    fullLabel: 'Gestão & Transparência',
    description: 'Membros da diretoria, atas das assembleias e prestação de contas.',
    href: route('/gestao'),
    icon: 'bi-shield-check',
    color: '#2A6264',
    category: 'Institucional',
    match: ['^/gestao'],
  },
  {
    id: 'busca',
    label: 'Busca',
    fullLabel: 'Buscar no Portal (⌘K)',
    description: 'Busca rápida de disciplinas, normas, ementas e contatos.',
    href: '#busca',
    icon: 'bi-search',
    color: '#8B1E2D',
    category: 'Essencial',
    isAction: true,
    actionEvent: 'cagp:open-spotlight',
    match: [],
  },
  {
    id: 'menu',
    label: 'Menu',
    fullLabel: 'Menu Geral do Super App',
    description: 'Menu lateral completo com todas as seções e serviços.',
    href: '#menu',
    icon: 'bi-list',
    color: '#0A0A0A',
    category: 'Essencial',
    isAction: true,
    actionEvent: 'cagp:toggle-drawer',
    match: [],
  },
];

export const DEFAULT_SHORTCUT_IDS = ['hoje', 'busca', 'campus', 'percurso', 'menu'];

export function getShortcutById(id: string): ShortcutItem {
  const found = SHORTCUTS_CATALOG.find((item) => item.id === id);
  if (found) return found;
  // Fallback seguro para Início
  return SHORTCUTS_CATALOG[0];
}

export function resolveShortcuts(ids: string[]): ShortcutItem[] {
  if (!ids || ids.length === 0) {
    return DEFAULT_SHORTCUT_IDS.map(getShortcutById);
  }
  return ids.map(getShortcutById);
}
