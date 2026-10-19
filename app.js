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
    navBadge: "百戏大王专列 · v2.5.0",
    tabCodex: "英雄票券图鉴",
    tabRecom: "筛选与智能推荐",
    langBtn: "English",
    repoTooltip: "GitHub 源码仓库",
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
    mechTier1Sub: "3 张票券全部为急需！无论抽到哪 2 张都 100% 契合需求，期望最高达 2.0 张/局，零浪费。",
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
    setupSubtitle: "设置拥有的票券与通关所需的目标票券，系统实时计算净缺口并推演最优英雄与交易路线",
    resetBtn: "清空重置",
    ownedLabel: "拥有",
    needLabel: "目标",
    statusNoNeed: "未设需求",
    statusMet: "✓ 已达成",
    statusDeficit: "缺 {n} 张",
    statusSurplus: "溢出 +{n}",
    statusMetSurplus: "满 (溢+{n})",
    progressLabel: "达成进度",
    nextTradeProgress: "下次兑换进度",
    quickTradeStep: "快捷增减",
    scrapSub: "6 废票 = 任意 1 票",
    scrapShortfall: "差 {n} 张",
    scrapCanTrade: "可换 {n} 张",
    // Recommendations
    recomTitle: "智能英雄推荐",
    recomSubtitle: "基于 3 抽 2 随机掉落概率计算净缺口收益期望，自动分档呈现最优出战英雄",
    allAttrs: "全部属性",
    noDemandTitle: "当前未设定票券需求",
    noDemandDesc: "请在上方【票券库存与目标需求】中点击对应票券的【需求 [+]】按钮，系统将根据 3 抽 2 概率实时为您计算最优通关英雄！",
    tier1Title: "🥇 第 1 档 · 极力推荐",
    tier1Sub: "3/3 需求完美匹配 | 0% 浪费率 | 单局最高期望 2.0 张",
    tier1Empty: "暂无 3 张票券全部命中的完美英雄。请查看第 2 档高效英雄组合！",
    tier2Title: "🥈 第 2 档 · 高效精选",
    tier2Sub: "2/3 需求匹配 | 保底 100% 获得至少 1 张所需 | 期望 1.33 张/局",
    tier2Empty: "当前无第 2 档推荐英雄。",
    tier3Title: "🥉 第 3 档 · 备选补充",
    tier3Sub: "1/3 需求匹配 | 66.7% 概率获得 1 张所需 | 期望 0.67 张/局",
    tier3Empty: "当前无第 3 档推荐英雄。",
    expectedYield: "期望: <span class=\"font-bold text-amber-600 dark:text-amber-300\">{val}</span> 张/局",
    resetToast: "已清空全部票券设置！",
    // Trading & Clearance Plan
    scrapTitle: "通用废票",
    scrapDesc: "6 张废票可兑换任意 1 张塔罗票券",
    planSectionTitle: "最快最稳通关路径规划",
    planSectionSub: "根据当前票券库存、废票与交易规则，推演达成目标的最少对局场次与最优出战路线",
    tradeConfigLabel: "交易兑换选项：",
    tradeRuleScrapText: "🎟️ 废票兑换 (6换1)",
    tradeRuleThreeText: "🃏 相同 3 换 1",
    tradeRuleFourText: "🎴 不同 4 换 1",
    planStatFastest: "⚡ 理论最快 {n} 局",
    planStatExpected: "🛡️ 稳健推荐 {n} 局",
    planStepTradeTitle: "步骤 1：即时交易兑换方案",
    applyTradesBtn: "一键执行上述兑换",
    tradeAppliedToast: "已成功应用兑换方案！库存与需求已更新。",
    planStepMatchTitle: "步骤 2：对局出战规划路线（按最少场次排布）",
    planStepSummaryTitle: "步骤 3：通关达成与场次总结",
    planNoDeficitTitle: "暂无目标票券缺口",
    planNoDeficitDesc: "在上方卡片设置您所需的票券数量，系统将自动规划出最快最稳的通关路线与交易方案。",
    planAllMetTitle: "所有需求票券已全部集齐！",
    planAllMetDesc: "无需额外对局，您可以直接前往百戏专列兑换奖励！",
    planTradeCoverAll: "🎉 通过上述交易即可完全满足所有缺口，理论最快 0 局通关！",
    planStageTarget: "目标获取：",
    planStageWins: "最快 {fastest} 局 | 稳健 {expected} 局",
    planSummaryInitial: "初始缺口：",
    planSummaryTradeReduced: "交易减免：",
    planSummaryRemaining: "对局所需：",
    planSummaryFastest: "理论最快：",
    planSummaryExpected: "稳健推荐：",
    planStrategyTip: "💡 策略建议：优先出战第 1 档英雄，胜局 100% 出现 2 张所需票券，效率最高！对局抽到其它票券时，可随时在上方更新库存，系统将实时重新规划路线。",
    presetAll1BtnText: "全套各 1 张",
    presetAll2BtnText: "全套各 2 张",
    presetAppliedToast: "已将所有票券需求预设为各 {count} 张！",
    copyPlanBtnText: "复制路线",
    planCopiedToast: "通关路线方案已复制到剪贴板！",
    planStageAlts: "备选：",
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
    navBadge: "Ringmaster Train · v2.5.0",
    tabCodex: "Hero Ticket Codex",
    tabRecom: "Filter & Recommendations",
    langBtn: "中文",
    repoTooltip: "GitHub Repository",
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
    mechTier1Sub: "All 3 tickets needed! 100% useful regardless of drop, expected yield up to 2.0 tickets/win, 0% waste.",
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
    setupTitle: "Ticket Inventory & Target Goals",
    setupSubtitle: "Configure your owned tickets and target demands to calculate real-time deficits and clearance routes",
    resetBtn: "Reset All",
    ownedLabel: "Owned",
    needLabel: "Target",
    statusNoNeed: "No Target",
    statusMet: "✓ Met",
    statusDeficit: "Need {n}",
    statusSurplus: "Surplus +{n}",
    statusMetSurplus: "Met (+{n})",
    progressLabel: "Progress",
    nextTradeProgress: "Next Trade",
    quickTradeStep: "Quick Trade",
    scrapSub: "6 Scrap = Any 1 Card",
    scrapShortfall: "{n} to Trade",
    scrapCanTrade: "Can Trade {n}",
    // Recommendations
    recomTitle: "Smart Hero Recommendations",
    recomSubtitle: "Ranked by expected net deficit yield based on 2-of-3 drop odds to find your optimal heroes.",
    allAttrs: "All Attributes",
    noDemandTitle: "No Ticket Demands Set",
    noDemandDesc: "Click the [+] button under [Need] for target tickets above. The solver will instantly calculate the best heroes!",
    tier1Title: "🥇 Tier 1 · Highly Recommended",
    tier1Sub: "3/3 Demand Matched | 0% Waste | Up to 2.0 / win",
    tier1Empty: "No Tier 1 heroes match all 3 tickets currently. Check Tier 2 choices!",
    tier2Title: "🥈 Tier 2 · High Efficiency",
    tier2Sub: "2/3 Demand Matched | Guaranteed >=1 needed | Expected 1.33 / win",
    tier2Empty: "No Tier 2 heroes for current deficits.",
    tier3Title: "🥉 Tier 3 · Alternative Picks",
    tier3Sub: "1/3 Demand Matched | 66.7% chance for 1 needed | Expected 0.67 / win",
    tier3Empty: "No Tier 3 heroes for current deficits.",
    expectedYield: "Exp: <span class=\"font-bold text-amber-600 dark:text-amber-300\">{val}</span> / win",
    resetToast: "All ticket counts have been reset!",
    // Trading & Clearance Plan
    scrapTitle: "Scrap Ticket",
    scrapDesc: "6 Scrap Tickets can be traded for any 1 Tarot ticket",
    planSectionTitle: "Optimal Clearance Path & Trading Plan",
    planSectionSub: "Calculates the minimum matches and step-by-step hero roadmap based on inventory, scrap, and trade rules",
    tradeConfigLabel: "Trade Options:",
    tradeRuleScrapText: "🎟️ Scrap Trade (6 to 1)",
    tradeRuleThreeText: "🃏 3 Identical to 1",
    tradeRuleFourText: "🎴 4 Distinct to 1",
    planStatFastest: "⚡ Best-case {n} wins",
    planStatExpected: "🛡️ Expected {n} wins",
    planStepTradeTitle: "Step 1: Direct Inventory Trades",
    applyTradesBtn: "Apply Trades to Inventory",
    tradeAppliedToast: "Trades applied successfully! Inventory updated.",
    planStepMatchTitle: "Step 2: Recommended Hero Match Stages (Sorted by Min Matches)",
    planStepSummaryTitle: "Step 3: Clearance Goal & Match Summary",
    planNoDeficitTitle: "No Target Deficits",
    planNoDeficitDesc: "Set your needed ticket counts above to calculate the fastest path and trade solutions.",
    planAllMetTitle: "All Needed Tickets Acquired!",
    planAllMetDesc: "No matches required. You can proceed directly to unlock the circus train nodes!",
    planTradeCoverAll: "🎉 All deficits satisfied via inventory trades! Best-case 0 wins needed!",
    planStageTarget: "Target Tickets:",
    planStageWins: "Best {fastest} wins | Exp {expected} wins",
    planSummaryInitial: "Initial Deficit:",
    planSummaryTradeReduced: "Trade Reduction:",
    planSummaryRemaining: "Match Demand:",
    planSummaryFastest: "Best-case Wins:",
    planSummaryExpected: "Expected Wins:",
    planStrategyTip: "💡 Strategy Tip: Prioritize Tier 1 heroes to guarantee 2 needed tickets per win! If you receive other tickets, update your inventory anytime for instant re-planning.",
    presetAll1BtnText: "All 1x",
    presetAll2BtnText: "All 2x",
    presetAppliedToast: "All ticket requirements set to {count}x!",
    copyPlanBtnText: "Copy Plan",
    planCopiedToast: "Clearance roadmap copied to clipboard!",
    planStageAlts: "Alts:",
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
let ownedScrap = 0;
let tradeConfig = {
  enableScrap: true,
  enableThreeToOne: false,
  enableFourToOne: false
};
let lastCalculatedPlan = null;

