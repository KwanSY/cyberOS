import { create } from 'zustand';
import {
  AppId,
  DeductionSlots,
  DeductionSubmissionResult,
  FsFile,
  MailItem,
  Objective,
  ObjectiveId,
  SystemSettings,
  WebPage,
  WindowState,
  WordItem,
} from '../types/game';
import {
  ALL_INVESTIGATION_WORDS,
  DEDUCTION_SOLUTION,
  INITIAL_FILESYSTEM,
  INITIAL_MAILS,
  INITIAL_OBJECTIVES,
  INITIAL_WEB_PAGES,
} from '../data/chapter1Seed';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'diff' | 'system';
  text: string;
  diffLines?: Array<{ type: 'same' | 'added' | 'removed'; text: string }>;
}

interface ToastInfo {
  id: number;
  text: string;
  category?: string;
}

interface GameStoreState {
  // Onboarding
  onboardingStep: 'bios' | 'identity' | 'warrant' | 'completed';
  setOnboardingStep: (step: 'bios' | 'identity' | 'warrant' | 'completed') => void;

  // Dynamic Objectives
  objectives: Objective[];
  unlockObjective: (id: ObjectiveId) => void;
  completeObjective: (id: ObjectiveId) => void;

  // Words / Word Bank (Only collected words are available for deduction)
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

  // NetQuery Browser App
  webPages: WebPage[];
  searchQuery: string;
  activePageId: string | null;
  browserHistory: string[];
  setSearchQuery: (query: string) => void;
  navigateToPage: (pageId: string | null) => void;

  // CyberTerminal App
  terminalLines: TerminalLine[];
  terminalCwd: string;
  filesystem: FsFile[];
  commandHistory: string[];
  executeTerminalCommand: (cmd: string) => void;
  clearTerminal: () => void;

  // Deduction Board App
  deductionSlots: DeductionSlots;
  setDeductionSlot: (slotKey: keyof DeductionSlots, wordText: string | null) => void;
  submissionResult: DeductionSubmissionResult | null;
  submitDeduction: () => void;
  resetDeductionResult: () => void;

  // Victory
  isVictoryModalOpen: boolean;
  setVictoryModalOpen: (open: boolean) => void;

  // System Settings
  settings: SystemSettings;
  toggleCrt: () => void;
  toggleMute: () => void;
  toggleAmbientHum: () => void;
  systemTime: string;
}

