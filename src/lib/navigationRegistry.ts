// src/lib/navigationRegistry.ts — Registro Central de Navegação, Eixos e Micro-Apps (Super App CAGP UFMG)
import { route } from './paths';

export type AxisId = 'hoje' | 'curso' | 'curriculo' | 'acervo' | 'cagp';
export type FeatureType = 'hub' | 'overview' | 'page' | 'tool' | 'guide' | 'catalog';

export interface NavigationItem {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  icon: string;
  description: string;
  type: FeatureType;
  isOverview?: boolean;
  badge?: string;
  match: string[];
}

export interface AxisOverviewHighlight {
  id: string;
  title: string;
  desc: string;
  icon: string;
  href: string;
  actionLabel: string;
  statKey?: string;
}

export interface AxisConfig {
  id: AxisId;
  number: number;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  rootHref: string;
  items: NavigationItem[];
  overviewHighlights: AxisOverviewHighlight[];
}

export const AXIS_REGISTRY: AxisConfig[] = [
  {
    id: 'hoje',
    number: 1,
    name: 'Hoje',
    tagline: 'Rotina do Campus, RU & Bússola Discente',
    icon: 'bi-compass',
    color: '#8B1E2D',
    rootHref: route('/'),
    items: [
      {
        id: 'hoje-overview',
        label: 'Visão Geral',
        shortLabel: 'Hoje',
        href: route('/'),
        icon: 'bi-compass',
        description: 'Bússola discente, avisos em tempo real e status do campus.',
        type: 'overview',
        isOverview: true,
        match: ['^/$', '^/index\\.html$'],
      },
      {
        id: 'hoje-calouros',
        label: 'Guia do Calouro',
        shortLabel: 'Calouros',
        href: route('/calouros'),
        icon: 'bi-backpack',
        description: 'Checklist de 30 dias e guia de sobrevivência na FAFICH.',
        type: 'guide',
        match: [],
      },
      {
        id: 'hoje-campus',
        label: 'RU & Circular',
        shortLabel: 'Campus',
        href: route('/') + '#campus',
        icon: 'bi-clock-history',
        description: 'Horários do RU II Setorial e linhas do Circular Noturno.',
        type: 'tool',
        match: [],
      },
      {
        id: 'hoje-passaporte',
        label: 'Passaporte',
        shortLabel: 'Passaporte',
        href: route('/') + '#passaporte',
        icon: 'bi-person-badge',
        description: 'Identidade estudantil e anel de integralização local.',
        type: 'tool',
        match: [],
      },
    ],
    overviewHighlights: [
      {
        id: 'hl-passaporte',
        title: 'Passaporte Discente',
        desc: 'Seu progresso acadêmico salvo 100% no cofre local seguro.',
        icon: 'bi-person-badge',
        href: route('/') + '#passaporte',
        actionLabel: 'Abrir Passaporte',
      },
      {
        id: 'hl-campus',
        title: 'Campus no Agora',
        desc: 'Cardápios e horários do RU II Setorial e Circular Noturno da UFMG.',
        icon: 'bi-clock-history',
        href: route('/') + '#campus',
        actionLabel: 'Ver Horários',
      },
    ],
  },
  {
    id: 'curso',
    number: 2,
    name: 'Curso',
    tagline: 'Colegiado DCP, PPC 2020 e Regulamento do Curso',
    icon: 'bi-mortarboard',
    color: '#005A9C',
    rootHref: route('/curso'),
    items: [
      {
        id: 'curso-overview',
        label: 'Visão Geral',
        shortLabel: 'Curso',
        href: route('/curso'),
        icon: 'bi-mortarboard',
        description: 'Sumário executivo do curso, Colegiado DCP e matriz acadêmica.',
        type: 'overview',
        isOverview: true,
        match: ['^/curso$', '^/curso/$', '^/curso/index\\.html$'],
      },
      {
        id: 'curso-calouros',
        label: 'Guia do Calouro',
        shortLabel: 'Calouros',
        href: route('/calouros'),
        icon: 'bi-backpack',
        description: 'Checklist interativo de 30 dias e acolhimento na FAFICH.',
        type: 'guide',
        match: ['^/calouros'],
      },
      {
        id: 'curso-pesquisa',
        label: 'Pesquisa & Grupos',
        shortLabel: 'Pesquisa',
        href: route('/pesquisa'),
        icon: 'bi-journal-bookmark',
        description: 'Laboratórios, 11 núcleos do DCP e oportunidades de iniciação científica.',
        type: 'page',
        match: ['^/pesquisa'],
      },
    ],
    overviewHighlights: [
      {
        id: 'hl-calouro',
        title: 'Checklist do Calouro',
        desc: 'Tarefas essenciais dos primeiros 30 dias na UFMG.',
        icon: 'bi-backpack',
        href: route('/calouros'),
        actionLabel: 'Abrir Guia do Calouro',
        statKey: 'cagp_calouro_checklist_v1',
      },
      {
        id: 'hl-secretaria',
        title: 'Colegiado Sala F-2039',
        desc: 'Atendimento presencial com Norma Guedes e coordgestaopublica@gmail.com.',
        icon: 'bi-geo-alt',
        href: route('/curso') + '#colegiado',
        actionLabel: 'Ver Contatos',
      },
      {
        id: 'hl-pesquisa',
        title: 'Pesquisa & 11 Núcleos',
        desc: 'Bolsas PIBIC e iniciação científica no Departamento de Ciência Política.',
        icon: 'bi-journal-bookmark',
        href: route('/pesquisa'),
        actionLabel: 'Ver Oportunidades',
      },
    ],
  },
  {
    id: 'curriculo',
    number: 3,
    name: 'Currículo',
    tagline: 'Grade 10P, Grafo Interativo, 600h ACG, Estágio e TCC',
    icon: 'bi-diagram-3',
    color: '#15803D',
    rootHref: route('/percurso'),
    items: [
      {
        id: 'curriculo-overview',
        label: 'Visão Geral',
        shortLabel: 'Grafo 10P',
        href: route('/percurso'),
        icon: 'bi-diagram-3',
        description: 'Central Curricular com Grafo Vivo dos 10 períodos e 27 obrigatórias.',
        type: 'overview',
        isOverview: true,
        match: ['^/percurso', '^/optativas'],
      },
      {
        id: 'curriculo-acg',
        label: 'Horas 600h & ACG',
        shortLabel: 'Calc 600h',
        href: route('/acg'),
        icon: 'bi-calculator',
        description: 'Calculadora de 300h de Extensão e 300h de AAC com Guardião 120 dias.',
        type: 'tool',
        match: ['^/acg'],
      },
      {
        id: 'curriculo-estagio',
        label: 'Estágio Supervisionado',
        shortLabel: 'Estágio (300h)',
        href: route('/estagio'),
        icon: 'bi-briefcase',
        description: 'Simulador do Art. 41 para servidores e regras de DCP 135/136.',
        type: 'tool',
        match: ['^/estagio', '^/estagio-tcc'],
      },
      {
        id: 'curriculo-tcc',
        label: 'TCC & Monografia',
        shortLabel: 'TCC (180h)',
        href: route('/tcc'),
        icon: 'bi-journal-check',
        description: 'As 4 modalidades do Art. 19, termo de aceite e cronograma de bancas.',
        type: 'guide',
        match: ['^/tcc'],
      },
    ],
    overviewHighlights: [
      {
        id: 'hl-grafo',
        title: 'Grafo Dinâmico 10P',
        desc: 'Simule sua matrícula com travas formais do SIGA e adicione matérias optativas.',
        icon: 'bi-diagram-3',
        href: route('/percurso') + '#grafo',
        actionLabel: 'Abrir Grafo',
      },
      {
        id: 'hl-calc',
        title: 'Calculadora 600h',
        desc: 'Simule sua integralização de Extensão (300h) e AAC (300h).',
        icon: 'bi-calculator',
        href: route('/acg') + '#calculadora',
        actionLabel: 'Calcular Horas',
        statKey: 'cagp_calc_ext_aac_v1',
      },
      {
        id: 'hl-art41',
        title: 'Dispensa de Estágio (Art. 41)',
        desc: 'Verifique se seu trabalho na gestão pública dispensa Estágio A e B.',
        icon: 'bi-briefcase',
        href: route('/estagio') + '#art41',
        actionLabel: 'Simular Art. 41',
        statKey: 'cagp_art41_checklist_v1',
      },
      {
        id: 'hl-tcc',
        title: 'Modalidades de TCC (Art. 19)',
        desc: 'Monografia, artigo científico, plano de intervenção ou estudo de caso.',
        icon: 'bi-journal-check',
        href: route('/tcc') + '#modalidades',
        actionLabel: 'Ver Modalidades',
      },
    ],
  },
  {
    id: 'acervo',
    number: 4,
    name: 'Acervo',
    tagline: 'Repositório de Documentos Oficiais, FAQ e Transcrições',
    icon: 'bi-folder2-open',
    color: '#B45309',
    rootHref: route('/documentos'),
    items: [
      {
        id: 'acervo-overview',
        label: 'Visão Geral',
        shortLabel: 'Acervo',
        href: route('/documentos'),
        icon: 'bi-folder2-open',
        description: 'Atos normativos, resoluções, requerimentos e formulários para download.',
        type: 'overview',
        isOverview: true,
        match: ['^/documentos'],
      },
      {
        id: 'acervo-faq',
        label: 'Dúvidas & FAQ',
        shortLabel: 'FAQ',
        href: route('/faq'),
        icon: 'bi-question-circle',
        description: 'Respostas oficiais sobre procedimentos acadêmicos e acessibilidade NAI.',
        type: 'guide',
        match: ['^/faq', '^/mapa-do-site'],
      },
    ],
    overviewHighlights: [
      {
        id: 'hl-atos',
        title: 'Atos & Regulamento N-20229',
        desc: 'PPC 2020 e normas canônicas com a carga de 3.000 horas do curso.',
        icon: 'bi-file-earmark-pdf',
        href: route('/documentos') + '#atos',
        actionLabel: 'Ver Normas',
      },
      {
        id: 'hl-formularios',
        title: 'Formulários & Requerimentos',
        desc: 'Minutas oficiais em PDF para aproveitamento de estudos e estágio.',
        icon: 'bi-journal-check',
        href: route('/documentos') + '#formularios',
        actionLabel: 'Baixar Modelos',
      },
      {
        id: 'hl-faq',
        title: 'Perguntas Frequentes',
        desc: 'Respostas rápidas sobre matrícula, aproveitamento de estudos e trancamento.',
        icon: 'bi-question-circle',
        href: route('/faq'),
        actionLabel: 'Buscar Dúvida',
      },
    ],
  },
  {
    id: 'cagp',
    number: 5,
    name: 'O CAGP',
    tagline: 'Representação Estudantil, Estatuto e Diretorias do CAGP',
    icon: 'bi-people',
    color: '#0A0A0A',
    rootHref: route('/sobre'),
    items: [
      {
        id: 'cagp-overview',
        label: 'Visão Geral',
        shortLabel: 'O CAGP',
        href: route('/sobre'),
        icon: 'bi-bank',
        description: 'História do CAGP, monumento Os Candangos e princípios republicanos.',
        type: 'overview',
        isOverview: true,
        match: ['^/sobre'],
      },
      {
        id: 'cagp-gestao',
        label: 'Processo Eleitoral & Diretorias',
        shortLabel: 'Diretorias',
        href: route('/gestao'),
        icon: 'bi-people',
        description: 'Diretorias executivas, 7 pastas regimentais e processo eleitoral.',
        type: 'page',
        match: ['^/gestao'],
      },
    ],
    overviewHighlights: [
      {
        id: 'hl-estatuto',
        title: 'Estatuto de 14/10/2024',
        desc: 'Conheça a carta fundamental da entidade e os direitos discentes.',
        icon: 'bi-shield-check',
        href: route('/sobre') + '#governanca',
        actionLabel: 'Ler Estatuto',
      },
      {
        id: 'hl-gestao',
        title: 'Diretoria Executiva',
        desc: 'Quadros das 7 diretorias e canais diretos de atendimento.',
        icon: 'bi-people',
        href: route('/gestao') + '#equipe',
        actionLabel: 'Conhecer Gestão',
      },
      {
        id: 'hl-contas',
        title: 'Prestação de Contas',
        desc: 'Relatórios de execução e transparência financeira do CAGP.',
        icon: 'bi-cash-coin',
        href: route('/gestao') + '#contas',
        actionLabel: 'Ver Contas',
      },
    ],
  },
];