// Initialize default ticket counts (clean 0 by default, no preset)
TAROT_CARDS.forEach(c => {
  ownedTickets[c.name] = 0;
  neededTickets[c.name] = 0;
});

// State Persistence (Auto-save progress in localStorage)
function saveStateToStorage() {
  try {
    const payload = {
      ownedTickets,
      neededTickets,
      ownedScrap,
      tradeConfig
    };
    localStorage.setItem('dota2_carnival_state', JSON.stringify(payload));
  } catch (e) {
    // Ignore storage quota limits
  }
}

function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem('dota2_carnival_state');
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.ownedTickets) {
      TAROT_CARDS.forEach(c => {
        if (typeof state.ownedTickets[c.name] === 'number') {
          ownedTickets[c.name] = Math.max(0, state.ownedTickets[c.name]);
        }
      });
    }
    if (state.neededTickets) {
      TAROT_CARDS.forEach(c => {
        if (typeof state.neededTickets[c.name] === 'number') {
          neededTickets[c.name] = Math.max(0, state.neededTickets[c.name]);
        }
      });
    }
    if (typeof state.ownedScrap === 'number') {
      ownedScrap = Math.max(0, state.ownedScrap);
    }
    if (state.tradeConfig) {
      tradeConfig.enableScrap = state.tradeConfig.enableScrap !== false;
      tradeConfig.enableThreeToOne = !!state.tradeConfig.enableThreeToOne;
      tradeConfig.enableFourToOne = !!state.tradeConfig.enableFourToOne;
    }
  } catch (e) {
    // Ignore parse errors
  }
}

// Initialize application on DOM ready
function initApp() {
  loadStateFromStorage();
  applyTheme();
  applyLanguage();
  populateTicketPills();
  populateTicketSelect();
  renderCodex();
  renderTicketSetupGrid();
  updateRecommendations();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Global keyboard shortcuts (Escape to close modals)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTicketModal();
  }
});

