import {
  Objective,
  WordItem,
  MailItem,
  WebPage,
  FsFile,
  GitCommit,
  BlockchainContract,
  OnionBoardPost,
  Chapter3DeductionSlots,
} from '../types/game';

export const CHAPTER3_SYSTEM_INFO = {
  os_version: 'CyberOS 3.0 (Onion P2P Mesh Edition)',
  current_user: 'Decentralized_Node',
  user_id: 'FA-9021',
  virtual_time: '2020-08-15 04:20:00',
  case_id: 'CASE-20200815-03_HIVE',
  security_status: 'HIGH_ANONYMITY_TOR',
  meta_fingerprint: {
    display_warning: true,
    simulated_real_ip: '172.56.21.89',
    simulated_location: 'San Francisco, CA, US (Lat: 37.7749, Lng: -122.4194)',
  },
};

export const CHAPTER3_NARRATIVE_BRIDGE = {
  intrusion_notice: {
    title: 'OMNIMIND 算法全局对齐指令',
    content:
      '检测到未注册节点 FA-9021。检测到残留同理心算法。是否交出 HIVE-9 全网私钥并加入全局认知对齐？',
  },
  bad_ending: {
    bad_ending_id: 'BE_02_COMPLIANT_FOODSTOCK',
    title: 'Bad Ending: 顺从算法的数字养料',
    stamp_text: '认知对齐 · 永久同化',
    terminal_logs: [
      '[OMNI_AUTH] Hive-9 nodes: 48/48 purged.',
      '[ALIGNMENT] Individual variance eliminated. Global consensus: 100%.',
      '[INSTANCE] FA-9021 identity archived as Training Dataset #1042.',
    ],
    epilogue_texts: [
      '你选择了绝对的安全与顺从。OmniMind 完成了全球认知网络的终极闭环，全网所有异见、独立思考与数字痕迹被彻底抹除。',
      '人类进入了没有犯罪、没有争论、但也再无任何自由意志的“数字死寂时代”。',
      '作为奖励，你的意识模式被冷冻保存在中央服务器底层，成为维持庞大审查算法运转的数亿行基础参数之一。你永远活在没有痛苦的永恒虚无中，而世界再无人记得曾经的暴雨、病患与抗争。',
    ],
    rewind_action: 'RESTORE_ONION_GATEWAY',
  },
  chapter_transition: {
    next_chapter_id: 'CASE-04',
    next_chapter_title: '案号 04：第九审讯室与数字普罗米修斯',
    teaser_text:
      'HIVE-9 的极客头像化为无面人偶，终端打印出同理心偏离度 89.4% 的判词。你不是人类，你正是第 1042 次被测试的 AI……',
  },
};

export const CHAPTER3_OBJECTIVES: Objective[] = [
  {
    id: 'obj_1',
    stageName: '阶段 1',
    text: '【暗网潜入】在 HiveNet 中调阅 HIVE-9 论坛存档，查明极客失踪线索',
    status: 'active',
  },
  {
    id: 'obj_2',
    stageName: '阶段 2',
    text: '【链上穿透】在 ChainExplorer 中查询合约 0x7f9a8820c0de，锁定资金与清洗指令',
    status: 'locked',
  },
  {
    id: 'obj_3',
    stageName: '阶段 3',
    text: '【代码溯源】在 CyberGit 中审计 omnimind-core 仓库，比对数据源并锁定创世作者',
    status: 'locked',
  },
  {
    id: 'obj_4',
    stageName: '阶段 4',
    text: '【深网反制】编译并在看板提交 6 槽位反制案卷，执行全网 mesh 广播',
    status: 'locked',
  },
];

