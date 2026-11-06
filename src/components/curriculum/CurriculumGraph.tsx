// CurriculumGraph.tsx - Ilha Reativa Coordenadora do Grafo Curricular SVG
import React, { useState, useEffect } from 'react';
import { DISCIPLINAS_GRAFO, TRACK_NAMES } from './curriculumGraphData';
import { CurriculumSvgMap } from './CurriculumSvgMap';
import { CurriculumDetailDrawer } from './CurriculumDetailDrawer';

export const CurriculumGraph: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  // Carregar e sincronizar "Minha Grade"
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cagp_minha_grade_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.savedCourses)) {
          setCompletedCourses(parsed.savedCourses);
        }
      }
    } catch (e) {
      console.warn('[Grafo] Falha ao carregar grade:', e);
    }
  }, []);

  const saveCompletedToVault = (updated: string[]) => {
    setCompletedCourses(updated);
    try {
      const payload = { savedCourses: updated };
      localStorage.setItem('cagp_minha_grade_v1', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('cagp:grade-updated'));
    } catch (e) {
      console.warn('[Grafo] Falha ao salvar grade:', e);
    }
  };

  const handleToggleCompleted = (id: string) => {
    const isDone = completedCourses.includes(id);
    const updated = isDone
      ? completedCourses.filter((c) => c !== id)
      : [...completedCourses, id];

    saveCompletedToVault(updated);
    const disc = DISCIPLINAS_GRAFO[id];
    const toastMsg = isDone
      ? `${disc?.code || id} desmarcada da sua grade.`
      : `✓ ${disc?.code || id} integralizada (${disc?.ch || 60}h)!`;

    (window as any).cagpToast?.(toastMsg, isDone ? 'bi-dash-circle' : 'bi-check2-circle');
  };

  const handleClearGrade = () => {
    if (window.confirm('Deseja limpar todas as matérias marcadas como cursadas no seu dispositivo?')) {
      saveCompletedToVault([]);
      (window as any).cagpToast?.('Grade limpa com sucesso.', 'bi-trash');
    }
  };

  // Cálculo de Horas Integralizadas
  let completedHours = 0;
  completedCourses.forEach((id) => {
    const disc = DISCIPLINAS_GRAFO[id];
    if (disc) completedHours += disc.ch;
  });
  const totalMandatoryHours = 1620; // 27 disciplinas obrigatórias do núcleo comum
  const progressPercent = Math.min(100, Math.round((completedHours / totalMandatoryHours) * 100));

  return (
    <div className="space-y-4">
      {/* HUD Linear de Integralização de Obrigatórias */}
      <div className="p-3.5 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[3px_3px_0px_#0A0A0A] space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-['Oswald'] font-bold text-xs uppercase tracking-wide text-gray-500 block">
              Minha Integralização &bull; 27 Obrigatórias
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-['Oswald'] font-black text-2xl text-[#8B1E2D]">
                {completedHours}h
              </span>
              <span className="text-xs font-mono text-gray-500">
                / {totalMandatoryHours}h ({completedCourses.length}/27 concluídas)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#F7F5F0] border border-[#DFDBD2] text-[#0A0A0A]">
              {progressPercent}%
            </span>
            {completedCourses.length > 0 && (
              <button
                type="button"
                onClick={handleClearGrade}
                className="text-[11px] font-semibold text-gray-500 hover:text-[#DC2626] transition-colors cursor-pointer"
                title="Limpar matérias concluídas"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15803D] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Barra de Controles: Filtro de Trilhas e Restauração */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#DFDBD2] rounded-xl">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-['Oswald'] font-bold uppercase text-gray-500 mr-1">
            Trilhas:
          </span>
          {Object.keys(TRACK_NAMES).map((tKey) => {
            const isActive = activeTrack === tKey;
            return (
              <button
                key={tKey}
                type="button"
                onClick={() => {
                  setActiveTrack(tKey);
                  setSelectedNodeId(null);
                }}
                className={`text-[10px] font-['Oswald'] uppercase font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0A0A0A] text-white border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]'
                    : 'bg-[#F7F5F0] text-gray-700 border border-[#DFDBD2] hover:bg-white'
                }`}
              >
                {TRACK_NAMES[tKey]}
              </button>
            );
          })}
        </div>

        {selectedNodeId && (
          <button
            type="button"
            onClick={() => setSelectedNodeId(null)}
            className="text-xs font-['Oswald'] font-bold uppercase px-2.5 py-1 bg-white border border-[#0A0A0A] rounded text-[#8B1E2D] hover:bg-[#FEE2E2] shadow-[1px_1px_0px_#0A0A0A] cursor-pointer transition-colors"
          >
            Restaurar Mapa
          </button>
        )}
      </div>

      {/* Legenda Cartográfica das Conexões */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 px-1 font-sans">
        <div className="flex items-center gap-1">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-[#DC2626]" />
          <span>Trava no SIGA (ECN 140)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-[#9CA3AF]" />
          <span>Encadeamento Pedagógico</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8A317]" />
          <span>Pré-Requisito (A Montante)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
          <span>Destrava (A Jusante)</span>
        </div>
      </div>

      {/* Viewport com Canvas SVG Panorâmico */}
      <div className="cagp-grafo-viewport">
        <CurriculumSvgMap
          selectedNodeId={selectedNodeId}
          activeTrack={activeTrack}
          completedCourses={completedCourses}
          onSelectNode={(id) => setSelectedNodeId(id)}
        />
      </div>

      {/* Dossiê Expansível da Disciplina Selecionada */}
      {selectedNodeId && (
        <CurriculumDetailDrawer
          nodeId={selectedNodeId}
          isCompleted={completedCourses.includes(selectedNodeId)}
          onToggleCompleted={handleToggleCompleted}
          onSelectNode={(id) => setSelectedNodeId(id)}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
};
