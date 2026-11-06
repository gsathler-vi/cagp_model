import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem } from '../../lib/storage/studentVault';
import { QUIZ_QUESTIONS, TRACK_DETAILS, type TrackDetail } from './percursoData';

export const PercursoQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultTrack, setResultTrack] = useState<string | null>(null);
  const [selectedDecisionTrack, setSelectedDecisionTrack] = useState<string>('01-01');

  useEffect(() => {
    const saved = getVaultItem('cagp_percurso_quiz_v1');
    if (saved && saved.resultPath) {
      setResultTrack(saved.resultPath);
      setSelectedDecisionTrack(saved.resultPath);
    }
  }, []);

  const handleSelectOption = (track: '01-01' | '01-02' | '01-03') => {
    const updated = { ...answers, [currentStep]: track };
    setAnswers(updated);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const counts: Record<string, number> = { '01-01': 0, '01-02': 0, '01-03': 0 };
      Object.values(updated).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
      let winner = '01-01';
      let maxCount = -1;
      (['01-01', '01-02', '01-03'] as const).forEach((t) => {
        if (counts[t] > maxCount) {
          maxCount = counts[t];
          winner = t;
        }
      });
      setResultTrack(winner);
      setSelectedDecisionTrack(winner);
      setVaultItem('cagp_percurso_quiz_v1', { answers: updated, resultPath: winner });
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({});
    setResultTrack(null);
    setVaultItem('cagp_percurso_quiz_v1', { answers: {} });
  };

  const activeQ = QUIZ_QUESTIONS.find((q) => q.id === currentStep);
  const resultInfo: TrackDetail | undefined = resultTrack ? TRACK_DETAILS[resultTrack] : undefined;
  const decisionInfo: TrackDetail = TRACK_DETAILS[selectedDecisionTrack];

  return (
    <div className="space-y-4">
      {/* Box do Termômetro / Quiz */}
      <div className="bg-white border border-[#DFDBD2] rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#DFDBD2] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-[#8B1E2D] text-white px-2 py-0.5 rounded">
              <i className="bi bi-thermometer-half me-1"></i> Termômetro Vocacional
            </span>
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#0A0A0A]">
              Descubra seu Percurso em 3 Cliques
            </h3>
          </div>
          {(resultTrack || currentStep > 1) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-mono font-bold text-gray-500 hover:text-[#8B1E2D] flex items-center gap-1"
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reiniciar
            </button>
          )}
        </div>

        {/* Questão Ativa */}
        {!resultTrack && activeQ && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-gray-500 uppercase">{activeQ.category}</span>
              <span className="text-[10px] font-mono font-bold bg-[#0A0A0A] text-white px-1.5 py-0.5 rounded">
                Etapa {currentStep}/3
              </span>
            </div>
            <p className="font-['Oswald'] font-bold text-base text-[#0A0A0A]">{activeQ.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {activeQ.options.map((opt) => (
                <button
                  key={opt.track}
                  type="button"
                  onClick={() => handleSelectOption(opt.track)}
                  className="p-3 text-left rounded-lg border border-[#DFDBD2] bg-[#F7F5F0] hover:bg-white hover:border-[#8B1E2D] transition-all flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A] group-hover:text-[#8B1E2D] mb-1">
                      <i className={`bi ${opt.icon} text-sm text-[#8B1E2D]`}></i>
                      <span>{opt.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{opt.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#8B1E2D] mt-2 block">
                    Selecionar &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado com Carimbo Oficial */}
        {resultTrack && resultInfo && (
          <div className="p-4 rounded-lg bg-[#F7F5F0] border-2 border-[#15803D] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="cagp-stamp-badge is-deferido">
                <i className="bi bi-patch-check-fill me-1" aria-hidden="true"></i>
                RECOMENDAÇÃO: PERCURSO {resultTrack}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                Diagnóstico Concluído
              </span>
            </div>
            <h4 className="font-['Oswald'] font-bold text-base uppercase text-[#0A0A0A]">
              {resultInfo.name}
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">{resultInfo.desc}</p>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-[#DFDBD2]">
              <a
                href={resultInfo.pdf}
                download
                className="cagp-btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3 no-underline"
              >
                <i className="bi bi-file-earmark-pdf"></i> Baixar Matriz {resultTrack} (PDF)
              </a>
              <a
                href="/documentos#formularios"
                className="cagp-btn-secondary inline-flex items-center gap-1 text-xs py-1.5 px-3 no-underline"
              >
                <i className="bi bi-pencil-square"></i> Requerimento Colegiado
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono font-semibold text-gray-500 hover:text-[#8B1E2D] px-2 py-1"
              >
                Refazer Teste
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Árvore de Decisão Rápida • 3 Chips Interativos */}
      <div className="bg-white border border-[#DFDBD2] rounded-xl p-4 space-y-3">
        <div className="border-b border-[#DFDBD2] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-[#0A0A0A] text-white px-2 py-0.5 rounded">
              Art. 3º Regulamento
            </span>
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#0A0A0A]">
              Árvore de Decisão Curricular
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare instantaneamente os 3 percursos oficiais da FAFICH/UFMG:
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['01-01', '01-02', '01-03'] as const).map((track) => {
            const isSelected = selectedDecisionTrack === track;
            return (
              <button
                key={track}
                type="button"
                onClick={() => setSelectedDecisionTrack(track)}
                className={`py-1.5 px-3 rounded-lg text-xs font-['Oswald'] uppercase font-bold border transition-colors ${
                  isSelected
                    ? 'bg-[#8B1E2D] text-white border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-[#F7F5F0] text-[#0A0A0A] border-[#DFDBD2] hover:border-[#0A0A0A]'
                }`}
              >
                Percurso {track}
              </button>
            );
          })}
        </div>

        {decisionInfo && (
          <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#DFDBD2] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A]">
                {decisionInfo.name}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${decisionInfo.badgeClass}`}>
                {decisionInfo.badge}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">{decisionInfo.desc}</p>
            <div className="pt-1">
              <a
                href={decisionInfo.pdf}
                download
                className="cagp-btn-secondary inline-flex items-center gap-1 text-[11px] py-1 px-2.5 no-underline"
              >
                <i className="bi bi-download"></i> Baixar Matriz Oficial {selectedDecisionTrack} (PDF)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
