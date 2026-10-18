import json

with open('heroes_data.json', 'r', encoding='utf-8') as f:
    heroes_data = json.load(f)

# Tarot metadata
tarot_cards = [
    {"id": "fool", "name": "愚者", "en": "The Fool", "num": "0", "icon": "🃏", "color": "#f59e0b", "desc": "新生与初始，无拘无束"},
    {"id": "magician", "name": "魔术师", "en": "The Magician", "num": "I", "icon": "🪄", "color": "#a855f7", "desc": "变化与戏法，创造掌控"},
    {"id": "priestess", "name": "女祭司", "en": "The High Priestess", "num": "II", "icon": "🔮", "color": "#38bdf8", "desc": "内在智慧，预言灵性"},
    {"id": "empress", "name": "女皇", "en": "The Empress", "num": "III", "icon": "👑", "color": "#ec4899", "desc": "繁荣富饶，生机母性"},
    {"id": "emperor", "name": "皇帝", "en": "The Emperor", "num": "IV", "icon": "🏛️", "color": "#ef4444", "desc": "王权统治，秩序威严"},
    {"id": "hierophant", "name": "教皇", "en": "The Hierophant", "num": "V", "icon": "📜", "color": "#fbbf24", "desc": "信仰指引，神圣信条"},
    {"id": "lovers", "name": "恋人", "en": "The Lovers", "num": "VI", "icon": "❤️", "color": "#f43f5e", "desc": "协同羁绊，双生契约"},
    {"id": "chariot", "name": "战车", "en": "The Chariot", "num": "VII", "icon": "🛡️", "color": "#3b82f6", "desc": "意志进取，冲锋征服"},
    {"id": "strength", "name": "力量", "en": "Strength", "num": "VIII", "icon": "⚔️", "color": "#f97316", "desc": "刚猛坚韧，无畏战力"},
    {"id": "hermit", "name": "隐士", "en": "The Hermit", "num": "IX", "icon": "🏮", "color": "#94a3b8", "desc": "沉思隐匿，迷雾探索"},
    {"id": "wheel", "name": "命运之轮", "en": "Wheel of Fortune", "num": "X", "icon": "☸️", "color": "#14b8a6", "desc": "机缘时运，因果循环"},
    {"id": "justice", "name": "正义", "en": "Justice", "num": "XI", "icon": "⚖️", "color": "#6366f1", "desc": "裁决平衡，严明公道"},
    {"id": "hanged", "name": "倒吊人", "en": "The Hanged Man", "num": "XII", "icon": "🪢", "color": "#06b6d4", "desc": "牺牲自省，逆境觉悟"},
    {"id": "death", "name": "死神", "en": "Death", "num": "XIII", "icon": "☠️", "color": "#c084fc", "desc": "旧日终结，灵界更替"},
    {"id": "temperance", "name": "节制", "en": "Temperance", "num": "XIV", "icon": "🧪", "color": "#10b981", "desc": "调和平衡，自律自持"},
    {"id": "devil", "name": "恶魔", "en": "The Devil", "num": "XV", "icon": "😈", "color": "#dc2626", "desc": "深渊欲望，狂野契约"},
    {"id": "tower", "name": "高塔", "en": "The Tower", "num": "XVI", "icon": "⚡", "color": "#eab308", "desc": "剧变倾覆，破旧立新"},
    {"id": "star", "name": "星星", "en": "The Star", "num": "XVII", "icon": "⭐", "color": "#0ea5e9", "desc": "璀璨希望，原初之光"},
    {"id": "moon", "name": "月亮", "en": "The Moon", "num": "XVIII", "icon": "🌙", "color": "#818cf8", "desc": "梦境幻觉，夜之潜流"},
    {"id": "sun", "name": "太阳", "en": "The Sun", "num": "XIX", "icon": "☀️", "color": "#f59e0b", "desc": "炽烈光芒，生命活力"},
    {"id": "judgement", "name": "审判", "en": "Judgement", "num": "XX", "icon": "🎺", "color": "#d946ef", "desc": "清算觉醒，命运召唤"},
    {"id": "world", "name": "世界", "en": "The World", "num": "XXI", "icon": "🌍", "color": "#22c55e", "desc": "圆满达成，终极归一"}
]

# Common pinyin initials for heroes
PINYIN_INITIALS = {
    "混沌骑士": "ck", "影魔": "sf", "幻影刺客": "pa", "水晶室女": "cm", "敌法师": "am",
    "痛苦女王": "qop", "圣堂刺客": "ta", "撼地者": "es", "冥魂大帝": "wk", "恐怖利刃": "tb",
    "龙骑士": "dk", "军团指挥官": "lc", "光之守卫": "kotl", "殁境神蚀者": "od", "半人马战行者": "centaur",
    "石鳞剑士": "pango", "复仇之魂": "vs", "自然之怒": "np", "修补匠": "tk", "风暴之灵": "ss",
    "大地之灵": "es", "灰烬之灵": "es", "虚空之灵": "vs", "远古冰魄": "aa", "发条技师": "cg",
    "斯温": "sw", "主宰": "jugg", "斧王": "axe", "屠夫": "pudge", "帕吉": "pj", "拉比克": "rbk",
    "双头龙": "jakiro", "末日使者": "doom", "神谕者": "oracle", "琼英碧灵": "muerta", "百戏大王": "rm"
}

