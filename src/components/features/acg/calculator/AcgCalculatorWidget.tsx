// src/components/features/acg/calculator/AcgCalculatorWidget.tsx — Widget de Resumo das 600h
import React, { useState, useEffect } from 'react';
import { getVaultItem } from '../../../../lib/storage/studentVault';
import { route } from '../../../../lib/paths';

const EXT_KEYS = ['ext_lab_a', 'ext_lab_b', 'ext_junior', 'ext_siex', 'ext_cursos'];
const AAC_KEYS = [
  'aac_pesquisa_inter',
  'aac_monitoria',
  'aac_eventos',
  'aac_grupos_estudo',
  'aac_iniciacao_cientifica',
  'aac_pesquisa_biblio',
  'aac_trabalho_anais',
  'aac_artigo_periodico',
  'aac_vivencia_prof',
];

export const AcgCalculatorWidget: React.FC = () => {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = () => {
      setData(getVaultItem('cagp_calc_ext_aac_v1') || {});
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

  const extTotal = Math.min(
    300,
    EXT_KEYS.reduce((sum, k) => sum + (data[k] || 0), 0)
  );
  const aacTotal = Math.min(
    300,
    AAC_KEYS.reduce((sum, k) => sum + (data[k] || 0), 0)
  );
  const total = extTotal + aacTotal;
  const pct = Math.round((total / 600) * 100);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#8B1E2D]/10 text-[#8B1E2D] flex items-center justify-center text-lg border border-[#8B1E2D]/20">
              <i className="bi bi-calculator-fill" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Calculadora 600h
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Extensão 300h + AAC 300h</span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold ${
              total >= 600
                ? 'bg-[#15803D] text-white'
                : total > 0
                ? 'bg-[#8B1E2D] text-white'
                : 'bg-gray-100 text-gray-700 border border-[#DFDBD2]'
            }`}
          >
            {total >= 600 ? '100% Concluído' : `${pct}% Integralizado`}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Simulador com trava automática dos tetos do Art. 15 e cálculo em blocos de 15h (1 crédito).
        </p>

        {/* Barras Lineares de Progresso */}
        <div className="space-y-2 mb-3">
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold mb-1">
              <span className="text-[#8B1E2D] uppercase font-['Oswald']">Extensão Obrigatória</span>
              <span className="font-mono text-gray-800">{extTotal}/300h ({Math.round(extTotal / 15)} cr)</span>
            </div>
            <div className="w-full bg-[#F7F5F0] border border-[#DFDBD2] rounded h-2 overflow-hidden">
              <div
                className="bg-[#8B1E2D] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (extTotal / 300) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] font-bold mb-1">
              <span className="text-[#15803D] uppercase font-['Oswald']">Atividades Complementares (AAC)</span>
              <span className="font-mono text-gray-800">{aacTotal}/300h ({Math.round(aacTotal / 15)} cr)</span>
            </div>
            <div className="w-full bg-[#F7F5F0] border border-[#DFDBD2] rounded h-2 overflow-hidden">
              <div
                className="bg-[#15803D] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (aacTotal / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href={route('/acg') + '#calculadora'}
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Abrir Simulador Completo</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
