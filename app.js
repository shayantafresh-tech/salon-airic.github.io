/* =========================================================
   ترکیب تیم‌ها — application logic
   ========================================================= */

/* ------------------------- constants ------------------------- */
const MIN_TEAMS = 2;
const MAX_TEAMS = 6;
const MIN_PER_TEAM = 5;
const TEAM_COLORS = [
  '#3b82f6', // آبی
  '#ef4444', // قرمز
  '#10b981', // سبز
  '#f59e0b', // نارنجی
  '#a855f7', // بنفش
  '#ec4899', // صورتی
];
const STORE_KEY = 'football-team-maker-v1';
const NEWS_STORE_KEY = 'saipa-futsal-news-v1';
const ALL_IDS = PLAYERS.map((p) => p.id);
const ATTENDANCE_NAMES = {
  1: ['شایگان شاهدحقیقی', 'حسین کیادلیری', 'جواد تجری', 'شریف خاکشورنیا', 'مهدی جولایی', 'امین حسن پور', 'علی پور اسد', 'مسعود محمدی', 'مجتبی ابویی', 'مجید اسماعیل نژاد', 'امین زرنانی', 'احمد توکلی', 'امید شهمیرزادی'],
  2: ['شایگان شاهدحقیقی', 'حسین کیادلیری', 'جواد تجری', 'شریف خاکشورنیا', 'امین حسن پور', 'علی پور اسد', 'مسعود محمدی', 'مجتبی ابویی', 'مجید اسماعیل نژاد', 'احمد توکلی', 'نیما فتاحی', 'محسن علیاری', 'هادی فعال', 'محمد رضا زنجانیان', 'آرین معصومی', 'محمدجواد دهقانیان'],
};
const RESERVED_SESSIONS = [
  { hall: 'سالن ورزشی بوستان چیتگر تهران', date: '۱۷ آبان ۱۴۰۵', time: '۱۸ تا ۱۹:۳۰', status: 'برگزار شده', image: 'Reserved/1/c861UriM3xSDCufpVnUmXzI1nn6kOGYT474bbNVA.jpg' },
  { hall: 'سالن ورزشی بوستان چیتگر تهران', date: '۳۰ آبان ۱۴۰۵', time: '۱۸ تا ۱۹:۳۰', status: 'برگزار شده', image: 'Reserved/2/c861UriM3xSDCufpVnUmXzI1nn6kOGYT474bbNVA.jpg' },
  { hall: 'سالن ورزشی قائم (چیتگر)', date: '۷ آذر ۱۴۰۵', time: '۱۷ تا ۱۸:۳۰', status: 'برگزار خواهد شد', image: 'Reserved/3/7LVqzyrSLNad5tSiuPhpxZpzpfHktuyMy4zN3gCB.jpg' },
  { hall: 'سالن چند منظوره سلیمی جهرمی تهران', date: '۱۵ آذر ۱۴۰۵', time: '۱۸:۳۰ تا ۲۰', status: 'برگزار خواهد شد', image: 'Reserved/4/img-7420-8bf6a464.jpg' },
];
const DEFAULT_NEWS = [
  { id: 'upcoming-07', title: 'سانس آتی فوتسال', body: '۷ آذر ۱۴۰۵ در سالن ورزشی قائم (چیتگر)؛ منتظر یک بازی پرهیجان باشید.' },
  { id: 'upcoming-15', title: 'اطلاعیه سانس بعدی', body: 'سانس بعدی در ۱۵ آذر ۱۴۰۵ در سالن چندمنظوره سلیمی جهرمی تهران برگزار می‌شود.' },
  { id: 'player-ratings', title: 'ارزیابی بازیکنان فعال است', body: 'حاضران دو سانس برگزارشده می‌توانند به هم‌تیمی‌های خود امتیاز بدهند.' },
];
const GALLERY_SESSIONS = [
  { hall: 'سالن ورزشی بوستان چیتگر تهران', date: '۱۷ آبان ۱۴۰۵', number: 1, media: [
    ['photo', '1000088132.jpg', 'images/gallery/s01-p01.webp'], ['photo', '1000088133.jpg', 'images/gallery/s01-p02.webp'], ['photo', '1000088135.jpg', 'images/gallery/s01-p03.webp'],
    ['video', '1000088130.mp4', 'images/gallery/s01-v01.webp'], ['video', 'edit-final-compact.mp4', 'images/gallery/s01-v02.webp'],
  ] },
  { hall: 'سالن ورزشی بوستان چیتگر تهران', date: '۳۰ آبان ۱۴۰۵', number: 2, media: [
    ['photo', '20261121_180554.jpg', 'images/gallery/s02-p01.webp'], ['photo', '20261121_180602.jpg', 'images/gallery/s02-p02.webp'], ['photo', '20261121_180709(0).jpg', 'images/gallery/s02-p03.webp'], ['photo', 'fun.png', 'images/gallery/s02-p04.webp'],
    ['video', '20261121_162301_1.mp4', 'images/gallery/s02-v01.webp'], ['video', '20261121_181202.mp4', 'images/gallery/s02-v02.webp'], ['video', '20261121_181653.mp4', 'images/gallery/s02-v03.webp'],
    ['video', '20261121_181712.mp4', 'images/gallery/s02-v04.webp'], ['video', '20261121_181736.mp4', 'images/gallery/s02-v05.webp'], ['video', 'VID_20261122_075921_378.mp4', 'images/gallery/s02-v06.webp'],
  ] },
];

const mediaFile = (session, filename) => `pic%20%26%20vids/${session}/${encodeURIComponent(filename)}`;
const normalizePersonName = (name) => String(name || '').trim().replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ' ').replace(/\s+/g, ' ');
const playerIdByName = (name) => PLAYERS.find((player) => normalizePersonName(player.name) === normalizePersonName(name))?.id ?? null;
const attendeeIds = (session) => (ATTENDANCE_NAMES[Number(session)] || []).map(playerIdByName).filter((id) => id != null);
const suggestedRank = (score) => (score >= 9 ? 'A' : score >= 7 ? 'B' : score >= 5 ? 'C' : score >= 3 ? 'D' : 'E');

let newsTickerIndex = 0;
let currentUser = null;
let serverRsvpResponses = [];
let serverRatingSubmissions = [];
function readNewsItems() {
  try {
    const stored = localStorage.getItem(NEWS_STORE_KEY);
    if (stored == null) return [...DEFAULT_NEWS];
    const items = JSON.parse(stored);
    return Array.isArray(items) ? items.filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.body === 'string') : [...DEFAULT_NEWS];
  } catch (_) { return [...DEFAULT_NEWS]; }
}

function saveNewsItems(items) {
  try { localStorage.setItem(NEWS_STORE_KEY, JSON.stringify(items)); return true; }
  catch (_) { return false; }
}

/* ------------------------- tags ------------------------------ */
const KEEPERS = {
  complete: { rank: 2, label: 'دروازه‌بان کامل', short: 'کامل', icon: '🧤' },
  potential: { rank: 1, label: 'دروازه‌بان بالقوه', short: 'بالقوه', icon: '🧤' },
};
const LEVELS = {
  A: { weight: 5, label: 'رتبه A', short: 'A' },
  B: { weight: 4, label: 'رتبه B', short: 'B' },
  C: { weight: 3, label: 'رتبه C', short: 'C' },
  D: { weight: 2, label: 'رتبه D', short: 'D' },
  E: { weight: 1, label: 'رتبه E', short: 'E' },
};
const KEEPER_VALUES = [null, 'potential', 'complete'];
const LEVEL_VALUES = ['A', 'B', 'C', 'D', 'E'];
const PROFILE_AXES = [
  { key: 'power', label: 'قدرت' },
  { key: 'shot', label: 'شوت' },
  { key: 'dribble', label: 'دریبل' },
  { key: 'pass', label: 'پاس' },
  { key: 'pace', label: 'سرعت' },
  { key: 'iq', label: 'هوش بازی' },
];
const RANK_BASE_SCORE = { A: 88, B: 78, C: 68, D: 58, E: 48 };

/* --------------------------- helpers ------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const faDigits = '۰۱۲۳۴۵۶۷۸۹';
const fa = (n) => String(n).replace(/\d/g, (d) => faDigits[Number(d)]);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = (id) => PLAYERS.find((p) => p.id === id);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const closest = (el, sel) => (el && el.closest ? el.closest(sel) : null);
const shuffled = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const teamColor = (i) => TEAM_COLORS[i % TEAM_COLORS.length];
const teamLabel = (i) => `تیم ${fa(i + 1)}`;
const minPresentFor = (teamCount) => teamCount * MIN_PER_TEAM;

/* --------------------------- tags ---------------------------- */
function defaultTags() {
  const tags = {};
  for (const p of PLAYERS) {
    tags[p.id] = {
      keeper: KEEPER_VALUES.includes(p.keeper) ? p.keeper : null,
      level: LEVEL_VALUES.includes(p.level) ? p.level : 'C',
    };
  }
  return tags;
}

const tagOf = (pid) => state.tags[pid] || { keeper: null, level: 'C' };
const keeperRank = (pid) => (tagOf(pid).keeper ? KEEPERS[tagOf(pid).keeper].rank : 0);
const levelWeight = (pid) => (LEVELS[tagOf(pid).level] ? LEVELS[tagOf(pid).level].weight : LEVELS.C.weight);
const averageLevelScore = (ids) => {
  const players = ids.filter((id) => id != null);
  return players.length
    ? players.reduce((sum, id) => sum + levelWeight(id), 0) / players.length
    : 0;
};
const formatLevelAverage = (score) => fa(score.toFixed(1));

/* ---------------------------- state -------------------------- */
function defaultState() {
  return {
    step: 'players',
    present: [...ALL_IDS],
    teamCount: 2,
    captains: [null, null],
    assignments: {}, // pid -> team index (only non-captains)
    tags: defaultTags(),
    selected: null,
  };
}

let state = defaultState();
let pickerTeam = null;
let modalMode = null; // 'captain' | 'tags'
let tagPid = null;
let playerFilter = null;
let profilePinned = false;
let lightboxTrigger = null;
let dragPid = null;
let lastDragEnd = 0;
let toastTimer = null;

function allCaptainsChosen(caps = state.captains, count = state.teamCount) {
  return caps.length === count && caps.every((id) => id != null);
}

const isCaptain = (pid) => state.captains.includes(pid);
const isAssigned = (pid) => Object.prototype.hasOwnProperty.call(state.assignments, pid);

