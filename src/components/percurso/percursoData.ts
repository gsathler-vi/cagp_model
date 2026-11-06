// percursoData.ts - Dados canônicos do Termômetro Vocacional e Árvore de Decisão
export interface QuizOption {
  track: '01-01' | '01-02' | '01-03';
  icon: string;
  title: string;
  desc: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Pergunta 1 de 3 • Vocação & Carreira',
    question: 'O que mais atrai você após a conclusão da graduação?',
    options: [
      {
        track: '01-01',
        icon: 'bi-bank',
        title: 'Concurso / Gestão Geral',
        desc: 'Atuar em ministérios, secretarias de estado ou prefeituras na coordenação ampla de políticas governamentais.',
      },
      {
        track: '01-02',
        icon: 'bi-diagram-3',
        title: 'Interdisciplinaridade / 3º Setor',
        desc: 'Cruzar gestão pública com Meio Ambiente, Direitos Humanos, Direito ou outras faculdades da UFMG.',
      },
      {
        track: '01-03',
        icon: 'bi-mortarboard',
        title: 'Mestrado / Carreira Acadêmica',
        desc: 'Ingressar no PPGCP/FAFICH, focar em pesquisa científica e seguir para pós-graduação stricto sensu.',
      },
    ],
  },
  {
    id: 2,
    category: 'Pergunta 2 de 3 • Matriz Curricular',
    question: 'Como você prefere preencher suas horas flexíveis da graduação?',
    options: [
      {
        track: '01-01',
        icon: 'bi-collection',
        title: 'Máxima Liberdade de Escolha',
        desc: 'Optativas livres no DCP, projetos de extensão da FAFICH e horas complementares (AAC) com autonomia.',
      },
      {
        track: '01-02',
        icon: 'bi-intersect',
        title: 'Bloco de 300h em Outra Área',
        desc: 'Formação Transversal (300h) ou pacote de disciplinas em outro curso (Formação Complementar Aberta - FCA).',
      },
      {
        track: '01-03',
        icon: 'bi-journal-code',
        title: 'Matérias da Pós-Graduação',
        desc: 'Cursar disciplinas avançadas do Mestrado em Ciência Política (PPGCP/DCP) aproveitáveis no mestrado.',
      },
    ],
  },
  {
    id: 3,
    category: 'Pergunta 3 de 3 • Momento Acadêmico',
    question: 'Em qual etapa do curso você se encontra atualmente?',
    options: [
      {
        track: '01-01',
        icon: 'bi-backpack',
        title: 'Início de Curso (1º ao 4ºP)',
        desc: 'Semestres fundamentais do ciclo obrigatório. O percurso canônico geral é o seu vínculo automático.',
      },
      {
        track: '01-02',
        icon: 'bi-compass',
        title: 'Meio de Curso (5º ao 7ºP)',
        desc: 'Momento ideal para planejar a migração curricular formal para FCA ou Formação Transversal no Colegiado.',
      },
      {
        track: '01-03',
        icon: 'bi-mortarboard-fill',
        title: 'Reta Final / Formando (7º ao 10ºP)',
        desc: 'Foco em articulação com PPGCP, estágio supervisionado e elaboração de monografia TCC.',
      },
    ],
  },
];

export interface TrackDetail {
  name: string;
  desc: string;
  pdf: string;
  badge: string;
  badgeClass: string;
}

export const TRACK_DETAILS: Record<string, TrackDetail> = {
  '01-01': {
    name: 'Percurso 01-01 • Núcleo Específico e Geral',
    desc: 'O Percurso 01-01 confere máxima autonomia para escolher matérias no DCP, validar até 300h de AAC e cumprir os 300h de extensão com ampla flexibilidade.',
    pdf: '/documentos/percurso-bacharelado-nucleo-geral.pdf',
    badge: 'Vínculo Automático no 1º Período',
    badgeClass: 'text-[#15803D] bg-[#15803D]/10 border-[#15803D]',
  },
  '01-02': {
    name: 'Percurso 01-02 • Núcleo Complementar (Transversal / Aberta)',
    desc: 'O Percurso 01-02 permite dedicar 300h a Formações Transversais (Direitos Humanos, Relações Étnico-Raciais) ou Formação Aberta (FCA), reduzindo as optativas do DCP para 720h.',
    pdf: '/documentos/percurso-bacharelado-nucleo-complementar.pdf',
    badge: 'Requerimento a partir do 5º Período',
    badgeClass: 'text-[#8B1E2D] bg-[#8B1E2D]/10 border-[#8B1E2D]',
  },
  '01-03': {
    name: 'Percurso 01-03 • Núcleo Avançado (Articulação PPGCP)',
    desc: 'O Percurso 01-03 destina-se a discentes com vocação para pesquisa acadêmica, permitindo cursar disciplinas de mestrado/doutorado no PPGCP/FAFICH com creditação futura.',
    pdf: '/documentos/percurso-bacharelado-nucleo-avancado.pdf',
    badge: 'Requerimento a partir do 7º Período',
    badgeClass: 'text-blue-700 bg-blue-100 border-blue-400',
  },
};
