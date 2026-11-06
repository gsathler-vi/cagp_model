import React from 'react';
import type { VaultData } from '../../lib/storage/studentVault';
import { AVATAR_PRESETS, type AvatarPresetOption } from './talentConstants';

interface AvatarRendererProps {
  profile: VaultData<'cagp_student_profile_v1'>;
  sizeClass?: 'cagp-avatar-frame--lg' | 'cagp-avatar-frame--md' | 'cagp-avatar-frame--sm' | 'cagp-avatar-frame--xs';
  showCameraBadge?: boolean;
  onClick?: () => void;
  title?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  profile,
  sizeClass = 'cagp-avatar-frame--lg',
  showCameraBadge = false,
  onClick,
  title,
}) => {
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'GP';

  const preset: AvatarPresetOption =
    AVATAR_PRESETS.find((p) => p.id === profile.avatarPreset) || AVATAR_PRESETS[0];

  const content = (
    <div
      className={`cagp-avatar-frame ${sizeClass} relative flex items-center justify-center overflow-hidden rounded-[4px] border-2 border-[#0A0A0A]`}
      style={{
        backgroundColor: profile.photoDataUrl ? '#FFFFFF' : preset.bg,
        color: preset.color,
      }}
      data-preset={profile.avatarPreset || 'candangos'}
    >
      {profile.photoDataUrl ? (
        <img
          src={profile.photoDataUrl}
          alt={profile.name}
          className="w-full h-full object-cover rounded-[2px]"
        />
      ) : profile.avatarPreset === 'monogram' ? (
        <span className="font-['Oswald'] text-2xl font-black tracking-tight" style={{ color: preset.color }}>
          {initials}
        </span>
      ) : preset.icon ? (
        <i className={`bi ${preset.icon} text-3xl`} style={{ color: preset.color }} aria-hidden="true" />
      ) : (
        <span className="font-['Oswald'] text-lg font-bold" style={{ color: preset.color }}>
          {preset.text || initials}
        </span>
      )}

      {/* Marcador de Orgulho LGBTQIAPN+ */}
      {profile.prideChoice && profile.prideChoice !== 'none' && (
        <span
          className={`cagp-pride-pin cagp-pride-swatch--${profile.prideChoice}`}
          aria-hidden="true"
        />
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative group p-0 bg-transparent border-0 cursor-pointer shrink-0 select-none"
        aria-label="Editar foto de perfil ou avatar"
        title={title || 'Clique para personalizar seu avatar'}
      >
        {content}
        {showCameraBadge && (
          <span className="cagp-avatar-cam-badge group-hover:bg-[#E8A317] transition-colors">
            <i className="bi bi-camera-fill" aria-hidden="true" />
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative shrink-0 select-none">
      {content}
    </div>
  );
};
