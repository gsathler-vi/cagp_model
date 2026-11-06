import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../../../lib/storage/studentVault';
import { LinearHud } from '../../../calculators/LinearHud';
import { EXTENSION_ITEMS, AAC_ITEMS, type AcgItemDef } from '../../../calculators/acgCatalog';

export const AcgCalculatorCore: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calc_ext_aac_v1'>>({});
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [allDrawersOpen, setAllDrawersOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const getItemValue = (item: AcgItemDef, currentData: Record<string, number>): number => {
    if (currentData[item.key] !== undefined) {
      return Number(currentData[item.key]) || 0;
    }
    if (item.aliases) {
      for (const alias of item.aliases) {
        if (currentData[alias] !== undefined) {
          return Number(currentData[alias]) || 0;
        }
      }
    }
    return 0;
  };

  const loadData = () => {
    const raw = getVaultItem('cagp_calc_ext_aac_v1');
    const sanitized: Record<string, number> = {};

    for (const item of EXTENSION_ITEMS) {
      const v = getItemValue(item, raw);
      sanitized[item.key] = Math.min(item.max, Math.max(0, v));
    }
    for (const item of AAC_ITEMS) {
      const v = getItemValue(item, raw);
      sanitized[item.key] = Math.min(item.max, Math.max(0, v));
    }

    setData(sanitized);
  };

  useEffect(() => {
    loadData();

    const handleVaultUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_calc_ext_aac_v1') {
        const nextVal = custom.detail.value || {};
        setData(nextVal);
      }
    };

    window.addEventListener('cagp:vault-updated', handleVaultUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleVaultUpdate);
  }, []);

  const updateItemHours = (key: string, nextVal: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, nextVal));
    const nextData = { ...data, [key]: clamped };
    setData(nextData);
    setVaultItem('cagp_calc_ext_aac_v1', nextData);
  };

  const handleStep = (item: AcgItemDef, delta: number) => {
    const current = data[item.key] || 0;
    updateItemHours(item.key, current + delta, item.max);
  };

  const handleMaxOut = (item: AcgItemDef) => {
    updateItemHours(item.key, item.max, item.max);
  };

  const toggleDrawer = (key: string) => {
    setOpenDrawers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllDrawers = () => {
    const nextState = !allDrawersOpen;
    setAllDrawersOpen(nextState);
    const updated: Record<string, boolean> = {};
    [...EXTENSION_ITEMS, ...AAC_ITEMS].forEach((item) => {
      updated[item.key] = nextState;
    });
    setOpenDrawers(updated);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    const empty: Record<string, number> = {};
    [...EXTENSION_ITEMS, ...AAC_ITEMS].forEach((it) => {
      empty[it.key] = 0;
    });
    setData(empty);
    setVaultItem('cagp_calc_ext_aac_v1', empty);
    setConfirmReset(false);
  };

  const handlePresetExample = () => {
    const preset: Record<string, number> = {
      ext_lab_a: 90,
      ext_lab_b: 90,
      aac_eventos: 60,
      aac_pesquisa: 60,
      aac_cursos: 60,
    };
    setData(preset);
    setVaultItem('cagp_calc_ext_aac_v1', preset);
  };

  const renderSection = (
    title: string,
    subtitle: string,
    badgeText: string,
    items: AcgItemDef[],
    colorClass: string,
    targetMax: number,
  ) => {
    const sum = items.reduce((acc, it) => acc + (data[it.key] || 0), 0);
    const clampedSum = Math.min(targetMax, sum);
    const pct = Math.min(100, Math.round((clampedSum / targetMax) * 100));

    return (
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-[#0A0A0A]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-['Oswald'] text-lg uppercase font-bold text-[#0A0A0A] m-0">
                {title}
              </h2>
              <span className={`px-2 py-0.5 rounded text-xs font-['Oswald'] font-bold text-white ${colorClass}`}>
                {badgeText}
              </span>
              {clampedSum >= targetMax && (
                <span className="cagp-stamp-badge is-deferido text-[10px] py-0.5 px-2">
                  <i className="bi bi-award-fill" aria-hidden="true" />
                  <span>300h ATINGIDAS</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5 m-0 font-normal">{subtitle}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-bold text-[#0A0A0A]">
              {clampedSum} / {targetMax}h
            </span>
            <span className="text-xs text-gray-500 ml-1">({pct}%)</span>
          </div>
        </div>

        {/* Colunas Independentes com Física Desacoplada (Masonry 2-Col) */}
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* Coluna 1 Independente */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            {items
              .filter((_, idx) => idx % 2 === 0)
              .map((item) => renderCard(item))}
          </div>

          {/* Coluna 2 Independente */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            {items
              .filter((_, idx) => idx % 2 === 1)
              .map((item) => renderCard(item))}
          </div>
        </div>
      </div>
    );
  };

  const renderCard = (item: AcgItemDef) => {
    const val = data[item.key] || 0;
    const itemPct = Math.min(100, Math.round((val / item.max) * 100));
    const isDrawerOpen = !!openDrawers[item.key];
    const isMaxed = val >= item.max;

    return (
      <div
        key={item.key}
        className="cagp-card p-3.5 bg-white border border-[#DFDBD2] rounded-lg shadow-xs flex flex-col h-fit transition-all duration-200"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-[#F7F5F0] border border-[#DFDBD2] flex items-center justify-center text-sm text-[#8B1E2D] shrink-0">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-gray-500">
                  {item.code}
                </span>
                <h3 className="font-['Oswald'] text-sm font-bold text-[#0A0A0A] leading-tight m-0">
                  {item.label}
                </h3>
              </div>
            </div>
            {isMaxed ? (
              <span className="cagp-stamp-badge is-teto text-[10px] py-0.5 px-1.5 shrink-0 shadow-[1px_1px_0_#15803D]">
                <i className="bi bi-patch-check-fill" aria-hidden="true" />
                <span>TETO {item.max}h</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono font-bold text-gray-600 shrink-0">
                Teto: {item.max}h
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{item.desc}</p>

          {/* Barra de Progresso do Item */}
          <div className="w-full h-1.5 bg-[#DFDBD2] rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-200 ${
                isMaxed ? 'bg-[#15803D]' : 'bg-[#8B1E2D]'
              }`}
              style={{ width: `${itemPct}%` }}
            />
          </div>
        </div>

        {/* Controles Táteis Apple HIG */}
        <div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#DFDBD2]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStep(item, -item.step)}
                disabled={val <= 0}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-base font-bold text-[#0A0A0A] cursor-pointer"
                aria-label={`Diminuir ${item.step}h de ${item.label}`}
              >
                <i className="bi bi-dash" aria-hidden="true" />
              </button>

              <div className="w-16 h-11 min-h-[44px] bg-[#FFFFFF] border border-[#0A0A0A] rounded-lg flex flex-col items-center justify-center">
                <span className="font-mono text-xs font-black text-[#0A0A0A] leading-none">
                  {val}h
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  /{item.max}h
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStep(item, item.step)}
                disabled={isMaxed}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-base font-bold text-[#0A0A0A] cursor-pointer"
                aria-label={`Adicionar ${item.step}h em ${item.label}`}
              >
                <i className="bi bi-plus" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {isMaxed ? (
                <span className="min-h-[44px] text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] border border-[#15803D]/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                  <i className="bi bi-check-circle-fill text-xs" aria-hidden="true" />
                  <span>100%</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMaxOut(item)}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#8B1E2D] hover:text-white border border-[#DFDBD2] text-xs font-['Oswald'] uppercase font-bold text-gray-700 transition-all active:scale-95 cursor-pointer min-h-[44px] flex items-center gap-1 shadow-xs"
                  title={`Preencher teto de ${item.max}h`}
                >
                  <i className="bi bi-arrow-bar-up text-xs" aria-hidden="true" />
                  <span>Teto</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleDrawer(item.key)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-['Oswald'] uppercase font-bold transition-colors flex items-center gap-1 min-h-[44px] cursor-pointer ${
                  isDrawerOpen
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-[#F7F5F0] text-gray-700 border-[#DFDBD2] hover:bg-[#EAE6DE]'
                }`}
                aria-expanded={isDrawerOpen}
                aria-controls={`drawer-${item.key}`}
              >
                <span>Regras</span>
                <i
                  className={`bi bi-chevron-${isDrawerOpen ? 'up' : 'down'} text-[10px]`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Gaveta Normativa de Regras com Interpolação Fluida 0fr -> 1fr */}
          <div
            id={`drawer-${item.key}`}
            className={`cagp-calc-drawer ${isDrawerOpen ? 'is-open' : ''}`}
            role="region"
            aria-label={`Normas de ${item.label}`}
            aria-hidden={!isDrawerOpen}
          >
            <div className="cagp-calc-drawer-inner">
              <div className="cagp-calc-drawer-grid">
                <div className="cagp-calc-drawer-section is-accepted">
                  <div className="cagp-calc-drawer-header">
                    <i className="bi bi-check-circle-fill text-[#15803D]" aria-hidden="true" />
                    <span>O que pontua:</span>
                  </div>
                  <ul>
                    {item.accepted.map((acc: string, i: number) => (
                      <li key={i}>{acc}</li>
                    ))}
                  </ul>
                </div>

                <div className="cagp-calc-drawer-section is-rejected">
                  <div className="cagp-calc-drawer-header">
                    <i className="bi bi-x-circle-fill text-[#DC2626]" aria-hidden="true" />
                    <span>O que não pontua:</span>
                  </div>
                  <ul>
                    {item.rejected.map((rej: string, i: number) => (
                      <li key={i}>{rej}</li>
                    ))}
                  </ul>
                </div>

                {item.alertNote && (
                  <div className="cagp-calc-drawer-alert">
                    <i className="bi bi-exclamation-triangle-fill text-[#B45309]" aria-hidden="true" />
                    <span>{item.alertNote}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cagp-calculator-core select-none">
      {/* HUD Linear Integrado */}
      <LinearHud />

      {/* Barra de Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-600">
            Ações Rápidas:
          </span>
          <button
            type="button"
            onClick={handlePresetExample}
            className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-[#EAE6DE] border border-[#DFDBD2] rounded text-xs font-['Oswald'] uppercase font-bold text-[#0A0A0A] transition-all"
            title="Preencher com exemplo de percurso balanceado de 360h"
          >
            Exemplo (360h)
          </button>
          <button
            type="button"
            onClick={toggleAllDrawers}
            className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-[#EAE6DE] border border-[#DFDBD2] rounded text-xs font-['Oswald'] uppercase font-bold text-[#0A0A0A] transition-all"
          >
            {allDrawersOpen ? 'Recolher Regras' : 'Expandir Regras'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className={`min-h-[36px] px-3 py-1 rounded text-xs font-['Oswald'] uppercase font-bold transition-all ${
            confirmReset
              ? 'bg-[#DC2626] text-white border-2 border-[#0A0A0A] animate-pulse'
              : 'bg-white text-gray-600 border border-[#DFDBD2] hover:text-[#DC2626]'
          }`}
        >
          {confirmReset ? 'Confirmar Zerar?' : 'Zerar Horas'}
        </button>
      </div>

      {/* Seção 1: Extensão Curricular Obrigatória (300h) */}
      {renderSection(
        '1. Extensão Curricular Obrigatória (300h)',
        'Resolução CEPE 10/2019 • Laboratórios práticos DCP 195/196 e projetos SIEX homologados',
        '300h Exigidas',
        EXTENSION_ITEMS,
        'bg-[#8B1E2D]',
        300,
      )}

      {/* Seção 2: Atividades Acadêmicas Complementares (Até 300h) */}
      {renderSection(
        '2. Atividades Acadêmicas Complementares — AAC (Até 300h)',
        'Regulamento N-20229 Art. 15 • Cursos livres, monitoria, pesquisa, eventos e estágio extracurricular',
        'Até 300h',
        AAC_ITEMS,
        'bg-[#15803D]',
        300,
      )}
    </div>
  );
};
