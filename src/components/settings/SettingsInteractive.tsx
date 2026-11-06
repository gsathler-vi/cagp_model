import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData, VaultDefaults, getAllVaultData, applyA11yPrefsToDOM } from '../../lib/storage/studentVault';
import { exportVaultBackup, importVaultBackup } from '../../lib/storage/backupVault';
import { asset } from '../../lib/paths';
import { SettingsA11ySection } from './SettingsA11ySection';
import { SettingsAlertsSection } from './SettingsAlertsSection';
import { SettingsVaultSection } from './SettingsVaultSection';

export const SettingsInteractive: React.FC = () => {
  const [a11y, setA11y] = useState<VaultData<'cagp_a11y_prefs_v2'>>(VaultDefaults.cagp_a11y_prefs_v2);

  const [notifs, setNotifs] = useState<VaultData<'cagp_notifications_prefs_v1'>>({
    ru1815: false,
    circular2230: false,
    aac120d: true,
  });

  const [vaultSize, setVaultSize] = useState<number>(0);
  const [backupInput, setBackupInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedA11y = getVaultItem('cagp_a11y_prefs_v2');
      const storedNotifs = getVaultItem('cagp_notifications_prefs_v1');
      setA11y(storedA11y);
      setNotifs(storedNotifs);
      applyA11yPrefsToDOM(storedA11y);

      const all = getAllVaultData();
      const bytes = new Blob([JSON.stringify(all)]).size;
      setVaultSize(bytes);
    }
  }, []);

  const updateA11y = (partial: Partial<VaultData<'cagp_a11y_prefs_v2'>>) => {
    const updated = { ...a11y, ...partial };
    setA11y(updated);
    setVaultItem('cagp_a11y_prefs_v2', updated);
    applyA11yPrefsToDOM(updated);
  };

  const updateNotifs = (partial: Partial<VaultData<'cagp_notifications_prefs_v1'>>) => {
    const updated = { ...notifs, ...partial };
    setNotifs(updated);
    setVaultItem('cagp_notifications_prefs_v1', updated);
  };

  const handleExportBackup = () => {
    const token = exportVaultBackup();
    navigator.clipboard.writeText(token);
    setFeedback({ text: 'Token de backup copiado com sucesso!', type: 'success' });
  };

  const handleImportBackup = () => {
    if (!backupInput.trim()) {
      setFeedback({ text: 'Insira um token CAGP1:... válido.', type: 'error' });
      return;
    }
    const res = importVaultBackup(backupInput.trim());
    if (res.success) {
      setFeedback({ text: `Backup restaurado! (${res.restoredKeys} chaves atualizadas)`, type: 'success' });
      setBackupInput('');
      const storedA11y = getVaultItem('cagp_a11y_prefs_v2');
      const storedNotifs = getVaultItem('cagp_notifications_prefs_v1');
      setA11y(storedA11y);
      setNotifs(storedNotifs);
      applyA11yPrefsToDOM(storedA11y);
    } else {
      setFeedback({ text: res.error || 'Erro na restauração.', type: 'error' });
    }
  };

  const handleResetVault = () => {
    if (window.confirm('Atenção: todos os dados locais do cofre serão redefinidos para os padrões. Deseja prosseguir?')) {
      localStorage.clear();
      setFeedback({ text: 'Cofre discente limpo. Recarregue a página.', type: 'success' });
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]'
              : 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]'
          }`}
        >
          <i
            className={`bi ${
              feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
            }`}
          />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 1. ACESSIBILIDADE UNIVERSAL */}
      <SettingsA11ySection a11y={a11y} updateA11y={updateA11y} />

      {/* 2. ALERTAS DO CAMPUS */}
      <SettingsAlertsSection notifs={notifs} updateNotifs={updateNotifs} />

      {/* 3. COFRE DISCENTE */}
      <SettingsVaultSection
        vaultSize={vaultSize}
        backupInput={backupInput}
        setBackupInput={setBackupInput}
        handleExportBackup={handleExportBackup}
        handleImportBackup={handleImportBackup}
        handleResetVault={handleResetVault}
      />

      {/* 4. REGIMENTOS, ATOS & TRANSPARÊNCIA */}
      <section className="bg-white border border-[#DFDBD2] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="border-b border-[#DFDBD2] pb-2">
          <h2 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] m-0">
            4. Regimentos, Atos & Transparência
          </h2>
          <p className="text-xs text-gray-500 m-0">Documentos mestres que regem a vida acadêmica discente</p>
        </div>

        <div className="cagp-grouped-list border border-[#DFDBD2] rounded-lg overflow-hidden">
          <a
            href={asset('/documentos/regimento-interno-cagp-ufmg.pdf')}
            download
            className="cagp-grouped-item"
          >
            <div className="cagp-grouped-item-content">
              <span className="cagp-grouped-item-title">Regimento Interno do CAGP (14/10/2024)</span>
              <span className="cagp-grouped-item-desc">Estatuto soberano aprovado pela Assembleia Geral Discente</span>
            </div>
            <i className="bi bi-chevron-right cagp-grouped-chevron" aria-hidden="true"></i>
          </a>
          <a
            href={asset('/documentos/regulamento-gestao-publica-ufmg.pdf')}
            download
            className="cagp-grouped-item"
          >
            <div className="cagp-grouped-item-content">
              <span className="cagp-grouped-item-title">Regulamento do Curso Versão N-20229</span>
              <span className="cagp-grouped-item-desc">Normas oficiais de AAC, estágio e culminância de TCC</span>
            </div>
            <i className="bi bi-chevron-right cagp-grouped-chevron" aria-hidden="true"></i>
          </a>
          <a
            href={asset('/documentos/ppc-gestao-publica-ufmg.pdf')}
            download
            className="cagp-grouped-item"
          >
            <div className="cagp-grouped-item-content">
              <span className="cagp-grouped-item-title">Projeto Pedagógico do Curso (PPC 2020)</span>
              <span className="cagp-grouped-item-desc">Estrutura curricular de 3.000h e perfil de formação discente</span>
            </div>
            <i className="bi bi-chevron-right cagp-grouped-chevron" aria-hidden="true"></i>
          </a>
        </div>
      </section>

      {/* 5. GOVERNANÇA E PWA */}
      <section className="bg-white border border-[#DFDBD2] rounded-xl p-4 text-xs text-gray-600 space-y-2">
        <div className="flex items-center justify-between font-['Oswald'] text-xs font-bold uppercase text-[#0A0A0A]">
          <span>Super App Discente CAGP UFMG</span>
          <span className="font-mono text-[10px] text-gray-400">Versão 3.0.0 (Astro 7)</span>
        </div>
        <p className="leading-relaxed m-0">
          Aplicativo estático progressivo (PWA) de custo zero e código aberto sob licença GPLv3. Desenvolvido para
          garantir autonomia, privacidade total e transparência aos estudantes do Bacharelado em Gestão Pública da
          FAFICH/UFMG.
        </p>
      </section>
    </div>
  );
};
