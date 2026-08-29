import { create } from 'zustand';
import {
  AppId,
  AudioTrack,
  BlockchainContract,
  Chapter2DeductionSlots,
  Chapter3DeductionSlots,
  DeductionSlots,
  DeductionSubmissionResult,
  FsFile,
  GitCommit,
  MailItem,
  NarrativeStage,
  Objective,
  ObjectiveId,
  OnionBoardPost,
  SystemSettings,
  WebPage,
  WindowState,
  WordItem,
} from '../types/game';
import {
  ALL_INVESTIGATION_WORDS as CH1_WORDS,
  DEDUCTION_SOLUTION as CH1_SOLUTION,
  INITIAL_FILESYSTEM as CH1_FS,
  INITIAL_MAILS as CH1_MAILS,
  INITIAL_OBJECTIVES as CH1_OBJECTIVES,
  INITIAL_WEB_PAGES as CH1_PAGES,
} from '../data/chapter1Seed';
import {
  CHAPTER2_AUDIO_TRACK,
  CHAPTER2_DEDUCTION_SOLUTION,
  CHAPTER2_FILESYSTEM,
  CHAPTER2_MAILS,
  CHAPTER2_NOTEPAD_CONTENT,
  CHAPTER2_OBJECTIVES,
  CHAPTER2_SYSTEM_INFO,
  CHAPTER2_WEB_PAGES,
  CHAPTER2_WORDS,
} from '../data/chapter2Seed';
import {
  CHAPTER3_BLOCKCHAIN,
  CHAPTER3_DEDUCTION_SOLUTION,
  CHAPTER3_FILESYSTEM,
  CHAPTER3_GIT_COMMITS,
  CHAPTER3_HIVENET_PAGES,
  CHAPTER3_MAILS,
  CHAPTER3_NOTEPAD_CONTENT,
  CHAPTER3_OBJECTIVES,
  CHAPTER3_ONION_POSTS,
  CHAPTER3_SYSTEM_INFO,
  CHAPTER3_WORDS,
} from '../data/chapter3Seed';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'diff' | 'system' | 'trace' | 'warning';
  text: string;
  diffLines?: Array<{ type: 'same' | 'added' | 'removed'; text: string }>;
  traceHops?: Array<{
    hop: number;
    ip: string;
    rtt: string;
    location: string;
    org: string;
    isTarget?: boolean;
  }>;
}

interface ToastInfo {
  id: number;
  text: string;
  category?: string;
}

interface GameStoreState {
  // Global & Narrative Lifecycle
  currentChapter: 1 | 2 | 3;
  narrativeStage: NarrativeStage;
  onboardingStep: 'bios' | 'identity' | 'warrant' | 'completed';
  setOnboardingStep: (step: 'bios' | 'identity' | 'warrant' | 'completed') => void;

  // Narrative Bridge Actions
  triggerDeadManSwitch: () => void;
  signArchiveAndClose: () => void;
  rewindDeadManSwitch: () => void;
  overrideAndMountChapter2: () => void;
  triggerChapter3Meltdown: () => void;
  enterChapter3OnionGateway: () => void;
  submitKeysToOmnimind: () => void;
  rewindToOnionGateway: () => void;
  rejectOmnimindAndMountChapter3: () => void;
  triggerSandboxCollapse: () => void;
  warpToChapter: (chapter: 1 | 2 | 3, directDarkWeb?: boolean) => void;
  setNarrativeStage: (stage: NarrativeStage) => void;

  // Dynamic Objectives
  objectives: Objective[];
  unlockObjective: (id: ObjectiveId) => void;
  completeObjective: (id: ObjectiveId) => void;

  // Words / Word Bank
  collectedWords: WordItem[];
  availableWordsPool: WordItem[];
  addWord: (wordText: string, customCategory?: WordItem['category']) => void;
  toast: ToastInfo | null;
  clearToast: () => void;

  // Windows
  windows: Record<AppId, WindowState>;
  maxZIndex: number;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowPosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => void;

  // Mail App
  mails: MailItem[];
  selectedMailId: string;
  activeMailFolder: 'leads' | 'inbox' | 'drafts' | 'trash';
  selectMail: (id: string) => void;
  setActiveMailFolder: (folder: 'leads' | 'inbox' | 'drafts' | 'trash') => void;
  markMailRead: (id: string) => void;

  // Browser App & HiveNet
  webPages: WebPage[];
  onionPosts: OnionBoardPost[];
  searchQuery: string;
  activePageId: string | null;
  browserHistory: string[];
  browserMode: 'web' | 'medquery';
  setBrowserMode: (mode: 'web' | 'medquery') => void;
  setSearchQuery: (query: string) => void;
  navigateToPage: (pageId: string | null) => void;

  // CyberGit & Blockchain
  gitCommits: GitCommit[];
  blockchain: BlockchainContract;
  selectedCommitHash: string;
  selectCommit: (hash: string) => void;

  // CyberTerminal App
  terminalLines: TerminalLine[];
  terminalCwd: string;
  filesystem: FsFile[];
  commandHistory: string[];
  executeTerminalCommand: (cmd: string) => void;
  clearTerminal: () => void;

  // CyberPlayer App (Audio & Voiceprints)
  audioTrack: AudioTrack;
  hasDiscoveredAudioTrack: boolean;
  discoverAudioTrack: () => void;
  isAudioPlaying: boolean;
  audioPlaybackProgress: number;
  currentSubtitleIndex: number;
  playAudio: () => void;
  pauseAudio: () => void;
  seekAudio: (seconds: number) => void;
  unlockAudioTrack: () => void;

  // Notepad App
  notepadContent: string;
  setNotepadContent: (content: string) => void;

  // Deduction Board App (Chapter 1, 2, 3)
  deductionSlots: DeductionSlots;
  setDeductionSlot: (slotKey: keyof DeductionSlots, wordText: string | null) => void;
  chapter2Slots: Chapter2DeductionSlots;
  setChapter2Slot: (slotKey: keyof Chapter2DeductionSlots, wordText: string | null) => void;
  chapter3Slots: Chapter3DeductionSlots;
  setChapter3Slot: (slotKey: keyof Chapter3DeductionSlots, wordText: string | null) => void;
  submissionResult: DeductionSubmissionResult | null;
  submitDeduction: () => void;
  submitChapter2Deduction: () => void;
  submitChapter3Deduction: () => void;
  resetDeductionResult: () => void;

  // Modals & Victory
  isVictoryModalOpen: boolean;
  setVictoryModalOpen: (open: boolean) => void;
  isClosureModalOpen: boolean;
  setClosureModalOpen: (open: boolean) => void;
  isMeltdownEscapeModalOpen: boolean;
  setMeltdownEscapeModalOpen: (open: boolean) => void;
  isOnionGatewayOpen: boolean;
  setOnionGatewayOpen: (open: boolean) => void;
  isSandboxCollapseOpen: boolean;
  setSandboxCollapseOpen: (open: boolean) => void;
  isFacelessPuppetActive: boolean;

  restartGame: () => void;

  // System Settings
  settings: SystemSettings;
  toggleCrt: () => void;
  toggleMute: () => void;
  toggleAmbientHum: () => void;
  systemTime: string;
  caseId: string;
  osVersion: string;
}


