import { Objective, WordItem, MailItem, WebPage, FsFile } from '../types/game';

export const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'obj_1',
    stageName: '阶段 1',
    text: '查阅外部专案线报与工作站邮箱，破译备忘密码',
    status: 'active',
  },
  {
    id: 'obj_2',
    stageName: '阶段 2',
    text: '检索内网档案，在终端中破译林默绝密加密日记',
    status: 'locked',
  },
  {
    id: 'obj_3',
    stageName: '阶段 3',
    text: '比对门禁出勤、走廊监控与脱机服务器日志 (diff)',
    status: 'locked',
  },
  {
    id: 'obj_4',
    stageName: '阶段 4',
    text: '在定罪看板中甄别线索与迷惑项，提交终审报告',
    status: 'locked',
  },
];

export const ALL_INVESTIGATION_WORDS: WordItem[] = [
  // --- 人物 (Characters) ---
  {
    id: 'w_lin',
    text: '林默',
    category: 'character',
    categoryLabel: '人物',
    description: '天宇科技核心安全架构师，坠亡受害者',
  },
  {
    id: 'w_chen',
    text: '陈建国',
    category: 'character',
    categoryLabel: '人物',
    description: '天宇科技研发副总裁，主管海外业务与医疗平台，本案幕后真凶',
  },
  {
    id: 'w_fa9021',
    text: 'FA-9021',
    category: 'character',
    categoryLabel: '人物',
    description: '专案数字法医/档案审计员（玩家身份）',
  },
  {
    id: 'w_zhang_guard',
    text: '张伟',
    category: 'character',
    categoryLabel: '人物',
    description: '1楼大厅当晚值班巡更保安（迷惑项）',
  },
  {
    id: 'w_zhao_it',
    text: '赵凯',
    category: 'character',
    categoryLabel: '人物',
    description: '天宇科技IT运维主管，负责雷暴应急预案（迷惑项）',
  },
  {
    id: 'w_wang_sales',
    text: '王思远',
    category: 'character',
    categoryLabel: '人物',
    description: '海外商务拓展总监，负责境外合规申报（迷惑项）',
  },

  // --- 时间点 (Timestamps) ---
  {
    id: 'w_t2215',
    text: '2010-06-09 22:15',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '林默刷卡进入 8F 研发部大门的时间（案发前）',
  },
  {
    id: 'w_t2310',
    text: '2010-06-09 23:10',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '陈建国离开 16 楼高管办公室的门禁记录（案发前）',
  },
  {
    id: 'w_t2330',
    text: '2010-06-09 23:30',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '雷暴击中外部光纤导致全楼断网的时间（事故触发点）',
  },
  {
    id: 'w_t2335',
    text: '2010-06-09 23:35',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '陈建国在 1 楼门禁刷卡离开的伪造时间记录（不在场伪证/迷惑项）',
  },
  {
    id: 'w_t2338',
    text: '2010-06-09 23:38',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '15 楼机房走廊监控抓拍到风衣人影潜入机房的真实时间',
  },
  {
    id: 'w_t2340',
    text: '2010-06-09 23:40',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '服务器被盗用 Root 密钥发送数据包并执行全盘格式化的作案时间（正确答案）',
  },
  {
    id: 'w_t2355',
    text: '2010-06-09 23:55',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '急救组赶到天宇大厦 1 楼广场坠楼现场的时间（案发后）',
  },
  {
    id: 'w_year2006',
    text: '2006',
    category: 'timestamp',
    categoryLabel: '时间点',
    description: '林默入职天宇科技的年份（解密关键因子）',
  },

  // --- 关键地点与物证 (Locations & Evidence) ---
  {
    id: 'w_loc_15f',
    text: '15楼机房',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '存放核心临床数据库与物理服务器的受限核心区域',
  },
  {
    id: 'w_loc_1f',
    text: '1楼门禁',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '大厦主进出闸机，陈建国在此留下了代打卡记录',
  },
  {
    id: 'w_loc_16f',
    text: '16楼高管办公区',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '副总裁陈建国与董事会高管独立办公区域',
  },
  {
    id: 'w_root_key',
    text: 'Root权限密钥',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '具有服务器底层全盘擦除权限的顶级凭证 (admin_lin)',
  },
  {
    id: 'w_temp_badge',
    text: '临时访客卡',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '安保部用于临时授权外部维修人员的权限卡（迷惑项）',
  },
  {
    id: 'w_chimera_data',
    text: 'chimera_v3_patient_data.tar.gz',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '奇美拉三期临床试验核心 1,200 名患者全基因与随访加密数据包',
  },
  {
    id: 'w_chimera_doc_p2',
    text: 'chimera_phase2_summary.doc',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '奇美拉二期非保密临床试验总结摘要（迷惑项）',
  },
  {
    id: 'w_ip_exfil',
    text: '198.51.100.24',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '陈建国名下离岸空壳咨询公司持有的境外数据接收 IP 地址',
  },
  {
    id: 'w_ip_local',
    text: '10.0.15.42',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '林默在 15 楼机房调试服务器所使用的内网工作终端 IP',
  },
  {
    id: 'w_lucky',
    text: 'lucky',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '林默生前收养的金毛爱犬名字（解密关键因子）',
  },
  {
    id: 'w_emp0417',
    text: 'EMP-0417',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '林默的员工工号',
  },
  {
    id: 'w_emp0003',
    text: 'EMP-0003',
    category: 'location_evidence',
    categoryLabel: '地点/物证',
    description: '陈建国的员工工号',
  },

  // --- 手段与动机 (Actions & Motives) ---
  {
    id: 'w_act_format',
    text: '盗用Root权限密钥格式化服务器',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '真凶作案手段：借暴雨断网盗用林默密钥擦除本地全部日志与数据库（正确手段）',
  },
  {
    id: 'w_act_export',
    text: '私自导出奇美拉临床试验数据',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '真凶核心动机：非法打包三期患者数据并秘密转售给海外离岸财团牟利（正确动机）',
  },
  {
    id: 'w_act_fake_punch',
    text: '伪造1楼门禁打卡记录',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '反侦查手段：提前打卡制造已离厦的不在场伪证（过程手段/迷惑项）',
  },
  {
    id: 'w_act_cut_fiber',
    text: '物理切断机房主备光纤',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '事故表象：暴雨雷电导致的外网光缆断网（迷惑手段）',
  },
  {
    id: 'w_act_trojan',
    text: '违规植入键盘记录木马',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '林默曾怀疑的恶意窃密手段之一（迷惑手段）',
  },
  {
    id: 'w_motive_stock',
    text: '掩盖期权非法套现亏空',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '高管经济纠纷说辞（迷惑动机）',
  },
  {
    id: 'w_motive_stress',
    text: '因工作压力过大情绪失控',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '公司公关通报试图掩盖真相的自杀定性说辞（迷惑动机）',
  },
  {
    id: 'w_motive_animal',
    text: '窃取二期动物毒理实验报告',
    category: 'action_motive',
    categoryLabel: '手段与动机',
    description: '低密级实验数据失窃猜测（迷惑动机）',
  },
];

