import React from 'react';
import { useGameStore } from './store/useGameStore';
import { CrtOverlay } from './components/effects/CrtOverlay';
import { BiosBootScreen } from './components/onboarding/BiosBootScreen';
import { IdentityAuthModal } from './components/onboarding/IdentityAuthModal';
import { AuditWarrantModal } from './components/onboarding/AuditWarrantModal';
import { TopStatusBar } from './components/desktop/TopStatusBar';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/desktop/Taskbar';

export const App: React.FC = () => {
  const onboardingStep = useGameStore((s) => s.onboardingStep);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-cyber-950 text-slate-100 font-sans relative select-none">
      {/* CRT Visual Scanline & Vignette Shader Overlay */}
      <CrtOverlay />

      {/* Onboarding Flow: BIOS Boot -> Identity Check -> Audit Warrant */}
      {onboardingStep === 'bios' && <BiosBootScreen />}
      {onboardingStep === 'identity' && <IdentityAuthModal />}
      {onboardingStep === 'warrant' && <AuditWarrantModal />}

      {/* Primary Desktop Environment (When Onboarding is Completed) */}
      {onboardingStep === 'completed' && (
        <>
          <TopStatusBar />
          <Desktop />
          <Taskbar />
        </>
      )}
    </div>
  );
};

export default App;
