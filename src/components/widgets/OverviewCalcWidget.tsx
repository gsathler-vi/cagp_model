import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { route } from '../../lib/paths';

export const OverviewCalcWidget: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calc_ext_aac_v1'>>({});

  const calculateHours = (currentData: Record<string, number>) => {
    let extSum = 0;
    let aacSum = 0;

    for (const [key, val] of Object.entries(currentData)) {
      const num = Number(val) || 0;
      if (key.startsWith('ext_')) {
        extSum += num;
      } else if (key.startsWith('aac_')) {
        aacSum += num;
      }
    }

    const extClamped = Math.min(300, Math.max(0, extSum));
    const aacClamped = Math.min(300, Math.max(0, aacSum));
    const total = Math.min(600, extClamped + aacClamped);

    return { extClamped, aacClamped, total };
  };

  useEffect(() => {
    setData(getVaultItem('cagp_calc_ext_aac_v1') || {});

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_calc_ext_aac_v1') {
        setData(custom.detail.value || {});
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  const { extClamped, aacClamped, total } = calculateHours(data);
  const percent = Math.round((total / 600) * 100);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-sm hover:border-[#0A0A0A] transition-all">
      <div>
        {/* Header do Widget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#8B1E2D]/10 text-[#8B1E2D] flex items-center justify-center text-lg border border-[#8B1E2D]/20">
              <i className="bi bi-calculator" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight">
                Calculadora 600h
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Extensão Obrigatória & AAC</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-xs font-bold bg-[#8B1E2D] text-white">
            {percent}%
          </span>
        </div>

        {/* Resumo de Progresso */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-[11px] font-mono text-gray-700 mb-1">
              <span>Extensão Obrigatória</span>
              <span className="font-bold">{extClamped} / 300h</span>
            </div>
            <div className="w-full h-2 bg-[#DFDBD2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B1E2D] transition-all duration-300"
                style={{ width: `${Math.min(100, (extClamped / 300) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-mono text-gray-700 mb-1">
              <span>Atividades Complementares (AAC)</span>
              <span className="font-bold">{aacClamped} / 300h</span>
            </div>
            <div className="w-full h-2 bg-[#DFDBD2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${Math.min(100, (aacClamped / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {total === 0 ? (
          <p className="text-xs text-gray-500 bg-[#F7F5F0] p-2.5 rounded-lg border border-[#DFDBD2] mb-3">
            <i className="bi bi-info-circle mr-1 text-[#8B1E2D]" aria-hidden="true" />
            Nenhuma hora lançada ainda. Simule suas atividades para calcular a integralização.
          </p>
        ) : (
          <p className="text-xs text-gray-700 mb-3 font-medium">
            Total integralizado: <strong className="text-[#8B1E2D] font-mono">{total} de 600h</strong> (restam {600 - total}h).
          </p>
        )}
      </div>

      {/* Ação Apple HIG */}
      <a
        href={route('/acg') + '#calculadora'}
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] text-white hover:bg-[#8B1E2D] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline mt-2 shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Calculadora Completa</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
