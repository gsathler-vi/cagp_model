import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { getVaultItem, setVaultItem, type VaultData, VaultDefaults, applyA11yPrefsToDOM } from '../../lib/storage/studentVault';
import { A11yTabContent } from './A11yTabContent';
import { SettingsTabContent } from './SettingsTabContent';

interface A11ySheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'a11y' | 'settings';
}

export const A11ySheet: React.FC<A11ySheetProps> = ({ isOpen, onClose, initialTab = 'a11y' }) => {
  const [activeTab, setActiveTab] = useState<'a11y' | 'settings'>(initialTab);
  const [prefs, setPrefs] = useState<VaultData<'cagp_a11y_prefs_v2'>>(VaultDefaults.cagp_a11y_prefs_v2);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = getVaultItem('cagp_a11y_prefs_v2');
      setPrefs(stored);
      applyA11yPrefsToDOM(stored);

      const handleA11yEvt = () => setActiveTab('a11y');
      const handleSettingsEvt = () => setActiveTab('settings');

      window.addEventListener('cagp:open-a11y', handleA11yEvt);
      window.addEventListener('cagp:open-settings', handleSettingsEvt);

      return () => {
        window.removeEventListener('cagp:open-a11y', handleA11yEvt);
        window.removeEventListener('cagp:open-settings', handleSettingsEvt);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const update = (partial: Partial<VaultData<'cagp_a11y_prefs_v2'>>) => {
    const updated = { ...prefs, ...partial };
    setPrefs(updated);
    setVaultItem('cagp_a11y_prefs_v2', updated);
    applyA11yPrefsToDOM(updated);
  };

  const title = activeTab === 'a11y' ? 'Acessibilidade Universal' : 'Configurações & Sincronização';

  return (
    <BottomSheet id="cagp-a11y-sheet" isOpen={isOpen} onClose={onClose} title={title} initialDetent="medium">
      <div className="space-y-4">
        {/* Segmented Control Unificado: Acessibilidade vs Configurações */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F5F0] rounded-xl border border-[#DFDBD2]">
          <button
            type="button"
            onClick={() => setActiveTab('a11y')}
            className={`py-2 px-3 text-xs font-['Oswald'] uppercase font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'a11y'
                ? 'bg-[#8B1E2D] text-white border border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                : 'text-gray-700 hover:text-[#0A0A0A]'
            }`}
          >
            <i className="bi bi-universal-access"></i> Acessibilidade
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 text-xs font-['Oswald'] uppercase font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#8B1E2D] text-white border border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                : 'text-gray-700 hover:text-[#0A0A0A]'
            }`}
          >
            <i className="bi bi-gear-fill"></i> Configurações
          </button>
        </div>

        {/* Tab 1: Acessibilidade */}
        {activeTab === 'a11y' && <A11yTabContent prefs={prefs} update={update} />}

        {/* Tab 2: Configurações & Dados */}
        {activeTab === 'settings' && <SettingsTabContent />}
      </div>
    </BottomSheet>
  );
};
