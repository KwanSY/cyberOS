# 《无名之城：数字幽灵》(CyberOS 1.0) - 第一章：暴雨夜的断网事故

> 一款基于 2010 年代复古操作系统、纯前端确定性状态机与多模态物证推演的沉浸式**数字法医侦探解谜游戏**。

---

## 📖 故事背景

2010年6月10日清晨，天宇科技（中国）有限公司大厦 1 楼广场发现基础安全架构师**林默**坠亡。
官方通报称其因“特大暴雨断网导致系统瘫痪、工作压力过大情绪失控”而轻生跳楼。

作为受命介入的特别督查组数字法医审计员（代号：`FA-9021`），你接入了林默生前遗留的涉案工作站镜像。
在这台搭载 **CyberOS 1.0** 的系统内，隐藏着未加密的内网信件、脱机日志、被格式化的数据库碎片以及被刻意抹去的境外数据传输铁证……

---

## 🎮 核心系统与功能

1. **拟真复古开机与身份公文系统 (Onboarding)**
   - BIOS 硬件自检与内存检测滚屏动画
   - 数字法医 FA-9021 身份安全验证
   - 《CASE-20100610-01 案卷调阅与系统审计令》签署流程
   - 顶部常驻【当前调查目标 (Active Objective)】阶段指引信标条（4 阶段动态推进）

2. **虚拟桌面与多窗口操作系统 (CyberOS 1.0 Shell)**
   - 多窗口拖拽、视口智能吸附、缩放、聚焦置顶与最小化任务栏
   - 包含 **MailBox (邮件终端)**、**NetQuery (档案浏览器)**、**CyberTerminal (取证终端)**、**DeductionBoard (定罪看板)**、**Trash (回收站)**、**SystemInfo (系统信息)**

3. **双通道邮件终端 (MailBox)**
   - **专案安全通道**：接收来自匿名线人 `Zero` 的绝密线报
   - **工作站内部邮箱**：包含天宇科技 HR 入职记录、副总裁陈建国的强硬通牒、IT 运维主管的雷暴应急通知、林默写给宠物医院咨询爱犬 `lucky` 的草稿与照片附件

4. **内网检索与动态词块提取 (NetQuery & Word Bank)**
   - 支持多关键词检索公司官网、高管专栏、二期/三期绝密技术规范、门禁流水记录与安保部通报
   - 支持点击/划词高亮实体提取至【词块备忘库】，配合丰富逼真的干扰项（迷惑人物、伪造时间点、假手段动机）

5. **极简取证终端 (CyberTerminal)**
   - 支持 `help`, `ls`, `cat`, `diff`, `decrypt [文件] -k [密码]`, `clear`
   - 通过破译对称加密日记（`decrypt diary.enc -k 2006lucky`）获取林默生前绝密日志
   - 通过 `diff /logs/server_local.log /logs/remote_mirror.bak` 比对脱机镜像，彩色高亮锁定真凶抹除的境外中继 IP 与被格式化的核心三期数据

6. **证据看板与公文定罪终审 (Deduction Board)**
   - 四大核心定罪槽位（主谋定性、作案时间点、破坏手段、犯罪动机）
   - 常驻底部操作栏，支持拖拽填词与点击选择
   - 提交定罪审查触发落章音效、暗红公章归档判定与通关结算

7. **视听拟真层 (Web Audio API & CRT)**
   - 基于原生 Web Audio API 程序化合成机械键盘敲击、卡片吸附、定罪落章重音与 50Hz CRT 电流底噪
   - 纯 CSS CRT 扫描线遮罩、暗角与荧光呼吸效果

---

## 🛠️ 技术栈

- **Core**: React 18, TypeScript, Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Effects**: Canvas Confetti, Web Audio API

---

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/KwanSY/cyberOS.git
cd cyberOS

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 📁 目录结构

```
cyberOS/
├── public/
│   └── assets/              # 本地化多模态物证图像（工牌、监控抓拍、绝密公文等）
├── src/
│   ├── components/
│   │   ├── apps/            # Mail, Browser, Terminal, Deduction, Trash, SystemInfo
│   │   ├── common/          # WordPickupTag, TextWithKeywords
│   │   ├── desktop/         # TopStatusBar, Taskbar, Desktop
│   │   ├── effects/         # CrtOverlay
│   │   ├── onboarding/      # BiosBootScreen, IdentityAuthModal, AuditWarrantModal
│   │   ├── victory/         # VictoryModal
│   │   └── window/          # WindowFrame
│   ├── data/
│   │   └── chapter1Seed.ts  # 第一章全部物证数据、邮件、网页与谜题图谱
│   ├── services/
│   │   └── soundService.ts  # Web Audio API 程序化声音合成引擎
│   ├── store/
│   │   └── useGameStore.ts  # 全局 Zustand 确定性状态机
│   ├── types/
│   │   └── game.ts          # 完整的 TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## ⚖️ 许可说明

本项目仅供学习、交流与数字取证解谜游戏设计展示使用。
