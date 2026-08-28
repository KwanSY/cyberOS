import {
  Objective,
  WordItem,
  MailItem,
  WebPage,
  FsFile,
  AudioTrack,
  Chapter2DeductionSlots,
} from '../types/game';

export const CHAPTER2_SYSTEM_INFO = {
  os_version: 'CyberOS 1.1 (Build 20100615)',
  current_user: 'Forensic_Auditor',
  user_id: 'FA-9021',
  virtual_time: '2010-06-15 14:00:00',
  case_id: 'CASE-20100615-02_COVERT',
  security_status: 'UNAUTHORIZED_OVERRIDE',
};

export const CHAPTER2_OBJECTIVES: Objective[] = [
  {
    id: 'obj_1',
    stageName: '阶段 1',
    text: '【主动追查】潜入 MedQuery 医疗数据库，调阅 07 号受试者档案',
    status: 'active',
  },
  {
    id: 'obj_2',
    stageName: '阶段 2',
    text: '【主动破译】解密并播放苏曼遗留的现场求救录音',
    status: 'locked',
  },
  {
    id: 'obj_3',
    stageName: '阶段 3',
    text: '【主动比对】diff 比对原始脑电与归档病历，锁定伪造铁证',
    status: 'locked',
  },
  {
    id: 'obj_4',
    stageName: '阶段 4',
    text: '【主动穿透】trace 追踪离岸资金链路，发起独立公开弹劾',
    status: 'locked',
  },
];

export const CHAPTER2_WORDS: WordItem[] = [
  // 人物
  {
    id: 'w_zhao_lan',
    text: '赵岚',
    category: 'character',
    categoryLabel: '人物',
    description: '天宇科技前算法实习生，奇美拉-N受试者 SUB-0007，昏迷受害者',
  },
  {
    id: 'w_liang_shaohui',
    text: '梁绍辉',
    category: 'character',
    categoryLabel: '人物',
    description: '圣路加第七医院临床主任，执行病历篡改与医学伪造的直接责任人',
  },
  {
    id: 'w_shen_mingyuan',
    text: '沈明远',
    category: 'character',
    categoryLabel: '人物',
    description: '天宇科技财务总监，操盘海外30亿上市融资并侵吞2000万赔偿金的幕后主使',
  },
  {
    id: 'w_su_man',
    text: '苏曼',
    category: 'character',
    categoryLabel: '人物',
    description: '圣路加医院主治护士，保存原始脑电并试图举报，遭蓄意车祸灭口重伤',
  },
  {
    id: 'w_guan_yue',
    text: '关悦',
    category: 'character',
    categoryLabel: '人物',
    description: '主角（FA-9021）患有神经退行性疾病的妹妹，处于假药二期临床排队名单中',
  },
  {
    id: 'w_fa9021_ch2',
    text: 'FA-9021',
    category: 'character',
    categoryLabel: '人物',
    description: '专案数字法医/档案审计员（玩家身份，2009年曾驳回苏曼申诉）',
  },

  // 时间点 / 编号
  {
    id: 'w_sub0007',
    text: 'SUB-0007',
    category: 'timestamp',
    categoryLabel: '时间/编号',
    description: '受试者赵岚在奇美拉临床试验中的绝密受试代号',
  },
  {
    id: 'w_cand092',
    text: 'CAND-2010-092',
    category: 'timestamp',
    categoryLabel: '时间/编号',
    description: '关悦在圣路加医院申报 Chimera-N 二期临床的排队档案案号',
  },
  {
    id: 'w_doc0109',
    text: 'DOC-0109',
    category: 'timestamp',
    categoryLabel: '时间/编号',
    description: '临床主任梁绍辉的医生工号与电子签名凭证',
  },
  {
    id: 'w_nurse0322',
    text: 'NURSE-0322',
    category: 'timestamp',
    categoryLabel: '时间/编号',
    description: '主治护士苏曼的员工工号',
  },
  {
    id: 'w_key_20080322',
    text: '20080322',
    category: 'timestamp',
    categoryLabel: '时间/编号',
    description: '苏曼入职圣路加医院的日期（解密录音文件的核心密钥）',
  },

  // 地点 / 物证 / IP / 机构
  {
    id: 'w_ip_aegis',
    text: '198.51.100.24',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '离岸空壳信托 Aegis Horizon 在境外的数据与资金接收中继节点',
  },
  {
    id: 'w_st_luke',
    text: '圣路加第七医院',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '奇美拉临床试验合作定点医院，伪造病历出具机构',
  },
  {
    id: 'w_aegis_trust',
    text: 'Aegis Horizon',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '沈明远设立于开曼群岛的离岸空壳洗钱信托实体',
  },
  {
    id: 'w_raw_eeg',
    text: 'SUB-0007_raw_eeg.dat',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '苏曼秘密封存的 07 号受试者原始异常放电时域脑电数据包',
  },

  // 手段与动机
  {
    id: 'w_cause_toxicity',
    text: '奇美拉-N神经激动剂药物毒性',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '【真实致残诱因】未经审批的大剂量神经激动剂诱发重度器质性脑萎缩',
  },
  {
    id: 'w_cause_hereditary',
    text: '隐瞒家族遗传病',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '【伪造免责说辞】梁绍辉与沈明远强行栽赃给受害者的虚假病因（迷惑项）',
  },
  {
    id: 'w_act_silence_deal',
    text: '强制签署保密与放弃追责协议',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '【胁迫手段】以200万封口费威逼家属签署放弃一切法律诉讼的沉默协议',
  },
  {
    id: 'w_act_embezzle',
    text: '侵吞专项补偿金',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '【贪腐手段】将原本属于受试者的2000万专项临床补偿金私自截留侵吞',
  },
  {
    id: 'w_motive_ipo',
    text: '保障天宇科技与远景生命上市融资',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '【核心掩盖动机】为确保纳斯达克30亿美元IPO顺利过审，强行隐瞒严重神经毒性',
  },
];