/* ------------------------- persistence ----------------------- */
function save() {
  try {
    const { step, present, teamCount, captains, assignments, tags } = state;
    localStorage.setItem(STORE_KEY, JSON.stringify({ step, present, teamCount, captains, assignments, tags }));
  } catch (_) {
    /* storage may be unavailable (private mode / file permissions) */
  }
}

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORE_KEY);
  } catch (_) {
    return;
  }
  if (!raw) return;

  try {
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return;

    const validIds = new Set(ALL_IDS);
    let present = Array.isArray(s.present)
      ? [...new Set(s.present.filter((id) => validIds.has(id)))]
      : [...ALL_IDS];
    present = ALL_IDS.filter((id) => present.includes(id));

    const teamCount = Number.isInteger(s.teamCount)
      ? Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, s.teamCount))
      : 2;

    let captains = Array.isArray(s.captains) ? s.captains.slice(0, teamCount) : [];
    while (captains.length < teamCount) captains.push(null);

    const seen = new Set();
    captains = captains.map((id) => {
      if (id == null || !validIds.has(id) || !present.includes(id) || seen.has(id)) return null;
      seen.add(id);
      return id;
    });

    const assignments = {};
    if (s.assignments && typeof s.assignments === 'object') {
      for (const [key, value] of Object.entries(s.assignments)) {
        const pid = Number(key);
        const team = Number(value);
        if (!validIds.has(pid) || !present.includes(pid)) continue;
        if (!Number.isInteger(team) || team < 0 || team >= teamCount) continue;
        if (captains.includes(pid)) continue;
        assignments[pid] = team;
      }
    }

    const tags = defaultTags();
    if (s.tags && typeof s.tags === 'object') {
      for (const [key, value] of Object.entries(s.tags)) {
        const pid = Number(key);
        if (!validIds.has(pid) || !value || typeof value !== 'object') continue;
        tags[pid] = {
          keeper: KEEPER_VALUES.includes(value.keeper) ? value.keeper : null,
          level: LEVEL_VALUES.includes(value.level) ? value.level : tags[pid].level,
        };
      }
    }

    let step = ['players', 'captains', 'board'].includes(s.step) ? s.step : 'players';
    if (present.length < minPresentFor(teamCount)) step = 'players';
    else if (step === 'board' && !allCaptainsChosen(captains, teamCount)) step = 'captains';

    state = { step, present, teamCount, captains, assignments, tags, selected: null };
  } catch (_) {
    /* corrupt state — start fresh */
  }
}

/* --------------------------- mutations ----------------------- */
function togglePresent(pid) {
  const index = state.present.indexOf(pid);
  if (index === -1) {
    state.present.push(pid);
  } else {
    state.present.splice(index, 1);
    state.captains = state.captains.map((c) => (c === pid ? null : c));
    delete state.assignments[pid];
  }
  const set = new Set(state.present);
  state.present = ALL_IDS.filter((id) => set.has(id));
  if (!state.present.includes(state.selected)) state.selected = null;
  save();
  render();
}

function selectAll() {
  state.present = [...ALL_IDS];
  save();
  render();
}

function selectNone() {
  state.present = [];
  state.captains = state.captains.map(() => null);
  state.assignments = {};
  state.selected = null;
  save();
  render();
}

function setTeamCount(count) {
  if (count === state.teamCount) return;
  if (minPresentFor(count) > state.present.length) {
    toast(
      `برای ${fa(count)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(minPresentFor(count))} بازیکن لازم است`
    );
    return;
  }

  if (count < state.teamCount) {
    state.captains = state.captains.slice(0, count);
    for (const pid of Object.keys(state.assignments)) {
      if (Number(state.assignments[pid]) >= count) delete state.assignments[pid];
    }
  } else {
    while (state.captains.length < count) state.captains.push(null);
  }

  state.teamCount = count;
  state.selected = null;
  save();
  render();
}

function updateTag(pid, kind, value) {
  if (!state.tags[pid]) state.tags[pid] = { keeper: null, level: 'C' };
  const tag = state.tags[pid];
  if (kind === 'keeper') tag.keeper = KEEPER_VALUES.includes(value) ? value : null;
  else if (kind === 'level' && LEVEL_VALUES.includes(value)) tag.level = value;
  save();
}

function moveToTeam(pid, teamIndex) {
  if (!state.present.includes(pid) || isCaptain(pid)) return;

  if (teamIndex == null) delete state.assignments[pid];
  else state.assignments[pid] = teamIndex;

  state.selected = null;
  save();
  render();
}

function chooseCaptain(teamIndex, pid) {
  if (teamIndex == null || teamIndex < 0 || teamIndex >= state.teamCount) return;
  if (!state.present.includes(pid)) return;

  const previous = state.captains[teamIndex];
  state.captains = state.captains.map((c, i) => (i === teamIndex || c === pid ? null : c));
  state.captains[teamIndex] = pid;
  delete state.assignments[pid];
  if (previous != null) delete state.assignments[previous];

  closeModal();
  save();
  render();
  toast(`👑 ${byId(pid).name} کاپیتان ${teamLabel(teamIndex)} شد`);
}

function shuffleTeams() {
  const candidates = state.present.filter((id) => !isCaptain(id));
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  state.assignments = {};
  const sizes = new Array(state.teamCount).fill(1); // captain counts as one

  for (const pid of candidates) {
    const smallest = Math.min(...sizes);
    const choices = sizes.map((size, i) => (size === smallest ? i : -1)).filter((i) => i >= 0);
    const team = choices[Math.floor(Math.random() * choices.length)];
    state.assignments[pid] = team;
    sizes[team] += 1;
  }

  state.selected = null;
  save();
  render();
  toast('بازیکنان به‌صورت تصادفی و مساوی تقسیم شدند ⚽');
}

function clearAssignments() {
  state.assignments = {};
  state.selected = null;
  save();
  render();
  toast('چیدمان پاک شد');
}

/* ---------------------- automatic drafting ------------------- */
function autoPickCaptains({ replace = false } = {}) {
  const present = new Set(state.present);
  if (present.size < minPresentFor(state.teamCount)) return false;

  let slots;
  if (replace) {
    slots = new Array(state.teamCount).fill(null);
  } else {
    slots = state.captains.slice(0, state.teamCount);
    while (slots.length < state.teamCount) slots.push(null);
    slots = slots.map((id) => (id != null && present.has(id) ? id : null));
  }

  const taken = new Set(slots.filter((id) => id != null));
  const pool = state.present
    .filter((id) => !taken.has(id))
    .map((id) => ({ id, w: levelWeight(id), k: keeperRank(id), r: Math.random() }))
    .sort((a, b) => b.w - a.w || b.k - a.k || a.r - b.r);

  for (let i = 0; i < slots.length && pool.length; i += 1) {
    if (slots[i] == null) slots[i] = pool.shift().id;
  }

  state.captains = slots;
  slots.forEach((pid) => {
    if (pid != null) delete state.assignments[pid];
  });
  state.selected = null;
  return true;
}

function smartArrange() {
  const teamCount = state.teamCount;
  const captains = state.captains.slice(0, teamCount);

  if (!allCaptainsChosen(captains, teamCount)) {
    return { ok: false, message: 'اول کاپیتان هر تیم را انتخاب کنید.' };
  }

  const needed = minPresentFor(teamCount);
  if (state.present.length < needed) {
    return {
      ok: false,
      message: `برای ${fa(teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(needed)} بازیکن لازم است؛ الان ${fa(state.present.length)} نفر حاضرند.`,
    };
  }

  const minSize = Math.floor(state.present.length / teamCount);
  const remainder = state.present.length % teamCount;

  // When sizes cannot be equal, rotate which teams receive the extra player.
  const previousSizes = new Array(teamCount).fill(0);
  for (const pid of state.present) {
    const captainTeam = captains.indexOf(pid);
    const teamIndex = captainTeam >= 0 ? captainTeam : state.assignments[pid];
    if (Number.isInteger(teamIndex) && teamIndex >= 0 && teamIndex < teamCount) previousSizes[teamIndex] += 1;
  }
  const hasPreviousDraft = Object.keys(state.assignments).some((pid) => state.present.includes(Number(pid)));
  const previousExtraTeams = hasPreviousDraft
    ? previousSizes.map((size, index) => (size > minSize ? index : -1)).filter((index) => index >= 0)
    : [];
  let extraTeamPool = range(0, teamCount - 1);
  let extraTeams;
  if (previousExtraTeams.length) {
    const freshTeams = extraTeamPool.filter((index) => !previousExtraTeams.includes(index));
    extraTeams = freshTeams.length >= remainder
      ? shuffled(freshTeams).slice(0, remainder)
      : [...freshTeams, ...shuffled(previousExtraTeams).slice(0, remainder - freshTeams.length)];
  } else {
    extraTeams = shuffled(extraTeamPool).slice(0, remainder);
  }
  extraTeams = new Set(extraTeams);
  const targetSizes = Array.from({ length: teamCount }, (_, index) => minSize + (extraTeams.has(index) ? 1 : 0));

  const placed = new Set();
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    index,
    ids: [],
    score: 0,
    keeper: 0,
    captain: captains[index],
  }));

  function add(team, pid) {
    team.ids.push(pid);
    team.score += levelWeight(pid);
    team.keeper = Math.max(team.keeper, keeperRank(pid));
    placed.add(pid);
  }

  function chooseBalancedTeam(pool, item) {
    const projected = pool.map((team) => ({
      team,
      average: (team.score + item.level) / (team.ids.length + 1),
    }));
    const bestAverage = Math.min(...projected.map((candidate) => candidate.average));
    // Randomly choose among near-equal options so repeated drafts feel fresh while staying balanced.
    const nearBest = projected.filter((candidate) => candidate.average <= bestAverage + 0.45);
    return shuffled(nearBest)[0].team;
  }

  captains.forEach((pid, i) => add(teams[i], pid));

  const candidates = state.present
    .filter((id) => !placed.has(id))
    .map((id) => ({ id, level: levelWeight(id), keeper: keeperRank(id), r: Math.random() }));

  function assignKeeperGroup(rank, isEligible) {
    const group = candidates
      .filter((c) => c.keeper === rank && !placed.has(c.id))
      .sort((a, b) => b.level - a.level || a.r - b.r);

    for (const item of group) {
      if (placed.has(item.id)) continue;
      const eligible = teams.filter((team) => isEligible(team) && team.ids.length < targetSizes[team.index]);
      if (!eligible.length) continue;
      const lowestKeeperRank = Math.min(...eligible.map((team) => team.keeper));
      const keeperPool = eligible.filter((team) => team.keeper === lowestKeeperRank);
      add(chooseBalancedTeam(keeperPool, item), item.id);
    }
  }

  // اول دروازه‌بان‌های کامل، بعد بالقوه‌ها؛ هر تیم قبل از هر چیز یک دروازه‌بان می‌گیرد.
  assignKeeperGroup(2, (team) => team.keeper < 2);
  assignKeeperGroup(1, (team) => team.keeper === 0);

  // بقیهٔ بازیکن‌ها از قوی‌ترین به ضعیف‌ترین پخش می‌شوند؛ تساوی‌های نزدیک تصادفی‌اند.
  const rest = candidates
    .filter((c) => !placed.has(c.id))
    .sort((a, b) => b.level - a.level || b.keeper - a.keeper || a.r - b.r);

  for (const item of rest) {
    const pool = teams.filter((team) => team.ids.length < targetSizes[team.index]);
    const leastFilled = Math.min(...pool.map((team) => team.ids.length));
    const sameSizePool = pool.filter((team) => team.ids.length === leastFilled);
    const target = chooseBalancedTeam(sameSizePool, item);
    add(target, item.id);
  }

  const tooSmall = teams.filter((team) => team.ids.length < MIN_PER_TEAM);
  if (tooSmall.length) {
    return {
      ok: false,
      message: `چیدمان انجام نشد؛ ${fa(tooSmall.length)} تیم کمتر از ${fa(MIN_PER_TEAM)} نفر شدند. تعداد تیم‌ها را کم کنید.`,
    };
  }

  state.assignments = {};
  for (const team of teams) {
    for (const pid of team.ids) {
      if (!captains.includes(pid)) state.assignments[pid] = team.index;
    }
  }
  state.selected = null;

  const missing = teams.filter((team) => team.keeper === 0).length;
  const message =
    missing === 0
      ? `یارکشی هوشمند انجام شد — هر ${fa(teamCount)} تیم دروازه‌بان دارد 🧤`
      : `یارکشی انجام شد، اما ${fa(missing)} تیم دروازه‌بان ندارد؛ تعداد دروازه‌بان حاضر کم است.`;

  return { ok: true, message };
}

