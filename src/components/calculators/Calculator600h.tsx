import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { LinearHud } from './LinearHud';
import { EXTENSION_ITEMS, AAC_ITEMS, type AcgItemDef } from './acgCatalog';
import { downloadAac120dIcs } from '../../lib/ics';
import { asset } from '../../lib/paths';

export const Calculator600h: React.FC = () => {
  const [data, setData] = useState<VaultData<'cagp_calc_ext_aac_v1'>>({});
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [allDrawersOpen, setAllDrawersOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Helper to resolve value taking into account possible legacy keys
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

    // Standardize all extension items
    for (const item of EXTENSION_ITEMS) {
      const v = getItemValue(item, raw);
      sanitized[item.key] = Math.min(item.max, Math.max(0, v));
    }
    // Standardize all AAC items
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

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    const resetObj: Record<string, number> = {};
    for (const item of EXTENSION_ITEMS) resetObj[item.key] = 0;
    for (const item of AAC_ITEMS) resetObj[item.key] = 0;
    setData(resetObj);
    setVaultItem('cagp_calc_ext_aac_v1', resetObj);
    setConfirmReset(false);
  };

  const handleSample360 = () => {
    const sampleObj: Record<string, number> = {};
    for (const item of EXTENSION_ITEMS) sampleObj[item.key] = 0;
    for (const item of AAC_ITEMS) sampleObj[item.key] = 0;

    // 180h Extensão: 90h Lab A + 90h SIEX/PROEX
    sampleObj['ext_lab_a'] = 90;
    sampleObj['ext_ufmg'] = 90;

    // 180h AAC: 90h PIBIC + 45h Pesquisa Inter + 45h Monitoria
    sampleObj['aac_pesquisa_ufmg'] = 90;
    sampleObj['aac_pesquisa_inter'] = 45;
    sampleObj['aac_monitoria'] = 45;

    setData(sampleObj);
    setVaultItem('cagp_calc_ext_aac_v1', sampleObj);
  };

  const toggleDrawer = (key: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllDrawers = () => {
    const nextState = !allDrawersOpen;
    setAllDrawersOpen(nextState);
    const updated: Record<string, boolean> = {};
    for (const item of EXTENSION_ITEMS) updated[item.key] = nextState;
    for (const item of AAC_ITEMS) updated[item.key] = nextState;
    setOpenDrawers(updated);
  };

  // Totals calculations
  let extSum = 0;
  for (const item of EXTENSION_ITEMS) {
    extSum += data[item.key] || 0;
  }
  const capExt = Math.min(300, extSum);
  const extCr = Math.round(capExt / 15);
  const extPct = Math.min(100, Math.round((capExt / 300) * 100));

  let aacSum = 0;
  for (const item of AAC_ITEMS) {
    aacSum += data[item.key] || 0;
  }
  const capAac = Math.min(300, aacSum);
  const aacCr = Math.round(capAac / 15);
  const aacPct = Math.min(100, Math.round((capAac / 300) * 100));

  const total = capExt + capAac;
  const totalCr = extCr + aacCr;
  const totalPct = Math.min(100, Math.round((total / 600) * 100));
  const remExt = Math.max(0, 300 - capExt);
  const remAac = Math.max(0, 300 - capAac);
  const remTotal = remExt + remAac;

  const isAllComplete = capExt >= 300 && capAac >= 300;

  return (
    <div className="space-y-4">
      {/* HUD Linear Compacto e Sticky */}
      <LinearHud />

      {/* Dica de Cofre Discente Local */}
      <div className="bg-[#FBF8F3] border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-3 flex items-start gap-3">
        <div className="text-[#8B1E2D] text-xl shrink-0 mt-0.5">
          <i className="bi bi-shield-lock-fill" aria-hidden="true" />
        </div>
        <div className="flex-1 text-xs">
          <strong className="text-[#0A0A0A] font-['Oswald'] uppercase text-sm block">
            Cofre Discente 100% Local &amp; Seguro
          </strong>
          <p className="text-gray-700 mt-0.5 leading-relaxed">
            Suas horas e certificados são salvos automaticamente no seu navegador. Você pode gerar um código de backup{' '}
            <code className="bg-white px-1 py-0.5 border border-[#DFDBD2] rounded text-[#8B1E2D] font-mono">CAGP1:...</code>{' '}
            no <strong>Passaporte Discente</strong> no topo para transferir entre dispositivos com zero custo de servidor.
          </p>
        </div>
      </div>

      {/* Seção da Calculadora com Topo e Ações */}
      <section className="bg-white border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-4 space-y-4">
        {/* Barra Superior de Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFDBD2] pb-3">
          <div>
            <span className="inline-block bg-[#15803D]/10 text-[#15803D] font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-[#15803D]/30 mb-1">
              Trava Automática de Tetos (Art. 15)
            </span>
            <h3 className="font-['Oswald'] text-lg font-bold uppercase text-[#0A0A0A]">
              SIMULADOR DE INTEGRALIZAÇÃO: EXTENSÃO (300H) + AAC (ATÉ 300H)
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={asset('/documentos/requerimento-atividade-integralizadora-credito-v20229.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1E2D] text-white font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#9E2424] transition-colors"
            >
              <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
              <span>Formulário N-20229 (PDF)</span>
            </a>
            <button
              type="button"
              onClick={handleSample360}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F7F5F0] text-[#0A0A0A] font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#eae5dc] transition-colors active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <i className="bi bi-play-circle text-[#8B1E2D]" aria-hidden="true" />
              <span>Exemplo (360h)</span>
            </button>
            <button
              type="button"
              onClick={toggleAllDrawers}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F7F5F0] text-[#0A0A0A] font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#eae5dc] transition-colors active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              aria-label={allDrawersOpen ? 'Recolher todas as gavetas' : 'Expandir todas as gavetas'}
            >
              <i className={`bi ${allDrawersOpen ? 'bi-chevron-contract' : 'bi-chevron-expand'} text-[#8B1E2D]`} aria-hidden="true" />
              <span>{allDrawersOpen ? 'Recolher Guias' : 'Expandir Guias'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={total === 0}
              className={`inline-flex items-center gap-1 px-3 py-1.5 font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                confirmReset
                  ? 'bg-[#DC2626] text-white animate-pulse'
                  : 'bg-[#F7F5F0] text-[#0A0A0A] hover:bg-[#eae5dc]'
              }`}
            >
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              <span>{confirmReset ? 'Confirmar Zerar?' : 'Zerar'}</span>
            </button>
          </div>
        </div>

        {/* DASHBOARD FINANCEIRO DE SALDO E LIMITES DE HORAS (Estilo Nubank / Banco Inter do Quarto) */}
        <div className="cagp-hours-bank-card" role="region" aria-label="Painel de saldo e limites de horas de Extensão e AAC">
          <div className="cagp-hours-bank-top">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#ffe082] flex items-center gap-1.5">
                <i className="bi bi-wallet2" aria-hidden="true" />
                <span>Extrato de Integralização • PPC 2020 &amp; Art. 15</span>
              </div>
              <div className="font-['Oswald'] text-base sm:text-lg font-bold uppercase text-white mt-0.5">
                Limite e Metas de Horas (600h = 40 Créditos)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`cagp-metric-ring ${totalPct >= 100 ? 'is-complete' : ''}`}
                style={{ '--ring-pct': String(totalPct) } as React.CSSProperties}
                aria-hidden="true"
              >
                <div className="cagp-metric-ring-inner">
                  <span>{totalPct}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cagp-hours-bank-slots">
            {/* Slot 1: Saldo Integralizado */}
            <div className="cagp-hours-bank-slot">
              <div className="text-[11px] font-bold uppercase text-gray-500 mb-1">
                Saldo Integralizado
              </div>
              <div className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#15803D]">
                {total}h / 600h
              </div>
              <div className="text-xs text-gray-700 font-semibold mt-0.5">
                {capExt}h Extensão ({extCr} cr) • {capAac}h AAC ({aacCr} cr)
              </div>
            </div>

            {/* Slot 2: Quanto Falta para Formar */}
            <div className="cagp-hours-bank-slot">
              <div className="text-[11px] font-bold uppercase text-gray-500 mb-1">
                Quanto Falta para Formar
              </div>
              <div className={`font-['JetBrains_Mono'] text-lg sm:text-xl font-bold ${remTotal === 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
                {remTotal === 0 ? '0h pendentes ✓' : `${remTotal}h restantes`}
              </div>
              <div className="text-xs text-gray-700 font-semibold mt-0.5">
                {remTotal === 0 ? '100% da meta de 600h cumprida!' : `Faltam ${remExt}h Extensão + ${remAac}h AAC`}
              </div>
            </div>

            {/* Slot 3: Prazo Fatal de 120 Dias */}
            <div className="cagp-hours-bank-slot">
              <div className="text-[11px] font-bold uppercase text-[#DC2626] flex items-center gap-1 mb-1">
                <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
                <span>Prazo Fatal • Art. 15, § 4º</span>
              </div>
              <div className="font-['Oswald'] text-base sm:text-lg font-bold uppercase text-[#0A0A0A]">
                120 Dias Corridos
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Protocolo obrigatório para <strong>Eventos I (Mod. III)</strong> e <strong>Trabalho em Anais (Mod. VII)</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Banner Dinâmico de Progresso e Celebração */}
        <div
          className={`cagp-calc-celebration-box ${isAllComplete ? 'is-all-complete' : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="cagp-calc-status-badge">
              {isAllComplete ? (
                <>
                  <i className="bi bi-patch-check-fill text-green-300" aria-hidden="true" />
                  <span>INTEGRALIZAÇÃO APTA • 100% REGULAMENTAR ATINGIDO!</span>
                </>
              ) : total === 0 ? (
                <>
                  <i className="bi bi-compass" aria-hidden="true" />
                  <span>SIMULADOR ATIVO</span>
                </>
              ) : capExt >= 300 && capAac < 300 ? (
                <>
                  <i className="bi bi-check-circle-fill text-green-400" aria-hidden="true" />
                  <span>EXTENSÃO CUMPRIDA (300h)</span>
                </>
              ) : capAac >= 300 && capExt < 300 ? (
                <>
                  <i className="bi bi-check-circle-fill text-green-400" aria-hidden="true" />
                  <span>AAC CUMPRIDA (300h)</span>
                </>
              ) : (
                <>
                  <i className="bi bi-hourglass-split text-yellow-300" aria-hidden="true" />
                  <span>PROGRESSO EM ANDAMENTO</span>
                </>
              )}
            </span>

            <span className="font-['JetBrains_Mono'] text-xs font-bold text-gray-800">
              {total}h / 600h simuladas ({totalCr} cr de 40 cr)
            </span>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed mb-0">
            {isAllComplete ? (
              <>
                <strong>Parabéns!</strong> Você preencheu integralmente as <strong>300h de Extensão (20 cr)</strong> e as{' '}
                <strong>300h de AAC (20 cr)</strong>. Todas as 600h necessárias para colação de grau estão cumpridas nesta simulação.{' '}
                Reúna seus certificados comprobatórios e confira as orientações de protocolo.
              </>
            ) : total === 0 ? (
              <>
                Ajuste as horas abaixo usando os botões <strong>+</strong> e <strong>−</strong> para calcular sua integralização nas duas frentes obrigatórias:{' '}
                <strong>300h de Extensão</strong> e <strong>300h de Atividades Complementares (AAC)</strong>.
              </>
            ) : capExt >= 300 && capAac < 300 ? (
              <>
                ✓ <strong>Formação em Extensão 100% integralizada!</strong> Agora faltam <strong>{300 - capAac}h</strong> de Atividades Complementares (AAC) para fechar o ciclo de 600h.
              </>
            ) : capAac >= 300 && capExt < 300 ? (
              <>
                ✓ <strong>Carga de AAC 100% integralizada!</strong> Agora faltam <strong>{300 - capExt}h</strong> de Extensão Curricular Obrigatória (Resolução CEPE nº 10/2019).
              </>
            ) : (
              <>
                Você já planejou <strong>{total}h</strong> das 600h necessárias. Faltam <strong>{remExt}h de Extensão</strong> e <strong>{remAac}h de AAC</strong>.
              </>
            )}
          </p>

          {isAllComplete && (
            <div className="mt-3">
              <a
                href="#guia-tramitacao"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#15803D] text-white font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#166534] transition-colors"
              >
                <i className="bi bi-check2-circle" aria-hidden="true" />
                <span>Ver Passo a Passo para Dar Entrada no Colegiado</span>
              </a>
            </div>
          )}
        </div>

        {/* Grid Principal: 2 Colunas (Extensão 300h e AAC 300h) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* =========================================================
              COLUNA 1: FORMAÇÃO EM EXTENSÃO OBRIGATÓRIA (300H)
              ========================================================= */}
          <div className="bg-[#FBF8F3] border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-2 flex-wrap gap-2">
              <div>
                <h4 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] flex items-center gap-2">
                  <i className="bi bi-diagram-3-fill text-[#8B1E2D]" aria-hidden="true" />
                  <span>1. Formação em Extensão (Meta: 300h)</span>
                </h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Exigência obrigatória para colação de grau (20 créditos = 300h):
                </p>
              </div>
              <span className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded border ${
                capExt >= 300
                  ? 'bg-green-100 text-green-900 border-green-400'
                  : 'bg-[#8B1E2D]/10 text-[#8B1E2D] border-[#8B1E2D]/30'
              }`}>
                {capExt}h / 300h ({extCr} cr)
              </span>
            </div>

            {/* Barra de Progresso de Extensão */}
            <div className="w-full bg-[#eae5dc] rounded-full h-2.5 overflow-hidden border border-[#0A0A0A]">
              <div
                className={`h-full transition-all duration-300 ${capExt >= 300 ? 'bg-[#15803D]' : 'bg-[#9E2424]'}`}
                style={{ width: `${extPct}%` }}
                role="progressbar"
                aria-valuenow={capExt}
                aria-valuemin={0}
                aria-valuemax={300}
              />
            </div>

            {/* Lista de Modalidades de Extensão */}
            <div className="space-y-3 pt-1">
              {EXTENSION_ITEMS.map((item) => {
                const val = data[item.key] || 0;
                const cr = Math.round(val / 15);
                const itemPct = Math.min(100, Math.round((val / item.max) * 100));
                const isMaxed = val >= item.max;
                const isDrawerOpen = !!openDrawers[item.key];

                return (
                  <div
                    key={item.key}
                    className="bg-white border-2 border-[#0A0A0A] rounded-[4px] p-3 shadow-[1.5px_1.5px_0px_#0A0A0A]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <i className={`bi ${item.icon} text-base text-[#8B1E2D]`} aria-hidden="true" />
                          <span className="font-['Oswald'] text-xs uppercase font-bold text-[#0A0A0A]">
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] text-gray-600 bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[#DFDBD2]">
                            {item.code}
                          </span>
                          <span className="font-mono text-[10px] text-[#8B1E2D] font-bold">
                            {item.creditsLabel}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                          {item.desc}
                        </p>

                        {/* Mini Progress Track */}
                        <div className="cagp-calc-mini-track" aria-hidden="true">
                          <div
                            className={`cagp-calc-mini-fill ${isMaxed ? 'is-maxed' : ''}`}
                            style={{ width: `${itemPct}%` }}
                          />
                        </div>

                        {/* Botão Gaveta "O que conta nisso?" */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => toggleDrawer(item.key)}
                            aria-expanded={isDrawerOpen}
                            aria-controls={`drawer-${item.key}`}
                            className="cagp-calc-drawer-toggle"
                          >
                            <i className="bi bi-info-circle-fill text-[#8B1E2D]" aria-hidden="true" />
                            <span>O que conta nisso?</span>
                            <i className="bi bi-chevron-down cagp-drawer-arrow" aria-hidden="true" />
                          </button>

                          {!isMaxed && (
                            <button
                              type="button"
                              onClick={() => updateItemHours(item.key, item.max, item.max)}
                              className="text-[10px] font-mono font-bold uppercase text-gray-600 hover:text-[#8B1E2D] bg-[#F7F5F0] hover:bg-gray-200 px-2 py-1 rounded border border-[#DFDBD2] transition-colors cursor-pointer mt-1.5"
                              title={`Preencher até o teto regulamentar de ${item.max}h`}
                            >
                              Teto ({item.max}h)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Controles de Passo (+ / -) */}
                      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DFDBD2]">
                        <button
                          type="button"
                          onClick={() => handleStep(item, -item.step)}
                          disabled={val <= 0}
                          aria-label={`Remover horas de ${item.label}`}
                          className="cagp-step-btn"
                        >
                          −
                        </button>

                        <div className="cagp-calc-readout">
                          <div className="text-sm font-bold text-[#0A0A0A]">
                            {val}h
                          </div>
                          <div className="text-[10px] font-mono text-gray-500">
                            ({cr} cr / {item.max}h)
                          </div>
                          {isMaxed && (
                            <span className="inline-block mt-0.5 bg-[#15803D] text-white text-[10px] font-mono font-bold px-1 py-0.5 rounded">
                              TETO
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStep(item, item.step)}
                          disabled={val >= item.max}
                          aria-label={`Adicionar horas de ${item.label}`}
                          className="cagp-step-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Gaveta Expansível de Critérios Normativos */}
                    <div
                      id={`drawer-${item.key}`}
                      className={`cagp-calc-drawer ${isDrawerOpen ? 'is-open' : ''}`}
                      role="region"
                      aria-label={`Critérios regulamentares de ${item.label}`}
                    >
                      <div className="cagp-calc-drawer-inner">
                        <div className="cagp-calc-drawer-grid">
                          {/* O Que Conta */}
                          <div className="cagp-calc-drawer-section is-accepted">
                            <div className="cagp-calc-drawer-header">
                              <span className="font-['Oswald'] text-xs uppercase font-bold text-[#15803D] flex items-center gap-1">
                                <i className="bi bi-check-circle-fill" aria-hidden="true" />
                                <span>O QUE CONTA</span>
                              </span>
                            </div>
                            <ul>
                              {item.accepted.map((acc, i) => (
                                <li key={i}>{acc}</li>
                              ))}
                            </ul>
                          </div>

                          {/* O Que Não Conta */}
                          <div className="cagp-calc-drawer-section is-rejected">
                            <div className="cagp-calc-drawer-header">
                              <span className="font-['Oswald'] text-xs uppercase font-bold text-[#DC2626] flex items-center gap-1">
                                <i className="bi bi-x-circle-fill" aria-hidden="true" />
                                <span>O QUE NÃO CONTA</span>
                              </span>
                            </div>
                            <ul>
                              {item.rejected.map((rej, i) => (
                                <li key={i}>{rej}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {item.alertNote && (
                          <div className="cagp-calc-drawer-alert">
                            <i className="bi bi-exclamation-triangle-fill text-[#B45309] me-1" aria-hidden="true" />
                            <strong>Atenção:</strong> {item.alertNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              COLUNA 2: ATIVIDADES COMPLEMENTARES AAC (ATÉ 300H)
              ========================================================= */}
          <div className="bg-[#FBF8F3] border-2 border-[#0A0A0A] rounded-[6px] shadow-[2px_2px_0px_#0A0A0A] p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-2 flex-wrap gap-2">
              <div>
                <h4 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] flex items-center gap-2">
                  <i className="bi bi-mortarboard-fill text-[#8B1E2D]" aria-hidden="true" />
                  <span>2. Horas Complementares AAC (Teto: 300h)</span>
                </h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Abatem créditos optativos respeitando os limites do <strong>Art. 15</strong>:
                </p>
              </div>
              <span className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded border ${
                capAac >= 300
                  ? 'bg-green-100 text-green-900 border-green-400'
                  : 'bg-[#1E3F66]/10 text-[#1E3F66] border-[#1E3F66]/30'
              }`}>
                {capAac}h / 300h ({aacCr} cr)
              </span>
            </div>

            {/* Barra de Progresso de AAC */}
            <div className="w-full bg-[#eae5dc] rounded-full h-2.5 overflow-hidden border border-[#0A0A0A]">
              <div
                className={`h-full transition-all duration-300 ${capAac >= 300 ? 'bg-[#15803D]' : 'bg-[#1E3F66]'}`}
                style={{ width: `${aacPct}%` }}
                role="progressbar"
                aria-valuenow={capAac}
                aria-valuemin={0}
                aria-valuemax={300}
              />
            </div>

            {/* Lista de Modalidades AAC */}
            <div className="space-y-3 pt-1">
              {AAC_ITEMS.map((item) => {
                const val = data[item.key] || 0;
                const cr = Math.round(val / 15);
                const itemPct = Math.min(100, Math.round((val / item.max) * 100));
                const isMaxed = val >= item.max;
                const isDrawerOpen = !!openDrawers[item.key];

                return (
                  <div
                    key={item.key}
                    className={`bg-white border-2 rounded-[4px] p-3 shadow-[1.5px_1.5px_0px_#0A0A0A] ${
                      item.has120dDeadline ? 'border-[#DC2626]/70' : 'border-[#0A0A0A]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <i className={`bi ${item.icon} text-base text-[#8B1E2D]`} aria-hidden="true" />
                          <span className="font-['Oswald'] text-xs uppercase font-bold text-[#0A0A0A]">
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] text-gray-600 bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[#DFDBD2]">
                            {item.code}
                          </span>
                          <span className="font-mono text-[10px] text-[#8B1E2D] font-bold">
                            {item.creditsLabel}
                          </span>
                          {item.has120dDeadline && (
                            <span className="inline-flex items-center gap-1 bg-[#DC2626] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                              <i className="bi bi-alarm-fill" aria-hidden="true" />
                              <span>PRAZO 120D!</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                          {item.desc}
                        </p>

                        {/* Mini Progress Track */}
                        <div className="cagp-calc-mini-track" aria-hidden="true">
                          <div
                            className={`cagp-calc-mini-fill ${isMaxed ? 'is-maxed' : ''}`}
                            style={{ width: `${itemPct}%` }}
                          />
                        </div>

                        {/* Botão Gaveta "O que conta nisso?" */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => toggleDrawer(item.key)}
                            aria-expanded={isDrawerOpen}
                            aria-controls={`drawer-${item.key}`}
                            className="cagp-calc-drawer-toggle"
                          >
                            <i className="bi bi-info-circle-fill text-[#8B1E2D]" aria-hidden="true" />
                            <span>O que conta nisso?</span>
                            <i className="bi bi-chevron-down cagp-drawer-arrow" aria-hidden="true" />
                          </button>

                          {!isMaxed && (
                            <button
                              type="button"
                              onClick={() => updateItemHours(item.key, item.max, item.max)}
                              className="text-[10px] font-mono font-bold uppercase text-gray-600 hover:text-[#8B1E2D] bg-[#F7F5F0] hover:bg-gray-200 px-2 py-1 rounded border border-[#DFDBD2] transition-colors cursor-pointer mt-1.5"
                              title={`Preencher até o teto regulamentar de ${item.max}h`}
                            >
                              Teto ({item.max}h)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Controles de Passo (+ / -) */}
                      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DFDBD2]">
                        <button
                          type="button"
                          onClick={() => handleStep(item, -item.step)}
                          disabled={val <= 0}
                          aria-label={`Remover horas de ${item.label}`}
                          className="cagp-step-btn"
                        >
                          −
                        </button>

                        <div className="cagp-calc-readout">
                          <div className="text-sm font-bold text-[#0A0A0A]">
                            {val}h
                          </div>
                          <div className="text-[10px] font-mono text-gray-500">
                            ({cr} cr / {item.max}h)
                          </div>
                          {isMaxed && (
                            <span className="inline-block mt-0.5 bg-[#15803D] text-white text-[10px] font-mono font-bold px-1 py-0.5 rounded">
                              TETO
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStep(item, item.step)}
                          disabled={val >= item.max}
                          aria-label={`Adicionar horas de ${item.label}`}
                          className="cagp-step-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Gaveta Expansível de Critérios Normativos */}
                    <div
                      id={`drawer-${item.key}`}
                      className={`cagp-calc-drawer ${isDrawerOpen ? 'is-open' : ''}`}
                      role="region"
                      aria-label={`Critérios regulamentares de ${item.label}`}
                    >
                      <div className="cagp-calc-drawer-inner">
                        <div className="cagp-calc-drawer-grid">
                          {/* O Que Conta */}
                          <div className="cagp-calc-drawer-section is-accepted">
                            <div className="cagp-calc-drawer-header">
                              <span className="font-['Oswald'] text-xs uppercase font-bold text-[#15803D] flex items-center gap-1">
                                <i className="bi bi-check-circle-fill" aria-hidden="true" />
                                <span>O QUE CONTA</span>
                              </span>
                            </div>
                            <ul>
                              {item.accepted.map((acc, i) => (
                                <li key={i}>{acc}</li>
                              ))}
                            </ul>
                          </div>

                          {/* O Que Não Conta */}
                          <div className="cagp-calc-drawer-section is-rejected">
                            <div className="cagp-calc-drawer-header">
                              <span className="font-['Oswald'] text-xs uppercase font-bold text-[#DC2626] flex items-center gap-1">
                                <i className="bi bi-x-circle-fill" aria-hidden="true" />
                                <span>O QUE NÃO CONTA</span>
                              </span>
                            </div>
                            <ul>
                              {item.rejected.map((rej, i) => (
                                <li key={i}>{rej}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {item.alertNote && (
                          <div className="cagp-calc-drawer-alert">
                            <i className="bi bi-exclamation-triangle-fill text-[#DC2626] me-1" aria-hidden="true" />
                            <strong>{item.alertNote}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de Fechamento da Calculadora: Protocolo e Formulário Oficial N-20229 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 mt-4 border-2 border-[#0A0A0A] bg-[#F7F5F0] rounded-[6px]">
          <div>
            <div className="font-['Oswald'] text-sm font-bold uppercase text-[#0A0A0A] flex items-center gap-1.5">
              <i className="bi bi-file-earmark-check text-[#8B1E2D]" aria-hidden="true" />
              <span>Protocolo no Colegiado (Sala F-2039 com Norma Guedes)</span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              Baixe o Requerimento Oficial N-20229 em PDF, anexe seus comprovantes autenticáveis e entregue na Secretaria do Curso ou via e-mail coordgestaopublica@gmail.com.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={asset('/documentos/requerimento-atividade-integralizadora-credito-v20229.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1E2D] text-white font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#9E2424] transition-colors"
            >
              <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
              <span>Baixar N-20229 (PDF)</span>
            </a>
            <button
              type="button"
              onClick={() => downloadAac120dIcs()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#0A0A0A] font-['Oswald'] text-xs uppercase font-bold rounded-[4px] border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] hover:bg-[#eae5dc] transition-colors active:translate-x-0.5 active:translate-y-0.5"
            >
              <i className="bi bi-calendar-plus text-[#8B1E2D]" aria-hidden="true" />
              <span>Lembrete Protocolo (.ics)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
