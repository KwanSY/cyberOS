import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { ShieldAlert, Cpu, HardDrive, Terminal } from 'lucide-react';

const BOOT_LOGS = [
  'Phoenix RetroBIOS (C) 1985-2010 CyberTech Systems Corp.',
  'BIOS Date: 06/10/10 09:28:14 Ver: 1.0.4096-CYBER',
  'CPU: Intel(R) Core(TM)2 Quad CPU Q9550 @ 2.83GHz',
  'Memory Test: 4096MB OK (ECC Enabled)',
  'Primary Master HDD: CYBER-SATA 500GB (Target Image Mounted)',
  'Forensic Read-Only Hardware Blocker: ACTIVE [WRITE-LOCK: ON]',
  'Detecting CyberOS Kernel 1.0.0-forensic...',
  'Mounting /dev/sda1 on / (ext3, ro, noatime)...',
  'Initializing Forensic Audit Protocol FA-9021...',
  'Loading Evidence Filesystem: 100% Complete.',
  'Starting CyberOS Desktop Environment...',
];

export const BiosBootScreen: React.FC = () => {
  const setOnboardingStep = useGameStore((s) => s.setOnboardingStep);
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    soundService.playBeep(440, 0.08);

    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        soundService.playKeyClick(0.7 + index * 0.05);
        setLines((prev) => [...prev, BOOT_LOGS[index]]);
        index++;
      } else {
        clearInterval(interval);
        soundService.playBeep(880, 0.12);
        setIsReady(true);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  const handleProceed = () => {
    soundService.playBeep(990, 0.09);
    setOnboardingStep('identity');
  };

  return (
    <div
      onClick={handleProceed}
      className="fixed inset-0 bg-black text-terminal-green font-mono p-8 flex flex-col justify-between select-none z-50 cursor-pointer overflow-hidden"
    >
      <div className="space-y-1 text-sm tracking-wide leading-relaxed">
        <div className="flex items-center gap-3 border-b border-terminal-green/40 pb-3 mb-4 text-terminal-green/90">
          <Terminal className="w-6 h-6 animate-pulse" />
          <span className="font-bold text-base">CYBER-FORENSIC SECURE WORKSTATION BOOT</span>
          <span className="text-xs bg-terminal-green/20 px-2 py-0.5 rounded text-terminal-green ml-auto">
            BUILD 20100610
          </span>
        </div>

        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-terminal-dimGreen">[{idx.toString().padStart(2, '0')}]</span>
            <span>{line}</span>
          </div>
        ))}

        {!isReady && (
          <div className="inline-block w-2.5 h-4 bg-terminal-green animate-pulse ml-1 align-middle" />
        )}
      </div>

      <div className="border-t border-terminal-green/30 pt-4 flex items-center justify-between text-xs text-terminal-dimGreen">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> CPU: OK
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" /> DISK_RO: OK
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5" /> EVIDENCE INTEGRITY: VERIFIED
          </span>
        </div>

        <div className="text-terminal-green font-semibold animate-pulse text-sm">
          {isReady ? '▶ 点击任意位置或按 [回车键] 登入取证系统 ◀' : '系统正在自检加载中...'}
        </div>
      </div>
    </div>
  );
};