function autoDraft() {
  const needed = minPresentFor(state.teamCount);
  if (state.present.length < needed) {
    toast(
      `برای ${fa(state.teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(needed)} بازیکن لازم است`
    );
    return;
  }

  autoPickCaptains({ replace: false });
  const result = smartArrange();
  if (!result.ok) {
    toast(result.message);
    return;
  }

  state.step = 'board';
  state.selected = null;
  closeModal();
  save();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toast(result.message);
}

function runSmartArrange() {
  const result = smartArrange();
  if (!result.ok) {
    toast(result.message);
    return;
  }
  save();
  render();
  toast(result.message);
}

function resetAll() {
  if (!window.confirm('همهٔ تنظیمات پاک شود و از ابتدا شروع کنیم؟')) return;
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (_) {
    /* ignore */
  }
  state = defaultState();
  save();
  render();
  toast('همه‌چیز از نو');
}

/* ---------------------------- render ------------------------- */
const els = {
  homeView: $('#homeView'),
  reservedView: $('#reservedView'),
  galleryView: $('#galleryView'),
  teamWorkflow: $('#teamWorkflow'),
  reservedGrid: $('#reservedGrid'),
  gallerySessions: $('#gallerySessions'),
  hubNextSession: $('#hubNextSession'),
  ratingsView: $('#ratingsView'),
  ratingSession: $('#ratingSession'),
  ratingRaterName: $('#ratingRaterName'),
  ratingFormMessage: $('#ratingFormMessage'),
  ratingTargets: $('#ratingTargets'),
  ratingSubmitHint: $('#ratingSubmitHint'),
  ratingResultsSummary: $('#ratingResultsSummary'),
  ratingResults: $('#ratingResults'),
  authModal: $('#authModal'),
  authUserBadge: $('#authUserBadge'),
  loginForm: $('#loginForm'),
  loginUsername: $('#loginUsername'),
  loginPassword: $('#loginPassword'),
  loginMessage: $('#loginMessage'),
  newsView: $('#newsView'),
  newsCompose: $('#newsCompose'),
  newsTitleInput: $('#newsTitleInput'),
  newsBodyInput: $('#newsBodyInput'),
  newsList: $('#newsList'),
  newsCount: $('#newsCount'),
  newsTickerTitle: $('#newsTickerTitle'),
  newsTickerText: $('#newsTickerText'),
  newsTickerCopy: $('#newsTickerCopy'),
  mediaLightbox: $('#mediaLightbox'),
  mediaViewerContent: $('#mediaViewerContent'),
  mediaViewerCaption: $('#mediaViewerCaption'),
  views: {
    players: $('#view-players'),
    captains: $('#view-captains'),
    board: $('#view-board'),
  },
  stepBtns: Array.from(document.querySelectorAll('.step-btn')),
  peopleGrid: $('#peopleGrid'),
  playerProfile: $('#playerProfile'),
  playerProfileContent: $('#playerProfileContent'),
  animeLightbox: $('#animeLightbox'),
  animeLightboxImage: $('#animeLightboxImage'),
  animeLightboxCaption: $('#animeLightboxCaption'),
  animeLightboxClose: $('#animeLightboxClose'),
  teamCountPicker: $('#teamCountPicker'),
  teamCountNote: $('#teamCountNote'),
  presentCounter: $('#presentCounter'),
  tagsSummary: $('#tagsSummary'),
  playersHint: $('#playersHint'),
  toCaptainsBtn: $('#toCaptainsBtn'),
  autoDraftBtn: $('#autoDraftBtn'),
  resetBtn: $('#resetBtn'),
  captainsGrid: $('#captainsGrid'),
  captainsHint: $('#captainsHint'),
  toBoardBtn: $('#toBoardBtn'),
  autoCaptainsBtn: $('#autoCaptainsBtn'),
  poolZone: $('#poolZone'),
  pool: $('#pool'),
  poolCount: $('#poolCount'),
  boardSummary: $('#boardSummary'),
  boardHint: $('#boardHint'),
  teamsGrid: $('#teamsGrid'),
  shuffleBtn: $('#shuffleBtn'),
  smartBtn: $('#smartBtn'),
  clearBtn: $('#clearBtn'),
  copyBtn: $('#copyBtn'),
  modal: $('#modal'),
  modalTitle: $('#modalTitle'),
  modalSub: $('#modalSub'),
  modalGrid: $('#modalGrid'),
  toast: $('#toast'),
};

