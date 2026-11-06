// src/components/features/curriculum/dossie/CurriculumDossierWidget.tsx — Widget de Resumo do Dossiê 3.000h
import React, { useState, useEffect } from 'react';
import { getVaultItem, type CustomCourse } from '../../../../lib/storage/studentVault';

export const CurriculumDossierWidget: React.FC = () => {
  const [customList, setCustomList] = useState<CustomCourse[]>([]);
  const [calcData, setCalcData] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = () => {
      const raw = getVaultItem('cagp_custom_curriculum_v1');
      setCustomList(raw?.assignedCourses || []);
      setCalcData(getVaultItem('cagp_calc_ext_aac_v1') || {});
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

  const optativasHours = customList.reduce((sum, c) => sum + (c.ch || 60), 0);
  const extTotal = Math.min(300, (calcData['ext_lab_a'] || 0) + (calcData['ext_lab_b'] || 0) + (calcData['ext_junior'] || 0) + (calcData['ext_siex'] || 0) + (calcData['ext_cursos'] || 0));

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#8B1E2D]/10 text-[#8B1E2D] flex items-center justify-center text-lg border border-[#8B1E2D]/20">
              <i className="bi bi-mortarboard-fill" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Dossiê Discente
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Meta de 3.000h</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold bg-[#8B1E2D] text-white">
            PPC 2020
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Termômetro com divisão entre 27 obrigatórias, optativas do curso, formação livre (120h) e extensão.
        </p>

        <div className="space-y-1.5 mb-3 text-xs">
          <div className="flex justify-between items-center text-gray-700">
            <span>Optativas Vinculadas:</span>
            <span className="font-mono font-bold text-[#8B1E2D]">{optativasHours}h / 1.020h</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Extensão Curricular:</span>
            <span className="font-mono font-bold text-[#15803D]">{extTotal}h / 300h</span>
          </div>
        </div>
      </div>

      <a
        href="#minha-grade"
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Dossiê Completo</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
