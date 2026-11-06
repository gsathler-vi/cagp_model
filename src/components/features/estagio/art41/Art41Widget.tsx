// src/components/features/estagio/art41/Art41Widget.tsx — Widget de Resumo da Dispensa Art. 41
import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../../../lib/storage/studentVault';

const CRITERIA_IDS = ['crit_vinculo', 'crit_matricula', 'crit_fase1', 'crit_horas', 'crit_fase2'];

export const Art41Widget: React.FC = () => {
  const [checks, setChecks] = useState<VaultData<'cagp_art41_checklist_v1'>>({});

  useEffect(() => {
    const load = () => {
      setChecks(getVaultItem('cagp_art41_checklist_v1') || {});
    };
    load();
    const handleUpdate = () => load();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cagp-vault-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cagp-vault-updated', handleUpdate);
    };
  }, []);

  const checkedCount = CRITERIA_IDS.filter((id) => checks[id]).length;
  const isEligible = checkedCount === 5;

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#8B1E2D]/10 text-[#8B1E2D] flex items-center justify-center text-lg border border-[#8B1E2D]/20">
              <i className="bi bi-briefcase-fill" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Dispensa Art. 41
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Servidores & Setor Público</span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold ${
              isEligible
                ? 'bg-[#15803D] text-white'
                : checkedCount > 0
                ? 'bg-[#B45309] text-white'
                : 'bg-gray-100 text-gray-700 border border-[#DFDBD2]'
            }`}
          >
            {isEligible ? 'Elegível' : `${checkedCount}/5 Critérios`}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Simulador oficial para aproveitamento de atuação profissional no setor público para dispensa das 300h de estágio.
        </p>

        <div className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg mb-3 flex items-center justify-between text-xs">
          <span className="text-gray-600">Status da Simulação:</span>
          <span className="font-mono font-bold text-[#0A0A0A]">
            {isEligible ? 'Dispensa Apta (300h)' : `${checkedCount} requisitos marcados`}
          </span>
        </div>
      </div>

      <a
        href="#art41"
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Simulador Art. 41</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