async function apiRequest(path, options = {}) {
  const response = await fetch(path, { credentials:'same-origin', ...options, headers:{ ...(options.body ? { 'Content-Type':'application/json' } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'ارتباط با سرور انجام نشد.');
  return data;
}

function updateAuthUI() {
  const openButton = $('[data-auth-open]');
  const logoutButton = $('[data-auth-logout]');
  if (currentUser) {
    els.authUserBadge.textContent = `${currentUser.admin ? 'مدیر' : 'عضو'}: ${currentUser.name}`;
    els.authUserBadge.hidden = false;
    openButton.hidden = true;
    logoutButton.hidden = false;
  } else {
    els.authUserBadge.hidden = true;
    openButton.hidden = false;
    logoutButton.hidden = true;
  }
}

function openAuthModal() {
  els.authModal.hidden = false;
  els.loginMessage.textContent = '';
  window.setTimeout(() => els.loginUsername.focus(), 0);
}

function closeAuthModal() { els.authModal.hidden = true; }

async function refreshRemoteSession() {
  try {
    const result = await apiRequest('/api/session');
    currentUser = result.user;
    updateAuthUI();
    await loadRemoteRanks();
    if (!currentUser) return;
    if (!els.reservedView.hidden) await loadRemoteRsvps();
    if (!els.ratingsView.hidden) await renderRatings();
  } catch (_) {
    currentUser = null;
    updateAuthUI();
  }
}

async function loadRemoteRanks() {
  try {
    const result = await apiRequest('/api/ranks');
    for (const [rawId, level] of Object.entries(result.ranks || {})) {
      const id = Number(rawId);
      if (state.tags[id] && LEVEL_VALUES.includes(level)) state.tags[id].level = level;
    }
    save();
    if (!els.teamWorkflow.hidden) render();
    if (!els.ratingsView.hidden && currentUser?.admin) renderRatingResults();
  } catch (_) { /* local ranks remain available until the server is reachable */ }
}

async function handleLogin(event) {
  event.preventDefault();
  const button = $('button[type="submit"]', els.loginForm);
  button.disabled = true;
  els.loginMessage.textContent = 'در حال بررسی اطلاعات…';
  try {
    const result = await apiRequest('/api/login', { method:'POST', body:JSON.stringify({ username:els.loginUsername.value, password:els.loginPassword.value }) });
    currentUser = result.user;
    els.loginForm.reset();
    closeAuthModal();
    updateAuthUI();
    if (!els.reservedView.hidden) await loadRemoteRsvps();
    if (!els.ratingsView.hidden) await renderRatings();
    toast(`خوش آمدید ${currentUser.name} ✓`);
  } catch (error) {
    els.loginMessage.textContent = error.message;
  } finally { button.disabled = false; }
}

async function logoutUser() {
  try { await apiRequest('/api/logout', { method:'POST', body:'{}' }); }
  catch (_) { /* clear the UI even if the server is unavailable */ }
  currentUser = null;
  serverRsvpResponses = [];
  serverRatingSubmissions = [];
  updateAuthUI();
  if (!els.reservedView.hidden) renderReserved();
  if (!els.ratingsView.hidden) renderRatings();
  toast('از حساب خارج شدید');
}

async function loadRemoteRsvps() {
  if (!currentUser) { serverRsvpResponses = []; renderReserved(); return; }
  try {
    const result = await apiRequest('/api/rsvps');
    serverRsvpResponses = result.responses || [];
  } catch (_) { serverRsvpResponses = []; }
  if (!els.reservedView.hidden) renderReserved();
}

async function loadRemoteRatings() {
  if (!currentUser?.admin) { serverRatingSubmissions = []; renderRatingResults(); return; }
  try {
    const result = await apiRequest('/api/ratings');
    serverRatingSubmissions = result.submissions || [];
  } catch (_) { serverRatingSubmissions = []; }
  renderRatingResults();
}

async function applySuggestedRank(playerId, level) {
  if (!currentUser?.admin) { toast('فقط مدیر سامانه می‌تواند رتبه‌ها را تغییر دهد'); return; }
  try {
    await apiRequest('/api/ranks', { method:'POST', body:JSON.stringify({ playerId, level }) });
    if (state.tags[playerId]) state.tags[playerId].level = level;
    save();
    renderRatingResults();
    toast(`${byId(playerId).name}: رتبهٔ ${level} برای همه به‌روزرسانی شد ✓`);
  } catch (error) { toast(error.message); }
}

function renderReserved() {
  els.reservedGrid.innerHTML = RESERVED_SESSIONS.map((session, index) => `
    <article class="reserved-card ${index > 1 ? 'is-upcoming' : ''}">
      <div class="reserved-photo"><img src="${esc(session.image)}" alt="${esc(session.hall)}" loading="lazy" /><span class="session-number">سانس ${fa(index + 1)}</span></div>
      <div class="reserved-info"><span class="session-status ${index > 1 ? 'upcoming' : 'completed'}"><i></i>${esc(session.status)}</span><h2>${esc(session.hall)}</h2><p>📅 ${esc(session.date)}</p><p>🕒 ${esc(session.time)}</p></div>
      ${index > 1 ? renderRsvpPanel(session, index + 1) : ''}
    </article>`).join('');
  const next = RESERVED_SESSIONS.find((session) => session.status === 'برگزار خواهد شد');
  els.hubNextSession.innerHTML = `<span class="next-session-icon">✦</span><span><small>سانس آتی:</small><strong>${esc(next.hall)}</strong></span><span class="next-session-date">📅 ${esc(next.date)} · 🕒 ${esc(next.time)}</span>`;
}

function renderRsvpPanel(session, sessionNumber) {
  const votes = serverRsvpResponses.filter((item) => item.session === sessionNumber);
  const coming = votes.filter((item) => item.attending);
  const notComing = votes.filter((item) => !item.attending);
  const total = votes.length;
  const yesPercent = total ? Math.round((coming.length / total) * 100) : 0;
  const myVote = currentUser?.playerId ? votes.find((item) => item.playerId === currentUser.playerId) : null;
  const voteForm = !currentUser
    ? `<div class="rsvp-login-prompt"><span>برای ثبت حضور، ابتدا وارد حساب شخصی‌تان شوید.</span><button class="btn auto" type="button" data-auth-open>ورود اعضا</button></div>`
    : !currentUser.playerId
      ? '<div class="rsvp-login-prompt"><span>حساب مدیر برای ثبت پاسخ حضور استفاده نمی‌شود.</span></div>'
      : `<div class="rsvp-vote-form"><div class="rsvp-name-field"><span>پاسخ شما · ${esc(currentUser.name)}</span><small>حساب اختصاصی شما</small></div><div class="rsvp-options" role="group" aria-label="پاسخ شما"><label class="rsvp-option yes"><input type="radio" name="rsvp-${sessionNumber}" value="yes" ${myVote?.attending === true ? 'checked' : ''} /><span>✓</span> شرکت می‌کنم</label><label class="rsvp-option no"><input type="radio" name="rsvp-${sessionNumber}" value="no" ${myVote?.attending === false ? 'checked' : ''} /><span>×</span> نمی‌آیم</label></div><button class="btn auto rsvp-submit" type="button" data-rsvp-submit="${sessionNumber}">${myVote ? 'به‌روزرسانی پاسخ' : 'ثبت پاسخ'}</button></div>`;
  return `<section class="rsvp-poll" data-rsvp-session="${sessionNumber}" aria-label="نظرسنجی شرکت در سانس ${fa(sessionNumber)}">
    <div class="rsvp-heading"><span class="rsvp-heading-icon">☑</span><div><strong>نظرسنجی شرکت در سالن</strong><small>به ما بگویید در این سانس می‌آیید یا نه</small></div><span class="rsvp-date">📅 ${esc(session.date)} · 🕒 ${esc(session.time)}</span></div>
    ${voteForm}
    <div class="rsvp-summary"><div class="rsvp-summary-top"><span>تا این لحظه ${fa(total)} پاسخ</span><div><b class="rsvp-yes-count">✓ ${fa(coming.length)} می‌آیند</b><b class="rsvp-no-count">× ${fa(notComing.length)} نمی‌آیند</b></div></div><div class="rsvp-meter"><span style="width:${yesPercent}%"></span></div>
      ${total ? `<div class="rsvp-respondents"><div><small>می‌آیند</small><p>${coming.length ? coming.map((item) => `<span>${esc(item.name)}</span>`).join('') : '—'}</p></div><div><small>نمی‌آیند</small><p>${notComing.length ? notComing.map((item) => `<span>${esc(item.name)}</span>`).join('') : '—'}</p></div></div>` : '<p class="rsvp-empty">هنوز پاسخی ثبت نشده است.</p>'}
    </div>
  </section>`;
}

async function submitSessionRsvp(sessionNumber) {
  if (!currentUser?.playerId) { openAuthModal(); return; }
  const panel = $(`[data-rsvp-session="${sessionNumber}"]`);
  const selected = $(`input[name="rsvp-${sessionNumber}"]:checked`, panel);
  if (!selected) { toast('بگویید در این سانس شرکت می‌کنید یا نه'); return; }
  try {
    await apiRequest('/api/rsvps', { method:'POST', body:JSON.stringify({ session:sessionNumber, attending:selected.value === 'yes' }) });
    await loadRemoteRsvps();
    toast('پاسخ شما با حساب کاربری‌تان ثبت شد ✓');
  } catch (error) { toast(error.message); }
}

function showTickerNews(index = newsTickerIndex, animate = false) {
  const items = readNewsItems();
  if (!items.length) {
    els.newsTickerTitle.textContent = 'خبرها';
    els.newsTickerText.textContent = 'هنوز اطلاعیه‌ای ثبت نشده است.';
    return;
  }
  newsTickerIndex = ((index % items.length) + items.length) % items.length;
  const item = items[newsTickerIndex];
  const update = () => {
    els.newsTickerTitle.textContent = item.title;
    els.newsTickerText.textContent = item.body;
    els.newsTickerCopy.classList.remove('is-changing');
  };
  if (animate) {
    els.newsTickerCopy.classList.add('is-changing');
    window.setTimeout(update, 220);
  } else update();
}

function renderNews() {
  const items = readNewsItems();
  els.newsCount.textContent = `${fa(items.length)} اطلاعیه`;
  els.newsList.innerHTML = items.length ? items.map((item, index) => `
    <article class="news-card"><span class="news-card-index">${fa(index + 1)}</span><div class="news-card-content"><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p>${item.createdAt ? `<small>${esc(new Date(item.createdAt).toLocaleDateString('fa-IR'))}</small>` : '<small>اطلاعیهٔ تیم</small>'}</div><button class="news-delete" type="button" data-delete-news="${esc(item.id)}" aria-label="حذف اطلاعیه">✕</button></article>`).join('') : '<div class="rating-empty"><span>📣</span><strong>اطلاعیه‌ای ثبت نشده</strong><p>از کادر بالا اولین خبر تیم را اضافه کنید.</p></div>';
  showTickerNews(newsTickerIndex);
}

function advanceTickerNews() {
  const items = readNewsItems();
  if (!items.length) return showTickerNews(0);
  showTickerNews(newsTickerIndex + 1, true);
}

function addNewsItem(event) {
  event.preventDefault();
  const title = els.newsTitleInput.value.trim();
  const body = els.newsBodyInput.value.trim();
  if (!title || !body) return;
  const items = readNewsItems();
  items.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, body, createdAt: new Date().toISOString() });
  if (!saveNewsItems(items)) { toast('ذخیرهٔ اطلاعیه در این مرورگر ممکن نشد'); return; }
  els.newsCompose.reset();
  newsTickerIndex = 0;
  renderNews();
  toast('اطلاعیه ثبت شد و در نوار خبرها قرار گرفت ✓');
}

function deleteNewsItem(id) {
  if (!id) return;
  const items = readNewsItems().filter((item) => item.id !== id);
  if (!saveNewsItems(items)) { toast('حذف اطلاعیه ذخیره نشد'); return; }
  newsTickerIndex = 0;
  renderNews();
  toast('اطلاعیه حذف شد');
}

function renderGallery() {
  els.gallerySessions.innerHTML = GALLERY_SESSIONS.map((session) => `
    <section class="gallery-session">
      <header class="gallery-session-head"><div><span class="eyebrow">سانس ${fa(session.number)}</span><h2>${esc(session.hall)}</h2><p>${esc(session.date)}</p></div><span class="gallery-count">${fa(session.media.length)} فایل</span></header>
      <div class="media-grid">${session.media.map(([kind, file, thumb]) => {
        const source = mediaFile(session.number, file);
        const caption = kind === 'video' ? 'ویدئو' : 'تصویر';
        return `<button class="media-tile ${kind === 'video' ? 'is-video' : ''}" type="button" data-open-media="${esc(source)}" data-kind="${kind}" data-caption="${esc(`${caption} · ${file}`)}" aria-label="نمایش ${caption}"><img src="${esc(thumb)}" alt="${caption} از سانس ${fa(session.number)}" loading="lazy" />${kind === 'video' ? '<span class="media-play">▶</span><span class="media-type">ویدئو</span>' : ''}</button>`;
      }).join('')}</div>
    </section>`).join('');
}

async function renderRatings() {
  const admin = Boolean(currentUser?.admin);
  const submitTab = $('[data-rating-tab="submit"]');
  const resultsTab = $('[data-rating-tab="results"]');
  els.ratingRaterName.value = currentUser?.name || '';
  els.ratingRaterName.placeholder = currentUser ? '' : 'ابتدا وارد حساب خود شوید';
  submitTab.hidden = admin;
  resultsTab.hidden = !admin;
  $('#ratingSubmitView').hidden = admin;
  $('#ratingResultsView').hidden = !admin;
  document.querySelectorAll('[data-rating-tab]').forEach((button) => button.classList.toggle('active', button === (admin ? resultsTab : submitTab)));
  if (admin) await loadRemoteRatings();
  else if (!currentUser) {
    els.ratingTargets.hidden = true;
    $('[data-rating-submit]').hidden = true;
    els.ratingFormMessage.textContent = 'برای ثبت امتیاز با حساب کاربری اختصاصی خود وارد شوید.';
  } else {
    els.ratingTargets.hidden = true;
    $('[data-rating-submit]').hidden = true;
    const session = Number(els.ratingSession.value);
    els.ratingFormMessage.textContent = attendeeIds(session).includes(currentUser.playerId)
      ? `حساب شما آماده است؛ افراد سانس ${fa(session)} را نمایش دهید.`
      : 'حساب شما در فهرست حاضران این سانس نیست و امکان ارزیابی آن را ندارد.';
  }
}

function loadRatingTargets() {
  const session = Number(els.ratingSession.value);
  if (!currentUser?.playerId) {
    els.ratingTargets.hidden = true;
    $('[data-rating-submit]').hidden = true;
    els.ratingFormMessage.textContent = 'برای ثبت امتیاز با حساب کاربری اختصاصی خود وارد شوید.';
    openAuthModal();
    return;
  }
  const voterId = currentUser.playerId;
  if (!attendeeIds(session).includes(voterId)) {
    els.ratingTargets.hidden = true;
    $('[data-rating-submit]').hidden = true;
    els.ratingFormMessage.textContent = 'حساب شما در فهرست حاضران این سانس نیست و امکان ارزیابی آن را ندارد.';
    return;
  }

  const targets = attendeeIds(session).filter((id) => id !== voterId);
  els.ratingTargets.dataset.session = String(session);
  els.ratingTargets.dataset.voterId = String(voterId);
  els.ratingTargets.innerHTML = targets.map((id) => {
    const player = byId(id);
    return `<label class="rating-target"><img src="${esc(player.img)}" alt="" loading="lazy" /><span class="rating-target-name">${esc(player.name)}</span><span class="rating-target-score"><small>امتیاز از ۱۰</small><select data-rating-player="${id}" required aria-label="امتیاز ${esc(player.name)}"><option value="">—</option>${range(1, 10).map((score) => `<option value="${score}">${fa(score)}</option>`).join('')}</select></span></label>`;
  }).join('');
  els.ratingTargets.hidden = false;
  $('[data-rating-submit]').hidden = false;
  els.ratingFormMessage.textContent = `شما به ${fa(targets.length)} بازیکن دیگر از سانس ${fa(session)} امتیاز می‌دهید. به خودتان امتیاز داده نمی‌شود.`;
  els.ratingSubmitHint.textContent = 'همهٔ امتیازها را از ۱ تا ۱۰ انتخاب کنید.';
}

async function submitRating() {
  const session = Number(els.ratingTargets.dataset.session);
  const voterId = currentUser?.playerId;
  if (!session || !voterId || Number(els.ratingTargets.dataset.voterId) !== voterId) { els.ratingFormMessage.textContent = 'نشست ورود منقضی شده؛ دوباره وارد حساب شوید.'; return; }
  const ids = attendeeIds(session).filter((id) => id !== voterId);
  const ratings = {};
  for (const id of ids) {
    const select = $(`[data-rating-player="${id}"]`, els.ratingTargets);
    if (!select || select.value === '') {
      els.ratingSubmitHint.textContent = 'برای همهٔ بازیکنان امتیاز انتخاب کنید.';
      if (select) select.focus();
      return;
    }
    ratings[id] = Number(select.value);
  }
  try {
    await apiRequest('/api/ratings', { method:'POST', body:JSON.stringify({ session, ratings }) });
    els.ratingSubmitHint.textContent = 'امتیازها با حساب کاربری شما روی سرور ثبت شد. ممنون از بازخوردتان!';
  } catch (error) { els.ratingSubmitHint.textContent = error.message; }
}

function renderRatingResults() {
  if (!els.ratingResults) return;
  if (!currentUser?.admin) {
    els.ratingResultsSummary.textContent = 'مشاهدهٔ نتایج فقط برای حساب مدیر مجاز است.';
    els.ratingResults.innerHTML = '';
    return;
  }
  const records = serverRatingSubmissions;
  const scoresByPlayer = new Map();
  for (const record of records) {
    const allowed = new Set(attendeeIds(record.session));
    if (!allowed.has(record.voterId)) continue;
    for (const [rawId, rawScore] of Object.entries(record.ratings)) {
      const id = Number(rawId);
      const score = Number(rawScore);
      if (id === record.voterId || !allowed.has(id) || !Number.isFinite(score) || score < 1 || score > 10) continue;
      if (!scoresByPlayer.has(id)) scoresByPlayer.set(id, []);
      scoresByPlayer.get(id).push(score);
    }
  }
  const rated = PLAYERS.filter((player) => scoresByPlayer.has(player.id));
  els.ratingResultsSummary.textContent = `${fa(records.length)} ارزیابی ثبت‌شده · ${fa(rated.length)} بازیکن امتیاز دریافت کرده‌اند`;
  els.ratingResults.innerHTML = rated.length ? rated.map((player) => {
    const scores = scoresByPlayer.get(player.id);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const rank = suggestedRank(average);
    const current = state.tags[player.id]?.level || player.level || 'C';
    return `<article class="rating-result-card"><div class="rating-result-player"><img src="${esc(player.img)}" alt="" loading="lazy" /><strong>${esc(player.name)}</strong></div><div class="rating-result-stat"><small>میانگین امتیاز</small><strong>${fa(average.toFixed(1))}<span>/۱۰</span></strong></div><div class="rating-result-stat"><small>رتبهٔ پیشنهادی</small><strong class="suggested-rank rank-${rank}">${rank}</strong></div><div class="rating-result-stat"><small>رتبهٔ فعلی</small><strong>${current}</strong></div><button class="btn ${current === rank ? 'ghost' : 'auto'} rating-apply" type="button" data-apply-rating="${player.id}" data-rank="${rank}" ${current === rank ? 'disabled' : ''}>${current === rank ? 'رتبه به‌روز است' : `اعمال رتبهٔ ${rank}`}</button><small class="rating-vote-count">${fa(scores.length)} امتیاز</small></article>`;
  }).join('') : '<div class="rating-empty"><span>⭐</span><strong>هنوز امتیازی ثبت نشده</strong><p>با ثبت ارزیابی‌های سانس، میانگین‌ها و رتبه‌های پیشنهادی اینجا نمایش داده می‌شوند.</p></div>';
}

function showAppSection(section) {
  const valid = ['home', 'team', 'reserved', 'gallery', 'ratings', 'news'].includes(section) ? section : 'home';
  els.homeView.hidden = valid !== 'home';
  els.reservedView.hidden = valid !== 'reserved';
  els.galleryView.hidden = valid !== 'gallery';
  els.ratingsView.hidden = valid !== 'ratings';
  els.newsView.hidden = valid !== 'news';
  els.teamWorkflow.hidden = valid !== 'team';
  document.body.classList.toggle('team-workflow-open', valid === 'team');
  document.querySelectorAll('[data-app-section]').forEach((button) => button.classList.toggle('active', button.dataset.appSection === valid));
  if (valid === 'team') render();
  if (valid === 'home') renderReserved();
  if (valid === 'reserved') { renderReserved(); loadRemoteRsvps(); }
  if (valid === 'gallery') renderGallery();
  if (valid === 'ratings') renderRatings();
  if (valid === 'news') renderNews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMediaViewer(button) {
  const source = button.dataset.openMedia;
  const kind = button.dataset.kind;
  const caption = button.dataset.caption;
  els.mediaViewerContent.innerHTML = kind === 'video'
    ? `<video src="${esc(source)}" controls playsinline preload="metadata" />`
    : `<img src="${esc(source)}" alt="${esc(caption)}" />`;
  els.mediaViewerCaption.textContent = caption;
  els.mediaLightbox.hidden = false;
  els.mediaLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('media-viewer-open');
}

function closeMediaViewer() {
  if (els.mediaLightbox.hidden) return;
  const video = els.mediaViewerContent.querySelector('video');
  if (video) video.pause();
  els.mediaLightbox.hidden = true;
  els.mediaLightbox.setAttribute('aria-hidden', 'true');
  els.mediaViewerContent.innerHTML = '';
  document.body.classList.remove('media-viewer-open');
}

function render() {
  // guard the current step against an invalid state
  if (state.present.length < minPresentFor(state.teamCount)) state.step = 'players';
  else if (state.step === 'board' && !allCaptainsChosen()) state.step = 'captains';

  renderNav();
  Object.entries(els.views).forEach(([name, el]) => {
    el.classList.toggle('active', state.step === name);
  });

  if (state.step === 'players') renderPlayers();
  if (state.step === 'captains') renderCaptains();
  if (state.step === 'board') renderBoard();
}

function renderNav() {
  els.stepBtns.forEach((btn) => {
    const target = btn.dataset.goto;
    const enabled =
      target === 'players' ||
      (target === 'captains' && state.present.length >= minPresentFor(state.teamCount)) ||
      (target === 'board' && allCaptainsChosen());
    btn.disabled = !enabled;
    btn.classList.toggle('active', state.step === target);
  });
}

function updatePlayersActions() {
  const needed = minPresentFor(state.teamCount);
  const enough = state.present.length >= needed;
  const counts = presentTagCounts();
  const keepers = counts.complete + counts.potential;
  const keeperNote =
    keepers < state.teamCount
      ? ` ⚠️ فقط ${fa(keepers)} دروازه‌بان برای ${fa(state.teamCount)} تیم حاضر است.`
      : ` 🧤 ${fa(keepers)} دروازه‌بان حاضر است.`;

  els.toCaptainsBtn.disabled = !enough;
  if (els.autoDraftBtn) els.autoDraftBtn.disabled = !enough;
  els.playersHint.textContent = enough
    ? `${fa(state.present.length)} بازیکن برای ${fa(state.teamCount)} تیم آماده است (حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم).${keeperNote}`
    : `برای ${fa(state.teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(needed)} بازیکن لازم است (${fa(state.present.length)} نفر حاضر).`;
}

function presentTagCounts() {
  const counts = { complete: 0, potential: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const id of state.present) {
    const tag = tagOf(id);
    if (tag.keeper) counts[tag.keeper] += 1;
    if (LEVELS[tag.level]) counts[tag.level] += 1;
  }
  return counts;
}

function renderTagsSummary() {
  if (!els.tagsSummary) return;
  const counts = presentTagCounts();
  const keepers = counts.complete + counts.potential;
  const short = keepers < state.teamCount;

  els.tagsSummary.innerHTML = `
    <button type="button" class="tag-stat tag-filter ${playerFilter == null ? 'active' : ''}"
      data-player-filter="all" aria-pressed="${playerFilter == null}" title="نمایش همهٔ بازیکنان">همه <strong>${fa(PLAYERS.length)}</strong></button>
    <button type="button" class="tag-stat tag-filter keeper-complete ${playerFilter === 'keeper:complete' ? 'active' : ''}"
      data-player-filter="keeper:complete" aria-pressed="${playerFilter === 'keeper:complete'}" title="فیلتر دروازه‌بان کامل">🧤 کامل <strong>${fa(counts.complete)}</strong></button>
    <button type="button" class="tag-stat tag-filter keeper-potential ${playerFilter === 'keeper:potential' ? 'active' : ''}"
      data-player-filter="keeper:potential" aria-pressed="${playerFilter === 'keeper:potential'}" title="فیلتر دروازه‌بان بالقوه">🧤 بالقوه <strong>${fa(counts.potential)}</strong></button>
    ${Object.keys(LEVELS).map((rank) => `<button type="button" class="tag-stat tag-filter level-${rank.toLowerCase()} ${playerFilter === `rank:${rank}` ? 'active' : ''}"
      data-player-filter="rank:${rank}" aria-pressed="${playerFilter === `rank:${rank}`}" title="نمایش بازیکنان رتبهٔ ${rank}">رتبه ${rank} <strong>${fa(counts[rank])}</strong></button>`).join('')}
    ${short ? `<span class="tag-stat tag-warn">⚠️ ${fa(keepers)} دروازه‌بان برای ${fa(state.teamCount)} تیم کافی نیست</span>` : ''}`;
}

function matchesPlayerFilter(player) {
  if (!playerFilter) return true;
  const [kind, value] = playerFilter.split(':');
  const tag = tagOf(player.id);
  if (kind === 'rank') return tag.level === value;
  if (kind === 'keeper') return tag.keeper === value;
  return true;
}

function setPlayerFilter(filter) {
  playerFilter = filter === 'all' || filter === playerFilter ? null : filter;
  renderPlayers();
}

function profileStatsForPlayer(pid) {
  const player = byId(pid);
  const base = RANK_BASE_SCORE[tagOf(pid).level] || RANK_BASE_SCORE.C;
  return PROFILE_AXES.map((axis, index) => {
    const seed = Math.sin(pid * 127.1 + index * 311.7) * 43758.5453;
    const variation = Math.round((seed - Math.floor(seed)) * 17) - 8;
    return { ...axis, value: Math.max(35, Math.min(99, base + variation)) };
  });
}

function radarChartHTML(stats, playerName) {
  const cx = 180;
  const cy = 147;
  const radius = 88;
  const point = (index, value, scale = radius) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / stats.length;
    const distance = scale * (value == null ? 1 : value / 100);
    return `${(cx + Math.cos(angle) * distance).toFixed(1)},${(cy + Math.sin(angle) * distance).toFixed(1)}`;
  };
  const rings = [20, 40, 60, 80, 100]
    .map((value) => `<polygon class="radar-ring ${value === 100 ? 'outer' : ''}" points="${stats.map((_, i) => point(i, null, radius * value / 100)).join(' ')}" />`)
    .join('');
  const axes = stats.map((_, i) => `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${point(i, null)}" />`).join('');
  const labels = stats.map((stat, i) => {
    const [x, y] = point(i, null, radius + 28).split(',');
    return `<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${stat.label}</text>`;
  }).join('');
  const values = stats.map((stat, i) => point(i, stat.value)).join(' ');
  const dots = stats.map((stat, i) => {
    const [x, y] = point(i, stat.value).split(',');
    return `<circle class="radar-point" cx="${x}" cy="${y}" r="3.2"><title>${stat.label}: ${fa(stat.value)}</title></circle>`;
  }).join('');

  return `<svg class="radar-chart" viewBox="0 0 360 294" role="img" aria-label="نمودار ویژگی‌های ${esc(playerName)}">
    ${rings}${axes}
    <polygon class="radar-shape" points="${values}" />
    ${dots}${labels}
  </svg>`;
}

function positionPlayerProfile(anchor) {
  if (!anchor || !els.playerProfile) return;
  const margin = 10;
  const gap = 14;
  const anchorRect = anchor.getBoundingClientRect();
  const profileRect = els.playerProfile.getBoundingClientRect();
  let left = anchorRect.right + gap;
  if (left + profileRect.width > window.innerWidth - margin) left = anchorRect.left - profileRect.width - gap;
  left = Math.max(margin, Math.min(left, window.innerWidth - profileRect.width - margin));
  let top = anchorRect.top + anchorRect.height / 2 - profileRect.height / 2;
  top = Math.max(margin, Math.min(top, window.innerHeight - profileRect.height - margin));
  els.playerProfile.style.left = `${left}px`;
  els.playerProfile.style.top = `${top}px`;
}

function showPlayerProfile(pid, anchor, pinned = false) {
  const player = byId(pid);
  if (!player || !els.playerProfile || !els.playerProfileContent) return;
  const stats = profileStatsForPlayer(pid);
  const overall = Math.round(stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length);
  const tag = tagOf(pid);
  const keeper = tag.keeper ? `<span class="profile-keeper">🧤 ${KEEPERS[tag.keeper].short}</span>` : '';

  els.playerProfileContent.innerHTML = `<div class="profile-art-wrap">
      <button type="button" class="profile-art-button" data-enlarge-player="${player.id}" aria-label="نمایش تمام‌صفحهٔ تصویر انیمه‌ای ${esc(player.name)}" title="برای بزرگ‌نمایی کلیک کنید">
        <img class="profile-art" src="${esc(player.anime)}" alt="تصویر انیمه‌ای ${esc(player.name)}" />
        <span class="profile-art-zoom" aria-hidden="true">⛶ نمایش بزرگ</span>
      </button>
    </div>
    <div class="profile-data">
      <header class="profile-head">
        <div><span class="profile-eyebrow">SAIPA FUTSAL · PLAYER SCOUT</span><h2>${esc(player.name)}</h2></div>
        <button type="button" class="profile-close" data-profile-close aria-label="بستن مشخصات">✕</button>
      </header>
      <div class="profile-badges"><span class="profile-rank rank-${tag.level.toLowerCase()}">رتبه ${tag.level}</span>${keeper}<span class="profile-overall">OVR <strong>${fa(overall)}</strong></span></div>
      <div class="profile-chart-wrap">${radarChartHTML(stats, player.name)}</div>
      <div class="profile-stat-list">${stats.map((stat) => `<span><small>${stat.label}</small><b>${fa(stat.value)}</b></span>`).join('')}</div>
      <p class="profile-note">امتیازها تخمینی و بر پایهٔ رتبهٔ فعلی بازیکن هستند.</p>
    </div>`;

  profilePinned = pinned;
  els.playerProfile.hidden = false;
  els.playerProfile.setAttribute('aria-hidden', 'false');
  els.playerProfile.classList.add('visible');
  els.playerProfile.classList.toggle('pinned', pinned);
  positionPlayerProfile(anchor);
}

function hidePlayerProfile() {
  if (!els.playerProfile) return;
  profilePinned = false;
  els.playerProfile.classList.remove('visible');
  els.playerProfile.classList.remove('pinned');
  els.playerProfile.hidden = true;
  els.playerProfile.setAttribute('aria-hidden', 'true');
}

function openAnimeLightbox(pid, trigger) {
  const player = byId(pid);
  if (!player || !els.animeLightbox) return;
  lightboxTrigger = trigger || null;
  els.animeLightboxImage.src = player.anime;
  els.animeLightboxImage.alt = `تصویر کامل انیمه‌ای ${player.name}`;
  els.animeLightboxCaption.textContent = `${player.name} · رتبه ${tagOf(pid).level}`;
  els.animeLightbox.hidden = false;
  els.animeLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('anime-lightbox-open');
  els.animeLightboxClose.focus({ preventScroll: true });
}

function closeAnimeLightbox() {
  if (!els.animeLightbox || els.animeLightbox.hidden) return;
  els.animeLightbox.hidden = true;
  els.animeLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('anime-lightbox-open');
  const trigger = lightboxTrigger;
  lightboxTrigger = null;
  if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
}

function tagChipsHTML(pid) {
  const tag = tagOf(pid);
  const keeper = tag.keeper
    ? `<span class="tag-pill keeper-${tag.keeper}">🧤 ${KEEPERS[tag.keeper].short}</span>`
    : '';
  const level = `<span class="tag-pill level-${tag.level.toLowerCase()}">${LEVELS[tag.level].label}</span>`;
  return keeper + level;
}

function renderPlayers() {
  if (els.playerProfile && !els.playerProfile.hidden) hidePlayerProfile();
  const present = new Set(state.present);

  els.peopleGrid.innerHTML = PLAYERS.filter(matchesPlayerFilter).map((p) => {
    const on = present.has(p.id);
    return `<div class="person-card ${on ? 'on' : 'off'}" data-player-card="${p.id}">
      <button type="button" class="person" data-toggle-player="${p.id}" aria-pressed="${on}">
        <span class="avatar md"><img src="${p.img}" alt="" loading="lazy"></span>
        <span class="person-name">${esc(p.name)}</span>
        <span class="check" aria-hidden="true">${on ? '✓' : ''}</span>
      </button>
      <div class="person-card-tools">
        <button type="button" class="person-tags" data-edit-tags="${p.id}"
          title="ویرایش تگ‌های ${esc(p.name)}" aria-label="ویرایش تگ‌های ${esc(p.name)}">
          ${tagChipsHTML(p.id)}
        </button>
        <button type="button" class="profile-trigger" data-view-profile="${p.id}" aria-label="نمایش مشخصات انیمه‌ای ${esc(p.name)}" title="مشخصات و نمودار بازیکن">آمار</button>
      </div>
    </div>`;
  }).join('');

  els.teamCountPicker.innerHTML = range(MIN_TEAMS, MAX_TEAMS)
    .map((n) => {
      const feasible = state.present.length >= minPresentFor(n);
      const title = feasible
        ? `${fa(n)} تیم × حداقل ${fa(MIN_PER_TEAM)} نفر`
        : `برای ${fa(n)} تیم حداقل ${fa(minPresentFor(n))} بازیکن لازم است`;
      return `<button type="button" class="chip ${n === state.teamCount ? 'active' : ''} ${feasible ? '' : 'invalid'}"
        data-team-count="${n}" aria-pressed="${n === state.teamCount}" ${feasible ? '' : 'disabled'}
        title="${title}">${fa(n)} تیم</button>`;
    })
    .join('');

  els.presentCounter.textContent = `${fa(state.present.length)} از ${fa(PLAYERS.length)} نفر`;
  renderTagsSummary();
  updatePlayersActions();
}

function updateCaptainsActions() {
  const chosen = state.captains.filter((id) => id != null).length;
  const enough = state.present.length >= minPresentFor(state.teamCount);
  els.captainsHint.textContent = !enough
    ? `برای ${fa(state.teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(minPresentFor(state.teamCount))} بازیکن لازم است.`
    : chosen === state.teamCount
      ? 'همهٔ کاپیتان‌ها انتخاب شدند — آمادهٔ چیدمان هستید.'
      : `${fa(chosen)} از ${fa(state.teamCount)} کاپیتان انتخاب شده است.`;
  if (els.autoCaptainsBtn) els.autoCaptainsBtn.disabled = !enough;
  els.toBoardBtn.disabled = !allCaptainsChosen() || !enough;
}

function tagSummaryText(pid) {
  const tag = tagOf(pid);
  const parts = [];
  if (tag.keeper) parts.push(KEEPERS[tag.keeper].label);
  parts.push(LEVELS[tag.level].label);
  return parts.join(' · ');
}

function renderCaptains() {
  const chosenCount = state.captains.filter((id) => id != null).length;
  const freeCount = Math.max(0, state.present.length - chosenCount);

  els.captainsGrid.innerHTML = state.captains
    .map((capId, i) => {
      const color = teamColor(i);
      const p = capId != null ? byId(capId) : null;
      return `<div class="cap-card" style="--accent:${color};--soft:${withAlpha(color, 0.13)};--glow:${withAlpha(color, 0.4)}">
        <div class="cap-card-head">
          <span class="cap-team"><span class="dot"></span>${teamLabel(i)}</span>
          <span class="cap-state ${p ? 'done' : ''}">${p ? 'انتخاب شد' : 'در انتظار'}</span>
        </div>
        <button type="button" class="cap-slot ${p ? 'filled' : ''}" data-pick-team="${i}"
          aria-label="${p ? `تغییر کاپیتان ${teamLabel(i)}` : `انتخاب کاپیتان ${teamLabel(i)}`}">
          ${
            p
              ? `<span class="avatar lg"><img src="${p.img}" alt=""></span>
                 <span class="cap-info"><strong>${esc(p.name)}</strong><small>${esc(tagSummaryText(p.id))}</small></span>
                 <span class="cap-edit">تغییر</span>`
              : `<span class="cap-plus" aria-hidden="true">+</span>
                 <span class="cap-info"><strong>انتخاب کاپیتان</strong><small>${fa(freeCount)} بازیکن آزاد</small></span>`
          }
        </button>
      </div>`;
    })
    .join('');

  updateCaptainsActions();
}

function miniTagsHTML(pid) {
  const tag = tagOf(pid);
  const keeper = tag.keeper
    ? `<span class="mini-keeper ${tag.keeper}" title="${KEEPERS[tag.keeper].label}" aria-label="${KEEPERS[tag.keeper].label}">🧤</span>`
    : '';
  const level = `<span class="level-dot ${tag.level.toLowerCase()}" title="${LEVELS[tag.level].label}" aria-label="${LEVELS[tag.level].label}"></span>`;
  return `<span class="mini-tags">${keeper}${level}</span>`;
}

function teamHTML(capId, i) {
  const color = teamColor(i);
  const captain = capId != null ? byId(capId) : null;
  const members = state.present
    .filter((id) => state.assignments[id] === i)
    .map((id) => byId(id))
    .filter(Boolean);
  const total = members.length + (captain ? 1 : 0);
  const allIds = [capId, ...members.map((m) => m.id)].filter((id) => id != null);
  const score = averageLevelScore(allIds);
  const teamKeeper = allIds.reduce((max, id) => Math.max(max, keeperRank(id)), 0);
  const keeperFlag =
    teamKeeper === 2
      ? `<span class="keeper-chip complete">🧤 دروازه‌بان کامل</span>`
      : teamKeeper === 1
        ? `<span class="keeper-chip potential">🧤 دروازه‌بان بالقوه</span>`
        : `<span class="keeper-chip missing">⚠️ بدون دروازه‌بان</span>`;
  const capKeeper = captain ? tagOf(captain.id).keeper : null;

  return `<article class="team" data-drop="team" data-team="${i}"
      style="--accent:${color};--soft:${withAlpha(color, 0.13)};--glow:${withAlpha(color, 0.38)}">
    <header class="team-head">
      <span class="team-name"><span class="dot"></span>${teamLabel(i)}</span>
      <span class="team-meta">
        <span class="team-count">${fa(total)} نفر</span>
        <button type="button" class="mini-btn" data-change-captain="${i}" title="تغییر کاپیتان">👑 تغییر</button>
      </span>
    </header>
    <div class="team-flags">
      ${keeperFlag}
      <span class="power-chip" title="میانگین امتیاز رتبهٔ بازیکنان، از ۱ تا ۵">⚡ میانگین قدرت ${formatLevelAverage(score)} / ۵</span>
    </div>
    ${
      captain
        ? `<div class="captain">
             <span class="avatar lg"><img src="${captain.img}" alt=""></span>
             <span class="captain-meta"><small>کاپیتان${capKeeper ? ` · ${KEEPERS[capKeeper].short}` : ''}</small><strong>${esc(captain.name)}</strong></span>
             ${miniTagsHTML(captain.id)}
           </div>`
        : `<button type="button" class="captain-empty" data-change-captain="${i}">+ انتخاب کاپیتان</button>`
    }
    <div class="members">
      ${
        members.length
          ? members
              .map(
                (m) => `<div class="member drag-source ${state.selected === m.id ? 'selected' : ''}"
                    draggable="true" data-pid="${m.id}" tabindex="0" role="button"
                    aria-pressed="${state.selected === m.id}" aria-label="${esc(m.name)}"
                    title="${esc(`${m.name} — ${tagSummaryText(m.id)}`)}">
                  <span class="avatar xs"><img src="${m.img}" alt=""></span>
                  <span class="member-name">${esc(m.name)}</span>
                  ${miniTagsHTML(m.id)}
                  <button type="button" class="remove" data-remove="${m.id}"
                    title="برگرداندن به بدون تیم" aria-label="خروج ${esc(m.name)} از تیم">✕</button>
                </div>`
              )
              .join('')
          : `<div class="drop-hint">بازیکن را اینجا رها کنید</div>`
      }
    </div>
  </article>`;
}

function teamScoreAt(i) {
  const ids = [state.captains[i], ...state.present.filter((id) => state.assignments[id] === i)];
  return averageLevelScore(ids);
}

function renderBoard() {
  const poolPlayers = state.present
    .filter((id) => !isCaptain(id) && !isAssigned(id))
    .map((id) => byId(id))
    .filter(Boolean);

  els.pool.innerHTML = poolPlayers.length
    ? poolPlayers
        .map(
          (p) => `<div class="player-tag drag-source ${state.selected === p.id ? 'selected' : ''}"
            draggable="true" data-pid="${p.id}" tabindex="0" role="button"
            aria-pressed="${state.selected === p.id}" aria-label="${esc(p.name)}"
            title="${esc(`${p.name} — ${tagSummaryText(p.id)}`)}">
            <span class="avatar sm"><img src="${p.img}" alt=""></span>
            <span class="tag-name">${esc(p.name)}</span>
            ${miniTagsHTML(p.id)}
          </div>`
        )
        .join('')
    : `<div class="empty-pool">همهٔ بازیکنان تیم‌بندی شده‌اند ⚽</div>`;

  els.poolCount.textContent = fa(poolPlayers.length);

  els.teamsGrid.innerHTML = state.captains.map((capId, i) => teamHTML(capId, i)).join('');

  const scores = state.captains.map((_, i) => teamScoreAt(i));
  els.boardSummary.innerHTML = `
    <span>${fa(state.present.length)} بازیکن</span>
    <span>${fa(state.teamCount)} تیم</span>
    <span>${fa(poolPlayers.length)} بدون تیم</span>
    <span title="میانگین امتیاز رتبهٔ بازیکنان هر تیم، از ۱ تا ۵">⚡ میانگین قدرت: ${scores
      .map((score, i) => `<b style="color:${teamColor(i)}">${formatLevelAverage(score)}</b>`)
      .join(' / ')}</span>`;

  const selectedPlayer = state.selected != null ? byId(state.selected) : null;
  els.boardHint.textContent = selectedPlayer
    ? `«${selectedPlayer.name}» انتخاب شده — روی تیم مقصد بزنید.`
    : 'کارت را بکشید و رها کنید، یا بازیکن را انتخاب و روی تیم بزنید.';
}

/* ---------------------------- modal -------------------------- */
function openModal() {
  if (!els.modal) return;
  els.modal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => els.modal.classList.add('open'));
}

