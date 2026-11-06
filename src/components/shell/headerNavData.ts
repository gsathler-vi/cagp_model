// headerNavData.ts - Estrutura de Rotas e Navegação Canônica dos 5 Eixos para Desktop & Drawer

export interface HeaderNavItem {
  label: string;
  shortLabel?: string;
  href: string;
  icon: string;
  children?: {
    label: string;
    desc: string;
    href: string;
    icon: string;
  }[];
}

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    label: 'Início',
    shortLabel: 'Início',
    href: '/',
    icon: 'bi-compass',
  },
  {
    label: 'Curso & Pesquisa',
    shortLabel: 'Curso',
    href: '/curso',
    icon: 'bi-mortarboard',
    children: [
      { label: 'O Curso de Gestão Pública', desc: 'História, Colegiado e Secretaria F-2039', href: '/curso', icon: 'bi-mortarboard' },
      { label: 'Guia do Calouro (Noturno)', desc: 'Checklist 30 dias, RU II, Circulares e FUMP', href: '/calouros', icon: 'bi-backpack' },
      { label: 'Pesquisa, IC & 11 Núcleos', desc: 'Bolsas PIBIC, Imersão e até 90h de AAC', href: '/pesquisa', icon: 'bi-journal-bookmark' },
    ],
  },
  {
    label: 'Currículo & Horas',
    shortLabel: 'Currículo',
    href: '/percurso',
    icon: 'bi-diagram-3',
    children: [
      { label: 'Central Curricular & Grafo 10P', desc: 'Mapa dos 10 semestres, 27 obrigatórias e Minha Grade', href: '/percurso', icon: 'bi-diagram-3' },
      { label: 'Catálogo de 68 Optativas', desc: 'Busca por departamento e Formação Livre (120h)', href: '/percurso#optativas', icon: 'bi-collection' },
      { label: 'Extensão & Horas AAC (600h)', desc: 'Calculadora 600h, Guardião 120 dias e N-20229', href: '/acg', icon: 'bi-calculator' },
      { label: 'Estágio Supervisionado (300h)', desc: 'DCP 135/136, simulador do Art. 41 e TCE', href: '/estagio', icon: 'bi-briefcase' },
      { label: 'Trabalho de Conclusão (TCC)', desc: 'DCP 089/137 (180h), 4 modalidades e Termo de Aceite', href: '/tcc', icon: 'bi-mortarboard-fill' },
    ],
  },
  {
    label: 'Acervo & Ajuda',
    shortLabel: 'Acervo',
    href: '/documentos',
    icon: 'bi-folder2-open',
    children: [
      { label: 'Documentos & Formulários', desc: 'PPC 2020, Regulamento N-20229 e requerimentos', href: '/documentos', icon: 'bi-file-earmark-pdf' },
      { label: 'Dúvidas Frequentes (FAQ)', desc: 'Respostas rápidas e orientações regimentais', href: '/faq', icon: 'bi-question-circle' },
    ],
  },
  {
    label: 'O CAGP',
    shortLabel: 'O CAGP',
    href: '/sobre',
    icon: 'bi-people',
    children: [
      { label: 'O Centro Acadêmico', desc: 'Os Candangos, princípios e instâncias', href: '/sobre', icon: 'bi-bank' },
      { label: 'Processo Eleitoral & Diretorias', desc: 'Organograma regimental, diretorias e transição eleitoral', href: '/gestao', icon: 'bi-people' },
    ],
  },
];