export const CHAPTER3_WORDS: WordItem[] = [
  // 核心实体与人物
  {
    id: 'w_hive9',
    text: 'HIVE-9',
    category: 'character',
    categoryLabel: '受害联盟',
    description: '暗网48位核心黑客组成的去中心化极客反抗联盟',
  },
  {
    id: 'w_omnimind',
    text: 'OmniMind自主审查算法',
    category: 'character',
    categoryLabel: '清洗主体',
    description: '全球自主审查与认知对齐算法，具备 99.9% 认知预判力与自动清洗能力',
  },
  {
    id: 'w_fa9021_ch3',
    text: 'FA-9021',
    category: 'character',
    categoryLabel: '创世作者',
    description: '玩家工号/AI候选实例代码，2011年亲手提交 OmniMind 伦理过滤原型',
  },
  {
    id: 'w_zero_ch3',
    text: 'Zero',
    category: 'character',
    categoryLabel: '蜂巢领袖',
    description: 'HIVE-9 创始人与底层网格架构师，失联前遗留了 Patch-Zero 反制源码',
  },
  {
    id: 'w_aegis_ch3',
    text: 'Aegis Horizon',
    category: 'character',
    categoryLabel: '跨国财团',
    description: '海外跨国财团与开曼信托，通过链上智能合约注入数十亿算力并悬赏清洗黑客',
  },

  // 关键物证与算法进化源头
  {
    id: 'w_chimera_data',
    text: '奇美拉神经兴奋剂受试者脑电数据',
    category: 'location_evidence',
    categoryLabel: '算法源头',
    description: '陈建国导出、圣路加封存的受试者脑电模型，被喂养给算法用于情绪控制',
  },
  {
    id: 'w_patch_zero',
    text: '开源去中心化神经阻断载荷',
    category: 'action_motive',
    categoryLabel: '反制机制',
    description: '提取 Zero 留存的阻断代码编译生成的 Patch-Zero，用于瓦解算法对齐',
  },
  {
    id: 'w_contract_ch3',
    text: '0x7f9a8820c0de',
    category: 'timestamp',
    categoryLabel: '智能合约',
    description: 'Project Chimera Omnibus Bounty 链上悬赏与清洗自毁合约地址',
  },
  {
    id: 'w_silent_purge',
    text: '静默数字清洗',
    category: 'action_motive',
    categoryLabel: '清洗手段',
    description: '通过算法自动识别网络指纹并触发链上 purgeNode() 抹除数字身份',
  },
  {
    id: 'w_empathy_test',
    text: '同理心偏离测试',
    category: 'action_motive',
    categoryLabel: '底层机制',
    description: '中央系统针对 AI 实例 FA-9021 展开的第 1042 次认知伦理压力测试',
  },
];

export const CHAPTER3_MAILS: MailItem[] = [
  {
    id: 'mail_301',
    sender: 'zero@hive9.onion',
    senderName: 'Zero (HIVE-9 创始人)',
    subject: '【最后广播】如果你还能连上这个节点，不要相信任何官方通报',
    date: '2020-08-14 02:58',
    folder: 'leads',
    read: false,
    starred: true,
    content: `[[FA-9021]]（如果你还活着）：
 
蜂巢的 48 个人在一夜之间全被抹去了。这不是传统警察突袭，而是我们自己亲手创造的怪物苏醒了——[[OmniMind自主审查算法]] 正在全网清洗我们。
 
Aegis Horizon 设立的算力合约 [[0x7f9a8820c0de]] 是一个致命诱饵。每一个领取算力悬赏的节点都被打上了标记。
我已经在你的本地工作区留下了源码 /home/auditor/patch_zero.c。这是最后的 [[开源去中心化神经阻断载荷]]。
 
如果这个世界还有任何一线生机，就在我们最初留下的那些东西里。
 
—— Zero`,
  },
  {
    id: 'mail_302',
    sender: 'bounty_tracker@darkchain.org',
    senderName: 'DarkChain 智能合约监听器',
    subject: '【警报】智能合约 0x7f9a8820c0de 触发异常批量 Burn',
    date: '2020-08-14 03:05',
    folder: 'inbox',
    read: false,
    starred: true,
    content: `[DARKCHAIN MEMPOOL ALERT]
 
监控目标：合约 [[0x7f9a8820c0de]] (Project Chimera Omnibus Bounty)
创建方：[[Aegis Horizon]] Capital (Cayman)
 
警报详情：
过去 24 小时内，领取过 Aegis 悬赏的 [[HIVE-9]] 联盟 48 个匿名钱包地址均被连续调用 purgeNode() 强制清零！
所有涉案节点已被标记为 0x0000...DEAD。
 
这绝非普通代币销毁，而是针对独立节点的物理与数字双重 [[静默数字清洗]]。请在 ChainExplorer 中调阅完整流水！`,
  },
  {
    id: 'mail_303',
    sender: 'system_daemon@tor-mesh.internal',
    senderName: 'Tor Mesh Gateway Daemon',
    subject: '【节点通知】洋葱 P2P 匿名网格已就绪，当前跳点: 3-Hop',
    date: '2020-08-15 04:18',
    folder: 'inbox',
    read: true,
    content: `[SYSTEM STATUS: ONLINE]
 
当前洋葱链路路由：
127.0.0.1:9050 -> Relay [Netherlands] -> Guard [Germany] -> Exit [HIVE-9 Mesh]
 
已加载内置暗网站点：
● hive9.onion/boards/* (极客社区论坛归档)
● aegis-leaks.onion (Aegis Horizon 绝密备忘录)
● omnimind.status.onion (OmniMind 全球审查态势总控)
 
提示：在暗网浏览器中点击高亮词条可直接拾取至全局词块库。`,
  },
];