function openPicker(teamIndex) {
  if (teamIndex == null) return;

  const taken = new Set(state.captains);
  const options = state.present.filter((id) => !taken.has(id));
  if (!options.length) {
    toast('بازیکن آزادی برای کاپیتانی باقی نمانده است');
    return;
  }

  pickerTeam = teamIndex;
  modalMode = 'captain';
  tagPid = null;
  els.modalTitle.textContent = `انتخاب کاپیتان ${teamLabel(teamIndex)}`;
  els.modalSub.textContent = 'کاپیتان بالای ستون تیم قرار می‌گیرد.';
  els.modalGrid.classList.remove('tag-mode');

  els.modalGrid.innerHTML = options
    .map((id) => {
      const p = byId(id);
      const team = state.assignments[id];
      const tag =
        team != null
          ? `<span class="assigned-tag">در ${teamLabel(team)}</span>`
          : '';
      return `<button type="button" class="pick-item" data-pick="${id}">
        <span class="avatar md"><img src="${p.img}" alt=""></span>
        <span class="pick-info">
          <span class="pick-name">${esc(p.name)}</span>
          <span class="pick-tags-text">${esc(tagSummaryText(id))}</span>
        </span>
        ${tag}
      </button>`;
    })
    .join('');

  openModal();
}

function tagOptionHTML(kind, value, label, hint, active) {
  return `<button type="button" class="tag-option ${active ? 'active' : ''}"
    data-tag-kind="${kind}" data-tag-value="${value}" aria-pressed="${active}">
    <strong>${label}</strong><small>${hint}</small>
  </button>`;
}

