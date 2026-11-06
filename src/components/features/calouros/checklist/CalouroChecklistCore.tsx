// src/components/features/calouros/checklist/CalouroChecklistCore.tsx — Checklist Interativo dos Primeiros 30 Dias
import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type VaultData } from '../../../../lib/storage/studentVault';
import { asset } from '../../../../lib/paths';

interface ChecklistItem {
  id: string;
  category: 'acesso' | 'documento' | 'espaco' | 'academico';
  title: string;
  desc: string;
  icon: string;
  link?: { label: string; url: string; ext?: boolean };
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk_minhaufmg',
    category: 'acesso',
    title: '1. Ativar MinhaUFMG e App SIGA UFMG',
    desc: 'Cadastre sua senha inicial no portal sistemas.ufmg.br utilizando a folha NIPs entregue no registro acadêmico do DRCA.',
    icon: 'bi-laptop',
    link: { label: 'Portal MinhaUFMG', url: 'https://sistemas.ufmg.br', ext: true },
  },
  {
    id: 'chk_eduroam',
    category: 'acesso',
    title: '2. Conectar à Rede Wi-Fi eduroam',
    desc: 'Conecte celular e computador à rede mundial acadêmica eduroam usando seu login institucional completo (seulogin@ufmg.br).',
    icon: 'bi-wifi',
    link: { label: 'Guia Wi-Fi DTI (PDF)', url: asset('/documentos/dti-office365-criacao-conta.pdf'), ext: false },
  },
  {
    id: 'chk_carteirinha',
    category: 'documento',
    title: '3. Emitir Carteirinha de Estudante da UFMG',
    desc: 'Necessária para acesso às catracas do RU II Setorial e empréstimo de livros na Biblioteca Baeta Neves (1º andar da FAFICH).',
    icon: 'bi-person-badge',
  },
  {
    id: 'chk_fump',
    category: 'documento',
    title: '4. Questionário Socioeconômico da FUMP',
    desc: 'Estudantes que demandam assistência devem preencher o cadastro para classificação nos níveis I a III (Portaria PRAE 1.286/2026) para isenção e auxílios.',
    icon: 'bi-shield-heart',
    link: { label: 'Área do Aluno FUMP', url: 'https://www.fump.ufmg.br/', ext: true },
  },
  {
    id: 'chk_secretaria',
    category: 'espaco',
    title: '5. Conhecer a Secretaria Sala F-2039',
    desc: 'Localize a secretaria do Colegiado no 2º andar da FAFICH para atendimento presencial com Norma Guedes às quartas-feiras (13h às 19h).',
    icon: 'bi-door-open',
  },
  {
    id: 'chk_ceag',
    category: 'espaco',
    title: '6. Conhecer o CEAG FAFICH (2º Andar)',
    desc: 'Central de Atendimento à Graduação no 2º andar (em frente aos caixas eletrônicos), aberta das 08h às 22h para atestados, trancamentos e requerimentos.',
    icon: 'bi-headset',
  },
  {
    id: 'chk_ru',
    category: 'espaco',
    title: '7. Almoçar ou Jantar no RU II Setorial',
    desc: 'Restaurante Universitário atrás da FAFICH. Jantar das 17h10 às 19h30 (horário de ouro entre 18h00 e 18h25).',
    icon: 'bi-cup-hot-fill',
  },
  {
    id: 'chk_matricula',
    category: 'academico',
    title: '8. Entender a Matrícula Automática do 1º Período',
    desc: 'No 1º semestre, sua matrícula é automática nas 5 obrigatórias (300h): DCP 124, DCP 032, SOA 048, DCP 123 e DCP 033.',
    icon: 'bi-journal-check',
  },
  {
    id: 'chk_cagp',
    category: 'academico',
    title: '9. Seguir o CAGP e Participar dos Grupos de Turma',
    desc: 'Participe dos canais de acolhimento discente e grupos oficiais para avisos sobre calendários e oportunidades.',
    icon: 'bi-people-fill',
  },
  {
    id: 'chk_transporte',
    category: 'acesso',
    title: '10. Mapear as Linhas do Circular Interno',
    desc: 'Linhas gratuitas 1, 2, 3 e 4 para circulação no campus Pampulha. Última saída da FAFICH às 22h45.',
    icon: 'bi-bus-front-fill',
  },
];