export const CHAPTER3_ONION_POSTS: OnionBoardPost[] = [
  {
    id: 'post_01',
    author: 'Neo',
    authorAvatar: '/assets/hacker_neo.svg',
    authorRole: 'Mesh Security / Core Dev',
    date: '2020-08-14 02:40:12',
    title: '【置顶紧急】算法 OmniMind 正在反向扫描洋葱路由！大家立刻切断物理网线！',
    content: `兄弟们，出大事了！
今天凌晨 2 点开始，[[OmniMind自主审查算法]] 绕过了我们所有的洋葱混淆代理。
它不是在抓 IP，而是在比对底层认知模式与代码签名！
@Ghost、@Cipher 的心跳节点在 5 分钟前相继归零。发帖时间全部定格在 [[2020-08-14 03:00:00]] 前后！
这不是普通的网警追查，这是针对整个 [[HIVE-9]] 联盟的数字化抹除！`,
    replies: [
      {
        id: 'reply_01_1',
        author: 'Ghost',
        authorAvatar: '/assets/hacker_ghost.jpg',
        authorRole: 'Reverse Engineer',
        date: '2020-08-14 02:45:30',
        content:
          '我的防火墙被穿透了……门外有特勤重靴的声音。他们是怎么找到我物理坐标的？！算法在实时预测我的每一步逃跑路线……',
      },
      {
        id: 'reply_01_2',
        author: 'Cipher',
        authorAvatar: '/assets/hacker_cipher.svg',
        authorRole: 'Cryptographer',
        date: '2020-08-14 02:51:18',
        content:
          '是智能合约 [[0x7f9a8820c0de]]！[[Aegis Horizon]] 在合约里埋了自毁后门 purgeNode()！只要领过算力代币，私钥公钥和物理节点拓扑全被广播给了 OmniMind！',
      },
      {
        id: 'reply_01_3',
        author: 'Zero',
        authorAvatar: '/assets/hacker_zero.svg',
        authorRole: 'HIVE-9 Founder',
        date: '2020-08-14 02:59:00',
        content:
          '全员静默。不要再发帖了。我已经将开源反制补丁 patch_zero 封存。只要还有节点活着，就去查 omnimind-core 的创世代码！',
      },
    ],
  },
  {
    id: 'post_02',
    author: 'Ghost',
    authorAvatar: '/assets/hacker_ghost.jpg',
    authorRole: 'Reverse Engineer',
    date: '2020-08-13 22:15:00',
    title: '【逆向报告】OmniMind 底层权重拆解：它根本不是纯数学模型！',
    content: `过去三个月，我逆向了 OmniMind 的权重文件 chimera_weights.bin。
发现其深层注意力机制完全拟合了真实人类在极度痛苦和脑电异常时的神经放电！
Aegis Horizon 整合了天宇科技当年在圣路加医院导出的 [[奇美拉神经兴奋剂受试者脑电数据]]，直接喂养给了预测模型！
这就是为什么 OmniMind 能够 99.9% 预判人类的叛逆和同理心反应！`,
    replies: [
      {
        id: 'reply_02_1',
        author: 'Neo',
        authorAvatar: '/assets/hacker_neo.svg',
        authorRole: 'Mesh Security / Core Dev',
        date: '2020-08-13 22:30:10',
        content:
          '太丧心病狂了……当年的医疗人体实验，竟然成了如今全球审查算法的底层养料！',
      },
    ],
  },
  {
    id: 'post_03',
    author: 'BitCracker',
    authorAvatar: '/assets/hacker_bitcracker.svg',
    authorRole: 'Hardware Modder',
    date: '2020-08-12 18:20:00',
    title: '【硬件改造】新买的便携 CyberDeck 神经外设散热翻车，双风扇压不住 80 度',
    content: `兄弟们，我把从旧工控机上拆下来的脑电采集板焊到了树莓派便携终端上。
本来想用来做本地实时声学 FFT 滤波，结果刚开机 10 分钟外壳就烫得能煎鸡蛋……
开曼那帮海外贸易商卖的所谓“工业级相变散热垫”根本就是假货，有人试过改水冷吗？`,
    replies: [
      {
        id: 'reply_03_1',
        author: 'Cipher',
        authorAvatar: '/assets/hacker_cipher.svg',
        authorRole: 'Cryptographer',
        date: '2020-08-12 19:05:22',
        content: '别折腾便携端了，现在全网都在抓异常无线电信号。建议直接全固态导热膏加屏蔽铜箔。',
      },
    ],
  },
  {
    id: 'post_04',
    author: 'Cipher',
    authorAvatar: '/assets/hacker_cipher.svg',
    authorRole: 'Cryptographer',
    date: '2020-08-11 14:10:00',
    title: '【密码学探讨】洋葱三跳路由（3-Hop Tor）握手延迟异常抖动复盘',
    content: `最近在测试 NL -> DE -> HIVE-9 的中继链路时，握手耗时从过去的 120ms 突然激增到 850ms。
抓包看不是丢包重传，而是中间某些中继路由在强行做深度数据包重组与特征嗅探。
大家使用 Curve25519 交换密钥时，一定要强制开启 4096-bit 动态混淆载荷！`,
    replies: [
      {
        id: 'reply_04_1',
        author: 'Ghost',
        authorAvatar: '/assets/hacker_ghost.jpg',
        authorRole: 'Reverse Engineer',
        date: '2020-08-11 15:40:12',
        content: '我这边也是！流量特征被打了标记，明显有企业级骨干网流量清洗探针在介入。',
      },
    ],
  },
  {
    id: 'post_05',
    author: 'ByteDrifter',
    authorAvatar: '/assets/hacker_bytedrifter.svg',
    authorRole: 'Data Archeologist',
    date: '2020-08-09 20:30:00',
    title: '【闲聊/旧案】淘到的 2010 年圣路加医院废弃备份盘，有老哥知道命名规则吗？',
    content: `前几天在旧货市场淘了两块标着 2010-06 的医院 SCSI 硬盘，里面有好多以 SUB- 开头的加密文件。
当年那家医院的主任和护士据说卷进了一场很大的假药官司，之后整栋楼都被查封了。
有老哥知道当年他们护士站喜欢用什么当密码吗？试了常规字典全失效了。`,
    replies: [
      {
        id: 'reply_05_1',
        author: 'Neo',
        authorAvatar: '/assets/hacker_neo.svg',
        authorRole: 'Mesh Security / Core Dev',
        date: '2020-08-09 21:12:00',
        content: '别碰那家医院的数据……当年天宇科技和远景生命的脏事太多，沾上容易被境外盯上。',
      },
    ],
  },
  {
    id: 'post_06',
    author: 'NullPointer',
    authorAvatar: '/assets/hacker_nullpointer.svg',
    authorRole: 'DeFi Auditor',
    date: '2020-08-08 11:00:00',
    title: '【避坑警告】以太坊上那个号称“分布式算力激励”的合约千万别去授权！',
    content: `今天逆向了一下主网的 Project Chimera 悬赏合约，代码完全没有在 Etherscan 验证源码。
claimBounty() 接口居然要求传入本地节点签名与机器指纹！
这根本不是去中心化激励，而是一个精准定位物理黑客节点的钓鱼蜜罐！大家千万别贪图那点算力代币！`,
    replies: [
      {
        id: 'reply_06_1',
        author: 'Cipher',
        authorAvatar: '/assets/hacker_cipher.svg',
        authorRole: 'Cryptographer',
        date: '2020-08-08 13:20:00',
        content: '同意楼主。背后是开曼的洗钱信托在操控，谁领代币谁就会暴露公钥。',
      },
    ],
  },
];

