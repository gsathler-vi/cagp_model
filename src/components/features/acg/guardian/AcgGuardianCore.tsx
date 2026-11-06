import React, { useState, useEffect } from 'react';
import {
  getVaultItem,
  setVaultItem,
  type StudentCert,
} from '../../../../lib/storage/studentVault';
import { downloadAac120dIcs } from '../../../../lib/ics';

export const AcgGuardianCore: React.FC = () => {
  const [certs, setCerts] = useState<StudentCert[]>([]);
  const [title, setTitle] = useState('');
  const [mod, setMod] = useState('Eventos & Congressos');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState(15);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setCerts(getVaultItem('cagp_aac_120d_certs_v1') || []);

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'cagp_aac_120d_certs_v1') {
        setCerts(custom.detail.value || []);
      }
    };

    window.addEventListener('cagp:vault-updated', handleUpdate);
    return () => window.removeEventListener('cagp:vault-updated', handleUpdate);
  }, []);

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCert: StudentCert = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      mod,
      date,
      hours: Number(hours) || 0,
    };

    const nextList = [newCert, ...certs];
    setCerts(nextList);
    setVaultItem('cagp_aac_120d_certs_v1', nextList);

    setTitle('');
    setStatusMessage(`Certificado "${newCert.title}" cadastrado com sucesso!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDeleteCert = (id: string) => {
    const nextList = certs.filter((c) => c.id !== id);
    setCerts(nextList);
    setVaultItem('cagp_aac_120d_certs_v1', nextList);
  };

  const getDaysLeft = (emissionDateStr: string): number => {
    const emission = new Date(emissionDateStr);
    const deadline = new Date(emission.getTime() + 120 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="cagp-guardian-core select-none space-y-6">
      {/* Alerta Normativo do Art. 15, § 4º */}
      <div className="p-4 bg-[#FEF3C7] border-2 border-[#B45309] rounded-xl shadow-xs">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-lg bg-[#B45309] text-white flex items-center justify-center text-lg shrink-0 mt-0.5">
            <i className="bi bi-shield-exclamation" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-['Oswald'] text-base uppercase font-bold text-[#0A0A0A] leading-tight m-0">
              Guardião do Prazo Fatal de 120 Dias Corridos
            </h3>
            <p className="text-xs text-gray-800 mt-1 leading-relaxed m-0">
              <strong>Art. 15, § 4º do Regulamento do Curso (Versão N-20229):</strong> Certificados de atividades complementares (AAC) devem ser obrigatoriamente protocolados perante o Colegiado de Gestão Pública em até <strong>120 dias corridos</strong> após a emissão do documento. Após esse prazo, o aproveitamento prescreve e é indeferido pela Coordenação.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cadastro de Certificado */}
        <div className="lg:col-span-1 cagp-card p-4 bg-white border border-[#DFDBD2] rounded-xl h-fit shadow-xs">
          <h4 className="font-['Oswald'] text-sm uppercase font-bold text-[#0A0A0A] mb-3 pb-2 border-b border-[#DFDBD2] flex items-center gap-2">
            <i className="bi bi-plus-circle text-[#8B1E2D]" aria-hidden="true" />
            <span>Cadastrar Novo Certificado</span>
          </h4>

          {statusMessage && (
            <div className="p-2.5 mb-3 bg-[#DCFCE7] border border-[#15803D] rounded text-xs text-[#15803D] font-bold">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleAddCert} className="space-y-3">
            <div>
              <label htmlFor="cert-title" className="block text-xs font-bold text-gray-700 mb-1">
                Título do Evento ou Curso:
              </label>
              <input
                id="cert-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: I Seminário de Políticas Públicas UFMG"
                className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cert-mod" className="block text-xs font-bold text-gray-700 mb-1">
                Modalidade de AAC:
              </label>
              <select
                id="cert-mod"
                value={mod}
                onChange={(e) => setMod(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
              >
                <option value="Eventos & Congressos">Eventos & Congressos (Teto 60h)</option>
                <option value="Cursos Livres">Cursos Livres de Extensão (Teto 60h)</option>
                <option value="Iniciação Científica">Iniciação Científica / PIBIC (Teto 90h)</option>
                <option value="Monitoria de Graduação">Monitoria de Graduação (Teto 90h)</option>
                <option value="Representação Estudantil">Representação no Colegiado/CAGP (Teto 60h)</option>
                <option value="Outras Atividades">Outras Atividades Aprovadas (Teto 30h)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="cert-date" className="block text-xs font-bold text-gray-700 mb-1">
                  Data de Emissão:
                </label>
                <input
                  id="cert-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="cert-hours" className="block text-xs font-bold text-gray-700 mb-1">
                  Carga Horária:
                </label>
                <input
                  id="cert-hours"
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-[#F7F5F0] border border-[#DFDBD2] px-3 py-2 rounded text-base sm:text-xs text-[#0A0A0A] focus:border-[#8B1E2D] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] px-4 py-2 bg-[#0A0A0A] text-white hover:bg-[#8B1E2D] rounded-lg font-['Oswald'] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all mt-4 shadow-[2px_2px_0px_#0A0A0A]"
            >
              <i className="bi bi-shield-plus" aria-hidden="true" />
              <span>Adicionar ao Guardião</span>
            </button>
          </form>
        </div>

        {/* Listagem de Certificados Monitorados */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#0A0A0A]">
            <h4 className="font-['Oswald'] text-sm uppercase font-bold text-[#0A0A0A] m-0 flex items-center gap-2">
              <i className="bi bi-clock-history text-[#B45309]" aria-hidden="true" />
              <span>Certificados Monitorados ({certs.length})</span>
            </h4>
            <span className="text-xs text-gray-500 font-mono">
              Total: {certs.reduce((acc, c) => acc + c.hours, 0)} horas
            </span>
          </div>

          {certs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#DFDBD2] rounded-xl text-gray-500">
              <i className="bi bi-folder2-open text-3xl text-gray-400 block mb-2" aria-hidden="true" />
              <p className="text-sm font-bold text-gray-700 m-0">Nenhum certificado cadastrado.</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Cadastre seus certificados assim que forem emitidos para receber alertas e nunca perder os 120 dias regimentais.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {certs.map((c) => {
                const daysLeft = getDaysLeft(c.date);
                const isExpired = daysLeft <= 0;
                const isUrgent = daysLeft > 0 && daysLeft <= 20;

                return (
                  <div
                    key={c.id}
                    className="p-3.5 bg-white border border-[#DFDBD2] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="cagp-badge cagp-badge-dark text-[10px]">{c.mod}</span>
                        <span className="font-mono text-xs font-bold text-[#8B1E2D]">{c.hours} horas</span>
                      </div>
                      <h5 className="font-['Oswald'] text-sm font-bold text-[#0A0A0A] truncate m-0">
                        {c.title}
                      </h5>
                      <span className="text-[11px] text-gray-500 font-mono">
                        Emitido em: {new Date(c.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        {isExpired ? (
                          <span className="cagp-stamp-badge text-[10px] font-black tracking-widest text-[#DC2626] border-2 border-[#DC2626] bg-[#FEE2E2] block py-0.5 px-2">
                            EXPIRADO (0D)
                          </span>
                        ) : isUrgent ? (
                          <span className="cagp-stamp-badge text-[10px] font-black tracking-widest text-[#B45309] border-2 border-[#B45309] bg-[#FEF3C7] block py-0.5 px-2 animate-pulse">
                            URGENTE ({daysLeft}D)
                          </span>
                        ) : (
                          <span className="cagp-stamp-badge is-feito text-[10px] font-black tracking-widest text-[#15803D] border-2 border-[#15803D] bg-[#DCFCE7] block py-0.5 px-2">
                            NO PRAZO ({daysLeft}D)
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadAac120dIcs(c.title, new Date(c.date))}
                        className="w-9 h-9 rounded-lg bg-[#F7F5F0] hover:bg-[#EAE6DE] border border-[#DFDBD2] hover:border-[#0A0A0A] text-gray-700 flex items-center justify-center text-sm active:scale-95 transition-all cursor-pointer shadow-xs"
                        title="Baixar lembrete de calendário (.ics)"
                        aria-label="Baixar lembrete de calendário (.ics)"
                      >
                        <i className="bi bi-calendar-event" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCert(c.id)}
                        className="w-9 h-9 rounded-lg bg-[#F7F5F0] hover:bg-[#FEE2E2] hover:text-[#DC2626] border border-[#DFDBD2] hover:border-[#DC2626] text-gray-400 flex items-center justify-center text-sm active:scale-95 transition-all cursor-pointer shadow-xs"
                        title="Excluir certificado"
                        aria-label="Excluir certificado"
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
