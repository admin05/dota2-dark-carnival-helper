// DOTA2 暗黑狂欢 · 票券系统逻辑核心
// 机制：每赢一局，每个英雄有3张票券，随机获得其中2张

// Map card by name
const CARD_MAP = {};
TAROT_CARDS.forEach(c => CARD_MAP[c.name] = c);

// Attribute Metadata (Bilingual)
const ATTR_META = {
  'str': { name: '力量', en: 'Strength', icon: '🔴', color: '#ef4444', badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' },
  'agi': { name: '敏捷', en: 'Agility', icon: '🟢', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  'int': { name: '智力', en: 'Intelligence', icon: '🔵', color: '#38bdf8', badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  'all': { name: '全才', en: 'Universal', icon: '🟣', color: '#a855f7', badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' }
};

// ==================== I18N DICTIONARY ====================
const I18N = {
  zh: {
    appTitle: "暗黑狂欢 · 票券助手",
    appSubtitle: "每胜 1 局从 3 张票券中随机抽 2 张 | 智能图鉴 & 最优通关算法",
    navBadge: "百戏大王专列",
    tabCodex: "英雄票券图鉴",
    tabRecom: "筛选与智能推荐",
    langBtn: "English",
    // Codex
    codexTitle: "全英雄暗黑狂欢票券图鉴",
    codexHeroCount: "共 {count} 位英雄",
    codexDesc: "按四大主属性划分（力量、敏捷、智力、全才），每位英雄绑定专属的 3 张塔罗牌票券。支持英雄名、缩写拼音（如 ck、sf、am）及票券反查筛选。",
    searchPlaceholder: "搜索英雄名 / 英文 / 缩写拼音 / 票券名...",
    attrAll: "全部",
    attrStr: "力量",
    attrAgi: "敏捷",
    attrInt: "智力",
    attrUniversal: "全才",
    filterTicketLabel: "过滤特定票券:",
    optAllTickets: "全部票券 (不限)",
    quickTicketHint: "快捷票券检索（点击任意票券即可精准筛选出可产出该票券的所有英雄）：",
    resetTicketFilter: "重置票券筛选",
    emptyHeroes: "未找到符合条件的英雄",
    emptyHeroesSub: "请尝试更换搜索关键字或清除票券过滤条件",
    clearFilters: "清除所有筛选条件",
    ticketsYield: "产出票券 (3抽2):",
    // Recom overview
    mechTitle: "核心机制 & 智能推荐算法说明",
    mechBadge: "单场获胜：3 抽 2 (随机获取2张)",
    mechDesc: "每个英雄固定产出 3 种票券。获胜后系统从 3 张中随机掉落 2 张（3 种二元组合概率各占 1/3）。系统根据您的【拥有量】与【需求量】实时计算净缺口，将全英雄自动划分为：",
    mechTier1Text: "🥇 第 1 档（完美契合）",
    mechTier1Sub: "3 张票券全部为急需！无论抽到哪 2 张都 100% 有效，单局期望 2.0 张，零浪费。",
    mechTier2Text: "🥈 第 2 档（高效精选）",
    mechTier2Sub: "2 张票券为急需。保底 100% 获得至少 1 张所需，有 33.3% 概率双收，期望 1.33 张/局。",
    mechTier3Text: "🥉 第 3 档（替补选择）",
    mechTier3Sub: "1 张票券为急需。66.7% 概率获得 1 张所需，期望 0.67 张/局。",
    statNeeded: "总需求目标",
    statOwned: "当前已拥有",
    statDeficit: "净缺口（待获取）",
    statEstimatedGames: "预计最快通关",
    unitCards: "张",
    unitWins: "局胜场",
    // Setup
    setupTitle: "票券库存与目标需求",
    setupSubtitle: "设置拥有的票券与通关所需的目标票券，系统实时计算净缺口并推荐英雄",
    resetBtn: "清空重置",
    ownedLabel: "拥有",
    needLabel: "需求",
    statusNoNeed: "无需求",
    statusMet: "已满足 ✓",
    statusDeficit: "缺 {n} 张",
    // Recommendations
    recomTitle: "智能英雄推荐",
    recomSubtitle: "基于 3 抽 2 随机掉落概率计算净缺口收益期望，自动分档呈现最优出战英雄",
    allAttrs: "全部属性",
    noDemandTitle: "当前未设定票券需求",
    noDemandDesc: "请在上方【票券库存与目标需求】中点击对应票券的【需求 [+]】按钮，系统将根据 3 抽 2 概率实时为您计算最优通关英雄！",
    tier1Title: "🥇 第 1 档 · 极力推荐",
    tier1Sub: "3/3 需求完美匹配 | 单局期望 2.0 张 | 0% 浪费率",
    tier1Empty: "暂无 3 张票券全部命中的完美英雄。请查看第 2 档高效英雄组合！",
    tier2Title: "🥈 第 2 档 · 高效精选",
    tier2Sub: "2/3 需求匹配 | 保底 100% 获得至少 1 张所需 | 期望 1.33 张/局",
    tier2Empty: "当前无第 2 档推荐英雄。",
    tier3Title: "🥉 第 3 档 · 备选补充",
    tier3Sub: "1/3 需求匹配 | 66.7% 概率获得 1 张所需 | 期望 0.67 张/局",
    tier3Empty: "当前无第 3 档推荐英雄。",
    expectedYield: "期望: <span class=\"font-bold text-amber-600 dark:text-amber-300\">{val}</span> 张/局",
    resetToast: "已清空全部票券设置！",
    // Modal
    modalTarotNum: "塔罗序号: {num}",
    modalDescPrefix: "寓意特性：{desc}。在暗黑狂欢的马戏团专列中，消耗此票券可解锁特定对应车厢节点与奖励。",
    modalYieldHeroesLabel: "可产出此票券的所有英雄：",
    modalHeroCount: "{count} 位英雄",
    modalClose: "关闭"
  },
  en: {
    appTitle: "Dark Carnival · Ticket Helper",
    appSubtitle: "Pick 2 of 3 tickets per win | Smart Codex & Optimal Recommender",
    navBadge: "Ringmaster Train",
    tabCodex: "Hero Ticket Codex",
    tabRecom: "Filter & Recommendations",
    langBtn: "中文",
    // Codex
    codexTitle: "All Heroes Dark Carnival Ticket Codex",
    codexHeroCount: "Total {count} Heroes",
    codexDesc: "Categorized by 4 primary attributes (Strength, Agility, Intelligence, Universal). Each hero yields 3 specific Tarot tickets. Supports hero names, abbreviations, and ticket filtering.",
    searchPlaceholder: "Search hero name / abbreviation / ticket...",
    attrAll: "All",
    attrStr: "Strength",
    attrAgi: "Agility",
    attrInt: "Intelligence",
    attrUniversal: "Universal",
    filterTicketLabel: "Filter by ticket:",
    optAllTickets: "All Tickets (Any)",
    quickTicketHint: "Quick Ticket Finder (click any ticket to filter heroes producing it):",
    resetTicketFilter: "Reset Filter",
    emptyHeroes: "No matching heroes found",
    emptyHeroesSub: "Try changing your search keywords or clearing ticket filters",
    clearFilters: "Clear All Filters",
    ticketsYield: "Yields (Pick 2 of 3):",
    // Recom overview
    mechTitle: "Core Mechanics & Recommender Guide",
    mechBadge: "Match Win: Pick 2 out of 3",
    mechDesc: "Each hero offers 3 fixed tickets. Winning drops 2 of them randomly (1/3 odds for each combination). The solver computes your net deficits in real-time and ranks heroes into 3 tiers:",
    mechTier1Text: "🥇 Tier 1 (Perfect Match)",
    mechTier1Sub: "All 3 tickets needed! 100% useful regardless of drop, expected yield 2.0 tickets/win, 0% waste.",
    mechTier2Text: "🥈 Tier 2 (High Efficiency)",
    mechTier2Sub: "2 out of 3 tickets needed. Guaranteed >=1 needed, 33.3% double hit, expected yield 1.33 tickets/win.",
    mechTier3Text: "🥉 Tier 3 (Alternative Pick)",
    mechTier3Sub: "1 out of 3 tickets needed. 66.7% chance to get 1 needed, expected yield 0.67 tickets/win.",
    statNeeded: "Total Target",
    statOwned: "Total Owned",
    statDeficit: "Net Deficit",
    statEstimatedGames: "Estimated Wins",
    unitCards: "tickets",
    unitWins: "wins",
    // Setup
    setupTitle: "Ticket Inventory & Demands",
    setupSubtitle: "Configure your owned tickets and target demands to calculate real-time deficits",
    resetBtn: "Reset All",
    ownedLabel: "Owned",
    needLabel: "Need",
    statusNoNeed: "None",
    statusMet: "Met ✓",
    statusDeficit: "{n} needed",
    // Recommendations
    recomTitle: "Smart Hero Recommendations",
    recomSubtitle: "Ranked by expected net deficit yield based on 2-of-3 drop odds to find your optimal heroes.",
    allAttrs: "All Attributes",
    noDemandTitle: "No Ticket Demands Set",
    noDemandDesc: "Click the [+] button under [Need] for target tickets above. The solver will instantly calculate the best heroes!",
    tier1Title: "🥇 Tier 1 · Highly Recommended",
    tier1Sub: "3/3 Demand Matched | Expected 2.0 / win | 0% Waste",
    tier1Empty: "No Tier 1 heroes match all 3 tickets currently. Check Tier 2 choices!",
    tier2Title: "🥈 Tier 2 · High Efficiency",
    tier2Sub: "2/3 Demand Matched | Guaranteed >=1 needed | Expected 1.33 / win",
    tier2Empty: "No Tier 2 heroes for current deficits.",
    tier3Title: "🥉 Tier 3 · Alternative Picks",
    tier3Sub: "1/3 Demand Matched | 66.7% chance for 1 needed | Expected 0.67 / win",
    tier3Empty: "No Tier 3 heroes for current deficits.",
    expectedYield: "Exp: <span class=\"font-bold text-amber-600 dark:text-amber-300\">{val}</span> / win",
    resetToast: "All ticket counts have been reset!",
    // Modal
    modalTarotNum: "Tarot No.: {num}",
    modalDescPrefix: "Tarot Lore: {desc}. Used in Dark Carnival circus cars to unlock special nodes and rewards.",
    modalYieldHeroesLabel: "Heroes yielding this ticket:",
    modalHeroCount: "{count} Heroes",
    modalClose: "Close"
  }
};

// Helper translation function
function t(key, params = {}) {
  const dict = I18N[currentLang] || I18N['zh'];
  let text = dict[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return text;
}

// Application State
let currentTab = 'codex';
let currentLang = localStorage.getItem('dota2_carnival_lang') || 'zh';
let currentTheme = localStorage.getItem('dota2_carnival_theme') || 'dark';
let currentAttrFilter = 'all';
let currentRecomAttrFilter = 'all';
let selectedTicketPill = null;
let ownedTickets = {};
let neededTickets = {};

// Initialize default ticket counts (clean 0 by default, no preset)
TAROT_CARDS.forEach(c => {
  ownedTickets[c.name] = 0;
  neededTickets[c.name] = 0;
});

// Initialize application on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLanguage();
  populateTicketPills();
  populateTicketSelect();
  renderCodex();
  renderTicketSetupGrid();
  updateRecommendations();
});

// ==================== THEME MANAGEMENT ====================
function applyTheme() {
  const root = document.documentElement;
  const iconEl = document.getElementById('themeBtnIcon');
  if (currentTheme === 'dark') {
    root.classList.add('dark');
    if (iconEl) iconEl.textContent = '☀️'; // Shows sun to switch to light
  } else {
    root.classList.remove('dark');
    if (iconEl) iconEl.textContent = '🌙'; // Shows moon to switch to dark
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('dota2_carnival_theme', currentTheme);
  applyTheme();
}

// ==================== LANGUAGE MANAGEMENT ====================
function applyLanguage() {
  document.documentElement.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
  
  // Navigation & Static Header
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElText('navAppTitle', t('appTitle'));
  setElText('navAppSubtitle', t('appSubtitle'));
  setElText('navBadge', t('navBadge'));
  setElText('tabCodexText', t('tabCodex'));
  setElText('tabRecomText', t('tabRecom'));
  setElText('langBtnText', t('langBtn'));

  // Codex page
  setElText('codexTitleText', t('codexTitle'));
  setElText('codexDescText', t('codexDesc'));
  const searchInput = document.getElementById('heroSearchInput');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');

  setElText('filterTicketLabel', t('filterTicketLabel'));
  setElText('optAllTickets', t('optAllTickets'));
  setElText('quickTicketHintText', t('quickTicketHint'));
  setElText('resetTicketPillsBtn', t('resetTicketFilter'));
  setElText('emptyStateTitle', t('emptyHeroes'));
  setElText('emptyStateSub', t('emptyHeroesSub'));
  setElText('clearAllFiltersBtn', t('clearFilters'));

  // Attribute tabs text
  updateAttrTabLabels();

  // Recommendations overview
  setElText('mechTitleText', t('mechTitle'));
  setElText('mechBadgeText', t('mechBadge'));
  setElText('mechDescText', t('mechDesc'));
  setElText('mechTier1Text', t('mechTier1Text'));
  setElText('mechTier1Sub', t('mechTier1Sub'));
  setElText('mechTier2Text', t('mechTier2Text'));
  setElText('mechTier2Sub', t('mechTier2Sub'));
  setElText('mechTier3Text', t('mechTier3Text'));
  setElText('mechTier3Sub', t('mechTier3Sub'));

  setElText('statNeededLabel', t('statNeeded'));
  setElText('statOwnedLabel', t('statOwned'));
  setElText('statDeficitLabel', t('statDeficit'));
  setElText('statEstimatedGamesLabel', t('statEstimatedGames'));
  setElText('unitNeeded', t('unitCards'));
  setElText('unitOwned', t('unitCards'));
  setElText('unitDeficit', t('unitCards'));
  setElText('unitGames', t('unitWins'));

  // Setup Section
  setElText('setupSectionTitle', t('setupTitle'));
  setElText('setupSectionSub', t('setupSubtitle'));
  setElText('resetBtnText', t('resetBtn'));

  // Recom Section
  setElText('recomSectionTitle', t('recomTitle'));
  setElText('recomSectionSub', t('recomSubtitle'));
  setElText('noDemandTitle', t('noDemandTitle'));
  setElText('noDemandDesc', t('noDemandDesc'));

  // Recom attribute filters
  setElText('recomAttrAll', t('allAttrs'));
  setElText('recomAttrStr', t('attrStr'));
  setElText('recomAttrAgi', t('attrAgi'));
  setElText('recomAttrInt', t('attrInt'));
  setElText('recomAttrUniversal', t('attrUniversal'));

  // Tier headers
  setElText('tier1Badge', t('tier1Title'));
  setElText('tier1Subtitle', t('tier1Sub'));
  setElText('tier1Empty', t('tier1Empty'));

  setElText('tier2Badge', t('tier2Title'));
  setElText('tier2Subtitle', t('tier2Sub'));
  setElText('tier2Empty', t('tier2Empty'));

  setElText('tier3Badge', t('tier3Title'));
  setElText('tier3Subtitle', t('tier3Sub'));
  setElText('tier3Empty', t('tier3Empty'));

  // Modal
  setElText('modalYieldHeroesLabel', t('modalYieldHeroesLabel'));
  setElText('modalCloseBtn', t('modalClose'));
}

function updateAttrTabLabels() {
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setElText('attrTabAll', `${t('attrAll')} (127)`);
  setElText('attrTabStr', `${t('attrStr')} (36)`);
  setElText('attrTabAgi', `${t('attrAgi')} (35)`);
  setElText('attrTabInt', `${t('attrInt')} (34)`);
  setElText('attrTabUniversal', `${t('attrUniversal')} (22)`);
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('dota2_carnival_lang', currentLang);
  applyLanguage();
  populateTicketPills();
  populateTicketSelect();
  renderCodex();
  renderTicketSetupGrid();
  updateRecommendations();
}

// ==================== TAB SWITCHER (Redesigned & Prominent) ====================
function switchTab(tab) {
  currentTab = tab;
  const codexSec = document.getElementById('pageCodex');
  const recomSec = document.getElementById('pageRecom');
  const btnCodex = document.getElementById('tabBtnCodex');
  const btnRecom = document.getElementById('tabBtnRecom');

  const activeClasses = "flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50 scale-[1.02]";
  const inactiveClasses = "flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-800/60";

  if (tab === 'codex') {
    codexSec.classList.remove('hidden');
    recomSec.classList.add('hidden');
    btnCodex.className = activeClasses;
    btnRecom.className = inactiveClasses;
  } else {
    codexSec.classList.add('hidden');
    recomSec.classList.remove('hidden');
    btnRecom.className = activeClasses;
    btnCodex.className = inactiveClasses;
    updateRecommendations();
  }
}

// ==================== CODEX PAGE ====================

// Populate ticket pills in Codex
function populateTicketPills() {
  const container = document.getElementById('ticketPillContainer');
  if (!container) return;
  container.innerHTML = '';
  
  TAROT_CARDS.forEach(card => {
    const count = HEROES_DATA.filter(h => h.tickets.includes(card.name)).length;
    const pill = document.createElement('button');
    const isSelected = selectedTicketPill === card.name;
    const displayName = currentLang === 'en' ? card.en : card.name;

    pill.className = isSelected
      ? `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-200 font-bold shadow-sm`
      : `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-white dark:bg-[#121722] border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-500/50`;
    pill.dataset.ticket = card.name;
    pill.onclick = () => selectTicketPill(card.name);
    pill.innerHTML = `
      <span>${card.icon}</span>
      <span>${displayName}</span>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800/80 px-1.5 py-0.2 rounded-full">${count}</span>
    `;
    container.appendChild(pill);
  });
}

// Populate ticket dropdown select
function populateTicketSelect() {
  const select = document.getElementById('ticketSelectFilter');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = `<option value="">${t('optAllTickets')}</option>`;
  TAROT_CARDS.forEach(card => {
    const opt = document.createElement('option');
    opt.value = card.name;
    const label = currentLang === 'en' ? `${card.icon} ${card.en} (${card.name})` : `${card.icon} ${card.name} (${card.en})`;
    opt.textContent = label;
    select.appendChild(opt);
  });
  select.value = currentVal;
}

// Select ticket pill
function selectTicketPill(ticketName) {
  if (selectedTicketPill === ticketName) {
    selectedTicketPill = null;
  } else {
    selectedTicketPill = ticketName;
  }
  const select = document.getElementById('ticketSelectFilter');
  if (select) select.value = selectedTicketPill || '';
  updatePillStyles();
  renderCodex();
}

function updatePillStyles() {
  document.querySelectorAll('.ticket-pill').forEach(pill => {
    if (pill.dataset.ticket === selectedTicketPill) {
      pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-200 font-bold shadow-sm`;
    } else {
      pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-white dark:bg-[#121722] border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-500/50`;
    }
  });
}

function resetTicketPills() {
  selectedTicketPill = null;
  const select = document.getElementById('ticketSelectFilter');
  if (select) select.value = '';
  updatePillStyles();
  renderCodex();
}

// Set Attribute filter in Codex
function setAttrFilter(attr) {
  currentAttrFilter = attr;
  document.querySelectorAll('.attr-tab').forEach(btn => {
    if (btn.dataset.attr === attr) {
      btn.className = "attr-tab px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow";
    } else {
      btn.className = "attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700/70 transition-all border border-slate-300 dark:border-slate-700/40";
    }
  });
  renderCodex();
}

function clearSearch() {
  const input = document.getElementById('heroSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderCodex();
}

function resetAllFilters() {
  const input = document.getElementById('heroSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  selectedTicketPill = null;
  const select = document.getElementById('ticketSelectFilter');
  if (select) select.value = '';
  setAttrFilter('all');
  updatePillStyles();
  renderCodex();
}

// Filter and Render Codex Heroes
function filterCodex() {
  const searchInput = document.getElementById('heroSearchInput');
  const searchVal = searchInput ? searchInput.value.trim() : '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    if (searchVal) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  const select = document.getElementById('ticketSelectFilter');
  const selectVal = select ? select.value : '';
  if (selectVal !== selectedTicketPill) {
    selectedTicketPill = selectVal || null;
    updatePillStyles();
  }

  renderCodex();
}

function renderCodex() {
  const searchInput = document.getElementById('heroSearchInput');
  const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const grid = document.getElementById('codexGrid');
  const emptyState = document.getElementById('codexEmptyState');
  const counterEl = document.getElementById('codexHeroCount');

  if (!grid) return;

  const filtered = HEROES_DATA.filter(h => {
    // Attribute filter
    if (currentAttrFilter !== 'all') {
      if (currentAttrFilter === 'all_attr') {
        if (h.attr !== 'all') return false;
      } else if (h.attr !== currentAttrFilter) {
        return false;
      }
    }

    // Ticket pill/select filter
    if (selectedTicketPill) {
      if (!h.tickets.includes(selectedTicketPill)) return false;
    }

    // Search filter (Chinese name, English name, tickets, aliases, pinyin initials)
    if (search) {
      const matchName = h.name.toLowerCase().includes(search);
      const matchEn = h.en_name.toLowerCase().includes(search);
      const matchKey = h.key.toLowerCase().includes(search);
      const matchAliases = (h.aliases || []).some(a => a.toLowerCase().includes(search));
      const matchTicket = h.tickets.some(t => t.toLowerCase().includes(search));
      const matchTicketEn = (h.tickets_en || []).some(t => t.toLowerCase().includes(search));
      if (!matchName && !matchEn && !matchKey && !matchAliases && !matchTicket && !matchTicketEn) {
        return false;
      }
    }

    return true;
  });

  if (counterEl) {
    counterEl.textContent = t('codexHeroCount', { count: filtered.length });
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // Attribute sections metadata
  const ATTR_SECTIONS = [
    { 
      key: 'str', 
      titleZh: '力量英雄', 
      titleEn: 'Strength Heroes', 
      icon: '🔴', 
      borderClass: 'border-l-4 border-l-red-500', 
      headerBg: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-300', 
      descZh: '刚烈坚韧，擅长前排冲锋与团控，产出【力量】、【隐士】、【皇帝】、【恶魔】等专属票券。',
      descEn: 'Tough and resilient frontliners yielding Strength, The Hermit, The Emperor, The Devil tickets.'
    },
    { 
      key: 'agi', 
      titleZh: '敏捷英雄', 
      titleEn: 'Agility Heroes', 
      icon: '🟢', 
      borderClass: 'border-l-4 border-l-emerald-500', 
      headerBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300', 
      descZh: '灵动迅捷，具备极高的物理爆发与持续输出，产出【隐士】、【死神】、【魔术师】、【命运之轮】等专属票券。',
      descEn: 'Agile damage dealers yielding The Hermit, Death, The Magician, Wheel of Fortune tickets.'
    },
    { 
      key: 'int', 
      titleZh: '智力英雄', 
      titleEn: 'Intelligence Heroes', 
      icon: '🔵', 
      borderClass: 'border-l-4 border-l-sky-500', 
      headerBg: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-300', 
      descZh: '博学通灵，掌控大量戏法、法术爆发与战略支援，产出【魔术师】、【女祭司】、【愚者】、【星星】等专属票券。',
      descEn: 'Scholarly spellcasters yielding The Magician, The High Priestess, The Fool, The Star tickets.'
    },
    { 
      key: 'all', 
      titleZh: '全才英雄', 
      titleEn: 'Universal Heroes', 
      icon: '🟣', 
      borderClass: 'border-l-4 border-l-purple-500', 
      headerBg: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300', 
      descZh: '多维平衡，均衡汲取三大属性精华为战，产出【恋人】、【女祭司】、【命运之轮】、【恶魔】等专属票券。',
      descEn: 'Well-rounded power scaling yielding The Lovers, The High Priestess, Wheel of Fortune, The Devil tickets.'
    }
  ];

  let sectionsHtml = '';
  ATTR_SECTIONS.forEach(sec => {
    const secHeroes = filtered.filter(h => h.attr === sec.key);
    if (secHeroes.length > 0) {
      const secTitle = currentLang === 'en' ? sec.titleEn : sec.titleZh;
      const secSub = currentLang === 'en' ? sec.titleZh : sec.titleEn;
      const secDesc = currentLang === 'en' ? sec.descEn : sec.descZh;
      const heroUnit = currentLang === 'en' ? 'Heroes' : '位';

      sectionsHtml += `
        <div class="space-y-3 pt-2">
          <!-- Attribute Header Banner -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800/80 gap-2">
            <div class="flex items-center space-x-2.5">
              <span class="text-xl">${sec.icon}</span>
              <h2 class="text-base font-bold text-slate-900 dark:text-white tracking-wide">${secTitle}</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">(${secSub})</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${sec.headerBg}">
                ${secHeroes.length} ${heroUnit}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">${secDesc}</p>
          </div>
          <!-- Grid of Cards for this attribute -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
            ${secHeroes.map(h => renderHeroCard(h, sec.borderClass)).join('')}
          </div>
        </div>
      `;
    }
  });

  grid.innerHTML = sectionsHtml;
}

// Render individual hero card in Codex (Clean, compact, NO "设为需求" button)
function renderHeroCard(h, attrBorderClass = '') {
  const attrInfo = ATTR_META[h.attr] || { name: '未知', en: 'Unknown', icon: '⚪', badgeClass: 'bg-slate-700 text-slate-300' };
  
  const heroPrimaryName = currentLang === 'en' ? h.en_name : h.name;
  const heroSecondaryName = currentLang === 'en' ? h.name : h.en_name;
  const attrName = currentLang === 'en' ? attrInfo.en : attrInfo.name;

  // Render 3 ticket cards in a compact horizontal 3-column row
  const ticketBadges = h.tickets.map(tName => {
    const card = CARD_MAP[tName] || { icon: '🃏', color: '#94a3b8', num: '?', en: tName };
    const displayName = currentLang === 'en' ? card.en : tName;
    return `
      <div onclick="openTicketModal('${tName}')" class="cursor-pointer flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 hover:bg-amber-500/10 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-300 transition-all group/t" title="${displayName} (${card.en})">
        <span class="text-base sm:text-lg leading-none">${card.icon}</span>
        <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-medium">${displayName}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="card-glass rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl ${attrBorderClass}">
      <!-- Hero Header -->
      <div class="flex items-center space-x-2.5 mb-2">
        <div class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex-shrink-0">
          <img 
            src="${h.img}" 
            alt="${heroPrimaryName}" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'11\\' font-weight=\\'bold\\'>${h.name.slice(0, 2)}</text></svg>';"
          >
          <span class="absolute bottom-0 right-0 text-[9px] leading-none px-1 py-0.5 rounded-tl bg-black/70 text-white font-mono">
            ${attrInfo.icon}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate" title="${heroPrimaryName}">
              ${heroPrimaryName}
            </h3>
            <span class="text-[9px] px-1.5 py-0.2 rounded font-mono ${attrInfo.badgeClass}">
              ${attrName}
            </span>
          </div>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">${heroSecondaryName}</p>
        </div>
      </div>

      <!-- 3 Tickets in a single compact row -->
      <div class="pt-1.5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-1">
        ${ticketBadges}
      </div>
    </div>
  `;
}

// Open ticket modal
function openTicketModal(ticketName) {
  const card = CARD_MAP[ticketName];
  if (!card) return;

  const displayName = currentLang === 'en' ? card.en : card.name;
  const subName = currentLang === 'en' ? card.name : card.en;

  document.getElementById('modalTicketIcon').textContent = card.icon;
  document.getElementById('modalTicketName').textContent = displayName;
  document.getElementById('modalTicketNum').textContent = t('modalTarotNum', { num: card.num });
  document.getElementById('modalTicketEn').textContent = subName;
  document.getElementById('modalTicketDesc').textContent = t('modalDescPrefix', { desc: card.desc });

  const heroes = HEROES_DATA.filter(h => h.tickets.includes(ticketName));
  document.getElementById('modalHeroCount').textContent = t('modalHeroCount', { count: heroes.length });

  const listContainer = document.getElementById('modalHeroList');
  listContainer.innerHTML = heroes.map(h => {
    const attrInfo = ATTR_META[h.attr];
    const heroName = currentLang === 'en' ? h.en_name : h.name;
    return `
      <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <span>${attrInfo.icon}</span>
        <span class="font-medium text-slate-700 dark:text-slate-200">${heroName}</span>
      </div>
    `;
  }).join('');

  document.getElementById('ticketModal').classList.remove('hidden');
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.add('hidden');
}

// ==================== RECOMMENDATION & SETUP LOGIC (Clean & Compact) ====================

// Render streamlined ticket setup grid (Height-efficient, no scrollbar, gorgeous micro-controls)
function renderTicketSetupGrid() {
  const grid = document.getElementById('ticketSetupGrid');
  if (!grid) return;

  grid.innerHTML = TAROT_CARDS.map(card => {
    const owned = ownedTickets[card.name] || 0;
    const needed = neededTickets[card.name] || 0;
    const deficit = Math.max(0, needed - owned);

    const cardDisplayName = currentLang === 'en' ? card.en : card.name;

    let deficitBadge = '';
    if (needed === 0) {
      deficitBadge = `<span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">${t('statusNoNeed')}</span>`;
    } else if (deficit === 0) {
      deficitBadge = `<span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-md border border-emerald-500/30">${t('statusMet')}</span>`;
    } else {
      deficitBadge = `<span class="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded-md border border-rose-500/30">${t('statusDeficit', { n: deficit })}</span>`;
    }

    return `
      <div class="card-glass rounded-xl p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 shadow-sm hover:border-amber-500/40 transition-all">
        <!-- Left: Icon & Name & Deficit Status -->
        <div class="flex items-center space-x-2 min-w-0 flex-1">
          <span class="text-xl sm:text-2xl flex-shrink-0 cursor-pointer select-none" onclick="openTicketModal('${card.name}')">${card.icon}</span>
          <div class="min-w-0 flex-1">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:text-amber-500 transition-colors" onclick="openTicketModal('${card.name}')" title="${cardDisplayName} (${card.en})">${cardDisplayName}</div>
            <div class="mt-0.5">${deficitBadge}</div>
          </div>
        </div>

        <!-- Right: Inline Stepper Controls (Owned & Need) -->
        <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <!-- Owned Stepper -->
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-none mb-1">${t('ownedLabel')}</span>
            <div class="flex items-center h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-sm overflow-hidden">
              <button 
                onclick="changeOwned('${card.name}', -1)" 
                class="w-7 sm:w-8 h-full flex items-center justify-center text-sm font-black text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 active:scale-90 transition-all select-none cursor-pointer"
                title="减少拥有量"
              >-</button>
              <input 
                type="number" 
                min="0" 
                value="${owned}" 
                onchange="setOwned('${card.name}', this.value)" 
                class="w-7 sm:w-8 h-full text-center text-xs sm:text-sm font-extrabold bg-transparent text-emerald-800 dark:text-emerald-200 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <button 
                onclick="changeOwned('${card.name}', 1)" 
                class="w-7 sm:w-8 h-full flex items-center justify-center text-sm font-black text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 active:scale-90 transition-all select-none cursor-pointer"
                title="增加拥有量"
              >+</button>
            </div>
          </div>

          <!-- Need Stepper -->
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-none mb-1">${t('needLabel')}</span>
            <div class="flex items-center h-8 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/40 shadow-sm overflow-hidden">
              <button 
                onclick="changeNeeded('${card.name}', -1)" 
                class="w-7 sm:w-8 h-full flex items-center justify-center text-sm font-black text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 active:scale-90 transition-all select-none cursor-pointer"
                title="减少需求量"
              >-</button>
              <input 
                type="number" 
                min="0" 
                value="${needed}" 
                onchange="setNeeded('${card.name}', this.value)" 
                class="w-7 sm:w-8 h-full text-center text-xs sm:text-sm font-extrabold bg-transparent text-amber-800 dark:text-amber-200 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <button 
                onclick="changeNeeded('${card.name}', 1)" 
                class="w-7 sm:w-8 h-full flex items-center justify-center text-sm font-black text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 active:scale-90 transition-all select-none cursor-pointer"
                title="增加需求量"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function changeOwned(cardName, delta) {
  ownedTickets[cardName] = Math.max(0, (ownedTickets[cardName] || 0) + delta);
  renderTicketSetupGrid();
  updateRecommendations();
}

function setOwned(cardName, val) {
  ownedTickets[cardName] = Math.max(0, parseInt(val) || 0);
  renderTicketSetupGrid();
  updateRecommendations();
}

function changeNeeded(cardName, delta) {
  neededTickets[cardName] = Math.max(0, (neededTickets[cardName] || 0) + delta);
  renderTicketSetupGrid();
  updateRecommendations();
}

function setNeeded(cardName, val) {
  neededTickets[cardName] = Math.max(0, parseInt(val) || 0);
  renderTicketSetupGrid();
  updateRecommendations();
}

// Reset all counts
function resetSetup() {
  TAROT_CARDS.forEach(c => {
    ownedTickets[c.name] = 0;
    neededTickets[c.name] = 0;
  });
  renderTicketSetupGrid();
  updateRecommendations();
  showToast(t('resetToast'), '🧹');
}

// Set Attribute filter for Recommendations
function setRecomAttrFilter(attr) {
  currentRecomAttrFilter = attr;
  document.querySelectorAll('.recom-attr-btn').forEach(btn => {
    if (btn.dataset.attr === attr) {
      btn.className = "recom-attr-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow";
    } else {
      btn.className = "recom-attr-btn px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-300 dark:border-slate-700/40";
    }
  });
  updateRecommendations();
}

// Calculate Deficits & Recommendations
function updateRecommendations() {
  let totalNeeded = 0;
  let totalOwned = 0;
  let totalDeficit = 0;
  const deficits = {};

  TAROT_CARDS.forEach(c => {
    const o = ownedTickets[c.name] || 0;
    const n = neededTickets[c.name] || 0;
    const def = Math.max(0, n - o);
    deficits[c.name] = def;
    totalNeeded += n;
    totalOwned += o;
    totalDeficit += def;
  });

  // Update overview statistics
  const statNeeded = document.getElementById('statTotalNeeded');
  const statOwned = document.getElementById('statTotalOwned');
  const statDeficit = document.getElementById('statTotalDeficit');

  if (statNeeded) statNeeded.innerHTML = `${totalNeeded} <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">${t('unitCards')}</span>`;
  if (statOwned) statOwned.innerHTML = `${totalOwned} <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">${t('unitCards')}</span>`;
  if (statDeficit) statDeficit.innerHTML = `${totalDeficit} <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">${t('unitCards')}</span>`;

  // Update nav badge
  const navBadge = document.getElementById('navDeficitBadge');
  if (navBadge) {
    if (totalDeficit > 0) {
      navBadge.textContent = totalDeficit;
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }

  // Zero-demand guide display
  const noDemandGuide = document.getElementById('noDemandGuide');
  if (noDemandGuide) {
    if (totalNeeded === 0 && totalDeficit === 0) {
      noDemandGuide.classList.remove('hidden');
    } else {
      noDemandGuide.classList.add('hidden');
    }
  }

  // Calculate recommendations for all heroes
  const tier1 = [];
  const tier2 = [];
  const tier3 = [];

  HEROES_DATA.forEach(h => {
    // Filter by recommendation attribute preference
    if (currentRecomAttrFilter !== 'all') {
      if (currentRecomAttrFilter === 'all_attr') {
        if (h.attr !== 'all') return;
      } else if (h.attr !== currentRecomAttrFilter) {
        return;
      }
    }

    const [t1, t2, t3] = h.tickets;
    const combos = [
      [t1, t2],
      [t1, t3],
      [t2, t3]
    ];

    // Evaluate useful yield for each combo
    let usefulCounts = [];
    combos.forEach(([a, b]) => {
      let u = 0;
      if (a === b) {
        u += Math.min(2, deficits[a] || 0);
      } else {
        if ((deficits[a] || 0) > 0) u += 1;
        if ((deficits[b] || 0) > 0) u += 1;
      }
      usefulCounts.push(u);
    });

    const expectedYield = usefulCounts.reduce((acc, v) => acc + v, 0) / 3.0;
    const p2 = usefulCounts.filter(u => u === 2).length / 3.0;
    const p1 = usefulCounts.filter(u => u === 1).length / 3.0;
    const p0 = usefulCounts.filter(u => u === 0).length / 3.0;

    // Count distinct tickets that match active deficits
    const matchedTickets = h.tickets.filter(t => (deficits[t] || 0) > 0);
    const matchCount = matchedTickets.length;

    // Sum of deficits for sorting priority
    const matchedDeficitSum = matchedTickets.reduce((acc, t) => acc + (deficits[t] || 0), 0);

    const recItem = {
      hero: h,
      expectedYield: expectedYield,
      p2: p2,
      p1: p1,
      p0: p0,
      matchedTickets: matchedTickets,
      matchCount: matchCount,
      matchedDeficitSum: matchedDeficitSum
    };

    // Tier classification strictly adhering to the prompt:
    // Tier 1: 3/3 tickets needed in deficit (expected yield = 2.0)
    // Tier 2: 2/3 tickets needed in deficit (expected yield = 1.33)
    // Tier 3: 1/3 tickets needed in deficit (expected yield = 0.67)
    if (matchCount === 3 && expectedYield >= 1.8) {
      tier1.push(recItem);
    } else if (matchCount === 2) {
      tier2.push(recItem);
    } else if (matchCount === 1) {
      tier3.push(recItem);
    }
  });

  // Sort tiers: higher deficit sum first, then higher expected yield
  tier1.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);
  tier2.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);
  tier3.sort((a, b) => b.matchedDeficitSum - a.matchedDeficitSum || b.expectedYield - a.expectedYield);

  // Estimated wins needed
  let estimatedGames = 0;
  if (totalDeficit > 0) {
    const bestExpected = tier1.length > 0 ? 2.0 : (tier2.length > 0 ? 1.33 : 0.67);
    estimatedGames = Math.ceil(totalDeficit / bestExpected);
  }
  const statGames = document.getElementById('statEstimatedGames');
  if (statGames) statGames.innerHTML = `${estimatedGames} <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">${t('unitWins')}</span>`;

  // Render the tier sections
  renderTierSection('tier1', tier1, deficits);
  renderTierSection('tier2', tier2, deficits);
  renderTierSection('tier3', tier3, deficits);
}

function renderTierSection(tierId, list, deficits) {
  const grid = document.getElementById(`${tierId}Grid`);
  const emptyEl = document.getElementById(`${tierId}Empty`);
  const countEl = document.getElementById(`${tierId}Count`);

  const unitStr = currentLang === 'en' ? 'Heroes' : '位英雄';
  if (countEl) countEl.textContent = `${list.length} ${unitStr}`;
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  grid.innerHTML = list.map(item => {
    const h = item.hero;
    const attrInfo = ATTR_META[h.attr] || { name: '未知', en: 'Unknown', icon: '⚪', badgeClass: 'text-slate-400' };

    const heroPrimaryName = currentLang === 'en' ? h.en_name : h.name;

    // Highlight matched tickets with icon & glowing background
    const ticketsHtml = h.tickets.map(tName => {
      const isNeeded = (deficits[tName] || 0) > 0;
      const card = CARD_MAP[tName] || { icon: '🃏', en: tName };
      const defCount = deficits[tName] || 0;
      const displayName = currentLang === 'en' ? card.en : tName;

      if (isNeeded) {
        const titleText = currentLang === 'en' ? `${displayName}: ${defCount} needed (High Priority)` : `${tName}: 仍缺 ${defCount} 张 (急需获取)`;
        return `
          <div class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-amber-500/20 dark:bg-amber-500/25 border border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-bold transition-all" title="${titleText}">
            <span class="text-base sm:text-lg leading-none">${card.icon}</span>
            <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-bold">${displayName}</span>
          </div>
        `;
      } else {
        const titleText = currentLang === 'en' ? `${displayName}: Fulfilled` : `${tName}: 已满足 (非急需)`;
        return `
          <div class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 opacity-50 transition-all" title="${titleText}">
            <span class="text-base sm:text-lg leading-none">${card.icon}</span>
            <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-normal">${displayName}</span>
          </div>
        `;
      }
    }).join('');

    let tierBadge = '';
    if (item.matchCount === 3) {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">3/3</span>`;
    } else if (item.matchCount === 2) {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40">2/3</span>`;
    } else {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40">1/3</span>`;
    }

    const expText = t('expectedYield', { val: item.expectedYield.toFixed(2) });

    return `
      <div class="card-glass rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl">
        <!-- Hero Info -->
        <div class="flex items-center space-x-2.5">
          <div class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex-shrink-0">
            <img 
              src="${h.img}" 
              alt="${heroPrimaryName}" 
              class="w-full h-full object-cover"
              loading="lazy"
              onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'11\\' font-weight=\\'bold\\'>${h.name.slice(0, 2)}</text></svg>';"
            >
            <span class="absolute bottom-0 right-0 text-[9px] px-1 py-0.5 rounded-tl bg-black/70 text-white">
              ${attrInfo.icon}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate" title="${heroPrimaryName}">${heroPrimaryName}</h4>
              ${tierBadge}
            </div>
            <div class="text-[10px] text-amber-700 dark:text-amber-400 font-medium truncate mt-0.5">
              ${expText}
            </div>
          </div>
        </div>

        <!-- 3 Tickets in a single compact row with glowing background for matches -->
        <div class="grid grid-cols-3 gap-1 mt-2">
          ${ticketsHtml}
        </div>
      </div>
    `;
  }).join('');
}


// Toast notification
let toastTimeout = null;
function showToast(msg, icon = '✨') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;

  toast.classList.remove('translate-x-full', 'opacity-0');
  toast.classList.add('translate-x-0', 'opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    toast.classList.remove('translate-x-0', 'opacity-100');
  }, 3500);
}