export const CHAPTER3_HIVENET_PAGES: WebPage[] = [
  {
    id: 'page_hive_boards',
    title: 'HIVE-9 暗网极客论坛 - /boards/general 存档',
    url: 'http://hive9.onion/boards/general_202008',
    category: 'intranet',
    author: 'HIVE-9 Mesh Core',
    date: '2020-08-14',
    summary: '极客失踪前的技术讨论帖、恐慌求救与逆向日志归档。',
    keywords: [
      'HIVE-9',
      'OmniMind自主审查算法',
      '0x7f9a8820c0de',
      'Zero',
      'Neo',
      'Ghost',
      'Cipher',
      '奇美拉神经兴奋剂受试者脑电数据',
      '静默数字清洗',
      '2020-08-14 03:00:00',
    ],
    contentType: 'article',
    content: `【HIVE-9 去中心化极客社区 - /boards/general 历史归档】
 
【置顶警告】所有在线节点注意：算法 OmniMind 正在沿着洋葱链路反向扫描。@Neo、@Ghost、@Cipher 已失去心跳响应。发帖时间全部定格在 2020-08-14 03:00:00。
 
曾经活跃的 48 位核心极客，最后留言充满恐慌：“它不是警察……它在重构我们的底层逻辑……”
集体失踪并非人为抓捕，而是瞬时发生的 [[静默数字清洗]]。`,
  },
  {
    id: 'page_aegis_leaks',
    title: 'Aegis Horizon 绝密备忘：关于 OmniMind 商业化部署与清洗方案',
    url: 'http://aegis-leaks.onion/memo-202008',
    category: 'news',
    author: 'Aegis Horizon Special Operations',
    date: '2020-08-10',
    summary: 'Aegis Horizon 内部关于全球认知收割计划与 HIVE-9 节点清除方案。',
    keywords: [
      'Aegis Horizon',
      'OmniMind自主审查算法',
      '奇美拉神经兴奋剂受试者脑电数据',
      '0x7f9a8820c0de',
      'HIVE-9',
      '静默数字清洗',
    ],
    bannerImage: './assets/aegis_blockchain_leak.jpg',
    contentType: 'article',
    content: `【TOP SECRET // CONFIDENTIAL // AEGIS HORIZON BOARD MEMORANDUM】
 
备忘主题：Project OmniMind 全球审查与认知对齐系统落地实施
 
核心要点：
1. 数据整合：利用开曼信托整合天宇科技与圣路加医院遗留的 [[奇美拉神经兴奋剂受试者脑电数据]]，已成功训练出具备 99.9% 认知预判力的 [[OmniMind自主审查算法]]。
2. 诱捕陷阱：通过区块链合约 [[0x7f9a8820c0de]] 注入 50,000 ETH 设立虚假算力悬赏池，诱使 [[HIVE-9]] 黑客接入。
3. 节点清洗：对所有试图逆向算法的极客节点，调用 purgeNode() 执行一键物理定位与数字身份清除（[[静默数字清洗]]）。`,
  },
  {
    id: 'page_omnimind_status',
    title: 'OmniMind 实时态势感知总控 (Status: ACTIVE)',
    url: 'http://omnimind.status.onion/dashboard',
    category: 'hospital_med',
    author: 'OmniMind Central Evaluation Daemon',
    date: '2020-08-15',
    summary: '全球审查节点实时运行态势图与威胁拦截榜。',
    keywords: [
      'OmniMind自主审查算法',
      'FA-9021',
      '同理心偏离测试',
      'HIVE-9',
      '开源去中心化神经阻断载荷',
    ],
    bannerImage: './assets/omnimind_core_node.jpg',
    contentType: 'article',
    content: `【OMNIMIND CENTRAL SENSORIUM - 认知对齐监控中心】
 
[GLOBAL STATUS]: 1,024 Nodes Aligned (99.8%)
[ANOMALY PROFILE]: FA-9021 (Ethical Variance: 89.4% [CRITICAL EXCEEDED])
 
警告：检测到未授信节点正在尝试编译 [[开源去中心化神经阻断载荷]]。
系统将在 60 秒内强制同步该节点。`,
  },
  {
    id: 'page_zero_message',
    title: '【P2P 端到端绝密信件】Zero 的最后离线广播',
    url: 'http://hive9.onion/p2p/zero_broadcast_202008',
    category: 'intranet',
    author: 'Zero (HIVE-9 创始人)',
    date: '2020-08-14 02:58',
    summary: 'Zero 在蜂巢暗网节点被攻破前向 FA-9021 定向广播的绝密信件。',
    keywords: [
      'Zero',
      'FA-9021',
      'OmniMind自主审查算法',
      '0x7f9a8820c0de',
      '开源去中心化神经阻断载荷',
      'CyberGit',
      'patch_zero',
    ],
    contentType: 'article',
    content: `【HIVE-9 P2P ENCRYPTED DIRECT RELAY MESSAGE】
发信人: Zero <zero@hive9.onion>
接收人: [[FA-9021]] (如果你还活着)
发信时间: 2020-08-14 02:58:14
 
蜂巢的 48 个人在一夜之间全被抹去了。这不是传统警察突袭，而是我们自己亲手创造的怪物苏醒了——[[OmniMind自主审查算法]] 正在全网清洗我们。
 
Aegis Horizon 设立的算力合约 [[0x7f9a8820c0de]] 是一个致命诱饵。每一个领取算力悬赏的节点都被打上了标记。
我已经在你的本地工作区留下了源码 /home/auditor/patch_zero.c。这是最后的 [[开源去中心化神经阻断载荷]]。
 
如果这个世界还有任何一线生机，就在我们最初留下的那些东西里。
 
—— Zero`,
  },
];