export const CalouroChecklistCore: React.FC = () => {
  const [checks, setChecks] = useState<VaultData<'cagp_calouro_checklist_v1'>>({});
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    const raw = getVaultItem('cagp_calouro_checklist_v1') || {};
    setChecks(raw);
  }, []);

  const toggleCheck = (id: string) => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    setVaultItem('cagp_calouro_checklist_v1', next);
  };

  const completedCount = CHECKLIST_ITEMS.filter((item) => checks[item.id]).length;
  const pct = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const filteredItems = CHECKLIST_ITEMS.filter((item) => {
    if (filter === 'todos') return true;
    return item.category === filter;
  });

  return (
    <div className="cagp-calouro-checklist space-y-6 select-none text-[#0A0A0A]">
      {/* Painel de Progresso */}
      <div className="p-4 sm:p-5 bg-white border border-[#DFDBD2] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[11px] font-['Oswald'] uppercase font-bold tracking-wider text-[#8B1E2D]">
            Acolhimento Discente • 1º Período
          </span>
          <h3 className="font-['Oswald'] text-base sm:text-lg font-bold uppercase text-[#0A0A0A] m-0">
            Checklist de Sobrevivência nos Primeiros 30 Dias
          </h3>
          <p className="text-xs text-gray-600 mt-0.5 m-0">
            Passo a passo prático para integrar-se à UFMG sem perder prazos e benefícios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">Concluído</span>
            <span className="text-base font-mono font-bold text-[#8B1E2D]">
              {completedCount} de {CHECKLIST_ITEMS.length}
            </span>
          </div>
          <span className="px-3 py-1 rounded bg-[#0A0A0A] text-white font-mono text-xs font-bold shrink-0">
            {pct}%
          </span>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {[
          { id: 'todos', label: 'Tudo (10)' },
          { id: 'acesso', label: 'Sistemas & Wi-Fi' },
          { id: 'documento', label: 'Documentos & FUMP' },
          { id: 'espaco', label: 'Espaços FAFICH' },
          { id: 'academico', label: 'Curso & Matrícula' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-['Oswald'] uppercase tracking-tight shrink-0 transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-[#0A0A0A] text-white font-bold shadow-xs'
                : 'bg-[#F7F5F0] text-gray-700 border border-[#DFDBD2] hover:bg-[#EAE6DE]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de Itens do Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isDone = !!checks[item.id];
          return (
            <div
              key={item.id}
              className={`cagp-card p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                isDone
                  ? 'bg-[#F0FDF4] border-[#15803D]'
                  : 'bg-white border-[#DFDBD2] hover:border-[#0A0A0A]'
              }`}
            >
              <label className="min-w-[44px] min-h-[44px] -m-2 p-2 flex items-center justify-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  id={`chk-${item.id}`}
                  name={`chk-${item.id}`}
                  checked={isDone}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5 text-[#15803D] accent-[#15803D] rounded border-gray-300 focus:ring-0 cursor-pointer shrink-0"
                  aria-label={`Marcar ${item.title}`}
                />
              </label>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`font-['Oswald'] text-xs sm:text-sm font-bold uppercase leading-tight m-0 ${
                      isDone ? 'line-through text-gray-500' : 'text-[#0A0A0A]'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDone && (
                      <span className="cagp-stamp-badge is-feito text-[10px] py-0.5 px-2 shadow-[1px_1px_0_#15803D]">
                        <i className="bi bi-check-lg" aria-hidden="true" />
                        <span>FEITO</span>
                      </span>
                    )}
                    <i className={`bi ${item.icon} ${isDone ? 'text-[#15803D]' : 'text-gray-400'} text-sm`} aria-hidden="true" />
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed m-0 mb-2">
                  {item.desc}
                </p>

                {item.link && (
                  <a
                    href={item.link.url}
                    target={item.link.ext ? '_blank' : undefined}
                    rel={item.link.ext ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B1E2D] hover:underline"
                  >
                    <span>{item.link.label}</span>
                    <i className="bi bi-arrow-up-right text-[10px]" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner de Celebração e Carimbo Burocrático */}
      {completedCount === CHECKLIST_ITEMS.length && completedCount > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#DCFCE7] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <span className="cagp-stamp-badge is-homologado">★ 100% CONCLUÍDO</span>
              <span className="font-['Oswald'] font-bold text-sm uppercase text-[#15803D]">
                Todos os 30 Dias Ativados!
              </span>
            </div>
            <p className="text-xs text-gray-700 m-0">
              Parabéns! Todos os sistemas, acessos e rotinas da UFMG foram integralmente configurados.
            </p>
          </div>
          <div className="cagp-big-stamp shrink-0 scale-90 sm:scale-100">
            <span className="cagp-big-stamp-title">★ CALOURO INTEGRALIZADO</span>
            <span className="cagp-big-stamp-sub">FAFICH / UFMG</span>
          </div>
        </div>
      )}
    </div>
  );
};