export const INITIAL_MAILS: MailItem[] = [
  // 1. 外部绝密专案通道 / 匿名线报
  {
    id: 'mail_001',
    sender: 'zero@ghostmail.net',
    senderName: 'Zero (外部匿名线人)',
    subject: '【绝密线报】关于天宇科技林默坠亡案的内幕证据',
    date: '2010-06-10 08:15',
    folder: 'leads',
    read: false,
    starred: true,
    content: `档案审计员 FA-9021：

林默绝不是因为所谓 [[因工作压力过大情绪失控]] 而自杀！在 2010-06-09 暴雨断网的那天夜里，他在 15 楼机房撞破了公司高层的致命非法交易。

林默在工作站本地目录中留有绝密离线备份文件 [[diary.enc]]。
为了防止被凶手篡改，他设置了个人对称密码保护。

林默习惯将重要的安全密保提示与生活记忆留在邮箱和备忘录中，请在工作站的邮件（收件箱、草稿箱、回收站）中查阅他的密码组合线索。
在 CyberTerminal 终端中使用 decrypt 命令解开日记，那是查清机房真相的唯一钥匙！`,
  },

  // 2. 林默工作收件箱：HR入职通知
  {
    id: 'mail_003',
    sender: 'hr@tianyu-tech.com',
    senderName: '天宇科技 人力资源部',
    subject: '【系统通知】天宇科技员工入职周年纪念礼遇发放',
    date: '2010-06-01 09:00',
    folder: 'inbox',
    read: true,
    content: `尊敬的基础安全架构师 [[林默]] 同志：

恭喜您即将在 [[天宇科技]] 度过第 4 个工作年度！
系统档案显示，您的员工工号为 [[EMP-0417]]，入职年份为 [[2006]] 年 7 月。

公司特为您准备了专属司龄徽章与体检升级礼遇，请于本周内前往 8 楼行政中心领取。

天宇科技（中国）有限公司 人力资源部`,
  },

  // 3. 林默工作收件箱：副总裁陈建国的通牒信
  {
    id: 'mail_004',
    sender: 'chen.jg@tianyu-tech.com',
    senderName: '陈建国 (研发副总裁)',
    subject: '【工作通牒】关于推进奇美拉三期数据海外联合评估的决议',
    date: '2010-06-07 18:30',
    folder: 'inbox',
    read: true,
    content: `林默：

不要再拿“受试患者隐私协议”作为借口推阻奇美拉三期数据的对外接口。
我作为分管海外商务与医疗平台的副总裁，有权决定研发数据与离岸联合实验室的技术合作！

关于你指责我是在 [[掩盖期权非法套现亏空]] 甚至企图 [[私自导出奇美拉临床试验数据]] 的无端猜测，我已经向董事会提出严重警告。
周五前必须交出 15 楼数据库的核心访问授权，否则后果自负。

—— 陈建国 (研发副总裁，工号：[[EMP-0003]])
[[16楼高管办公区]]`,
  },

  // 4. 林默工作收件箱：IT运维主管雷暴预警通知
  {
    id: 'mail_005',
    sender: 'zhao.kai@tianyu-tech.com',
    senderName: '赵凯 (IT运维主管)',
    subject: '【运维预警】6月9日夜间特大雷暴天气机房供电与网络应急预案',
    date: '2010-06-09 14:00',
    folder: 'inbox',
    read: true,
    content: `全体系统与安全架构组同事：

据气象台通报，今夜 22:00 至明晨将有特大雷暴。
若发生雷击导致 [[物理切断机房主备光纤]] 或外网中断，[[15楼机房]] 将自动切换至脱机运行模式。

特别提醒：
1. 严禁外部人员使用 [[临时访客卡]] 擅入机房。
2. 机房测试终端 IP 分配为 [[10.0.15.42]]，当班安全人员请务必在岗。

—— [[赵凯]] (IT基础运维组)`,
  },

  // 5. 林默草稿箱：写给宠物医院的咨询信
  {
    id: 'mail_002',
    sender: 'draft@local',
    senderName: '林默 (本地未发送草稿)',
    subject: '咨询：爱犬 Lucky 近期食欲不振及疫苗接种预约',
    date: '2010-06-08 19:40',
    folder: 'drafts',
    read: true,
    content: `尊敬的阳光宠物医院李医生：

您好！我家养的金毛犬 [[lucky]] 最近两天食欲有些减退，精神也不如往日活泼。
我附上了它今天下午在客厅拍的一张近照（详见附件）。

另外想向您预约一下：[[lucky]] 下周三下午是否可以安排第三针疫苗注射？
期待您的回复，非常感谢！

—— 林默 (安全架构部)`,
    attachments: [
      {
        name: 'lucky_dog.jpg',
        type: 'image',
        url: './assets/lucky_dog.jpg',
        size: '922 KB',
      },
    ],
  },

  // 6. 林默回收站：离线安全保险箱密码提示确认函
  {
    id: 'mail_006',
    sender: 'security-daemon@tianyu-tech.com',
    senderName: '天宇内网 安全守护进程',
    subject: '【密保备忘】员工个人离线数据箱 (diary.enc) 凭证重置确认',
    date: '2010-06-05 20:10',
    folder: 'trash',
    read: true,
    content: `【员工个人离线数据安全箱（SafeBox）凭据确认通知】

员工工号：[[EMP-0417]]
员工姓名：[[林默]]

您已成功为本地加密文件 [[diary.enc]] 设定对称解密口令。
您设定的密码提示规则 (Password Hint)：
“【入职年份 4 位数字】 + 【家庭爱宠名字（全小写）】”
（示例格式如：2008kitty，两段无空格直接相连）

请妥善保管该组合密钥，若遗忘请查阅您的入职欢迎邮件与个人草稿备忘。
（本邮件由系统自动发送并已转入归档垃圾箱）`,
  },
];