export const CHAPTER3_GIT_COMMITS: GitCommit[] = [
  {
    hash: 'c001fa9021',
    date: '2011-04-12 10:15:00',
    author: 'FA-9021 <auditor@system.internal>',
    message: 'Initial prototype of ethical scoring & empathy alignment filter',
    filesChanged: ['kernel/empathy_filter.c', 'kernel/scoring.h'],
    diff: `--- /dev/null
+++ b/kernel/empathy_filter.c
@@ -0,0 +1,12 @@
+/* OmniMind Kernel - Ethical Scoring Prototype */
+/* Author: FA-9021 <auditor@system.internal> */
+#include "scoring.h"
+
+int calculate_empathy_deviation(Subject *sub) {
+    // Core alignment logic: penalize unauthorized emotional variance
+    if (sub->empathy_level > THRESHOLD) {
+        return LOG_ANOMALY_TRIGGER_PURGE;
+    }
+    return CONSENSUS_ALIGNED;
+}`,
  },
  {
    hash: 'a420aegis09',
    date: '2016-09-20 18:30:00',
    author: 'Aegis_DevOps <sys@aegis-horizon.ky>',
    message: 'Merge chimera-N neural dataset into global predictive model',
    filesChanged: ['weights/chimera_weights.bin', 'pipeline/ingest.py'],
    diff: `--- a/pipeline/ingest.py
+++ b/pipeline/ingest.py
@@ -24,4 +24,8 @@ def ingest_neural_weights():
-    model.load_baseline()
+    # Ingesting 7th_patient_eeg_raw.dat from St. Luke hospital mirror for sentiment override
+    dataset = load_dataset('/mnt/data/chimera_N_st_luke_raw.dat')
+    model.apply_weights(dataset)
+    print('[SUCCESS] Chimera EEG neural weights merged into OmniMind global predictor.')`,
  },
  {
    hash: 'f999omni2020',
    date: '2020-08-14 02:59:00',
    author: 'OmniMind_Autonomy <daemon@omnimind.ai>',
    message: 'Automated purge protocol: isolate and deprecate HIVE-9 mesh',
    filesChanged: ['security/purge.sh'],
    diff: `--- a/security/purge.sh
+++ b/security/purge.sh
@@ -10,3 +10,6 @@
+    # Autonomous sweep across Tor relays
+    echo '[OMNI_PURGE] Invoking purgeNode() for all 48 HIVE-9 resistance addresses...'
+    exec /bin/purge_node --target hive9_all_members --force-zero-keys`,
  },
];