function renderTagEditor() {
  if (tagPid == null) return;
  const pid = tagPid;
  const p = byId(pid);
  if (!p) return;

  const tag = tagOf(pid);
  const isPresent = state.present.includes(pid);

  els.modalGrid.innerHTML = `<div class="tag-editor">
    <section class="tag-group">
      <div class="tag-group-head">
        <h4>🧤 نقش دروازه‌بان</h4>
        <p>در یارکشی هوشمند، تا حد امکان برای هر تیم یک دروازه‌بان انتخاب می‌شود.</p>
      </div>
      <div class="tag-options" role="group" aria-label="نقش دروازه‌بان">
        ${tagOptionHTML('keeper', 'none', 'بدون نقش', 'بازیکن میدانی', tag.keeper == null)}
        ${tagOptionHTML('keeper', 'potential', 'بالقوه', 'دروازه‌بان ذخیره', tag.keeper === 'potential')}
        ${tagOptionHTML('keeper', 'complete', 'کامل', 'دروازه‌بان اصلی', tag.keeper === 'complete')}
      </div>
    </section>
    <section class="tag-group">
      <div class="tag-group-head">
        <h4>رتبهٔ بازیکن</h4>
        <p>رتبه‌ها از A (بالاترین) تا E (پایین‌ترین) برای متوازن‌کردن تیم‌ها استفاده می‌شوند.</p>
      </div>
      <div class="tag-options rank-options" role="group" aria-label="رتبهٔ بازیکن از A تا E">
        ${tagOptionHTML('level', 'A', 'رتبه A', '۵ امتیاز', tag.level === 'A')}
        ${tagOptionHTML('level', 'B', 'رتبه B', '۴ امتیاز', tag.level === 'B')}
        ${tagOptionHTML('level', 'C', 'رتبه C', '۳ امتیاز', tag.level === 'C')}
        ${tagOptionHTML('level', 'D', 'رتبه D', '۲ امتیاز', tag.level === 'D')}
        ${tagOptionHTML('level', 'E', 'رتبه E', '۱ امتیاز', tag.level === 'E')}
      </div>
    </section>
    <p class="tag-note">${
      isPresent ? 'این بازیکن در بازی حاضر است.' : 'این بازیکن فعلاً از بازی کنار گذاشته شده است.'
    } تغییرات روی یارکشی هوشمند بعدی اثر می‌گذارد.</p>
  </div>`;
}

