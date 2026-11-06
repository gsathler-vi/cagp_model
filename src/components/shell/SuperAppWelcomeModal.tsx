import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem } from '../../lib/storage/studentVault';

export const SuperAppWelcomeModal: React.FC = () => {
  const [showTip, setShowTip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // Verifica se o estudante já completou ou dispensou o onboarding inicial
    const completed = getVaultItem('cagp_onboarding_completed_v1');
    if (!completed) {
      const timer = setTimeout(() => setShowTip(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowTip(false);
    setIsModalOpen(false);
    setVaultItem('cagp_onboarding_completed_v1', true);
  };

  const handleStartTour = () => {
    setShowTip(false);
    setIsModalOpen(true);
  };

  const slides = [
    {
      icon: 'bi-compass-fill',
      iconColor: 'bg-[#8B1E2D]',
      tag: 'Bem-vindo ao Super App Discente',
      title: 'Toda a sua Graduação em um Só Lugar',
      description:
        'Criado pelo Centro Acadêmico de Gestão Pública (CAGP FAFICH/UFMG) para descomplicar sua rotina acadêmica: matriz curricular de 10 semestres, calculadora de 600h, guardião de prazos e normas oficiais.',
    },
    {
      icon: 'bi-shield-check',
      iconColor: 'bg-[#15803D]',
      tag: 'Privacidade & Custo Zero',
      title: '100% Seguro no seu Próprio Dispositivo',
      description:
        'Não há cadastro, senhas ou servidores remotos. Suas matérias marcadas, certificados e cálculos de horas ficam salvos exclusivamente no armazenamento local seguro do seu navegador e funcionam 100% offline.',
    },
    {
      icon: 'bi-diagram-3-fill',
      iconColor: 'bg-[#005A9C]',
      tag: 'Navegação por Centrais',
      title: 'Pílulas Táteis & Grafo Dinâmico',
      description:
        'Use as pílulas táteis no topo de cada tela para alternar entre simuladores e regras normativas. No Grafo 10P, você pode inclusive adicionar optativas livres de outros departamentos da UFMG!',
    },
  ];

  const current = slides[slide];

  return (
    <>
      {/* 1. Card Flutuante Estilo Apple TipKit (Não-bloqueante no canto inferior direito) */}
      {showTip && !isModalOpen && (
        <aside
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-3 md:right-6 z-[1045] max-w-sm w-[calc(100vw-1.5rem)] md:w-auto bg-white/95 dark:bg-[#1C1E22]/95 backdrop-blur-xl border border-black/15 dark:border-white/15 rounded-2xl shadow-sm p-3.5 animate-in slide-in-from-bottom duration-300"
          aria-label="Dica de boas-vindas do Super App"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B1E2D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <i className="bi bi-lightbulb-fill text-base" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-['Oswald'] uppercase font-bold tracking-wider text-[#8B1E2D] block">
                Dica do Super App
              </span>
              <h2 className="font-['Oswald'] text-xs font-bold uppercase text-[#0A0A0A] dark:text-[#F5F3EF] leading-snug">
                Conheça as ferramentas discentes em 30s
              </h2>
              <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-tight mt-0.5">
                Calculadora 600h, Grade 10P interativa e normas da FAFICH no seu bolso.
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="px-3 py-1.5 min-h-[44px] bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white text-[11px] font-['Oswald'] uppercase font-bold tracking-wide rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                >
                  Conhecer em 30s
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 min-h-[44px] text-gray-500 hover:text-[#0A0A0A] text-[11px] font-['Oswald'] uppercase font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                >
                  Dispensar
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Modal Completo de Boas-Vindas (Invocado pelo discente) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#1C1E22] border border-black/15 dark:border-white/15 rounded-2xl shadow-xl p-6 space-y-5 flex flex-col justify-between">
            <div>
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <span className={`w-12 h-12 rounded-xl ${current.iconColor} text-white flex items-center justify-center text-2xl shadow-xs`}>
                  <i className={`bi ${current.icon}`} aria-hidden="true" />
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="min-h-[44px] px-2.5 py-1 text-xs font-['Oswald'] uppercase font-bold text-gray-500 hover:text-[#0A0A0A] hover:bg-[#F7F5F0] rounded border border-transparent hover:border-[#DFDBD2] cursor-pointer flex items-center justify-center"
                >
                  Pular Introdução
                </button>
              </div>

              <span className="text-[11px] font-['Oswald'] uppercase font-bold tracking-wider text-[#8B1E2D] block mb-1">
                {current.tag}
              </span>
              <h2 id="onboarding-title" className="font-['Oswald'] text-xl font-bold uppercase text-[#0A0A0A] dark:text-[#F5F3EF] leading-tight mb-2">
                {current.title}
              </h2>
              <p className="text-xs text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Indicadores de Progresso & Ações com cagp-dot-btn */}
            <div className="pt-4 border-t border-[#DFDBD2] dark:border-[#3F3F46] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlide(i)}
                      className="cagp-dot-btn min-w-[44px] min-h-[44px] flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
                      aria-label={`Ir para slide ${i + 1}`}
                    >
                      <span
                        className={`h-2 rounded-full transition-all duration-200 block ${
                          i === slide ? 'w-6 bg-[#0A0A0A] dark:bg-[#F5F3EF]' : 'w-2 bg-[#DFDBD2] dark:bg-[#3F3F46]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-gray-500">
                  {slide + 1} de {slides.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {slide > 0 && (
                  <button
                    type="button"
                    onClick={() => setSlide(slide - 1)}
                    className="min-h-[44px] px-4 py-2 bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] rounded-lg text-xs font-['Oswald'] uppercase font-bold text-gray-700 transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                )}

                {slide < slides.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setSlide(slide + 1)}
                    className="flex-1 min-h-[44px] px-5 py-2 bg-[#0A0A0A] text-white hover:bg-[#8B1E2D] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Próximo Passo</span>
                    <i className="bi bi-arrow-right" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="flex-1 min-h-[44px] px-5 py-2 bg-[#8B1E2D] text-white hover:bg-[#0A0A0A] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Começar a Explorar</span>
                    <i className="bi bi-rocket-takeoff-fill" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
