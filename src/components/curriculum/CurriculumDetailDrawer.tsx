// CurriculumDetailDrawer.tsx - Dossiê e Controle de Matéria Selecionada no Grafo
import React from 'react';
import { DISCIPLINAS_GRAFO, DEPT_COLORS, type CourseNodeData } from './curriculumGraphData';

interface Props {
  nodeId: string;
  isCompleted: boolean;
  onToggleCompleted: (id: string) => void;
  onSelectNode: (id: string | null) => void;
  onClose: () => void;
}

export const CurriculumDetailDrawer: React.FC<Props> = ({
  nodeId,
  isCompleted,
  onToggleCompleted,
  onSelectNode,
  onClose,
}) => {
  const d: CourseNodeData | undefined = DISCIPLINAS_GRAFO[nodeId];
  if (!d) return null;

  return (
    <div className="bg-[#F7F5F0] border-2 border-[#0A0A0A] rounded-xl p-4 shadow-[3px_3px_0px_#0A0A0A] space-y-3 transition-all animate-fadeIn">
      {/* Header do Dossiê */}
      <div className="flex items-start justify-between gap-2 border-b border-[#DFDBD2] pb-2.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-['Oswald'] uppercase font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: DEPT_COLORS[d.dept] || '#8B1E2D' }}
            >
              {d.dept}
            </span>
            <span className="text-xs font-mono font-bold text-gray-600">
              {d.period}º Período • {d.ch}h ({d.cr} créditos)
            </span>
            <span className="text-[10px] font-mono uppercase bg-white border border-[#DFDBD2] px-1.5 py-0.5 rounded text-gray-500">
              {d.trackLabel}
            </span>
          </div>
          <h4 className="font-['Oswald'] text-base sm:text-lg font-bold uppercase text-[#0A0A0A] leading-tight">
            {d.code}: {d.name}
          </h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg border border-[#0A0A0A] bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-sm cursor-pointer shadow-[1px_1px_0px_#0A0A0A] shrink-0"
          aria-label="Fechar detalhes da disciplina"
        >
          ✕
        </button>
      </div>

      {/* Alerta de Trava Formal no SIGA */}
      {d.isFormalLock ? (
        <div className="p-2.5 bg-red-50 border-2 border-[#DC2626] rounded-lg text-xs text-[#DC2626] space-y-1">
          <div className="font-bold uppercase flex items-center gap-1.5">
            <i className="bi bi-lock-fill" aria-hidden="true" />
            <span>Trava Formal de Pré-Requisito no SIGA UFMG</span>
          </div>
          <p className="text-[11px] leading-snug m-0 text-red-900">
            A aprovação prévia em <strong>ECN 140 (Introdução à Economia)</strong> é exigência estrita do Colegiado para liberar a matrícula no SIGA.
          </p>
        </div>
      ) : d.isKey ? (
        <div className="p-2.5 bg-amber-50 border-2 border-[#B45309] rounded-lg text-xs text-[#B45309] space-y-1">
          <div className="font-bold uppercase flex items-center gap-1.5">
            <i className="bi bi-key-fill" aria-hidden="true" />
            <span>Chave de Destravamento Formal no SIGA</span>
          </div>
          <p className="text-[11px] leading-snug m-0 text-amber-900">
            Aprovação nesta matéria destrava a matrícula em <strong>ECN 044 (Economia do Bem-Estar)</strong>.
          </p>
        </div>
      ) : (
        <div className="p-2 bg-white border border-[#DFDBD2] rounded-lg text-xs text-gray-600 flex items-center gap-1.5">
          <i className="bi bi-unlock-fill text-[#15803D]" aria-hidden="true" />
          <span>Matrícula sem bloqueio formal prévio no sistema acadêmico.</span>
        </div>
      )}

      {/* Ementa Resumida */}
      <div className="p-2.5 bg-white border border-[#DFDBD2] rounded-lg text-xs text-gray-800 leading-relaxed">
        <span className="font-['Oswald'] font-bold text-xs uppercase text-gray-500 block mb-0.5">
          Ementa Oficial (PPC 2020)
        </span>
        <p className="m-0 text-[11px] sm:text-xs text-gray-700">{d.desc}</p>
      </div>

      {/* Relações no Grafo (Pré-requisitos e Destravamentos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Upstream: Pré-requisitos */}
        <div className="p-2.5 bg-white border border-[#DFDBD2] rounded-lg space-y-1">
          <span className="font-['Oswald'] font-bold text-[11px] uppercase text-gray-500 block">
            Base Sugerida &bull; A Montante
          </span>
          {d.formalReqs.length === 0 && d.suggestedReqs.length === 0 ? (
            <span className="text-[11px] text-gray-400 italic">Disciplina introdutória.</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {[...d.formalReqs, ...d.suggestedReqs].map((reqId) => {
                const reqDisc = DISCIPLINAS_GRAFO[reqId];
                return (
                  <button
                    key={reqId}
                    type="button"
                    onClick={() => onSelectNode(reqId)}
                    className="min-h-[36px] text-xs font-mono font-bold px-2.5 py-1.5 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] border border-[#B45309] rounded-lg cursor-pointer transition-colors inline-flex items-center"
                  >
                    &larr; {reqDisc?.code || reqId}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Downstream: Destravamentos */}
        <div className="p-2.5 bg-white border border-[#DFDBD2] rounded-lg space-y-1">
          <span className="font-['Oswald'] font-bold text-[11px] uppercase text-gray-500 block">
            Desdobramentos &bull; A Jusante
          </span>
          {d.formalUnlocks.length === 0 && d.suggestedUnlocks.length === 0 ? (
            <span className="text-[11px] text-gray-400 italic">Sem disciplinas dependentes diretas.</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {[...d.formalUnlocks, ...d.suggestedUnlocks].map((nextId) => {
                const nextDisc = DISCIPLINAS_GRAFO[nextId];
                return (
                  <button
                    key={nextId}
                    type="button"
                    onClick={() => onSelectNode(nextId)}
                    className="min-h-[36px] text-xs font-mono font-bold px-2.5 py-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#15803D] rounded-lg cursor-pointer transition-colors inline-flex items-center"
                  >
                    {nextDisc?.code || nextId} &rarr;
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação Minha Grade */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DFDBD2]">
        <button
          type="button"
          onClick={() => onToggleCompleted(nodeId)}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg font-['Oswald'] font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-white text-[#15803D] border-2 border-[#15803D] hover:bg-green-50'
              : 'bg-[#15803D] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-green-700'
          }`}
        >
          <i className={`bi ${isCompleted ? 'bi-check-circle-fill' : 'bi-plus-circle'}`} aria-hidden="true" />
          <span>{isCompleted ? 'Já Cursada ✓ (Desmarcar)' : 'Marcar como Já Cursada ✓'}</span>
        </button>

        <a
          href={`#disc-${nodeId.toLowerCase()}`}
          className="text-xs font-semibold text-gray-700 hover:text-[#8B1E2D] min-h-[44px] px-2 py-2 inline-flex items-center gap-1 no-underline"
        >
          <span>Ver Ementa Completa</span>
          <i className="bi bi-box-arrow-in-down-right" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
