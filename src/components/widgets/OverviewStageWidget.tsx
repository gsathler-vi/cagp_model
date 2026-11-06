import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { route } from '../../lib/paths';

export const OverviewStageWidget: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_art41_checklist_v1'>>({});

  useEffect(() => {
    setData(getVaultItem('cagp_art41_checklist_v1') || {});

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_art41_checklist_v1') {
        setData(custom.detail.value || {});
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  const totalRequired = 17;
  const checkedCount = Object.values(data).filter(Boolean).length;
  const percent = Math.round((checkedCount / totalRequired) * 100);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-sm hover:border-[#0A0A0A] transition-all">
      <div>
        {/* Header do Widget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#15803D]/10 text-[#15803D] flex items-center justify-center text-lg border border-[#15803D]/20">
              <i className="bi bi-briefcase" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight">
                Estágio & Art. 41
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">DCP 135 e DCP 136 (300h)</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-xs font-bold bg-[#15803D] text-white">
            {checkedCount}/{totalRequired}
          </span>
        </div>

        {/* Status de Elegibilidade */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-700 leading-relaxed">
            Servidores públicos e profissionais comissionados ou de ONGs podem dispensar os <strong>Estágios A e B</strong> via Art. 41 do Regulamento N-20229.
          </p>

          <div>
            <div className="flex justify-between text-[11px] font-mono text-gray-700 mb-1">
              <span>Requisitos Cumpridos</span>
              <span className="font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2 bg-[#DFDBD2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {checkedCount >= totalRequired ? (
            <div className="p-2 bg-[#DCFCE7] border border-[#15803D] rounded text-xs text-[#15803D] font-bold flex items-center gap-1.5">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>Perfil Elegível para Dispensa Total</span>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              {checkedCount === 0
                ? 'Checklist de elegibilidade ainda não preenchido.'
                : `Faltam ${totalRequired - checkedCount} critérios para atingir dispensa completa.`}
            </p>
          )}
        </div>
      </div>

      {/* Ação Apple HIG */}
      <a
        href={route('/estagio') + '#art41'}
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] text-white hover:bg-[#15803D] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline mt-2 shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Simular Dispensa Art. 41</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
