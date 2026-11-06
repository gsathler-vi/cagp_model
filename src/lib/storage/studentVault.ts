import { z } from 'zod';

export const CertSchema = z.object({
  id: z.string(),
  title: z.string(),
  mod: z.string(),
  date: z.string(),
  hours: z.number(),
});
export type StudentCert = z.infer<typeof CertSchema>;

export const CustomCourseSchema = z.object({
  id: z.string(),
  code: z.string().min(2),
  name: z.string().min(2),
  dept: z.string(),
  period: z.number().min(1).max(10),
  ch: z.number().min(15).max(180),
  category: z.enum(['optativa_catalogo', 'formacao_livre', 'eletiva_externa']),
});
export type CustomCourse = z.infer<typeof CustomCourseSchema>;

export const VaultSchemas = {
  cagp_calc_ext_aac_v1: z.record(z.string(), z.number()),
  cagp_aac_120d_certs_v1: z.array(CertSchema),
  cagp_custom_curriculum_v1: z.object({
    assignedCourses: z.array(CustomCourseSchema),
  }),
  cagp_onboarding_completed_v1: z.boolean(),
  cagp_notifications_prefs_v1: z.object({
    ru1815: z.boolean(),
    circular2230: z.boolean(),
    aac120d: z.boolean(),
    lastFired: z.number().optional(),
  }),
  cagp_calouro_checklist_v1: z.record(z.string(), z.boolean()),
  cagp_percurso_quiz_v1: z.object({
    answers: z.record(z.string(), z.string()),
    resultPath: z.string().optional(),
  }),
  cagp_minha_grade_v1: z.object({
    savedCourses: z.array(z.string()),
  }),
  cagp_art41_checklist_v1: z.record(z.string(), z.boolean()),
  cagp_a11y_prefs_v2: z.object({
    font: z.string().default('md'),
    contrast: z.string().default('normal'),
    dyslexia: z.boolean().default(false),
    motion: z.string().default('normal'),
    ruler: z.boolean().optional().default(false),
    showDesktopDock: z.boolean().default(false),
  }),
  cagp_discente_shortcuts_v1: z.array(z.string()).min(1).max(5),
  cagp_student_profile_v1: z.object({
    name: z.string(),
    period: z.string(),
    pronouns: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    semester: z.string().optional(),
    pathway: z.string().optional(),
    photoDataUrl: z.string().optional(),
    avatarPreset: z.string().optional(),
    prideChoice: z.string().optional(),
    interests: z.array(z.string()).optional(),
    bio: z.string().optional(),
    linkedin: z.string().optional(),
  }),
} as const;

export type VaultKey = keyof typeof VaultSchemas;
export type VaultData<K extends VaultKey> = z.infer<(typeof VaultSchemas)[K]>;
export type A11yPrefs = VaultData<'cagp_a11y_prefs_v2'>;

export const VaultDefaults: { [K in VaultKey]: VaultData<K> } = {
  cagp_calc_ext_aac_v1: {},
  cagp_aac_120d_certs_v1: [],
  cagp_custom_curriculum_v1: { assignedCourses: [] },
  cagp_onboarding_completed_v1: false,
  cagp_notifications_prefs_v1: {
    ru1815: false,
    circular2230: false,
    aac120d: true,
  },
  cagp_calouro_checklist_v1: {},
  cagp_percurso_quiz_v1: { answers: {} },
  cagp_minha_grade_v1: { savedCourses: [] },
  cagp_art41_checklist_v1: {},
  cagp_a11y_prefs_v2: {
    font: 'md',
    contrast: 'normal',
    dyslexia: false,
    motion: 'normal',
    ruler: false,
    showDesktopDock: false,
  },
  cagp_discente_shortcuts_v1: ['hoje', 'curso', 'percurso', 'documentos', 'sobre'],
  cagp_student_profile_v1: {
    name: 'Estudante de Gestão Pública',
    period: '1º Período',
    pronouns: '',
    email: '',
    phone: '',
    semester: '2026/1',
    pathway: '01-01',
    avatarPreset: 'candangos',
    prideChoice: 'none',
    interests: [],
    bio: '',
    linkedin: '',
  },
};

export function getVaultItem<K extends VaultKey>(key: K): VaultData<K> {
  if (typeof window === 'undefined') return VaultDefaults[key];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return VaultDefaults[key];
    const parsed = JSON.parse(raw);
    const result = VaultSchemas[key].safeParse(parsed);
    if (result.success) {
      return result.data as VaultData<K>;
    }
    console.warn(`[Vault] Corrupted key ${key}, falling back to defaults`);
    return VaultDefaults[key];
  } catch (err) {
    console.error(`[Vault] Error reading key ${key}`, err);
    return VaultDefaults[key];
  }
}

export function setVaultItem<K extends VaultKey>(key: K, value: VaultData<K>): void {
  if (typeof window === 'undefined') return;
  try {
    const parsed = VaultSchemas[key].parse(value);
    localStorage.setItem(key, JSON.stringify(parsed));
    window.dispatchEvent(new CustomEvent('cagp:vault-updated', { detail: { key, value: parsed } }));
  } catch (err) {
    console.error(`[Vault] Error saving key ${key}`, err);
  }
}

export function getAllVaultData(): Record<VaultKey, unknown> {
  const all: Record<string, unknown> = {};
  for (const k of Object.keys(VaultSchemas) as VaultKey[]) {
    all[k] = getVaultItem(k);
  }
  return all as Record<VaultKey, unknown>;
}

export function applyA11yPrefsToDOM(prefs?: VaultData<'cagp_a11y_prefs_v2'>): void {
  if (typeof document === 'undefined') return;
  const p = prefs || getVaultItem('cagp_a11y_prefs_v2');
  const el = document.documentElement;
  if (p.font) el.setAttribute('data-a11y-font', p.font);
  if (p.contrast) el.setAttribute('data-a11y-contrast', p.contrast);
  el.setAttribute('data-a11y-dyslexia', p.dyslexia ? 'true' : 'false');
  if (p.motion) el.setAttribute('data-a11y-motion', p.motion);
  el.setAttribute('data-a11y-ruler', p.ruler ? 'true' : 'false');

  el.removeAttribute('data-theme');
  el.setAttribute('data-desktop-dock', p.showDesktopDock ? 'true' : 'false');
}