// ==================== THEME MANAGEMENT ====================
function applyTheme() {
  const root = document.documentElement;
  const iconEl = document.getElementById('themeBtnIcon');
  if (currentTheme === 'dark') {
    if (root && root.classList) root.classList.add('dark');
    if (iconEl) iconEl.textContent = '☀️'; // Shows sun to switch to light
  } else {
    if (root && root.classList) root.classList.remove('dark');
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
  const root = document.documentElement;
  if (root && root.setAttribute) {
    root.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
  }
  
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
  const repoBtn = document.getElementById('repoLinkBtn');
  if (repoBtn) repoBtn.title = t('repoTooltip');

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

  // Clearance Plan Section
  setElText('planSectionTitle', t('planSectionTitle'));
  setElText('planSectionSub', t('planSectionSub'));
  setElText('tradeConfigLabel', t('tradeConfigLabel'));
  setElText('tradeRuleScrapText', t('tradeRuleScrapText'));
  setElText('tradeRuleThreeText', t('tradeRuleThreeText'));
  setElText('tradeRuleFourText', t('tradeRuleFourText'));
  setElText('copyPlanBtnText', t('copyPlanBtnText'));
  updateTradeToggleUI();

  // Setup Section
  setElText('setupSectionTitle', t('setupTitle'));
  setElText('setupSectionSub', t('setupSubtitle'));
  setElText('presetAll1BtnText', t('presetAll1BtnText'));
  setElText('presetAll2BtnText', t('presetAll2BtnText'));
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

  const activeClasses = "flex-1 md:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 select-none cursor-pointer bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-amber-500/40 dark:border-amber-400/40 ring-1 ring-amber-500/20 dark:ring-amber-400/20";
  const inactiveClasses = "flex-1 md:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 select-none cursor-pointer text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-300/40 dark:hover:bg-slate-800/50 border border-transparent";

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
  const modal = document.getElementById('ticketModal');
  if (modal) modal.classList.add('hidden');
}

function handleTicketModalBackdrop(event) {
  if (event && event.target === event.currentTarget) {
    closeTicketModal();
  }
}

// ==================== RECOMMENDATION & SETUP LOGIC (Clean & Compact) ====================

// Render redesigned ticket setup grid (High-aesthetic Tarot Cards + Dedicated Pods + Progress Bars)
function renderTicketSetupGrid() {
  const grid = document.getElementById('ticketSetupGrid');
  if (!grid) return;

  const isZh = currentLang === 'zh';
  const tipMinusOwned = isZh ? '减少拥有量' : 'Decrease Owned';
  const tipPlusOwned = isZh ? '增加拥有量' : 'Increase Owned';
  const tipMinusNeed = isZh ? '减少需求量' : 'Decrease Need';
  const tipPlusNeed = isZh ? '增加需求量' : 'Increase Need';
  const tipMinusScrap = isZh ? '减少 1 张废票' : 'Decrease 1 Scrap';
  const tipPlusScrap = isZh ? '增加 1 张废票' : 'Increase 1 Scrap';
  const tipMinus6Scrap = isZh ? '快捷减少 6 张废票 (1次兑换)' : 'Quick -6 Scrap (1 Trade)';
  const tipPlus6Scrap = isZh ? '快捷增加 6 张废票 (1次兑换)' : 'Quick +6 Scrap (1 Trade)';

  const tarotCardsHtml = TAROT_CARDS.map(card => {
    const owned = ownedTickets[card.name] || 0;
    const needed = neededTickets[card.name] || 0;
    const deficit = Math.max(0, needed - owned);
    const surplus = Math.max(0, owned - needed);

    const cardDisplayName = currentLang === 'en' ? card.en : card.name;
    const cardSubName = currentLang === 'en' ? card.name : card.en;

    // Status Badge & Progress Calculation
    let deficitBadge = '';
    let progressPercent = 0;
    let progressText = '0%';
    let progressTrackClass = 'bg-slate-200 dark:bg-slate-800';
    let progressFillClass = 'bg-slate-300 dark:bg-slate-700';

    if (needed === 0) {
      if (owned > 0) {
        deficitBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 whitespace-nowrap">${t('statusSurplus', { n: owned })}</span>`;
        progressPercent = 100;
        progressText = `+${owned}`;
        progressFillClass = 'bg-gradient-to-r from-purple-500 to-indigo-500';
      } else {
        deficitBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 whitespace-nowrap">${t('statusNoNeed')}</span>`;
        progressPercent = 0;
        progressText = '0%';
        progressFillClass = 'bg-slate-300 dark:bg-slate-700';
      }
    } else if (deficit === 0) {
      if (surplus > 0) {
        deficitBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)] whitespace-nowrap">${t('statusMetSurplus', { n: surplus })}</span>`;
      } else {
        deficitBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)] whitespace-nowrap">${t('statusMet')}</span>`;
      }
      progressPercent = 100;
      progressText = `${owned}/${needed} (100%)`;
      progressFillClass = 'bg-gradient-to-r from-emerald-500 to-teal-400';
    } else {
      deficitBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)] whitespace-nowrap">${t('statusDeficit', { n: deficit })}</span>`;
      progressPercent = Math.min(100, Math.round((owned / needed) * 100));
      progressText = `${owned}/${needed} (${progressPercent}%)`;
      progressFillClass = 'bg-gradient-to-r from-amber-500 to-rose-500';
    }

    return `
      <div class="card-glass rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 dark:border-slate-800/80 hover:border-amber-500/40 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-2.5">
        <!-- Top Row: Icon, Roman Numeral, Card Name & Dynamic Status Badge -->
        <div class="flex items-center justify-between gap-1.5">
          <div class="flex items-center space-x-2 min-w-0 cursor-pointer group/title" onclick="openTicketModal('${card.name}')" title="${cardDisplayName} (${card.en})">
            <span class="text-2xl sm:text-3xl flex-shrink-0 transition-transform group-hover/title:scale-110 select-none">${card.icon}</span>
            <div class="min-w-0">
              <div class="flex items-center space-x-1">
                <span class="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-semibold leading-none">${card.num}</span>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover/title:text-amber-500 transition-colors">${cardDisplayName}</h3>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 truncate block leading-tight mt-0.5">${cardSubName}</span>
            </div>
          </div>
          <div class="flex-shrink-0">
            ${deficitBadge}
          </div>
        </div>

        <!-- Middle Row: Slim Visual Progress Bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[10px] font-mono leading-none">
            <span class="text-slate-400 dark:text-slate-500">${t('progressLabel')}</span>
            <span class="font-bold text-slate-600 dark:text-slate-300">${progressText}</span>
          </div>
          <div class="w-full h-1.5 rounded-full ${progressTrackClass} overflow-hidden">
            <div class="h-full rounded-full ${progressFillClass} transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- Bottom Row: Ergonomic Dual Pods (Owned Inventory vs Target Demand) -->
        <div class="grid grid-cols-2 gap-2 pt-0.5">
          <!-- Left Pod: 拥有 (Owned) -->
          <div class="rounded-xl p-1.5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-col items-center">
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 leading-none">${t('ownedLabel')}</span>
            <div class="flex items-center justify-between w-full h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 overflow-hidden shadow-xs">
              <button 
                onclick="changeOwned('${card.name}', -1)" 
                class="w-7 h-full flex items-center justify-center text-sm font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-90 transition select-none cursor-pointer"
                title="${tipMinusOwned}"
              >-</button>
              <input 
                type="number" 
                min="0" 
                value="${owned}" 
                onchange="setOwned('${card.name}', this.value)" 
                class="w-8 h-full text-center text-xs font-mono font-black bg-transparent text-emerald-800 dark:text-emerald-200 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <button 
                onclick="changeOwned('${card.name}', 1)" 
                class="w-7 h-full flex items-center justify-center text-sm font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-90 transition select-none cursor-pointer"
                title="${tipPlusOwned}"
              >+</button>
            </div>
          </div>

          <!-- Right Pod: 目标 (Target Demand) -->
          <div class="rounded-xl p-1.5 bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 flex flex-col items-center">
            <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1 leading-none">${t('needLabel')}</span>
            <div class="flex items-center justify-between w-full h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 overflow-hidden shadow-xs">
              <button 
                onclick="changeNeeded('${card.name}', -1)" 
                class="w-7 h-full flex items-center justify-center text-sm font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-90 transition select-none cursor-pointer"
                title="${tipMinusNeed}"
              >-</button>
              <input 
                type="number" 
                min="0" 
                value="${needed}" 
                onchange="setNeeded('${card.name}', this.value)" 
                class="w-8 h-full text-center text-xs font-mono font-black bg-transparent text-amber-800 dark:text-amber-200 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <button 
                onclick="changeNeeded('${card.name}', 1)" 
                class="w-7 h-full flex items-center justify-center text-sm font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-90 transition select-none cursor-pointer"
                title="${tipPlusNeed}"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 12th Card: Universal Scrap Ticket (🎟️ 通用废票 - Carnival Golden Currency)
  const scrapExchangeCount = Math.floor(ownedScrap / 6);
  const remainderToTrade = 6 - (ownedScrap % 6);
  const scrapProgressPercent = Math.round(((ownedScrap % 6) / 6) * 100);

  const scrapBadge = scrapExchangeCount > 0
    ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] whitespace-nowrap">${t('scrapCanTrade', { n: scrapExchangeCount })}</span>`
    : `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 whitespace-nowrap">${t('scrapShortfall', { n: remainderToTrade })}</span>`;

  const scrapCardHtml = `
    <div class="card-glass rounded-2xl p-3 sm:p-3.5 border-2 border-amber-500/40 hover:border-amber-500/70 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-purple-500/5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-2.5">
      <!-- Top Row: Icon, Currency Tag, Title & Trade Power Badge -->
      <div class="flex items-center justify-between gap-1.5">
        <div class="flex items-center space-x-2 min-w-0" title="${t('scrapDesc')}">
          <span class="text-2xl sm:text-3xl flex-shrink-0 select-none">🎟️</span>
          <div class="min-w-0">
            <div class="flex items-center space-x-1">
              <span class="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold leading-none">BANK</span>
              <h3 class="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 truncate">${t('scrapTitle')}</h3>
            </div>
            <span class="text-[10px] text-amber-600/80 dark:text-amber-400/80 truncate block leading-tight mt-0.5">${t('scrapSub')}</span>
          </div>
        </div>
        <div class="flex-shrink-0">
          ${scrapBadge}
        </div>
      </div>

      <!-- Middle Row: Next Trade Cycle Progress -->
      <div class="space-y-1">
        <div class="flex items-center justify-between text-[10px] font-mono leading-none">
          <span class="text-amber-700/80 dark:text-amber-300/80 font-medium">${t('nextTradeProgress')}</span>
          <span class="font-bold text-amber-700 dark:text-amber-300">${ownedScrap % 6} / 6 (${scrapProgressPercent}%)</span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-amber-950/20 dark:bg-amber-950/40 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-300" style="width: ${((ownedScrap % 6) / 6) * 100}%"></div>
        </div>
      </div>

      <!-- Bottom Row: Dual Pods (Scrap Owned Stepper + Quick Trade Shortcuts) -->
      <div class="grid grid-cols-2 gap-2 pt-0.5">
        <!-- Left Pod: 废票存量 -->
        <div class="rounded-xl p-1.5 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col items-center">
          <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 mb-1 leading-none">${t('ownedLabel')}</span>
          <div class="flex items-center justify-between w-full h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-amber-500/40 overflow-hidden shadow-xs">
            <button 
              onclick="changeScrap(-1)" 
              class="w-7 h-full flex items-center justify-center text-sm font-black text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-90 transition select-none cursor-pointer"
              title="${tipMinusScrap}"
            >-</button>
            <input 
              type="number" 
              min="0" 
              value="${ownedScrap}" 
              onchange="setScrap(this.value)" 
              class="w-8 h-full text-center text-xs font-mono font-black bg-transparent text-amber-800 dark:text-amber-200 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            >
            <button 
              onclick="changeScrap(1)" 
              class="w-7 h-full flex items-center justify-center text-sm font-black text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-90 transition select-none cursor-pointer"
              title="${tipPlusScrap}"
            >+</button>
          </div>
        </div>

        <!-- Right Pod: 快捷增减 (Quick Trades: +6 / -6) -->
        <div class="rounded-xl p-1.5 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col items-center">
          <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 mb-1 leading-none">${t('quickTradeStep')}</span>
          <div class="grid grid-cols-2 gap-1 w-full h-7">
            <button 
              onclick="changeScrap(-6)" 
              class="h-full rounded-md bg-white/80 dark:bg-slate-900/80 hover:bg-rose-500/15 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-[11px] flex items-center justify-center transition active:scale-90 cursor-pointer"
              title="${tipMinus6Scrap}"
            >-6</button>
            <button 
              onclick="changeScrap(6)" 
              class="h-full rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-[11px] flex items-center justify-center transition active:scale-90 shadow-xs cursor-pointer"
              title="${tipPlus6Scrap}"
            >+6</button>
          </div>
        </div>
      </div>
    </div>
  `;

  grid.innerHTML = tarotCardsHtml + scrapCardHtml;
}

