import React, { useState, useEffect } from 'react';
import {
  getVaultItem,
  setVaultItem,
  type CustomCourse,
} from '../../../../lib/storage/studentVault';
import { BottomSheet } from '../../../shell/BottomSheet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultPeriod?: number;
  catalogOptions?: Array<{ code: string; name: string; dept: string; ch: number }>;
}

export const CustomCourseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultPeriod = 4,
  catalogOptions = [],
}) => {
  const [mode, setMode] = useState<'catalog' | 'custom'>('catalog');
  const [selectedCatalogCode, setSelectedCatalogCode] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [customName, setCustomName] = useState('');
  const [customDept, setCustomDept] = useState('FACE');
  const [customCh, setCustomCh] = useState(60);
  const [period, setPeriod] = useState(defaultPeriod);
  const [category, setCategory] = useState<'optativa_catalogo' | 'formacao_livre' | 'eletiva_externa'>('optativa_catalogo');

  useEffect(() => {
    setPeriod(defaultPeriod);
  }, [defaultPeriod]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newCourse: CustomCourse;

    if (mode === 'catalog') {
      const found = catalogOptions.find((c) => c.code === selectedCatalogCode);
      if (!found) return;

      newCourse = {
        id: `course-${found.code.replace(/\s+/g, '')}-${Date.now()}`,
        code: found.code,
        name: found.name,
        dept: found.dept || 'DCP',
        period: Number(period),
        ch: found.ch || 60,
        category: 'optativa_catalogo',
      };
    } else {
      if (!customCode.trim() || !customName.trim()) return;

      newCourse = {
        id: `course-custom-${Date.now()}`,
        code: customCode.trim().toUpperCase(),
        name: customName.trim(),
        dept: customDept.trim().toUpperCase(),
        period: Number(period),
        ch: Number(customCh) || 60,
        category,
      };
    }

    const currentVault = getVaultItem('cagp_custom_curriculum_v1') || { assignedCourses: [] };
    const nextList = [...currentVault.assignedCourses, newCourse];

    setVaultItem('cagp_custom_curriculum_v1', { assignedCourses: nextList });

    // Toast feedback
    (window as any).cagpToast?.(
      `✓ ${newCourse.code} adicionada ao ${newCourse.period}º período do Grafo!`,
      'bi-check2-circle'
    );

    // Reset and close
    setCustomCode('');
    setCustomName('');
    onClose();
  };

  return (
    <BottomSheet
      id="modal-custom-course"
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Disciplina ao Grafo 10P"
      initialDetent="large"
    >
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
        {/* Alternador de Modo: Catálogo vs Externa Personalizada */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F5F0] rounded-lg border border-[#DFDBD2]">
          <button
            type="button"
            onClick={() => setMode('catalog')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-['Oswald'] uppercase font-bold transition-all min-h-[44px] flex items-center justify-center cursor-pointer ${
              mode === 'catalog'
                ? 'bg-[#0A0A0A] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            }`}
          >
            1. Do Catálogo Oficial (68)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('custom');
              setCategory('formacao_livre');
            }}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-['Oswald'] uppercase font-bold transition-all min-h-[44px] flex items-center justify-center cursor-pointer ${
              mode === 'custom'
                ? 'bg-[#8B1E2D] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            }`}
          >
            2. Disciplina Livre / Externa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'catalog' ? (
            <div>
              <label htmlFor="catalog-select" className="block text-xs font-bold text-gray-700 mb-1">
                Selecione a Disciplina Optativa do PPC:
              </label>
              <select
                id="catalog-select"
                name="catalogCourse"
                required
                value={selectedCatalogCode}
                onChange={(e) => setSelectedCatalogCode(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
              >
                <option value="">Selecione uma optativa homologada...</option>
                {catalogOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.code} — {opt.name} ({opt.ch}h)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2.5 bg-[#FEF3C7] border border-[#B45309]/30 rounded text-xs text-[#0A0A0A] leading-relaxed">
                <i className="bi bi-info-circle-fill text-[#B45309] mr-1" aria-hidden="true" />
                Você pode adicionar qualquer disciplina cursada em outros departamentos da UFMG (FACE, Faculdade de Direito, ECI, ICEx, etc.) para compor as <strong>120h de Formação Livre</strong> ou eletivas.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="custom-code" className="block text-xs font-bold text-gray-700 mb-1">
                    Código:
                  </label>
                  <input
                    id="custom-code"
                    name="customCode"
                    type="text"
                    required
                    placeholder="Ex: DIR010"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] uppercase focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="custom-dept" className="block text-xs font-bold text-gray-700 mb-1">
                    Unidade / Departamento:
                  </label>
                  <input
                    id="custom-dept"
                    name="customDept"
                    type="text"
                    required
                    placeholder="Ex: Direito / FACE"
                    value={customDept}
                    onChange={(e) => setCustomDept(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="custom-name" className="block text-xs font-bold text-gray-700 mb-1">
                  Nome da Disciplina:
                </label>
                <input
                  id="custom-name"
                  name="customName"
                  type="text"
                  required
                  placeholder="Ex: Direito Constitucional Aplicado"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="custom-ch" className="block text-xs font-bold text-gray-700 mb-1">
                    Carga Horária:
                  </label>
                  <select
                    id="custom-ch"
                    name="customCh"
                    value={customCh}
                    onChange={(e) => setCustomCh(Number(e.target.value))}
                    className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                  >
                    <option value={30}>30 horas (2 créditos)</option>
                    <option value={60}>60 horas (4 créditos)</option>
                    <option value={90}>90 horas (6 créditos)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="custom-cat" className="block text-xs font-bold text-gray-700 mb-1">
                    Enquadramento:
                  </label>
                  <select
                    id="custom-cat"
                    name="customCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                  >
                    <option value="formacao_livre">Formação Livre (120h)</option>
                    <option value="eletiva_externa">Optativa Eletiva</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Período de Alocação no Grafo */}
          <div>
            <label htmlFor="period-select" className="block text-xs font-bold text-gray-700 mb-1">
              Alocar no Período do Grafo:
            </label>
            <select
              id="period-select"
              name="periodSelect"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                <option key={p} value={p}>
                  {p}º Período Letivo
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFDBD2]">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] rounded-lg text-xs font-['Oswald'] uppercase font-bold text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 bg-[#8B1E2D] text-white hover:bg-[#0A0A0A] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider shadow-[2px_2px_0px_#0A0A0A] transition-all"
            >
              Confirmar & Inserir no Grafo
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
};
