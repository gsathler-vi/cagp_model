// src/components/features/curriculum/dossie/StudentDossierTracker.tsx — Termômetro de Integralização das 3.000h
import React, { useState, useEffect } from 'react';
import {
  getVaultItem,
  type CustomCourse,
} from '../../../../lib/storage/studentVault';

export const StudentDossierTracker: React.FC = () => {
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>([]);
  const [calcData, setCalcData] = useState<Record<string, number>>({});
  const [completedMandatoryCount, setCompletedMandatoryCount] = useState<number>(0);

  const loadData = () => {
    const rawCurriculum = getVaultItem('cagp_custom_curriculum_v1');
    setCustomCourses(rawCurriculum?.assignedCourses || []);
    setCalcData(getVaultItem('cagp_calc_ext_aac_v1') || {});
    try {
      const savedGrade = getVaultItem('cagp_minha_grade_v1');
      if (savedGrade?.savedCourses) {
        setCompletedMandatoryCount(savedGrade.savedCourses.length);
      }
    } catch {}
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cagp:vault-updated', handleUpdate);
    window.addEventListener('cagp-vault-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cagp:vault-updated', handleUpdate);
      window.removeEventListener('cagp-vault-updated', handleUpdate);
    };
  }, []);

  const mandatoryTotal = 1860;
  const mandatoryDone = Math.min(mandatoryTotal, completedMandatoryCount * 60);

  const optativasHours = customCourses.reduce((sum, c) => sum + (c.ch || 60), 0);
  const optativasCapped = Math.min(1020, optativasHours);

  const extKeys = ['ext_lab_a', 'ext_lab_b', 'ext_junior', 'ext_siex', 'ext_cursos'];
  const extDone = Math.min(300, extKeys.reduce((sum, k) => sum + (calcData[k] || 0), 0));

  const aacKeys = [
    'aac_pesquisa_inter', 'aac_monitoria', 'aac_eventos', 'aac_grupos_estudo',
    'aac_iniciacao_cientifica', 'aac_pesquisa_biblio', 'aac_trabalho_anais',
    'aac_artigo_periodico', 'aac_vivencia_prof'
  ];
  const aacDone = Math.min(300, aacKeys.reduce((sum, k) => sum + (calcData[k] || 0), 0));

  const totalCompleted = mandatoryDone + optativasCapped + extDone;
  const degreeTotal = 3000;
  const totalPct = Math.round((totalCompleted / degreeTotal) * 100);

  return (
    <div className="cagp-student-dossier p-4 sm:p-5 bg-white border border-[#DFDBD2] rounded-xl space-y-4 shadow-xs select-none text-[#0A0A0A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFDBD2] pb-3">
        <div>
          <span className="text-[11px] font-['Oswald'] uppercase font-bold tracking-wider text-[#8B1E2D]">
            Dossiê de Integralização Discente
          </span>
          <h3 className="font-['Oswald'] text-base sm:text-lg font-bold uppercase text-[#0A0A0A] m-0">
            Termômetro das 3.000 Horas da Graduação
          </h3>
          <p className="text-xs text-gray-600 mt-0.5 m-0">
            Acompanhamento automatizado de créditos e cargas horárias do PPC 2020.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">Integralizado</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#8B1E2D]">
              {totalCompleted}h / {degreeTotal}h
            </span>
          </div>
          {totalCompleted >= degreeTotal ? (
            <span className="cagp-stamp-badge is-homologado text-xs py-1 px-2 shadow-[2px_2px_0_#B45309]">
              ★ APTO À COLAÇÃO
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-[#0A0A0A] text-white font-mono text-xs font-bold shrink-0">
              {totalPct}%
            </span>
          )}
        </div>
      </div>

      {/* Barra Principal Geral */}
      <div className="space-y-1">
        <div className="w-full bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg h-3 overflow-hidden">
          <div
            className="bg-[#8B1E2D] h-full transition-all duration-500"
            style={{ width: `${Math.min(100, totalPct)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 font-mono">
          <span>0h</span>
          <span>{totalCompleted}h cumpridas ({Math.round(totalCompleted / 15)} créditos)</span>
          <span>3.000h</span>
        </div>
      </div>

      {/* Grid das 4 Dimensões Oficiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-700">
              1. Obrigatórias
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0A0A0A]">
              {mandatoryDone}/1.860h
            </span>
          </div>
          <div className="w-full bg-white border border-[#DFDBD2] rounded h-1.5 overflow-hidden">
            <div
              className="bg-[#0A0A0A] h-full"
              style={{ width: `${Math.min(100, (mandatoryDone / mandatoryTotal) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block truncate">
            27 matérias do núcleo
          </span>
        </div>

        <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-700">
              2. Optativas / Livre
            </span>
            <span className="text-[10px] font-mono font-bold text-[#8B1E2D]">
              {optativasCapped}/1.020h
            </span>
          </div>
          <div className="w-full bg-white border border-[#DFDBD2] rounded h-1.5 overflow-hidden">
            <div
              className="bg-[#8B1E2D] h-full"
              style={{ width: `${Math.min(100, (optativasCapped / 1020) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block truncate">
            {customCourses.length} alocada{customCourses.length === 1 ? '' : 's'} no grafo
          </span>
        </div>

        <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-700">
              3. Extensão 300h
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-[#15803D]">
                {extDone}/300h
              </span>
              {extDone >= 300 && (
                <span className="cagp-stamp-badge is-teto text-[9px] py-0 px-1 shadow-[1px_1px_0_#15803D]">
                  TETO ✓
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-white border border-[#DFDBD2] rounded h-1.5 overflow-hidden">
            <div
              className="bg-[#15803D] h-full"
              style={{ width: `${Math.min(100, (extDone / 300) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block truncate">
            Resolução CEPE 10/19
          </span>
        </div>

        <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-700">
              4. AAC (Art. 15)
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-[#B45309]">
                {aacDone}/300h
              </span>
              {aacDone >= 300 && (
                <span className="cagp-stamp-badge is-teto text-[9px] py-0 px-1 shadow-[1px_1px_0_#15803D]">
                  TETO ✓
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-white border border-[#DFDBD2] rounded h-1.5 overflow-hidden">
            <div
              className="bg-[#B45309] h-full"
              style={{ width: `${Math.min(100, (aacDone / 300) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block truncate">
            Abate horas de optativas
          </span>
        </div>
      </div>
    </div>
  );
};
