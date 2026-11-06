// talentConstants.ts - Constantes do Banco de Talentos e Marcadores de Orgulho

export interface TalentCategory {
  key: string;
  label: string;
}

export const TALENT_CATEGORIES: readonly TalentCategory[] = [
  { key: 'pol_pub', label: 'Políticas Públicas & Planejamento' },
  { key: 'orcamento', label: 'Orçamento & Finanças Públicas' },
  { key: 'gestao_pessoas', label: 'Gestão de Pessoas no Setor Público' },
  { key: 'licitacoes', label: 'Licitações, Contratos & Compras' },
  { key: 'cidades', label: 'Cidades & Políticas Urbanas' },
  { key: 'saude', label: 'Saúde Pública & Gestão do SUS' },
  { key: 'educacao', label: 'Educação Pública & Fundeb' },
  { key: 'govtech', label: 'Tecnologia Pública & GovTech' },
  { key: 'dados', label: 'Ciência de Dados & Avaliação' },
  { key: 'terceiro_setor', label: 'Terceiro Setor & MROSC' },
  { key: 'rel_inst', label: 'Relações Institucionais & Legislativo' },
  { key: 'clima', label: 'Meio Ambiente & Sustentabilidade' },
] as const;

export interface PrideOption {
  key: string;
  label: string;
}

export const PRIDE_OPTIONS: readonly PrideOption[] = [
  { key: 'none', label: 'Nenhum' },
  { key: 'lgbt', label: 'LGBTQIAPN+' },
  { key: 'trans', label: 'Trans' },
  { key: 'gay', label: 'Gay' },
  { key: 'bisexual', label: 'Bissexual' },
  { key: 'lesbian', label: 'Lésbica' },
  { key: 'nonbinary', label: 'Não-Binárie' },
  { key: 'pansexual', label: 'Pansexual' },
  { key: 'asexual', label: 'Assexual' },
] as const;

export interface AvatarPresetOption {
  id: string;
  label: string;
  bg: string;
  icon?: string;
  color: string;
  text?: string;
}

export const AVATAR_PRESETS: readonly AvatarPresetOption[] = [
  { id: 'candangos', label: 'Candangos', bg: '#9E2424', icon: 'bi-bank', color: '#E8A317' },
  { id: 'monogram', label: 'Monograma', bg: '#0A0A0A', text: 'Iniciais', color: '#E8A317' },
  { id: 'fafich', label: 'FAFICH', bg: '#005A9C', icon: 'bi-building', color: '#E8A317' },
  { id: 'republica', label: 'República', bg: '#15803D', icon: 'bi-house-heart-fill', color: '#FFFFFF' },
  { id: 'formando', label: 'Formando', bg: '#8B1E2D', icon: 'bi-mortarboard-fill', color: '#E8A317' },
  { id: 'pesquisador', label: 'Pesquisador', bg: '#0A0A0A', icon: 'bi-person-badge-fill', color: '#FFFFFF' },
  { id: 'estudante_f', label: 'Discente ♀', bg: '#2A6264', icon: 'bi-person-standing-dress', color: '#FFFFFF' },
  { id: 'estudante_m', label: 'Discente ♂', bg: '#5B2E85', icon: 'bi-person-fill', color: '#FFFFFF' },
] as const;
