import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { DISCIPLINAS_GRAFO, type CourseNodeData } from '../curriculum/curriculumGraphData';

export const MinhaGradeDossie: React.FC = () => {
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [profile, setProfile] = useState<VaultData<'cagp_student_profile_v1'>>({
    name: 'Estudante de Gestão Pública',
    period: '1º Período',
    pronouns: '',
    email: '',
    phone: '',
    semester: '2026/1',
    pathway: '01-01',
    avatarPreset: 'candangos',
    prideChoice: 'none',
    interests: [],
    bio: '',
    linkedin: '',
  });

  const [periodFilter, setPeriodFilter] = useState<number | 'ALL'>('ALL');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const loadData = () => {
    if (typeof window === 'undefined') return;
    const grade = getVaultItem('cagp_minha_grade_v1');
    setSavedCourses(grade.savedCourses || []);
    setProfile(getVaultItem('cagp_student_profile_v1'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cagp:vault-updated', loadData);
    return () => window.removeEventListener('cagp:vault-updated', loadData);
  }, []);

  const toggleCourse = (code: string) => {
    const isSaved = savedCourses.includes(code);
    const updated = isSaved ? savedCourses.filter((c) => c !== code) : [...savedCourses, code];
    setSavedCourses(updated);
    setVaultItem('cagp_minha_grade_v1', { savedCourses: updated });
  };

  // Cálculo de Carga Horária das Obrigatórias
  const allObrigIds = Object.keys(DISCIPLINAS_GRAFO);
  const completedObrigIds = allObrigIds.filter((id) => savedCourses.includes(id));
  const completedHours = completedObrigIds.reduce((sum, id) => sum + (DISCIPLINAS_GRAFO[id]?.ch || 60), 0);
  const totalObrigHours = allObrigIds.reduce((sum, id) => sum + (DISCIPLINAS_GRAFO[id]?.ch || 60), 0);

  // Optativas salvas (as que não estão em DISCIPLINAS_GRAFO)
  const savedOptativeCodes = savedCourses.filter((code) => !DISCIPLINAS_GRAFO[code]);

  // Total de horas estimadas (1.620h obrigatórias + 60h por optativa)
  const optHours = savedOptativeCodes.length * 60;
  const grandTotalHours = completedHours + optHours;
  const completionPct = Math.min(100, Math.round((completedObrigIds.length / allObrigIds.length) * 100));

  const copySchedule = () => {
    const lines = [
      `Dossiê Minha Grade • CAGP UFMG`,
      `Estudante: ${profile.name} (${profile.period} - Ingresso: ${profile.semester})`,
      `Integralização Obrigatórias: ${completedObrigIds.length}/27 (${completedHours}h de ${totalObrigHours}h - ${completionPct}%)`,
      `Optativas Salvas: ${savedOptativeCodes.length} disciplinas (${optHours}h)`,
      `Total Acumulado: ${grandTotalHours}h`,
      ``,
      `--- DISCIPLINAS OBRIGATÓRIAS CONCLUÍDAS (${completedObrigIds.length}) ---`,
      ...completedObrigIds.map((id) => {
        const c = DISCIPLINAS_GRAFO[id];
        return `[✓] ${c.code} - ${c.name} (${c.ch}h • ${c.period}º Período)`;
      }),
      ``,
      `--- DISCIPLINAS PENDENTES (${allObrigIds.length - completedObrigIds.length}) ---`,
      ...allObrigIds
        .filter((id) => !savedCourses.includes(id))
        .map((id) => {
          const c = DISCIPLINAS_GRAFO[id];
          return `[ ] ${c.code} - ${c.name} (${c.ch}h • ${c.period}º Período)`;
        }),
      ``,
      savedOptativeCodes.length > 0 ? `--- OPTATIVAS SELECIONADAS (${savedOptativeCodes.length}) ---` : '',
      ...savedOptativeCodes.map((code) => `[★] ${code}`),
      ``,
      `Planejamento gerado pelo Super App Discente CAGP UFMG`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const filteredObrigIds =
    periodFilter === 'ALL'
      ? allObrigIds
      : allObrigIds.filter((id) => DISCIPLINAS_GRAFO[id]?.period === periodFilter);

  return (
    <div className="space-y-4">
      {/* HUD de Métricas e Integralização */}
      <div className="p-4 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DFDBD2]">
          <div>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block">
              Dossiê Pessoal de Integralização
            </span>
            <h3 className="font-['Oswald'] text-lg font-bold uppercase text-[#0A0A0A] m-0">
              Minha Grade Curricular
            </h3>
            <span className="text-xs text-gray-600 block mt-0.5">
              {profile.name} &bull; {profile.period} ({profile.semester})
            </span>
          </div>

          <button
            type="button"
            onClick={copySchedule}
            className="px-3 py-2 bg-[#8B1E2D] hover:bg-[#9E2424] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-all self-start sm:self-center"
          >
            <i className={`bi ${copyFeedback ? 'bi-check-all text-sm' : 'bi-clipboard'}`} />
            <span>{copyFeedback ? 'Grade Copiada!' : 'Copiar Plano (SIGA)'}</span>
          </button>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <div className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-['Oswald'] uppercase font-bold text-gray-700">Obrigatórias</span>
              <span className="font-mono font-bold text-[#8B1E2D]">
                {completedObrigIds.length} / 27
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-[#DFDBD2]">
              <div
                className="h-full bg-[#8B1E2D] transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              {completedHours}h de {totalObrigHours}h ({completionPct}%)
            </span>
          </div>

          <div className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-['Oswald'] uppercase font-bold text-gray-700">Optativas Salvas</span>
              <span className="font-mono font-bold text-[#15803D]">
                {savedOptativeCodes.length} disc.
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-[#DFDBD2]">
              <div
                className="h-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${Math.min(100, (savedOptativeCodes.length / 5) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              ~{optHours}h planejadas no catálogo
            </span>
          </div>

          <div className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-['Oswald'] uppercase font-bold text-gray-700">Horas Totais</span>
              <span className="font-mono font-bold text-[#005A9C]">
                {grandTotalHours}h / 3.000h
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-[#DFDBD2]">
              <div
                className="h-full bg-[#005A9C] transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((grandTotalHours / 3000) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              Obrigatórias + Optativas marcadas
            </span>
          </div>
        </div>
      </div>

      {/* Seletor de Períodos para as 27 Obrigatórias */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#DFDBD2] rounded-xl">
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500 mr-1 shrink-0">
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setPeriodFilter('ALL')}
            className={`text-xs font-['Oswald'] font-bold uppercase px-2 py-1 rounded border transition-colors cursor-pointer shrink-0 ${
              periodFilter === 'ALL'
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-[#F7F5F0] text-gray-700 border-[#DFDBD2] hover:bg-gray-200'
            }`}
          >
            Todos os 10P
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriodFilter(p)}
              className={`text-xs font-mono font-bold px-2 py-1 rounded border transition-colors cursor-pointer shrink-0 ${
                periodFilter === p
                  ? 'bg-[#8B1E2D] text-white border-[#8B1E2D]'
                  : 'bg-[#F7F5F0] text-gray-700 border-[#DFDBD2] hover:bg-gray-200'
              }`}
            >
              {p}ºP
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 font-mono">
          {filteredObrigIds.length} disciplinas exibidas
        </span>
      </div>

      {/* Lista das 27 Disciplinas Obrigatórias com Alternador Interativo */}
      <div className="space-y-2">
        {filteredObrigIds.map((id) => {
          const c = DISCIPLINAS_GRAFO[id];
          const isDone = savedCourses.includes(id);

          return (
            <div
              key={id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-green-50/70 border-[#15803D] shadow-[2px_2px_0px_#15803D]'
                  : 'bg-white border-[#DFDBD2] hover:border-[#0A0A0A]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleCourse(id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    isDone
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-white text-transparent border-gray-400 hover:border-[#0A0A0A]'
                  }`}
                  aria-label={isDone ? `Marcar ${c.code} como pendente` : `Marcar ${c.code} como cursada`}
                >
                  <i className="bi bi-check-lg font-bold text-sm" />
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#8B1E2D]">
                      {c.code}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#F7F5F0] border border-[#DFDBD2] rounded text-gray-600 font-mono">
                      {c.period}ºP &bull; {c.ch}h
                    </span>
                    {c.isFormalLock && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-red-100 text-[#DC2626] font-bold border border-red-300 rounded">
                        Trava SIGA
                      </span>
                    )}
                    {c.isKey && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-[#B45309] font-bold border border-amber-300 rounded">
                        Chave SIGA
                      </span>
                    )}
                  </div>
                  <span className="font-['Oswald'] text-sm font-bold text-[#0A0A0A] block truncate">
                    {c.name}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={`text-[11px] font-['Oswald'] uppercase font-bold px-2 py-0.5 rounded ${
                    isDone
                      ? 'bg-[#15803D] text-white'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {isDone ? 'Concluída ✓' : 'Pendente'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção de Optativas Salvas */}
      {savedOptativeCodes.length > 0 && (
        <div className="p-4 bg-white border border-[#DFDBD2] rounded-xl space-y-3 mt-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#DFDBD2]">
            <div>
              <span className="font-['Oswald'] text-sm font-bold uppercase text-[#0A0A0A] block">
                Optativas Adicionadas ao Plano ({savedOptativeCodes.length})
              </span>
              <span className="text-xs text-gray-500">
                Disciplinas selecionadas no Catálogo de 68 Optativas
              </span>
            </div>
            <a
              href="#optativas"
              className="text-xs font-['Oswald'] font-bold text-[#8B1E2D] hover:underline uppercase"
            >
              + Buscar Mais Optativas
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedOptativeCodes.map((code) => (
              <div
                key={code}
                className="p-2.5 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#8B1E2D] block">{code}</span>
                  <span className="text-[10px] text-gray-600">60h &bull; Optativa Selecionada</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCourse(code)}
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  title="Remover da grade"
                  aria-label={`Remover ${code} da grade`}
                >
                  <i className="bi bi-trash text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
