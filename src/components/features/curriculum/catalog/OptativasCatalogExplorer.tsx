// src/components/features/curriculum/catalog/OptativasCatalogExplorer.tsx — Catálogo Interativo das 68 Optativas
import React, { useState, useEffect } from 'react';
import {
  getVaultItem,
  setVaultItem,
  type CustomCourse,
} from '../../../../lib/storage/studentVault';

export interface OptativaItem {
  code: string;
  name: string;
  ch: number;
  modulo?: string;
  ementa: string;
}

interface Props {
  optativas: OptativaItem[];
}

export const OptativasCatalogExplorer: React.FC<Props> = ({ optativas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('todos');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [allocatedMap, setAllocatedMap] = useState<Record<string, CustomCourse>>({});
  const [allocatingCode, setAllocatingCode] = useState<string | null>(null);

  const loadAllocated = () => {
    const raw = getVaultItem('cagp_custom_curriculum_v1');
    const list = raw?.assignedCourses || [];
    const map: Record<string, CustomCourse> = {};
    list.forEach((c) => {
      map[c.code] = c;
    });
    setAllocatedMap(map);
  };

  useEffect(() => {
    loadAllocated();
    const handleUpdate = () => loadAllocated();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cagp:vault-updated', handleUpdate);
    window.addEventListener('cagp-vault-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cagp:vault-updated', handleUpdate);
      window.removeEventListener('cagp-vault-updated', handleUpdate);
    };
  }, []);

  const modulos = Array.from(
    new Set(optativas.map((o) => o.modulo || 'Geral').filter(Boolean))
  );

  const filtered = optativas.filter((o) => {
    const matchSearch =
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.modulo && o.modulo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchModulo =
      selectedModulo === 'todos' ||
      (o.modulo || 'Geral').toLowerCase() === selectedModulo.toLowerCase();

    return matchSearch && matchModulo;
  });

  const handleAllocate = (course: OptativaItem, period: number) => {
    const raw = getVaultItem('cagp_custom_curriculum_v1');
    const current = raw?.assignedCourses || [];
    const filteredList = current.filter((c) => c.code !== course.code);
    const newCourse: CustomCourse = {
      id: `opt_${course.code.replace(/\s+/g, '_').toLowerCase()}`,
      code: course.code,
      name: course.name,
      dept: course.modulo || course.code.split(' ')[0] || 'DCP',
      ch: course.ch,
      period: period,
      category: 'optativa_catalogo',
    };
    const updated = [...filteredList, newCourse];
    setVaultItem('cagp_custom_curriculum_v1', { assignedCourses: updated });
    setAllocatingCode(null);
  };

  const handleRemove = (code: string) => {
    const raw = getVaultItem('cagp_custom_curriculum_v1');
    const current = raw?.assignedCourses || [];
    const updated = current.filter((c) => c.code !== code);
    setVaultItem('cagp_custom_curriculum_v1', { assignedCourses: updated });
  };

  return (
    <div className="cagp-optativas-catalog space-y-4 select-none text-[#0A0A0A]">
      {/* Barra de Busca e Filtros */}
      <div className="p-4 bg-white border border-[#DFDBD2] rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-['Oswald'] uppercase font-bold tracking-wider text-[#8B1E2D]">
              Catálogo Curricular Homologado
            </span>
            <h3 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] m-0">
              68 Disciplinas Optativas do PPC 2020
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Mostrando {filtered.length} de {optativas.length}
          </span>
        </div>

        <div className="relative">
          <i
            className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            aria-hidden="true"
          />
          <input
            type="text"
            id="optativas-search-input"
            name="optativas-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ex: DCP 035), nome ou módulo..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#F7F5F0] border border-[#DFDBD2] focus:border-[#0A0A0A] rounded-lg text-sm text-[#0A0A0A] placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Pílulas de Modulos */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedModulo('todos')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-['Oswald'] uppercase tracking-tight shrink-0 transition-all cursor-pointer ${
              selectedModulo === 'todos'
                ? 'bg-[#0A0A0A] text-white font-bold shadow-xs'
                : 'bg-[#F7F5F0] text-gray-700 border border-[#DFDBD2] hover:bg-[#EAE6DE]'
            }`}
          >
            Todos ({optativas.length})
          </button>
          {modulos.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedModulo(m)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-['Oswald'] uppercase tracking-tight shrink-0 transition-all cursor-pointer ${
                selectedModulo.toLowerCase() === m.toLowerCase()
                  ? 'bg-[#0A0A0A] text-white font-bold shadow-xs'
                  : 'bg-[#F7F5F0] text-gray-700 border border-[#DFDBD2] hover:bg-[#EAE6DE]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards de Optativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const isAllocated = !!allocatedMap[item.code];
          const allocatedCourse = allocatedMap[item.code];
          const isExpanded = expandedCode === item.code;
          const isSelectingPeriod = allocatingCode === item.code;

          return (
            <div
              key={item.code}
              className={`cagp-card p-4 bg-white border rounded-xl flex flex-col justify-between shadow-xs transition-all ${
                isAllocated ? 'border-[#15803D] ring-1 ring-[#15803D]' : 'border-[#DFDBD2] hover:border-[#0A0A0A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F7F5F0] border border-[#DFDBD2] text-[#8B1E2D]">
                    {item.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-gray-600">
                      {item.ch}h ({Math.round(item.ch / 15)} cr)
                    </span>
                    {isAllocated && (
                      <span className="cagp-stamp-badge is-deferido text-[10px] py-0.5 px-1.5 shadow-[1px_1px_0_#15803D]">
                        <i className="bi bi-diagram-3-fill text-[9px]" aria-hidden="true" />
                        <span>NO GRAFO • {allocatedCourse.period}ºP</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-['Oswald'] text-sm font-bold uppercase text-[#0A0A0A] leading-snug mb-1 m-0">
                  {item.name}
                </h4>

                {item.modulo && (
                  <span className="inline-block text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">
                    {item.modulo}
                  </span>
                )}

                {/* Ementa Expansível */}
                {item.ementa && (
                  <div className="mt-1 pt-1.5 border-t border-[#DFDBD2]/60">
                    <span className="text-[10px] font-['Oswald'] uppercase font-bold text-[#8B1E2D] block mb-0.5">
                      Ementa Oficial:
                    </span>
                    <p
                      className={`text-xs text-gray-700 leading-relaxed m-0 select-text ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {item.ementa}
                    </p>
                    {item.ementa.length > 90 && (
                      <button
                        type="button"
                        onClick={() => setExpandedCode(isExpanded ? null : item.code)}
                        className="text-[11px] font-bold text-[#8B1E2D] hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer"
                      >
                        {isExpanded ? 'Ver menos ▲' : 'Ler ementa completa ▼'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Ações de Alocação no Grafo */}
              <div className="pt-3 mt-3 border-t border-[#DFDBD2]">
                {isSelectingPeriod ? (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-['Oswald'] uppercase font-bold text-gray-700 block">
                      Selecione o período letivo:
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleAllocate(item, p)}
                          className="min-h-[36px] py-1 bg-[#F7F5F0] hover:bg-[#8B1E2D] hover:text-white border border-[#DFDBD2] rounded text-xs font-mono font-bold transition-colors"
                        >
                          {p}ºP
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllocatingCode(null)}
                      className="w-full text-center text-[10px] text-gray-500 hover:text-black py-0.5 bg-transparent border-none cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : isAllocated ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAllocatingCode(item.code)}
                      className="flex-1 min-h-[44px] px-3 py-1.5 bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] rounded-lg text-xs font-['Oswald'] uppercase font-bold text-[#0A0A0A] transition-colors cursor-pointer"
                    >
                      Mover ({allocatedCourse.period}ºP)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.code)}
                      className="min-h-[44px] min-w-[44px] px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                      title="Desvincular do Grafo"
                      aria-label="Desvincular do Grafo"
                    >
                      <i className="bi bi-trash" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAllocatingCode(item.code)}
                    className="w-full min-h-[44px] px-3 py-2 bg-[#0A0A0A] hover:bg-[#8B1E2D] text-white rounded-lg text-xs font-['Oswald'] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#0A0A0A] cursor-pointer"
                  >
                    <i className="bi bi-plus-circle" aria-hidden="true" />
                    <span>Vincular ao Grafo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
