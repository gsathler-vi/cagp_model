import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import {
  SHORTCUTS_CATALOG,
  DEFAULT_SHORTCUT_IDS,
  type ShortcutItem,
} from '../../lib/shortcutsCatalog';
import { getVaultItem, setVaultItem } from '../../lib/storage/studentVault';

interface ShortcutsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsSheet: React.FC<ShortcutsSheetProps> = ({ isOpen, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SHORTCUT_IDS);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  useEffect(() => {
    if (isOpen) {
      const stored = getVaultItem('cagp_discente_shortcuts_v1');
      if (Array.isArray(stored) && stored.length > 0) {
        setSelectedIds(stored);
      } else {
        setSelectedIds(DEFAULT_SHORTCUT_IDS);
      }
    }
  }, [isOpen]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 3) {
        if (typeof window !== 'undefined' && (window as unknown as { cagpToast?: (msg: string, icon?: string) => void }).cagpToast) {
          (window as unknown as { cagpToast: (msg: string, icon?: string) => void }).cagpToast('Selecione pelo menos 3 atalhos.', 'bi-exclamation-triangle');
        }
        return;
      }
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        if (typeof window !== 'undefined' && (window as unknown as { cagpToast?: (msg: string, icon?: string) => void }).cagpToast) {
          (window as unknown as { cagpToast: (msg: string, icon?: string) => void }).cagpToast('Limite de 5 atalhos atingido.', 'bi-info-circle');
        }
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleReset = () => {
    setSelectedIds(DEFAULT_SHORTCUT_IDS);
  };

  const handleSave = () => {
    if (selectedIds.length < 3 || selectedIds.length > 5) return;
    setVaultItem('cagp_discente_shortcuts_v1', selectedIds);
    if (typeof window !== 'undefined' && (window as unknown as { cagpToast?: (msg: string, icon?: string) => void }).cagpToast) {
      (window as unknown as { cagpToast: (msg: string, icon?: string) => void }).cagpToast('Atalhos atualizados com sucesso!', 'bi-check2-circle');
    }
    onClose();
  };

  const categories = ['Todas', 'Essencial', 'Acadêmico', 'Ferramentas', 'Institucional'];

  const filteredItems = filterCategory === 'Todas'
    ? SHORTCUTS_CATALOG
    : SHORTCUTS_CATALOG.filter((item) => item.category === filterCategory);

  const isValidCount = selectedIds.length >= 3 && selectedIds.length <= 5;

  return (
    <BottomSheet
      id="cagp-shortcuts-sheet"
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Atalhos"
      initialDetent="large"
    >
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Banner Informativo com Contadores Apple HIG */}
        <div className="bg-[#F7F5F0] border-2 border-[#0A0A0A] p-3 rounded-[6px] shadow-[2px_2px_0_#0A0A0A]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-['Oswald'] text-xs font-bold uppercase text-[#8B1E2D] tracking-wide flex items-center gap-1.5">
              <i className="bi bi-sliders2 text-sm" aria-hidden="true"></i>
              <span>Dock & Barra Inferior</span>
            </span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-[4px] border ${
                isValidCount
                  ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/30'
                  : 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
              }`}
            >
              {selectedIds.length} de 5 selecionados
            </span>
          </div>
          <p className="text-xs text-gray-600 m-0 leading-relaxed">
            Escolha entre <strong>3 e 5 atalhos prioritários</strong> para fixar na barra inferior mobile e na pílula flutuante do desktop.
          </p>
        </div>

        {/* Categorias / Filtros de Atalhos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none no-scrollbar" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-[4px] text-xs font-['Oswald'] uppercase font-semibold transition-all border shrink-0 cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#8B1E2D] text-white border-[#8B1E2D] shadow-[1px_1px_0_#0A0A0A]'
                  : 'bg-white text-gray-700 border-[#DFDBD2] hover:bg-[#F7F5F0]'
              }`}
              role="tab"
              aria-selected={filterCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Atalhos Disponíveis */}
        <div className="space-y-2">
          {filteredItems.map((item: ShortcutItem) => {
            const isSelected = selectedIds.includes(item.id);
            const orderIndex = selectedIds.indexOf(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-2.5 rounded-[6px] border-2 transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A]'
                    : 'border-[#DFDBD2] bg-[#F7F5F0]/60 hover:bg-white hover:border-gray-400 opacity-80'
                }`}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggle(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 border border-[#0A0A0A]/20"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <i className={`bi ${item.icon} text-lg`} aria-hidden="true"></i>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-['Oswald'] text-xs font-bold uppercase text-[#0A0A0A] truncate">
                        {item.fullLabel}
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 m-0 truncate leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center text-xs font-bold border border-[#0A0A0A]">
                      {orderIndex + 1}
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border-2 border-[#DFDBD2] flex items-center justify-center text-gray-300">
                      <i className="bi bi-plus text-sm" aria-hidden="true"></i>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Fixo da Sheet com Botões de Ação */}
      <div className="border-t border-[#DFDBD2] p-4 bg-white flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] px-3 py-2 text-xs font-['Oswald'] uppercase font-bold text-gray-600 hover:text-[#0A0A0A] bg-[#F7F5F0] hover:bg-gray-200 rounded-[6px] border border-[#DFDBD2] transition-colors cursor-pointer"
        >
          Restaurar 5 Eixos
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3 py-2 text-xs font-['Oswald'] uppercase font-bold text-gray-600 hover:text-black rounded-[6px] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValidCount}
            className={`min-h-[44px] px-4 py-2 text-xs font-['Oswald'] uppercase font-bold text-white rounded-[6px] border-2 border-[#0A0A0A] transition-all cursor-pointer ${
              isValidCount
                ? 'bg-[#8B1E2D] hover:bg-[#9E2424] shadow-[2px_2px_0_#0A0A0A] active:scale-95'
                : 'bg-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            Salvar Atalhos ({selectedIds.length})
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
