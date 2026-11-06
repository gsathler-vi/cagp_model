export interface CourseInfo {
  code: string;
  name: string;
  period: number;
  ch: number;
  track: 'gestao' | 'politicas' | 'sociedade' | 'economia' | 'metodos' | 'pratica';
  formalPrereq?: string;
  isKey?: boolean;
}

export const MANDATORY_COURSES: CourseInfo[] = [
  // 1º Período
  { code: 'DCP 124', name: 'Gestão Pública A', period: 1, ch: 60, track: 'gestao' },
  { code: 'DCP 032', name: 'Fundamentos da Análise Política', period: 1, ch: 60, track: 'sociedade' },
  { code: 'SOA 048', name: 'Fundamentos de Análise Sociológica', period: 1, ch: 60, track: 'sociedade' },
  { code: 'DCP 123', name: 'Aspectos Legais da Gestão Pública A', period: 1, ch: 60, track: 'sociedade' },
  // 2º Período
  { code: 'DCP 033', name: 'Metodologia', period: 2, ch: 60, track: 'metodos' },
  { code: 'DCP 035', name: 'Instituições Políticas Comparadas', period: 2, ch: 60, track: 'sociedade' },
  { code: 'DCP 042', name: 'Política, Economia e Sociedade no Brasil', period: 2, ch: 60, track: 'sociedade' },
  { code: 'ECN 140', name: 'Introdução à Economia', period: 2, ch: 60, track: 'economia', isKey: true },
  { code: 'SOA 607', name: 'Sociologia das Organizações Públicas', period: 2, ch: 60, track: 'gestao' },
  // 3º Período
  { code: 'DCP 125', name: 'Aspectos Legais da Gestão Pública B', period: 3, ch: 60, track: 'sociedade' },
  { code: 'DCP 037', name: 'Análise de Políticas Públicas', period: 3, ch: 60, track: 'politicas' },
  { code: 'ECN 044', name: 'Economia do Bem Estar', period: 3, ch: 60, track: 'economia', formalPrereq: 'ECN 140' },
  { code: 'DCP 132', name: 'Democracia Digital e Governo Eletrônico', period: 3, ch: 60, track: 'gestao' },
  // 4º Período
  { code: 'DCP 127', name: 'Gestão Pública B', period: 4, ch: 60, track: 'gestao' },
  { code: 'DCP 126', name: 'Estado e Políticas Sociais A', period: 4, ch: 60, track: 'politicas' },
  // 5º Período
  { code: 'DCP 128', name: 'Estado e Políticas Sociais B', period: 5, ch: 60, track: 'politicas' },
  { code: 'DCP 129', name: 'Finanças Públicas', period: 5, ch: 60, track: 'economia' },
  { code: 'EST 057', name: 'Introdução à Estatística', period: 5, ch: 60, track: 'metodos' },
  // 6º Período
  { code: 'DCP 130', name: 'Planejamento Público', period: 6, ch: 60, track: 'gestao' },
  { code: 'ECN 190', name: 'Econometria I', period: 6, ch: 60, track: 'metodos' },
  { code: 'DCP 131', name: 'Avaliação de Políticas Públicas A', period: 6, ch: 60, track: 'politicas' },
  // 7º Período
  { code: 'DCP 133', name: 'Formulação e Implementação de Programas e Projetos', period: 7, ch: 60, track: 'politicas' },
  { code: 'DCP 134', name: 'Avaliação de Políticas Públicas B', period: 7, ch: 60, track: 'politicas' },
  // 8º Período
  { code: 'DCP 135', name: 'Estágio Curricular A', period: 8, ch: 180, track: 'pratica' },
  // 9º Período
  { code: 'DCP 136', name: 'Estágio Curricular B', period: 9, ch: 120, track: 'pratica' },
  { code: 'DCP 089', name: 'Projeto do TCC', period: 9, ch: 60, track: 'pratica' },
  // 10º Período
  { code: 'DCP 137', name: 'Trabalho de Conclusão de Curso', period: 10, ch: 120, track: 'pratica' },
];

export const TRACK_COLORS: Record<CourseInfo['track'], string> = {
  gestao: '#8B1E2D',
  politicas: '#15803D',
  sociedade: '#0A0A0A',
  economia: '#B45309',
  metodos: '#005A9C',
  pratica: '#5B2C6F',
};
