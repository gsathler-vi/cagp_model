// src/components/features/acg/guardian/AcgGuardianWidget.tsx — Widget de Resumo do Guardião de 120 Dias
import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../../../lib/storage/studentVault';

export const AcgGuardianWidget: React.FC = () => {
  const [certs, setCerts] = useState<VaultData<'cagp_aac_120d_certs_v1'>>([]);

  useEffect(() => {
    const load = () => {
      setCerts(getVaultItem('cagp_aac_120d_certs_v1') || []);
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

  // Calcular dias restantes para cada certificado
  const now = new Date().getTime();
  const certsWithDays = certs.map((c) => {
    const issueDate = new Date(c.date).getTime();
    const deadline = issueDate + 120 * 24 * 60 * 60 * 1000;
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return { ...c, diffDays };
  });

  certsWithDays.sort((a, b) => a.diffDays - b.diffDays);
  const nearest = certsWithDays[0];

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-xs hover:border-[#0A0A0A] transition-all select-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#B45309]/10 text-[#B45309] flex items-center justify-center text-lg border border-[#B45309]/20">
              <i className="bi bi-shield-exclamation" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight m-0">
                Guardião 120 Dias
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Art. 15, § 4º do Regulamento</span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded font-['Oswald'] text-[11px] font-bold ${
              !nearest
                ? 'bg-gray-100 text-gray-700 border border-[#DFDBD2]'
                : nearest.diffDays < 0
                ? 'bg-[#DC2626] text-white'
                : nearest.diffDays <= 30
                ? 'bg-[#B45309] text-white'
                : 'bg-[#15803D] text-white'
            }`}
          >
            {!nearest ? 'Sem Certificados' : nearest.diffDays < 0 ? 'Expirado' : `${nearest.diffDays} dias restantes`}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mb-3">
          Monitor do prazo decadencial fatal de 120 dias para eventos como ouvinte (Mod. III) e trabalhos em anais (Mod. VII).
        </p>

        {certs.length > 0 && nearest ? (
          <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg mb-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500">
                Próximo a Vencer ({certs.length} cadastrado{certs.length > 1 ? 's' : ''}):
              </span>
              <span className="text-xs font-mono font-bold text-gray-900">{nearest.hours}h</span>
            </div>
            <div className="text-xs font-bold text-[#0A0A0A] truncate">{nearest.title}</div>
            <div className="text-[11px] text-gray-500 flex items-center justify-between mt-1">
              <span>{nearest.mod}</span>
              <span
                className={`font-semibold ${
                  nearest.diffDays < 0
                    ? 'text-[#DC2626]'
                    : nearest.diffDays <= 30
                    ? 'text-[#B45309]'
                    : 'text-[#15803D]'
                }`}
              >
                {nearest.diffDays < 0
                  ? `Venceu há ${Math.abs(nearest.diffDays)} dias`
                  : `Vence em ${nearest.diffDays} dias`}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#F7F5F0] border border-[#DFDBD2] rounded-lg mb-3 text-center">
            <p className="text-xs text-gray-600 m-0">
              Nenhum certificado cadastrado. Adicione seus comprovantes para receber avisos antes do prazo prescricional.
            </p>
          </div>
        )}
      </div>

      <a
        href="#guardiao-120-dias"
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#B45309] text-white rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Gerenciar Certificados</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
