import React, { useState, useEffect, useRef } from 'react';
import { route } from '../../lib/paths';

interface SearchItem {
  title: string;
  cat: string;
  badge: string;
  href: string;
  desc: string;
  keywords: string;
}

const CATALOG: SearchItem[] = [
  { title: "Início & Painel Discente", cat: "Página", badge: "Hoje", href: "/", desc: "Avisos em tempo real, status do campus e acesso rápido aos sistemas UFMG.", keywords: "home inicio portal sistemas fafich chapa colegiado hoje" },
  { title: "O Curso de Gestão Pública", cat: "Página", badge: "Curso", href: "/curso", desc: "História, corpo docente, cientometria nacional, perfil do egresso e Colegiado.", keywords: "curso fafich corpo docente professores cientometria competencias egresso colegiado" },
  { title: "Guia do Calouro (1º Período)", cat: "Página", badge: "Acolhimento", href: "/calouros", desc: "Rotina noturna, refeições no RU II, circulares Interno Rotas, carteirinha e checklist.", keywords: "calouros primeiro periodo ru restaurante universitario onibus circulares carteirinha fump prae biblioteca face" },
  { title: "Pesquisa, IC & 11 Núcleos do DCP", cat: "Página", badge: "Pesquisa", href: "/pesquisa", desc: "Diretório dos 11 grupos de pesquisa do DCP, guia de Iniciação Científica (90h AAC) e Programa de Imersão.", keywords: "pesquisa iniciacao cientifica ic pibic fapemig cnpq nucleos grupos dcp imersao campo de publicas" },
  { title: "Central Curricular & Grafo 10P", cat: "Página", badge: "Currículo", href: "/percurso", desc: "Matriz curricular dos 10 semestres, grafo de pré-requisitos, ementário e simulador dos 3 percursos.", keywords: "percurso ementas matriz curricular obrigatorias grade periodos pre-requisitos grafo" },
  { title: "Catálogo de 68 Optativas & Livre", cat: "Central Curricular", badge: "Optativas", href: "/percurso#optativas", desc: "Filtro das 68 optativas por departamento (DCP, ECN, SOA, DEM, CAD) e regras das 120h de Formação Livre.", keywords: "optativas catalogo 68 disciplinas eletivas formacao livre 120h dcp economia sociologia favoritos" },
  { title: "Dossiê Minha Grade & Integralização", cat: "Central Curricular", badge: "Planejador", href: "/percurso#minha-grade", desc: "Acompanhe as 27 obrigatórias cursadas, optativas salvas e calcule sua integralização.", keywords: "minha grade dossie planejamento matricula siga integralizacao horas cursadas" },
  { title: "Extensão & Horas AAC (600h)", cat: "Página", badge: "Integralização", href: "/acg", desc: "Calculadora de 600h, Extensão 300h, tetos de AAC e Guardião do prazo decadencial de 120 dias.", keywords: "acg aac extensao 300h 600h horas complementares calculadora guardiao 120 dias voluntariado colegiado" },
  { title: "Estágio Supervisionado & Art. 41", cat: "Página", badge: "Estágio", href: "/estagio", desc: "Estágio Obrigatório A e B (300h), simulador de dispensa por vínculo público e modelos de TCE.", keywords: "estagio supervisionado obrigatorio nao obrigatorio dcp135 dcp136 art 41 dispensa profissional vinculo tce" },
  { title: "Trabalho de Conclusão de Curso (TCC)", cat: "Página", badge: "TCC", href: "/tcc", desc: "DCP 089 (60h) e DCP 137 (120h), as 4 modalidades oficiais de TCC e Termo de Aceite de Orientador.", keywords: "tcc trabalho conclusao curso dcp089 dcp137 monografia artigo cientifico relatorio tecnico projeto intervencao orientador" },
  { title: "Acervo de Documentos & Formulários", cat: "Página", badge: "Acervo", href: "/documentos", desc: "Cofre offline com PPC 2020, Regulamento N-20229, Regimento CAGP 2024 e formulários oficiais.", keywords: "documentos pdfs ppc regimento regulamento estagio sei requerimento normas resolucoes cofre offline" },
  { title: "Dúvidas Frequentes (FAQ)", cat: "Página", badge: "Ajuda", href: "/faq", desc: "Respostas regimentais sobre trancamento, pré-requisitos, EaD, CEAG e acessibilidade.", keywords: "faq duvidas perguntas frequentes ceag trancamento prazos secretaria colegiado" },
  { title: "O Centro Acadêmico (Sobre o CAGP)", cat: "Página", badge: "O CAGP", href: "/sobre", desc: "Regimento 2024, Os Candangos de Bruno Giorgi, Assembleia Geral e esferas de representação.", keywords: "sobre cagp candangos bruno giorgi estatuto regimento interno historia diretoria representacao" },
  { title: "Processo Eleitoral & Diretorias do CAGP", cat: "Página", badge: "O CAGP", href: "/gestao", desc: "Organograma das 7 diretorias, atribuições estatutárias, processo eleitoral e prestação de contas.", keywords: "gestao equipe diretorias dipre dijur difi diac diap dicult dimac transparencia contas eleicao eleitoral" },
];

