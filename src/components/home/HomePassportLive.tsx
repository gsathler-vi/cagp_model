import React, { useState, useEffect } from 'react';
import { getVaultItem, type VaultData } from '../../lib/storage/studentVault';
import { AvatarRenderer } from '../passport/AvatarRenderer';
import { route } from '../../lib/paths';

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

export const HomePassportLive: React.FC = () => {
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
  const [certs120dCount, setCerts120dCount] = useState<number>(0);
  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [quizPathway, setQuizPathway] = useState<string>('Não simulado');

  const loadData = () => {
    if (typeof window === 'undefined') return;
    setProfile(getVaultItem('cagp_student_profile_v1'));

    const calcData = getVaultItem('cagp_calc_ext_aac_v1');
    const sum = Object.values(calcData).reduce((a, b) => a + (Number(b) || 0), 0);
    setExtHours(Math.min(600, sum));

    const grade = getVaultItem('cagp_minha_grade_v1');
    setObrigCount(grade.savedCourses ? grade.savedCourses.length : 0);

    const certs = getVaultItem('cagp_aac_120d_certs_v1');
    setCerts120dCount(Array.isArray(certs) ? certs.length : 0);

    const chk = getVaultItem('cagp_calouro_checklist_v1');
    const chkDone = Object.values(chk).filter(Boolean).length;
    setChecklistCount(chkDone);

    const quiz = getVaultItem('cagp_percurso_quiz_v1');
    if (quiz.resultPath) {
      setQuizPathway(quiz.resultPath);
    }
  };

  useEffect(() => {
    loadData();

    const handleVaultUpdated = () => {
      loadData();
    };

    window.addEventListener('cagp:vault-updated', handleVaultUpdated);
    window.addEventListener('focus', loadData);

    return () => {
      window.removeEventListener('cagp:vault-updated', handleVaultUpdated);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const openPassportSheet = () => {
    window.dispatchEvent(new CustomEvent('cagp:open-passport'));
  };

  const obrigPct = Math.min(100, Math.round((obrigCount / 27) * 100));
  const extPct = Math.min(100, Math.round((extHours / 600) * 100));
  const globalPct = Math.round((obrigPct + extPct) / 2);

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const stampLabel = `${profile.period.toUpperCase()} • ATIVO`;

  return (
    <div className="cagp-passport-card mb-4">
      {/* Topbar Institucional com Carimbo e Botão de Edição */}
      <div className="cagp-passport-topbar">
        <div className="cagp-passport-inst">
          <i className="bi bi-bank2 text-[#E8A317]" aria-hidden="true" />
          <span>UNIVERSIDADE FEDERAL DE MINAS GERAIS • FAFICH • CAGP</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="cagp-passport-stamp">{stampLabel}</span>
          <button
            type="button"
            onClick={openPassportSheet}
            className="text-[11px] font-['Oswald'] uppercase font-bold text-white hover:text-[#FFE082] bg-white/10 hover:bg-white/20 border border-white/30 rounded px-2 py-0.5 transition-colors cursor-pointer inline-flex items-center gap-1"
            aria-label="Editar Passaporte Discente e Foto"
          >
            <i className="bi bi-pencil-square" aria-hidden="true" />
            <span>Editar Perfil</span>
          </button>
        </div>
      </div>

      {/* Body da Carteira com Avatar, Identidade e Anel Métrico */}
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Avatar Discente */}
        <AvatarRenderer
          profile={profile}
          sizeClass="cagp-avatar-frame--lg"
          showCameraBadge
          onClick={openPassportSheet}
          title="Clique para editar seu passaporte"
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
          title="Índice Médio de Integralização do Curso"
        >
          <div className="cagp-metric-ring-inner">{globalPct}%</div>
        </div>
      </div>

      {/* Áreas de Interesse no Passaporte (Banco de Talentos) */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="px-3.5 py-2 bg-[#F7F5F0] border-t border-b border-[#DFDBD2] flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-['Oswald'] uppercase font-bold text-gray-500 mr-1">
            <i className="bi bi-tag-fill text-[#8B1E2D] mr-1" aria-hidden="true" />
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

      {/* Barra Dupla de Conclusão do Curso */}
      <div className="cagp-passport-progress-grid mb-2">
        <div className="cagp-passport-progress-item">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
              Disciplinas Obrigatórias (27)
            </span>
            <span className="font-mono font-bold text-[11px] text-[#005A9C]">
              {obrigCount}/27 ({obrigPct}%)
            </span>
          </div>
          <div className="cagp-passport-mini-track" aria-hidden="true">
            <div
              className="cagp-passport-mini-fill is-obrig"
              style={{ width: `${obrigPct}%` }}
            />
          </div>
        </div>

        <div className="cagp-passport-progress-item">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-['Oswald'] font-bold uppercase text-[11px] text-gray-700">
              Extensão & Horas AAC (600h)
            </span>
            <span className="font-mono font-bold text-[11px] text-[#15803D]">
              {extHours}h/600h ({extPct}%)
            </span>
          </div>
          <div className="cagp-passport-mini-track" aria-hidden="true">
            <div
              className="cagp-passport-mini-fill is-acg"
              style={{ width: `${extPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Métricas de Bolso Interativas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2 bg-[#F7F5F0] border-t border-[#DFDBD2]">
        <a
          href={route('/acg') + '#calculadora'}
          className="p-2.5 bg-white rounded-[4px] border border-[#DFDBD2] hover:border-[#8B1E2D] hover:shadow-[1px_1px_0_#0A0A0A] no-underline block transition-all group"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <i className="bi bi-calculator text-[#8B1E2D] text-xs" aria-hidden="true" />
            <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-500 block">Horas ACG (600h)</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#8B1E2D] block mt-0.5">{extHours}h / 600h</span>
          <span className="text-xs text-gray-400 group-hover:text-[#8B1E2D] font-medium block mt-1">Simular &rarr;</span>
        </a>

        <a
          href={route('/acg') + '#guardiao-120-dias'}
          className="p-2.5 bg-white rounded-[4px] border border-[#DFDBD2] hover:border-[#8B1E2D] hover:shadow-[1px_1px_0_#0A0A0A] no-underline block transition-all group"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <i className="bi bi-shield-check text-[#0A0A0A] text-xs" aria-hidden="true" />
            <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-500 block">Guardião 120d</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#0A0A0A] block mt-0.5">{certs120dCount} certificados</span>
          <span className="text-xs text-gray-400 group-hover:text-[#8B1E2D] font-medium block mt-1">Prazos &rarr;</span>
        </a>

        <a
          href={route('/calouros') + '#checklist'}
          className="p-2.5 bg-white rounded-[4px] border border-[#DFDBD2] hover:border-[#8B1E2D] hover:shadow-[1px_1px_0_#0A0A0A] no-underline block transition-all group"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <i className="bi bi-check2-circle text-[#15803D] text-xs" aria-hidden="true" />
            <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-500 block">Checklist 30d</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#15803D] block mt-0.5">{checklistCount} de 6 passos</span>
          <span className="text-xs text-gray-400 group-hover:text-[#8B1E2D] font-medium block mt-1">Conferir &rarr;</span>
        </a>

        <a
          href={route('/percurso') + '#minha-grade'}
          className="p-2.5 bg-white rounded-[4px] border border-[#DFDBD2] hover:border-[#8B1E2D] hover:shadow-[1px_1px_0_#0A0A0A] no-underline block transition-all group"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <i className="bi bi-diagram-3 text-[#005A9C] text-xs" aria-hidden="true" />
            <span className="text-xs font-['Oswald'] uppercase font-bold text-gray-500 block">Minha Grade</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#005A9C] block mt-0.5 truncate">{quizPathway}</span>
          <span className="text-xs text-gray-400 group-hover:text-[#8B1E2D] font-medium block mt-1">Dossiê &rarr;</span>
        </a>
      </div>
    </div>
  );
};
