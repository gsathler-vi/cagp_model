// src/components/features/calouros/checklist/CalouroChecklistWidget.tsx — Widget de Resumo do Checklist do Calouro
import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../../../lib/storage/studentVault';

const TOTAL_ITEMS = 10;

export const CalouroChecklistWidget: React.FC = () => {
  const [checks, setChecks] = useState<VaultData<'cagp_calouro_checklist_v1'>>({});

  useEffect(() => {
    const load = () => {
      setChecks(getVaultItem('cagp_calouro_checklist_v1') || {});
    };
    load();
    const handleUpdate = () => load();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cagp:vault-updated', handleUpdate);
    window.addEventListener('cagp-vault-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cagp:vault-updated', handleUpdate);
      window.removeEventListener('cagp-vault-updated', handleUpdate);
    };
  }, []);

  const completedCount = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((completedCount / TOTAL_ITEMS) * 100);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#8B1E2D]/10 text-[#8B1E2D] flex items-center justify-center text-lg border border-[#8B1E2D]/20">
              <i className="bi bi-check2-square" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Checklist 30 Dias
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">10 Passos Essenciais</span>
            </div>
          </div>
          {completedCount >= TOTAL_ITEMS ? (
            <span className="cagp-stamp-badge is-homologado text-[10px] py-0.5 px-2 shadow-[1.5px_1.5px_0_#B45309]">
              <i className="bi bi-patch-check-fill" aria-hidden="true" />
              <span>HOMOLOGADO</span>
            </span>
          ) : (
            <span
              className={`px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold ${
                completedCount > 0
                  ? 'bg-[#8B1E2D] text-white'
                  : 'bg-gray-100 text-gray-700 border border-[#DFDBD2]'
              }`}
            >
              {completedCount}/{TOTAL_ITEMS} Concluídos
            </span>
          )}
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Ativação de sistemas (MinhaUFMG, eduroam), emissão de carteirinha, FUMP e reconhecimento do campus.
        </p>

        {/* Barra de Progresso */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[11px] text-gray-600 font-mono">
            <span>Progresso</span>
            <span className="font-bold text-[#8B1E2D]">{pct}%</span>
          </div>
          <div className="w-full bg-[#F7F5F0] border border-[#DFDBD2] rounded h-2 overflow-hidden">
            <div
              className="bg-[#8B1E2D] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>
      </div>

      <a
        href="#checklist"
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Checklist 30d</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
