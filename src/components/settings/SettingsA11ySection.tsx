import React from 'react';
import type { VaultData } from '../../lib/storage/studentVault';

interface Props {
  a11y: VaultData<'cagp_a11y_prefs_v2'>;
  updateA11y: (partial: Partial<VaultData<'cagp_a11y_prefs_v2'>>) => void;
}

export const SettingsA11ySection: React.FC<Props> = ({ a11y, updateA11y }) => {
  return (
    <section className="bg-white border border-[#DFDBD2] rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-3">
        <div className="flex items-center gap-2">
          <i className="bi bi-universal-access text-xl text-[#8B1E2D]" aria-hidden="true" />
          <div>
            <h2 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] m-0">
              1. Acessibilidade & Aparência Universal
            </h2>
            <p className="text-xs text-gray-500 m-0">Ajustes instantâneos de tema, legibilidade e conforto visual</p>
          </div>
        </div>
        <span className="cagp-badge cagp-badge-dark">WCAG AAA</span>
      </div>

      <div className="divide-y divide-[#DFDBD2]">
        {/* Tamanho da Fonte */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Tamanho da Tipografia</strong>
            <span className="text-xs text-gray-500">Escala responsiva do texto do aplicativo (90% a 130%)</span>
          </div>
          <div className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-lg border border-[#DFDBD2]">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateA11y({ font: s })}
                className={`min-w-[44px] min-h-[44px] px-3.5 py-1.5 text-xs font-['Oswald'] font-bold rounded-md cursor-pointer transition-all flex items-center justify-center ${
                  a11y.font === s ? 'bg-[#0A0A0A] text-white shadow-xs' : 'text-gray-700 hover:bg-white'
                }`}
              >
                {s === 'sm' ? 'A-' : s === 'md' ? 'A' : s === 'lg' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        {/* Dislexia */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Tipografia para Dislexia</strong>
            <span className="text-xs text-gray-500">Aumenta espaçamento entre letras e palavras</span>
          </div>
          <label className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              id="a11y-dyslexia"
              name="a11y-dyslexia"
              checked={a11y.dyslexia}
              onChange={(e) => updateA11y({ dyslexia: e.target.checked })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </label>
        </div>

        {/* Régua de Leitura */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Régua de Foco & Leitura</strong>
            <span className="text-xs text-gray-500">Barra visual semitransparente que acompanha o cursor ou toque</span>
          </div>
          <label className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              id="a11y-ruler"
              name="a11y-ruler"
              checked={!!a11y.ruler}
              onChange={(e) => updateA11y({ ruler: e.target.checked })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </label>
        </div>

        {/* Alto Contraste AAA */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Alto Contraste AAA (Preto & Amarelo)</strong>
            <span className="text-xs text-gray-500">Fundo nanquim (#000000) e textos amarelos de alto contraste</span>
          </div>
          <label className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              id="a11y-contrast"
              name="a11y-contrast"
              checked={a11y.contrast === 'high'}
              onChange={(e) => updateA11y({ contrast: e.target.checked ? 'high' : 'normal' })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </label>
        </div>

        {/* Movimento Reduzido */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Redução de Movimento</strong>
            <span className="text-xs text-gray-500">Desativa animações e transições espaciais</span>
          </div>
          <label className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              id="a11y-motion"
              name="a11y-motion"
              checked={a11y.motion === 'reduced'}
              onChange={(e) => updateA11y({ motion: e.target.checked ? 'reduced' : 'normal' })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </label>
        </div>

        {/* Dock Flutuante Desktop */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">Dock Flutuante (Desktop)</strong>
            <span className="text-xs text-gray-500">Barra de atalhos inferior inspirada no macOS para telas grandes</span>
          </div>
          <label className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              id="a11y-dock"
              name="a11y-dock"
              checked={!!a11y.showDesktopDock}
              onChange={(e) => updateA11y({ showDesktopDock: e.target.checked })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </section>
  );
};