export const SpotlightModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (e.key === '/' && !isOpen) {
        const target = e.target as HTMLElement | null;
        const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('cagp:open-spotlight', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('cagp:open-spotlight', handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const cleanQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const terms = cleanQuery.split(/\s+/).filter(Boolean);

  const filtered = cleanQuery === ''
    ? []
    : CATALOG.filter((item) => {
        const target = `${item.title} ${item.cat} ${item.badge} ${item.desc} ${item.keywords}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return terms.every((t) => target.includes(t));
      });

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    window.location.href = route(href);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    const list = cleanQuery === '' ? [] : filtered;
    if (list.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < list.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : list.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (list[activeIndex]) {
        handleNavigate(list[activeIndex].href);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1070] flex items-start justify-center pt-12 sm:pt-20 px-3 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Busca rápida Spotlight"
    >
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="w-full max-w-xl bg-white/98 backdrop-blur-xl border border-black/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-black/15 bg-[#F7F5F0]/90 backdrop-blur-sm">
          <i className="bi bi-search text-gray-500 text-base mr-2.5" aria-hidden="true" />
          <input
            ref={inputRef}
            id="cagp-spotlight-input"
            name="spotlightSearch"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Buscar páginas, ementas, regras, PDFs ou grupos..."
            className="flex-1 bg-transparent border-none text-[#0A0A0A] text-base focus:outline-none placeholder-gray-500 font-['Inter']"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm active:scale-95 transition-transform cursor-pointer"
              aria-label="Limpar busca"
            >
              <i className="bi bi-x-circle-fill" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex sm:hidden items-center justify-center rounded-full bg-white border border-black/15 text-[#0A0A0A] font-bold text-xs ml-1 active:scale-95 transition-transform cursor-pointer"
            aria-label="Fechar busca"
          >
            ✕
          </button>
          <kbd className="hidden sm:inline-block bg-white text-gray-700 border border-black/15 shadow-2xs rounded px-1.5 py-0.5 text-[11px] font-mono font-bold">
            ESC
          </kbd>
        </div>

        {/* Search Body */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {cleanQuery === '' ? (
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-500 font-bold block mb-2">
                Acesso Rápido & Ações Frequentes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { title: "Calculadora 600h", sub: "Extensão + AAC", href: "/acg#calculadora-horas", icon: "bi-calculator", color: "text-[#8B1E2D]" },
                  { title: "68 Optativas", sub: "Filtros por depto", href: "/optativas", icon: "bi-collection", color: "text-[#15803D]" },
                  { title: "Dispensa Art. 41", sub: "Experiência profissional", href: "/estagio#art41", icon: "bi-briefcase", color: "text-blue-800" },
                  { title: "TCC & Modalidades", sub: "4 modalidades oficiais", href: "/tcc", icon: "bi-mortarboard", color: "text-amber-800" },
                  { title: "Grafo Curricular", sub: "27 obrigatórias", href: "/percurso#grafo", icon: "bi-diagram-3", color: "text-[#0A0A0A]" },
                  { title: "Acervo de PDFs", sub: "Normas e formulários", href: "/documentos", icon: "bi-file-earmark-pdf", color: "text-[#DC2626]" },
                ].map((q) => (
                  <button
                    key={q.href}
                    type="button"
                    onClick={() => handleNavigate(q.href)}
                    className="p-2.5 text-left rounded-lg border border-[#DFDBD2] hover:border-[#0A0A0A] hover:bg-[#F7F5F0] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <i className={`bi ${q.icon} text-lg ${q.color}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0A0A0A] block leading-tight">{q.title}</span>
                      <span className="text-[10px] text-gray-500 block leading-tight">{q.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-xs">
              <i className="bi bi-search text-2xl block mb-2 text-gray-300" />
              Nenhum resultado encontrado para "<strong>{query}</strong>".
              <p className="mt-1 text-[11px] text-gray-400">Tente buscar por termos como <em>estágio</em>, <em>tcc</em>, <em>ru</em> ou <em>colegiado</em>.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 active:scale-[0.99] cursor-pointer ${
                    idx === activeIndex
                      ? 'bg-[#F7F5F0] border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="cagp-badge cagp-badge-red text-xs font-mono">
                        {item.badge}
                      </span>
                      <span className="font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A] truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{item.desc}</p>
                  </div>
                  <i className="bi bi-arrow-right text-gray-400 text-xs shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2.5 border-t-2 border-[#0A0A0A] bg-[#F7F5F0]/90 backdrop-blur-sm flex items-center justify-between text-[10px] text-gray-600">
          <div className="flex items-center gap-2.5">
            <span><kbd className="bg-white border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] px-1 py-0.5 rounded font-mono font-bold">↑↓</kbd> Navegar</span>
            <span><kbd className="bg-white border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] px-1 py-0.5 rounded font-mono font-bold">↵</kbd> Acessar</span>
            <span><kbd className="bg-white border border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] px-1 py-0.5 rounded font-mono font-bold">ESC</kbd> Fechar</span>
          </div>
          <span className="font-mono font-bold text-[#8B1E2D] tracking-wider">CAGP SPOTLIGHT</span>
        </div>
      </div>
    </div>
  );
};