export const CHAPTER2_MAILS: MailItem[] = [
  {
    id: 'mail_201',
    sender: 'dead_man_switch@tianyu.internal',
    senderName: 'Dead Man\'s Switch (林默死人开关)',
    subject: '【自动注入】林默最后的暗中备份：圣路加涉案镜像',
    date: '2010-06-10 23:59',
    folder: 'leads',
    read: false,
    starred: true,
    content: `档案审计员 FA-9021：

如果你正在阅读这封邮件，说明管理层已经在逼你归档结案了。
[[陈建国]] 只是搬运工，真正给这所城市降下阴影的，是隐藏在圣路加医院医疗试验源头的黑手。

他们抹掉了 [[SUB-0007]] 号受试者的真实病历！
我已经通过系统底层将圣路加涉案工作站脱机镜像（st_luke_hospital_mirror.raw）挂载到你的审计终端。
立刻进入 [[圣路加第七医院]] 的 MedQuery 医疗内网，查出实习生 [[赵岚]] 的下落！

这是我留给这个世界最后的钥匙。`,
  },
  {
    id: 'mail_202',
    sender: 'suman_leaks@encrypted.net',
    senderName: '苏曼 (主治护士)',
    subject: '【求助】关于 07 号受试者赵岚的原始录音与病历附件',
    date: '2010-06-02 17:20',
    folder: 'inbox',
    read: false,
    starred: true,
    content: `林默工程师：

我是圣路加神经重症科护士 [[苏曼]]（工号：[[NURSE-0322]]）。
[[赵岚]]（[[SUB-0007]]）的真实脑电图已经被梁绍辉主任强行销毁，他受财务总监 [[沈明远]] 的指示，正逼迫赵岚家属在 [[强制签署保密与放弃追责协议]] 上签字！

我用录音笔偷录了梁主任在办公室里的谈话，加密保存在附件 [[voicemail_07.enc]] 中。
为了防备梁绍辉拿到录音，我用了我最刻骨铭心的那个日子作为 8 位数字密码——那是我第一次穿上圣路加护士服正式入职宣誓的日子……

我已将关键脱机数据与封存证据的路径留在录音附件中，解密这份录音即可获取确凿证据！我感觉有人在跟踪我的车，如果我遭遇意外，请一定将真相公之于众！`,
    attachments: [
      {
        name: 'voicemail_07.enc',
        type: 'audio',
        url: './assets/voicemail_07.enc',
        size: '1.4 MB',
      },
    ],
  },
  {
    id: 'mail_203',
    sender: 'noreply@st-luke-hospital.org',
    senderName: '圣路加第七医院 临床招募中心',
    subject: '【受理通知】Chimera-N 二期临床优先受试资格申请审核通过',
    date: '2010-06-12 10:15',
    folder: 'inbox',
    read: true,
    content: `尊敬的 FA-9021 审计员：

您为家属 [[关悦]] 提交的《奇美拉-N 二期临床试验优先受试资格申请》（申请档案编号：[[CAND-2010-092]]）已通过伦理与医疗委员会初步筛选。

审核批示意见：
“医疗主管 [[梁绍辉]] 批示：鉴于患者为 FA-9021 家属，特批纳入第一批优先注射名单。待天宇科技纳斯达克 IPO 报告发布后，即刻安排第一针注射。”

请按时陪同家属前往圣路加第七医院 3 号特护楼报到。

圣路加第七联合医院 临床试验管理部`,
  },
];

