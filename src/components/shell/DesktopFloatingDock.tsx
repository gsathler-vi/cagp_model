import React, { useState, useEffect } from 'react';
import {
  SHORTCUTS_CATALOG,
  DEFAULT_SHORTCUT_IDS,
  resolveShortcuts,
  type ShortcutItem,
} from '../../lib/shortcutsCatalog';
import { getVaultItem } from '../../lib/storage/studentVault';

export const DesktopFloatingDock: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() =>
    resolveShortcuts(DEFAULT_SHORTCUT_IDS)
  );
  const [showDesktopDock, setShowDesktopDock] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateFromVault = () => {
    const stored = getVaultItem('cagp_discente_shortcuts_v1');
    if (Array.isArray(stored) && stored.length > 0) {
      setShortcuts(resolveShortcuts(stored));
    } else {
      setShortcuts(resolveShortcuts(DEFAULT_SHORTCUT_IDS));
    }

    const a11y = getVaultItem('cagp_a11y_prefs_v2');
    setShowDesktopDock(Boolean(a11y?.showDesktopDock));
  };

  const updatePath = () => {
    if (typeof window === 'undefined') return;
    const baseUrl = (document.documentElement.dataset.baseUrl || '/').replace(/\/$/, '');
    let path = window.location.pathname;
    if (baseUrl && path.startsWith(baseUrl)) {
      path = path.slice(baseUrl.length) || '/';
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    updateFromVault();
    updatePath();

    const handleVaultUpdated = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === 'cagp_discente_shortcuts_v1' || custom.detail.key === 'cagp_a11y_prefs_v2') {
        updateFromVault();
      }
    };

    const handlePageLoad = () => {
      updatePath();
      updateFromVault();
    };

    window.addEventListener('cagp:vault-updated', handleVaultUpdated);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      window.removeEventListener('cagp:vault-updated', handleVaultUpdated);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, []);

  const isItemActive = (item: ShortcutItem) => {
    if (!item.match || item.match.length === 0) return false;
    return item.match.some((pattern) => {
      const reg = new RegExp(pattern);
      return reg.test(currentPath) || (pattern === '^/$' && (currentPath === '' || currentPath === '/index.html'));
    });
  };

  const handleAction = (item: ShortcutItem, e: React.MouseEvent) => {
    if (item.isAction && item.actionEvent) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent(item.actionEvent));
    }
  };

  const handleOpenCustomize = () => {
    window.dispatchEvent(new CustomEvent('cagp:open-shortcuts'));
  };

  if (!showDesktopDock) return null;

  return (
    <aside
      className="hidden lg:flex fixed left-1/2 -translate-x-1/2 z-[1035] select-none pointer-events-none items-center justify-center transition-all duration-300"
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Dock de Atalhos Rápidos Discentes"
    >
      <nav
        className="pointer-events-auto bg-white/95 backdrop-blur-md border border-black/15 shadow-sm rounded-full px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-200 hover:shadow-md"
        role="toolbar"
        aria-label="Atalhos rápidos customizáveis"
      >
        {shortcuts.map((item) => {
          const active = isItemActive(item);
          const isHovered = hoveredId === item.id;

          const buttonContent = (
            <div
              className={`relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer min-w-[44px] min-h-[44px] ${
                active
                  ? 'w-11 h-11 bg-[#8B1E2D] text-white shadow-xs scale-105'
                  : 'w-11 h-11 text-gray-700 hover:bg-[#F7F5F0] hover:text-[#8B1E2D] hover:scale-110 active:scale-95'
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={item.fullLabel}
            >
              <i className={`bi ${item.icon} text-lg`} aria-hidden="true"></i>

              {/* Tooltip Dinâmico Apple HIG */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#0A0A0A] text-white text-[11px] font-['Oswald'] uppercase font-bold tracking-wider rounded-[4px] whitespace-nowrap shadow-sm pointer-events-none z-[1050] animate-in fade-in zoom-in-95 duration-150">
                  <span>{item.label}</span>
                  <div className="w-1.5 h-1.5 bg-[#0A0A0A] rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                </div>
              )}

              {/* Indicador de Rota Ativa */}
              {active && (
                <span
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#8B1E2D] ring-2 ring-white"
                  aria-hidden="true"
                />
              )}
            </div>
          );

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleAction(item, e)}
                className="no-underline border-none bg-transparent p-0 flex items-center justify-center"
                aria-label={item.fullLabel}
              >
                {buttonContent}
              </button>
            );
          }

          return (
            <a
              key={item.id}
              href={item.href}
              className="no-underline text-inherit flex items-center justify-center"
              aria-label={item.fullLabel}
              aria-current={active ? 'page' : undefined}
            >
              {buttonContent}
            </a>
          );
        })}

        {/* Separador Visual Apple Dock */}
        <div className="h-6 w-[1.5px] bg-[#DFDBD2] mx-1" aria-hidden="true" />

        {/* Botão de Personalização dos Atalhos */}
        <button
          type="button"
          onClick={handleOpenCustomize}
          className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-gray-500 hover:text-[#0A0A0A] hover:bg-[#F7F5F0] transition-all cursor-pointer active:scale-95"
          title="Personalizar atalhos do dock"
          aria-label="Personalizar atalhos do dock"
          onMouseEnter={() => setHoveredId('customize')}
          onMouseLeave={() => setHoveredId(null)}
        >
          <i className="bi bi-sliders2 text-base" aria-hidden="true"></i>

          {hoveredId === 'customize' && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#0A0A0A] text-white text-[11px] font-['Oswald'] uppercase font-bold tracking-wider rounded-[4px] whitespace-nowrap shadow-sm pointer-events-none z-[1050]">
              Personalizar
              <div className="w-1.5 h-1.5 bg-[#0A0A0A] rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
            </div>
          )}
        </button>
      </nav>
    </aside>
  );
};