function changeOwned(cardName, delta) {
  ownedTickets[cardName] = Math.max(0, (ownedTickets[cardName] || 0) + delta);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

function setOwned(cardName, val) {
  ownedTickets[cardName] = Math.max(0, parseInt(val) || 0);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

function changeNeeded(cardName, delta) {
  neededTickets[cardName] = Math.max(0, (neededTickets[cardName] || 0) + delta);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

function setNeeded(cardName, val) {
  neededTickets[cardName] = Math.max(0, parseInt(val) || 0);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

function changeScrap(delta) {
  ownedScrap = Math.max(0, (ownedScrap || 0) + delta);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

function setScrap(val) {
  ownedScrap = Math.max(0, parseInt(val) || 0);
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
}

// Preset Demand (All 1x, All 2x)
function setPresetDemand(count) {
  TAROT_CARDS.forEach(c => {
    neededTickets[c.name] = count;
  });
  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
  showToast(t('presetAppliedToast', { count }), '🎪');
}

// Reset all counts
function resetSetup() {
  TAROT_CARDS.forEach(c => {
    ownedTickets[c.name] = 0;
    neededTickets[c.name] = 0;
  });
  ownedScrap = 0;
  try {
    localStorage.removeItem('dota2_carnival_state');
  } catch (e) {}
  renderTicketSetupGrid();
  updateRecommendations();
  showToast(t('resetToast'), '🧹');
}

// Trade rule toggle handler
function toggleTradeRule(ruleKey) {
  tradeConfig[ruleKey] = !tradeConfig[ruleKey];
  saveStateToStorage();
  updateTradeToggleUI();
  updateRecommendations();
}

// Update Trade toggle checkbox and button styles
function updateTradeToggleUI() {
  const scrapCheck = document.getElementById('toggleTradeScrap');
  const threeCheck = document.getElementById('toggleTradeThree');
  const fourCheck = document.getElementById('toggleTradeFour');
  const lblScrap = document.getElementById('lblTradeScrap');
  const lblThree = document.getElementById('lblTradeThree');
  const lblFour = document.getElementById('lblTradeFour');

  if (scrapCheck) scrapCheck.checked = !!tradeConfig.enableScrap;
  if (threeCheck) threeCheck.checked = !!tradeConfig.enableThreeToOne;
  if (fourCheck) fourCheck.checked = !!tradeConfig.enableFourToOne;

  const activeClass = "flex items-center space-x-1.5 cursor-pointer select-none px-2.5 py-1 rounded-lg text-xs font-bold transition border border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200 shadow-sm";
  const inactiveClass = "flex items-center space-x-1.5 cursor-pointer select-none px-2.5 py-1 rounded-lg text-xs font-medium transition border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

  if (lblScrap) lblScrap.className = tradeConfig.enableScrap ? activeClass : inactiveClass;
  if (lblThree) lblThree.className = tradeConfig.enableThreeToOne ? activeClass : inactiveClass;
  if (lblFour) lblFour.className = tradeConfig.enableFourToOne ? activeClass : inactiveClass;
}

// Apply calculated trades to user inventory
function applyTradesToInventory() {
  if (!lastCalculatedPlan || !lastCalculatedPlan.trades || lastCalculatedPlan.trades.length === 0) return;

  lastCalculatedPlan.trades.forEach(tr => {
    if (tr.type === 'scrap') {
      ownedScrap = Math.max(0, ownedScrap - 6);
      ownedTickets[tr.targetCard] = (ownedTickets[tr.targetCard] || 0) + 1;
    } else if (tr.type === 'threeToOne') {
      ownedTickets[tr.fromCard] = Math.max(0, (ownedTickets[tr.fromCard] || 0) - 3);
      ownedTickets[tr.targetCard] = (ownedTickets[tr.targetCard] || 0) + 1;
    } else if (tr.type === 'fourToOne') {
      tr.fromCards.forEach(fc => {
        ownedTickets[fc.name] = Math.max(0, (ownedTickets[fc.name] || 0) - 1);
      });
      ownedTickets[tr.targetCard] = (ownedTickets[tr.targetCard] || 0) + 1;
    }
  });

  saveStateToStorage();
  renderTicketSetupGrid();
  updateRecommendations();
  showToast(t('tradeAppliedToast'), '🎉');
}

// Copy Clearance Plan to Clipboard (Shareable summary)
function copyClearancePlanToClipboard() {
  if (!lastCalculatedPlan) return;
  const isZh = currentLang === 'zh';
  const lines = [];

  lines.push(isZh ? '🎪【DOTA2 暗黑狂欢 · 最优通关路线规划】' : '🎪 [Dota 2 Dark Carnival · Clearance Plan]');

  const targetEntries = Object.entries(neededTickets).filter(([_, n]) => n > 0);
  if (targetEntries.length > 0) {
    const targetsStr = targetEntries.map(([tName, n]) => {
      const card = CARD_MAP[tName];
      const name = isZh ? tName : (card ? card.en : tName);
      return `${name} x${n}`;
    }).join(', ');
    lines.push((isZh ? '🎯 目标需求：' : '🎯 Target Needs: ') + targetsStr);
  }

  if (lastCalculatedPlan.trades && lastCalculatedPlan.trades.length > 0) {
    lines.push(isZh ? '🔄 即时交易：' : '🔄 Direct Trades:');
    lastCalculatedPlan.trades.forEach((tr, i) => {
      const targetName = isZh ? tr.targetCard : tr.targetCardEn;
      if (tr.type === 'scrap') {
        lines.push(`  ${i + 1}. 6x 废票 ➔ ${targetName} x1`);
      } else if (tr.type === 'threeToOne') {
        const fromName = isZh ? tr.fromCard : tr.fromCardEn;
        lines.push(`  ${i + 1}. 3x ${fromName} ➔ ${targetName} x1`);
      } else if (tr.type === 'fourToOne') {
        const fromList = tr.fromCards.map(c => isZh ? c.name : c.en).join('+');
        lines.push(`  ${i + 1}. 4x [${fromList}] ➔ ${targetName} x1`);
      }
    });
  }

  if (lastCalculatedPlan.roadmapStages && lastCalculatedPlan.roadmapStages.length > 0) {
    lines.push(isZh ? '⚔️ 出战规划：' : '⚔️ Match Roadmap:');
    lastCalculatedPlan.roadmapStages.forEach((st, i) => {
      const heroName = isZh ? st.hero.name : st.hero.en_name;
      const targets = Object.entries(st.targetTickets).map(([tName, c]) => {
        const card = CARD_MAP[tName];
        const name = isZh ? tName : (card ? card.en : tName);
        return `${name} x${c}`;
      }).join(', ');
      let altStr = '';
      if (st.alternatives && st.alternatives.length > 0) {
        altStr = (isZh ? ' (备选: ' : ' (Alts: ') + st.alternatives.map(a => isZh ? a.name : a.en_name).join(', ') + ')';
      }
      lines.push(`  • ${isZh ? '阶段' : 'Stage'} ${i + 1}: ${heroName}${altStr} ➔ ${targets} [${isZh ? '约' : '~'}${st.matchesFastest}${isZh ? '局' : ' wins'}]`);
    });
  }

  lines.push(`⚡ ${isZh ? '理论最快：' : 'Best-case: '}${lastCalculatedPlan.fastestMatches} ${isZh ? '局全胜' : 'wins'} | 🛡️ ${isZh ? '稳健推荐：' : 'Expected: '}${lastCalculatedPlan.expectedMatches} ${isZh ? '局' : 'wins'}`);
  lines.push('🌐 https://islanddddddd.github.io/dota2-dark-carnival-helper/');

  const textToCopy = lines.join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(t('planCopiedToast'), '📋');
    }).catch(() => {
      fallbackCopyText(textToCopy);
    });
  } else {
    fallbackCopyText(textToCopy);
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(t('planCopiedToast'), '📋');
  } catch (err) {
    showToast(currentLang === 'en' ? 'Plan generated, please copy manually' : '已生成文本，请长按选择复制', '📋');
  }
  document.body.removeChild(textarea);
}

// Core Solver: Compute optimal trades and clearance roadmap
function computeClearancePlan(deficits, surpluses, scrapCount, config) {
  const curDeficits = { ...deficits };
  const curSurpluses = { ...surpluses };
  let curScrap = scrapCount;
  const directTrades = [];

  const getTotalDeficit = (defs) => Object.values(defs).reduce((sum, v) => sum + v, 0);

  const getNextTargetCard = (defs) => {
    let bestCard = null;
    let maxDef = 0;
    for (const card of TAROT_CARDS) {
      if ((defs[card.name] || 0) > maxDef) {
        maxDef = defs[card.name];
        bestCard = card.name;
      }
    }
    return bestCard;
  };

  // 1. Scrap Trading (6 scrap -> 1 target)
  if (config.enableScrap && curScrap >= 6) {
    let availableTrades = Math.floor(curScrap / 6);
    while (availableTrades > 0 && getTotalDeficit(curDeficits) > 0) {
      const targetCard = getNextTargetCard(curDeficits);
      if (!targetCard) break;
      const targetMeta = CARD_MAP[targetCard];
      directTrades.push({
        type: 'scrap',
        costScrap: 6,
        targetCard: targetCard,
        targetCardEn: targetMeta ? targetMeta.en : targetCard,
        targetIcon: targetMeta ? targetMeta.icon : '🃏'
      });
      curDeficits[targetCard] -= 1;
      curScrap -= 6;
      availableTrades -= 1;
    }
  }

  // 2. 3 Identical Surplus -> 1 target
  if (config.enableThreeToOne) {
    let canTrade = true;
    while (canTrade && getTotalDeficit(curDeficits) > 0) {
      let fromCard = null;
      let maxSurplus = 0;
      for (const card of TAROT_CARDS) {
        if ((curSurpluses[card.name] || 0) >= 3 && (curSurpluses[card.name] || 0) > maxSurplus) {
          maxSurplus = curSurpluses[card.name];
          fromCard = card.name;
        }
      }

      if (!fromCard) {
        canTrade = false;
        break;
      }

      const targetCard = getNextTargetCard(curDeficits);
      if (!targetCard) break;

      const fromMeta = CARD_MAP[fromCard];
      const targetMeta = CARD_MAP[targetCard];
      directTrades.push({
        type: 'threeToOne',
        fromCard: fromCard,
        fromCardEn: fromMeta ? fromMeta.en : fromCard,
        fromIcon: fromMeta ? fromMeta.icon : '🃏',
        costCount: 3,
        targetCard: targetCard,
        targetCardEn: targetMeta ? targetMeta.en : targetCard,
        targetIcon: targetMeta ? targetMeta.icon : '🃏'
      });
      curSurpluses[fromCard] -= 3;
      curDeficits[targetCard] -= 1;
    }
  }

  // 3. 4 Distinct Surplus -> 1 target
  if (config.enableFourToOne) {
    let canTrade = true;
    while (canTrade && getTotalDeficit(curDeficits) > 0) {
      const eligibleCards = TAROT_CARDS
        .filter(c => (curSurpluses[c.name] || 0) >= 1)
        .sort((a, b) => (curSurpluses[b.name] || 0) - (curSurpluses[a.name] || 0));

      if (eligibleCards.length < 4) {
        canTrade = false;
        break;
      }

      const targetCard = getNextTargetCard(curDeficits);
      if (!targetCard) break;

      const chosenFrom = eligibleCards.slice(0, 4);
      chosenFrom.forEach(c => {
        curSurpluses[c.name] -= 1;
      });

      const targetMeta = CARD_MAP[targetCard];
      directTrades.push({
        type: 'fourToOne',
        fromCards: chosenFrom.map(c => ({
          name: c.name,
          en: c.en,
          icon: c.icon
        })),
        targetCard: targetCard,
        targetCardEn: targetMeta ? targetMeta.en : targetCard,
        targetIcon: targetMeta ? targetMeta.icon : '🃏'
      });
      curDeficits[targetCard] -= 1;
    }
  }

  const remainingDeficits = { ...curDeficits };
  const remainingTotalDeficit = getTotalDeficit(remainingDeficits);

  if (remainingTotalDeficit === 0) {
    return {
      trades: directTrades,
      remainingDeficits: remainingDeficits,
      remainingTotalDeficit: 0,
      roadmapStages: [],
      fastestMatches: 0,
      expectedMatches: 0
    };
  }

  // 4. Roadmap Planner: simulate matches to eliminate remaining deficits
  const simDeficits = { ...remainingDeficits };
  const roadmapStages = [];
  let maxIter = 15;

  while (getTotalDeficit(simDeficits) > 0 && maxIter-- > 0) {
    const scoredCandidates = [];

    HEROES_DATA.forEach(h => {
      const [t1, t2, t3] = h.tickets;
      const combos = [[t1, t2], [t1, t3], [t2, t3]];
      let usefulCounts = [];
      combos.forEach(([a, b]) => {
        let u = 0;
        if (a === b) {
          u += Math.min(2, simDeficits[a] || 0);
        } else {
          if ((simDeficits[a] || 0) > 0) u += 1;
          if ((simDeficits[b] || 0) > 0) u += 1;
        }
        usefulCounts.push(u);
      });

      const expYield = usefulCounts.reduce((acc, v) => acc + v, 0) / 3.0;
      const matched = h.tickets.filter(t => (simDeficits[t] || 0) > 0);
      const matchCount = matched.length;
      const matchedSum = matched.reduce((acc, t) => acc + (simDeficits[t] || 0), 0);

      if (matchCount > 0 && expYield > 0) {
        scoredCandidates.push({
          hero: h,
          expYield,
          matchCount,
          matchedSum
        });
      }
    });

    if (scoredCandidates.length === 0) break;

    scoredCandidates.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      if (Math.abs(b.expYield - a.expYield) > 0.001) return b.expYield - a.expYield;
      return b.matchedSum - a.matchedSum;
    });

    const bestEntry = scoredCandidates[0];
    const bestHeroCandidate = bestEntry.hero;
    const highestExpected = bestEntry.expYield;
    const bestMatchCount = bestEntry.matchCount;

    // Alternative heroes for this stage (who also match the stage well)
    const alternativeHeroes = scoredCandidates
      .slice(1)
      .filter(c => c.hero.name !== bestHeroCandidate.name && c.matchCount >= bestMatchCount - 1 && c.expYield >= highestExpected * 0.6)
      .slice(0, 2)
      .map(c => c.hero);

    const [t1, t2, t3] = bestHeroCandidate.tickets;
    const combos = [[t1, t2], [t1, t3], [t2, t3]];
    let maxBestYield = -1;
    combos.forEach(c => {
      let y = 0;
      if (c[0] === c[1]) y = Math.min(2, simDeficits[c[0]] || 0);
      else y = ((simDeficits[c[0]] || 0) > 0 ? 1 : 0) + ((simDeficits[c[1]] || 0) > 0 ? 1 : 0);
      if (y > maxBestYield) {
        maxBestYield = y;
      }
    });

    const stageTargets = {};
    bestHeroCandidate.tickets.forEach(t => {
      if ((simDeficits[t] || 0) > 0) {
        stageTargets[t] = simDeficits[t];
      }
    });

    const stageTotalDeficit = Object.values(stageTargets).reduce((a, b) => a + b, 0);
    const stageFastestMatches = Math.max(1, Math.ceil(stageTotalDeficit / Math.max(1, maxBestYield)));
    const stageExpectedMatches = Math.max(1, Math.ceil(stageTotalDeficit / Math.max(0.67, highestExpected)));

    let ticketsToDeduct = stageFastestMatches * maxBestYield;
    for (const tName of bestHeroCandidate.tickets) {
      if ((simDeficits[tName] || 0) > 0 && ticketsToDeduct > 0) {
        const sub = Math.min(simDeficits[tName], ticketsToDeduct);
        simDeficits[tName] -= sub;
        ticketsToDeduct -= sub;
      }
    }

    roadmapStages.push({
      hero: bestHeroCandidate,
      alternatives: alternativeHeroes,
      targetTickets: stageTargets,
      expectedYield: highestExpected,
      matchCount: bestMatchCount,
      matchesFastest: stageFastestMatches,
      matchesExpected: stageExpectedMatches
    });
  }

  const theoreticalFastest = Math.ceil(remainingTotalDeficit / 2);
  const sumFastest = roadmapStages.reduce((sum, s) => sum + s.matchesFastest, 0);
  const overallFastest = Math.max(theoreticalFastest, sumFastest);
  const overallExpected = roadmapStages.reduce((sum, s) => sum + s.matchesExpected, 0);

  return {
    trades: directTrades,
    remainingDeficits: remainingDeficits,
    remainingTotalDeficit: remainingTotalDeficit,
    roadmapStages: roadmapStages,
    fastestMatches: overallFastest,
    expectedMatches: overallExpected
  };
}

