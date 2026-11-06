import React, { useState, useEffect } from 'react';
import {
  DISCIPLINAS_GRAFO,
  TRACK_NAMES,
  type CourseNodeData,
} from '../../../curriculum/curriculumGraphData';
import { CurriculumSvgMap } from '../../../curriculum/CurriculumSvgMap';
import {
  getVaultItem,
  setVaultItem,
  type CustomCourse,
} from '../../../../lib/storage/studentVault';
import { CustomCourseModal } from '../custom-course/CustomCourseModal';

interface Props {
  catalogOptions?: Array<{ code: string; name: string; dept: string; ch: number }>;
}

interface SelectedNodeState {
  code: string;
  name: string;
  period: number;
  ch: number;
  desc: string;
  dept: string;
  isCustom?: boolean;
  category?: string;
  isFormalLock?: boolean;
  isKey?: boolean;
  formalReqs?: string[];
  suggestedReqs?: string[];
  formalUnlocks?: string[];
  suggestedUnlocks?: string[];
  trackLabel?: string;
}

export const CurriculumGraphDynamic: React.FC<Props> = ({ catalogOptions = [] }) => {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>([]);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPeriod, setModalPeriod] = useState(4);
  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'columns' | 'svg'>('columns');

  const loadVaultData = () => {
    try {
      const gradeVault = getVaultItem('cagp_minha_grade_v1');
      if (gradeVault?.savedCourses) {
        setCompletedCourses(gradeVault.savedCourses);
      }
      const customVault = getVaultItem('cagp_custom_curriculum_v1');
      if (customVault?.assignedCourses) {
        setCustomCourses(customVault.assignedCourses);
      }
    } catch (e) {
      console.warn('[Grafo Dinâmico] Erro ao carregar dados:', e);
    }
  };

  useEffect(() => {
    loadVaultData();

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (
        custom.detail?.key === 'cagp_minha_grade_v1' ||
        custom.detail?.key === 'cagp_custom_curriculum_v1'
      ) {
        loadVaultData();
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  // Fechar modal de detalhes ao teclar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNode) {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  const handleToggleCompleted = (code: string, ch: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }
    const isDone = completedCourses.includes(code);
    const updated = isDone
      ? completedCourses.filter((c) => c !== code)
      : [...completedCourses, code];

    setCompletedCourses(updated);
    setVaultItem('cagp_minha_grade_v1', { savedCourses: updated });

    (window as any).cagpToast?.(
      isDone ? `${code} desmarcada da sua grade.` : `✓ ${code} marcada como integralizada (${ch}h)!`,
      isDone ? 'bi-dash-circle' : 'bi-check2-circle'
    );
  };

  const handleRemoveCustomCourse = (id: string, code: string) => {
    const updated = customCourses.filter((c) => c.id !== id);
    setCustomCourses(updated);
    setVaultItem('cagp_custom_curriculum_v1', { assignedCourses: updated });

    if (completedCourses.includes(code)) {
      const updatedDone = completedCourses.filter((c) => c !== code);
      setCompletedCourses(updatedDone);
      setVaultItem('cagp_minha_grade_v1', { savedCourses: updatedDone });
    }

    (window as any).cagpToast?.(`Disciplina ${code} removida do Grafo.`, 'bi-trash');
  };

  const openAddModal = (p: number) => {
    setModalPeriod(p);
    setIsModalOpen(true);
  };

  const handleSelectDiscipline = (disc: CourseNodeData) => {
    setSelectedNode({
      code: disc.code,
      name: disc.name,
      period: disc.period,
      ch: disc.ch,
      desc: disc.desc,
      dept: disc.dept,
      isFormalLock: disc.isFormalLock,
      isKey: disc.isKey,
      formalReqs: disc.formalReqs,
      suggestedReqs: disc.suggestedReqs,
      formalUnlocks: disc.formalUnlocks,
      suggestedUnlocks: disc.suggestedUnlocks,
      trackLabel: disc.trackLabel,
    });
  };

  const handleSelectSvgNode = (id: string | null) => {
    if (!id) {
      setSelectedNode(null);
      return;
    }
    const disc = DISCIPLINAS_GRAFO[id];
    if (disc) {
      handleSelectDiscipline(disc);
    }
  };

  const handleSelectCustomCourse = (cust: CustomCourse) => {
    setSelectedNode({
      code: cust.code,
      name: cust.name,
      period: cust.period,
      ch: cust.ch,
      desc: 'Disciplina optativa / formação livre vinculada ao seu percurso.',
      dept: cust.dept || 'UFMG',
      isCustom: true,
      category: cust.category,
    });
  };

  // Cálculos de Horas
  const mandatoryDoneHours = Object.values(DISCIPLINAS_GRAFO)
    .filter((d) => completedCourses.includes(d.code))
    .reduce((acc, d) => acc + d.ch, 0);

  const customDoneHours = customCourses
    .filter((c) => completedCourses.includes(c.code))
    .reduce((acc, c) => acc + c.ch, 0);

  const totalDoneHours = mandatoryDoneHours + customDoneHours;
  const progressPct = Math.min(100, Math.round((totalDoneHours / 3000) * 100));

  // Agrupamento por período (1 a 10)
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="cagp-curriculum-graph-dynamic select-none space-y-6">
      {/* HUD Linear de Integralização da Matriz */}
      <div className="p-4 bg-white border border-[#DFDBD2] rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-[#8B1E2D] text-white flex items-center justify-center font-bold text-sm">
                <i className="bi bi-diagram-3" aria-hidden="true" />
              </span>
              <h3 className="font-['Oswald'] text-base uppercase font-bold text-[#0A0A0A] m-0">
                Grafo Curricular Dinâmico & 10 Períodos
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 m-0">
              27 obrigatórias com travas do SIGA + optativas e disciplinas livres vinculadas por você.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Alternador de Modo: Colunas 10P vs Mapa SVG (BUG-15) */}
            <div
              className="inline-flex rounded-lg border-2 border-[#0A0A0A] p-0.5 bg-[#F7F5F0] shadow-[2px_2px_0px_#0A0A0A]"
              role="radiogroup"
              aria-label="Modo de visualização do grafo"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'columns'}
                onClick={() => setViewMode('columns')}
                className={`min-h-[44px] px-3 py-1.5 rounded-md font-['Oswald'] text-xs uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'columns'
                    ? 'bg-[#8B1E2D] text-white shadow-xs'
                    : 'text-gray-700 hover:text-black hover:bg-white/60'
                }`}
              >
                <i className="bi bi-kanban" aria-hidden="true" />
                <span>Colunas 10P</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'svg'}
                onClick={() => setViewMode('svg')}
                className={`min-h-[44px] px-3 py-1.5 rounded-md font-['Oswald'] text-xs uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'svg'
                    ? 'bg-[#8B1E2D] text-white shadow-xs'
                    : 'text-gray-700 hover:text-black hover:bg-white/60'
                }`}
              >
                <i className="bi bi-diagram-3-fill" aria-hidden="true" />
                <span>Mapa SVG & Trilhas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => openAddModal(4)}
              className="min-h-[44px] px-3.5 py-2 bg-[#8B1E2D] text-white hover:bg-[#0A0A0A] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_#0A0A0A] transition-all cursor-pointer"
            >
              <i className="bi bi-plus-circle" aria-hidden="true" />
              <span>+ Adicionar Disciplina</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso das 3.000h */}
        <div>
          <div className="flex justify-between text-xs font-mono text-gray-700 mb-1.5 flex-wrap gap-2">
            <div>
              <span>Obrigatórias: </span>
              <strong className="text-[#8B1E2D]">{mandatoryDoneHours}/1.860h</strong>
              <span className="text-gray-400 mx-2">•</span>
              <span>Optativas / Livres: </span>
              <strong className="text-[#15803D]">{customDoneHours}/1.140h</strong>
            </div>
            <div>
              <span>Total da Graduação: </span>
              <strong className="text-[#0A0A0A]">{totalDoneHours}/3.000h ({progressPct}%)</strong>
            </div>
          </div>
          <div className="w-full h-3 bg-[#DFDBD2] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#8B1E2D] transition-all duration-300"
              style={{ width: `${Math.min(100, (mandatoryDoneHours / 3000) * 100)}%` }}
              title="Horas Obrigatórias"
            />
            <div
              className="h-full bg-[#15803D] transition-all duration-300"
              style={{ width: `${Math.min(100, (customDoneHours / 3000) * 100)}%` }}
              title="Horas Optativas e Livres"
            />
          </div>
        </div>
      </div>

      {/* MODO 1: Grade dos 10 Períodos em Colunas Responsivas */}
      {viewMode === 'columns' && (
        <div className="overflow-x-auto pb-4 animate-in fade-in duration-150">
          <div className="flex gap-4 min-w-[1200px]">
            {periods.map((p) => {
              const periodMandatory = Object.values(DISCIPLINAS_GRAFO).filter((d) => d.period === p);
              const periodCustom = customCourses.filter((c) => c.period === p);

              return (
                <div
                  key={p}
                  className="w-72 bg-[#F7F5F0] border border-[#DFDBD2] rounded-xl p-3 flex flex-col justify-between shrink-0 shadow-xs"
                >
                  <div>
                    {/* Cabeçalho do Período */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b-2 border-[#0A0A0A]">
                      <span className="font-['Oswald'] text-sm font-black uppercase text-[#0A0A0A]">
                        {p}º Período
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 font-bold">
                        {periodMandatory.length + periodCustom.length} matérias
                      </span>
                    </div>

                    {/* Lista de Disciplinas Obrigatórias do Período */}
                    <div className="space-y-2 mb-2">
                      {periodMandatory.map((disc) => {
                        const isCompleted = completedCourses.includes(disc.code);
                        const isFormalLock = disc.isFormalLock;

                        return (
                          <div
                            key={disc.code}
                            className={`p-2.5 rounded-lg border transition-all text-xs ${
                              isCompleted
                                ? 'bg-[#DCFCE7] border-[#15803D]'
                                : 'bg-white border-[#DFDBD2] hover:border-[#0A0A0A]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSelectDiscipline(disc)}
                                  className="font-mono font-black text-left text-[#8B1E2D] hover:underline cursor-pointer"
                                >
                                  {disc.code}
                                </button>
                                {isCompleted && (
                                  <span className="cagp-stamp-badge is-feito text-[8px] font-black uppercase tracking-wider py-0 px-1 text-[#15803D] border-[#15803D] bg-[#DCFCE7]">
                                    FEITO ✓
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {isFormalLock && (
                                  <span className="text-[10px] text-[#DC2626]" title="Trava Formal no SIGA">
                                    <i className="bi bi-lock-fill" aria-hidden="true" />
                                  </span>
                                )}
                                {/* Checkbox com touch target expandido >= 44x44px (BUG-16) */}
                                <label
                                  htmlFor={`chk-course-${disc.code}`}
                                  className="min-w-[44px] min-h-[44px] -my-2 -mr-1 flex items-center justify-center cursor-pointer"
                                  title={isCompleted ? `Desmarcar ${disc.code}` : `Marcar ${disc.code} como concluída`}
                                >
                                  <input
                                    id={`chk-course-${disc.code}`}
                                    name={`course_${disc.code}`}
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => handleToggleCompleted(disc.code, disc.ch)}
                                    className="w-4 h-4 rounded text-[#8B1E2D] accent-[#8B1E2D] cursor-pointer"
                                    aria-label={`Marcar ${disc.code} como concluída`}
                                  />
                                </label>
                              </div>
                            </div>

                            <p
                              onClick={() => handleSelectDiscipline(disc)}
                              className="font-['Oswald'] font-bold text-xs text-[#0A0A0A] leading-tight m-0 mb-1 cursor-pointer hover:text-[#8B1E2D]"
                            >
                              {disc.name}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                              <span>{disc.dept} • {disc.ch}h</span>
                              {disc.formalReqs.length > 0 && (
                                <span className="text-[#DC2626] font-bold">
                                  Req: {disc.formalReqs.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Disciplinas Optativas e Personalizadas Vinculadas ao Período */}
                      {periodCustom.map((cust) => {
                        const isCompleted = completedCourses.includes(cust.code);

                        return (
                          <div
                            key={cust.id}
                            className={`p-2.5 rounded-lg border-2 border-dashed transition-all text-xs ${
                              isCompleted
                                ? 'bg-[#DCFCE7] border-[#15803D]'
                                : 'bg-[#FFFBEB] border-[#B45309]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-['Oswald'] uppercase font-bold bg-[#B45309] text-white">
                                  {cust.category === 'formacao_livre' ? 'LIVRE' : 'OPTATIVA'}
                                </span>
                                {isCompleted && (
                                  <span className="cagp-stamp-badge is-feito text-[8px] font-black uppercase tracking-wider py-0 px-1 text-[#15803D] border-[#15803D] bg-[#DCFCE7]">
                                    FEITO ✓
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center">
                                {/* Checkbox com touch target >= 44x44px (BUG-16) */}
                                <label
                                  htmlFor={`chk-custom-${cust.id}`}
                                  className="min-w-[44px] min-h-[44px] -my-2 flex items-center justify-center cursor-pointer"
                                  title={isCompleted ? `Desmarcar ${cust.code}` : `Marcar ${cust.code} como concluída`}
                                >
                                  <input
                                    id={`chk-custom-${cust.id}`}
                                    name={`custom_course_${cust.code}`}
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => handleToggleCompleted(cust.code, cust.ch)}
                                    className="w-4 h-4 rounded accent-[#15803D] cursor-pointer"
                                    aria-label={`Marcar ${cust.code} como concluída`}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomCourse(cust.id, cust.code)}
                                  className="min-w-[44px] min-h-[44px] -my-2 -mr-1 flex items-center justify-center text-gray-400 hover:text-[#DC2626] text-sm cursor-pointer"
                                  title="Remover do Grafo"
                                  aria-label="Remover do Grafo"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            <span
                              onClick={() => handleSelectCustomCourse(cust)}
                              className="font-mono font-bold text-[#B45309] text-[11px] block cursor-pointer hover:underline"
                            >
                              {cust.code}
                            </span>
                            <p
                              onClick={() => handleSelectCustomCourse(cust)}
                              className="font-['Oswald'] font-bold text-xs text-[#0A0A0A] leading-tight m-0 mb-1 cursor-pointer hover:text-[#8B1E2D]"
                            >
                              {cust.name}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                              <span>{cust.dept}</span>
                              <span className="font-bold text-[#B45309]">{cust.ch}h</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Botão de Adição no Período */}
                  <button
                    type="button"
                    onClick={() => openAddModal(p)}
                    className="w-full min-h-[44px] py-2 bg-white hover:bg-[#EAE6DE] border border-dashed border-[#DFDBD2] hover:border-[#0A0A0A] rounded-lg text-xs font-['Oswald'] uppercase font-bold text-gray-700 flex items-center justify-center gap-1 transition-all mt-2 cursor-pointer"
                  >
                    <i className="bi bi-plus text-base" aria-hidden="true" />
                    <span>Adicionar no {p}ºP</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODO 2: Mapa Cartográfico SVG & Trilhas (BUG-15) */}
      {viewMode === 'svg' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filtro por Trilhas Temáticas */}
          <div className="flex flex-wrap items-center gap-1.5 p-3 bg-white border border-[#DFDBD2] rounded-xl shadow-xs">
            <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-500 mr-1 flex items-center gap-1">
              <i className="bi bi-funnel-fill text-[#8B1E2D]" aria-hidden="true" />
              Filtrar Trilha:
            </span>
            {Object.entries(TRACK_NAMES).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTrack(key)}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  activeTrack === key
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs'
                    : 'bg-[#F7F5F0] text-gray-700 border-[#DFDBD2] hover:bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Legenda Cartográfica das Travas e Conexões */}
          <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#DC2626] inline-block" />
                <span className="font-bold text-[#DC2626]">Trava Formal SIGA (ECN 140 → ECN 044)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-gray-400 border-t border-dashed border-gray-600 inline-block" />
                <span className="text-gray-600">Encadeamento Pedagógico Sugerido</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#15803D] inline-block" />
                <span className="text-[#15803D] font-bold">Matéria Integralizada ✓</span>
              </div>
            </div>
            <span className="text-gray-500 font-mono text-[11px]">
              Clique em um nó para abrir a ementa e pré-requisitos
            </span>
          </div>

          {/* Viewport do Grafo Cartográfico SVG */}
          <div className="overflow-x-auto pb-4">
            <div className="cagp-grafo-viewport border-2 border-[#0A0A0A] rounded-xl bg-[#F7F5F0] overflow-hidden min-w-[980px] shadow-[3px_3px_0px_#0A0A0A]">
              <CurriculumSvgMap
                selectedNodeId={
                  selectedNode
                    ? Object.keys(DISCIPLINAS_GRAFO).find(
                        (k) => DISCIPLINAS_GRAFO[k].code === selectedNode.code
                      ) || null
                    : null
                }
                activeTrack={activeTrack}
                completedCourses={completedCourses}
                onSelectNode={handleSelectSvgNode}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: Detalhes da Disciplina com Backdrop z-[1055] (BUG-15) */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-[1055] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="selected-node-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNode(null);
          }}
        >
          <div className="bg-white border-2 border-[#0A0A0A] rounded-2xl shadow-[6px_6px_0px_#0A0A0A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b-2 border-[#0A0A0A] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="cagp-badge cagp-badge-red text-xs font-mono font-bold">
                    {selectedNode.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-600">
                    {selectedNode.dept} • {selectedNode.period}º Período • {selectedNode.ch} horas
                  </span>
                  {selectedNode.trackLabel && (
                    <span className="text-[10px] font-mono uppercase bg-[#F7F5F0] border border-[#DFDBD2] px-1.5 py-0.5 rounded text-gray-600">
                      {selectedNode.trackLabel}
                    </span>
                  )}
                  {selectedNode.category && (
                    <span className="cagp-badge cagp-badge-blue text-xs uppercase">
                      {selectedNode.category === 'formacao_livre' ? 'Livre' : 'Optativa'}
                    </span>
                  )}
                </div>
                <h3
                  id="selected-node-title"
                  className="font-['Oswald'] text-lg sm:text-xl font-black uppercase text-[#0A0A0A] m-0 leading-tight"
                >
                  {selectedNode.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="min-w-[44px] min-h-[44px] rounded-lg border-2 border-[#0A0A0A] bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-base cursor-pointer shadow-[2px_2px_0px_#0A0A0A] shrink-0"
                aria-label="Fechar detalhes da disciplina"
              >
                ✕
              </button>
            </div>

            {/* Aviso de Trava Formal SIGA / Chave */}
            {selectedNode.isFormalLock ? (
              <div className="p-3 bg-red-50 border-2 border-[#DC2626] rounded-xl text-xs text-[#DC2626] space-y-1">
                <div className="font-bold uppercase flex items-center gap-1.5 text-sm">
                  <i className="bi bi-lock-fill" aria-hidden="true" />
                  <span>Trava Formal de Pré-Requisito no SIGA UFMG</span>
                </div>
                <p className="text-xs leading-relaxed m-0 text-red-900">
                  A aprovação prévia em <strong>ECN 140 (Introdução à Economia)</strong> é exigência estrita do Colegiado para liberar a matrícula no SIGA.
                </p>
              </div>
            ) : selectedNode.isKey ? (
              <div className="p-3 bg-amber-50 border-2 border-[#B45309] rounded-xl text-xs text-[#B45309] space-y-1">
                <div className="font-bold uppercase flex items-center gap-1.5 text-sm">
                  <i className="bi bi-key-fill" aria-hidden="true" />
                  <span>Chave de Destravamento Formal no SIGA</span>
                </div>
                <p className="text-xs leading-relaxed m-0 text-amber-900">
                  Aprovação nesta matéria destrava a matrícula em <strong>ECN 044 (Economia do Bem-Estar)</strong>.
                </p>
              </div>
            ) : null}

            {/* Ementa Oficial */}
            <div className="p-3.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-xl space-y-1.5">
              <span className="font-['Oswald'] text-xs font-bold uppercase text-[#8B1E2D] block">
                Ementa Oficial (PPC 2020 / DCP UFMG):
              </span>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed m-0 select-text">
                {selectedNode.desc || 'Ementa cadastrada de acordo com o PPC 2020.'}
              </p>
            </div>

            {/* Relações a Montante e a Jusante (se for disciplina com nós no grafo) */}
            {(selectedNode.formalReqs?.length || selectedNode.suggestedReqs?.length || selectedNode.formalUnlocks?.length || selectedNode.suggestedUnlocks?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Montante */}
                <div className="p-3 bg-white border border-[#DFDBD2] rounded-xl space-y-1.5">
                  <span className="font-['Oswald'] font-bold text-xs uppercase text-gray-500 block">
                    Base Sugerida &bull; A Montante
                  </span>
                  {(selectedNode.formalReqs?.length === 0 && selectedNode.suggestedReqs?.length === 0) ? (
                    <span className="text-xs text-gray-400 italic">Disciplina introdutória.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {[...(selectedNode.formalReqs || []), ...(selectedNode.suggestedReqs || [])].map((reqId) => {
                        const reqDisc = DISCIPLINAS_GRAFO[reqId];
                        return (
                          <button
                            key={reqId}
                            type="button"
                            onClick={() => reqDisc && handleSelectDiscipline(reqDisc)}
                            className="min-h-[44px] text-xs font-mono font-bold px-3 py-2 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] border border-[#B45309] rounded-lg cursor-pointer transition-colors inline-flex items-center"
                          >
                            &larr; {reqDisc?.code || reqId}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Jusante */}
                <div className="p-3 bg-white border border-[#DFDBD2] rounded-xl space-y-1.5">
                  <span className="font-['Oswald'] font-bold text-xs uppercase text-gray-500 block">
                    Desdobramentos &bull; A Jusante
                  </span>
                  {(selectedNode.formalUnlocks?.length === 0 && selectedNode.suggestedUnlocks?.length === 0) ? (
                    <span className="text-xs text-gray-400 italic">Sem disciplinas dependentes diretas.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {[...(selectedNode.formalUnlocks || []), ...(selectedNode.suggestedUnlocks || [])].map((nextId) => {
                        const nextDisc = DISCIPLINAS_GRAFO[nextId];
                        return (
                          <button
                            key={nextId}
                            type="button"
                            onClick={() => nextDisc && handleSelectDiscipline(nextDisc)}
                            className="min-h-[44px] text-xs font-mono font-bold px-3 py-2 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#15803D] rounded-lg cursor-pointer transition-colors inline-flex items-center"
                          >
                            {nextDisc?.code || nextId} &rarr;
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Footer de Ações do Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DFDBD2]">
              <button
                type="button"
                onClick={() => handleToggleCompleted(selectedNode.code, selectedNode.ch)}
                className={`min-h-[44px] px-4 py-2 rounded-xl font-['Oswald'] font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_#0A0A0A] ${
                  completedCourses.includes(selectedNode.code)
                    ? 'bg-[#DCFCE7] text-[#15803D] border-2 border-[#15803D]'
                    : 'bg-[#15803D] text-white border-2 border-[#0A0A0A] hover:bg-green-700'
                }`}
              >
                <i className={`bi ${completedCourses.includes(selectedNode.code) ? 'bi-check-circle-fill' : 'bi-plus-circle'}`} />
                <span>
                  {completedCourses.includes(selectedNode.code)
                    ? 'Integralizada ✓ (Desmarcar)'
                    : 'Marcar como Integralizada ✓'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="min-h-[44px] px-4 py-2 bg-white hover:bg-gray-100 border border-[#0A0A0A] rounded-xl font-['Oswald'] text-xs font-bold uppercase cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Construtor de Optativas & Disciplinas Livres */}
      <CustomCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPeriod={modalPeriod}
        catalogOptions={catalogOptions}
      />
    </div>
  );
};
