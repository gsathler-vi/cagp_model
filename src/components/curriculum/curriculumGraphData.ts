// curriculumGraphData.ts - Topologia e Conexões das 27 Disciplinas Obrigatórias do PPC 2020

export interface CourseNodeData {
  code: string;
  name: string;
  lines: string[];
  period: number;
  dept: 'DCP' | 'ECN' | 'SOA' | 'EST';
  ch: number;
  cr: number;
  col: number;
  y: number;
  track: 'gestao' | 'politicas' | 'sociedade' | 'economia' | 'metodos' | 'pratica';
  trackLabel: string;
  desc: string;
  isFormalLock?: boolean;
  isKey?: boolean;
  formalReqs: string[];
  suggestedReqs: string[];
  formalUnlocks: string[];
  suggestedUnlocks: string[];
}

export const DISCIPLINAS_GRAFO: Record<string, CourseNodeData> = {
  // 1º Período (5 disciplinas)
  DCP124: {
    code: 'DCP 124', name: 'Gestão Pública A', lines: ['Gestão Pública A'],
    period: 1, dept: 'DCP', ch: 60, cr: 4, col: 1, y: 45,
    track: 'gestao', trackLabel: 'Gestão & Organizações',
    desc: "Gestão Pública: origens, evolução, formatos organizacionais ¿ patrimonialismo, administração burocrática, Nova Gestão Pública, governança participativa. Gestão privada e gestão pública: distinção. Relação entre gestão pública e política. Noções de controle público e accountability. Histórico da gestão pública no Brasil.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['DCP127', 'DCP037']
  },
  DCP032: {
    code: 'DCP 032', name: 'Fundamentos da Análise Política', lines: ['Fundamentos da', 'Análise Política'],
    period: 1, dept: 'DCP', ch: 60, cr: 4, col: 1, y: 155,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Política, Poder, Estado e Mercado Definição procedimental de Democracia: custos internos, riscos externos, contextos decisórios, comitês (Sartori). Democracia, autoridade e propriedade: Estado e mercado mecanismos de alocação de recursos (Przeworski). Representação, Participação Políticas: desenhos institucionais contemporâneos. Executivo, Legislativo e accoutability responsive: demandas, políticas e resultados (Arnold).",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['DCP035', 'DCP042', 'DCP037']
  },
  SOA048: {
    code: 'SOA 048', name: 'Fundamentos de Análise Sociológica', lines: ['Fundamentos de', 'Análise Sociológica'],
    period: 1, dept: 'SOA', ch: 60, cr: 4, col: 1, y: 265,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Sociedade e Indivíduo; Socialização e Interação; Papéis, Status e Classes Sociais.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['SOA607', 'DCP042']
  },
  DCP123: {
    code: 'DCP 123', name: 'Aspectos Legais da Gestão Pública A', lines: ['Aspectos Legais da', 'Gestão Pública A'],
    period: 1, dept: 'DCP', ch: 60, cr: 4, col: 1, y: 375,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Estado e Sociedade. Estado e Direito. Origem e formação do Estado Moderno. Elementos do Estado: soberania, povo, território. Cidadania Moderna. Direitos e Garantias Fundamentais. Paradigmas Constitucionais. Estado e Democracia: participação direita e representação política, sufrágio, sistema partidário e sistema eleitoral. Organização do Estado: formas e sistemas de governo. Organização dos Poderes: Executivo, Legislativo e Judiciário. Federalismo: repartição de competências.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['DCP125']
  },
  DCP033: {
    code: 'DCP 033', name: 'Metodologia', lines: ['Metodologia'],
    period: 1, dept: 'DCP', ch: 60, cr: 4, col: 1, y: 485,
    track: 'metodos', trackLabel: 'Metodologia & Métodos Quantitativos',
    desc: "Noções gerais de filosofia da ciência. Elementos básicos de metodologias qualitativa e quantitativa. Noções básicas de metodologia científica para a Gestão Pública. Elaboração de trabalhos científicos. Familiarização com indicadores relevantes para a Gestão Pública: propriedades, características e uso em políticas públicas.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['EST057', 'DCP089']
  },

  // 2º Período (5 disciplinas)
  SOA607: {
    code: 'SOA 607', name: 'Sociologia das Organizações Públicas', lines: ['Sociologia das', 'Organizações'],
    period: 2, dept: 'SOA', ch: 60, cr: 4, col: 2, y: 45,
    track: 'gestao', trackLabel: 'Gestão & Organizações',
    desc: "Burocracia, administração pública. Estado, relações sociais. Institucionalismo, utilitarismo. Burocracia, poder político. Cultura organizacional. Mudança, flexibilização organizacional.",
    formalReqs: [], suggestedReqs: ['SOA048'], formalUnlocks: [], suggestedUnlocks: []
  },
  DCP035: {
    code: 'DCP 035', name: 'Instituições Políticas Comparadas', lines: ['Instituições Políticas', 'Comparadas'],
    period: 2, dept: 'DCP', ch: 60, cr: 4, col: 2, y: 155,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Análise comparada, desempenho de instituições democráticas em países do centro e da periferia do capitalismo; instituições democráticas e diferentes condições socioeconômicas e culturais. Estudos de formas de organização de democracias liberais, organização Estado: unitarismo X federalismo; processos e poderes (executivo, legislativo); concepções sobre burocracias públicas, políticas públicas, por governos eleitos.",
    formalReqs: [], suggestedReqs: ['DCP032'], formalUnlocks: [], suggestedUnlocks: []
  },
  DCP042: {
    code: 'DCP 042', name: 'Política, Economia e Sociedade no Brasil', lines: ['Política, Econ. e Soc.', 'no Brasil'],
    period: 2, dept: 'DCP', ch: 60, cr: 4, col: 2, y: 265,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Construção nacional e construção do Estado no Brasil, desde a independência. Dinâmicas interdependentes da política, da economia e da estrutura social brasileira no último século. Etapas históricas do desenvolvimento político, econômico e social no Brasil. Os desafios das questões étnico-racial, socioambiental e de direitos humanos.",
    formalReqs: [], suggestedReqs: ['DCP032', 'SOA048'], formalUnlocks: [], suggestedUnlocks: ['DCP126']
  },
  DCP125: {
    code: 'DCP 125', name: 'Aspectos Legais da Gestão Pública B', lines: ['Aspectos Legais da', 'Gestão Pública B'],
    period: 2, dept: 'DCP', ch: 60, cr: 4, col: 2, y: 375,
    track: 'sociedade', trackLabel: 'Ciência Política & Direito',
    desc: "Estado, Governo e Administração Pública: administração pública direta e indireta, autarquias, fundações, associações e consórcios públicos, empresas estatais. Princípios básicos da Administração Pública. Administração pública e burocracia. Poderes Administrativos. Atos administrativos. Licitação e Contratos Administrativos. Serviços Públicos. Controle da Administração Pública. Improbidade Administrativa.",
    formalReqs: [], suggestedReqs: ['DCP123'], formalUnlocks: [], suggestedUnlocks: []
  },
  ECN140: {
    code: 'ECN 140', name: 'Introdução à Economia', lines: ['Introdução à', 'Economia'],
    period: 2, dept: 'ECN', ch: 60, cr: 4, col: 2, y: 485,
    track: 'economia', trackLabel: 'Economia & Finanças Públicas',
    desc: "Noções de microeconomia (oferta, demanda, equilíbrio de mercado teoria do consumidor, estruturas de mercado) noções de macroeconomia (produto, emprego e renda moeda, juros e política monetária setor externo, câmbio e balanço de pagamentos inflação e setor público estabilização e crescimento).",
    isKey: true,
    formalReqs: [], suggestedReqs: [], formalUnlocks: ['ECN044'], suggestedUnlocks: []
  },

  // 3º Período (5 disciplinas)
  DCP127: {
    code: 'DCP 127', name: 'Gestão Pública B', lines: ['Gestão Pública B'],
    period: 3, dept: 'DCP', ch: 60, cr: 4, col: 3, y: 45,
    track: 'gestao', trackLabel: 'Gestão & Organizações',
    desc: "Novas tendências e paradigmas da gestão pública contemporânea: características para a provisão de serviços e dilemas quanto à eficácia e eficiência. Temas para pensar o Brasil: ideia de governança eficiência versus equidade tipos e mecanismos de accountability, parcerias e relação público-privado, processos e instrumentos de regulação, contratualização e agencificação, gestão em redes descentralização, relações intergovenamentais, intersetorialidade, integração e transversalidade, flexibilidade versus controle, gestão de pessoas nas organizações públicas. Experiências inovadoras de gestão pública no Brasil. Outras inovações.",
    formalReqs: [], suggestedReqs: ['DCP124'], formalUnlocks: [], suggestedUnlocks: ['DCP130']
  },
  DCP037: {
    code: 'DCP 037', name: 'Análise de Políticas Públicas', lines: ['Análise de', 'Políticas Públicas'],
    period: 3, dept: 'DCP', ch: 60, cr: 4, col: 3, y: 155,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "Ciclo formação políticas públicas (agendas, deliberação, formulação, Implementação, avaliação). Ambientes institucionais, processos. Policy community, formação redes implementadores políticas públicas, dinâmica setor público. Integração, intersetorialidade, coordenação horizontal políticas.",
    formalReqs: [], suggestedReqs: ['DCP032', 'DCP124'], formalUnlocks: [], suggestedUnlocks: ['DCP131']
  },
  DCP126: {
    code: 'DCP 126', name: 'Estado e Políticas Sociais A', lines: ['Estado e Políticas', 'Sociais A'],
    period: 3, dept: 'DCP', ch: 60, cr: 4, col: 3, y: 265,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "Teorias explicativas da emergência e evolução dos sistemas de proteção social e ou dos estados de bem-estar social, a partir de análises comparadas, considerando: a relação entre Estado e mercado o conceito de política social, o estado de bem-estar e o de regime de bem-estar a evolução do conceito de cidadania e sua relação com as políticas sociais. Estudo do caso brasileiro desde as primeiras políticas sociais até o fim da ditadura militar.",
    formalReqs: [], suggestedReqs: ['DCP042'], formalUnlocks: [], suggestedUnlocks: ['DCP128']
  },
  DCP132: {
    code: 'DCP 132', name: 'Democracia Digital e Governo Eletrônico', lines: ['Democracia Digital &', 'Gov. Eletrônico'],
    period: 3, dept: 'DCP', ch: 60, cr: 4, col: 3, y: 375,
    track: 'gestao', trackLabel: 'Gestão & Organizações',
    desc: "Democracia e internet. Governo eletrônico. Participação e representação digital. Governança eletrônica. Accountability e transparência no governo eletrônico. Inclusão e exclusão digital. Avaliação de portais governamentais. Deliberação on line. Gestão estratégica da informação: democratização, participação, controle interno / externo. Lei de Acesso à Informação.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: []
  },
  ECN044: {
    code: 'ECN 044', name: 'Economia do Bem-Estar', lines: ['Economia do', 'Bem-Estar'],
    period: 3, dept: 'ECN', ch: 60, cr: 4, col: 3, y: 485,
    track: 'economia', trackLabel: 'Economia & Finanças Públicas',
    desc: "Função de Bem Estar. Equidade e Eficiência. Análise Custo-Benefício. O financiamento do Setor Público. Sistemas de Tributação. Políticas Sociais: Sistemas de Seguridade, Sistemas de Saúde e Sistemas de educação.",
    isFormalLock: true,
    formalReqs: ['ECN140'], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['DCP129']
  },

  // 4º Período (4 disciplinas)
  DCP130: {
    code: 'DCP 130', name: 'Planejamento Público', lines: ['Planejamento', 'Público'],
    period: 4, dept: 'DCP', ch: 60, cr: 4, col: 4, y: 45,
    track: 'gestao', trackLabel: 'Gestão & Organizações',
    desc: "Conceitos, tipos e metodologias de planejamento governamental. A relação entre planejamento e implementação de políticas e entre planejamento e desenvolvimento. O planejamento público no Brasil: evolução, desafios e vinculação com a gestão pública. Estudos de caso de inovações em planejamento nos diferentes níveis de governo. Prática orientada no planejamento de políticas públicas. Planejamento e PPA.",
    formalReqs: [], suggestedReqs: ['DCP127'], formalUnlocks: [], suggestedUnlocks: ['DCP133']
  },
  DCP128: {
    code: 'DCP 128', name: 'Estado e Políticas Sociais B', lines: ['Estado e Políticas', 'Sociais B'],
    period: 4, dept: 'DCP', ch: 60, cr: 4, col: 4, y: 190,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "Constituição do sistema de proteção social a partir da Constituição de 1988 em perspectiva comparada entre as políticas. Princípios, diretrizes, financiamento, gestão das principais políticas sociais em perspectiva comparada, análise do processo de descentralização com ênfase nas relações governamentais e no papel dos entes federativos. Agenda contemporânea e as transformações em curso, incluindo as relativas às questões étnico-raciais, socioambientais e de direitos humanos. Diferenças entre governos e décadas pós-1988.",
    formalReqs: [], suggestedReqs: ['DCP126'], formalUnlocks: [], suggestedUnlocks: []
  },
  DCP129: {
    code: 'DCP 129', name: 'Finanças Públicas', lines: ['Finanças', 'Públicas'],
    period: 4, dept: 'DCP', ch: 60, cr: 4, col: 4, y: 335,
    track: 'economia', trackLabel: 'Economia & Finanças Públicas',
    desc: "Introdução às finanças públicas: falhas do mercado, funções do Estado, teoria da tributação. Conceito, evolução e princípios do Orçamento Público. O processo orçamentário brasileiro: elaboração, execução e controle do Plano Plurianual- PPA da Lei de Diretrizes Orçamentárias ¿LDO e da Lei Orçamentária Anual. Federalismo fiscal no Brasil. A Lei de Responsabilidade Fiscal.",
    formalReqs: [], suggestedReqs: ['ECN044'], formalUnlocks: [], suggestedUnlocks: []
  },
  EST057: {
    code: 'EST 057', name: 'Introdução à Estatística', lines: ['Introdução à', 'Estatística'],
    period: 4, dept: 'EST', ch: 60, cr: 4, col: 4, y: 485,
    track: 'metodos', trackLabel: 'Metodologia & Métodos Quantitativos',
    desc: "Amostragem, Estatística Descritiva: tabelas e gráficos, medidas de síntese numérica. Introdução ao cálculo de probabilidade. Variáveis aleatórias discretas e contínuas. Inferência Estatística. Uso do software R.",
    formalReqs: [], suggestedReqs: ['DCP033'], formalUnlocks: [], suggestedUnlocks: ['ECN190']
  },

  // 5º Período (3 disciplinas)
  DCP133: {
    code: 'DCP 133', name: 'Formulação e Implementação de Programas e Projetos', lines: ['Formulação e Impl.', 'Programas/Projetos'],
    period: 5, dept: 'DCP', ch: 60, cr: 4, col: 5, y: 90,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "Conceituação: políticas, programas e projetos. Conceito, objetivos e tipos de projeto, elementos básicos de um projeto. Ciclo de vida e fases da elaboração de um programa / projeto: diagnóstico, estudo de viabilidade, atores, participação social, elaboração, monitoramento e prestação de contas. Metodologias para concepção, desenho, execução e avaliação de programas e projetos. Cenário da elaboração e implementação de programas e projetos: incertezas tensões, ambiguidades e conflitos. Tipos de programas e projetos e consequências para a gestão. Estratégias de implementação e fatores que afetam a implementação.",
    formalReqs: [], suggestedReqs: ['DCP130'], formalUnlocks: [], suggestedUnlocks: []
  },
  DCP131: {
    code: 'DCP 131', name: 'Avaliação de Políticas Públicas A', lines: ['Avaliação de', 'Políticas Públicas A'],
    period: 5, dept: 'DCP', ch: 60, cr: 4, col: 5, y: 265,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "O papel da avaliação no ciclo de políticas públicas e na gestão contemporânea. Relação entre objetivos políticos e critérios de avaliação. Tipos de avaliação em função do momento de realização, natureza e objetivos. Monitoramento e avaliação, e a relação entre os dois. Estratégias e desenhos de avaliação em função do objetivo da avaliação, do recorte programático e dos critérios para avaliação: pertinência, possibilidades e limites de cada tipo. Métodos e técnicas de avaliação. Elaboração de Indicadores.",
    formalReqs: [], suggestedReqs: ['DCP037'], formalUnlocks: [], suggestedUnlocks: ['DCP134']
  },
  ECN190: {
    code: 'ECN 190', name: 'Econometria I', lines: ['Econometria I'],
    period: 5, dept: 'ECN', ch: 60, cr: 4, col: 5, y: 440,
    track: 'metodos', trackLabel: 'Metodologia & Métodos Quantitativos',
    desc: "O modelo de regressão linear entre duas variáveis e regressão linear múltipla. Introdução aos modelos de equações simultâneas. Análise de problemas econométricos. Modelos econométricos. Exemplos aplicados a Econometria.",
    formalReqs: [], suggestedReqs: ['EST057'], formalUnlocks: [], suggestedUnlocks: ['DCP134']
  },

  // 6º Período (1 disciplina)
  DCP134: {
    code: 'DCP 134', name: 'Avaliação de Políticas Públicas B', lines: ['Avaliação de', 'Políticas Públicas B'],
    period: 6, dept: 'DCP', ch: 60, cr: 4, col: 6, y: 265,
    track: 'politicas', trackLabel: 'Políticas Públicas & Avaliação',
    desc: "Avaliação de políticas públicas: principais conceitos, especificidades da avaliação, tipos de avaliação, metodologia da avaliação. Linguagem dos projetos. Modelos para a avaliação de impactos. Conceitos de indicadores sociais. Aplicação de técnicas econométricas e bancos de dados na avaliação de políticas públicas. Técnicas de regressão: modelo de regressão simples análise de regressão múltipla (estimação e inferência) análise de regressão múltipla com informações qualitativas heteroscedasticidade e problemas adicionais de especificação e de dados.",
    formalReqs: [], suggestedReqs: ['DCP131', 'ECN190'], formalUnlocks: [], suggestedUnlocks: []
  },

  // 7º Período (1 disciplina)
  DCP135: {
    code: 'DCP 135', name: 'Estágio Curricular A', lines: ['Estágio Curricular A', '(180 horas)'],
    period: 7, dept: 'DCP', ch: 180, cr: 12, col: 7, y: 265,
    track: 'pratica', trackLabel: 'Prática Profissional & TCC',
    desc: "Experiência de trabalho do discente com a dimensão profissional dos diversos campos da gestão pública sob supervisão de docente e de profissional do campo.",
    formalReqs: [], suggestedReqs: [], formalUnlocks: [], suggestedUnlocks: ['DCP136']
  },

  // 8º Período (1 disciplina)
  DCP136: {
    code: 'DCP 136', name: 'Estágio Curricular B', lines: ['Estágio Curricular B', '(120 horas)'],
    period: 8, dept: 'DCP', ch: 120, cr: 8, col: 8, y: 265,
    track: 'pratica', trackLabel: 'Prática Profissional & TCC',
    desc: "Experiência de trabalho do discente com a dimensão profissional dos diversos campos da gestão pública sob supervisão de docente e de profissional do campo.",
    formalReqs: [], suggestedReqs: ['DCP135'], formalUnlocks: [], suggestedUnlocks: []
  },

  // 9º Período (1 disciplina)
  DCP089: {
    code: 'DCP 089', name: 'Projeto do TCC', lines: ['Projeto do TCC', '(60 horas)'],
    period: 9, dept: 'DCP', ch: 60, cr: 4, col: 9, y: 265,
    track: 'pratica', trackLabel: 'Prática Profissional & TCC',
    desc: "Componentes conceituais e metodológicos de uma monografia. Sistematização de etapas a serem seguidas na tradução do plano da monografia em texto escrito. Elaboração do projeto de trabalho de conclusão do curso, seguindo etapas de construção deste trabalho.",
    formalReqs: [], suggestedReqs: ['DCP033'], formalUnlocks: [], suggestedUnlocks: ['DCP137']
  },

  // 10º Período (1 disciplina)
  DCP137: {
    code: 'DCP 137', name: 'Trabalho de Conclusão de Curso', lines: ['Trabalho Conclusão', 'de Curso (120h)'],
    period: 10, dept: 'DCP', ch: 120, cr: 8, col: 10, y: 265,
    track: 'pratica', trackLabel: 'Prática Profissional & TCC',
    desc: "Trabalho monográfico, relatório de pesquisa ou projeto de intervenção feito pelo discente, a ser registrado como comprovação de sua capacitação teórico-analítica, que o torne habilitado para o exercício de funções diversas referidas à gestão pública.",
    formalReqs: [], suggestedReqs: ['DCP089'], formalUnlocks: [], suggestedUnlocks: []
  }
};

export const TRACK_NAMES: Record<string, string> = {
  all: 'Todas as Trilhas',
  gestao: 'Gestão & Organizações',
  politicas: 'Políticas Públicas & Avaliação',
  sociedade: 'Ciência Política & Direito',
  economia: 'Economia & Finanças Públicas',
  metodos: 'Metodologia & Métodos Quantitativos',
  pratica: 'Prática Profissional & TCC'
};

export const DEPT_COLORS: Record<string, string> = {
  DCP: '#8B1E2D',
  ECN: '#0A0A0A',
  SOA: '#15803D',
  EST: '#1E3F66'
};

export function getColX(col: number): number {
  return 15 + (col - 1) * 118;
}
