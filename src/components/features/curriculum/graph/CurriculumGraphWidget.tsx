// src/components/features/curriculum/graph/CurriculumGraphWidget.tsx — Widget de Resumo do Grafo Dinâmico 10P
import React, { useState, useEffect } from 'react';
import { getVaultItem, type CustomCourse } from '../../../../lib/storage/studentVault';

export const CurriculumGraphWidget: React.FC = () => {
  const [customList, setCustomList] = useState<CustomCourse[]>([]);

  useEffect(() => {
    const load = () => {
      const raw = getVaultItem('cagp_custom_curriculum_v1');
      setCustomList(raw?.assignedCourses || []);
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

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#15803D]/10 text-[#15803D] flex items-center justify-center text-lg border border-[#15803D]/20">
              <i className="bi bi-diagram-3-fill" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Grafo Dinâmico 10P
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">10 Semestres Noturno</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold bg-[#15803D] text-white">
            {customList.length} optativa{customList.length === 1 ? '' : 's'}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Grafo interativo com 27 disciplinas obrigatórias e slots customizáveis para simular seu fluxo de matrícula no SIGA.
        </p>

        <div className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg mb-3 flex items-center justify-between text-xs">
          <span className="text-gray-600">Matérias Obrigatórias:</span>
          <span className="font-mono font-bold text-[#0A0A0A]">27 (1.860h)</span>
        </div>
      </div>

      <a
        href="#grafo"
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#15803D] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Explorar Grafo Vivo</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
