import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { route } from '../../lib/paths';

export const OverviewCalouroWidget: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calouro_checklist_v1'>>({});

  useEffect(() => {
    setData(getVaultItem('cagp_calouro_checklist_v1') || {});

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_calouro_checklist_v1') {
        setData(custom.detail.value || {});
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  const totalTasks = 12;
  const doneCount = Object.values(data).filter(Boolean).length;
  const percent = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-sm hover:border-[#0A0A0A] transition-all">
      <div>
        {/* Header do Widget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#005A9C]/10 text-[#005A9C] flex items-center justify-center text-lg border border-[#005A9C]/20">
              <i className="bi bi-backpack" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight">
                Guia do Calouro
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Primeiros 30 Dias na FAFICH</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-xs font-bold bg-[#005A9C] text-white">
            {doneCount}/{totalTasks}
          </span>
        </div>

        {/* Progresso do Calouro */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-700 leading-relaxed">
            Checklist prático: carteirinha de estudante, cadastro no RU II, acesso ao SIGA, e-mail institucional e sala da secretaria F-2039.
          </p>

          <div>
            <div className="flex justify-between text-[11px] font-mono text-gray-700 mb-1">
              <span>Etapas Concluídas</span>
              <span className="font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2 bg-[#DFDBD2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#005A9C] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            {doneCount === 0
              ? 'Comece agora marcando as tarefas já realizadas.'
              : `${doneCount} de ${totalTasks} etapas concluídas com sucesso.`}
          </p>
        </div>
      </div>

      {/* Ação Apple HIG */}
      <a
        href={route('/calouros') + '#checklist'}
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] text-white hover:bg-[#005A9C] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline mt-2 shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Guia do Calouro</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