html_content = f'''<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOTA2 暗黑狂欢 · 票券图鉴与智能推荐系统</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @keyframes pulse-subtle {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.95; transform: scale(1.02); }}
    }}
    @keyframes float-badge {{
      0%, 100% {{ transform: translateY(0); }}
      50% {{ transform: translateY(-3px); }}
    }}
    .animate-float {{
      animation: float-badge 3s ease-in-out infinite;
    }}
    .card-glass {{
      background: rgba(22, 27, 34, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }}
    .card-glass:hover {{
      border-color: rgba(255, 255, 255, 0.18);
    }}
    .gold-glow {{
      box-shadow: 0 0 20px -3px rgba(245, 158, 11, 0.25);
    }}
    .blue-glow {{
      box-shadow: 0 0 20px -3px rgba(59, 130, 246, 0.25);
    }}
    .purple-glow {{
      box-shadow: 0 0 20px -3px rgba(168, 85, 247, 0.25);
    }}
    /* Custom scrollbar */
    ::-webkit-scrollbar {{
      width: 7px;
      height: 7px;
    }}
    ::-webkit-scrollbar-track {{
      background: #0f172a;
    }}
    ::-webkit-scrollbar-thumb {{
      background: #334155;
      border-radius: 4px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: #475569;
    }}
    .ticket-badge {{
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }}
    .ticket-badge:hover {{
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }}
  </style>
</head>
<body class="bg-[#0b0f17] text-slate-100 min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">

  <!-- Top Navigation Header -->
  <header class="sticky top-0 z-40 bg-[#0f1420]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <div class="w-full h-full bg-[#0d121c] rounded-[10px] flex items-center justify-center text-xl">
              🎪
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-black text-lg tracking-wider bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
                暗黑狂欢 · 票券助手
              </span>
              <span class="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
                百戏大王专列
              </span>
            </div>
            <p class="text-xs text-slate-400 hidden sm:block">每胜 1 局从 3 张票券中随机抽 2 张 | 智能图鉴 & 最优通关算法</p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button id="tabBtnCodex" onclick="switchTab('codex')" class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
            <span>📖</span>
            <span>英雄票券图鉴</span>
          </button>
          <button id="tabBtnRecom" onclick="switchTab('recom')" class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/60">
            <span>🎯</span>
            <span>筛选与智能推荐</span>
            <span id="navDeficitBadge" class="hidden ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-rose-500 text-white rounded-full">0</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- Notification Toast -->
    <div id="toast" class="fixed top-20 right-6 z-50 transform translate-x-full opacity-0 transition-all duration-300 pointer-events-none">
      <div id="toastContent" class="bg-slate-900/95 border border-amber-500/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 text-sm">
        <span id="toastIcon">✨</span>
        <span id="toastMsg">通知信息</span>
      </div>
    </div>

    <!-- ==================== PAGE 1: 英雄票券图鉴 ==================== -->
    <section id="pageCodex" class="space-y-6">
      
      <!-- Banner / Search Controls -->
      <div class="card-glass rounded-2xl p-5 border border-slate-800/80 shadow-xl space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
              <span>全英雄暗黑狂欢票券图鉴</span>
              <span class="text-xs font-normal text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60" id="codexHeroCount">
                共 127 位英雄
              </span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              按四大主属性划分，每位英雄绑定专属的 3 张塔罗牌票券。支持英雄名、缩写拼音（如 ck、sf、am）及票券反查筛选。
            </p>
          </div>

          <!-- Search Box -->
          <div class="relative w-full md:w-80">
            <input 
              type="text" 
              id="heroSearchInput" 
              oninput="filterCodex()"
              placeholder="搜索英雄名 / 英文 / 缩写拼音 / 票券名..." 
              class="w-full bg-[#121824] text-sm text-slate-100 placeholder-slate-500 pl-10 pr-9 py-2.5 rounded-xl border border-slate-700/80 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
            >
            <span class="absolute left-3 top-2.5 text-slate-500 text-base">🔍</span>
            <button id="clearSearchBtn" onclick="clearSearch()" class="hidden absolute right-3 top-2.5 text-slate-400 hover:text-white text-sm">✕</button>
          </div>
        </div>

        <!-- Attribute Tabs Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <div class="flex flex-wrap items-center gap-1.5" id="attrTabs">
            <button onclick="setAttrFilter('all')" class="attr-tab px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow" data-attr="all">
              全部 (127)
            </button>
            <button onclick="setAttrFilter('str')" class="attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-red-500/30" data-attr="str">
              <span class="text-red-400 mr-1">🔴</span>力量 (36)
            </button>
            <button onclick="setAttrFilter('agi')" class="attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-emerald-500/30" data-attr="agi">
              <span class="text-emerald-400 mr-1">🟢</span>敏捷 (35)
            </button>
            <button onclick="setAttrFilter('int')" class="attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-sky-500/30" data-attr="int">
              <span class="text-sky-400 mr-1">🔵</span>智力 (34)
            </button>
            <button onclick="setAttrFilter('all_attr')" class="attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-purple-500/30" data-attr="all_attr">
              <span class="text-purple-400 mr-1">🟣</span>全才 (22)
            </button>
          </div>

          <!-- Quick Ticket Filter Pill Dropdown/Trigger -->
          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-400">过滤特定票券:</span>
            <select id="ticketSelectFilter" onchange="filterCodex()" class="bg-[#121824] text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none">
              <option value="">全部票券 (不限)</option>
            </select>
          </div>
        </div>

        <!-- Clickable Ticket Pills (Horizontal Scroll) -->
        <div class="pt-2">
          <div class="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
            <span>快捷票券检索（点击任意票券即可精准筛选出可产出该票券的所有英雄）：</span>
            <button onclick="resetTicketPills()" class="text-amber-400 hover:underline text-[11px]">重置票券筛选</button>
          </div>
          <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1" id="ticketPillContainer">
            <!-- Injected via JS -->
          </div>
        </div>
      </div>

      <!-- Hero Grid Display -->
      <div id="codexGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Injected via JS -->
      </div>

      <!-- Empty State -->
      <div id="codexEmptyState" class="hidden card-glass rounded-2xl p-12 text-center text-slate-400">
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-base font-medium text-slate-300">未找到符合条件的英雄</p>
        <p class="text-xs text-slate-500 mt-1">请尝试更换搜索关键字或清除票券过滤条件</p>
        <button onclick="resetAllFilters()" class="mt-4 px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs hover:bg-amber-500/30">
          清除所有筛选条件
        </button>
      </div>
    </section>

    <!-- ==================== PAGE 2: 筛选与智能推荐 ==================== -->
    <section id="pageRecom" class="hidden space-y-6">

      <!-- Mechanism Card -->
      <div class="card-glass rounded-2xl p-4 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-purple-950/20">
        <div class="flex items-start space-x-3">
          <span class="text-2xl mt-0.5">💡</span>
          <div>
            <h2 class="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span>核心机制 & 智能推荐算法说明</span>
              <span class="text-[11px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-normal">
                单场获胜：3 抽 2 (随机获取2张)
              </span>
            </h2>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              每个英雄固定产出 3 种票券。获胜后系统从 3 张中随机掉落 2 张（3 种二元组合概率各占 1/3）。系统根据您的【拥有量】与【需求量】实时计算净缺口，将全英雄自动划分为：
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs">
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-amber-200">
                <span class="font-bold text-amber-400">🥇 第 1 档（完美契合）</span>：3 张票券全部为急需！无论抽到哪 2 张都 100% 有效，单局期望 2.0 张，零浪费。
              </div>
              <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-blue-200">
                <span class="font-bold text-blue-400">🥈 第 2 档（高效精选）</span>：2 张票券为急需。保底 100% 获得至少 1 张所需，有 33.3% 概率双收，期望 1.33 张/局。
              </div>
              <div class="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 text-purple-200">
                <span class="font-bold text-purple-400">🥉 第 3 档（替补选择）</span>：1 张票券为急需。66.7% 概率获得 1 张所需，期望 0.67 张/局。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overview Status Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="card-glass rounded-xl p-3.5 border border-slate-800">
          <div class="text-xs text-slate-400">总需求目标</div>
          <div class="text-2xl font-black text-amber-400 mt-1" id="statTotalNeeded">0 <span class="text-xs text-slate-400 font-normal">张</span></div>
        </div>
        <div class="card-glass rounded-xl p-3.5 border border-slate-800">
          <div class="text-xs text-slate-400">当前已拥有</div>
          <div class="text-2xl font-black text-emerald-400 mt-1" id="statTotalOwned">0 <span class="text-xs text-slate-400 font-normal">张</span></div>
        </div>
        <div class="card-glass rounded-xl p-3.5 border border-slate-800">
          <div class="text-xs text-slate-400">净缺口（待获取）</div>
          <div class="text-2xl font-black text-rose-400 mt-1" id="statTotalDeficit">0 <span class="text-xs text-slate-400 font-normal">张</span></div>
        </div>
        <div class="card-glass rounded-xl p-3.5 border border-slate-800">
          <div class="text-xs text-slate-400">预计最快通关</div>
          <div class="text-2xl font-black text-sky-400 mt-1" id="statEstimatedGames">0 <span class="text-xs text-slate-400 font-normal">局胜场</span></div>
        </div>
      </div>

      <!-- Part A: 票券设置 (Inventory & Target Demands) -->
      <div class="card-glass rounded-2xl p-5 border border-slate-800/80 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>(a) 票券库存与需求设置</span>
              <span class="text-xs text-slate-400 font-normal">设置您拥有的票券数量与当前关卡所需的票券目标</span>
            </h2>
          </div>

          <!-- Quick Presets -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-400">常用预设:</span>
            <button onclick="applyPreset('node1')" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700">
              第1车厢关卡
            </button>
            <button onclick="applyPreset('boss')" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700">
              首领决战关卡
            </button>
            <button onclick="applyPreset('demo')" class="px-2.5 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/30 font-medium">
              典型缺口测试
            </button>
            <button onclick="resetSetup()" class="px-2.5 py-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30">
              清空重置
            </button>
          </div>
        </div>

        <!-- Ticket Configuration Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-2" id="ticketSetupGrid">
          <!-- Injected via JS -->
        </div>
      </div>

      <!-- Part C: 最优通关组合路径规划 (Fast Track Planner) -->
      <div id="fastTrackPlanCard" class="card-glass rounded-2xl p-5 border border-sky-500/30 bg-gradient-to-r from-sky-950/20 via-slate-900/60 to-indigo-950/20 shadow-xl space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xl">🚀</span>
            <h3 class="text-sm font-bold text-sky-300">智能最快通关路径规划</h3>
          </div>
          <span class="text-xs text-slate-400" id="fastTrackSummaryText">计算最少局数通关方案</span>
        </div>
        <div id="fastTrackPlanContent" class="text-xs text-slate-300 leading-relaxed bg-[#0c121d] p-3.5 rounded-xl border border-sky-900/40">
          请在上方设置您需要收集的票券需求，系统将自动帮您规划最快通关策略。
        </div>
      </div>

      <!-- Part B: 智能推荐结果展示 (Tier 1, Tier 2, Tier 3) -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>(b) 智能英雄推荐</span>
            <span class="text-xs font-normal text-slate-400">基于 3 抽 2 随机掉落概率计算收益期望</span>
          </h2>
          <div class="text-xs text-slate-400">
            提示：点击英雄卡片上的【模拟获胜】可实时体验掉落
          </div>
        </div>

        <!-- Tier 1 Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm">
                🥇 第 1 档 · 极力推荐
              </span>
              <span class="text-xs text-amber-300/90 font-medium">
                3/3 需求完美匹配 | 单局期望 2.0 张 | 0% 浪费率
              </span>
            </div>
            <span class="text-xs text-slate-400" id="tier1Count">0 位英雄</span>
          </div>
          <div id="tier1Grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <!-- Injected via JS -->
          </div>
          <div id="tier1Empty" class="text-xs text-slate-500 italic bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-center">
            暂无 3 张票券全部命中的完美英雄。请查看第 2 档高效英雄组合！
          </div>
        </div>

        <!-- Tier 2 Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-sm">
                🥈 第 2 档 · 高效精选
              </span>
              <span class="text-xs text-blue-300/90 font-medium">
                2/3 需求匹配 | 保底 100% 获得至少 1 张所需 | 期望 1.33 张/局
              </span>
            </div>
            <span class="text-xs text-slate-400" id="tier2Count">0 位英雄</span>
          </div>
          <div id="tier2Grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <!-- Injected via JS -->
          </div>
          <div id="tier2Empty" class="text-xs text-slate-500 italic bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-center">
            当前无第 2 档推荐英雄。
          </div>
        </div>

        <!-- Tier 3 Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-purple-500/30 pb-2">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-purple-500 to-fuchsia-400 text-slate-950 shadow-sm">
                🥉 第 3 档 · 备选补充
              </span>
              <span class="text-xs text-purple-300/90 font-medium">
                1/3 需求匹配 | 66.7% 概率获得 1 张所需 | 期望 0.67 张/局
              </span>
            </div>
            <span class="text-xs text-slate-400" id="tier3Count">0 位英雄</span>
          </div>
          <div id="tier3Grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <!-- Injected via JS -->
          </div>
          <div id="tier3Empty" class="text-xs text-slate-500 italic bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-center">
            当前无第 3 档推荐英雄。
          </div>
        </div>

      </div>

    </section>

  </main>

  <!-- Ticket Detail Modal -->
  <div id="ticketModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="card-glass rounded-2xl max-w-lg w-full p-6 border border-amber-500/40 shadow-2xl space-y-4">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div id="modalTicketIcon" class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-amber-500/20 border border-amber-500/40">
            🃏
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 id="modalTicketName" class="text-lg font-bold text-white">票券名称</h3>
              <span id="modalTicketNum" class="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">0</span>
            </div>
            <p id="modalTicketEn" class="text-xs text-slate-400">The Name</p>
          </div>
        </div>
        <button onclick="closeTicketModal()" class="text-slate-400 hover:text-white text-lg">✕</button>
      </div>

      <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300" id="modalTicketDesc">
        票券寓意描述
      </div>

      <div>
        <div class="text-xs font-bold text-amber-400 mb-2 flex items-center justify-between">
          <span>可产出此票券的所有英雄：</span>
          <span id="modalHeroCount" class="text-[11px] text-slate-400 font-normal">0 位</span>
        </div>
        <div id="modalHeroList" class="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
          <!-- Injected via JS -->
        </div>
      </div>

      <div class="flex justify-end pt-2 border-t border-slate-800">
        <button onclick="closeTicketModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl transition">
          关闭
        </button>
      </div>
    </div>
  </div>

  <!-- Embedded Data & Application Logic -->
  <script>
    // Data definition
    const HEROES_DATA = {json.dumps(heroes_data, ensure_ascii=False)};
    const TAROT_CARDS = {json.dumps(tarot_cards, ensure_ascii=False)};
    const PINYIN_INITIALS = {json.dumps(PINYIN_INITIALS, ensure_ascii=False)};

    // Map card by name
    const CARD_MAP = {{}};
    TAROT_CARDS.forEach(c => CARD_MAP[c.name] = c);

    // Attribute Metadata
    const ATTR_META = {{
      'str': {{ name: '力量', icon: '🔴', color: '#ef4444', badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30' }},
      'agi': {{ name: '敏捷', icon: '🟢', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }},
      'int': {{ name: '智力', icon: '🔵', color: '#38bdf8', badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30' }},
      'all': {{ name: '全才', icon: '🟣', color: '#a855f7', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }}
    }};

    // State
    let currentTab = 'codex';
    let currentAttrFilter = 'all';
    let selectedTicketPill = null;
    let ownedTickets = {{}};
    let neededTickets = {{}};

    // Initialize default ticket counts
    TAROT_CARDS.forEach(c => {{
      ownedTickets[c.name] = 0;
      neededTickets[c.name] = 0;
    }});

    // Initialize application
    window.addEventListener('DOMContentLoaded', () => {{
      populateTicketPills();
      populateTicketSelect();
      renderCodex();
      renderTicketSetupGrid();
      
      // Default sample setup for instant delight
      applyPreset('demo', false);
      updateRecommendations();
    }});

    // Tab switcher
    function switchTab(tab) {{
      currentTab = tab;
      const codexSec = document.getElementById('pageCodex');
      const recomSec = document.getElementById('pageRecom');
      const btnCodex = document.getElementById('tabBtnCodex');
      const btnRecom = document.getElementById('tabBtnRecom');

      if (tab === 'codex') {{
        codexSec.classList.remove('hidden');
        recomSec.classList.add('hidden');
        btnCodex.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md";
        btnRecom.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/60";
      }} else {{
        codexSec.classList.add('hidden');
        recomSec.classList.remove('hidden');
        btnRecom.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md";
        btnCodex.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/60";
        updateRecommendations();
      }}
    }}

    // Populate ticket pills in Codex
    function populateTicketPills() {{
      const container = document.getElementById('ticketPillContainer');
      container.innerHTML = '';
      
      TAROT_CARDS.forEach(card => {{
        // Count how many heroes offer this card
        const count = HEROES_DATA.filter(h => h.tickets.includes(card.name)).length;
        const pill = document.createElement('button');
        pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-[#121722] border-slate-800 text-slate-300 hover:border-amber-500/50`;
        pill.dataset.ticket = card.name;
        pill.onclick = () => selectTicketPill(card.name);
        pill.innerHTML = `
          <span>${{card.icon}}</span>
          <span>${{card.name}}</span>
          <span class="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded-full">${{count}}</span>
        `;
        container.appendChild(pill);
      }});
    }}

    // Populate ticket dropdown select
    function populateTicketSelect() {{
      const select = document.getElementById('ticketSelectFilter');
      TAROT_CARDS.forEach(card => {{
        const opt = document.createElement('option');
        opt.value = card.name;
        opt.textContent = `${{card.icon}} ${{card.name}} (${{card.en}})`;
        select.appendChild(opt);
      }});
    }}

    // Select ticket pill
    function selectTicketPill(ticketName) {{
      if (selectedTicketPill === ticketName) {{
        selectedTicketPill = null;
      }} else {{
        selectedTicketPill = ticketName;
      }}
      document.getElementById('ticketSelectFilter').value = selectedTicketPill || '';
      updatePillStyles();
      renderCodex();
    }}

    function updatePillStyles() {{
      document.querySelectorAll('.ticket-pill').forEach(pill => {{
        if (pill.dataset.ticket === selectedTicketPill) {{
          pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/40`;
        }} else {{
          pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-[#121722] border-slate-800 text-slate-300 hover:border-amber-500/50`;
        }}
      }});
    }}

    function resetTicketPills() {{
      selectedTicketPill = null;
      document.getElementById('ticketSelectFilter').value = '';
      updatePillStyles();
      renderCodex();
    }}

    // Set Attribute filter in Codex
    function setAttrFilter(attr) {{
      currentAttrFilter = attr;
      document.querySelectorAll('.attr-tab').forEach(btn => {{
        if (btn.dataset.attr === attr) {{
          btn.className = "attr-tab px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow";
        }} else {{
          btn.className = "attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-slate-700/40";
        }}
      }});
      renderCodex();
    }}

    function clearSearch() {{
      document.getElementById('heroSearchInput').value = '';
      document.getElementById('clearSearchBtn').classList.add('hidden');
      renderCodex();
    }}

    function resetAllFilters() {{
      document.getElementById('heroSearchInput').value = '';
      document.getElementById('clearSearchBtn').classList.add('hidden');
      selectedTicketPill = null;
      document.getElementById('ticketSelectFilter').value = '';
      setAttrFilter('all');
      updatePillStyles();
      renderCodex();
    }}

    // Filter and Render Codex Heroes
    function filterCodex() {{
      const searchVal = document.getElementById('heroSearchInput').value.trim();
      const clearBtn = document.getElementById('clearSearchBtn');
      if (searchVal) {{
        clearBtn.classList.remove('hidden');
      }} else {{
        clearBtn.classList.add('hidden');
      }}

      const selectVal = document.getElementById('ticketSelectFilter').value;
      if (selectVal !== selectedTicketPill) {{
        selectedTicketPill = selectVal || null;
        updatePillStyles();
      }}

      renderCodex();
    }}

    function renderCodex() {{
      const search = document.getElementById('heroSearchInput').value.trim().toLowerCase();
      const grid = document.getElementById('codexGrid');
      const emptyState = document.getElementById('codexEmptyState');
      const counterEl = document.getElementById('codexHeroCount');

      const filtered = HEROES_DATA.filter(h => {{
        // Attribute filter
        if (currentAttrFilter !== 'all') {{
          if (currentAttrFilter === 'all_attr') {{
            if (h.attr !== 'all') return false;
          }} else if (h.attr !== currentAttrFilter) {{
            return false;
          }}
        }}

        // Ticket pill/select filter
        if (selectedTicketPill) {{
          if (!h.tickets.includes(selectedTicketPill)) return false;
        }}

        // Search filter (Chinese name, English name, tickets, pinyin initials)
        if (search) {{
          const pinyin = PINYIN_INITIALS[h.name] || '';
          const matchName = h.name.toLowerCase().includes(search);
          const matchEn = h.en_name.toLowerCase().includes(search);
          const matchKey = h.key.toLowerCase().includes(search);
          const matchPinyin = pinyin.toLowerCase().includes(search);
          const matchTicket = h.tickets.some(t => t.toLowerCase().includes(search));
          if (!matchName && !matchEn && !matchKey && !matchPinyin && !matchTicket) {{
            return false;
          }}
        }}

        return true;
      }});

      counterEl.textContent = `共 ${{filtered.length}} 位英雄`;

      if (filtered.length === 0) {{
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }}

      emptyState.classList.add('hidden');
      grid.innerHTML = filtered.map(h => {{
        const attrInfo = ATTR_META[h.attr] || {{ name: '未知', icon: '⚪', badgeClass: 'bg-slate-700 text-slate-300' }};
        
        // Render 3 ticket cards
        const ticketBadges = h.tickets.map(tName => {{
          const card = CARD_MAP[tName] || {{ icon: '🃏', color: '#94a3b8', num: '?' }};
          return `
            <div onclick="openTicketModal('${{tName}}')" class="ticket-badge cursor-pointer flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0e131d] border border-slate-800 hover:border-amber-500/50 group">
              <div class="flex items-center space-x-1.5 overflow-hidden">
                <span class="text-sm">${{card.icon}}</span>
                <span class="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">${{tName}}</span>
              </div>
              <span class="text-[10px] font-mono text-slate-400 ml-1 font-medium">${{card.num}}</span>
            </div>
          `;
        }}).join('');

        return `
          <div class="card-glass rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl">
            <!-- Hero Header -->
            <div class="flex items-center space-x-3 mb-3">
              <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                <img 
                  src="${{h.img}}" 
                  alt="${{h.name}}" 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 48 48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'12\\' font-weight=\\'bold\\'>${{h.name.slice(0, 2)}}</text></svg>';"
                >
                <span class="absolute bottom-0 right-0 text-[10px] leading-none px-1 py-0.5 rounded-tl bg-black/80 font-mono">
                  ${{attrInfo.icon}}
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    ${{h.name}}
                  </h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-medium border ${{attrInfo.badgeClass}}">
                    ${{attrInfo.name}}
                  </span>
                </div>
                <p class="text-[11px] text-slate-400 truncate">${{h.en_name}}</p>
              </div>
            </div>

            <!-- 3 Tickets -->
            <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div class="text-[10px] text-slate-400 font-medium">产出票券 (3抽2):</div>
              <div class="grid grid-cols-1 gap-1">
                ${{ticketBadges}}
              </div>
            </div>

            <!-- Action Button -->
            <div class="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">随机2张概率: 33%各对</span>
              <button onclick="quickTargetHero('${{h.name}}')" class="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition">
                去推荐页匹配 ➔
              </button>
            </div>
          </div>
        `;
      }}).join('');
    }}

    // Quick target hero to recommendation page
    function quickTargetHero(heroName) {{
      const hero = HEROES_DATA.find(h => h.name === heroName);
      if (!hero) return;
      
      // Set needed tickets to hero's 3 tickets
      TAROT_CARDS.forEach(c => neededTickets[c.name] = 0);
      hero.tickets.forEach(t => neededTickets[t] = 2);
      
      renderTicketSetupGrid();
      switchTab('recom');
      showToast(`已将【${{hero.name}}】的 3 张票券设为推荐目标！`, '🎯');
    }}

    // Open ticket modal
    function openTicketModal(ticketName) {{
      const card = CARD_MAP[ticketName];
      if (!card) return;

      document.getElementById('modalTicketIcon').textContent = card.icon;
      document.getElementById('modalTicketName').textContent = card.name;
      document.getElementById('modalTicketNum').textContent = `塔罗序号: ${{card.num}}`;
      document.getElementById('modalTicketEn').textContent = card.en;
      document.getElementById('modalTicketDesc').textContent = `寓意特性：${{card.desc}}。在活动火车专列中，消耗此票券可解锁特定对应车厢节点与奖励。`;

      const heroes = HEROES_DATA.filter(h => h.tickets.includes(ticketName));
      document.getElementById('modalHeroCount').textContent = `${{heroes.length}} 位英雄`;

      const listContainer = document.getElementById('modalHeroList');
      listContainer.innerHTML = heroes.map(h => {{
        const attrInfo = ATTR_META[h.attr];
        return `
          <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span>${{attrInfo.icon}}</span>
            <span class="font-medium text-slate-200">${{h.name}}</span>
          </div>
        `;
      }}).join('');

      document.getElementById('ticketModal').classList.remove('hidden');
    }}

    function closeTicketModal() {{
      document.getElementById('ticketModal').classList.add('hidden');
    }}

    // ==================== RECOMMENDATION PAGE LOGIC ====================

    function renderTicketSetupGrid() {{
      const grid = document.getElementById('ticketSetupGrid');
      grid.innerHTML = TAROT_CARDS.map(card => {{
        const owned = ownedTickets[card.name] || 0;
        const needed = neededTickets[card.name] || 0;
        const deficit = Math.max(0, needed - owned);

        let deficitBadge = '';
        if (needed === 0) {{
          deficitBadge = `<span class="text-[11px] text-slate-500">无需求</span>`;
        }} else if (deficit === 0) {{
          deficitBadge = `<span class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">已满足 ✓</span>`;
        }} else {{
          deficitBadge = `<span class="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">缺 ${{deficit}} 张</span>`;
        }}

        return `
          <div class="card-glass rounded-xl p-3 border border-slate-800 flex flex-col justify-between space-y-2">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-base">${{card.icon}}</span>
                <span class="text-xs font-bold text-slate-200">${{card.name}}</span>
              </div>
              ${{deficitBadge}}
            </div>

            <!-- Inputs (Owned vs Needed) -->
            <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
              <!-- Owned -->
              <div>
                <label class="block text-[10px] text-slate-400 mb-1">拥有量</label>
                <div class="flex items-center bg-[#0d121a] rounded-lg border border-slate-700/80 overflow-hidden">
                  <button onclick="changeOwned('${{card.name}}', -1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">-</button>
                  <input 
                    type="number" 
                    min="0" 
                    value="${{owned}}" 
                    onchange="setOwned('${{card.name}}', this.value)"
                    class="w-full bg-transparent text-center text-xs text-emerald-300 font-bold focus:outline-none py-1"
                  >
                  <button onclick="changeOwned('${{card.name}}', 1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">+</button>
                </div>
              </div>

              <!-- Needed -->
              <div>
                <label class="block text-[10px] text-slate-400 mb-1">需求量</label>
                <div class="flex items-center bg-[#0d121a] rounded-lg border border-slate-700/80 overflow-hidden">
                  <button onclick="changeNeeded('${{card.name}}', -1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">-</button>
                  <input 
                    type="number" 
                    min="0" 
                    value="${{needed}}" 
                    onchange="setNeeded('${{card.name}}', this.value)"
                    class="w-full bg-transparent text-center text-xs text-amber-300 font-bold focus:outline-none py-1"
                  >
                  <button onclick="changeNeeded('${{card.name}}', 1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">+</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }}).join('');
    }}

    function changeOwned(cardName, delta) {{
      ownedTickets[cardName] = Math.max(0, (ownedTickets[cardName] || 0) + delta);
      renderTicketSetupGrid();
      updateRecommendations();
    }}

    function setOwned(cardName, val) {{
      ownedTickets[cardName] = Math.max(0, parseInt(val) || 0);
      renderTicketSetupGrid();
      updateRecommendations();
    }}

    function changeNeeded(cardName, delta) {{
      neededTickets[cardName] = Math.max(0, (neededTickets[cardName] || 0) + delta);
      renderTicketSetupGrid();
      updateRecommendations();
    }}

    function setNeeded(cardName, val) {{
      neededTickets[cardName] = Math.max(0, parseInt(val) || 0);
      renderTicketSetupGrid();
      updateRecommendations();
    }}

    function applyPreset(presetType, toastNotify = true) {{
      TAROT_CARDS.forEach(c => {{
        ownedTickets[c.name] = 0;
        neededTickets[c.name] = 0;
      }});

      if (presetType === 'node1') {{
        // Node 1: Escape prison car (Strength, Chariot, Justice)
        neededTickets['力量'] = 2;
        neededTickets['战车'] = 2;
        neededTickets['正义'] = 1;
        if (toastNotify) showToast('已应用【第1车厢关卡】需求预设！', '🚂');
      }} else if (presetType === 'boss') {{
        // Boss showdown
        neededTickets['命运之轮'] = 2;
        neededTickets['恶魔'] = 2;
        neededTickets['死神'] = 2;
        neededTickets['世界'] = 1;
        if (toastNotify) showToast('已应用【首领决战关卡】需求预设！', '👑');
      }} else if (presetType === 'demo') {{
        // High-contrast demo: Chaos Knight / Sven / Rubick
        neededTickets['命运之轮'] = 2;
        neededTickets['战车'] = 1;
        neededTickets['恶魔'] = 1;
        neededTickets['力量'] = 1;
        ownedTickets['恶魔'] = 0;
        if (toastNotify) showToast('已应用【典型缺口测试】预设！', '💡');
      }}

      renderTicketSetupGrid();
      updateRecommendations();
    }}

    function resetSetup() {{
      TAROT_CARDS.forEach(c => {{
        ownedTickets[c.name] = 0;
        neededTickets[c.name] = 0;
      }});
      renderTicketSetupGrid();
      updateRecommendations();
      showToast('已清空全部票券设置！', '🧹');
    }}

    // Calculate Deficits & Recommendations
    function updateRecommendations() {{
      let totalNeeded = 0;
      let totalOwned = 0;
      let totalDeficit = 0;
      const deficits = {{}};

      TAROT_CARDS.forEach(c => {{
        const o = ownedTickets[c.name] || 0;
        const n = neededTickets[c.name] || 0;
        const def = Math.max(0, n - o);
        deficits[c.name] = def;
        totalNeeded += n;
        totalOwned += o;
        totalDeficit += def;
      }});

      // Update overview statistics
      document.getElementById('statTotalNeeded').innerHTML = `${{totalNeeded}} <span class="text-xs text-slate-400 font-normal">张</span>`;
      document.getElementById('statTotalOwned').innerHTML = `${{totalOwned}} <span class="text-xs text-slate-400 font-normal">张</span>`;
      document.getElementById('statTotalDeficit').innerHTML = `${{totalDeficit}} <span class="text-xs text-slate-400 font-normal">张</span>`;

      // Update nav badge
      const navBadge = document.getElementById('navDeficitBadge');
      if (totalDeficit > 0) {{
        navBadge.textContent = totalDeficit;
        navBadge.classList.remove('hidden');
      }} else {{
        navBadge.classList.add('hidden');
      }}

      // Calculate recommendations for all heroes
      const tier1 = [];
      const tier2 = [];
      const tier3 = [];

      HEROES_DATA.forEach(h => {{
        const [t1, t2, t3] = h.tickets;
        const combos = [
          [t1, t2],
          [t1, t3],
          [t2, t3]
        ];

        // Evaluate useful yield for each combo
        let usefulCounts = [];
        combos.forEach(([a, b]) => {{
          let u = 0;
          if (a === b) {{
            u += Math.min(2, deficits[a] || 0);
          }} else {{
            if ((deficits[a] || 0) > 0) u += 1;
            if ((deficits[b] || 0) > 0) u += 1;
          }}
          usefulCounts.push(u);
        }});

        const expectedYield = usefulCounts.reduce((acc, v) => acc + v, 0) / 3.0;
        const p2 = usefulCounts.filter(u => u === 2).length / 3.0;
        const p1 = usefulCounts.filter(u => u === 1).length / 3.0;
        const p0 = usefulCounts.filter(u => u === 0).length / 3.0;

        // Count distinct tickets that match active deficits
        const matchedTickets = h.tickets.filter(t => (deficits[t] || 0) > 0);
        const matchCount = matchedTickets.length;

        // Sum of deficits for sorting priority
        const matchedDeficitSum = matchedTickets.reduce((acc, t) => acc + (deficits[t] || 0), 0);

        const recItem = {{
          hero: h,
          expectedYield: expectedYield,
          p2: p2,
          p1: p1,
          p0: p0,
          matchedTickets: matchedTickets,
          matchCount: matchCount,
          matchedDeficitSum: matchedDeficitSum
        }};

        // Tier classification strictly adhering to the prompt:
        // Tier 1: 3/3 tickets needed in deficit (or expected yield = 2.0)
        // Tier 2: 2/3 tickets needed in deficit (expected yield = 1.33)
        // Tier 3: 1/3 tickets needed in deficit (expected yield = 0.67)
        if (matchCount === 3 && expectedYield >= 1.8) {{
          tier1.push(recItem);
        }} else if (matchCount === 2) {{
          tier2.push(recItem);
        }} else if (matchCount === 1) {{
          tier3.push(recItem);
        }}
      }});

      // Sort tiers: higher deficit sum first, then higher expected yield
      tier1.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);
      tier2.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);
      tier3.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);

      // Estimated wins needed
      let estimatedGames = 0;
      if (totalDeficit > 0) {{
        const bestExpected = tier1.length > 0 ? 2.0 : (tier2.length > 0 ? 1.33 : 0.67);
        estimatedGames = Math.ceil(totalDeficit / bestExpected);
      }}
      document.getElementById('statEstimatedGames').innerHTML = `${{estimatedGames}} <span class="text-xs text-slate-400 font-normal">局胜场</span>`;

      // Render the tier sections
      renderTierSection('tier1', tier1, deficits);
      renderTierSection('tier2', tier2, deficits);
      renderTierSection('tier3', tier3, deficits);

      // Render Fast-Track Combination Planner
      renderFastTrackPlan(deficits, totalDeficit, tier1, tier2, tier3);
    }}

    function renderTierSection(tierId, list, deficits) {{
      const grid = document.getElementById(`${{tierId}}Grid`);
      const emptyEl = document.getElementById(`${{tierId}}Empty`);
      const countEl = document.getElementById(`${{tierId}}Count`);

      countEl.textContent = `${{list.length}} 位英雄`;

      if (list.length === 0) {{
        grid.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
      }}

      emptyEl.classList.add('hidden');
      grid.innerHTML = list.map(item => {{
        const h = item.hero;
        const attrInfo = ATTR_META[h.attr];

        // Highlight matched tickets
        const ticketsHtml = h.tickets.map(tName => {{
          const isNeeded = (deficits[tName] || 0) > 0;
          const card = CARD_MAP[tName] || {{ icon: '🃏' }};
          const defCount = deficits[tName] || 0;

          if (isNeeded) {{
            return `
              <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-sm">
                <div class="flex items-center space-x-1 truncate">
                  <span>${{card.icon}}</span>
                  <span>${{tName}}</span>
                </div>
                <span class="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300">缺 ${{defCount}}</span>
              </div>
            `;
          }} else {{
            return `
              <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-xs opacity-60">
                <div class="flex items-center space-x-1 truncate">
                  <span>${{card.icon}}</span>
                  <span>${{tName}}</span>
                </div>
                <span class="text-[10px] text-slate-400">已集齐</span>
              </div>
            `;
          }}
        }}).join('');

        // Percentage breakdown
        const p2Str = (item.p2 * 100).toFixed(1) + '%';
        const p1Str = (item.p1 * 100).toFixed(1) + '%';
        const p0Str = (item.p0 * 100).toFixed(1) + '%';

        let tierBadge = '';
        if (item.matchCount === 3) {{
          tierBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">3/3 完美命中</span>`;
        }} else if (item.matchCount === 2) {{
          tierBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">2/3 命中</span>`;
        }} else {{
          tierBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">1/3 命中</span>`;
        }}

        return `
          <div class="card-glass rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-md hover:shadow-xl">
            <!-- Hero Info -->
            <div class="flex items-center space-x-3">
              <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                <img 
                  src="${{h.img}}" 
                  alt="${{h.name}}" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                  onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 48 48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'12\\' font-weight=\\'bold\\'>${{h.name.slice(0, 2)}}</text></svg>';"
                >
                <span class="absolute bottom-0 right-0 text-[10px] px-1 py-0.5 rounded-tl bg-black/80">
                  ${{attrInfo.icon}}
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-bold text-white truncate">${{h.name}}</h4>
                  ${{tierBadge}}
                </div>
                <div class="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span>${{attrInfo.name}}</span>
                  <span>•</span>
                  <span class="text-amber-400 font-semibold">期望有效票: ${{item.expectedYield.toFixed(2)}} 张/局</span>
                </div>
              </div>
            </div>

            <!-- Tickets Breakdown -->
            <div class="space-y-1.5">
              ${{ticketsHtml}}
            </div>

            <!-- Drop Odds Strip -->
            <div class="bg-[#0b1019] rounded-lg p-2 border border-slate-800 text-[10px] flex items-center justify-between text-slate-400">
              <div>双收率: <span class="text-emerald-400 font-semibold">${{p2Str}}</span></div>
              <div>得1张率: <span class="text-sky-400 font-semibold">${{p1Str}}</span></div>
              <div>轮空浪费: <span class="${{item.p0 > 0 ? 'text-rose-400' : 'text-slate-400'}} font-semibold">${{p0Str}}</span></div>
            </div>

            <!-- Action Simulation Button -->
            <button 
              onclick="simulateMatchWin('${{h.name}}')" 
              class="w-full py-2 bg-gradient-to-r from-amber-500/20 hover:from-amber-500/30 to-amber-600/20 hover:to-amber-600/30 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow"
            >
              <span>🎲</span>
              <span>模拟打一把并获胜 (随机获取2张)</span>
            </button>
          </div>
        `;
      }}).join('');
    }}

    // Simulate match win (Random 2 out of 3 tickets)
    function simulateMatchWin(heroName) {{
      const hero = HEROES_DATA.find(h => h.name === heroName);
      if (!hero) return;

      const tickets = [...hero.tickets];
      // Shuffle and pick 2
      tickets.sort(() => Math.random() - 0.5);
      const won1 = tickets[0];
      const won2 = tickets[1];

      // Add to inventory
      ownedTickets[won1] = (ownedTickets[won1] || 0) + 1;
      ownedTickets[won2] = (ownedTickets[won2] || 0) + 1;

      renderTicketSetupGrid();
      updateRecommendations();

      showToast(`🎉 获胜！使用【${{hero.name}}】掉落了：【${{won1}}】+【${{won2}}】！`, '🏆');
    }}

    // Multi-hero Fast Track Combination Planner
    function renderFastTrackPlan(deficits, totalDeficit, tier1, tier2, tier3) {{
      const planContent = document.getElementById('fastTrackPlanContent');
      const summaryText = document.getElementById('fastTrackSummaryText');

      if (totalDeficit === 0) {{
        summaryText.textContent = "所有目标已全部达成！";
        planContent.innerHTML = `
          <div class="text-emerald-400 font-bold flex items-center space-x-2">
            <span>🎉</span>
            <span>恭喜！您设置的所有票券目标已全部集齐，无需再刷票！</span>
          </div>
        `;
        return;
      }}

      // Greedy solver to find a clean sequence of heroes
      const remaining = {{ ...deficits }};
      const planSteps = [];
      let totalGames = 0;
      let iterations = 0;

      while (iterations < 20) {{
        iterations++;
        // Check if all deficits met
        const activeTickets = Object.keys(remaining).filter(k => remaining[k] > 0);
        if (activeTickets.length === 0) break;

        // Find hero with highest expected yield on active remaining deficits
        let bestHero = null;
        let bestScore = -1;
        let bestExpected = 0;

        HEROES_DATA.forEach(h => {{
          const [t1, t2, t3] = h.tickets;
          const combos = [[t1, t2], [t1, t3], [t2, t3]];
          let uSum = 0;
          combos.forEach(([a, b]) => {{
            if (a === b) {{
              uSum += Math.min(2, remaining[a] || 0);
            }} else {{
              if ((remaining[a] || 0) > 0) uSum += 1;
              if ((remaining[b] || 0) > 0) uSum += 1;
            }}
          }});
          const exp = uSum / 3.0;
          if (exp > bestScore) {{
            bestScore = exp;
            bestHero = h;
            bestExpected = exp;
          }}
        }});

        if (!bestHero || bestScore <= 0.05) break;

        // Estimate how many games to play with this best hero
        const matched = bestHero.tickets.filter(t => (remaining[t] || 0) > 0);
        const maxNeededInSet = Math.max(...matched.map(t => remaining[t] || 0));
        // Each game with this hero gives ~bestExpected
        let gamesWithHero = Math.max(1, Math.min(3, Math.ceil(maxNeededInSet / Math.max(0.67, bestExpected))));

        // Subtract expected yield from remaining
        matched.forEach(t => {{
          const yieldPerGame = bestHero.tickets.filter(x => x === t).length * (2.0 / 3.0);
          remaining[t] = Math.max(0, remaining[t] - Math.round(yieldPerGame * gamesWithHero));
        }});

        planSteps.push({{
          hero: bestHero,
          games: gamesWithHero,
          targets: matched,
          expectedPerGame: bestExpected
        }});

        totalGames += gamesWithHero;
      }}

      summaryText.textContent = `预计最少只需 ${{totalGames}} 局即可通关`;

      const stepsHtml = planSteps.map((step, idx) => {{
        const targetPills = step.targets.map(t => {
          const card = CARD_MAP[t] || { icon: '🃏' };
          return `<span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">${card.icon} ${t}</span>`;
        }).join(' ');

        return `
          <div class="flex items-start space-x-3 p-2.5 rounded-lg bg-[#0e1522] border border-slate-800">
            <span class="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-bold flex items-center justify-center text-[10px] mt-0.5">
              ${idx + 1}
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white text-xs">使用【${step.hero.name}】(${ATTR_META[step.hero.attr].name}) 获胜 <span class="text-amber-400 font-bold">${step.games}</span> 局</span>
                <span class="text-[10px] text-slate-400">单局期望: ${step.expectedPerGame.toFixed(2)} 张</span>
              </div>
              <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] text-slate-400">定向获取:</span>
                ${targetPills}
              </div>
            </div>
          </div>
        `;
      }}).join('');

      planContent.innerHTML = `
        <div class="space-y-2">
          <div class="text-[11px] text-slate-300">
            根据您当前还缺少的 <span class="text-rose-400 font-bold">${totalDeficit} 张</span> 票券，系统为您规划的最少场次毕业策略：
          </div>
          <div class="space-y-1.5">
            ${stepsHtml}
          </div>
          <div class="text-[10px] text-slate-400 pt-1">
            * 注：由于单局掉落存在 3 抽 2 的随机性，实际场次可能因运气轻微浮动，但该路线在数学期望上消耗总局数最少。
          </div>
        </div>
      `;
    }}

    // Toast notification
    let toastTimeout = null;
    function showToast(msg, icon = '✨') {{
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      document.getElementById('toastIcon').textContent = icon;

      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {{
        toast.classList.add('translate-x-full', 'opacity-0');
        toast.classList.remove('translate-x-0', 'opacity-100');
      }}, 3500);
    }}
  </script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated index.html ({len(html_content)} bytes)")
