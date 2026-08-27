export type ObjectiveId = 'obj_1' | 'obj_2' | 'obj_3' | 'obj_4';

export interface Objective {
  id: ObjectiveId;
  text: string;
  stageName: string;
  status: 'active' | 'completed' | 'locked';
}

export type WordCategory = 'character' | 'timestamp' | 'location_evidence' | 'action_motive';

export interface WordItem {
  id: string;
  text: string;
  category: WordCategory;
  categoryLabel: string;
  description?: string;
}

export interface MailAttachment {
  name: string;
  type: 'image' | 'file';
  url: string;
  size: string;
}

export interface MailItem {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  date: string;
  folder: 'inbox' | 'leads' | 'drafts' | 'trash';
  read: boolean;
  starred?: boolean;
  content: string;
  attachments?: MailAttachment[];
}

export interface WebPage {
  id: string;
  title: string;
  url: string;
  category: 'intranet' | 'archive' | 'news';
  author?: string;
  date?: string;
  summary: string;
  keywords: string[];
  bannerImage?: string;
  avatarImage?: string;
  content: string;
  contentType: 'article' | 'profile' | 'log_table' | 'incident_report';
  tableData?: Array<Record<string, string>>;
}

export interface FsFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  updatedAt?: string;
  content?: string;
  isEncrypted?: boolean;
  encryptedWith?: string;
  decryptedName?: string;
  decryptedContent?: string;
  readOnly?: boolean;
}

export type AppId = 'mailbox' | 'netquery' | 'cyberterminal' | 'deduction' | 'trash' | 'systeminfo';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface DeductionSlots {
  slotA: string | null; // 真凶姓名: 陈建国
  slotB: string | null; // 作案时间点: 2010-06-09 23:40
  slotC: string | null; // 关键作案手段: 盗用Root权限密钥格式化服务器
  slotD: string | null; // 核心违法动机: 私自导出奇美拉临床试验数据
}

export type DeductionResultStatus = 'idle' | 'rejected' | 'approved';

export interface DeductionSubmissionResult {
  status: DeductionResultStatus;
  message: string;
  correctSlots: {
    slotA: boolean;
    slotB: boolean;
    slotC: boolean;
    slotD: boolean;
  };
  feedback: string;
}

export interface SystemSettings {
  crtEnabled: boolean;
  audioMuted: boolean;
  ambientHumEnabled: boolean;
  theme: 'industrial_blue' | 'amber_crt' | 'matrix_green';
}
