import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { PassportCard } from '../passport/PassportCard';
import { TalentBankEditor } from '../passport/TalentBankEditor';
import { getVaultItem, setVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { exportVaultBackup, importVaultBackup } from '../../lib/storage/backupVault';

interface PassportSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PassportSheet: React.FC<PassportSheetProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'passport' | 'talent'>('passport');
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
  const [backupInput, setBackupInput] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const p = getVaultItem('cagp_student_profile_v1');
      setProfile(p);
      const calcData = getVaultItem('cagp_calc_ext_aac_v1');
      const sum = Object.values(calcData).reduce((a, b) => a + (Number(b) || 0), 0);
      setExtHours(Math.min(600, sum));
      const grade = getVaultItem('cagp_minha_grade_v1');
      setObrigCount(grade.savedCourses ? grade.savedCourses.length : 0);
      setToastMsg(null);
      setBackupInput('');
    }
  }, [isOpen]);

  const handleSaveProfile = () => {
    setVaultItem('cagp_student_profile_v1', profile);
    setToastMsg({ text: 'Perfil discente salvo com sucesso no cofre local!', type: 'success' });
    setActiveTab('passport');
  };

  const handleExport = () => {
    const token = exportVaultBackup();
    navigator.clipboard.writeText(token);
    setToastMsg({ text: 'Token de backup CAGP1 copiado com sucesso!', type: 'success' });
  };

  const handleImport = () => {
    if (!backupInput.trim()) {
      setToastMsg({ text: 'Cole um token válido iniciado por CAGP1:', type: 'error' });
      return;
    }
    const res = importVaultBackup(backupInput.trim());
    if (res.success) {
      setToastMsg({ text: `Backup restaurado! (${res.restoredKeys} chaves sincronizadas)`, type: 'success' });
      setProfile(getVaultItem('cagp_student_profile_v1'));
      setBackupInput('');
    } else {
      setToastMsg({ text: res.error || 'Erro ao restaurar backup.', type: 'error' });
    }
  };

  return (
    <BottomSheet
      id="cagp-passport-sheet"
      isOpen={isOpen}
      onClose={onClose}
      title="Passaporte & Perfil Discente"
      initialDetent="large"
    >
      <div className="space-y-4 text-[#0A0A0A]">
        {/* Controle Segmentado Interno: [Passaporte] [Banco de Talentos] */}
        <div className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-lg border border-[#DFDBD2]">
          <button
            type="button"
            onClick={() => setActiveTab('passport')}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded text-xs font-['Oswald'] uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'passport'
                ? 'bg-white text-[#8B1E2D] border border-black/15 shadow-xs'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            }`}
          >
            <i className="bi bi-person-vcard text-sm" aria-hidden="true" />
            <span>Passaporte & Carteira</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('talent')}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded text-xs font-['Oswald'] uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'talent'
                ? 'bg-white text-[#8B1E2D] border border-black/15 shadow-xs'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            }`}
          >
            <i className="bi bi-briefcase text-sm" aria-hidden="true" />
            <span>Perfil & Talentos</span>
          </button>
        </div>

        {/* Toast Notificação */}
        {toastMsg && (
          <div
            className={`p-2.5 rounded text-xs font-semibold border flex items-center gap-2 ${
              toastMsg.type === 'success'
                ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]'
                : 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]'
            }`}
          >
            <i className={`bi ${toastMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Aba 1: Passaporte & Carteira */}
        {activeTab === 'passport' && (
          <div>
            <PassportCard
              profile={profile}
              obrigCount={obrigCount}
              extHours={extHours}
              onEditPhoto={() => setActiveTab('talent')}
              onOpenCampus={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('cagp:open-campus'));
              }}
            />

            {/* Atalho para Configurações do Super App (BUG-12 in-place fix) */}
            <div className="p-3 bg-white border border-[#DFDBD2] rounded-xl flex items-center justify-between gap-2 mb-3">
              <div>
                <strong className="block font-['Oswald'] text-xs uppercase text-[#0A0A0A]">
                  <i className="bi bi-gear-fill text-[#8B1E2D] mr-1" aria-hidden="true" />
                  Configurações do Super App
                </strong>
                <span className="text-[11px] text-gray-500">
                  Acessibilidade, alarmes do RU/Circular e portabilidade.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('cagp:open-settings'));
                }}
                className="cagp-btn-secondary text-xs py-1 px-2.5 cursor-pointer min-h-[36px]"
              >
                Abrir &rarr;
              </button>
            </div>

            {/* Backup & Restauração Rápida */}
            <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#DFDBD2] space-y-2">
              <span className="font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A] block">
                Cofre Discente Offline (Meu CAGP Sync)
              </span>
              <p className="text-[11px] text-gray-600">
                Seus dados acadêmicos ficam protegidos localmente. Exporte seu token Base64 seguro para trocar de aparelho:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="cagp-btn-secondary text-xs py-1.5 px-3 flex-1 cursor-pointer"
                >
                  <i className="bi bi-clipboard-check" aria-hidden="true" />
                  <span>Copiar Token CAGP1</span>
                </button>
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  id="cagp-passport-backup-input"
                  name="passportBackupToken"
                  placeholder="Cole o token CAGP1:... para restaurar"
                  value={backupInput}
                  onChange={(e) => setBackupInput(e.target.value)}
                  className="w-full bg-white border border-[#DFDBD2] p-2 text-xs font-mono rounded focus:border-[#8B1E2D] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleImport}
                  className="cagp-btn-primary w-full mt-1.5 text-xs py-1.5 justify-center cursor-pointer"
                >
                  Restaurar do Token
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aba 2: Perfil & Banco de Talentos */}
        {activeTab === 'talent' && (
          <TalentBankEditor
            profile={profile}
            onChange={(updated) => setProfile(updated)}
            onSave={handleSaveProfile}
          />
        )}
      </div>
    </BottomSheet>
  );
};