// Render dynamic clearance plan content into the DOM
function renderClearancePlan(plan, totalNeeded, totalDeficit) {
  const container = document.getElementById('clearancePlanContent');
  const statFastest = document.getElementById('planStatFastest');
  const statExpected = document.getElementById('planStatExpected');

  if (statFastest) statFastest.textContent = t('planStatFastest', { n: plan.fastestMatches });
  if (statExpected) statExpected.textContent = t('planStatExpected', { n: plan.expectedMatches });

  if (!container) return;

  if (totalNeeded === 0 && totalDeficit === 0) {
    container.innerHTML = `
      <div class="text-center py-6 px-4 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
        <div class="text-2xl mb-1 select-none">🎯</div>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('planNoDeficitTitle')}</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${t('planNoDeficitDesc')}</p>
      </div>
    `;
    return;
  }

  if (totalDeficit === 0 && totalNeeded > 0) {
    container.innerHTML = `
      <div class="text-center py-5 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
        <div class="text-2xl mb-1 select-none">🎉</div>
        <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">${t('planAllMetTitle')}</p>
        <p class="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 mt-0.5">${t('planAllMetDesc')}</p>
      </div>
    `;
    return;
  }

  let html = '';

  // 1. Direct Trades Section (if any trades possible)
  if (plan.trades && plan.trades.length > 0) {
    const tradeItemsHtml = plan.trades.map((tr, idx) => {
      let tradeContent = '';
      if (tr.type === 'scrap') {
        const targetDisplayName = currentLang === 'en' ? tr.targetCardEn : tr.targetCard;
        tradeContent = `
          <div class="flex items-center space-x-2 text-xs">
            <span class="font-bold text-amber-700 dark:text-amber-300">🎟️ 6 ${t('scrapTitle')}</span>
            <span class="text-slate-400">➔</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${tr.targetIcon} ${targetDisplayName} x1</span>
          </div>
        `;
      } else if (tr.type === 'threeToOne') {
        const fromDisplayName = currentLang === 'en' ? tr.fromCardEn : tr.fromCard;
        const targetDisplayName = currentLang === 'en' ? tr.targetCardEn : tr.targetCard;
        tradeContent = `
          <div class="flex items-center space-x-2 text-xs">
            <span class="font-bold text-amber-700 dark:text-amber-300">${tr.fromIcon} ${fromDisplayName} x3</span>
            <span class="text-slate-400">➔</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${tr.targetIcon} ${targetDisplayName} x1</span>
          </div>
        `;
      } else if (tr.type === 'fourToOne') {
        const fromList = tr.fromCards.map(c => `${c.icon} ${currentLang === 'en' ? c.en : c.name}`).join(' + ');
        const targetDisplayName = currentLang === 'en' ? tr.targetCardEn : tr.targetCard;
        tradeContent = `
          <div class="flex items-center space-x-2 text-xs">
            <span class="font-medium text-slate-700 dark:text-slate-300">${fromList}</span>
            <span class="text-slate-400">➔</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${tr.targetIcon} ${targetDisplayName} x1</span>
          </div>
        `;
      }

      return `
        <div class="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center">${idx + 1}</span>
            ${tradeContent}
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-2.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🔄</span>
              <span>${t('planStepTradeTitle')}</span>
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              ${plan.trades.length} ${currentLang === 'en' ? 'Trades' : '笔交易'}
            </span>
          </div>
          <button 
            onclick="applyTradesToInventory()" 
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95 transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>⚡</span>
            <span>${t('applyTradesBtn')}</span>
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          ${tradeItemsHtml}
        </div>
      </div>
    `;
  }

  // If trades satisfy everything
  if (plan.remainingTotalDeficit === 0) {
    html += `
      <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
        <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">${t('planTradeCoverAll')}</p>
      </div>
    `;
  } else if (plan.roadmapStages && plan.roadmapStages.length > 0) {
    // 2. Roadmap Stages (sorted by minimum matches)
    const stagesHtml = plan.roadmapStages.map((st, idx) => {
      const h = st.hero;
      const attrInfo = ATTR_META[h.attr] || { icon: '⚪', badgeClass: 'text-slate-400' };
      const heroPrimaryName = currentLang === 'en' ? h.en_name : h.name;

      const targetBadges = Object.entries(st.targetTickets).map(([tName, count]) => {
        const card = CARD_MAP[tName] || { icon: '🃏', en: tName };
        const displayName = currentLang === 'en' ? card.en : tName;
        return `
          <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span>${card.icon}</span>
            <span>${displayName}</span>
            <span class="text-amber-600 dark:text-amber-400 font-black">x${count}</span>
          </span>
        `;
      }).join('');

      const heroTicketPills = h.tickets.map(tName => {
        const card = CARD_MAP[tName] || { icon: '🃏', en: tName };
        const isTarget = !!st.targetTickets[tName];
        return `
          <span class="text-[10px] px-1.5 py-0.2 rounded border ${isTarget ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold' : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-300/40 dark:border-slate-700/40'}">
            ${card.icon} ${currentLang === 'en' ? card.en : tName}
          </span>
        `;
      }).join('');

      let altsHtml = '';
      if (st.alternatives && st.alternatives.length > 0) {
        const altPills = st.alternatives.map(ah => {
          const ahName = currentLang === 'en' ? ah.en_name : ah.name;
          const aAttr = ATTR_META[ah.attr] || { icon: '⚪' };
          return `
            <button onclick="openTicketModal('${ah.tickets[0]}')" class="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-200/70 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-300/60 dark:border-slate-700/60 transition cursor-pointer" title="${ahName} (${ah.tickets.join(', ')})">
              <span>${aAttr.icon}</span>
              <span class="font-medium truncate max-w-[80px]">${ahName}</span>
            </button>
          `;
        }).join('');

        altsHtml = `
          <div class="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
            <span class="font-bold text-slate-500 dark:text-slate-400">${t('planStageAlts')}</span>
            <div class="flex items-center gap-1 flex-wrap">${altPills}</div>
          </div>
        `;
      }

      return `
        <div class="card-glass rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm hover:border-amber-500/40 transition">
          <!-- Left: Stage Number + Hero Info -->
          <div class="flex items-center space-x-3 min-w-0">
            <span class="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/30">
              #${idx + 1}
            </span>
            <div class="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex-shrink-0">
              <img 
                src="${h.img}" 
                alt="${heroPrimaryName}" 
                class="w-full h-full object-cover" 
                loading="lazy"
                onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'11\\' font-weight=\\'bold\\'>${h.name.slice(0, 2)}</text></svg>';"
              >
              <span class="absolute bottom-0 right-0 text-[8px] px-0.5 rounded-tl bg-black/70 text-white">${attrInfo.icon}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center space-x-2">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${heroPrimaryName}</h4>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-bold ${st.matchCount === 3 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'}">${st.matchCount}/3</span>
              </div>
              <div class="flex items-center gap-1 mt-1 flex-wrap">
                ${heroTicketPills}
              </div>
              ${altsHtml}
            </div>
          </div>

          <!-- Middle: Targets -->
          <div class="flex flex-col md:items-start justify-center">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">${t('planStageTarget')}</span>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${targetBadges}
            </div>
          </div>

          <!-- Right: Matches Estimate -->
          <div class="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-200 dark:border-slate-800">
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm whitespace-nowrap">
              ⚡ ${t('planStageWins', { fastest: st.matchesFastest, expected: st.matchesExpected })}
            </span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              ${t('expectedYield', { val: st.expectedYield.toFixed(2) })}
            </span>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="space-y-2">
        <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
          <span>⚔️</span>
          <span>${t('planStepMatchTitle')}</span>
        </div>
        <div class="space-y-2">
          ${stagesHtml}
        </div>
      </div>
    `;
  }

  // 3. Summary & Advice Card
  const tradeResolvedCount = plan.trades ? plan.trades.length : 0;
  html += `
    <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <span>📊</span>
          <span>${t('planStepSummaryTitle')}</span>
        </span>
        <div class="flex items-center gap-2 text-[11px]">
          <span class="text-slate-500">${t('planSummaryInitial')} <b class="text-slate-700 dark:text-slate-300">${totalDeficit}</b></span>
          <span class="text-amber-600 dark:text-amber-400">${t('planSummaryTradeReduced')} <b>${tradeResolvedCount}</b></span>
          <span class="text-rose-600 dark:text-rose-400">${t('planSummaryRemaining')} <b>${plan.remainingTotalDeficit}</b></span>
        </div>
      </div>
      <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
        ${t('planStrategyTip')}
      </p>
    </div>
  `;

  container.innerHTML = html;
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
  const surpluses = {};

  TAROT_CARDS.forEach(c => {
    const o = ownedTickets[c.name] || 0;
    const n = neededTickets[c.name] || 0;
    const def = Math.max(0, n - o);
    deficits[c.name] = def;
    surpluses[c.name] = Math.max(0, o - n);
    totalNeeded += n;
    totalOwned += o;
    totalDeficit += def;
  });

  // Calculate Clearance & Trading Plan
  const plan = computeClearancePlan(deficits, surpluses, ownedScrap, tradeConfig);
  lastCalculatedPlan = plan;
  renderClearancePlan(plan, totalNeeded, totalDeficit);

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

    // Tier classification:
    // Tier 1: 3/3 tickets needed in deficit (0% waste, highest efficiency)
    // Tier 2: 2/3 tickets needed in deficit (guaranteed >=1 needed)
    // Tier 3: 1/3 tickets needed in deficit (66.7% chance to get needed)
    if (matchCount === 3) {
      tier1.push(recItem);
    } else if (matchCount === 2) {
      tier2.push(recItem);
    } else if (matchCount === 1) {
      tier3.push(recItem);
    }
  });

  // Sort tiers: higher expected yield first, then higher deficit sum
  tier1.sort((a, b) => b.expectedYield - a.expectedYield || b.matchedDeficitSum - a.matchedDeficitSum);
  tier2.sort((a, b) => b.expectedYield - a.expectedYield || b.matchedDeficitSum - a.matchedDeficitSum);
  tier3.sort((a, b) => b.expectedYield - a.expectedYield || b.matchedDeficitSum - a.matchedDeficitSum);

  // Estimated wins needed (synced with clearance planner)
  const statGames = document.getElementById('statEstimatedGames');
  if (statGames) {
    statGames.innerHTML = `${plan.fastestMatches} <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">${t('unitWins')}</span>`;
  }

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
