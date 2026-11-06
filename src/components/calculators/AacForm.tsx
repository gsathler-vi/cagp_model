import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';

export const AAC_FIELDS = [
  {
    key: 'aac_pesquisa_inter',
    label: 'Atividades Interinstitucionais de Pesquisa A e B',
    code: 'DCP xxx',
    max: 75,
    cred: 'Até 5 créditos',
    desc: 'Pesquisa realizada em outras instituições com relatório assinado e avaliação de desempenho',
    icon: 'bi-globe',
  },
  {
    key: 'aac_monitoria',
    label: 'Monitoria de Graduação em Gestão Pública',
    code: 'DCP xxx',
    max: 45,
    cred: '3 créditos',
    desc: 'Atividade de monitoria no DCP ou áreas afins com relatório final avaliado pelo docente',
    icon: 'bi-person-video3',
  },
  {
    key: 'aac_eventos_i',
    label: 'Participação em Eventos I — Ouvinte (120 dias)',
    code: 'DCP 121',
    max: 60,
    cred: 'Até 4 créditos',
    desc: 'Congressos e seminários como ouvinte (1 crédito = 15h). Prazo decadencial fatal de 120 dias!',
    icon: 'bi-calendar2-week-fill',
    fatal: true,
  },
  {
    key: 'aac_grupos_estudo',
    label: 'Participação em Grupos de Estudo',
    code: 'DCP xxx',
    max: 30,
    cred: '2 créditos',
    desc: 'Grupos de pesquisa e estudos temáticos cadastrados com relatório e parecer docente',
    icon: 'bi-people-fill',
  },
  {
    key: 'aac_pesquisa_ufmg',
    label: 'Atividades de Pesquisa na UFMG (IC / PRPq)',
    code: 'DCP xxx',
    max: 90,
    cred: 'Até 6 créditos',
    desc: 'Iniciação científica voluntária ou bolsista (PIBIC/PRPq) desenvolvida no âmbito da UFMG',
    icon: 'bi-search',
  },
  {
    key: 'aac_pesquisa_bib',
    label: 'Pesquisa Bibliográfica Orientada',
    code: 'DCP xxx',
    max: 30,
    cred: '2 créditos',
    desc: 'Aprofundamento teórico em tema do curso com texto científico sob orientação docente (distinto do TCC)',
    icon: 'bi-book-fill',
  },
  {
    key: 'aac_anais',
    label: 'Trabalho Apresentado / Publicado em Anais (120 dias)',
    code: 'DCP xxx',
    max: 30,
    cred: '2 créditos',
    desc: 'Apresentação de comunicação oral ou pôster em evento científico da área. Prazo fatal de 120 dias!',
    icon: 'bi-file-earmark-ruled-fill',
    fatal: true,
  },
  {
    key: 'aac_periodico',
    label: 'Trabalho Publicado em Periódico Científico',
    code: 'DCP xxx',
    max: 60,
    cred: '4 créditos',
    desc: 'Publicação de artigo ou correspondência de aceite em revista acadêmica reconhecida (Qualis/CAPES)',
    icon: 'bi-file-earmark-richtext-fill',
  },
  {
    key: 'aac_vivencia',
    label: 'Vivência Profissional Complementar (Estágio Não Obrigatório)',
    code: 'DCP xxx',
    max: 60,
    cred: '4 créditos',
    desc: 'Treinamento prático em órgãos públicos ou terceiro setor com relatório e avaliação da chefia',
    icon: 'bi-briefcase-fill',
  },
] as const;

export const AacForm: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calc_ext_aac_v1'>>({});

  useEffect(() => {
    const raw = getVaultItem('cagp_calc_ext_aac_v1');
    const migrated = { ...raw };
    // Migrações transparentes
    if (migrated['aac_ic'] && !migrated['aac_pesquisa_ufmg']) {
      migrated['aac_pesquisa_ufmg'] = Math.min(90, migrated['aac_ic']);
    }
    if (migrated['aac_eventos'] && !migrated['aac_eventos_i']) {
      migrated['aac_eventos_i'] = Math.min(60, migrated['aac_eventos']);
    }
    if (migrated['aac_publicacoes'] && !migrated['aac_periodico']) {
      migrated['aac_periodico'] = Math.min(60, migrated['aac_publicacoes']);
    }
    if (migrated['aac_monitoria'] && migrated['aac_monitoria'] > 45) {
      migrated['aac_monitoria'] = 45;
    }
    setData(migrated);
  }, []);

  const handleChange = (key: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(val, max));
    const updated = { ...data, [key]: clamped };
    setData(updated);
    setVaultItem('cagp_calc_ext_aac_v1', updated);
  };

  const totalAac = AAC_FIELDS.reduce((acc, f) => acc + (Number(data[f.key]) || 0), 0);
  const cappedAac = Math.min(300, totalAac);

  return (
    <div className="bg-[#FBF8F3] border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-2.5 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <i className="bi bi-mortarboard-fill text-[#8B1E2D] text-lg" aria-hidden="true" />
            <h3 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A]">
              2. Atividades Complementares (AAC — até 300h)
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Regulamento do Curso N-20229, Art. 15 § 4º e PPC 2020 Quadro 7. Submissão via formulário próprio no Colegiado.
          </p>
        </div>
        <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#8B1E2D] bg-[#8B1E2D]/10 px-2.5 py-1 rounded-[4px] border border-[#8B1E2D]/30">
          {cappedAac}h / 300h
        </span>
      </div>

      <div className="space-y-2.5">
        {AAC_FIELDS.map((f) => {
          const currentVal = Number(data[f.key]) || 0;
          return (
            <div
              key={f.key}
              className={`bg-white border rounded-[4px] p-2.5 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap ${
                'fatal' in f && f.fatal ? 'border-[#DC2626]/40 bg-[#FFFDFD]' : 'border-[#DFDBD2]'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <i className={`bi ${f.icon} text-base text-[#8B1E2D] mt-0.5 shrink-0`} aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-['Oswald'] text-xs uppercase font-bold text-[#0A0A0A]">
                      {f.label}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500 bg-[#F7F5F0] px-1.5 py-0.2 rounded border border-[#DFDBD2]">
                      {f.code}
                    </span>
                    <span className="font-mono text-[10px] text-[#8B1E2D] font-bold">
                      {f.cred}
                    </span>
                    {'fatal' in f && f.fatal && (
                      <span className="cagp-badge cagp-badge-red text-[10px] py-0 px-1 font-mono">
                        Prazo 120d
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <label htmlFor={`input-${f.key}`} className="sr-only">
                  Horas para {f.label}
                </label>
                <input
                  id={`input-${f.key}`}
                  name={`aac_${f.key}`}
                  type="number"
                  min="0"
                  max={f.max}
                  step="15"
                  value={currentVal || ''}
                  placeholder="0"
                  onChange={(e) => handleChange(f.key, Number(e.target.value), f.max)}
                  className="w-20 px-2 py-1.5 text-base sm:text-xs font-mono font-bold bg-[#F7F5F0] border border-[#0A0A0A] rounded-[4px] text-right focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                />
                <span className="text-xs font-mono text-gray-500 w-14 text-right">
                  / {f.max}h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
