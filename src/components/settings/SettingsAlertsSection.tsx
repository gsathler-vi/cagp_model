import React from 'react';
import type { VaultData } from '../../lib/storage/studentVault';
import { downloadPresetIcs } from '../../lib/calendar/icsGenerator';

interface Props {
  notifs: VaultData<'cagp_notifications_prefs_v1'>;
  updateNotifs: (partial: Partial<VaultData<'cagp_notifications_prefs_v1'>>) => void;
}

export const SettingsAlertsSection: React.FC<Props> = ({ notifs, updateNotifs }) => {
  return (
    <section className="bg-white border border-[#DFDBD2] rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFDBD2] pb-3">
        <div className="flex items-center gap-2">
          <i className="bi bi-bell-fill text-xl text-[#B45309]" aria-hidden="true" />
          <div>
            <h2 className="font-['Oswald'] text-base font-bold uppercase text-[#0A0A0A] m-0">
              2. Alertas do Campus & Horários Noturnos
            </h2>
            <p className="text-xs text-gray-500 m-0">Sincronização com o cotidiano discente da FAFICH</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DFDBD2] flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">
              Jantar no RU II Setorial (18h15)
            </strong>
            <span className="text-xs text-gray-600">Catracas encerram às 19h30 no turno noturno</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadPresetIcs('ru-1815')}
              className="cagp-btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
            >
              <i className="bi bi-calendar-plus" aria-hidden="true" /> Baixar .ics
            </button>
            <input
              type="checkbox"
              checked={notifs.ru1815}
              onChange={(e) => updateNotifs({ ru1815: e.target.checked })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DFDBD2] flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">
              Último Circular FAFICH (22h30)
            </strong>
            <span className="text-xs text-gray-600">Linhas gratuitas operam viagens até 22h45</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadPresetIcs('circular-2230')}
              className="cagp-btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
            >
              <i className="bi bi-calendar-plus" aria-hidden="true" /> Baixar .ics
            </button>
            <input
              type="checkbox"
              checked={notifs.circular2230}
              onChange={(e) => updateNotifs({ circular2230: e.target.checked })}
              className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DFDBD2] flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="block text-xs font-bold uppercase text-[#0A0A0A]">
              Guardião 120 Dias de AAC
            </strong>
            <span className="text-xs text-gray-600">Aviso preventivo antes da preclusão regimental (Art. 15, § 4º)</span>
          </div>
          <input
            type="checkbox"
            checked={notifs.aac120d}
            onChange={(e) => updateNotifs({ aac120d: e.target.checked })}
            className="w-5 h-5 accent-[#8B1E2D] cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};
