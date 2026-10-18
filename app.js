// DOTA2 暗黑狂欢 · 票券系统逻辑核心
// 机制：每赢一局，每个英雄有3张票券，随机获得其中2张

// Map card by name
const CARD_MAP = {};
TAROT_CARDS.forEach(c => CARD_MAP[c.name] = c);

// Attribute Metadata
const ATTR_META = {
  'str': { name: '力量', icon: '🔴', color: '#ef4444', badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30' },
  'agi': { name: '敏捷', icon: '🟢', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  'int': { name: '智力', icon: '🔵', color: '#38bdf8', badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  'all': { name: '全才', icon: '🟣', color: '#a855f7', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
};

// State
let currentTab = 'codex';
let currentAttrFilter = 'all';
let currentRecomAttrFilter = 'all';
let selectedTicketPill = null;
let ownedTickets = {};
let neededTickets = {};

// Initialize default ticket counts
TAROT_CARDS.forEach(c => {
  ownedTickets[c.name] = 0;
  neededTickets[c.name] = 0;
});

// Initialize application on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  populateTicketPills();
  populateTicketSelect();
  renderCodex();
  renderTicketSetupGrid();
  
  // Default sample setup for instant preview
  applyPreset('demo', false);
  updateRecommendations();
});

// Tab Switcher
function switchTab(tab) {
  currentTab = tab;
  const codexSec = document.getElementById('pageCodex');
  const recomSec = document.getElementById('pageRecom');
  const btnCodex = document.getElementById('tabBtnCodex');
  const btnRecom = document.getElementById('tabBtnRecom');

  if (tab === 'codex') {
    codexSec.classList.remove('hidden');
    recomSec.classList.add('hidden');
    btnCodex.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md";
    btnRecom.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/60";
  } else {
    codexSec.classList.add('hidden');
    recomSec.classList.remove('hidden');
    btnRecom.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md";
    btnCodex.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/60";
    updateRecommendations();
  }
}

// Populate ticket pills in Codex
function populateTicketPills() {
  const container = document.getElementById('ticketPillContainer');
  if (!container) return;
  container.innerHTML = '';
  
  TAROT_CARDS.forEach(card => {
    const count = HEROES_DATA.filter(h => h.tickets.includes(card.name)).length;
    const pill = document.createElement('button');
    pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-[#121722] border-slate-800 text-slate-300 hover:border-amber-500/50`;
    pill.dataset.ticket = card.name;
    pill.onclick = () => selectTicketPill(card.name);
    pill.innerHTML = `
      <span>${card.icon}</span>
      <span>${card.name}</span>
      <span class="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded-full">${count}</span>
    `;
    container.appendChild(pill);
  });
}

// Populate ticket dropdown select
function populateTicketSelect() {
  const select = document.getElementById('ticketSelectFilter');
  if (!select) return;
  TAROT_CARDS.forEach(card => {
    const opt = document.createElement('option');
    opt.value = card.name;
    opt.textContent = `${card.icon} ${card.name} (${card.en})`;
    select.appendChild(opt);
  });
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
      pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/40`;
    } else {
      pill.className = `ticket-pill text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1.5 bg-[#121722] border-slate-800 text-slate-300 hover:border-amber-500/50`;
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
      btn.className = "attr-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 transition-all border border-slate-700/40";
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
      if (!matchName && !matchEn && !matchKey && !matchAliases && !matchTicket) {
        return false;
      }
    }

    return true;
  });

  if (counterEl) counterEl.textContent = `共 ${filtered.length} 位英雄`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // Attribute sections metadata for clear visual partitioning
  const ATTR_SECTIONS = [
    { key: 'str', title: '力量英雄', en: 'Strength Heroes', icon: '🔴', color: '#ef4444', borderClass: 'border-l-4 border-l-red-500', headerBg: 'bg-red-500/10 border-red-500/30 text-red-300', desc: '刚烈坚韧，擅长前排冲锋与团控，产出【力量】、【隐士】、【皇帝】、【恶魔】等专属票券。' },
    { key: 'agi', title: '敏捷英雄', en: 'Agility Heroes', icon: '🟢', color: '#10b981', borderClass: 'border-l-4 border-l-emerald-500', headerBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300', desc: '灵动迅捷，具备极高的物理爆发与持续输出，产出【隐士】、【死神】、【魔术师】、【命运之轮】等专属票券。' },
    { key: 'int', title: '智力英雄', en: 'Intelligence Heroes', icon: '🔵', color: '#38bdf8', borderClass: 'border-l-4 border-l-sky-500', headerBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300', desc: '博学通灵，掌控大量戏法、法术爆发与战略支援，产出【魔术师】、【女祭司】、【愚者】、【星星】等专属票券。' },
    { key: 'all', title: '全才英雄', en: 'Universal Heroes', icon: '🟣', color: '#a855f7', borderClass: 'border-l-4 border-l-purple-500', headerBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300', desc: '多维平衡，均衡汲取三大属性精华为战，产出【恋人】、【女祭司】、【命运之轮】、【恶魔】等专属票券。' }
  ];

  let sectionsHtml = '';
  ATTR_SECTIONS.forEach(sec => {
    const secHeroes = filtered.filter(h => h.attr === sec.key);
    if (secHeroes.length > 0) {
      sectionsHtml += `
        <div class="space-y-3 pt-2">
          <!-- Attribute Header Banner -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
            <div class="flex items-center space-x-2.5">
              <span class="text-xl">${sec.icon}</span>
              <h2 class="text-base font-bold text-white tracking-wide">${sec.title}</h2>
              <span class="text-xs text-slate-400 font-normal">(${sec.en})</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${sec.headerBg}">
                ${secHeroes.length} 位
              </span>
            </div>
            <p class="text-xs text-slate-400 max-w-lg leading-relaxed">${sec.desc}</p>
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

// Render individual hero card (Codex compact)
function renderHeroCard(h, attrBorderClass = '') {
  const attrInfo = ATTR_META[h.attr] || { name: '未知', icon: '⚪', badgeClass: 'bg-slate-700 text-slate-300' };
  
  // Render 3 ticket cards in a compact horizontal 3-column row
  const ticketBadges = h.tickets.map(tName => {
    const card = CARD_MAP[tName] || { icon: '🃏', color: '#94a3b8', num: '?' };
    return `
      <div onclick="openTicketModal('${tName}')" class="cursor-pointer flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 transition-all group/t" title="${tName} (点击查看详情)">
        <span class="text-base sm:text-lg leading-none">${card.icon}</span>
        <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-medium">${tName}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="card-glass rounded-xl p-2.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl ${attrBorderClass}">
      <!-- Hero Header -->
      <div class="flex items-center space-x-2.5 mb-2">
        <div class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
          <img 
            src="${h.img}" 
            alt="${h.name}" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'11\\' font-weight=\\'bold\\'>${h.name.slice(0, 2)}</text></svg>';"
          >
          <span class="absolute bottom-0 right-0 text-[9px] leading-none px-1 py-0.5 rounded-tl bg-black/80 font-mono">
            ${attrInfo.icon}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate" title="${h.name}">
              ${h.name}
            </h3>
            <span class="text-[9px] px-1.5 py-0.2 rounded font-mono ${attrInfo.badgeClass}">
              ${attrInfo.name}
            </span>
          </div>
          <p class="text-[10px] text-slate-400 truncate">${h.en_name}</p>
        </div>
      </div>

      <!-- 3 Tickets in a single compact row -->
      <div class="pt-1.5 border-t border-slate-800/80">
        <div class="text-[9px] text-slate-400 font-medium mb-1">产出票券 (3抽2):</div>
        <div class="grid grid-cols-3 gap-1">
          ${ticketBadges}
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-2 pt-1.5 border-t border-slate-800/60">
        <button onclick="quickTargetHero('${h.name}')" class="w-full text-[11px] py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-1 font-medium">
          <span>设为需求 ➔</span>
        </button>
      </div>
    </div>
  `;
}

// Quick target hero to recommendation page
function quickTargetHero(heroName) {
  const hero = HEROES_DATA.find(h => h.name === heroName);
  if (!hero) return;
  
  // Set needed tickets to hero's 3 tickets
  TAROT_CARDS.forEach(c => neededTickets[c.name] = 0);
  hero.tickets.forEach(t => neededTickets[t] = 2);
  
  renderTicketSetupGrid();
  switchTab('recom');
  showToast(`已将【${hero.name}】的 3 张专属票券设为需求目标！`, '🎯');
}

// Open ticket modal
function openTicketModal(ticketName) {
  const card = CARD_MAP[ticketName];
  if (!card) return;

  document.getElementById('modalTicketIcon').textContent = card.icon;
  document.getElementById('modalTicketName').textContent = card.name;
  document.getElementById('modalTicketNum').textContent = `塔罗序号: ${card.num}`;
  document.getElementById('modalTicketEn').textContent = card.en;
  document.getElementById('modalTicketDesc').textContent = `寓意特性：${card.desc}。在暗黑狂欢的马戏团专列中，消耗此票券可解锁特定对应车厢节点与奖励。`;

  const heroes = HEROES_DATA.filter(h => h.tickets.includes(ticketName));
  document.getElementById('modalHeroCount').textContent = `${heroes.length} 位英雄`;

  const listContainer = document.getElementById('modalHeroList');
  listContainer.innerHTML = heroes.map(h => {
    const attrInfo = ATTR_META[h.attr];
    return `
      <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
        <span>${attrInfo.icon}</span>
        <span class="font-medium text-slate-200">${h.name}</span>
      </div>
    `;
  }).join('');

  document.getElementById('ticketModal').classList.remove('hidden');
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.add('hidden');
}

// ==================== RECOMMENDATION PAGE LOGIC ====================

function renderTicketSetupGrid() {
  const grid = document.getElementById('ticketSetupGrid');
  if (!grid) return;
  grid.innerHTML = TAROT_CARDS.map(card => {
    const owned = ownedTickets[card.name] || 0;
    const needed = neededTickets[card.name] || 0;
    const deficit = Math.max(0, needed - owned);

    let deficitBadge = '';
    if (needed === 0) {
      deficitBadge = `<span class="text-[11px] text-slate-500">无需求</span>`;
    } else if (deficit === 0) {
      deficitBadge = `<span class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">已满足 ✓</span>`;
    } else {
      deficitBadge = `<span class="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">缺 ${deficit} 张</span>`;
    }

    return `
      <div class="card-glass rounded-xl p-3 border border-slate-800 flex flex-col justify-between space-y-2">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-base">${card.icon}</span>
            <span class="text-xs font-bold text-slate-200">${card.name}</span>
          </div>
          ${deficitBadge}
        </div>

        <!-- Inputs (Owned vs Needed) -->
        <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
          <!-- Owned -->
          <div>
            <label class="block text-[10px] text-slate-400 mb-1">拥有量</label>
            <div class="flex items-center bg-[#0d121a] rounded-lg border border-slate-700/80 overflow-hidden">
              <button onclick="changeOwned('${card.name}', -1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">-</button>
              <input 
                type="number" 
                min="0" 
                value="${owned}" 
                onchange="setOwned('${card.name}', this.value)"
                class="w-full bg-transparent text-center text-xs text-emerald-300 font-bold focus:outline-none py-1"
              >
              <button onclick="changeOwned('${card.name}', 1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">+</button>
            </div>
          </div>

          <!-- Needed -->
          <div>
            <label class="block text-[10px] text-slate-400 mb-1">需求量</label>
            <div class="flex items-center bg-[#0d121a] rounded-lg border border-slate-700/80 overflow-hidden">
              <button onclick="changeNeeded('${card.name}', -1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">-</button>
              <input 
                type="number" 
                min="0" 
                value="${needed}" 
                onchange="setNeeded('${card.name}', this.value)"
                class="w-full bg-transparent text-center text-xs text-amber-300 font-bold focus:outline-none py-1"
              >
              <button onclick="changeNeeded('${card.name}', 1)" class="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">+</button>
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

function applyPreset(presetType, toastNotify = true) {
  TAROT_CARDS.forEach(c => {
    ownedTickets[c.name] = 0;
    neededTickets[c.name] = 0;
  });

  if (presetType === 'node1') {
    neededTickets['力量'] = 2;
    neededTickets['隐士'] = 2;
    neededTickets['皇帝'] = 1;
    if (toastNotify) showToast('已应用【第1车厢关卡】需求预设！', '🚂');
  } else if (presetType === 'boss') {
    neededTickets['命运之轮'] = 2;
    neededTickets['恶魔'] = 2;
    neededTickets['死神'] = 2;
    neededTickets['魔术师'] = 1;
    if (toastNotify) showToast('已应用【首领决战关卡】需求预设！', '👑');
  } else if (presetType === 'demo') {
    neededTickets['力量'] = 2;
    neededTickets['隐士'] = 1;
    neededTickets['恶魔'] = 2;
    ownedTickets['恶魔'] = 0;
    if (toastNotify) showToast('已应用【典型缺口测试】预设！', '💡');
  }

  renderTicketSetupGrid();
  updateRecommendations();
}

function resetSetup() {
  TAROT_CARDS.forEach(c => {
    ownedTickets[c.name] = 0;
    neededTickets[c.name] = 0;
  });
  renderTicketSetupGrid();
  updateRecommendations();
  showToast('已清空全部票券设置！', '🧹');
}

// Set Attribute filter for Recommendations
function setRecomAttrFilter(attr) {
  currentRecomAttrFilter = attr;
  document.querySelectorAll('.recom-attr-btn').forEach(btn => {
    if (btn.dataset.attr === attr) {
      btn.className = "recom-attr-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow";
    } else {
      btn.className = "recom-attr-btn px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition border border-slate-700/40";
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

  if (statNeeded) statNeeded.innerHTML = `${totalNeeded} <span class="text-xs text-slate-400 font-normal">张</span>`;
  if (statOwned) statOwned.innerHTML = `${totalOwned} <span class="text-xs text-slate-400 font-normal">张</span>`;
  if (statDeficit) statDeficit.innerHTML = `${totalDeficit} <span class="text-xs text-slate-400 font-normal">张</span>`;

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
  if (statGames) statGames.innerHTML = `${estimatedGames} <span class="text-xs text-slate-400 font-normal">局胜场</span>`;

  // Render the tier sections
  renderTierSection('tier1', tier1, deficits);
  renderTierSection('tier2', tier2, deficits);
  renderTierSection('tier3', tier3, deficits);
}

function renderTierSection(tierId, list, deficits) {
  const grid = document.getElementById(`${tierId}Grid`);
  const emptyEl = document.getElementById(`${tierId}Empty`);
  const countEl = document.getElementById(`${tierId}Count`);

  if (countEl) countEl.textContent = `${list.length} 位英雄`;
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  grid.innerHTML = list.map(item => {
    const h = item.hero;
    const attrInfo = ATTR_META[h.attr] || { name: '未知', icon: '⚪', badgeClass: 'text-slate-400' };

    // Highlight matched tickets with icon & glowing background (not full rows)
    const ticketsHtml = h.tickets.map(tName => {
      const isNeeded = (deficits[tName] || 0) > 0;
      const card = CARD_MAP[tName] || { icon: '🃏' };
      const defCount = deficits[tName] || 0;

      if (isNeeded) {
        return `
          <div class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-amber-500/25 border border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30 font-bold transition-all" title="${tName}: 仍缺 ${defCount} 张 (急需获取)">
            <span class="text-base sm:text-lg leading-none">${card.icon}</span>
            <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-bold text-amber-200">${tName}</span>
          </div>
        `;
      } else {
        return `
          <div class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-slate-500 opacity-40 transition-all" title="${tName}: 已满足 (非急需)">
            <span class="text-base sm:text-lg leading-none">${card.icon}</span>
            <span class="text-[10px] leading-tight truncate max-w-full mt-0.5 font-normal text-slate-400">${tName}</span>
          </div>
        `;
      }
    }).join('');

    // Percentage breakdown
    const p2Str = (item.p2 * 100).toFixed(1) + '%';
    const p1Str = (item.p1 * 100).toFixed(1) + '%';
    const p0Str = (item.p0 * 100).toFixed(1) + '%';

    let tierBadge = '';
    if (item.matchCount === 3) {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">3/3</span>`;
    } else if (item.matchCount === 2) {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">2/3</span>`;
    } else {
      tierBadge = `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">1/3</span>`;
    }

    return `
      <div class="card-glass rounded-xl p-2.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl">
        <!-- Hero Info -->
        <div class="flex items-center space-x-2.5">
          <div class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
            <img 
              src="${h.img}" 
              alt="${h.name}" 
              class="w-full h-full object-cover"
              loading="lazy"
              onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-size=\\'11\\' font-weight=\\'bold\\'>${h.name.slice(0, 2)}</text></svg>';"
            >
            <span class="absolute bottom-0 right-0 text-[9px] px-1 py-0.5 rounded-tl bg-black/80">
              ${attrInfo.icon}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate" title="${h.name}">${h.name}</h4>
              ${tierBadge}
            </div>
            <div class="text-[10px] text-amber-400 font-medium truncate mt-0.5">
              期望: <span class="font-bold text-amber-300">${item.expectedYield.toFixed(2)}</span> 张/局
            </div>
          </div>
        </div>

        <!-- 3 Tickets in a single compact row with glowing background for matches -->
        <div class="grid grid-cols-3 gap-1 my-2">
          ${ticketsHtml}
        </div>

        <!-- Drop Odds Strip (Ultra compact) -->
        <div class="bg-slate-950/60 rounded p-1 border border-slate-800/80 text-[9px] flex items-center justify-between text-slate-400 font-mono mb-1.5">
          <span title="抽中2张所需票券">双收: <span class="text-emerald-400 font-semibold">${p2Str}</span></span>
          <span title="抽中1张所需票券">单张: <span class="text-sky-400 font-semibold">${p1Str}</span></span>
          <span title="未抽中所需票券">浪费: <span class="${item.p0 > 0 ? 'text-rose-400' : 'text-slate-500'} font-semibold">${p0Str}</span></span>
        </div>

        <!-- Action Simulation Button -->
        <button 
          onclick="simulateMatchWin('${h.name}')" 
          class="w-full py-1 text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
        >
          <span>🎲</span>
          <span>模拟获胜抽2张</span>
        </button>
      </div>
    `;
  }).join('');
}

// Simulate match win (Random 2 out of 3 tickets)
function simulateMatchWin(heroName) {
  const hero = HEROES_DATA.find(h => h.name === heroName);
  if (!hero) return;

  const tickets = [...hero.tickets];
  // Shuffle and pick 2
  tickets.sort(() => Math.random() - 0.5);
  const won1 = tickets[0];
  const won2 = tickets[1];

  // Add to inventory
  ownedTickets[won1] = (ownedTickets[won1] || 0) + 1;
  ownedTickets[won2] = (won2 === won1) ? (ownedTickets[won2] || 0) + 1 : (ownedTickets[won2] || 0) + 1;

  renderTicketSetupGrid();
  updateRecommendations();

  showToast(`🎉 获胜！使用【${hero.name}】随机掉落了：【${won1}】+【${won2}】！`, '🏆');
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
