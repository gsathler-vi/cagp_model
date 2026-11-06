import React from 'react';
import type { VaultData } from '../../lib/storage/studentVault';

interface Props {
  prefs: VaultData<'cagp_a11y_prefs_v2'>;
  update: (partial: Partial<VaultData<'cagp_a11y_prefs_v2'>>) => void;
}

export const A11yTabContent: React.FC<Props> = ({ prefs, update }) => {
  return (
    <div className="space-y-4 text-[#0A0A0A]">
      {/* Contraste Visual */}
      <div className="bg-[#F7F5F0] p-3 rounded-lg border border-[#DFDBD2]">
        <span className="block font-['Oswald'] font-bold text-xs uppercase mb-2">Contraste Visual</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update({ contrast: 'normal' })}
            className={`py-2 px-3 text-xs font-['Oswald'] uppercase font-bold rounded border cursor-pointer min-h-[44px] ${
              prefs.contrast === 'normal'
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-white border-[#DFDBD2]'
            }`}
          >
            Padrão Institucional
          </button>
          <button
            type="button"
            onClick={() => update({ contrast: 'high' })}
            className={`py-2 px-3 text-xs font-['Oswald'] uppercase font-bold rounded border cursor-pointer min-h-[44px] ${
              prefs.contrast === 'high'
                ? 'bg-[#0A0A0A] text-yellow-300 border-yellow-300'
                : 'bg-black text-yellow-300 border-black'
            }`}
          >
            Alto Contraste AAA
          </button>
        </div>
      </div>

      {/* Tamanho da Tipografia (Stepper) */}
      <div className="bg-[#F7F5F0] p-3 rounded-lg border border-[#DFDBD2]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-['Oswald'] font-bold text-xs uppercase">Tamanho do Texto</span>
          <span className="text-[10px] font-mono text-gray-500">
            {prefs.font === 'sm' ? '90%' : prefs.font === 'md' ? '100% (Padrão)' : prefs.font === 'lg' ? '115%' : '130%'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => update({ font: size })}
              className={`py-2 text-xs font-['Oswald'] uppercase font-bold rounded border cursor-pointer min-h-[44px] ${
                prefs.font === size
                  ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]'
                  : 'bg-white text-gray-700 border-[#DFDBD2] hover:border-[#0A0A0A]'
              }`}
            >
              {size === 'sm' ? 'A-' : size === 'md' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
            </button>
          ))}
        </div>
      </div>

      {/* Dislexia, Régua Guia e Movimento */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => update({ dyslexia: !prefs.dyslexia })}
          className={`p-2.5 text-xs font-['Oswald'] uppercase font-bold rounded border text-left cursor-pointer transition-colors min-h-[44px] ${
            prefs.dyslexia ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]' : 'bg-[#F7F5F0] border-[#DFDBD2]'
          }`}
        >
          <span className="block">Dislexia</span>
          <span className="text-[10px] font-normal opacity-80">Fonte Ampla</span>
        </button>
        <button
          type="button"
          onClick={() => update({ ruler: !prefs.ruler })}
          className={`p-2.5 text-xs font-['Oswald'] uppercase font-bold rounded border text-left cursor-pointer transition-colors min-h-[44px] ${
            prefs.ruler ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]' : 'bg-[#F7F5F0] border-[#DFDBD2]'
          }`}
        >
          <span className="block">Régua Guia</span>
          <span className="text-[10px] font-normal opacity-80">{prefs.ruler ? 'Ativa' : 'Desativada'}</span>
        </button>
        <button
          type="button"
          onClick={() => update({ motion: prefs.motion === 'reduced' ? 'normal' : 'reduced' })}
          className={`p-2.5 text-xs font-['Oswald'] uppercase font-bold rounded border text-left cursor-pointer transition-colors min-h-[44px] ${
            prefs.motion === 'reduced' ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]' : 'bg-[#F7F5F0] border-[#DFDBD2]'
          }`}
        >
          <span className="block">Movimento</span>
          <span className="text-[10px] font-normal opacity-80">{prefs.motion === 'reduced' ? 'Reduzido' : 'Padrão'}</span>
        </button>
      </div>

      {/* Dock Flutuante Desktop */}
      <div className="bg-[#F7F5F0] p-3 rounded-lg border border-[#DFDBD2] flex items-center justify-between gap-3">
        <div>
          <span className="block font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A]">Dock Flutuante (Desktop)</span>
          <span className="text-[11px] text-gray-500">Barra de navegação inferior estilo macOS em telas grandes</span>
        </div>
        <label htmlFor="a11y-tab-dock-toggle" className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
          <input
            id="a11y-tab-dock-toggle"
            name="a11yShowDesktopDock"
            type="checkbox"
            checked={!!prefs.showDesktopDock}
            onChange={(e) => update({ showDesktopDock: e.target.checked })}
            className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            aria-label="Ativar dock flutuante no desktop"
          />
        </label>
      </div>

      {/* Atalhos de Teclado */}
      <div className="p-2.5 rounded-lg border border-[#DFDBD2] bg-[#F7F5F0] text-[11px] text-gray-600 space-y-1">
        <span className="font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A] block">
          <i className="bi bi-keyboard me-1"></i> Atalhos de Acessibilidade
        </span>
        <div className="flex flex-wrap gap-3">
          <span><kbd className="px-1.5 py-0.5 bg-white border border-[#DFDBD2] rounded text-[10px] font-mono">Alt + A</kbd> Abrir / Fechar</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-[#DFDBD2] rounded text-[10px] font-mono">Esc</kbd> Fechar Painel</span>
        </div>
      </div>
    </div>
  );
};