const DEFAULT_WINDOWS: Record<AppId, WindowState> = {
  mailbox: {
    id: 'mailbox',
    title: 'MailBox (工作站与专案加密邮件终端)',
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
    title: 'NetQuery (档案检索与网络浏览器)',
    icon: 'Globe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 120, y: 70 },
    size: { width: 880, height: 560 },
    minSize: { width: 600, height: 400 },
  },
  cyberterminal: {
    id: 'cyberterminal',
    title: 'CyberTerminal (电子取证极简终端 v1.0)',
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
    title: 'DeductionBoard (专案调查终审定罪看板)',
    icon: 'FileCheck2',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 80, y: 48 },
    size: { width: 880, height: 510 },
    minSize: { width: 620, height: 380 },
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
  // Onboarding
  onboardingStep: 'bios',
  setOnboardingStep: (step) => {
    soundService.playKeyClick();
    set({ onboardingStep: step });
  },

  // Dynamic Objectives
  objectives: INITIAL_OBJECTIVES,
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
      // Auto-unlock next
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

  // Words & Word Bank (Starts empty! Players must actively click in text/outputs to extract)
  collectedWords: [],
  availableWordsPool: ALL_INVESTIGATION_WORDS,
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

    // Find definition in pool or create dynamic
    const seed = ALL_INVESTIGATION_WORDS.find(
      (w) => w.text.toLowerCase() === trimmed.toLowerCase()
    );
    const newWord: WordItem = seed || {
      id: `w_dyn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      text: trimmed,
      category: customCategory || 'location_evidence',
      categoryLabel:
        customCategory === 'character'
          ? '人物'
          : customCategory === 'timestamp'
          ? '时间点'
          : customCategory === 'action_motive'
          ? '手段与动机'
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
      const win = state.windows[id];
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

  // Mail App (Separated Leads, Inbox, Drafts, Trash)
  mails: INITIAL_MAILS,
  selectedMailId: INITIAL_MAILS[0].id,
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
      // If mail_001 (leads) read and draft checked, advance stage 1
      const mail01 = updated.find((m) => m.id === 'mail_001');
      const mail02 = updated.find((m) => m.id === 'mail_002');
      if (mail01?.read && mail02?.read) {
        state.completeObjective('obj_1');
      }
      return { mails: updated };
    });
  },

  // NetQuery Browser
  webPages: INITIAL_WEB_PAGES,
  searchQuery: '',
  activePageId: INITIAL_WEB_PAGES[0].id,
  browserHistory: [INITIAL_WEB_PAGES[0].id],
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  navigateToPage: (pageId: string | null) => {
    soundService.playKeyClick();
    set((state) => ({
      activePageId: pageId,
      browserHistory: pageId ? [...state.browserHistory, pageId] : state.browserHistory,
    }));
  },

  // CyberTerminal
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
  filesystem: INITIAL_FILESYSTEM,
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
        newLines.push({
          id: `out_${timestamp}_1`,
          type: 'output',
          text: `CyberOS Forensic Terminal 常用命令指南：
  ls [路径]                     - 列出指定目录或当前目录的文件
  cat [文件名]                  - 查看文本文件明文内容
  diff [文件1] [文件2]           - 比较两份日志或文件的差异并高亮异常行
  decrypt [文件] -k [密码]       - 解密受保护的加密数据包
  clear                         - 清屏
  help                          - 显示此帮助信息

示例：
  ls /logs
  cat readme.txt
  decrypt [文件] -k [密钥]
  diff [文件1] [文件2]`,
        });
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
          return fileDir === targetPath;
        });

        if (filesInDir.length === 0) {
          if (targetPath === '/' || targetPath === '/home' || targetPath === '/logs') {
            newLines.push({
              id: `out_${timestamp}`,
              type: 'output',
              text: targetPath === '/' ? 'home/   logs/   var/' : '(empty directory)',
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
              const sizeTag = f.size ? ` (${f.size} B)` : '';
              return `  ${f.name}${encTag}${sizeTag}`;
            })
            .join('\n');
          newLines.push({
            id: `out_${timestamp}`,
            type: 'output',
            text: `目录 ${targetPath} 中的文件：\n${listOutput}`,
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
            text: `cat: ${fileName}: [二进制加密流] 无法直接读取，该文件受到 AES 对称密钥保护。\n请使用 decrypt 命令进行解密：decrypt ${file.name} -k [密钥]`,
          });
          soundService.playBuzzer();
        } else {
          soundService.playBeep(950, 0.08);
          newLines.push({
            id: `out_${timestamp}`,
            type: 'output',
            text: file.content || '(空文件)',
          });
        }
        break;
      }

      case 'decrypt': {
        // Usage: decrypt [file] -k [key]
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
            text: 'decrypt: 必须提供 -k [密钥] 参数。示例: decrypt diary.enc -k 2006lucky',
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
          // Success decrypt!
          soundService.playBeep(1100, 0.15);
          const decryptedName = file.decryptedName || 'diary.txt';
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
                  updatedAt: '2010-06-10 09:30',
                  content: decryptedContent,
                },
              ],
            }));
          }

          newLines.push({
            id: `succ_${timestamp}`,
            type: 'success',
            text: `[DECRYPTION SUCCESSFUL]
密钥校验通过！已成功解密归档数据包。
输出明文文件：${decryptedPath}

文件内容摘要：
------------------------------------------------------------
${decryptedContent}
------------------------------------------------------------
提示：已自动解锁日记中涉及的 Root密钥 与 15楼机房 调查线索。`,
          });

          // Unlocks / advances Stage 2 -> Stage 3
          get().completeObjective('obj_2');
          get().addWord('Root权限密钥', 'location_evidence');
          get().addWord('15楼机房', 'location_evidence');
        } else {
          newLines.push({
            id: `err_${timestamp}`,
            type: 'error',
            text: `[DECRYPTION FAILED] 密钥 '${key}' 校验失败：密码不匹配或哈希校验和错误！
提示：林默的备用密钥格式为【入职年份】+【爱犬名字】（全小写紧邻无空格，例如：2008kitty）。`,
          });
          soundService.playBuzzer();
        }
        break;
      }

      case 'diff': {
        // Usage: diff [file1] [file2]
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

        const lines1 = (f1.content || '').split('\n');
        const lines2 = (f2.content || '').split('\n');

        const diffLines: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];

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

          // Unlocks Stage 3 -> Stage 4
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

  // Deduction Board
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
  submissionResult: null,
  resetDeductionResult: () => set({ submissionResult: null }),
  submitDeduction: () => {
    const slots = get().deductionSlots;

    const correctA = slots.slotA === DEDUCTION_SOLUTION.slotA;
    const correctB = slots.slotB === DEDUCTION_SOLUTION.slotB;
    const correctC = slots.slotC === DEDUCTION_SOLUTION.slotC;
    const correctD = slots.slotD === DEDUCTION_SOLUTION.slotD;

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
          message: '【定罪成立 · 予以归档】',
          correctSlots: { slotA: true, slotB: true, slotC: true, slotD: true },
          feedback:
            '专案审定结论：真凶陈建国于 2010-06-09 23:40 潜入 15 楼机房，利用盗取的 Root 密钥强行格式化服务器以抹除转售奇美拉临床试验数据的铁证。林默系撞破其罪证遭灭口坠楼。案件证据链完全闭环！',
        },
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

  // Victory Modal
  isVictoryModalOpen: false,
  setVictoryModalOpen: (open: boolean) => set({ isVictoryModalOpen: open }),

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
}));
