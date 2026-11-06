// src/lib/avatarHelper.ts — Renderizador Universal de Avatar Discente (Foto, Presets e Iniciais)
export interface StudentProfileData {
  name?: string;
  period?: string;
  photoDataUrl?: string;
  avatarPreset?: string;
  prideChoice?: string;
  pronouns?: string;
  semester?: string;
  pathway?: string;
  interests?: string[];
}

export const AVATAR_PRESET_CONFIG: Record<
  string,
  { bg: string; color: string; icon?: string; text?: string }
> = {
  candangos: { bg: '#9E2424', color: '#E8A317', icon: 'bi-bank' },
  monogram: { bg: '#0A0A0A', color: '#E8A317', text: 'Iniciais' },
  fafich: { bg: '#005A9C', color: '#E8A317', icon: 'bi-building' },
  republica: { bg: '#15803D', color: '#FFFFFF', icon: 'bi-house-heart-fill' },
  formando: { bg: '#8B1E2D', color: '#E8A317', icon: 'bi-mortarboard-fill' },
  pesquisador: { bg: '#0A0A0A', color: '#FFFFFF', icon: 'bi-person-badge-fill' },
  estudante_f: { bg: '#2A6264', color: '#FFFFFF', icon: 'bi-person-standing-dress' },
  estudante_m: { bg: '#5B2E85', color: '#FFFFFF', icon: 'bi-person-fill' },
};

/**
 * Gera o markup HTML seguro para renderizar o avatar do estudante em qualquer slot (header, drawer, etc.).
 */
export function renderAvatarHtml(profile?: StudentProfileData | null, size: 'sm' | 'md' | 'lg' = 'md'): string {
  if (!profile) {
    return `<span class="w-full h-full flex items-center justify-center text-gray-500 bg-[#F7F5F0]"><i class="bi bi-person-fill text-lg" aria-hidden="true"></i></span>`;
  }

  // 1. Se houver foto carregada (DataURL)
  if (profile.photoDataUrl) {
    return `<img src="${profile.photoDataUrl}" alt="${profile.name || 'Estudante'}" class="w-full h-full object-cover rounded-[2px]" />`;
  }

  const initials = profile.name
    ? profile.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : 'GP';

  // 2. Se houver preset configurado
  const presetKey = profile.avatarPreset || 'candangos';
  const preset = AVATAR_PRESET_CONFIG[presetKey] || AVATAR_PRESET_CONFIG.candangos;

  const prideBadge =
    profile.prideChoice && profile.prideChoice !== 'none'
      ? `<span class="cagp-pride-pin cagp-pride-swatch--${profile.prideChoice}" aria-hidden="true"></span>`
      : '';

  if (presetKey === 'monogram') {
    return `
      <span class="w-full h-full flex items-center justify-center font-['Oswald'] font-bold text-xs uppercase" style="background-color: ${preset.bg}; color: ${preset.color};">
        ${initials}
      </span>
      ${prideBadge}
    `;
  }

  if (preset.icon) {
    return `
      <span class="w-full h-full flex items-center justify-center text-sm" style="background-color: ${preset.bg}; color: ${preset.color};">
        <i class="bi ${preset.icon}" aria-hidden="true"></i>
      </span>
      ${prideBadge}
    `;
  }

  return `
    <span class="w-full h-full flex items-center justify-center font-['Oswald'] font-bold text-xs" style="background-color: ${preset.bg}; color: ${preset.color};">
      ${initials}
    </span>
    ${prideBadge}
  `;
}