export const CHAPTER2_WEB_PAGES: WebPage[] = [
  {
    id: 'page_med_search',
    title: '圣路加第七医院 - 医疗内网数据中心 (MedQuery)',
    url: 'http://medquery.st-luke.internal/query',
    category: 'hospital_med',
    author: '圣路加医院 信息中心',
    date: '2010-06-15',
    summary: '圣路加第七医院电子病历档案、受试者队列及责任医生检索系统。',
    keywords: [
      'MedQuery',
      '圣路加第七医院',
      '受试者',
      'SUB-0007',
      '赵岚',
      '关悦',
      'CAND-2010-092',
      'DOC-0109',
      '梁绍辉',
      '奇美拉受试名单',
    ],
    bannerImage: './assets/st_luke_hospital_logo.jpg',
    contentType: 'medical_record',
    content: `【圣路加第七联合医院 医疗内网数据查询系统 (MedQuery v2.4)】

支持检索指令与过滤：
1. 受试者病历查询：输入受试者编号（如 [[SUB-0007]]）或受试者姓名（如 [[赵岚]]）调阅电子病程。
2. 临床排队队列查询：输入候选案号（如 [[CAND-2010-092]]）或姓名（如 [[关悦]]）查询候诊状态。
3. 执业医生名录查询：输入工号（如 [[DOC-0109]]）调阅主治医师电子签名认证。`,
  },
  {
    id: 'page_sub_0007',
    title: '【病历档案】受试者 SUB-0007（赵岚）临床终结与出院小结',
    url: 'http://medquery.st-luke.internal/records/SUB-0007',
    category: 'hospital_med',
    author: '神经重症医学科 梁绍辉 主任医师',
    date: '2010-05-28',
    summary: '奇美拉-N项目 07 号受试者临床反应判定书与官方出院小结。',
    keywords: [
      'SUB-0007',
      '赵岚',
      '病历',
      '脑电图',
      '梁绍辉',
      '隐瞒家族遗传病',
      '急性家族性脑退化',
      'DOC-0109',
      'EEG',
    ],
    bannerImage: './assets/eeg_sub0007_tampered.jpg',
    avatarImage: './assets/portrait_zhao.jpg',
    contentType: 'medical_record',
    content: `【患者基本信息】
姓名：[[赵岚]] | 性别：女 | 年龄：22 岁 | 身份：天宇科技算法实习生
受试编号：[[SUB-0007]] | 关联项目：奇美拉-N (Chimera-N) 一期/二期临床
主治及责任医师：[[梁绍辉]] 教授（工号：[[DOC-0109]]）
管床护士：[[苏曼]]（工号：[[NURSE-0322]]）

【临床经过与官方诊断结论】
受试者于 2010-05-18 接受 Chimera-N 注射后出现弥漫性脑电波异常与意识障碍。
经临床主任 [[梁绍辉]] 综合会诊审定，最终结论判定为：
“受试者系 [[隐瞒家族遗传病]] 史导致的急性家族性脑退化伴昏迷，与试验药物奇美拉-N不存在直接因果关系。予以终结随访。”

【物证痕迹警示】
附录包含 07 号受试者脑电图原始单据扫描件。单据上有明显的手写红笔涂改及伪造签字痕迹！`,
  },
  {
    id: 'page_candidate_092',
    title: '【候诊档案】优先临床受试队列 CAND-2010-092（关悦）',
    url: 'http://medquery.st-luke.internal/candidates/CAND-2010-092',
    category: 'hospital_med',
    author: '临床试验招募办公室',
    date: '2010-06-12',
    summary: '神经靶向药物 Chimera-N 二期人体临床优先入组审批表。',
    keywords: [
      '关悦',
      'CAND-2010-092',
      'FA-9021',
      '排队',
      '梁绍辉',
      '奇美拉-N',
      '妹妹',
    ],
    contentType: 'medical_record',
    content: `【圣路加医院 临床试验优先受试者档案】
申请案号：[[CAND-2010-092]]
申请患者姓名：[[关悦]]（20岁，数字法医 [[FA-9021]] 直系至亲妹妹）
临床入组项目：Chimera-N 神经修复与轴突再生激动剂（二期人体试验）
当前状态：【排队候诊中 · 特批高优先级】

【医疗主管审批批示】
主任医师 [[梁绍辉]]（工号：[[DOC-0109]]）签署意见：
“申请人属司法审计员 FA-9021 直系亲属，予以特殊关照。待天宇科技纳斯达克 IPO 官方通报发布后，即刻安排第一批临床针剂注射。”`,
  },
  {
    id: 'page_news_ipo',
    title: '财经快讯：天宇科技携手远景生命启动纳斯达克 IPO 冲刺',
    url: 'http://finance.globalnews.com/news/20100614-tianyu-ipo',
    category: 'news',
    author: '华尔街生物医药前沿观察',
    date: '2010-06-14',
    summary: '财务总监沈明远宣布 Chimera 获得突破性成果，估值超过 30 亿美元。',
    keywords: [
      '沈明远',
      '天宇科技',
      '远景生命',
      'IPO',
      '上市',
      '融资',
      '30亿美元',
      '保障天宇科技与远景生命上市融资',
    ],
    avatarImage: './assets/portrait_liang.jpg',
    contentType: 'article',
    content: `【纽约/香港电】天宇科技财务总监 [[沈明远]] 先生今日在越洋投资人电话会议上正式宣布：
公司与远景神经科学研究所联合申报的神经靶向药物“Chimera（奇美拉）”已取得“零严重不良反应”的完美临床数据，计划下周向纳斯达克递交上市申请，估值预计超过 30 亿美元！

沈明远在声明中强调：“所有受试者均表现良好，没有任何毒理学隐患。本次 IPO 将为全球神经退行性疾病患者带来革命性曙光。”
据了解，为 [[保障天宇科技与远景生命上市融资]]，天宇科技管理层已向圣路加医院注入数千万元专项联合研发资金。`,
  },
  {
    id: 'page_silence_agreement',
    title: '法务通报：关于受试者 SUB-0007 协议签署与舆情阻断公函',
    url: 'http://legal.st-luke.internal/memos/sub0007-settlement',
    category: 'intranet',
    author: '圣路加医院 法务与公关部',
    date: '2010-05-30',
    summary: '针对 07 号受试者家属签署放弃追责协议并实施舆情封锁的通报。',
    keywords: [
      '沉默协议',
      '保密协议',
      '强制签署保密与放弃追责协议',
      '侵吞专项补偿金',
      '沈明远',
      '2000万',
      '两百万',
      '苏曼',
    ],
    bannerImage: './assets/settlement_agreement_confidential.jpg',
    contentType: 'article',
    content: `【绝密法务备忘录：关于 07 号受试者家属和解结案】

针对受试者赵岚（[[SUB-0007]]）不良事件，法务部在财务总监 [[沈明远]] 的协调下，已于 5 月 29 日迫使受害人家属签署《[[强制签署保密与放弃追责协议]]》。

协议关键要点：
1. 支付家属 200 万元“人道主义关怀金”，家属永久放弃向监管机构和司法机关提起诉讼之权利。
2. 财务总监沈明远指示：原本核准的 2000 万元受试者重大医疗事故专项赔偿基金，剩余 1800 万元通过境外离岸顾问费通道进行平账处理（[[侵吞专项补偿金]]）。
3. 鉴于管床护士 [[苏曼]] 多次私自调阅归档病历，安保部已对其采取严格行踪布控。`,
  },
  {
    id: 'page_nurse_shift',
    title: '圣路加第七医院 - 急诊与神经重症监护科 2008 年度排班与员工名录',
    url: 'http://hr.st-luke.internal/roster/2008/icu_nurses',
    category: 'intranet',
    author: '人力资源与护理部',
    date: '2008-04-01',
    summary: '神经重症医学科在职护理人员工号、入职登记日及岗位分配表。',
    keywords: [
      '苏曼',
      'NURSE-0322',
      '20080322',
      '入职日期',
      '排班',
      '护士',
      '工号',
    ],
    avatarImage: './assets/portrait_su.jpg',
    contentType: 'shift_table',
    content: `【神经重症监护室 (ICU) 专科护士档案表】`,
    tableData: [
      {
        name: '苏曼 (Su Man)',
        empId: 'NURSE-0322',
        hireDate: '2008-03-22',
        role: '重症专科主治护士',
        status: '在岗（负责奇美拉临床特护）',
      },
      {
        name: '李晓晴',
        empId: 'NURSE-0288',
        hireDate: '2007-09-15',
        role: '急诊分诊护士',
        status: '在岗',
      },
      {
        name: '张雅婷',
        empId: 'NURSE-0341',
        hireDate: '2009-02-10',
        role: '神经内科病房护士',
        status: '在岗',
      },
    ],
  },
];

