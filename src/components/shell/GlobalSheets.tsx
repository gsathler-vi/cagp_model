import React, { useState, useEffect } from 'react';
import { PassportSheet } from './PassportSheet';
import { CampusSheet } from './CampusSheet';
import { A11ySheet } from './A11ySheet';
import { ShortcutsSheet } from './ShortcutsSheet';
import { SpotlightModal } from './SpotlightModal';

export const GlobalSheets: React.FC = () => {
  const [activeSheet, setActiveSheet] = useState<'passport' | 'campus' | 'a11y' | 'settings' | 'shortcuts' | null>(null);

  useEffect(() => {
    const handlePassport = () => setActiveSheet('passport');
    const handleCampus = () => setActiveSheet('campus');
    const handleA11y = () => setActiveSheet('a11y');
    const handleSettings = () => setActiveSheet('settings');
    const handleShortcuts = () => setActiveSheet('shortcuts');

    window.addEventListener('cagp:open-passport', handlePassport);
    window.addEventListener('cagp:open-campus', handleCampus);
    window.addEventListener('cagp:open-a11y', handleA11y);
    window.addEventListener('cagp:open-settings', handleSettings);
    window.addEventListener('cagp:open-shortcuts', handleShortcuts);

    return () => {
      window.removeEventListener('cagp:open-passport', handlePassport);
      window.removeEventListener('cagp:open-campus', handleCampus);
      window.removeEventListener('cagp:open-a11y', handleA11y);
      window.removeEventListener('cagp:open-settings', handleSettings);
      window.removeEventListener('cagp:open-shortcuts', handleShortcuts);
    };
  }, []);

  return (
    <>
      <PassportSheet isOpen={activeSheet === 'passport'} onClose={() => setActiveSheet(null)} />
      <CampusSheet isOpen={activeSheet === 'campus'} onClose={() => setActiveSheet(null)} />
      <A11ySheet
        isOpen={activeSheet === 'a11y' || activeSheet === 'settings'}
        initialTab={activeSheet === 'settings' ? 'settings' : 'a11y'}
        onClose={() => setActiveSheet(null)}
      />
      <ShortcutsSheet isOpen={activeSheet === 'shortcuts'} onClose={() => setActiveSheet(null)} />
      <SpotlightModal />
    </>
  );
};
