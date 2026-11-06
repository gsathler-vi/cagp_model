import React from 'react';

interface Props {
  vaultSize: number;
  backupInput: string;
  setBackupInput: (v: string) => void;
  handleExportBackup: () => void;
  handleImportBackup: () => void;
  handleResetVault: () => void;
}

export const SettingsVaultSection: React.FC<Props> = ({
  vaultSize,
  backupInput,
  setBackupInput,
  handleExportBackup,
  handleImportBackup,
  handleResetVault,
}) => {
  return (
    <section className="bg-white border border-[#DFDBD2] rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-3">
        <div className="flex items-center gap-2">
          <i className="bi bi-safe2-fill text-xl text-[#15803D]" aria-hidden="true" />
          <div>
            <h2 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] m-0">
              3. Meu CAGP Sync & Cofre Discente
            </h2>
            <p className="text-xs text-gray-500 m-0">Armazenamento estritamente local com verificação CRC32</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-gray-600 bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#DFDBD2]">
          {vaultSize} bytes
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="cagp-btn-secondary text-xs py-2 px-3 flex-1 justify-center cursor-pointer"
          >
            <i className="bi bi-clipboard-check" aria-hidden="true" />
            <span>Exportar Backup Base64 (CAGP1)</span>
          </button>
          <button
            type="button"
            onClick={handleResetVault}
            className="cagp-btn-outline text-xs py-2 px-3 text-[#DC2626] border-[#DC2626]/30 cursor-pointer"
          >
            <i className="bi bi-trash" aria-hidden="true" />
            <span>Limpar Dados Locais</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#DFDBD2]">
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1" htmlFor="settings-import-input">
            Restaurar Backup a partir de Token
          </label>
          <div className="flex items-center gap-2 min-w-0 w-full">
            <input
              id="settings-import-input"
              type="text"
              placeholder="Cole o token CAGP1:... aqui"
              value={backupInput}
              onChange={(e) => setBackupInput(e.target.value)}
              className="flex-1 min-w-0 bg-[#F7F5F0] border border-[#DFDBD2] p-2 text-xs font-mono rounded focus:border-[#8B1E2D] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleImportBackup}
              className="cagp-btn-primary text-xs py-2 px-4 cursor-pointer shrink-0"
            >
              Restaurar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
