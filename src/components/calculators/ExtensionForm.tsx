import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';

export const EXTENSION_FIELDS = [
  {
    key: 'ext_lab_a',
    label: 'Laboratório de Gestão e Políticas Públicas A',
    code: 'DCP xxx',
    max: 90,
    cred: '6 créditos',
    desc: 'Projetos de intervenção sob a forma de diagnósticos e pesquisas com órgãos públicos e ONGs',
    icon: 'bi-flask',
  },
  {
    key: 'ext_lab_b',
    label: 'Laboratório de Gestão e Políticas Públicas B',
    code: 'DCP xxx',
    max: 90,
    cred: '6 créditos',
    desc: 'Elaboração e acompanhamento de projetos aplicados de gestão governamental',
    icon: 'bi-flask-fill',
  },
  {
    key: 'ext_ensino_inter',
    label: 'Atividades Interinstitucionais de Ensino A e B',
    code: 'DCP 176 / 177',
    max: 120,
    cred: 'Até 8 créditos',
    desc: 'Disciplinas, seminários, oficinas ou cursos de extensão em outras IES validados pelo Colegiado',
    icon: 'bi-mortarboard-fill',
  },
  {
    key: 'ext_eventos_ii',
    label: 'Participação em Eventos II (Comissão / Moderador)',
    code: 'DCP 120',
    max: 30,
    cred: '2 créditos',
    desc: 'Participação em comissão organizadora, comitê científico ou como debatedor/moderador (prazo: 120 dias)',
    icon: 'bi-calendar2-event-fill',
  },
  {
    key: 'ext_ufmg',
    label: 'Atividades de Extensão na UFMG (Projetos / Ações)',
    code: 'DCP xxx',
    max: 90,
    cred: 'Até 6 créditos',
    desc: 'Ações de extensão universitária na UFMG com relatório final e avaliação docente',
    icon: 'bi-diagram-3-fill',
  },
  {
    key: 'ext_inter_equalitas',
    label: 'Atividades Interinstitucionais de Extensão (Equalitas Jr.)',
    code: 'DCP xxx',
    max: 90,
    cred: 'Até 6 créditos',
    desc: 'Ações de extensão externas e projetos na Empresa Júnior Equalitas UFMG Consultoria Jr.',
    icon: 'bi-building-check',
  },
] as const;

export const ExtensionForm: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calc_ext_aac_v1'>>({});

  useEffect(() => {
    const raw = getVaultItem('cagp_calc_ext_aac_v1');
    // Migração transparente de chaves legadas se existirem
    const migrated = { ...raw };
    if (migrated['ext_siex_proj'] && !migrated['ext_ufmg']) {
      migrated['ext_ufmg'] = Math.min(90, migrated['ext_siex_proj']);
    }
    if (migrated['ext_eventos'] && !migrated['ext_eventos_ii']) {
      migrated['ext_eventos_ii'] = Math.min(30, migrated['ext_eventos']);
    }
    if (migrated['ext_cursos'] && !migrated['ext_ensino_inter']) {
      migrated['ext_ensino_inter'] = Math.min(120, migrated['ext_cursos']);
    }
    setData(migrated);
  }, []);

  const handleChange = (key: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(val, max));
    const updated = { ...data, [key]: clamped };
    setData(updated);
    setVaultItem('cagp_calc_ext_aac_v1', updated);
  };

  const totalExt = EXTENSION_FIELDS.reduce((acc, f) => acc + (Number(data[f.key]) || 0), 0);
  const cappedExt = Math.min(300, totalExt);

  return (
    <div className="bg-[#FBF8F3] border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-2.5 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <i className="bi bi-diagram-3-fill text-[#8B1E2D] text-lg" aria-hidden="true" />
            <h3 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A]">
              1. Extensão Obrigatória (300h)
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            PPC 2020 Quadro 8 e Regulamento N-20229 Art. 13. Exige protocolo de relatório no Colegiado.
          </p>
        </div>
        <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#8B1E2D] bg-[#8B1E2D]/10 px-2.5 py-1 rounded-[4px] border border-[#8B1E2D]/30">
          {cappedExt}h / 300h
        </span>
      </div>

      <div className="space-y-2.5">
        {EXTENSION_FIELDS.map((f) => {
          const currentVal = Number(data[f.key]) || 0;
          return (
            <div
              key={f.key}
              className="bg-white border border-[#DFDBD2] rounded-[4px] p-2.5 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
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
                  name={`ext_${f.key}`}
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
