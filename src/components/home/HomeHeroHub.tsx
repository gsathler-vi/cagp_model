import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { AvatarRenderer } from '../passport/AvatarRenderer';
import { TALENT_CATEGORIES } from '../passport/talentConstants';
import { downloadRu1815Ics, downloadCircular2230Ics } from '../../lib/ics';

const TALENT_LABEL_MAP: Record<string, string> = Object.fromEntries(
  TALENT_CATEGORIES.map((c) => [c.key, c.label])
);

export const HomeHeroHub: React.FC = () => {
  const [profile, setProfile] = useState<VaultData<'cagp_student_profile_v1'>>({
    name: 'Estudante de Gestão Pública',
    period: '1º Período',
    pronouns: '',
    semester: '2026/1',
    pathway: '01-01',
    avatarPreset: 'candangos',
    prideChoice: 'none',
    interests: [],
  });

  const [obrigCount, setObrigCount] = useState<number>(0);
  const [extHours, setExtHours] = useState<number>(0);
  const [notifs, setNotifs] = useState<VaultData<'cagp_notifications_prefs_v1'>>({
    ru1815: false,
    circular2230: false,
    aac120d: true,
  });

  const loadData = () => {
    if (typeof window === 'undefined') return;
    setProfile(getVaultItem('cagp_student_profile_v1'));

    const calcData = getVaultItem('cagp_calc_ext_aac_v1');
    const sum = Object.values(calcData).reduce((a, b) => a + (Number(b) || 0), 0);
    setExtHours(Math.min(600, sum));

    const grade = getVaultItem('cagp_minha_grade_v1');
    setObrigCount(grade.savedCourses ? grade.savedCourses.length : 0);

    setNotifs(getVaultItem('cagp_notifications_prefs_v1'));
  };

  useEffect(() => {
    loadData();

    const handleVaultUpdated = () => {
      loadData();
    };

    window.addEventListener('cagp:vault-updated', handleVaultUpdated);
    window.addEventListener('focus', loadData);

    return () => {
      window.removeEventListener('cagp:vault-updated', handleVaultUpdated);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const openPassportSheet = () => {
    window.dispatchEvent(new CustomEvent('cagp:open-passport'));
  };

  const openCampusSheet = () => {
    window.dispatchEvent(new CustomEvent('cagp:open-campus'));
    window.dispatchEvent(new CustomEvent('cagp:open-campus-sheet'));
  };

  const toggleNotif = (key: 'ru1815' | 'circular2230' | 'aac120d') => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    setVaultItem('cagp_notifications_prefs_v1', updated);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (typeof window !== 'undefined' && (window as unknown as { cagpToast?: (msg: string, icon?: string) => void }).cagpToast) {
      const msg = updated[key] ? 'Alerta ativado com sucesso!' : 'Alerta desativado.';
      (window as unknown as { cagpToast: (msg: string, icon?: string) => void }).cagpToast(msg, 'bi-bell-fill');
    }
  };

  const obrigPct = Math.min(100, Math.round((obrigCount / 27) * 100));
  const extPct = Math.min(100, Math.round((extHours / 600) * 100));
  const globalPct = Math.round((obrigPct + extPct) / 2);

  const stampLabel = `${profile.period.toUpperCase()} • ATIVO`;

  return (
    <div className="cagp-home-hero-hub mb-3 select-none">
      {/* ========================================================
          1. EXIBIÇÃO MOBILE (< lg) - Passaporte com Live Campus Strip (BUG-08)
          ======================================================== */}
      <div className="lg:hidden mb-2">
        <div
          id="hero-panel-passport"
          className="cagp-passport-card animate-in fade-in duration-150"
        >
          {/* Live Campus Strip Integrada (Substitui duplo tablist BUG-08) */}
          <div className="bg-[#1C1E22] text-[#F5F3EF] px-3 py-2 flex items-center justify-between gap-2 border-b-2 border-[#0A0A0A] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] cagp-pulse-indicator shrink-0" />
              <div className="truncate">
                <span className="font-['Oswald'] uppercase font-bold text-[#E8A317] mr-1.5">
                  Plantão Noturno
                </span>
                <span className="text-gray-300 font-mono text-[11px] truncate">
                  RU II até 19h30 • Circular até 22h45
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={openCampusSheet}
              className="shrink-0 text-xs font-['Oswald'] uppercase font-bold text-white hover:text-[#FFE082] bg-white/10 hover:bg-white/20 border border-white/20 rounded px-2.5 py-1.5 transition-colors cursor-pointer inline-flex items-center gap-1 min-h-[44px]"
              aria-label="Abrir status completo do Campus FAFICH"
            >
              <i className="bi bi-clock-history text-[#E8A317]" aria-hidden="true" />
              <span>Campus Agora</span>
              <i className="bi bi-chevron-right text-[10px]" aria-hidden="true" />
            </button>
          </div>

          <div className="cagp-passport-topbar">
            <div className="cagp-passport-inst">
              <i className="bi bi-bank2 text-[#E8A317]" aria-hidden="true" />
              <span className="truncate">UFMG • FAFICH • CAGP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="cagp-passport-stamp">{stampLabel}</span>
              <button
                type="button"
                onClick={openPassportSheet}
                className="text-xs font-['Oswald'] uppercase font-bold text-white hover:text-[#FFE082] bg-white/10 hover:bg-white/20 border border-white/30 rounded px-3 py-1.5 transition-colors cursor-pointer inline-flex items-center gap-1.5 min-h-[44px]"
                aria-label="Editar Passaporte Discente e Foto"
              >
                <i className="bi bi-pencil-square" aria-hidden="true" />
                <span>Editar</span>
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-4 flex flex-wrap items-center gap-3">
            <AvatarRenderer
              profile={profile}
              sizeClass="cagp-avatar-frame--lg"
              showCameraBadge
              onClick={openPassportSheet}
              title="Clique para personalizar seu avatar"
            />

            <div className="flex-1 min-w-[170px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-['Oswald'] text-lg font-bold uppercase text-[#0A0A0A] leading-tight m-0">
                  {profile.name}
                </h3>
                {profile.pronouns && (
                  <span className="text-xs text-gray-500 font-mono">
                    ({profile.pronouns})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 mt-1">
                <span className="cagp-badge cagp-badge-red">{profile.period}</span>
                <span className="cagp-badge cagp-badge-dark font-mono">{profile.semester || '2026/1'}</span>
                <span className="cagp-badge cagp-badge-blue">{profile.pathway || '01-01'}</span>
              </div>
            </div>

            <div
              className="cagp-metric-ring shrink-0"
              style={{ '--ring-pct': globalPct } as React.CSSProperties}
              title="Índice Médio de Integralização"
            >
              <div className="cagp-metric-ring-inner">{globalPct}%</div>
            </div>
          </div>

          {/* Áreas de Interesse no Passaporte (Banco de Talentos) */}
          {profile.interests && profile.interests.length > 0 ? (
            <div className="px-3 sm:px-4 py-2 bg-[#F7F5F0] border-t border-[#DFDBD2] flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500 mr-1 flex items-center gap-1">
                <i className="bi bi-stars text-[#8B1E2D]" aria-hidden="true" />
                Interesses:
              </span>
              {profile.interests.map((key) => (
                <span
                  key={key}
                  className="text-[10px] font-semibold bg-white border border-[#DFDBD2] text-[#0A0A0A] px-2 py-0.5 rounded shadow-[1px_1px_0px_#0A0A0A]"
                >
                  {TALENT_LABEL_MAP[key] || key}
                </span>
              ))}
            </div>
          ) : (
            <div className="px-3 sm:px-4 py-2 bg-[#F7F5F0] border-t border-[#DFDBD2] flex items-center justify-between gap-2">
              <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <i className="bi bi-stars text-[#8B1E2D]" aria-hidden="true" />
                Banco de Talentos: cadastre seus interesses
              </span>
              <button
                type="button"
                onClick={openPassportSheet}
                className="text-[10px] font-['Oswald'] font-bold text-[#8B1E2D] hover:underline uppercase cursor-pointer"
              >
                + Configurar
              </button>
            </div>
          )}

          <div className="cagp-passport-progress-grid mb-1 px-3 sm:px-4 pb-3 pt-2">
            <div className="cagp-passport-progress-item">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
                  27 Obrigatórias
                </span>
                <span className="font-mono font-bold text-[11px] text-[#005A9C]">
                  {obrigCount}/27 ({obrigPct}%)
                </span>
              </div>
              <div className="cagp-passport-mini-track" aria-hidden="true">
                <div
                  className="cagp-passport-mini-fill is-obrig"
                  style={{ width: `${obrigPct}%` }}
                />
              </div>
            </div>

            <div className="cagp-passport-progress-item">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
                  Extensão & AAC (600h)
                </span>
                <span className="font-mono font-bold text-[11px] text-[#15803D]">
                  {extHours}h/600h ({extPct}%)
                </span>
              </div>
              <div className="cagp-passport-mini-track" aria-hidden="true">
                <div
                  className="cagp-passport-mini-fill is-acg"
                  style={{ width: `${extPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ações Rápidas Mobile */}
          <div className="p-2.5 bg-white border-t border-[#DFDBD2] flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPassportSheet}
              className="cagp-btn-secondary text-xs py-1.5 px-3 flex-1 justify-center cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <i className="bi bi-person-gear text-[#8B1E2D]" aria-hidden="true" />
              <span>Personalizar Passaporte</span>
            </button>
            <button
              type="button"
              onClick={openCampusSheet}
              className="cagp-btn-outline text-xs py-1.5 px-3 cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <i className="bi bi-clock-history text-[#8B1E2D]" aria-hidden="true" />
              <span>Campus Agora</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. EXIBIÇÃO PANORÂMICA NO DESKTOP (lg+) - 2 Colunas Lado a Lado
          ======================================================== */}
      <div className="hidden lg:grid grid-cols-12 gap-3.5 items-stretch">
        {/* Coluna Esquerda (7 colunas): Passaporte Discente */}
        <div className="col-span-7 cagp-passport-card m-0 flex flex-col justify-between">
          <div>
            <div className="cagp-passport-topbar">
              <div className="cagp-passport-inst">
                <i className="bi bi-bank2 text-[#E8A317]" aria-hidden="true" />
                <span>UFMG • FAFICH • CENTRO ACADÊMICO DE GESTÃO PÚBLICA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="cagp-passport-stamp">{stampLabel}</span>
                <button
                  type="button"
                  onClick={openPassportSheet}
                  className="text-xs font-['Oswald'] uppercase font-bold text-white hover:text-[#FFE082] bg-white/10 hover:bg-white/20 border border-white/30 rounded px-3 py-1.5 transition-colors cursor-pointer inline-flex items-center gap-1.5 min-h-[44px]"
                  aria-label="Editar Passaporte Discente e Foto"
                >
                  <i className="bi bi-pencil-square" aria-hidden="true" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AvatarRenderer
                  profile={profile}
                  sizeClass="cagp-avatar-frame--lg"
                  showCameraBadge
                  onClick={openPassportSheet}
                  title="Clique para personalizar seu avatar"
                />

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-['Oswald'] text-lg font-bold uppercase text-[#0A0A0A] leading-tight m-0">
                      {profile.name}
                    </h3>
                    {profile.pronouns && (
                      <span className="text-xs text-gray-500 font-mono">
                        ({profile.pronouns})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    <span className="cagp-badge cagp-badge-red">{profile.period}</span>
                    <span className="cagp-badge cagp-badge-dark font-mono">Ingresso {profile.semester || '2026/1'}</span>
                    <span className="cagp-badge cagp-badge-blue">{profile.pathway || '01-01'} • Geral</span>
                  </div>
                </div>
              </div>

              <div
                className="cagp-metric-ring shrink-0"
                style={{ '--ring-pct': globalPct } as React.CSSProperties}
                title="Índice Médio de Integralização"
              >
                <div className="cagp-metric-ring-inner">{globalPct}%</div>
              </div>
            </div>

            {/* Áreas de Interesse no Passaporte (Banco de Talentos) Desktop */}
            {profile.interests && profile.interests.length > 0 ? (
              <div className="px-3.5 py-2 bg-[#F7F5F0] border-t border-[#DFDBD2] flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500 mr-1 flex items-center gap-1">
                  <i className="bi bi-stars text-[#8B1E2D]" aria-hidden="true" />
                  Interesses:
                </span>
                {profile.interests.map((key) => (
                  <span
                    key={key}
                    className="text-[10px] font-semibold bg-white border border-[#DFDBD2] text-[#0A0A0A] px-2 py-0.5 rounded shadow-[1px_1px_0px_#0A0A0A]"
                  >
                    {TALENT_LABEL_MAP[key] || key}
                  </span>
                ))}
              </div>
            ) : (
              <div className="px-3.5 py-2 bg-[#F7F5F0] border-t border-[#DFDBD2] flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                  <i className="bi bi-stars text-[#8B1E2D]" aria-hidden="true" />
                  Banco de Talentos: cadastre seus interesses no Passaporte
                </span>
                <button
                  type="button"
                  onClick={openPassportSheet}
                  className="text-[10px] font-['Oswald'] font-bold text-[#8B1E2D] hover:underline uppercase cursor-pointer"
                >
                  + Configurar
                </button>
              </div>
            )}
          </div>

          <div className="cagp-passport-progress-grid px-3.5 pb-2 pt-2 border-t border-[#DFDBD2]/60">
            <div className="cagp-passport-progress-item">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
                  Disciplinas Obrigatórias (27)
                </span>
                <span className="font-mono font-bold text-[11px] text-[#005A9C]">
                  {obrigCount}/27 ({obrigPct}%)
                </span>
              </div>
              <div className="cagp-passport-mini-track" aria-hidden="true">
                <div
                  className="cagp-passport-mini-fill is-obrig"
                  style={{ width: `${obrigPct}%` }}
                />
              </div>
            </div>

            <div className="cagp-passport-progress-item">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
                  Extensão & AAC (600h)
                </span>
                <span className="font-mono font-bold text-[11px] text-[#15803D]">
                  {extHours}h/600h ({extPct}%)
                </span>
              </div>
              <div className="cagp-passport-mini-track" aria-hidden="true">
                <div
                  className="cagp-passport-mini-fill is-acg"
                  style={{ width: `${extPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Barra de Ações do Passaporte no Desktop */}
          <div className="p-2.5 bg-white border-t border-[#DFDBD2] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={openPassportSheet}
              className="cagp-btn-secondary text-xs py-1.5 px-3 flex-1 justify-center cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <i className="bi bi-person-gear text-[#8B1E2D]" aria-hidden="true" />
              <span>Personalizar Passaporte & Talentos</span>
            </button>
            <button
              type="button"
              onClick={openCampusSheet}
              className="cagp-btn-outline text-xs py-1.5 px-3 cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <i className="bi bi-clock-history text-[#8B1E2D]" aria-hidden="true" />
              <span>Campus Agora</span>
            </button>
          </div>
        </div>

        {/* Coluna Direita (5 colunas): UFMG no Agora & Plantão Noturno com Alertas Integrados */}
        <div className="col-span-5 bg-white border-2 border-[#0A0A0A] rounded-md p-3.5 shadow-[3px_3px_0px_#0A0A0A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#15803D]/10 border border-[#15803D]/30 text-[#15803D] font-mono font-bold text-xs uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#15803D] cagp-pulse-indicator" />
                  UFMG no Agora
                </span>
                <span className="font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A]">
                  Plantão Noturno
                </span>
              </div>

              <button
                type="button"
                onClick={openCampusSheet}
                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#8B1E2D] hover:underline cursor-pointer"
                aria-label="Abrir detalhes operacionais do Campus"
              >
                <span>Painel Completo</span>
                <i className="bi bi-chevron-right text-xs" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* 1. RU II Setorial */}
              <div className="p-2 rounded-[4px] bg-[#F7F5F0] border border-[#DFDBD2] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-['Oswald'] font-bold uppercase text-[#0A0A0A] block">RU II Setorial</span>
                    <span className="font-mono text-[10px] font-bold">R$ 5,60</span>
                  </div>
                  <span className="text-gray-600 block text-[11px] mt-0.5">Jantar: <strong>17h30–19h30</strong></span>
                  <span className="text-[10px] text-red-700 block font-semibold">Fecha às 19h30</span>
                </div>
                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-[#DFDBD2]">
                  <button
                    type="button"
                    onClick={() => toggleNotif('ru1815')}
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer flex-1 text-center ${
                      notifs.ru1815
                        ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]'
                        : 'bg-white text-gray-700 border-[#DFDBD2] hover:bg-gray-100'
                    }`}
                  >
                    {notifs.ru1815 ? '🔔 18h15 Ativo' : 'Alarme 18h15'}
                  </button>
                  <button
                    type="button"
                    onClick={downloadRu1815Ics}
                    className="text-[10px] font-mono px-1 py-0.5 rounded bg-white border border-[#DFDBD2] hover:bg-gray-100"
                    title="Baixar evento na agenda (.ics)"
                  >
                    .ics
                  </button>
                </div>
              </div>

              {/* 2. Circular Noturno */}
              <div className="p-2 rounded-[4px] bg-[#F7F5F0] border border-[#DFDBD2] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-['Oswald'] font-bold uppercase text-[#0A0A0A] block">Circular Noturno</span>
                    <span className="font-mono text-[10px] text-gray-500">17h–22h45</span>
                  </div>
                  <span className="text-gray-600 block text-[11px] mt-0.5">Saídas: <strong>22h15/35/45</strong></span>
                  <span className="text-[10px] text-gray-500 block">Praça Serviços</span>
                </div>
                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-[#DFDBD2]">
                  <button
                    type="button"
                    onClick={() => toggleNotif('circular2230')}
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer flex-1 text-center ${
                      notifs.circular2230
                        ? 'bg-[#8B1E2D] text-white border-[#0A0A0A]'
                        : 'bg-white text-gray-700 border-[#DFDBD2] hover:bg-gray-100'
                    }`}
                  >
                    {notifs.circular2230 ? '🔔 22h30 Ativo' : 'Alarme 22h30'}
                  </button>
                  <button
                    type="button"
                    onClick={downloadCircular2230Ics}
                    className="text-[10px] font-mono px-1 py-0.5 rounded bg-white border border-[#DFDBD2] hover:bg-gray-100"
                    title="Baixar evento na agenda (.ics)"
                  >
                    .ics
                  </button>
                </div>
              </div>

              {/* 3. Secretaria Sala F-2039 */}
              <div className="p-2 rounded-[4px] bg-[#F7F5F0] border border-[#DFDBD2]">
                <span className="font-['Oswald'] font-bold uppercase text-[#0A0A0A] block">Secretaria Sala F-2039</span>
                <span className="text-gray-600 block text-[11px] mt-0.5">Norma Guedes · 08h–20h</span>
                <span className="font-mono text-[10px] text-gray-500 block mt-0.5">CEAG: 08h–22h</span>
              </div>

              {/* 4. Guardião 120 Dias */}
              <div className="p-2 rounded-[4px] bg-[#F7F5F0] border border-[#DFDBD2] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Oswald'] font-bold uppercase text-[#0A0A0A] block">Guardião 120d</span>
                    <button
                      type="button"
                      onClick={() => toggleNotif('aac120d')}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                        notifs.aac120d
                          ? 'bg-[#15803D] text-white border-[#0A0A0A]'
                          : 'bg-white text-gray-700 border-[#DFDBD2]'
                      }`}
                    >
                      {notifs.aac120d ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <span className="text-gray-600 block text-[11px] mt-0.5">Prazo fatal Art. 15, § 4º</span>
                </div>
                <span className="font-mono text-[10px] text-[#B45309] font-bold mt-1">Eventos &amp; Anais</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#DFDBD2] flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Colegiado DCP • FAFICH</span>
            <span className="text-[#15803D] font-bold flex items-center gap-1">
              <i className="bi bi-check-circle-fill text-[10px]" /> Operação Normal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