export const CHAPTER2_FILESYSTEM: FsFile[] = [
  // 1. 公开发布的篡改病历
  {
    name: 'SUB-0007_public.txt',
    path: '/med/records/SUB-0007_public.txt',
    type: 'file',
    size: 980,
    updatedAt: '2010-05-30 16:00',
    content: `================================================================
圣路加第七联合医院 - 临床试验患者出院总结报告 (归档公开版)
受试编号：SUB-0007
患者姓名：赵岚 (女, 22岁)
主管医师：梁绍辉 (工号: DOC-0109)
管床护士：苏曼 (工号: NURSE-0322)
================================================================
[入院记录 2010-05-10]
患者作为奇美拉-N二期临床受试志愿者入院，基础生命体征平稳。

[治疗记录 2010-05-18]
执行 Chimera-N 试验药剂注射。

[出院诊断结论 2010-05-28]
- 神经系统检查：意识昏迷，对光反射迟钝。
- 诊断结论：患者系隐瞒家族遗传病史导致的突发急性家族性脑退化。
- 责任认定：系患者自身隐瞒家族病史所致，与 Chimera-N 试验药物无因果关联。
- 随访建议：家属已签署保密和解协议，终止一切后续临床追踪。
================================================================`,
  },

  // 2. 苏曼偷录的原始脱机脑电与毒理数据
  {
    name: 'SUB-0007_raw_eeg.dat',
    path: '/med/backup/SUB-0007_raw_eeg.dat',
    type: 'file',
    size: 2450,
    updatedAt: '2010-05-19 03:20',
    content: `================================================================
圣路加第七联合医院 - 脑电监测中心 原始脱机时域分析日志 (RAW_EEG)
受试编号：SUB-0007
患者姓名：赵岚 (女, 22岁)
监测记录人：苏曼 (ICU主治护士)
================================================================
[2010-05-18 14:00:00] 注入试验药剂 Chimera-N (40mg 神经激动剂超高剂量)。
[2010-05-18 14:22:15] ALERT: 双侧额叶与颞叶出现剧烈异常高波幅棘慢复合波放电。
[2010-05-18 15:10:48] CRITICAL: 脑电背景波迅速平坦化，呈现弥漫性广泛脑实质不可逆器质性衰竭。
[2010-05-18 16:00:00] 临床毒理判定：注射 Chimera-N 40mg 后出现严重中枢神经毒性反应！
[2010-05-18 16:30:20] 护士记录：向梁绍辉主任紧急汇报严重毒性反应，梁主任要求立即停止向上级伦理委员会提交报告，并要求删除本地原始波形数据。
[2010-05-19 03:15:00] 护士备份：苏曼秘密导出原始 EEG 数据包并封存至脱机备份目录。
================================================================`,
  },

  // 3. 伏笔二：历史审计驳回记录（主角 FA-9021 的职业原罪）
  {
    name: 'audit_rebuff_20091102.log',
    path: '/archive/2009/audit_rebuff_20091102.log',
    type: 'file',
    size: 760,
    updatedAt: '2009-11-02 18:30',
    readOnly: true,
    content: `================================================================
司法审计中心 外部紧急申诉处理工单
案件编号：REQ-20091102
申诉时间：2009-11-02 15:20:10
申诉人：苏曼 (圣路加第七医院 ICU 护士)
被举报方：圣路加第七医院 临床实验室 / 远景神经研究所
举报事由：圣路加医院在开展第一期神经修复临床试验中违规超量给药并瞒报受试者癫痫反应。
================================================================
【处理结论与签字】
经办审计员：FA-9021
审查结论：申诉人所提交材料缺乏第一责任医师签名盖章，证据不充分，不予立案。予以驳回。
归档状态：[CASE REBUFFED / CLOSED]
================================================================`,
  },

  // 4. 迷惑项 1：常规耗材采购合规抽检
  {
    name: 'audit_routine_20090618.log',
    path: '/archive/2009/audit_routine_20090618.log',
    type: 'file',
    size: 512,
    updatedAt: '2009-06-18 11:00',
    readOnly: true,
    content: `================================================================
司法审计中心 常规例行抽检记录
抽检编号：INSP-20090618-04
受检单位：圣路加第七医院 医用耗材采购处
审计事项：2009年第二季度神经电极导联线及一次性穿刺包采购资质抽查。
审查结论：供应商具备三类医疗器械合规资质，发票与入库单据齐全，抽检合格。
经办审计员：FA-9014
================================================================`,
  },

  // 5. 迷惑项 2：外包供应商合同争议申诉
  {
    name: 'audit_complaint_20090814.log',
    path: '/archive/2009/audit_complaint_20090814.log',
    type: 'file',
    size: 640,
    updatedAt: '2009-08-14 14:45',
    readOnly: true,
    content: `================================================================
司法审计中心 商业合同争议申诉记录
案件编号：REQ-20090814-09
申诉人：远景试剂供应物流有限公司
被举报方：天宇科技海外商务部 (王思远)
争议内容：海外二期动物实验耗材尾款支付逾期违约纠纷。
审查结论：属于民事商业合同履约争议，不属于数字法医刑事取证管辖范畴，建议移交民商事仲裁机构。
经办审计员：FA-9008
================================================================`,
  },

  // 6. 伏笔三：林默死人开关白名单元数据
  {
    name: 'whitelist_dispatch.meta',
    path: '/home/auditor/whitelist_dispatch.meta',
    type: 'file',
    size: 380,
    updatedAt: '2010-06-09 23:25',
    content: `================================================================
DEAD MAN'S SWITCH DISPATCH PROTOCOL v4.1 (TOP SECRET)
Trigger Condition: System Heartbeat Missing > 30 mins
Dispatch Target: FA-9021 (Forensic Auditor)
Attached Payload: /mnt/st_luke_hospital_mirror.raw
Whitelist Authorization Note:
"DMS_WHITELIST: [FA-9021] - Reason: He owes her. (他欠她的)。2009年的驳回是他的原罪，这一次，他必须亲手刺破圣路加与沈明远的谎言。"
================================================================`,
  },

  // 7. 加密音频文件
  {
    name: 'voicemail_07.enc',
    path: '/home/auditor/voicemail_07.enc',
    type: 'file',
    size: 1420,
    updatedAt: '2010-06-02 17:30',
    isEncrypted: true,
    encryptedWith: '20080322',
    decryptedName: 'voicemail_07.wav',
    decryptedContent: `[DECRYPTED AUDIO STREAM: voicemail_07.wav]
录音时长：00:42
录音双方：苏曼 (ICU主治护士) vs 梁绍辉 (临床主任)
录音地点：圣路加医院 3号楼主任办公室

对白录音记录：
[00:00] 苏曼: “梁主任，07号受试者赵岚的脑电图出现了严重器质性衰竭，这明显是奇美拉-N的药物毒性！”
[00:12] 梁绍辉: “闭嘴！天宇科技下周就要向海外递交上市申请，沈总已经交代过，绝对不能有药物不良反应报告。”
[00:25] 梁绍辉: “把病历改成隐瞒家族遗传病。法务会带保密与放弃追责协议过去，给家属两百万封口维护处理。”
[00:36] 苏曼: “可那是两千万的专项赔偿金！你们这是谋杀……”

================================================================
【苏曼取证留言与关键文件留存路径】
“我已经将梁绍辉篡改发布的假病历（/med/records/SUB-0007_public.txt）与我私自导出的真实原始脑电记录（/med/backup/SUB-0007_raw_eeg.dat）一并封存进医院镜像卷中！
请审计员在终端使用 diff 命令比对这两个文件（diff SUB-0007_public.txt SUB-0007_raw_eeg.dat），抓获他们伪造病历的铁证！”
================================================================`,
  },
];