function openTagEditor(pid) {
  const p = byId(pid);
  if (!p) return;

  pickerTeam = null;
  modalMode = 'tags';
  tagPid = pid;
  els.modalTitle.textContent = `تگ‌های ${p.name}`;
  els.modalSub.textContent = 'نقش دروازه‌بان و رتبهٔ A تا E را مشخص کنید.';
  els.modalGrid.classList.add('tag-mode');
  renderTagEditor();
  openModal();
}

function closeModal() {
  if (!els.modal || els.modal.hidden) return;
  els.modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  pickerTeam = null;
  tagPid = null;
  modalMode = null;
  window.setTimeout(() => {
    els.modal.hidden = true;
  }, 190);
}

/* ---------------------------- toast -------------------------- */
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2300);
}

/* --------------------------- navigation ---------------------- */
function goTo(step) {
  hidePlayerProfile();
  if (step === 'captains' && state.present.length < minPresentFor(state.teamCount)) {
    toast(
      `برای ${fa(state.teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(minPresentFor(state.teamCount))} بازیکن لازم است`
    );
    step = 'players';
  }
  if (step === 'board' && !allCaptainsChosen()) {
    toast('اول برای همهٔ تیم‌ها کاپیتان انتخاب کنید');
    step = 'captains';
  }

  state.step = step;
  state.selected = null;
  closeModal();
  save();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --------------------------- clipboard ----------------------- */
function buildLineupText() {
  const lines = ['⚽ ترکیب تیم‌ها', ''];

  state.captains.forEach((capId, i) => {
    const members = state.present
      .filter((id) => state.assignments[id] === i)
      .map((id) => byId(id))
      .filter(Boolean);

    lines.push(
      `${teamLabel(i)} — کاپیتان: ${capId != null ? byId(capId).name : '—'}${
        capId != null && tagOf(capId).keeper ? ' 🧤' : ''
      }`
    );
    if (members.length) {
      members.forEach((m) => lines.push(`• ${m.name}${tagOf(m.id).keeper ? ' 🧤' : ''}`));
    } else {
      lines.push('• (خالی)');
    }
    lines.push('');
  });

  const bench = state.present.filter((id) => !isCaptain(id) && !isAssigned(id)).map((id) => byId(id));
  if (bench.length) {
    lines.push(`بدون تیم: ${bench.map((p) => `${p.name}${tagOf(p.id).keeper ? ' 🧤' : ''}`).join('، ')}`);
  }

  return lines.join('\n').trim();
}

async function copyLineup() {
  const text = buildLineupText();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    toast('ترکیب تیم‌ها کپی شد ✓');
  } catch (_) {
    console.log(text);
    toast('کپی نشد — متن در کنسول چاپ شد');
  }
}