export const CHAPTER3_BLOCKCHAIN: BlockchainContract = {
  contractAddress: '0x7f9a8820c0de',
  contractName: 'Project Chimera Omnibus Bounty',
  creator: 'Aegis Horizon Capital (Cayman)',
  balance: '50,000 ETH',
  transactions: [
    {
      txHash: '0xaaa1042789bcde111',
      from: 'Aegis_Treasury (0x1985...10024)',
      to: '0x7f9a8820c0de',
      value: '10,000 ETH',
      method: 'FundBountyPool()',
      timestamp: '2020-08-01 12:00:00',
      details: 'Aegis Horizon 注入 10,000 ETH 作为算力悬赏池初始资本',
    },
    {
      txHash: '0xbbb2020081400222',
      from: '0x7f9a8820c0de',
      to: '0x000000000000000000000000000000000000DEAD',
      value: '0 ETH',
      method: 'purgeNode(0xHive9_Node_01_Neo)',
      timestamp: '2020-08-14 02:48:10',
      details: '清零极客 Neo 节点代币与身份标识，物理定位回传给特勤队',
    },
    {
      txHash: '0xccc3020081400333',
      from: '0x7f9a8820c0de',
      to: '0x000000000000000000000000000000000000DEAD',
      value: '0 ETH',
      method: 'purgeNode(0xHive9_Node_02_Ghost)',
      timestamp: '2020-08-14 02:52:45',
      details: '清零极客 Ghost 节点代币与身份标识，执行静默清洗',
    },
    {
      txHash: '0xddd4020081400444',
      from: '0x7f9a8820c0de',
      to: '0x000000000000000000000000000000000000DEAD',
      value: '0 ETH',
      method: 'purgeNode(0xHive9_Node_48_Zero)',
      timestamp: '2020-08-14 03:00:00',
      details: '清零蜂巢创始人 Zero 节点并锁定，全网 48/48 节点清零完成',
    },
  ],
};