export const CHAPTER2_AUDIO_TRACK: AudioTrack = {
  id: 'audio_001',
  title: 'voicemail_07.enc (未识别加密音频流)',
  fileName: 'voicemail_07.enc',
  duration: '00:42',
  durationSeconds: 42,
  isUnlocked: false,
  transcript: [
    {
      time: 0,
      speaker: '苏曼',
      text: '梁主任，07号受试者赵岚的脑电图出现了严重器质性衰竭，这明显是奇美拉-N的药物毒性！',
    },
    {
      time: 12,
      speaker: '梁绍辉',
      text: '闭嘴！天宇科技下周就要向海外递交上市申请，沈总已经交代过，绝对不能有药物不良反应报告。',
    },
    {
      time: 25,
      speaker: '梁绍辉',
      text: '把病历改成隐瞒家族遗传病。法务会带保密与放弃追责协议过去，给家属两百万封口维护处理。',
    },
    {
      time: 36,
      speaker: '苏曼',
      text: '可那是两千万的专项赔偿金！你们这是谋杀……',
    },
    {
      time: 39,
      speaker: '苏曼',
      text: '我已将公开假病历与原始脱机脑电备份留存，请在终端比对 SUB-0007_public.txt 与 SUB-0007_raw_eeg.dat！',
    },
  ],
};

export const CHAPTER2_NOTEPAD_CONTENT = `【数字法医 FA-9021 私人待办备忘】
1. 给妹妹关悦回电话，询问圣路加医院 Chimera-N 二期临床申请进度。
2. 案号 CAND-2010-092 已通过初筛，务必确认梁绍辉主任的用药安全性批示。
3. 妹妹的生日快到了，提前预定蛋糕。`;

export const CHAPTER2_DEDUCTION_SOLUTION: Chapter2DeductionSlots = {
  // 卡片 1【医疗事故真相与病历篡改】
  card1_patient: '赵岚',
  card1_real_cause: '奇美拉-N神经激动剂药物毒性',
  card1_forger: '梁绍辉',

  // 卡片 2【沉默协议与离岸利益链】
  card2_method: '强制签署保密与放弃追责协议',
  card2_beneficiary: '沈明远',
  card2_motive: '保障天宇科技与远景生命上市融资',
};