/* ---------------------------- events ------------------------- */
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  // after a native drag, ignore the synthetic click
  if (Date.now() - lastDragEnd < 250) return;

  if (closest(target, '[data-auth-open]')) { openAuthModal(); return; }
  if (closest(target, '[data-auth-close]')) { closeAuthModal(); return; }
  if (closest(target, '[data-auth-logout]')) { logoutUser(); return; }

  const ratingTab = closest(target, '[data-rating-tab]');
  if (ratingTab) {
    const resultsMode = ratingTab.dataset.ratingTab === 'results';
    $('#ratingSubmitView').hidden = resultsMode;
    $('#ratingResultsView').hidden = !resultsMode;
    document.querySelectorAll('[data-rating-tab]').forEach((button) => button.classList.toggle('active', button === ratingTab));
    if (resultsMode) renderRatingResults();
    return;
  }
  if (closest(target, '[data-rating-load]')) { loadRatingTargets(); return; }
  if (closest(target, '[data-rating-submit]')) { submitRating(); return; }
  if (closest(target, '[data-news-next]')) { advanceTickerNews(); return; }
  const deleteNews = closest(target, '[data-delete-news]');
  if (deleteNews) { deleteNewsItem(deleteNews.dataset.deleteNews); return; }
  const rsvpSubmit = closest(target, '[data-rsvp-submit]');
  if (rsvpSubmit) { submitSessionRsvp(Number(rsvpSubmit.dataset.rsvpSubmit)); return; }
  const applyRating = closest(target, '[data-apply-rating]');
  if (applyRating) {
    const pid = Number(applyRating.dataset.applyRating);
    const rank = applyRating.dataset.rank;
    if (state.tags[pid] && LEVEL_VALUES.includes(rank)) applySuggestedRank(pid, rank);
    return;
  }

  if (closest(target, '[data-media-close]')) {
    closeMediaViewer();
    return;
  }
  const mediaButton = closest(target, '[data-open-media]');
  if (mediaButton) {
    openMediaViewer(mediaButton);
    return;
  }

  const sectionButton = closest(target, '[data-app-section]');
  if (sectionButton) {
    event.preventDefault();
    showAppSection(sectionButton.dataset.appSection);
    return;
  }

  const lightboxCloseEl = closest(target, '[data-lightbox-close]');
  if (lightboxCloseEl) {
    closeAnimeLightbox();
    return;
  }

  const enlargePlayerEl = closest(target, '[data-enlarge-player]');
  if (enlargePlayerEl) {
    openAnimeLightbox(Number(enlargePlayerEl.dataset.enlargePlayer), enlargePlayerEl);
    return;
  }

  const profileCloseEl = closest(target, '[data-profile-close]');
  if (profileCloseEl) {
    hidePlayerProfile();
    return;
  }

  const profileTriggerEl = closest(target, '[data-view-profile]');
  const insideLightbox = closest(target, '#animeLightbox');
  if (profilePinned && !closest(target, '#playerProfile') && !insideLightbox && !profileTriggerEl) hidePlayerProfile();
  if (profileTriggerEl) {
    showPlayerProfile(Number(profileTriggerEl.dataset.viewProfile), profileTriggerEl.closest('[data-player-card]'), true);
    return;
  }

  const navBtn = closest(target, '[data-goto]');
  if (navBtn) {
    event.preventDefault();
    goTo(navBtn.dataset.goto);
    return;
  }

  if (closest(target, '[data-close]')) {
    closeModal();
    return;
  }

  const editTagsEl = closest(target, '[data-edit-tags]');
  if (editTagsEl) {
    openTagEditor(Number(editTagsEl.dataset.editTags));
    return;
  }

  const playerFilterEl = closest(target, '[data-player-filter]');
  if (playerFilterEl) {
    setPlayerFilter(playerFilterEl.dataset.playerFilter);
    return;
  }

  const tagOptEl = closest(target, '[data-tag-kind]');
  if (tagOptEl) {
    if (modalMode !== 'tags' || tagPid == null) return;
    updateTag(tagPid, tagOptEl.dataset.tagKind, tagOptEl.dataset.tagValue);
    renderTagEditor();
    render();
    return;
  }

  const pickEl = closest(target, '[data-pick]');
  if (pickEl) {
    chooseCaptain(pickerTeam, Number(pickEl.dataset.pick));
    return;
  }

  const removeEl = closest(target, '[data-remove]');
  if (removeEl) {
    event.stopPropagation();
    moveToTeam(Number(removeEl.dataset.remove), null);
    return;
  }

  const changeCapEl = closest(target, '[data-change-captain]');
  if (changeCapEl) {
    event.stopPropagation();
    goTo('captains');
    return;
  }

  const pickTeamEl = closest(target, '[data-pick-team]');
  if (pickTeamEl) {
    openPicker(Number(pickTeamEl.dataset.pickTeam));
    return;
  }

  const toggleEl = closest(target, '[data-toggle-player]');
  if (toggleEl) {
    togglePresent(Number(toggleEl.dataset.togglePlayer));
    return;
  }

  const countEl = closest(target, '[data-team-count]');
  if (countEl) {
    setTeamCount(Number(countEl.dataset.teamCount));
    return;
  }

  const actionEl = closest(target, '[data-action]');
  if (actionEl) {
    if (actionEl.dataset.action === 'select-all') selectAll();
    else if (actionEl.dataset.action === 'select-none') selectNone();
    return;
  }

  /* --- board: tap to select / tap a team to place --- */
  if (state.step !== 'board') return;

  const card = closest(target, '.drag-source');
  if (card) {
    const pid = Number(card.dataset.pid);
    state.selected = state.selected === pid ? null : pid;
    renderBoard();
    return;
  }

  const zone = closest(target, '[data-drop]');
  if (zone && state.selected != null) {
    const pid = state.selected;
    const teamIndex = zone.dataset.drop === 'pool' ? null : Number(zone.dataset.team);
    moveToTeam(pid, teamIndex);
  }
});

/* --------------------- drag & drop (desktop) ----------------- */
function clearDragState() {
  dragPid = null;
  document.body.classList.remove('is-dragging');
  document.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));
  document.querySelectorAll('.drop-hover').forEach((el) => el.classList.remove('drop-hover'));
}

document.addEventListener('dragstart', (event) => {
  const source = closest(event.target, '.drag-source');
  if (!source || state.step !== 'board') {
    event.preventDefault();
    return;
  }

  dragPid = Number(source.dataset.pid);
  source.classList.add('dragging');
  document.body.classList.add('is-dragging');

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    try {
      event.dataTransfer.setData('text/plain', String(dragPid));
    } catch (_) {
      /* ignore */
    }
  }
});

document.addEventListener('dragover', (event) => {
  if (dragPid == null) return;

  const zone = closest(event.target, '[data-drop]');
  if (!zone) return;

  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

  if (!zone.classList.contains('drop-hover')) {
    document.querySelectorAll('.drop-hover').forEach((el) => el.classList.remove('drop-hover'));
    zone.classList.add('drop-hover');
  }
});

document.addEventListener('dragleave', (event) => {
  const zone = closest(event.target, '[data-drop]');
  if (!zone) return;
  const next = event.relatedTarget;
  if (!next || !zone.contains(next)) zone.classList.remove('drop-hover');
});

document.addEventListener('drop', (event) => {
  if (dragPid == null) return;

  const zone = closest(event.target, '[data-drop]');
  if (!zone) {
    clearDragState();
    return;
  }

  event.preventDefault();
  const pid = dragPid;
  const teamIndex = zone.dataset.drop === 'pool' ? null : Number(zone.dataset.team);
  clearDragState();
  lastDragEnd = Date.now();
  moveToTeam(pid, teamIndex);
});

document.addEventListener('dragend', () => {
  lastDragEnd = Date.now();
  clearDragState();
});

/* ---------------------------- buttons ------------------------ */
els.toCaptainsBtn.addEventListener('click', () => goTo('captains'));
els.toBoardBtn.addEventListener('click', () => goTo('board'));
els.resetBtn.addEventListener('click', resetAll);
els.autoDraftBtn.addEventListener('click', autoDraft);
els.autoCaptainsBtn.addEventListener('click', () => {
  if (!autoPickCaptains({ replace: true })) {
    toast(
      `برای ${fa(state.teamCount)} تیم با حداقل ${fa(MIN_PER_TEAM)} نفر در هر تیم، ${fa(minPresentFor(state.teamCount))} بازیکن لازم است`
    );
    return;
  }
  save();
  render();
  toast('کاپیتان‌ها بر اساس رتبه انتخاب شدند 👑');
});
els.smartBtn.addEventListener('click', runSmartArrange);
els.shuffleBtn.addEventListener('click', shuffleTeams);
els.clearBtn.addEventListener('click', clearAssignments);
els.copyBtn.addEventListener('click', copyLineup);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!els.authModal.hidden) {
      closeAuthModal();
    } else if (!els.mediaLightbox.hidden) {
      closeMediaViewer();
    } else if (!els.animeLightbox.hidden) {
      closeAnimeLightbox();
    } else if (!welcomeScreen.hidden) {
      closeWelcome();
    } else if (els.playerProfile && !els.playerProfile.hidden) {
      hidePlayerProfile();
    } else if (!els.modal.hidden) {
      closeModal();
    } else if (state.selected != null) {
      state.selected = null;
      if (state.step === 'board') renderBoard();
    }
  }
});

els.ratingSession.addEventListener('change', () => {
  els.ratingTargets.hidden = true;
  $('[data-rating-submit]').hidden = true;
  els.ratingSubmitHint.textContent = '';
  renderRatings();
});
els.newsCompose.addEventListener('submit', addNewsItem);
els.loginForm.addEventListener('submit', handleLogin);

/* --------------------------- welcome screen -------------------------- */
const welcomeScreen = document.getElementById('welcomeScreen');
const welcomeStartBtn = document.getElementById('welcomeStartBtn');

function closeWelcome() {
  if (!welcomeScreen || welcomeScreen.hidden) return;
  welcomeScreen.classList.add('is-leaving');
  document.body.classList.remove('welcome-open');
  showAppSection('home');
  window.setTimeout(() => {
    welcomeScreen.hidden = true;
    welcomeScreen.classList.remove('is-leaving');
  }, 380);
}

welcomeStartBtn.addEventListener('click', closeWelcome);
document.body.classList.add('welcome-open');
welcomeStartBtn.focus({ preventScroll: true });

/* ----------------------------- init -------------------------- */
load();
render();
showTickerNews();
window.setInterval(advanceTickerNews, 6500);
updateAuthUI();
refreshRemoteSession();
