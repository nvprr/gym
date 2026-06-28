// ===================== SEASONS.JS =====================
// Sezony + GymFlow Wrapped
// Korzysta wyłącznie z state.workouts i istniejących funkcji

// ── Helpers ──

var SEASON_DEFS = [
  { key: 'winter', label: 'Zima',   icon: '❄️',  months: [12, 1, 2]  },
  { key: 'spring', label: 'Wiosna', icon: '🌸',  months: [3, 4, 5]   },
  { key: 'summer', label: 'Lato',   icon: '☀️',  months: [6, 7, 8]   },
  { key: 'autumn', label: 'Jesień', icon: '🍂',  months: [9, 10, 11] },
];

function getSeasonKey(month) {
  for (var i = 0; i < SEASON_DEFS.length; i++) {
    if (SEASON_DEFS[i].months.indexOf(month) !== -1) return SEASON_DEFS[i].key;
  }
  return 'winter';
}

function getSeasonDef(key) {
  return SEASON_DEFS.find(function(s) { return s.key === key; }) || SEASON_DEFS[0];
}

// Get season year: December belongs to next year's winter
function getSeasonYear(date) {
  var d = new Date(date);
  var m = d.getMonth() + 1;
  return (m === 12) ? d.getFullYear() + 1 : d.getFullYear();
}

function getAvailableYears() {
  if (!state.workouts.length) return [new Date().getFullYear()];
  var years = {};
  state.workouts.forEach(function(w) {
    years[getSeasonYear(w.date)] = true;
  });
  return Object.keys(years).map(Number).sort(function(a, b) { return b - a; });
}

// ── Compute season stats ──
function computeSeasonStats(year, seasonKey) {
  var def = getSeasonDef(seasonKey);
  var workouts = state.workouts.filter(function(w) {
    var d = new Date(w.date);
    var m = d.getMonth() + 1;
    var sy = getSeasonYear(w.date);
    return sy === year && def.months.indexOf(m) !== -1;
  });

  if (!workouts.length) return null;

  var totalTonnage = 0, totalSets = 0, totalReps = 0, totalDuration = 0;
  var muscleCounts = {}, exCounts = {};
  var prs = 0;
  var maxVol = 0, minDur = Infinity, maxDur = 0;

  workouts.forEach(function(w) {
    var wt = w.tonnage || 0;
    totalTonnage += wt;
    if (wt > maxVol) maxVol = wt;
    var dur = w.duration || 0;
    totalDuration += dur;
    if (dur > 0 && dur < minDur) minDur = dur;
    if (dur > maxDur) maxDur = dur;

    (w.exercises || []).forEach(function(ex) {
      totalSets += (ex.sets || []).filter(function(s) { return s.done; }).length;
      totalReps += (ex.sets || []).filter(function(s) { return s.done; }).reduce(function(a, s) {
        return a + (parseInt(s.reps) || 0);
      }, 0);
      var def2 = getAllExercises().find(function(e) { return e.id === ex.id; });
      var muscle = def2 ? def2.muscle : (ex.name || 'Inne');
      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
      exCounts[ex.name] = (exCounts[ex.name] || 0) + 1;
    });

    if (w.newPRs) prs += w.newPRs;
  });

  // Unlocked achievements in this season
  var unlocked = loadUnlockedAchievements();
  var achInSeason = 0;
  Object.values(unlocked).forEach(function(dateStr) {
    var d = new Date(dateStr);
    var m = d.getMonth() + 1;
    var sy = getSeasonYear(dateStr);
    var sdef = getSeasonDef(getSeasonKey(m));
    if (sy === year && sdef.key === seasonKey) achInSeason++;
  });

  // Streak
  var dates = workouts.map(function(w) { return new Date(w.date).toDateString(); })
    .filter(function(v, i, a) { return a.indexOf(v) === i; })
    .sort();
  var streak = 0, maxStreak = 0, cur = 1;
  for (var i = 1; i < dates.length; i++) {
    var diff = (new Date(dates[i]) - new Date(dates[i-1])) / 86400000;
    if (diff <= 2) { cur++; }
    else { if (cur > maxStreak) maxStreak = cur; cur = 1; }
  }
  if (cur > maxStreak) maxStreak = cur;
  streak = maxStreak;

  // Top muscle and exercise
  var topMuscle = Object.keys(muscleCounts).sort(function(a,b){return muscleCounts[b]-muscleCounts[a];})[0] || '—';
  var topEx = Object.keys(exCounts).sort(function(a,b){return exCounts[b]-exCounts[a];})[0] || '—';

  // Consistency: active days / total days in season
  var totalDays = def.months.reduce(function(a, m) {
    var daysInMonth = new Date(year, m % 12, 0).getDate();
    return a + daysInMonth;
  }, 0);
  var activeDays = new Set(workouts.map(function(w) { return new Date(w.date).toDateString(); })).size;
  var consistency = Math.round(activeDays / totalDays * 100);

  return {
    count: workouts.length,
    tonnage: totalTonnage,
    sets: totalSets,
    reps: totalReps,
    duration: totalDuration,
    avgDuration: workouts.length ? Math.round(totalDuration / workouts.length) : 0,
    maxDuration: maxDur,
    minDuration: minDur === Infinity ? 0 : minDur,
    avgVolume: workouts.length ? Math.round(totalTonnage / workouts.length) : 0,
    maxVolume: maxVol,
    prs: prs,
    achievements: achInSeason,
    streak: streak,
    consistency: consistency,
    topMuscle: topMuscle,
    topExercise: topEx,
  };
}

