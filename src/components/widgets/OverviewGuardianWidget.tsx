import React, { useState, useEffect } from 'react';
import { getVaultItem, type StudentCert } from '../../lib/storage/studentVault';
import { route } from '../../lib/paths';

export const OverviewGuardianWidget: React.FC = () => {
  const [certs, setCerts] = useState<StudentCert[]>([]);

  useEffect(() => {
    const list = getVaultItem('cagp_aac_120d_certs_v1') || [];
    setCerts(list);

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_aac_120d_certs_v1') {
        setCerts(custom.detail.value || []);
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  return (
    <div className="cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl flex flex-col justify-between h-full shadow-sm hover:border-[#0A0A0A] transition-all">
      <div>
        {/* Header do Widget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-[#B45309]/10 text-[#B45309] flex items-center justify-center text-lg border border-[#B45309]/20">
              <i className="bi bi-shield-check" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-['Oswald'] font-bold text-sm uppercase text-[#0A0A0A] leading-tight">
                Guardião 120 Dias
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Art. 15, § 4º Regulamento N-20229</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded font-['Oswald'] text-xs font-bold bg-[#B45309] text-white">
            {certs.length} certs
          </span>
        </div>

        {/* Status dos Certificados */}
        <div className="mb-4">
          <div className="bg-[#FEF3C7] border border-[#B45309]/30 rounded-lg p-2.5 mb-2.5 text-xs text-[#0A0A0A] leading-relaxed">
            <div className="font-bold flex items-center gap-1 text-[#B45309] mb-0.5">
              <i className="bi bi-alarm-fill" aria-hidden="true" />
              <span>Prazo Fatal Regimental:</span>
            </div>
            Certificados de AAC devem ser protocolados perante o Colegiado de Gestão Pública em até <strong>120 dias corridos</strong> da emissão.
          </div>

          {certs.length > 0 ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-['Oswald'] uppercase tracking-wider text-gray-500 font-bold">
                Últimos Certificados Cadastrados:
              </span>
              {certs.slice(0, 2).map((c) => (
                <div key={c.id} className="p-2 bg-[#F7F5F0] border border-[#DFDBD2] rounded-md text-xs flex justify-between items-center">
                  <span className="font-medium text-gray-800 truncate max-w-[170px]">{c.title}</span>
                  <span className="font-mono text-[#8B1E2D] font-bold text-[11px]">{c.hours}h</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Nenhum certificado cadastrado ainda no cofre local.
            </p>
          )}
        </div>
      </div>

      {/* Ação Apple HIG */}
      <a
        href={route('/acg') + '#guardiao-120-dias'}
        className="min-h-[44px] px-3 py-2 bg-[#0A0A0A] text-white hover:bg-[#B45309] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all no-underline mt-2 shadow-[2px_2px_0px_#0A0A0A]"
      >
        <span>Gerenciar Certificados & Prazos</span>
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
};
