import React from 'react';
import type { VaultData } from '../../lib/storage/studentVault';
import { AvatarRenderer } from './AvatarRenderer';

interface PassportCardProps {
  profile: VaultData<'cagp_student_profile_v1'>;
  obrigCount: number;
  extHours: number;
  onEditPhoto: () => void;
  onOpenCampus: () => void;
}

const TALENT_LABELS: Record<string, string> = {
  pol_pub: 'Políticas Públicas',
  orcamento: 'Orçamento & Finanças',
  gestao_pessoas: 'Gestão de Pessoas',
  licitacoes: 'Licitações & Contratos',
  cidades: 'Políticas Urbanas',
  saude: 'Saúde Pública (SUS)',
  educacao: 'Educação Pública',
  govtech: 'GovTech & Dados',
  dados: 'Avaliação & Métricas',
  terceiro_setor: 'Terceiro Setor',
  rel_inst: 'Relações Institucionais',
  clima: 'Meio Ambiente',
};

export const PassportCard: React.FC<PassportCardProps> = ({
  profile,
  obrigCount,
  extHours,
  onEditPhoto,
  onOpenCampus,
}) => {
  const obrigPct = Math.min(100, Math.round((obrigCount / 27) * 100));
  const extPct = Math.min(100, Math.round((extHours / 600) * 100));
  const globalPct = Math.round((obrigPct + extPct) / 2);

  const stampLabel = `${profile.period.toUpperCase()} • ATIVO`;
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div className="cagp-passport-card mb-4">
      {/* Topbar Institucional */}
      <div className="cagp-passport-topbar">
        <div className="cagp-passport-inst">
          <i className="bi bi-bank2 text-[#E8A317]" aria-hidden="true" />
          <span>FAFICH / UFMG • GESTÃO PÚBLICA</span>
        </div>
        <span className="cagp-passport-stamp">{stampLabel}</span>
      </div>

      {/* Body com Avatar e Identidade */}
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Avatar com Trigger de Câmera */}
        <AvatarRenderer
          profile={profile}
          sizeClass="cagp-avatar-frame--lg"
          showCameraBadge
          onClick={onEditPhoto}
          title="Clique para trocar foto ou avatar"
        />

        {/* Dados de Identidade */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-['Oswald'] text-lg sm:text-xl font-bold uppercase text-[#0A0A0A] leading-tight m-0">
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

        {/* Anel Métrico de Integralização */}
        <div
          className="cagp-metric-ring shrink-0"
          style={{ '--ring-pct': globalPct } as React.CSSProperties}
          title="Índice Médio de Integralização"
        >
          <div className="cagp-metric-ring-inner">{globalPct}%</div>
        </div>
      </div>

      {/* Áreas de Interesse no Passaporte (Banco de Talentos) */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="px-3.5 py-2 bg-[#F7F5F0] border-t border-[#DFDBD2] flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500 mr-1">
            Interesses:
          </span>
          {profile.interests.map((key) => (
            <span
              key={key}
              className="text-[10px] font-semibold bg-white border border-[#DFDBD2] text-[#0A0A0A] px-2 py-0.5 rounded shadow-[1px_1px_0px_#0A0A0A]"
            >
              {TALENT_LABELS[key] || key}
            </span>
          ))}
        </div>
      )}

      {/* Dupla Barra de Progresso (27 Obrigatórias + 600h AAC) */}
      <div className="cagp-passport-progress-grid">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
              27 Obrigatórias
            </span>
            <span className="font-mono font-bold text-[11px] text-[#005A9C]">
              {obrigCount}/27 ({obrigPct}%)
            </span>
          </div>
          <div className="cagp-passport-mini-track">
            <div
              className="cagp-passport-mini-fill is-obrig"
              style={{ width: `${obrigPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
              600h Extensão & AAC
            </span>
            <span className="font-mono font-bold text-[11px] text-[#15803D]">
              {extHours}h/600h ({extPct}%)
            </span>
          </div>
          <div className="cagp-passport-mini-track">
            <div
              className="cagp-passport-mini-fill is-acg"
              style={{ width: `${extPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="p-2.5 sm:p-3 bg-white flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEditPhoto}
          className="cagp-btn-secondary text-xs py-1.5 px-3 flex-1 justify-center cursor-pointer"
        >
          <i className="bi bi-camera-fill" aria-hidden="true" />
          <span>Trocar Foto / Avatar</span>
        </button>
        <button
          type="button"
          onClick={onOpenCampus}
          className="cagp-btn-outline text-xs py-1.5 px-3 cursor-pointer"
        >
          <i className="bi bi-clock-history text-[#8B1E2D]" aria-hidden="true" />
          <span>Campus Agora</span>
        </button>
      </div>
    </div>
  );
};