export const INITIAL_WEB_PAGES: WebPage[] = [
  {
    id: 'page_portal',
    title: '天宇科技官方网站 - 核心团队与企业架构',
    url: 'http://intranet.tianyu-tech.com/about/team',
    category: 'intranet',
    author: '天宇科技企业文化部',
    date: '2010-05-20',
    summary: '天宇科技创始团队、管理高层及核心研发架构师人员名录。',
    keywords: ['天宇科技', '官网', '团队', '林默', '陈建国', '工号', 'EMP-0417', 'EMP-0003', '王思远', '赵凯'],
    bannerImage: './assets/tianyu_logo.jpg',
    avatarImage: './assets/portrait_lin.jpg',
    contentType: 'profile',
    content: `天宇科技（Tianyu Technology）成立于 2002 年，致力于生物医药大数据与临床计算架构。

【管理高层】
● [[陈建国]]（工号：[[EMP-0003]]）：研发副总裁、执行董事。2004 年加入公司，分管海外商务拓展与医疗数据计算平台。
● [[王思远]]：海外商务拓展总监，负责离岸合规业务对接。

【技术与运维核心】
● [[林默]]（工号：[[EMP-0417]]）：基础安全架构师。[[2006]] 年 7 月入职，构建了公司内网加密存储系统与三期临床数据隔离网闸。
● [[赵凯]]：IT基础运维主管，负责机房基础设施与物理线路。`,
  },
  {
    id: 'page_chen_profile',
    title: '高管专栏：副总裁 陈建国 先生离岸合作与数据节点设立',
    url: 'http://intranet.tianyu-tech.com/executives/chen_jianguo',
    category: 'intranet',
    author: '董秘办公室',
    date: '2010-04-12',
    summary: '陈建国副总裁主导海外跨国医疗战略合作与离岸资产管理。',
    keywords: ['陈建国', '副总裁', '海外', 'IP', '空壳公司', 'Aegis', '198.51.100.24'],
    bannerImage: './assets/portrait_chen.jpg',
    contentType: 'article',
    content: `陈建国先生于 2004 年加入天宇科技。

作为海外数据外包业务的主导者，陈建国先生暗中通过离岸咨询实体（Aegis Biotech Capital）在境外设立了专用数据对接中继节点，其指定专用服务器 IP 为：[[198.51.100.24]]。

近期，陈建国多次试图将三期临床数据移交该节点，但遭到安全架构部 [[林默]] 的极力阻拦。曾有传言称外部竞争对手试图 [[窃取二期动物毒理实验报告]]，实则为掩盖海外数据交易的烟雾弹。`,
  },
  {
    id: 'page_chimera',
    title: '【绝密】奇美拉（Project Chimera）三期临床试验技术规范与归档通告',
    url: 'http://research.tianyu-tech.com/confidential/chimera_phase3',
    category: 'intranet',
    author: '天宇生物医药前沿实验室',
    date: '2010-06-05',
    summary: '奇美拉三期临床试验核心患者数据集存储规范与加密策略。',
    keywords: ['奇美拉', 'Project Chimera', '临床试验', '受试者', '绝密', '数据', '导出', 'chimera_v3_patient_data.tar.gz', 'chimera_phase2_summary.doc'],
    bannerImage: './assets/confidential_chimera.jpg',
    contentType: 'article',
    content: `【文件密级：绝密 TOP SECRET】

项目代号：奇美拉（Project Chimera）
临床阶段：Phase III 多中心双盲对照试验

一、 数据资产定义：
包含 1,200 名神经靶向药物临床受试患者的全基因测序及生理指标，核心加密归档文件名为 [[chimera_v3_patient_data.tar.gz]]。
普通脱敏二期总结文件为 [[chimera_phase2_summary.doc]]。

二、 安全管控规则：
所有核心三期数据物理存放于 [[15楼机房]] 独立阵列柜。严禁通过外网导出！
任何未经伦理委员会及安全架构师授权的 [[私自导出奇美拉临床试验数据]] 行为，均构成重大刑事犯罪！`,
  },
  {
    id: 'page_access_log',
    title: '天宇大厦内网安防系统 - 2010-06-09 门禁出入流水记录',
    url: 'http://security.tianyu-tech.com/logs/gate/20100609',
    category: 'intranet',
    author: '安保与物业监控中心',
    date: '2010-06-10 00:30',
    summary: '2010年6月9日晚间（暴雨当夜）大厦各出入口及敏感机房门禁刷卡打卡记录。',
    keywords: ['出勤系统', '门禁记录', '打卡', '出勤', '门禁', '23:35', '22:15', '23:10', '23:55', '1楼门禁', '15楼机房', '张伟'],
    contentType: 'log_table',
    content: `2010年6月9日 晚间 22:00 - 24:00 关键门禁闸机出入流水：`,
    tableData: [
      { time: '22:15:20', person: '林默 (EMP-0417)', location: '8F 研发部大门', action: '刷卡进入' },
      { time: '23:10:05', person: '陈建国 (EMP-0003)', location: '16楼高管办公区', action: '刷卡离开' },
      { time: '23:20:18', person: '林默 (EMP-0417)', location: '15楼机房', action: '刷卡进入' },
      { time: '23:35:10', person: '陈建国 (EMP-0003)', location: '1楼门禁', action: '刷卡离开（显示离厦）' },
      { time: '23:36:40', person: '张伟 (安保巡更)', location: '1F 主大堂', action: '巡逻签到' },
      { time: '23:55:12', person: '急救医护组', location: '1F 广场', action: '接报进入（坠楼现场）' },
    ],
  },
  {
    id: 'page_security_alert',
    title: '安保部紧急事件通报：2010-06-09 雷暴夜机房异常与监控复核',
    url: 'http://security.tianyu-tech.com/bulletin/20100610-emergency',
    category: 'intranet',
    author: '安保部督察组',
    date: '2010-06-10 04:00',
    summary: '暴雨雷击致外网中断调查报告，附 15 楼机房走廊监控抓拍复核。',
    keywords: ['安保部事件通报', '监控', '断网', '23:38', '23:30', '人影', '机房走廊', '走廊监控', '伪造打卡'],
    bannerImage: './assets/cctv_server_corridor.jpg',
    contentType: 'incident_report',
    content: `【安保部紧急事件调查通报】

事发时间：2010-06-09 [[2010-06-09 23:30]] 至 23:55
气象条件：特大暴雨伴随强雷电，23:30 外部主光缆因雷击中断。

事态初步核查通报：
1. 经调取出入闸机系统，研发副总裁 [[陈建国]]（[[EMP-0003]]）已于 [[2010-06-09 23:35]] 从 [[1楼门禁]] 正常刷卡离厦，当晚未再返回大楼（不在场证明成立）。
2. 安全架构师 [[林默]]（[[EMP-0417]]）于 23:20 独自进入 [[15楼机房]]，机房随后发生严重宕机及全盘数据擦除。
3. 23:55 巡逻安保在 1 楼广场草坪发现林默坠楼身亡。安保部初步定性：疑似林默违规调试导致服务器崩溃后畏罪跳楼或意外失足，排除外部侵害。
4. 机房走廊独立监控抓拍到雷暴断电期间有模糊人影移动，疑似有人曾 [[违规植入键盘记录木马]] 或外部人员违规进入。目前案件已移交司法机关核准结案。`,
  },
];