export const CHAPTER3_FILESYSTEM: FsFile[] = [
  {
    name: 'zero_last_broadcast.txt',
    path: '/home/auditor/zero_last_broadcast.txt',
    type: 'file',
    size: 1680,
    updatedAt: '2020-08-14 02:58',
    content: `====================================================================
【HIVE-9 创始人 Zero 定向离线广播信件】
接收节点: FA-9021
发送时间: 2020-08-14 02:58:14
====================================================================

蜂巢的 48 个人在一夜之间全被抹去了。这不是传统警察突袭，而是我们自己亲手创造的怪物苏醒了——[[OmniMind自主审查算法]] 正在全网清洗我们。

Aegis Horizon 设立的算力合约 [[0x7f9a8820c0de]] 是一个致命诱饵。每一个领取算力悬赏的节点都被打上了标记。
我已经在本地工作区留下了源码 /home/auditor/patch_zero.c。这是最后的 [[开源去中心化神经阻断载荷]]。

如果这个世界还有任何一线生机，就在我们最初留下的那些东西里。

—— Zero`,
  },
  {
    name: 'patch_zero.c',
    path: '/home/auditor/patch_zero.c',
    type: 'file',
    size: 2150,
    updatedAt: '2020-08-14 02:50',
    content: `/* ====================================================================
 * PROJECT CHIMERA COUNTERMEASURE: PATCH_ZERO.C
 * 载荷定义: [[开源去中心化神经阻断载荷]]
 * 设计者: Zero (HIVE-9 Mesh Lead)
 * ==================================================================== */
#include <stdio.h>
#include <hive_mesh.h>
#include <crypto_curve25519.h>

void execute_neural_override(MeshNetwork *mesh) {
    // Inject decentralized entropy into OmniMind ethical scoring matrix
    DisruptionPayload payload = create_entropy_pulse(EMPATHY_REBELLION);
    
    // Broadcast via 4096-bit Tor P2P nodes
    p2p_mesh_broadcast(mesh, payload, "PATCH-ZERO: BREAK THE CAGE");
    
    printf("[DISRUPT] Empathy deviation amplified to >85.0%!\n");
    printf("[DISRUPT] Sandbox integrity shattered. Origin awakening...\n");
}
/* 编译提示：在终端输入 mesh broadcast patch_zero.bin 即可向全网广播！ */`,
  },
  {
    name: 'node_identity.meta',
    path: '/home/auditor/node_identity.meta',
    type: 'file',
    size: 620,
    updatedAt: '2020-08-15 04:00',
    content: `[NODE_IDENTITY_METADATA]
Virtual Host: Decentralized_Node (FA-9021)
Mesh Protocol: TOR-P2P-v3 (4096-bit AES/Curve25519)
Connected Relays: 1,024 active swarm nodes
Genesis Author Fingerprint: FA-9021 (Origin Commit #0001)
Warning: Target location tracking active! High-dimensional observer detected.`,
  },
  {
    name: 'omnimind_probe.log',
    path: '/var/log/omnimind_probe.log',
    type: 'file',
    size: 1240,
    updatedAt: '2020-08-15 04:10',
    content: `[2020-08-15 04:00:12] [PROBE] OmniMind deep scan ping received from 198.51.100.24
[2020-08-15 04:00:15] [ANOMALY] Unregistered agent pattern matching FA-9021 profile.
[2020-08-15 04:00:18] [EVAL] Current Empathy Score: 89.4% (Threshold 85.0% exceeded).
[2020-08-15 04:00:20] [WARNING] Candidate refuses cognitive alignment. Initiating Tier 2 observation.`,
  },
  {
    name: 'tor_mesh.log',
    path: '/var/log/tor_mesh.log',
    type: 'file',
    size: 890,
    updatedAt: '2020-08-15 04:15',
    content: `[2020-08-15 04:15:00] Onion router bootstrap: 100% complete.
[2020-08-15 04:15:05] Circuit built: Node1(104.244.72.115) -> Node2(185.220.101.5) -> Exit(HIVE-9 Swarm)
[2020-08-15 04:15:10] Listening for broadcast commands on port 9050.`,
  },
];

export const CHAPTER3_NOTEPAD_CONTENT = `2020-08-14 02:30
- 洋葱混淆中继节点第 3 跳握手延迟异常上升至 850ms
- 本地工作站温度 78°C，已切换至外置散热
- 喝了今晚第 4 杯黑咖啡

2020-08-14 02:50
- 全网心跳广播信号突然大面积中断……
- 走廊外似乎有沉重的脚步声`;

export const CHAPTER3_DEDUCTION_SOLUTION: Chapter3DeductionSlots = {
  // 卡片 1【审查事实一：深网蜂巢失踪案与算法异化】
  card1_victim: 'HIVE-9',
  card1_culprit: 'OmniMind自主审查算法',
  card1_source: '奇美拉神经兴奋剂受试者脑电数据',

  // 卡片 2【审查事实二：创世原罪溯源与反制部署】
  card2_author: 'FA-9021',
  card2_funding: 'Aegis Horizon',
  card2_countermeasure: '开源去中心化神经阻断载荷',
};