// ── Seasons UI ──
var seasonsOpen = false;
var seasonsYear = new Date().getFullYear();
var seasonsDetailOpen = null;

function toggleSeasons() {
  seasonsOpen = !seasonsOpen;
  var body = document.getElementById('seasons-body');
  var chev = document.getElementById('seasons-chevron');
  if (!body || !chev) return;
  body.style.display = seasonsOpen ? 'block' : 'none';
  chev.style.transform = seasonsOpen ? 'rotate(90deg)' : '';
  if (seasonsOpen) renderSeasons();
}

function renderSeasons() {
  var years = getAvailableYears();
  if (!years.length) return;
  if (years.indexOf(seasonsYear) === -1) seasonsYear = years[0];

  // Year tabs
  var tabsEl = document.getElementById('seasons-year-tabs');
  tabsEl.innerHTML = years.map(function(y) {
    return '<button class="prog-tab' + (y === seasonsYear ? ' active' : '') + '" onclick="seasonsYear=' + y + ';renderSeasons()">' + y + '</button>';
  }).join('');

  // Season grid
  var gridEl = document.getElementById('seasons-grid');
  var detailEl = document.getElementById('seasons-detail');
  detailEl.style.display = 'none';
  seasonsDetailOpen = null;

  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">';
  var order = ['spring', 'summer', 'autumn', 'winter'];
  order.forEach(function(key) {
    var def = getSeasonDef(key);
    var stats = computeSeasonStats(seasonsYear, key);
    var empty = !stats;
    html += '<div onclick="openSeasonDetail(' + seasonsYear + ',\'' + key + '\')" style="background:var(--surface2);border-radius:16px;padding:16px;cursor:pointer;transition:transform .2s ease;" class="card">';
    html += '<div style="font-size:28px;margin-bottom:6px;">' + def.icon + '</div>';
    html += '<div style="font-weight:700;font-size:15px;">' + def.label + '</div>';
    if (empty) {
      html += '<div style="font-size:12px;color:var(--text4);margin-top:4px;">Brak treningów</div>';
    } else {
      html += '<div style="font-size:22px;font-weight:800;color:var(--accent);margin-top:4px;">' + stats.count + '</div>';
      html += '<div style="font-size:11px;color:var(--text3);">treningów · ' + stats.consistency + '% cons.</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  gridEl.innerHTML = html;
}

function openSeasonDetail(year, seasonKey) {
  var def = getSeasonDef(seasonKey);
  var stats = computeSeasonStats(year, seasonKey);
  var detailEl = document.getElementById('seasons-detail');
  var gridEl = document.getElementById('seasons-grid');

  if (!stats) {
    showNotif('ℹ️', 'Brak danych', 'Brak treningów w tym sezonie');
    return;
  }

  // Compare with previous season
  var prevKey, prevYear;
  var order = ['spring', 'summer', 'autumn', 'winter'];
  var idx = order.indexOf(seasonKey);
  if (idx === 0) { prevKey = 'winter'; prevYear = year - 1; }
  else { prevKey = order[idx - 1]; prevYear = year; }
  var prevStats = computeSeasonStats(prevYear, prevKey);

  function diff(a, b, reverse) {
    if (!b || !b.count) return '';
    var pct = Math.round((a - b) / (b || 1) * 100);
    if (pct === 0) return '<span style="color:var(--text3)">→ 0%</span>';
    var positive = reverse ? pct < 0 : pct > 0;
    var col = positive ? 'var(--green)' : 'var(--accent)';
    var sign = pct > 0 ? '+' : '';
    return '<span style="color:' + col + ';font-size:12px;margin-left:4px;">' + sign + pct + '%</span>';
  }

  var html = '<button onclick="closeSeasonDetail()" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 0 12px 0;">← Powrót</button>';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  html += '<div style="font-size:36px;">' + def.icon + '</div>';
  html += '<div><div style="font-size:20px;font-weight:800;">' + def.label + ' ' + year + '</div>';
  if (prevStats) {
    html += '<div style="font-size:12px;color:var(--text3);">vs ' + getSeasonDef(prevKey).label + ' ' + prevYear + '</div>';
  }
  html += '</div></div>';

  // Comparison banner
  if (prevStats) {
    var cmpItems = [
      { label: 'treningów', a: stats.count, b: prevStats.count },
      { label: 'objętości', a: stats.tonnage, b: prevStats.tonnage },
      { label: 'PR', a: stats.prs, b: prevStats.prs, abs: true },
      { label: 'osiągnięć', a: stats.achievements, b: prevStats.achievements, abs: true },
    ];
    html += '<div style="background:linear-gradient(135deg,rgba(255,55,95,.12),rgba(10,132,255,.08));border-radius:14px;padding:14px;margin-bottom:14px;">';
    html += '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Zmiana vs poprzedni sezon</div>';
    cmpItems.forEach(function(c) {
      if (!c.abs) {
        html += '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;">';
        html += '<span style="color:var(--text3);">' + c.label + '</span>';
        html += '<span style="font-weight:700;">' + c.a + diff(c.a, c.b) + '</span>';
        html += '</div>';
      } else {
        var d2 = c.a - (c.b || 0);
        var sign = d2 > 0 ? '+' : '';
        var col2 = d2 > 0 ? 'var(--green)' : d2 < 0 ? 'var(--accent)' : 'var(--text3)';
        html += '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;">';
        html += '<span style="color:var(--text3);">' + c.label + '</span>';
        html += '<span style="font-weight:700;">' + c.a + (d2 !== 0 ? ' <span style="color:' + col2 + ';font-size:12px;">(' + sign + d2 + ')</span>' : '') + '</span>';
        html += '</div>';
      }
    });
    html += '</div>';
  }

  // Stats grid
  var statItems = [
    { icon: '🏋️', label: 'Treningi', val: stats.count + '' },
    { icon: '📦', label: 'Łączny tonaż', val: (stats.tonnage / 1000).toFixed(1) + 't' },
    { icon: '💪', label: 'Serie', val: stats.sets + '' },
    { icon: '🔁', label: 'Powtórzenia', val: stats.reps + '' },
    { icon: '⏱️', label: 'Avg czas', val: formatTime(stats.avgDuration) },
    { icon: '🕐', label: 'Najdłuższy', val: formatTime(stats.maxDuration) },
    { icon: '⚡', label: 'Najkrótszy', val: stats.minDuration ? formatTime(stats.minDuration) : '—' },
    { icon: '📈', label: 'Avg objętość', val: (stats.avgVolume / 1000).toFixed(1) + 't' },
    { icon: '🏆', label: 'Pobite PR', val: stats.prs || '—' },
    { icon: '🏅', label: 'Osiągnięcia', val: stats.achievements || '0' },
    { icon: '🔥', label: 'Best streak', val: stats.streak + ' dni' },
    { icon: '💯', label: 'Consistency', val: stats.consistency + '%' },
    { icon: '🦵', label: 'Top partia', val: stats.topMuscle },
    { icon: '⭐', label: 'Ulubione ćw.', val: stats.topExercise },
    { icon: '🌋', label: 'Max vol/trening', val: (stats.maxVolume / 1000).toFixed(1) + 't' },
  ];

  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  statItems.forEach(function(s) {
    html += '<div style="background:var(--surface2);border-radius:12px;padding:12px;">';
    html += '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">' + s.icon + ' ' + s.label + '</div>';
    html += '<div style="font-size:15px;font-weight:700;">' + s.val + '</div>';
    html += '</div>';
  });
  html += '</div>';

  detailEl.innerHTML = html;
  detailEl.style.display = 'block';
  gridEl.style.display = 'none';
  document.getElementById('seasons-year-tabs').style.display = 'none';
}

function closeSeasonDetail() {
  document.getElementById('seasons-detail').style.display = 'none';
  document.getElementById('seasons-grid').style.display = '';
  document.getElementById('seasons-year-tabs').style.display = 'flex';
}

// ── GymFlow Wrapped ──
var wrappedOpen = false;
var wrappedYear = new Date().getFullYear();
var wrappedSlide = 0;
var wrappedSlides = [];

function toggleWrapped() {
  wrappedOpen = !wrappedOpen;
  var body = document.getElementById('wrapped-body');
  var chev = document.getElementById('wrapped-chevron');
  if (!body || !chev) return;
  body.style.display = wrappedOpen ? 'block' : 'none';
  chev.style.transform = wrappedOpen ? 'rotate(90deg)' : '';
  if (wrappedOpen) renderWrappedYears();
}

function renderWrappedYears() {
  var years = getAvailableYears();
  var tabsEl = document.getElementById('wrapped-year-tabs');
  tabsEl.innerHTML = years.map(function(y) {
    return '<button class="prog-tab' + (y === wrappedYear ? ' active' : '') + '" onclick="wrappedYear=' + y + ';renderWrappedYears()">' + y + '</button>';
  }).join('');
  renderWrappedMenu();
}

function renderWrappedMenu() {
  var container = document.getElementById('wrapped-container');
  var workoutsThisYear = state.workouts.filter(function(w) {
    return new Date(w.date).getFullYear() === wrappedYear;
  });

  if (!workoutsThisYear.length) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:14px;">Brak treningów w ' + wrappedYear + ' roku.</div>';
    return;
  }

  container.innerHTML = '<div style="text-align:center;padding:20px 0;">'
    + '<div style="font-size:48px;margin-bottom:8px;">🎉</div>'
    + '<div style="font-size:22px;font-weight:800;margin-bottom:4px;">Twój ' + wrappedYear + ' w GymFlow</div>'
    + '<div style="font-size:14px;color:var(--text3);margin-bottom:20px;">' + workoutsThisYear.length + ' treningów za tobą</div>'
    + '<button class="btn btn-primary" style="width:100%;" onclick="startWrapped(' + wrappedYear + ')">▶ Odtwórz Wrapped</button>'
    + '</div>';
}

function buildWrappedSlides(year) {
  var workouts = state.workouts.filter(function(w) {
    return new Date(w.date).getFullYear() === year;
  });
  if (!workouts.length) return [];

  var totalTonnage = 0, totalSets = 0, totalReps = 0, totalDuration = 0;
  var muscleCounts = {}, exCounts = {}, monthCounts = {};
  var prs = 0;

  workouts.forEach(function(w) {
    totalTonnage += w.tonnage || 0;
    totalDuration += w.duration || 0;
    var month = new Date(w.date).getMonth();
    monthCounts[month] = (monthCounts[month] || 0) + 1;
    if (w.newPRs) prs += w.newPRs;
    (w.exercises || []).forEach(function(ex) {
      totalSets += (ex.sets || []).filter(function(s) { return s.done; }).length;
      totalReps += (ex.sets || []).filter(function(s) { return s.done; }).reduce(function(a,s){return a+(parseInt(s.reps)||0);},0);
      var def = getAllExercises().find(function(e){return e.id===ex.id;});
      var muscle = def ? def.muscle : 'Inne';
      muscleCounts[muscle] = (muscleCounts[muscle]||0)+1;
      exCounts[ex.name] = (exCounts[ex.name]||0)+1;
    });
  });

  var topMuscle = Object.keys(muscleCounts).sort(function(a,b){return muscleCounts[b]-muscleCounts[a];})[0]||'—';
  var topEx = Object.keys(exCounts).sort(function(a,b){return exCounts[b]-exCounts[a];})[0]||'—';
  var topMonthIdx = parseInt(Object.keys(monthCounts).sort(function(a,b){return monthCounts[b]-monthCounts[a];})[0]||'0');
  var months = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
  var topMonth = months[topMonthIdx];
  var avgDuration = Math.round(totalDuration / workouts.length);

  // Streak
  var dates = workouts.map(function(w){return new Date(w.date).toDateString();})
    .filter(function(v,i,a){return a.indexOf(v)===i;}).sort();
  var maxStreak = 0, cur = 1;
  for (var i = 1; i < dates.length; i++) {
    if ((new Date(dates[i])-new Date(dates[i-1]))/86400000<=2){cur++;}
    else{if(cur>maxStreak)maxStreak=cur;cur=1;}
  }
  if(cur>maxStreak)maxStreak=cur;

  // Consistency
  var activeDays = new Set(workouts.map(function(w){return new Date(w.date).toDateString();})).size;
  var totalYearDays = (year%4===0)?366:365;
  var consistency = Math.round(activeDays/totalYearDays*100);

  // Achievements in year
  var unlocked = loadUnlockedAchievements();
  var achCount = Object.values(unlocked).filter(function(d){return new Date(d).getFullYear()===year;}).length;

  // GymDNA
  var stats = computeGymStats ? computeGymStats() : null;
  var dnaDesc = 'Dedykowany zawodnik siłowni';
  if (stats) {
    var pct = (stats.pushSets||0) / Math.max(stats.totalSets||1,1);
    if (pct > 0.4) dnaDesc = 'Typ Push — klatka i barki to twój żywioł';
    else if ((stats.pullSets||0)/(stats.totalSets||1) > 0.35) dnaDesc = 'Typ Pull — plecy i biceps są twoją mocną stroną';
    else dnaDesc = 'Wszechstronny zawodnik — trenujesz wszystko równomiernie';
  }

  return [
    { icon:'🎉', label:'Twój rok', val: year+'', sub:'w GymFlow', color:'var(--accent)', bg:'rgba(255,55,95,.12)', animate:false },
    { icon:'💪', label:'Treningi', val: workouts.length+'', sub:'ukończonych treningów', color:'var(--accent)', bg:'rgba(255,55,95,.08)' },
    { icon:'🏋️', label:'Łączny ciężar', val: (totalTonnage/1000).toFixed(1)+'t', sub:'przeniesionego żelastwa', color:'#FF9F0A', bg:'rgba(255,159,10,.08)' },
    { icon:'🔥', label:'Najdłuższy streak', val: maxStreak+' dni', sub:'nieprzerwanych treningów', color:'#FF9F0A', bg:'rgba(255,159,10,.08)' },
    { icon:'🏆', label:'Pobite PR', val: prs||'0', sub:'nowych rekordów personalnych', color:'#FFD60A', bg:'rgba(255,214,10,.08)' },
    { icon:'❤️', label:'Top partia', val: topMuscle, sub:'najczęściej trenowana', color:'var(--accent)', bg:'rgba(255,55,95,.08)', noCount:true },
    { icon:'⭐', label:'Ulubione ćwiczenie', val: topEx, sub:'najczęściej wykonywane', color:'#FFD60A', bg:'rgba(255,214,10,.08)', noCount:true },
    { icon:'📅', label:'Najaktywniejszy miesiąc', val: topMonth, sub: monthCounts[topMonthIdx]+' treningów', color:'#30D158', bg:'rgba(48,209,88,.08)', noCount:true },
    { icon:'⏱️', label:'Łączny czas', val: formatTime(totalDuration), sub:'spędzonego na treningu', color:'#0A84FF', bg:'rgba(10,132,255,.08)', noCount:true },
    { icon:'🏅', label:'Osiągnięcia', val: achCount+'', sub:'odblokowanych w tym roku', color:'#FFD60A', bg:'rgba(255,214,10,.08)' },
    { icon:'📈', label:'Avg czas treningu', val: formatTime(avgDuration), sub:'średni czas jednego treningu', color:'#30D158', bg:'rgba(48,209,88,.08)', noCount:true },
    { icon:'💯', label:'Consistency Score', val: consistency+'%', sub:'aktywnych dni w roku', color:'#0A84FF', bg:'rgba(10,132,255,.08)' },
    { icon:'🧬', label:'Twoje GymDNA', val: dnaDesc, sub:'unikalny profil treningowy', color:'var(--accent)', bg:'rgba(255,55,95,.08)', noCount:true },
    { icon:'🎉', label:'Dziękujemy!', val:'', sub:'Do zobaczenia w kolejnym sezonie GymFlow 💪', color:'var(--accent)', bg:'rgba(255,55,95,.12)', animate:false, noCount:true, final:true },
  ];
}

function startWrapped(year) {
  wrappedYear = year;
  wrappedSlide = 0;
  wrappedSlides = buildWrappedSlides(year);
  renderWrappedSlide();
}

function renderWrappedSlide() {
  var container = document.getElementById('wrapped-container');
  var slide = wrappedSlides[wrappedSlide];
  if (!slide) return;

  var isLast = wrappedSlide === wrappedSlides.length - 1;
  var isFirst = wrappedSlide === 0;

  var html = '<div style="background:' + (slide.bg||'var(--surface2)') + ';border-radius:20px;padding:32px 20px;text-align:center;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:gfSlideIn .4s cubic-bezier(.34,1.56,.64,1);">';
  html += '<div style="font-size:56px;margin-bottom:12px;">' + slide.icon + '</div>';
  html += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">' + slide.label + '</div>';

  if (slide.final) {
    html += '<div style="font-size:16px;font-weight:700;margin-bottom:6px;">Dziękujemy za wspólny rok!</div>';
    html += '<div style="font-size:13px;color:var(--text3);">' + slide.sub + '</div>';
  } else if (slide.noCount || !slide.val.match || !slide.val.match(/^[\d.,]+/)) {
    html += '<div style="font-size:24px;font-weight:800;color:' + slide.color + ';margin-bottom:6px;" id="wrapped-val">' + slide.val + '</div>';
    html += '<div style="font-size:13px;color:var(--text3);">' + slide.sub + '</div>';
  } else {
    html += '<div style="font-size:36px;font-weight:800;color:' + slide.color + ';margin-bottom:6px;" id="wrapped-val">0</div>';
    html += '<div style="font-size:13px;color:var(--text3);">' + slide.sub + '</div>';
  }

  html += '</div>';

  // Navigation
  html += '<div style="display:flex;gap:8px;margin-top:12px;align-items:center;">';
  if (!isFirst) {
    html += '<button class="btn btn-secondary" style="flex:1;" onclick="wrappedSlide--;renderWrappedSlide()">← Wstecz</button>';
  }
  if (!isLast) {
    html += '<button class="btn btn-primary" style="flex:2;" onclick="wrappedSlide++;renderWrappedSlide()">Dalej →</button>';
  } else {
    html += '<button class="btn btn-secondary" style="flex:1;" onclick="renderWrappedMenu()">✕ Zamknij</button>';
  }
  html += '</div>';

  // Progress dots
  html += '<div style="display:flex;justify-content:center;gap:5px;margin-top:10px;">';
  for (var i = 0; i < wrappedSlides.length; i++) {
    html += '<div style="width:6px;height:6px;border-radius:50%;background:' + (i === wrappedSlide ? 'var(--accent)' : 'var(--surface2)') + ';transition:background .2s;"></div>';
  }
  html += '</div>';

  container.innerHTML = html;

  // Count-up animation for numeric values
  if (!slide.noCount && !slide.final && slide.val && typeof countUp === 'function') {
    var valEl = document.getElementById('wrapped-val');
    if (valEl && slide.val.match(/^[\d.]+/)) {
      var num = parseFloat(slide.val);
      var suffix = slide.val.replace(/^[\d.]+/, '');
      if (!isNaN(num)) countUp(valEl, num, 1000, suffix);
    }
  }
}