export const INITIAL_FILESYSTEM: FsFile[] = [
  {
    name: 'readme.txt',
    path: '/home/auditor/readme.txt',
    type: 'file',
    size: 512,
    updatedAt: '2010-06-10 09:00',
    content: `================================================================
CyberOS 1.0 专案电子取证工作站 (Forensic Workstation FA-9021)
案件编号：CASE-20100610-01 (天宇科技林默坠亡案)
================================================================
可用常用指令：
  ls [路径]                     - 列出目录文件
  cat [文件名]                  - 查看文本文件内容
  diff [文件1] [文件2]           - 比对两份日志或文件的异同
  decrypt [文件] -k [密码]       - 解密受保护的数据包
  clear                         - 清屏
  help                          - 显示帮助说明

提示：
- 涉案受害者林默的加密备份位于 /home/auditor/diary.enc
- 服务器日志文件位于 /logs/
- 司法审计中心历史申诉归档位于 /archive/2009/
================================================================`,
  },
  {
    name: 'diary.enc',
    path: '/home/auditor/diary.enc',
    type: 'file',
    size: 2048,
    updatedAt: '2010-06-09 22:45',
    isEncrypted: true,
    encryptedWith: '2006lucky',
    decryptedName: 'diary.txt',
    decryptedContent: `==================== 林默 个人绝密日志 (DECRYPTED) ====================
时间：2010-06-08 23:30
记录人：安全架构师 林默 (EMP-0417)

这几天我审查数据出境网关时，发现了致命的问题——副总裁【陈建国】正在通过未授权通道将【奇美拉临床试验数据】打包准备卖给境外的 Aegis 财团！
昨天下午我当面找他对质，陈建国脸色极其阴沉，直接威胁我：“林默，别拿你的职业前途甚至性命开玩笑。”

我预感到他近期一定会动手抹除痕迹。
由于今晚有特大雷暴预警，很可能会发生断网故障，这正是他潜入【15楼机房】强行格式化本地主服务器的最佳时机！

为了防范未然，我暗中在内网底层配置了全双工远端镜像审计脚本：
● 本地主服务器常规日志保存在：/logs/server_local.log
● 远端物理镜像脱机备份保存在：/logs/remote_mirror.bak

即便陈建国偷用我的【Root权限密钥】（admin_lin）将本地数据库和 server_local.log 清空，远端的 remote_mirror.bak 依然会完整记录他在 15 楼机房通过境外 IP 传输数据和擦除磁盘的操作流水！

后来的审计员同志：如果我遭遇不测，请在终端使用 diff 比对这两个日志文件，必定能锁定陈建国盗用 Root 权限格式化服务器并转移数据的铁证！
======================================================================`,
  },
  {
    name: 'server_local.log',
    path: '/logs/server_local.log',
    type: 'file',
    size: 1420,
    updatedAt: '2010-06-09 23:45',
    content: `[2010-06-09 23:15:00] INFO  [daemon] Cluster heartbeat OK - 16 nodes online
[2010-06-09 23:20:18] INFO  [access] User 'lin_mo' badge accessed 15F Server Room door
[2010-06-09 23:25:01] INFO  [auth] Console login: user 'lin_mo' from terminal tty1
[2010-06-09 23:30:14] WARN  [network] Physical uplink disconnected due to lightning strike storm
[2010-06-09 23:35:00] INFO  [cron] Scheduled snapshot job started
[2010-06-09 23:35:02] -- [LOG WIPE DETECTED: DISK SECTORS CORRUPTED / ZEROED] --
[2010-06-09 23:45:00] FATAL [kernel] System stopped abnormally`,
  },
  {
    name: 'remote_mirror.bak',
    path: '/logs/remote_mirror.bak',
    type: 'file',
    size: 2890,
    updatedAt: '2010-06-09 23:42',
    content: `[2010-06-09 23:15:00] INFO  [daemon] Cluster heartbeat OK - 16 nodes online
[2010-06-09 23:20:18] INFO  [access] User 'lin_mo' badge accessed 15F Server Room door
[2010-06-09 23:25:01] INFO  [auth] Console login: user 'lin_mo' from terminal tty1
[2010-06-09 23:30:14] WARN  [network] Physical uplink disconnected due to lightning strike storm
[2010-06-09 23:35:00] INFO  [cron] Scheduled snapshot job started
[2010-06-09 23:38:22] WARN  [access] Physical override: Emergency rack door forced open by keycard EMP-0003 (陈建国)
[2010-06-09 23:39:45] ALERT [sec] Stolen root credentials injected: session 'admin_lin' (Root权限密钥) hijacked!
[2010-06-09 23:40:12] CRITICAL [data_exfil] Unauthorized socket connection opened to overseas IP 198.51.100.24:8443
[2010-06-09 23:40:18] CRITICAL [data_exfil] Pushing secret package 'chimera_v3_patient_data.tar.gz' (Size: 4.8GB, Checksum: e99a8b12) -> COMPLETE
[2010-06-09 23:40:48] CRITICAL [system_sabotage] Command 'dd if=/dev/zero of=/dev/sda bs=1M && rm -rf /logs/server_local.log' executed by admin_lin
[2010-06-09 23:41:00] FATAL [sys] Local database completely wiped and formatted by perpetrator!`,
  },

  // 司法审计中心 本地历史归档案卷 (2009年度) - 本地常驻案卷库
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
];

export const DEDUCTION_SOLUTION = {
  slotA: '陈建国', // 真凶姓名
  slotB: '2010-06-09 23:40', // 作案时间点
  slotC: '盗用Root权限密钥格式化服务器', // 关键作案手段
  slotD: '私自导出奇美拉临床试验数据', // 核心违法动机
};
