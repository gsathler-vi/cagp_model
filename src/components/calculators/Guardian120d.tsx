import React, { useState, useEffect } from 'react';
import { getVaultItem, setVaultItem, type StudentCert } from '../../lib/storage/studentVault';

export const Guardian120d: React.FC = () => {
  const [certs, setCerts] = useState<StudentCert[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [mod, setMod] = useState('Eventos');

  useEffect(() => {
    setCerts(getVaultItem('cagp_aac_120d_certs_v1'));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const newCert: StudentCert = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      mod,
      date,
      hours: parseInt(hours, 10) || 0,
    };
    const updated = [...certs, newCert];
    setCerts(updated);
    setVaultItem('cagp_aac_120d_certs_v1', updated);
    setTitle('');
    setDate('');
    setHours('');
  };

  const handleRemove = (id: string) => {
    const updated = certs.filter((c) => c.id !== id);
    setCerts(updated);
    setVaultItem('cagp_aac_120d_certs_v1', updated);
  };

  const computeDaysLeft = (eventDateStr: string) => {
    const eventTime = new Date(eventDateStr).getTime();
    if (isNaN(eventTime)) return 0;
    const now = Date.now();
    const elapsedDays = Math.floor((now - eventTime) / (1000 * 60 * 60 * 24));
    return 120 - elapsedDays;
  };

  return (
    <div className="bg-white border border-[#DFDBD2] rounded-xl p-4 space-y-4">
      <div className="border-b border-[#DFDBD2] pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A]">
            Guardião do Prazo de 120 Dias
          </h3>
          <span className="text-[10px] bg-[#8B1E2D]/10 text-[#8B1E2D] font-mono px-2 py-0.5 rounded border border-[#8B1E2D]/20">
            Art. 15, § 4º
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Certificados de eventos, congressos e cursos devem ser protocolados na Secretaria em até <strong>120 dias corridos</strong> após a emissão.
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-[#F7F5F0] p-3 rounded-lg border border-[#DFDBD2] space-y-2">
        <span className="block font-['Oswald'] font-bold text-xs uppercase text-[#0A0A0A]">
          Cadastrar Novo Certificado
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            id="guardian-cert-title"
            name="certTitle"
            type="text"
            placeholder="Nome do Evento / Curso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white border border-[#DFDBD2] p-1.5 rounded text-xs focus:border-[#8B1E2D] focus:outline-none"
            required
            aria-label="Nome do Evento ou Curso"
          />
          <input
            id="guardian-cert-date"
            name="certDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-[#DFDBD2] p-1.5 rounded text-xs focus:border-[#8B1E2D] focus:outline-none"
            required
            aria-label="Data de Emissão do Certificado"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="guardian-cert-hours"
            name="certHours"
            type="number"
            placeholder="Horas (ex: 30)"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-28 bg-white border border-[#DFDBD2] p-1.5 rounded text-xs focus:border-[#8B1E2D] focus:outline-none"
            aria-label="Horas do Certificado"
          />
          <select
            id="guardian-cert-mod"
            name="certMod"
            value={mod}
            onChange={(e) => setMod(e.target.value)}
            className="bg-white border border-[#DFDBD2] p-1.5 rounded text-xs focus:border-[#8B1E2D] focus:outline-none"
            aria-label="Modalidade do Certificado"
          >
            <option value="Eventos">Eventos / Congressos</option>
            <option value="Cursos">Cursos Complementares</option>
            <option value="Pesquisa">Iniciação / Pesquisa</option>
          </select>
          <button type="submit" className="cagp-btn-primary text-xs py-1.5 px-3 ml-auto cursor-pointer">
            Adicionar
          </button>
        </div>
      </form>

      {/* Certs List */}
      <div className="space-y-2">
        {certs.length === 0 ? (
          <p className="text-xs text-gray-500 italic p-3 text-center">Nenhum certificado cadastrado no cofre.</p>
        ) : (
          certs.map((c) => {
            const daysLeft = computeDaysLeft(c.date);
            const isExpired = daysLeft <= 0;
            const isWarning = daysLeft > 0 && daysLeft <= 30;

            return (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-[#DFDBD2] bg-white gap-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-[#0A0A0A] truncate">{c.title}</span>
                    <span className="text-[10px] text-gray-500 font-mono bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[#DFDBD2]">
                      {c.hours}h • {c.mod}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Emissão: {c.date}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <span
                    className={`cagp-stamp-badge text-[10px] ${
                      isExpired ? 'is-indeferido' : isWarning ? 'is-homologado' : 'is-deferido'
                    }`}
                  >
                    <i
                      className={`bi ${
                        isExpired
                          ? 'bi-x-circle-fill'
                          : isWarning
                          ? 'bi-exclamation-triangle-fill'
                          : 'bi-check-circle-fill'
                      }`}
                    ></i>
                    {isExpired
                      ? 'PRECLUSO (>120D)'
                      : isWarning
                      ? `URGENTE: ${daysLeft}D`
                      : `TEMPESTIVO: ${daysLeft}D`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(c.id)}
                    className="text-gray-400 hover:text-[#DC2626] p-1.5 text-xs rounded hover:bg-red-50 transition-colors"
                    title="Remover certificado"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