/**
 * Normaliza pathname removendo o base path do GitHub Pages para conferência de rotas.
 */
export function normalizePathname(pathname: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  let clean = pathname;
  if (base && clean.startsWith(base)) {
    clean = clean.slice(base.length);
  }
  clean = clean.replace(/\/index\.html$/, '');
  if (!clean.startsWith('/')) clean = `/${clean}`;
  return clean || '/';
}

/**
 * Retorna o eixo correspondente a um ID canônico.
 */
export function getAxisById(id: AxisId): AxisConfig | undefined {
  return AXIS_REGISTRY.find((axis) => axis.id === id);
}

/**
 * Retorna o eixo correspondente a uma URL/pathname do site.
 */
export function getAxisByPath(pathname: string): AxisConfig | undefined {
  const clean = normalizePathname(pathname);

  // Eixo 1: Home
  if (clean === '/' || clean === '/index.html') {
    return AXIS_REGISTRY[0];
  }

  // Tenta encontrar por regex de correspondência nos itens
  for (const axis of AXIS_REGISTRY) {
    for (const item of axis.items) {
      if (item.match && item.match.length > 0) {
        for (const pattern of item.match) {
          if (new RegExp(pattern).test(clean)) {
            return axis;
          }
        }
      }
    }
  }

  // Fallback baseado no primeiro segmento da URL
  if (clean.startsWith('/curso')) return AXIS_REGISTRY[1];
  if (clean.startsWith('/calouros') || clean.startsWith('/pesquisa')) return AXIS_REGISTRY[1];
  if (clean.startsWith('/percurso') || clean.startsWith('/acg') || clean.startsWith('/estagio') || clean.startsWith('/tcc') || clean.startsWith('/optativas')) {
    return AXIS_REGISTRY[2];
  }
  if (clean.startsWith('/documentos') || clean.startsWith('/faq') || clean.startsWith('/mapa-do-site')) {
    return AXIS_REGISTRY[3];
  }
  if (clean.startsWith('/sobre') || clean.startsWith('/gestao')) {
    return AXIS_REGISTRY[4];
  }

  return undefined;
}

/**
 * Retorna o ID do item ativo dentro de um eixo para o pathname fornecido.
 */
export function getActiveItemId(axis: AxisConfig, pathname: string, hash: string = ''): string {
  const clean = normalizePathname(pathname);

  // Se houver hash específico que coincida com algum item
  if (hash) {
    const hashItem = axis.items.find((item) => item.href.includes(hash));
    if (hashItem) return hashItem.id;
  }

  // Confere primeiro por correspondência exata de rota
  for (const item of axis.items) {
    if (item.match && item.match.length > 0) {
      for (const pattern of item.match) {
        if (new RegExp(pattern).test(clean)) {
          return item.id;
        }
      }
    }
  }

  // Fallback: primeiro item do eixo (Visão Geral)
  return axis.items[0]?.id || '';
}

/**
 * Retorna todos os 5 Eixos.
 */
export function getAllAxes(): AxisConfig[] {
  return AXIS_REGISTRY;
}
