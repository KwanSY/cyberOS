export type ObjectiveId = 'obj_1' | 'obj_2' | 'obj_3' | 'obj_4';

export interface Objective {
  id: ObjectiveId;
  text: string;
  stageName: string;
  status: 'active' | 'completed' | 'locked';
}

export type WordCategory = 'character' | 'timestamp' | 'location_evidence' | 'action_motive' | 'medical_term' | 'finance_org';

export interface WordItem {
  id: string;
  text: string;
  category: WordCategory;
  categoryLabel: string;
  description?: string;
}

export interface MailAttachment {
  name: string;
  type: 'image' | 'file' | 'audio';
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
  category: 'intranet' | 'archive' | 'news' | 'hospital_med';
  author?: string;
  date?: string;
  summary: string;
  keywords: string[];
  bannerImage?: string;
  avatarImage?: string;
  content: string;
  contentType: 'article' | 'profile' | 'log_table' | 'incident_report' | 'medical_record' | 'shift_table';
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

export type AppId =
  | 'mailbox'
  | 'netquery'
  | 'cyberterminal'
  | 'deduction'
  | 'trash'
  | 'systeminfo'
  | 'cyberplayer'
  | 'notepad';

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

// Chapter 1 Deduction Slots (4 slots)
export interface DeductionSlots {
  slotA: string | null; // 真凶姓名: 陈建国
  slotB: string | null; // 作案时间点: 2010-06-09 23:40
  slotC: string | null; // 关键作案手段: 盗用Root权限密钥格式化服务器
  slotD: string | null; // 核心违法动机: 私自导出奇美拉临床试验数据
}

// Chapter 2 Deduction Slots (6 slots in 2 cards)
export interface Chapter2DeductionSlots {
  // Card 1: 医疗事故真相与病历篡改
  card1_patient: string | null; // 受害患者: 赵岚
  card1_real_cause: string | null; // 真实致残诱因: 奇美拉-N神经激动剂药物毒性
  card1_forger: string | null; // 伪造病历责任人: 梁绍辉

  // Card 2: 沉默协议与离岸利益链
  card2_method: string | null; // 胁迫手段: 强制签署保密与放弃追责协议
  card2_beneficiary: string | null; // 侵吞补偿金受益人: 沈明远
  card2_motive: string | null; // 核心掩盖动机: 保障天宇科技与远景生命上市融资
}

export type DeductionResultStatus = 'idle' | 'rejected' | 'approved';

export interface DeductionSubmissionResult {
  status: DeductionResultStatus;
  message: string;
  correctSlots: {
    slotA?: boolean;
    slotB?: boolean;
    slotC?: boolean;
    slotD?: boolean;
    card1_patient?: boolean;
    card1_real_cause?: boolean;
    card1_forger?: boolean;
    card2_method?: boolean;
    card2_beneficiary?: boolean;
    card2_motive?: boolean;
  };
  feedback: string;
}

export interface SystemSettings {
  crtEnabled: boolean;
  audioMuted: boolean;
  ambientHumEnabled: boolean;
  theme: 'industrial_blue' | 'amber_crt' | 'matrix_green';
}

// Audio Player types
export interface SubtitleItem {
  time: number;
  speaker: string;
  text: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  fileName: string;
  duration: string;
  durationSeconds: number;
  isUnlocked: boolean;
  transcript: SubtitleItem[];
}

export type NarrativeStage =
  | 'CASE_1_PLAYING'
  | 'CASE_1_FINISHED'
  | 'CLOSURE_PROMPT'
  | 'DEAD_MAN_SWITCH'
  | 'BAD_ENDING'
  | 'OVERRIDE_ACTIVE'
  | 'CHAPTER_2_PLAYING'
  | 'CHAPTER_2_SOLVED'
  | 'MELTDOWN_ESCAPE';