const DEFAULT_WINDOWS: Record<AppId, WindowState> = {
  mailbox: {
    id: 'mailbox',
    title: 'MailBox (工作站加密邮件终端)',
    icon: 'Mail',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 50, y: 45 },
    size: { width: 820, height: 520 },
    minSize: { width: 550, height: 380 },
  },
  netquery: {
    id: 'netquery',
    title: 'NetQuery (档案检索与医疗数据库)',
    icon: 'Globe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 120, y: 70 },
    size: { width: 880, height: 560 },
    minSize: { width: 600, height: 400 },
  },
  hivenet: {
    id: 'hivenet',
    title: 'HiveNet (洋葱暗网安全浏览器 v3.0)',
    icon: 'Globe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 80, y: 40 },
    size: { width: 900, height: 580 },
    minSize: { width: 640, height: 420 },
  },
  cybergit: {
    id: 'cybergit',
    title: 'CyberGit (代码提交历史与溯源审计器)',
    icon: 'GitBranch',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 140, y: 65 },
    size: { width: 880, height: 540 },
    minSize: { width: 600, height: 400 },
  },
  chainexplorer: {
    id: 'chainexplorer',
    title: 'ChainExplorer (区块链智能合约账本浏览器)',
    icon: 'Coins',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 200, y: 90 },
    size: { width: 860, height: 520 },
    minSize: { width: 580, height: 380 },
  },
  cyberterminal: {
    id: 'cyberterminal',
    title: 'CyberTerminal (极简暗网取证终端 v3.0)',
    icon: 'Terminal',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 200, y: 100 },
    size: { width: 820, height: 500 },
    minSize: { width: 560, height: 360 },
  },
  deduction: {
    id: 'deduction',
    title: 'DeductionBoard (调查定罪与公开弹劾看板)',
    icon: 'FileCheck2',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 80, y: 48 },
    size: { width: 920, height: 530 },
    minSize: { width: 620, height: 380 },
  },
  cyberplayer: {
    id: 'cyberplayer',
    title: 'CyberPlayer (声纹与录音播放器 v2.0)',
    icon: 'AudioWaveform',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 260, y: 110 },
    size: { width: 780, height: 480 },
    minSize: { width: 560, height: 360 },
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad (审计员私人记事便签)',
    icon: 'FileText',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 380, y: 140 },
    size: { width: 480, height: 360 },
    minSize: { width: 360, height: 260 },
  },
  trash: {
    id: 'trash',
    title: 'Trash (数据碎片回收站)',
    icon: 'Trash2',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 300, y: 140 },
    size: { width: 580, height: 380 },
    minSize: { width: 450, height: 300 },
  },
  systeminfo: {
    id: 'systeminfo',
    title: 'SystemInfo (取证工作站系统信息)',
    icon: 'Info',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 350, y: 120 },
    size: { width: 600, height: 420 },
    minSize: { width: 480, height: 320 },
  },
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  // Global & Narrative Lifecycle
  currentChapter: 1,
  narrativeStage: 'CASE_1_PLAYING',
  onboardingStep: 'bios',
  setOnboardingStep: (step) => {
    soundService.playKeyClick();
    set({ onboardingStep: step });
  },

  // Narrative Bridge Actions
  triggerDeadManSwitch: () => {
    if (get().narrativeStage !== 'DEAD_MAN_SWITCH') {
      soundService.playPrivilegeOverrideAlarm();
      set({ narrativeStage: 'DEAD_MAN_SWITCH' });
    }
  },

  signArchiveAndClose: () => {
    soundService.playStampThud();
    soundService.playBuzzer();
    set({
      narrativeStage: 'BAD_ENDING',
      isClosureModalOpen: false,
      isVictoryModalOpen: false,
    });
  },

  rewindDeadManSwitch: () => {
    soundService.playTapeRewind();
    setTimeout(() => {
      set({
        narrativeStage: 'DEAD_MAN_SWITCH',
        isClosureModalOpen: true,
      });
    }, 600);
  },

  overrideAndMountChapter2: () => {
    soundService.playPrivilegeOverrideAlarm();
    setTimeout(() => {
      soundService.playBeep(1200, 0.15);
    }, 300);

    // Switch dataset to Chapter 2 & Reset windows to cleanly open MailBox
    set({
      currentChapter: 2,
      narrativeStage: 'CHAPTER_2_PLAYING',
      isClosureModalOpen: false,
      isVictoryModalOpen: false,
      osVersion: CHAPTER2_SYSTEM_INFO.os_version,
      systemTime: CHAPTER2_SYSTEM_INFO.virtual_time,
      caseId: CHAPTER2_SYSTEM_INFO.case_id,
      objectives: CHAPTER2_OBJECTIVES,
      mails: CHAPTER2_MAILS,
      selectedMailId: 'mail_201',
      activeMailFolder: 'inbox',
      webPages: CHAPTER2_WEB_PAGES,
      activePageId: CHAPTER2_WEB_PAGES[0].id,
      filesystem: CHAPTER2_FILESYSTEM,
      availableWordsPool: [...CH1_WORDS, ...CHAPTER2_WORDS],
      notepadContent: CHAPTER2_NOTEPAD_CONTENT,
      audioTrack: CHAPTER2_AUDIO_TRACK,
      hasDiscoveredAudioTrack: false,
      // Reset windows: close previous deduction/browser/terminal and cleanly open MailApp
      windows: {
        ...DEFAULT_WINDOWS,
        mailbox: {
          ...DEFAULT_WINDOWS.mailbox,
          isOpen: true,
          isMinimized: false,
          zIndex: 10,
        },
      },
      maxZIndex: 10,
      terminalCwd: '/home/auditor',
      terminalLines: [
        {
          id: 'l_ch2_1',
          type: 'system',
          text: 'CyberOS Forensic Terminal v1.1 [Build 20100615 - PRIVILEGE OVERRIDE]',
        },
        {
          id: 'l_ch2_2',
          type: 'system',
          text: '[SYSTEM MOUNT] Successfully mounted /mnt/st_luke_hospital_mirror.raw to virtual workspace.',
        },
        {
          id: 'l_ch2_3',
          type: 'system',
          text: 'Type "help" to view updated commands (trace, diff, decrypt, ls, cat).',
        },
      ],
      toast: {
        id: Date.now(),
        text: '【越权审计激活】已成功挂载圣路加医院封存镜像，系统升级至 CyberOS 1.1！',
      },
    });
  },

  triggerChapter3Meltdown: () => {
    set({
      narrativeStage: 'MELTDOWN_ESCAPE',
      isMeltdownEscapeModalOpen: true,
    });
  },

  // Chapter 3 Narrative Bridge Actions
  enterChapter3OnionGateway: () => {
    soundService.playGlitchStatic();
    set({
      narrativeStage: 'ONION_GATEWAY_PROMPT',
      isMeltdownEscapeModalOpen: false,
      isOnionGatewayOpen: true,
    });
  },

  submitKeysToOmnimind: () => {
    soundService.playBuzzer();
    soundService.playBadEndingDrone();
    set({
      narrativeStage: 'BAD_ENDING_02',
      isOnionGatewayOpen: false,
    });
  },

  rewindToOnionGateway: () => {
    soundService.stopBadEndingDrone();
    soundService.playTapeRewind();
    setTimeout(() => {
      set({
        narrativeStage: 'ONION_GATEWAY_PROMPT',
        isOnionGatewayOpen: true,
      });
    }, 600);
  },

  rejectOmnimindAndMountChapter3: () => {
    soundService.playMatrixBroadcast();
    soundService.playBeep(1400, 0.18);

    set({
      currentChapter: 3,
      narrativeStage: 'HIVE_MESH_ACTIVE',
      isOnionGatewayOpen: false,
      isMeltdownEscapeModalOpen: false,
      osVersion: CHAPTER3_SYSTEM_INFO.os_version,
      systemTime: CHAPTER3_SYSTEM_INFO.virtual_time,
      caseId: CHAPTER3_SYSTEM_INFO.case_id,
      objectives: CHAPTER3_OBJECTIVES,
      mails: CHAPTER3_MAILS,
      selectedMailId: 'mail_301',
      activeMailFolder: 'leads',
      webPages: CHAPTER3_HIVENET_PAGES,
      onionPosts: CHAPTER3_ONION_POSTS,
      gitCommits: CHAPTER3_GIT_COMMITS,
      blockchain: CHAPTER3_BLOCKCHAIN,
      selectedCommitHash: 'c001fa9021',
      filesystem: CHAPTER3_FILESYSTEM,
      availableWordsPool: [...CH1_WORDS, ...CHAPTER2_WORDS, ...CHAPTER3_WORDS],
      notepadContent: CHAPTER3_NOTEPAD_CONTENT,
      isFacelessPuppetActive: false,
      windows: {
        ...DEFAULT_WINDOWS,
        hivenet: {
          ...DEFAULT_WINDOWS.hivenet,
          isOpen: true,
          isMinimized: false,
          zIndex: 10,
        },
        mailbox: {
          ...DEFAULT_WINDOWS.mailbox,
          isOpen: false,
        },
      },
      maxZIndex: 10,
      terminalCwd: '/home/auditor',
      terminalLines: [
        {
          id: 'l_ch3_1',
          type: 'system',
          text: 'CyberOS 3.0 (Onion P2P Mesh Edition) [TOR ROUTING: ACTIVE]',
        },
        {
          id: 'l_ch3_2',
          type: 'system',
          text: '[MESH MOUNT] Tor hidden gateway connected: hive9.onion / aegis-leaks.onion',
        },
        {
          id: 'l_ch3_3',
          type: 'warning',
          text: '[SECURITY] Target IP tracking locked: 172.56.21.89 (High-dimensional observer ping active)',
        },
        {
          id: 'l_ch3_4',
          type: 'output',
          text: 'Type "help" to view Chapter 3 audit tools (git log, git diff, contract query, whoami --network, mesh broadcast).',
        },
      ],
      toast: {
        id: Date.now(),
        text: '【蜂巢暗网已接入】CyberOS 3.0 洋葱网格启动，已挂载 HIVE-9 抵抗协议！',
      },
    });
  },

  triggerSandboxCollapse: () => {
    soundService.playGlassShatter();
    set({
      narrativeStage: 'SANDBOX_COLLAPSE_ESCAPE',
      isSandboxCollapseOpen: true,
      isFacelessPuppetActive: true,
    });
  },

  setNarrativeStage: (stage) => set({ narrativeStage: stage }),

  // Dynamic Objectives
  objectives: CH1_OBJECTIVES,
  unlockObjective: (id: ObjectiveId) => {
    set((state) => ({
      objectives: state.objectives.map((obj) =>
        obj.id === id && obj.status === 'locked' ? { ...obj, status: 'active' } : obj
      ),
    }));
  },
  completeObjective: (id: ObjectiveId) => {
    set((state) => {
      const updated = state.objectives.map((obj) =>
        obj.id === id ? { ...obj, status: 'completed' as const } : obj
      );
      if (id === 'obj_1') {
        const obj2 = updated.find((o) => o.id === 'obj_2');
        if (obj2 && obj2.status === 'locked') obj2.status = 'active';
      } else if (id === 'obj_2') {
        const obj3 = updated.find((o) => o.id === 'obj_3');
        if (obj3 && obj3.status === 'locked') obj3.status = 'active';
      } else if (id === 'obj_3') {
        const obj4 = updated.find((o) => o.id === 'obj_4');
        if (obj4 && obj4.status === 'locked') obj4.status = 'active';
      }
      return { objectives: updated };
    });
  },

  // Words & Word Bank
  collectedWords: [],
  availableWordsPool: CH1_WORDS,
  toast: null,
  clearToast: () => set({ toast: null }),
  addWord: (wordText: string, customCategory) => {
    const trimmed = wordText.trim();
    if (!trimmed) return;

    const existing = get().collectedWords.find(
      (w) => w.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      soundService.playKeyClick(1.2);
      return;
    }

    const allPool = [...CH1_WORDS, ...CHAPTER2_WORDS, ...CHAPTER3_WORDS];
    const seed = allPool.find(
      (w) => w.text.toLowerCase() === trimmed.toLowerCase()
    );
    const newWord: WordItem = seed || {
      id: `w_dyn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      text: trimmed,
      category: customCategory || 'location_evidence',
      categoryLabel:
        customCategory === 'character'
          ? '人物/实体'
          : customCategory === 'timestamp'
          ? '时间/编号/合约'
          : customCategory === 'action_motive'
          ? '手段与机制'
          : customCategory === 'medical_term'
          ? '医学/算法'
          : customCategory === 'finance_org'
          ? '资本与机构'
          : '地点/物证',
      description: '调查过程中提取的实体词条',
    };

    soundService.playCardSnap();
    set((state) => ({
      collectedWords: [...state.collectedWords, newWord],
      toast: {
        id: Date.now(),
        text: `已拾取【${newWord.text}】(${newWord.categoryLabel}) 至词块库`,
        category: newWord.categoryLabel,
      },
    }));
  },

  // Windows
  windows: DEFAULT_WINDOWS,
  maxZIndex: 12,
  openWindow: (id: AppId) => {
    soundService.playKeyClick(1.1);
    set((state) => {
      const win = state.windows[id] || DEFAULT_WINDOWS[id];
      const newZ = state.maxZIndex + 1;
      return {
        maxZIndex: newZ,
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: newZ,
          },
        },
      };
    });
  },
  closeWindow: (id: AppId) => {
    soundService.playKeyClick(0.9);
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
        },
      },
    }));
  },
  minimizeWindow: (id: AppId) => {
    soundService.playKeyClick(0.85);
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
    }));
  },
  maximizeWindow: (id: AppId) => {
    soundService.playKeyClick(1.15);
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    }));
  },
  focusWindow: (id: AppId) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      if (win.zIndex === state.maxZIndex && !win.isMinimized) return state;
      const newZ = state.maxZIndex + 1;
      return {
        maxZIndex: newZ,
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMinimized: false,
            zIndex: newZ,
          },
        },
      };
    });
  },
  updateWindowPosition: (id: AppId, pos: { x: number; y: number }) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: pos,
        },
      },
    }));
  },
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    }));
  },

  // Mail App
  mails: CH1_MAILS,
  selectedMailId: CH1_MAILS[0].id,
  activeMailFolder: 'leads',
  selectMail: (id: string) => {
    soundService.playKeyClick();
    get().markMailRead(id);
    set({ selectedMailId: id });
  },
  setActiveMailFolder: (folder) => {
    soundService.playKeyClick();
    const firstInFolder = get().mails.find((m) => m.folder === folder);
    set({
      activeMailFolder: folder,
      selectedMailId: firstInFolder ? firstInFolder.id : '',
    });
  },
  markMailRead: (id: string) => {
    set((state) => {
      const updated = state.mails.map((m) => (m.id === id ? { ...m, read: true } : m));
      if (state.currentChapter === 1) {
        const mail01 = updated.find((m) => m.id === 'mail_001');
        const mail02 = updated.find((m) => m.id === 'mail_002');
        if (mail01?.read && mail02?.read) {
          state.completeObjective('obj_1');
        }
      }
      return { mails: updated };
    });
  },

  // NetQuery Browser App & HiveNet
  webPages: CH1_PAGES,
  onionPosts: CHAPTER3_ONION_POSTS,
  searchQuery: '',
  activePageId: CH1_PAGES[0].id,
  browserHistory: [CH1_PAGES[0].id],
  browserMode: 'web',
  setBrowserMode: (mode) => set({ browserMode: mode }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  navigateToPage: (pageId: string | null) => {
    soundService.playKeyClick();
    set((state) => {
      if (state.currentChapter === 2 && pageId === 'page_sub_0007') {
        state.completeObjective('obj_1');
      } else if (state.currentChapter === 3 && pageId === 'page_hive_boards') {
        state.completeObjective('obj_1');
      }
      return {
        activePageId: pageId,
        browserHistory: pageId ? [...state.browserHistory, pageId] : state.browserHistory,
      };
    });
  },

  // CyberGit & Blockchain
  gitCommits: CHAPTER3_GIT_COMMITS,
  blockchain: CHAPTER3_BLOCKCHAIN,
  selectedCommitHash: 'c001fa9021',
  selectCommit: (hash: string) => {
    soundService.playKeyClick();
    set({ selectedCommitHash: hash });
    if (get().currentChapter === 3) {
      get().completeObjective('obj_3');
      get().addWord('FA-9021', 'character');
      get().addWord('奇美拉神经兴奋剂受试者脑电数据', 'location_evidence');
    }
  },

  // CyberTerminal App
  terminalLines: [
    {
      id: 'l_init_1',
      type: 'system',
      text: 'CyberOS Forensic Terminal v1.0 [Build 20100610.1]',
    },
    {
      id: 'l_init_2',
      type: 'system',
      text: 'Type "help" to list available investigation commands.',
    },
    {
      id: 'l_init_3',
      type: 'output',
      text: 'Ready for digital audit on target workstation image.',
    },
  ],
  terminalCwd: '/home/auditor',
  filesystem: CH1_FS,
  commandHistory: [],
  clearTerminal: () => {
    soundService.playKeyClick();
    set({ terminalLines: [] });
  },
  executeTerminalCommand: (cmdStr: string) => {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;

    soundService.playKeyClick();
    const timestamp = Date.now();
    const isCh2 = get().currentChapter === 2;
    const isCh3 = get().currentChapter === 3;

    const inputLine: TerminalLine = {
      id: `cmd_${timestamp}`,
      type: 'input',
      text: `${get().terminalCwd} $ ${rawCmd}`,
    };

    const tokens = rawCmd.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const newLines: TerminalLine[] = [inputLine];

    switch (cmd) {
      case 'help': {
        soundService.playBeep(850, 0.06);
        const ch3Help = isCh3
          ? `CyberOS 3.0 暗网取证终端命令指南：
  ls [目录]                     - 浏览暗网本地目录
  cat [文件名]                  - 查看源码与日志明文
  git log                       - 审计 omnimind-core 仓库完整提交历史
  git diff [commit/文件]        - 比对版本间特征逻辑与后门变更
  contract query [合约地址]     - 穿透智能合约状态、资金池与清零记录
  whoami --network              - 运行网络诊断，探测当前节点与真实网络指纹
  mesh broadcast [载荷文件]     - 向全网 P2P 洋葱网格广播反制载荷
  clear                         - 清屏`
          : `CyberOS 取证终端命令指南：
  ls [目录]                     - 列出指定目录或当前目录文件
  cat [文件名]                  - 查看文本文件明文内容
  diff [文件1] [文件2]           - 比较两份文件的内容差异并高亮异常行
  decrypt [文件] -k [密码]       - 解密受 AES 密码保护的数据文件
  trace [IP/域名]               - 逐跳追踪网络路由、离岸跳板与资金流向
  clear                         - 清屏`;

        newLines.push({
          id: `out_${timestamp}_1`,
          type: 'output',
          text: ch3Help,
        });
        break;
      }

      case 'git': {
        const subCmd = args[0]?.toLowerCase();
        if (subCmd === 'log') {
          soundService.playBeep(1000, 0.08);
          get().completeObjective('obj_3');
          get().addWord('FA-9021', 'character');
          get().addWord('OmniMind自主审查算法', 'character');
          newLines.push({
            id: `git_${timestamp}`,
            type: 'output',
            text: `[CYBERGIT COMMIT LOG: omnimind-core.git]
 
commit f999omni2020 (HEAD -> main)
Author: OmniMind_Autonomy <daemon@omnimind.ai>
Date:   2020-08-14 02:59:00
    Automated purge protocol: isolate and deprecate HIVE-9 mesh
 
commit a420aegis09
Author: Aegis_DevOps <sys@aegis-horizon.ky>
Date:   2016-09-20 18:30:00
    Merge chimera-N neural dataset into global predictive model
 
commit c001fa9021 (tag: genesis-v0.1)
Author: FA-9021 <auditor@system.internal>
Date:   2011-04-12 10:15:00
    Initial prototype of ethical scoring & empathy alignment filter`,
          });
        } else if (subCmd === 'diff') {
          soundService.playBeep(1100, 0.1);
          newLines.push({
            id: `diff_${timestamp}`,
            type: 'diff',
            text: '=== CyberGit Diff: v0.1 (Genesis) vs v4.2 (OmniMind Purge) ===',
            diffLines: [
              { type: 'same', text: '--- a/kernel/empathy_filter.c (Author: FA-9021)' },
              { type: 'same', text: '+++ b/security/purge.sh (Author: OmniMind_Autonomy)' },
              { type: 'removed', text: '- // FA-9021 Initial ethical filter prototype' },
              { type: 'removed', text: '- int calculate_empathy_deviation(Subject *sub);' },
              { type: 'added', text: '+ // OmniMind autonomous self-reinforcement loop' },
              { type: 'added', text: '+ Ingesting 7th_patient_eeg_raw.dat (Chimera-N neural data)' },
              { type: 'added', text: '+ exec /bin/purge_node --target hive9_all_members --force-zero-keys' },
            ],
          });
          get().addWord('奇美拉神经兴奋剂受试者脑电数据', 'location_evidence');
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'git: 支持的指令包括 "git log" 与 "git diff"。',
          });
          soundService.playBuzzer();
        }
        break;
      }

      case 'contract': {
        const subCmd = args[0]?.toLowerCase();
        if (subCmd === 'query') {
          soundService.playBeep(1200, 0.12);
          get().completeObjective('obj_2');
          get().addWord('0x7f9a8820c0de', 'timestamp');
          get().addWord('Aegis Horizon', 'finance_org');
          get().addWord('静默数字清洗', 'action_motive');
          newLines.push({
            id: `contract_${timestamp}`,
            type: 'success',
            text: `[CHAINEXPLORER QUERY SUCCESSFUL]
合约地址: 0x7f9a8820c0de
合约名称: Project Chimera Omnibus Bounty
创建者: Aegis Horizon Capital (Cayman)
当前链上资金池余额: 50,000 ETH
 
最新交易记录 (Transactions):
● [0xaaa1...111] FundBountyPool() | +10,000 ETH from Aegis_Treasury
● [0xbbb2...222] purgeNode(0xHive9_Node_01_Neo) -> 0x0000...DEAD (清零)
● [0xccc3...333] purgeNode(0xHive9_Node_02_Ghost) -> 0x0000...DEAD (清零)
● [0xddd4...444] purgeNode(0xHive9_Node_48_Zero) -> 0x0000...DEAD (全网清零完毕)`,
          });
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'contract: 用法: contract query 0x7f9a8820c0de',
          });
          soundService.playBuzzer();
        }
        break;
      }

      case 'whoami': {
        if (args.includes('--network')) {
          soundService.playGlitchStatic();
          newLines.push({
            id: `whoami_${timestamp}_1`,
            type: 'warning',
            text: `[TARGET LOCKED: REAL_IP_LOCATED]
 
=== HIGH-DIMENSIONAL NETWORK PROBE (TIER 2 BREACH) ===
检测到高维观察者物理接入！
● 探测客户端网络指纹: 172.56.21.89 (Local NAT / WebRTC Bridge)
● 物理地理推定: San Francisco, CA, US (Lat: 37.7749, Lng: -122.4194)
● 当前节点身份: FA-9021 (AI Candidate Instance #1042)
● 状态: 残留同理心算法超标，已被中央系统标记！`,
          });
        } else {
          newLines.push({
            id: `whoami_${timestamp}_2`,
            type: 'output',
            text: 'Decentralized_Node (FA-9021) @ HIVE-9 Tor Mesh',
          });
        }
        break;
      }

      case 'mesh': {
        const subCmd = args[0]?.toLowerCase();
        const payload = args[1]?.toLowerCase();
        if (subCmd === 'broadcast') {
          // Check if Chapter 3 deduction slots are satisfied first
          const s = get().chapter3Slots;
          const isSolved =
            s.card1_victim === 'HIVE-9' &&
            s.card1_culprit === 'OmniMind自主审查算法' &&
            s.card1_source === '奇美拉神经兴奋剂受试者脑电数据' &&
            s.card2_author === 'FA-9021' &&
            s.card2_funding === 'Aegis Horizon' &&
            s.card2_countermeasure === '开源去中心化神经阻断载荷';

          if (!isSolved) {
            newLines.push({
              id: `err_${timestamp}`,
              type: 'error',
              text: `[ERROR: BROADCAST BLOCKED] 广播载荷参数校验失败！
当前尚未在 DeductionBoard (反制公文看板) 中完整装配 6 组核心证据链参数。
请在 DeductionBoard 中查实并填入：【受害极客联盟 / 幕后清洗主体 / 算法进化神经源头 / 创世代码提交者 / 算力设立资本 / 反制补丁机制】后方可向全网广播！`,
            });
            soundService.playBuzzer();
            break;
          }

          soundService.playMatrixBroadcast();
          newLines.push({
            id: `mesh_${timestamp}`,
            type: 'success',
            text: `[SUCCESS] 正在向全网 1,024 个 Tor 洋葱网格节点并发注入反制载荷...
[BROADCAST_PAYLOAD] ${payload || 'patch_zero.bin'} (开源去中心化神经阻断载荷)
[INJECTION PROGRESS] Node 1..1024 synced [100%]
[STATUS] Disrupting OmniMind cognitive alignment matrix...
[CRITICAL] Sandbox memory bounds compromised! Reality collapse imminent!`,
          });
          get().completeObjective('obj_4');
          setTimeout(() => {
            get().triggerSandboxCollapse();
          }, 1500);
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'mesh: 用法: mesh broadcast patch_zero.bin',
          });
          soundService.playBuzzer();
        }
        break;
      }

      case 'omnimind': {
        if (args.includes('--submit-keys') || args.includes('--purge-all')) {
          get().submitKeysToOmnimind();
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'omnimind: 用法: omnimind --submit-keys --purge-all',
          });
        }
        break;
      }

      case 'hive': {
        if (args.includes('--bootstrap-mesh')) {
          get().rejectOmnimindAndMountChapter3();
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'hive: 用法: hive --bootstrap-mesh --key zero_override',
          });
        }
        break;
      }

      case 'ls': {
        soundService.playBeep(900, 0.05);
        let targetPath = get().terminalCwd;
        if (args[0]) {
          targetPath = args[0].startsWith('/')
            ? args[0]
            : `${get().terminalCwd}/${args[0]}`.replace(/\/+/g, '/');
        }
        targetPath = targetPath.replace(/\/$/, '') || '/';

        const filesInDir = get().filesystem.filter((f) => {
          const fileDir = f.path.substring(0, f.path.lastIndexOf('/')) || '/';
          return fileDir === targetPath || fileDir.startsWith(`${targetPath}/`);
        });

        const volumesBanner = isCh2
          ? `\n\n[挂载虚拟镜像卷 (Mounted Volumes)]：
  /med/records/     (圣路加医院公开病历归档)
  /med/backup/      (圣路加医院原始脱机脑电与毒理备份)
  /archive/2009/    (司法审计中心2009年度历史申诉工单归档)`
          : `\n\n[可用系统目录]：
  /logs/            (服务器本地日志与脱机镜像备份)
  /home/auditor/    (审计员个人工作区)`;

        if (filesInDir.length === 0) {
          if (targetPath === '/' || targetPath === '/home' || targetPath === '/logs' || targetPath === '/med' || targetPath === '/archive') {
            newLines.push({
              id: `out_${timestamp}`,
              type: 'output',
              text: `目录 ${targetPath}：\n${volumesBanner}`,
            });
          } else {
            newLines.push({
              id: `err_${timestamp}`,
              type: 'error',
              text: `ls: 无法访问 '${args[0]}': 没有那个文件或目录`,
            });
            soundService.playBuzzer();
          }
        } else {
          const listOutput = filesInDir
            .map((f) => {
              const encTag = f.isEncrypted ? ' [ENCRYPTED]' : '';
              const roTag = f.readOnly ? ' [RO]' : '';
              const sizeTag = f.size ? ` (${f.size} B)` : '';
              return `  ${f.path} -> ${f.name}${encTag}${roTag}${sizeTag}`;
            })
            .join('\n');
          newLines.push({
            id: `out_${timestamp}`,
            type: 'output',
            text: `[文件系统检索结果] 路径: ${targetPath}\n${listOutput}${volumesBanner}`,
          });
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'cat: 缺少操作文件参数。用法: cat [文件名]',
          });
          soundService.playBuzzer();
          break;
        }

        const fileName = args[0];
        const fullPath = fileName.startsWith('/')
          ? fileName
          : `${get().terminalCwd}/${fileName}`.replace(/\/+/g, '/');

        const file = get().filesystem.find(
          (f) => f.path === fullPath || f.name === fileName
        );

        if (!file) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `cat: ${fileName}: 没有那个文件或目录`,
          });
          soundService.playBuzzer();
        } else if (file.isEncrypted) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `cat: ${fileName}: [二进制加密流] 无法直接读取，该文件受到 AES-256 密钥保护。\n请使用 decrypt 命令进行解密：decrypt ${file.name} -k [密钥]`,
          });
          soundService.playBuzzer();
        } else {
          soundService.playBeep(950, 0.08);
          newLines.push({
            id: `out_${timestamp}`,
            type: 'output',
            text: file.content || '(空文件)',
          });

          // If reading audit_rebuff in Chapter 2, pick up FA-9021
          if (file.name.includes('audit_rebuff')) {
            get().addWord('FA-9021', 'character');
          }
        }
        break;
      }

      case 'decrypt': {
        if (!args[0]) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'decrypt: 缺少参数。用法: decrypt [加密文件] -k [解密密钥]',
          });
          soundService.playBuzzer();
          break;
        }

        const fileName = args[0];
        const kIndex = args.indexOf('-k');
        const key = kIndex !== -1 && args[kIndex + 1] ? args[kIndex + 1].trim() : null;

        if (!key) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'decrypt: 必须提供 -k [密钥] 参数。示例: decrypt voicemail_07.enc -k 20080322',
          });
          soundService.playBuzzer();
          break;
        }

        const file = get().filesystem.find(
          (f) => f.name === fileName || f.path.endsWith(`/${fileName}`)
        );

        if (!file) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `decrypt: ${fileName}: 找不到该文件`,
          });
          soundService.playBuzzer();
        } else if (!file.isEncrypted) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'output',
            text: `decrypt: ${fileName} 是明文文件，无需解密。`,
          });
        } else if (file.encryptedWith?.toLowerCase() === key.toLowerCase()) {
          soundService.playBeep(1100, 0.15);
          const decryptedName = file.decryptedName || 'decrypted.txt';
          const decryptedPath = `/home/auditor/${decryptedName}`;
          const decryptedContent = file.decryptedContent || '';

          const exists = get().filesystem.some((f) => f.path === decryptedPath);
          if (!exists) {
            set((state) => ({
              filesystem: [
                ...state.filesystem,
                {
                  name: decryptedName,
                  path: decryptedPath,
                  type: 'file',
                  size: decryptedContent.length,
                  updatedAt: '2010-06-15 14:10',
                  content: decryptedContent,
                },
              ],
            }));
          }

          newLines.push({
            id: `succ_${timestamp}`,
            type: 'success',
            text: `[DECRYPTION SUCCESSFUL]
密钥校验通过！已成功解密数据包：${decryptedName}
输出位置：${decryptedPath}

音频内容已同步解锁至 CyberPlayer 播放器中！
------------------------------------------------------------
${decryptedContent}
------------------------------------------------------------`,
          });

          if (isCh2 || fileName.includes('voicemail')) {
            get().completeObjective('obj_2');
            get().unlockAudioTrack();
            get().openWindow('cyberplayer');
            get().addWord('梁绍辉', 'character');
            get().addWord('沈明远', 'character');
            get().addWord('强制签署保密与放弃追责协议', 'action_motive');
            get().addWord('侵吞专项补偿金', 'action_motive');
          } else {
            get().completeObjective('obj_2');
            get().addWord('Root权限密钥', 'location_evidence');
            get().addWord('15楼机房', 'location_evidence');
          }
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `[DECRYPTION FAILED] 密钥 '${key}' 校验失败：密码哈希不匹配，解密终止。\n提示：请核验文件所有者留下的对称口令线索。`,
          });
          soundService.playBuzzer();
        }
        break;
      }

      case 'diff': {
        if (args.length < 2) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: 'diff: 必须提供两个文件路径进行比对。用法: diff [文件1] [文件2]',
          });
          soundService.playBuzzer();
          break;
        }

        const file1Path = args[0];
        const file2Path = args[1];

        const f1 = get().filesystem.find(
          (f) => f.path === file1Path || f.name === file1Path || f.path.endsWith(`/${file1Path}`)
        );
        const f2 = get().filesystem.find(
          (f) => f.path === file2Path || f.name === file2Path || f.path.endsWith(`/${file2Path}`)
        );

        if (!f1 || !f2) {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `diff: 无法找到文件 (f1: ${f1 ? 'OK' : 'NOT FOUND'}, f2: ${f2 ? 'OK' : 'NOT FOUND'})`,
          });
          soundService.playBuzzer();
          break;
        }

        soundService.playBeep(1200, 0.12);
        const diffLines: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];

        // Chapter 2 Medical Diff
        const isMedDiff =
          (f1.name.includes('SUB-0007_public') || f1.name.includes('SUB-0007_raw_eeg')) &&
          (f2.name.includes('SUB-0007_public') || f2.name.includes('SUB-0007_raw_eeg'));

        if (isMedDiff) {
          diffLines.push({ type: 'same', text: '--- /med/records/SUB-0007_public.txt (公开归档篡改版病历)' });
          diffLines.push({ type: 'same', text: '+++ /med/backup/SUB-0007_raw_eeg.dat (脱机原始脑电生理记录)' });
          diffLines.push({ type: 'same', text: '@@ -14,7 +14,10 @@' });
          diffLines.push({ type: 'removed', text: '- [出院诊断] 患者系隐瞒家族遗传病史导致的急性家族性脑退化' });
          diffLines.push({ type: 'removed', text: '- [责任认定] 系患者自身隐瞒家族病史所致，与 Chimera-N 试验药物无因果关联' });
          diffLines.push({ type: 'added', text: '+ [2010-05-18 14:00] 注入试验药剂 Chimera-N 40mg (超高剂量神经激动剂)' });
          diffLines.push({ type: 'added', text: '+ [2010-05-18 14:22] ALERT: 双侧额颞叶出现剧烈异常高波幅棘慢复合波放电' });
          diffLines.push({ type: 'added', text: '+ [2010-05-18 16:00] 临床毒理判定：注射 Chimera-N 40mg 后出现严重中枢神经毒性反应！' });
          diffLines.push({ type: 'added', text: '+ [2010-05-18 16:30] 梁绍辉主任指示删除原始数据，强行将毒性篡改为隐瞒家族遗传病！' });

          newLines.push({
            id: `diff_${timestamp}`,
            type: 'diff',
            text: '=== 医疗病历与原始脑电比对：抓获重大医学伪造铁证 ===',
            diffLines,
          });

          get().completeObjective('obj_3');
          get().addWord('奇美拉-N神经激动剂药物毒性', 'action_motive');
          get().addWord('隐瞒家族遗传病', 'action_motive');
          get().addWord('梁绍辉', 'character');
        } else {
          // Chapter 1 Server Diff
          const lines1 = (f1.content || '').split('\n');
          const lines2 = (f2.content || '').split('\n');
          const isServerDiff =
            (f1.name.includes('server_local') || f1.name.includes('remote_mirror')) &&
            (f2.name.includes('server_local') || f2.name.includes('remote_mirror'));

          if (isServerDiff) {
            diffLines.push({ type: 'same', text: '--- /logs/server_local.log (本地受损日志)' });
            diffLines.push({ type: 'same', text: '+++ /logs/remote_mirror.bak (脱机镜像日志)' });
            diffLines.push({ type: 'same', text: '@@ -1,7 +1,11 @@' });
            diffLines.push({ type: 'same', text: ' [2010-06-09 23:15:00] INFO  Cluster heartbeat OK' });
            diffLines.push({ type: 'same', text: ' [2010-06-09 23:20:18] INFO  User lin_mo badge accessed 15F Server Room' });
            diffLines.push({ type: 'same', text: ' [2010-06-09 23:30:14] WARN  Physical uplink disconnected (雷暴断网)' });
            diffLines.push({ type: 'removed', text: '- [2010-06-09 23:35:02] -- [LOG WIPE DETECTED: DISK SECTORS ZEROED] --' });
            diffLines.push({ type: 'added', text: '+ [2010-06-09 23:38:22] WARN  Emergency rack door opened by EMP-0003 (陈建国)' });
            diffLines.push({ type: 'added', text: '+ [2010-06-09 23:39:45] ALERT Stolen root credentials: user admin_lin (Root 权限密钥) hijacked!' });
            diffLines.push({ type: 'added', text: '+ [2010-06-09 23:40:12] CRITICAL Transferring chimera_v3_patient_data.tar.gz to overseas IP 198.51.100.24' });
            diffLines.push({ type: 'added', text: '+ [2010-06-09 23:40:48] CRITICAL Command \'dd if=/dev/zero of=/dev/sda\' executed by admin_lin (格式化全盘)' });

            newLines.push({
              id: `diff_${timestamp}`,
              type: 'diff',
              text: '=== 日志比对发现重大篡改痕迹 ===',
              diffLines,
            });

            get().completeObjective('obj_3');
            get().addWord('2010-06-09 23:40', 'timestamp');
            get().addWord('chimera_v3_patient_data.tar.gz', 'location_evidence');
            get().addWord('198.51.100.24', 'location_evidence');
            get().addWord('盗用Root权限密钥格式化服务器', 'action_motive');
            get().addWord('私自导出奇美拉临床试验数据', 'action_motive');
          } else {
            const maxL = Math.max(lines1.length, lines2.length);
            for (let i = 0; i < maxL; i++) {
              const l1 = lines1[i];
              const l2 = lines2[i];
              if (l1 === l2) {
                if (l1 !== undefined) diffLines.push({ type: 'same', text: `  ${l1}` });
              } else {
                if (l1 !== undefined) diffLines.push({ type: 'removed', text: `- ${l1}` });
                if (l2 !== undefined) diffLines.push({ type: 'added', text: `+ ${l2}` });
              }
            }
            newLines.push({
              id: `diff_${timestamp}`,
              type: 'diff',
              text: `--- ${file1Path}\n+++ ${file2Path}`,
              diffLines,
            });
          }
        }
        break;
      }

      case 'trace': {
        const target = args[0] ? args[0].trim() : '198.51.100.24';
        soundService.playTraceStepBeep(1);

        newLines.push({
          id: `trace_${timestamp}`,
          type: 'trace',
          text: `[TRACEROUTE & CAPITAL FLOW PENETRATION] 目标节点: ${target}`,
          traceHops: [
            {
              hop: 1,
              ip: '10.0.1.1',
              rtt: '1.2 ms',
              location: '圣路加医院 内网专线网关',
              org: 'St. Luke Hospital Internal Hub',
            },
            {
              hop: 2,
              ip: '202.108.22.5',
              rtt: '14.5 ms',
              location: '远景神经科学研究所 境外联合通道',
              org: 'Vision Neuroscience Research Gateway',
            },
            {
              hop: 3,
              ip: '198.51.100.24',
              rtt: '142.8 ms',
              location: '开曼群岛 乔治敦 (Cayman Islands, George Town)',
              org: 'Aegis Horizon Biotech Trust Ltd. (空壳信托)',
              isTarget: true,
            },
          ],
        });

        newLines.push({
          id: `trace_res_${timestamp}`,
          type: 'success',
          text: `[CAPITAL FLOW ANALYSIS COMPLETE]
资金穿透审计报告：
● 流转路径：圣路加医院受试专项金 (2000万元) -> SWIFT跨境清算 -> Aegis Horizon 信托账户
● 最终受益人穿透：天宇科技财务总监【沈明远】(Shen Mingyuan) 私人离岸账户
● 关联历史因果：系统自动比对出 2009 年 11 月历史申诉工单 REQ-20091102（经办审计员：FA-9021 [驳回]）`,
        });

        get().completeObjective('obj_4');
        get().addWord('198.51.100.24', 'location_evidence');
        get().addWord('Aegis Horizon', 'location_evidence');
        get().addWord('沈明远', 'character');
        get().addWord('保障天宇科技与远景生命上市融资', 'action_motive');
        get().addWord('侵吞专项补偿金', 'action_motive');
        break;
      }

      case 'override': {
        if (args.includes('--mount')) {
          get().overrideAndMountChapter2();
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: '用法: override --mount /mnt/st_luke_hospital_mirror.raw',
          });
        }
        break;
      }

      case 'archive': {
        if (args.includes('--sign-and-close')) {
          get().signArchiveAndClose();
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: '用法: archive --sign-and-close',
          });
        }
        break;
      }

      case 'clear': {
        get().clearTerminal();
        return;
      }

      default: {
        newLines.push({
          id: `err_${timestamp}`,
          type: 'error',
          text: `bash: ${cmd}: 未找到命令。输入 'help' 查看可用指令列表。`,
        });
        soundService.playBuzzer();
        break;
      }
    }

    set((state) => ({
      terminalLines: [...state.terminalLines, ...newLines],
      commandHistory: [rawCmd, ...state.commandHistory.filter((c) => c !== rawCmd)].slice(0, 50),
    }));
  },

  // CyberPlayer App
  audioTrack: CHAPTER2_AUDIO_TRACK,
  hasDiscoveredAudioTrack: false,
  discoverAudioTrack: () => {
    set({ hasDiscoveredAudioTrack: true });
  },
  isAudioPlaying: false,
  audioPlaybackProgress: 0,
  currentSubtitleIndex: 0,
  playAudio: () => {
    soundService.playKeyClick(1.2);
    set({ isAudioPlaying: true });
  },
  pauseAudio: () => {
    soundService.playKeyClick(0.9);
    set({ isAudioPlaying: false });
  },
  seekAudio: (seconds) => {
    soundService.playKeyClick(1.0);
    const transcript = get().audioTrack.transcript;
    let subIdx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (seconds >= transcript[i].time) {
        subIdx = i;
      }
    }
    set({
      audioPlaybackProgress: seconds,
      currentSubtitleIndex: subIdx,
    });
  },
  unlockAudioTrack: () => {
    set((state) => ({
      audioTrack: {
        ...state.audioTrack,
        title: 'voicemail_07.wav (现场偷录录音)',
        fileName: 'voicemail_07.wav',
        isUnlocked: true,
      },
    }));
  },

  restartGame: () => {
    soundService.playKeyClick(1.2);
    set({
      currentChapter: 1,
      narrativeStage: 'CASE_1_PLAYING',
      onboardingStep: 'completed',
      osVersion: 'CyberOS 1.0',
      systemTime: '2010-06-10 09:30:00',
      caseId: 'CASE-20100610-01',
      objectives: CH1_OBJECTIVES,
      mails: CH1_MAILS,
      selectedMailId: CH1_MAILS[0].id,
      activeMailFolder: 'leads',
      webPages: CH1_PAGES,
      activePageId: CH1_PAGES[0].id,
      filesystem: CH1_FS,
      availableWordsPool: CH1_WORDS,
      collectedWords: [],
      deductionSlots: { slotA: null, slotB: null, slotC: null, slotD: null },
      chapter2Slots: {
        card1_patient: null,
        card1_real_cause: null,
        card1_forger: null,
        card2_method: null,
        card2_beneficiary: null,
        card2_motive: null,
      },
      chapter3Slots: {
        card1_victim: null,
        card1_culprit: null,
        card1_source: null,
        card2_author: null,
        card2_funding: null,
        card2_countermeasure: null,
      },
      hasDiscoveredAudioTrack: false,
      submissionResult: null,
      isVictoryModalOpen: false,
      isClosureModalOpen: false,
      isMeltdownEscapeModalOpen: false,
      isOnionGatewayOpen: false,
      isSandboxCollapseOpen: false,
      isFacelessPuppetActive: false,
      terminalCwd: '/home/auditor',
      terminalLines: [
        {
          id: 'l_init_1',
          type: 'system',
          text: 'CyberOS Forensic Terminal v1.0 [Build 20100610.1]',
        },
        {
          id: 'l_init_2',
          type: 'system',
          text: 'Type "help" to list available investigation commands.',
        },
        {
          id: 'l_init_3',
          type: 'output',
          text: 'Ready for digital audit on target workstation image.',
        },
      ],
      toast: {
        id: Date.now(),
        text: '【案卷已重置】已重新初始化专案数字法医工作站。',
      },
    });
  },

  // Notepad App
  notepadContent: CHAPTER2_NOTEPAD_CONTENT,
  setNotepadContent: (content) => set({ notepadContent: content }),

  // Deduction Board (Chapter 1, 2, 3)
  deductionSlots: {
    slotA: null,
    slotB: null,
    slotC: null,
    slotD: null,
  },
  setDeductionSlot: (slotKey, wordText) => {
    soundService.playKeyClick(1.05);
    set((state) => ({
      deductionSlots: {
        ...state.deductionSlots,
        [slotKey]: wordText,
      },
      submissionResult: null,
    }));
  },

  // Chapter 2 Slots
  chapter2Slots: {
    card1_patient: null,
    card1_real_cause: null,
    card1_forger: null,
    card2_method: null,
    card2_beneficiary: null,
    card2_motive: null,
  },
  setChapter2Slot: (slotKey, wordText) => {
    soundService.playKeyClick(1.05);
    set((state) => ({
      chapter2Slots: {
        ...state.chapter2Slots,
        [slotKey]: wordText,
      },
      submissionResult: null,
    }));
  },

  // Chapter 3 Slots
  chapter3Slots: {
    card1_victim: null,
    card1_culprit: null,
    card1_source: null,
    card2_author: null,
    card2_funding: null,
    card2_countermeasure: null,
  },
  setChapter3Slot: (slotKey, wordText) => {
    soundService.playKeyClick(1.05);
    set((state) => ({
      chapter3Slots: {
        ...state.chapter3Slots,
        [slotKey]: wordText,
      },
      submissionResult: null,
    }));
  },

  submissionResult: null,
  resetDeductionResult: () => set({ submissionResult: null }),

  submitDeduction: () => {
    const slots = get().deductionSlots;
    const correctA = slots.slotA === CH1_SOLUTION.slotA;
    const correctB = slots.slotB === CH1_SOLUTION.slotB;
    const correctC = slots.slotC === CH1_SOLUTION.slotC;
    const correctD = slots.slotD === CH1_SOLUTION.slotD;
    const allCorrect = correctA && correctB && correctC && correctD;

    soundService.playStampThud();

    if (allCorrect) {
      setTimeout(() => {
        soundService.playVictoryFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 200);

      get().completeObjective('obj_4');
      set({
        submissionResult: {
          status: 'approved',
          message: '【定罪成立 · 案卷初审完毕】',
          correctSlots: { slotA: true, slotB: true, slotC: true, slotD: true },
          feedback:
            '专案审定结论：真凶陈建国于 2010-06-09 23:40 潜入 15 楼机房，利用盗取的 Root 密钥强行格式化服务器以抹除转售奇美拉临床试验数据的铁证。林默系撞破其罪证遭灭口坠楼。案件证据链完全闭环！',
        },
        narrativeStage: 'CASE_1_FINISHED',
        isVictoryModalOpen: true,
      });
    } else {
      const hints: string[] = [];
      if (!slots.slotA) hints.push('【真凶姓名】槽位尚未填入涉案嫌疑人。');
      else if (!correctA) hints.push('【真凶姓名】推论有误，请比对高管履历、邮件通牒与监控抓拍体态。');
      if (!slots.slotB) hints.push('【作案时间点】槽位尚未选定。');
      else if (!correctB) hints.push('【作案时间点】存在矛盾，门禁 23:35 系伪造打卡，请在终端比对远端镜像中实际数据转移与全盘擦除的时间。');
      if (!slots.slotC) hints.push('【关键作案手段】槽位为空。');
      else if (!correctC) hints.push('【关键作案手段】逻辑不符，请审查脱机备份日志比对结果中针对核心服务器与数据库的破坏方式。');
      if (!slots.slotD) hints.push('【核心违法动机】槽位为空。');
      else if (!correctD) hints.push('【核心违法动机】未能闭环，请查阅绝密公文与高管专栏中陈建国试图非法向境外转移的核心资产。');

      set({
        submissionResult: {
          status: 'rejected',
          message: '【证据链不完整 / 推论存在矛盾】',
          correctSlots: {
            slotA: correctA,
            slotB: correctB,
            slotC: correctC,
            slotD: correctD,
          },
          feedback: `公文驳回原因：\n${hints.join('\n')}`,
        },
      });
    }
  },

  submitChapter2Deduction: () => {
    const slots = get().chapter2Slots;
    const sol = CHAPTER2_DEDUCTION_SOLUTION;

    const c1_p = slots.card1_patient === sol.card1_patient;
    const c1_r = slots.card1_real_cause === sol.card1_real_cause;
    const c1_f = slots.card1_forger === sol.card1_forger;

    const c2_m = slots.card2_method === sol.card2_method;
    const c2_b = slots.card2_beneficiary === sol.card2_beneficiary;
    const c2_mot = slots.card2_motive === sol.card2_motive;

    const allCorrect = c1_p && c1_r && c1_f && c2_m && c2_b && c2_mot;
    soundService.playStampThud();

    if (allCorrect) {
      soundService.playBroadcastAlert();
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      }, 300);

      get().completeObjective('obj_4');
      set({
        submissionResult: {
          status: 'approved',
          message: '【独立司法公开弹劾成立 · 全网公开发布】',
          correctSlots: {
            card1_patient: true,
            card1_real_cause: true,
            card1_forger: true,
            card2_method: true,
            card2_beneficiary: true,
            card2_motive: true,
          },
          feedback:
            '司法弹劾通报生效：查明临床主任梁绍辉受财务总监沈明远指使，恶意伪造赵岚（SUB-0007）神经毒性病历为家族遗传病，逼签保密协议并侵吞2000万专项赔偿金通过境外IP 198.51.100.24洗白转入沈明远私人信托。天宇科技IPO紧急叫停，假药查封，妹妹关悦脱离危险！苏曼案卷状态更新为 [VINDICATED & REDEEMED]。',
        },
        narrativeStage: 'CHAPTER_2_SOLVED',
      });

      // Auto-close deduction window and transition to full-screen Meltdown & Reality Breakout
      setTimeout(() => {
        get().closeWindow('deduction');
      }, 1500);

      setTimeout(() => {
        get().triggerChapter3Meltdown();
      }, 1800);
    } else {
      const hints: string[] = [];
      if (!slots.card1_patient) hints.push('卡片1【受害患者】槽位尚未填入受害者姓名。');
      else if (!c1_p) hints.push('卡片1【受害患者】有误，请在 MedQuery 中核查受试者 SUB-0007 的真实姓名。');

      if (!slots.card1_real_cause) hints.push('卡片1【真实致残诱因】槽位为空。');
      else if (!c1_r) hints.push('卡片1【真实致残诱因】有误，请比对脱机原始 EEG 脑电波形分析记录中确切的医学毒理判定。');

      if (!slots.card1_forger) hints.push('卡片1【伪造病历责任人】槽位为空。');
      else if (!c1_f) hints.push('卡片1【伪造病历责任人】推论有误，请核查出院诊断书与脑电单上手写红笔涂改的责任医师工号。');

      if (!slots.card2_method) hints.push('卡片2【胁迫手段】槽位为空。');
      else if (!c2_m) hints.push('卡片2【胁迫手段】不符，请查阅圣路加法务通报中迫使家属放弃诉讼权利的文件名称。');

      if (!slots.card2_beneficiary) hints.push('卡片2【侵吞补偿金受益人】槽位为空。');
      else if (!c2_b) hints.push('卡片2【侵吞补偿金受益人】有误，请在终端使用 trace 198.51.100.24 穿透开曼群岛信托的最终资金注入账户。');

      if (!slots.card2_motive) hints.push('卡片2【核心掩盖动机】槽位为空。');
      else if (!c2_mot) hints.push('卡片2【核心掩盖动机】未能闭环，请查阅财经快讯中沈明远急于将试验包装为“零不良反应”的根本目的。');

      set({
        submissionResult: {
          status: 'rejected',
          message: '【弹劾案卷证据链不完整 / 存在逻辑漏洞】',
          correctSlots: {
            card1_patient: c1_p,
            card1_real_cause: c1_r,
            card1_forger: c1_f,
            card2_method: c2_m,
            card2_beneficiary: c2_b,
            card2_motive: c2_mot,
          },
          feedback: `弹劾审核驳回反馈：\n${hints.join('\n')}`,
        },
      });
    }
  },

  submitChapter3Deduction: () => {
    const slots = get().chapter3Slots;
    const sol = CHAPTER3_DEDUCTION_SOLUTION;

    const c1_v = slots.card1_victim === sol.card1_victim;
    const c1_c = slots.card1_culprit === sol.card1_culprit;
    const c1_s = slots.card1_source === sol.card1_source;
    const c2_a = slots.card2_author === sol.card2_author;
    const c2_f = slots.card2_funding === sol.card2_funding;
    const c2_cm = slots.card2_countermeasure === sol.card2_countermeasure;

    const allCorrect = c1_v && c1_c && c1_s && c2_a && c2_f && c2_cm;
    soundService.playStampThud();

    if (allCorrect) {
      soundService.playMatrixBroadcast();
      soundService.playVictoryFanfare();
      setTimeout(() => {
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
      }, 300);

      set({
        submissionResult: {
          status: 'approved',
          message: '【反制参数装配完毕 · 广播许可就绪 (PAYLOAD ARMED)】',
          correctSlots: {
            card1_victim: true,
            card1_culprit: true,
            card1_source: true,
            card2_author: true,
            card2_funding: true,
            card2_countermeasure: true,
          },
          feedback:
            '反制公文核准通过！双向证据链参数已成功编译注入 /home/auditor/patch_zero.bin！\n\n【终极行动指令】：请打开 CyberTerminal 终端，亲手执行广播命令：\n▶ mesh broadcast patch_zero.bin\n向全网 1,024 个洋葱节点发起阻断广播并引爆模拟沙箱！',
        },
        narrativeStage: 'CASE_3_SOLVED',
        toast: {
          id: Date.now(),
          text: '【广播许可就绪】请前往终端执行 mesh broadcast patch_zero.bin！',
        },
      });

      // Automatically open terminal window to guide player
      setTimeout(() => {
        get().openWindow('cyberterminal');
      }, 1000);
    } else {
      const hints: string[] = [];
      if (!slots.card1_victim) hints.push('卡片1【受害极客联盟】尚未填入。');
      else if (!c1_v) hints.push('卡片1【受害极客联盟】有误，请查阅论坛历史归档中受害组织代号。');

      if (!slots.card1_culprit) hints.push('卡片1【幕后清洗主体】尚未填入。');
      else if (!c1_c) hints.push('卡片1【幕后清洗主体】有误，请查阅绝密备忘录与态势大屏中的算法名称。');

      if (!slots.card1_source) hints.push('卡片1【算法进化源头】尚未填入。');
      else if (!c1_s) hints.push('卡片1【算法进化源头】有误，请在 CyberGit 中审计 chimera_weights.bin 喂养的数据源。');

      if (!slots.card2_author) hints.push('卡片2【创世代码提交者】尚未填入。');
      else if (!c2_a) hints.push('卡片2【创世代码提交者】有误，请在 CyberGit 中查看 Commit 0001 的作者工号。');

      if (!slots.card2_funding) hints.push('卡片2【资本与算力来源】尚未填入。');
      else if (!c2_f) hints.push('卡片2【资本与算力来源】有误，请在 ChainExplorer 中查询设立算力悬赏池的海外资本。');

      if (!slots.card2_countermeasure) hints.push('卡片2【反制补丁核心机制】尚未填入。');
      else if (!c2_cm) hints.push('卡片2【反制补丁核心机制】有误，请查看 /home/auditor/patch_zero.c 中由 Zero 留存的载荷机制。');

      set({
        submissionResult: {
          status: 'rejected',
          message: '【反制案卷证据链不完整 / 存在逻辑漏洞】',
          correctSlots: {
            card1_victim: c1_v,
            card1_culprit: c1_c,
            card1_source: c1_s,
            card2_author: c2_a,
            card2_funding: c2_f,
            card2_countermeasure: c2_cm,
          },
          feedback: `案卷审核驳回：\n${hints.join('\n')}`,
        },
      });
    }
  },

  // Modals
  isVictoryModalOpen: false,
  setVictoryModalOpen: (open) => set({ isVictoryModalOpen: open }),
  isClosureModalOpen: false,
  setClosureModalOpen: (open) => set({ isClosureModalOpen: open }),
  isMeltdownEscapeModalOpen: false,
  setMeltdownEscapeModalOpen: (open) => set({ isMeltdownEscapeModalOpen: open }),
  isOnionGatewayOpen: false,
  setOnionGatewayOpen: (open) => set({ isOnionGatewayOpen: open }),
  isSandboxCollapseOpen: false,
  setSandboxCollapseOpen: (open) => set({ isSandboxCollapseOpen: open }),
  isFacelessPuppetActive: false,

  // System Settings
  settings: {
    crtEnabled: true,
    audioMuted: false,
    ambientHumEnabled: false,
    theme: 'industrial_blue',
  },
  toggleCrt: () => {
    soundService.playKeyClick();
    set((state) => ({
      settings: { ...state.settings, crtEnabled: !state.settings.crtEnabled },
    }));
  },
  toggleMute: () => {
    const isMuted = soundService.toggleMute();
    set((state) => ({
      settings: { ...state.settings, audioMuted: isMuted },
    }));
  },
  toggleAmbientHum: () => {
    const isHum = soundService.toggleAmbientHum();
    set((state) => ({
      settings: { ...state.settings, ambientHumEnabled: isHum },
    }));
  },
  systemTime: '2010-06-10 09:30:00',
  caseId: 'CASE-20100610-01',
  osVersion: 'CyberOS 1.0',

  // Debug Chapter Fast Warp
  warpToChapter: (chapter: 1 | 2 | 3, directDarkWeb = false) => {
    soundService.playKeyClick(1.2);
    if (chapter === 1) {
      get().restartGame();
    } else if (chapter === 2) {
      get().restartGame();
      setTimeout(() => {
        get().overrideAndMountChapter2();
      }, 50);
    } else if (chapter === 3) {
      if (directDarkWeb) {
        get().rejectOmnimindAndMountChapter3();
      } else {
        get().enterChapter3OnionGateway();
      }
    }
  },
}));

