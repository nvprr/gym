// ===================== PROGRESS.JS =====================

// ── Zmienne globalne ──
let progressTab = 'dna';
let chartRange = 30;
let chartExFilter = '';
let reportType = 'week';
let recordsSearch = '';


function switchProgressTab(tab, el) {
  progressTab = tab;
  document.querySelectorAll('.prog-tab[id^="pt-"]').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('.prog-section').forEach(function(s){ s.style.display = 'none'; });
  document.getElementById('prog-' + tab).style.display = 'block';
  renderProgressTab(tab);
}

function renderProgressTab(tab) {
  if (tab === 'dna')      renderGymDNA();
  if (tab === 'records')  renderRecords();
  if (tab === 'stats')    renderFullStats();
  if (tab === 'charts')   renderCharts();
  if (tab === 'goals')    renderGoals();
  if (tab === 'hall')     renderHallOfFame();
  if (tab === 'reports')  renderReports();
  if (tab === 'timeline') renderTimeline();
}

function computeAllRecords() {
  var records = {};
  state.workouts.forEach(function(w) {
    var wDate = new Date(w.date);
    (w.exercises || []).forEach(function(ex) {
      if (!ex.id) return;
      if (!records[ex.id]) {
        records[ex.id] = {
          id: ex.id, name: ex.name,
          maxWeight: 0, maxWeightDate: null,
          maxReps: 0, maxRepsDate: null,
          maxTonnage: 0, maxTonnageDate: null,
          maxSets: 0, maxSetsDate: null,
          maxE1RM: 0, maxE1RMDate: null,
          bestWeight: 0, bestReps: 0,
          totalSets: 0, totalTonnage: 0, count: 0
        };
      }
      var r = records[ex.id];
      var doneSets = (ex.sets || []).filter(function(s){ return s.done; });
      var exTonnage = doneSets.reduce(function(a,s){ return a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0); }, 0);
      doneSets.forEach(function(s) {
        var w2 = parseFloat(s.weight) || 0;
        var rp = parseInt(s.reps) || 0;
        if (w2 > r.maxWeight) { r.maxWeight = w2; r.maxWeightDate = wDate; }
        if (rp > r.maxReps)   { r.maxReps = rp;   r.maxRepsDate = wDate; }
        // 1RM estimate (Epley)
        var e1rm = w2 * (1 + rp / 30);
        if (e1rm > r.maxE1RM) {
          r.maxE1RM = e1rm;
          r.maxE1RMDate = wDate;
          r.bestWeight = w2;
          r.bestReps = rp;
        }
      });
      if (exTonnage > r.maxTonnage) { r.maxTonnage = exTonnage; r.maxTonnageDate = wDate; }
      if (doneSets.length > r.maxSets) { r.maxSets = doneSets.length; r.maxSetsDate = wDate; }
      r.totalSets += doneSets.length;
      r.totalTonnage += exTonnage;
      r.count++;
    });
  });
  return records;
}

function computeStreaks() {
  if (!state.workouts.length) return { current: 0, max: 0 };
  var days = [];
  var seen = {};
  state.workouts.forEach(function(w) {
    var d = new Date(w.date).toDateString();
    if (!seen[d]) { seen[d] = true; days.push(new Date(w.date)); }
  });
  days.sort(function(a,b){ return a-b; });
  var max = 1, cur = 1;
  for (var i = 1; i < days.length; i++) {
    var diff = Math.round((days[i]-days[i-1])/86400000);
    if (diff === 1) { cur++; max = Math.max(max, cur); }
    else cur = 1;
  }
  // Current streak
  var curStreak = 1;
  var today = new Date(); today.setHours(0,0,0,0);
  var yesterday = new Date(today); yesterday.setDate(yesterday.getDate()-1);
  var lastDay = new Date(days[days.length-1]); lastDay.setHours(0,0,0,0);
  if (lastDay < yesterday) return { current: 0, max: max };
  for (var j = days.length-2; j >= 0; j--) {
    var d2 = new Date(days[j]); d2.setHours(0,0,0,0);
    var d1 = new Date(days[j+1]); d1.setHours(0,0,0,0);
    if (Math.round((d1-d2)/86400000) === 1) curStreak++;
    else break;
  }
  return { current: curStreak, max: Math.max(max, curStreak) };
}

function computeGymStats() {
  var w = state.workouts;
  if (!w.length) return null;
  var totalTime = w.reduce(function(a,x){ return a+(x.duration||0); }, 0);
  var totalTonnage = w.reduce(function(a,x){ return a+(x.tonnage||0); }, 0);
  var totalSets = w.reduce(function(a,x){ return a+(x.totalSets||0); }, 0);
  var totalReps = w.reduce(function(a,x){ return a+(x.totalReps||0); }, 0);
  var totalEx = w.reduce(function(a,x){ return a+(x.exercises||[]).length; }, 0);
  var activeDays = new Set(w.map(function(x){ return new Date(x.date).toDateString(); })).size;

  // Most trained muscle
  var muscleCount = {};
  w.forEach(function(wo) {
    (wo.exercises||[]).forEach(function(ex) {
      var def = getAllExercises().find(function(e){ return e.id===ex.id; });
      if (!def) return;
      muscleCount[def.muscle] = (muscleCount[def.muscle]||0) + (ex.completedSets||0);
    });
  });
  var muscleArr = Object.entries(muscleCount).sort(function(a,b){ return b[1]-a[1]; });
  var topMuscle = muscleArr[0] ? muscleArr[0][0] : '—';
  var botMuscle = muscleArr.length > 1 ? muscleArr[muscleArr.length-1][0] : '—';

  // Most frequent exercise
  var exCount = {};
  w.forEach(function(wo) {
    (wo.exercises||[]).forEach(function(ex) {
      exCount[ex.name] = (exCount[ex.name]||0)+1;
    });
  });
  var topEx = Object.entries(exCount).sort(function(a,b){ return b[1]-a[1]; })[0];

  // Day of week distribution
  var dayCount = [0,0,0,0,0,0,0];
  w.forEach(function(wo){ dayCount[new Date(wo.date).getDay()]++; });
  var dayNames = ['Nd','Pn','Wt','Śr','Cz','Pt','Sb'];
  var topDayIdx = dayCount.indexOf(Math.max.apply(null, dayCount));

  // Weekly average
  if (w.length >= 2) {
    var oldest = new Date(w[0].date);
    var newest = new Date(w[w.length-1].date);
    var weeks = Math.max(1, Math.round((newest-oldest)/604800000));
    var weeklyAvg = (w.length/weeks).toFixed(1);
  } else {
    var weeklyAvg = w.length;
  }

  var streaks = computeStreaks();

  return {
    count: w.length,
    activeDays: activeDays,
    totalTime: totalTime,
    totalTonnage: totalTonnage,
    totalSets: totalSets,
    totalReps: totalReps,
    avgTime: Math.round(totalTime/w.length),
    avgTonnage: Math.round(totalTonnage/w.length),
    avgEx: (totalEx/w.length).toFixed(1),
    avgSets: (totalSets/w.length).toFixed(1),
    avgReps: (totalReps/w.length).toFixed(0),
    topMuscle: topMuscle,
    botMuscle: botMuscle,
    topEx: topEx ? topEx[0] : '—',
    topDay: dayNames[topDayIdx],
    weeklyAvg: weeklyAvg,
    streak: streaks.current,
    maxStreak: streaks.max,
    muscleArr: muscleArr
  };
}

function computeConsistency() {
  // Last 12 weeks: how many days had workouts vs expected (3/week)
  var total = 0;
  var now = Date.now();
  for (var i = 0; i < 12; i++) {
    var weekStart = now - (i+1)*7*86400000;
    var weekEnd = now - i*7*86400000;
    var daysThisWeek = new Set(
      state.workouts
        .filter(function(w){ var t=new Date(w.date).getTime(); return t>=weekStart&&t<weekEnd; })
        .map(function(w){ return new Date(w.date).toDateString(); })
    ).size;
    total += Math.min(1, daysThisWeek/3);
  }
  return Math.round((total/12)*100);
}

function renderGymDNA() {
  var s = computeGymStats();
  var el = document.getElementById('gymdna-content');
  if (!s) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;">Wykonaj pierwszy trening, aby zobaczyć swój GymDNA.</div>';
    document.getElementById('gym-insights').innerHTML = '';
    document.getElementById('consistency-meter').innerHTML = '';
    return;
  }

  // Determine training style
  var style = 'Ogólny';
  if (s.topMuscle === 'Klatka' || s.topMuscle === 'Triceps') style = 'Push-focused 💪';
  else if (s.topMuscle === 'Plecy' || s.topMuscle === 'Biceps') style = 'Pull-focused 🔙';
  else if (s.topMuscle === 'Nogi' || s.topMuscle === 'Pośladki') style = 'Leg-focused 🦵';
  else if (s.topMuscle === 'Barki') style = 'Shoulder-focused 🏋️';
  else if (s.topMuscle === 'Brzuch') style = 'Core-focused 🏃';

  el.innerHTML =
    '<div class="dna-grid">' +
      '<div class="dna-cell"><div class="dna-val">' + style + '</div><div class="dna-label">Styl treningowy</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + (s.topEx.length > 20 ? s.topEx.slice(0,18)+'…' : s.topEx) + '</div><div class="dna-label">Ulubione ćwiczenie</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + s.topMuscle + '</div><div class="dna-label">Najmocniejsza partia</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + s.botMuscle + '</div><div class="dna-label">Najsłabsza partia</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + formatTime(s.avgTime) + '</div><div class="dna-label">Średni czas treningu</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + s.avgTonnage.toLocaleString('pl') + 'kg</div><div class="dna-label">Średni tonaż</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + s.topDay + '</div><div class="dna-label">Najczęstszy dzień</div></div>' +
      '<div class="dna-cell"><div class="dna-val">' + s.weeklyAvg + ' / tydzień</div><div class="dna-label">Średnia treningów</div></div>' +
    '</div>';

  // Consistency ring
  var pct = computeConsistency();
  var r = 44, circ = 2*Math.PI*r;
  var filled = circ*(1-pct/100);
  var col = pct>=80?'var(--green)':pct>=50?'var(--yellow)':'var(--accent)';
  document.getElementById('consistency-meter').innerHTML =
    '<div class="consistency-ring">' +
      '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="' + r + '" fill="none" stroke="var(--surface3)" stroke-width="8"/>' +
      '<circle cx="50" cy="50" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + filled.toFixed(1) + '"/></svg>' +
      '<div class="consistency-label"><div class="consistency-pct" style="color:'+col+'">' + pct + '%</div><div class="consistency-txt">Consistency</div></div>' +
    '</div>' +
    '<div style="text-align:center;font-size:12px;color:var(--text3);">Regularność treningów z ostatnich 12 tygodni (cel: 3/tydzień)</div>';

  renderGymInsights(s);
}

function renderGymInsights(s) {
  var insights = [];
  var now = Date.now();
  var records = computeAllRecords();
  var sevenDaysAgo = now - 7*86400000;
  var weeklyVol = {};
  state.workouts.forEach(function(w) {
    if (new Date(w.date).getTime() < sevenDaysAgo) return;
    (w.exercises||[]).forEach(function(ex) {
      var def = getAllExercises().find(function(e){ return e.id===ex.id; });
      if (!def) return;
      weeklyVol[def.muscle] = (weeklyVol[def.muscle]||0) + (ex.completedSets||0);
    });
  });

  // Insights
  if (s.streak >= 3) insights.push({ emoji:'🔥', text: 'Od ' + s.streak + ' dni z rzędu trzymasz regularność. Świetna robota!' });
  if (s.streak === 0) insights.push({ emoji:'⚡', text: 'Czas wrócić na siłownię! Ostatni trening był dawno temu.' });

  // Muscle imbalance
  var topVol = s.muscleArr[0];
  var botVol = s.muscleArr[s.muscleArr.length-1];
  if (topVol && topVol[1] > 0) {
    var totalVol = s.muscleArr.reduce(function(a,b){ return a+b[1]; }, 0);
    var topPct = Math.round(topVol[1]/totalVol*100);
    insights.push({ emoji:'📊', text: topVol[0] + ' odpowiada za ' + topPct + '% całkowitej objętości twoich treningów.' });
  }

  // Untrained muscle
  var allMuscles = ['Klatka','Plecy','Barki','Nogi','Biceps','Triceps','Brzuch'];
  var trainedThisWeek = Object.keys(weeklyVol);
  var untrained = allMuscles.filter(function(m){ return trainedThisWeek.indexOf(m) === -1; });
  if (untrained.length && state.workouts.length > 0) {
    // Find last training date for each untrained muscle
    var oldestUntrained = null, oldestDays = 0;
    untrained.forEach(function(m) {
      var lastDate = null;
      state.workouts.forEach(function(w) {
        (w.exercises||[]).forEach(function(ex) {
          var def = getAllExercises().find(function(e){ return e.id===ex.id; });
          if (def && def.muscle === m && (!lastDate || new Date(w.date) > lastDate)) lastDate = new Date(w.date);
        });
      });
      if (lastDate) {
        var days = Math.floor((now - lastDate.getTime())/86400000);
        if (days > oldestDays) { oldestDays = days; oldestUntrained = m; }
      }
    });
    if (oldestUntrained && oldestDays > 5) {
      insights.push({ emoji:'⚠️', text: oldestUntrained + ' nie były trenowane od ' + oldestDays + ' dni.' });
    }
  }

  // Volume trend
  var prevWeekVol = 0, thisWeekVol = 0;
  state.workouts.forEach(function(w) {
    var t = new Date(w.date).getTime();
    if (t >= now-7*86400000) thisWeekVol += (w.totalSets||0);
    else if (t >= now-14*86400000) prevWeekVol += (w.totalSets||0);
  });
  if (prevWeekVol > 0 && thisWeekVol > 0) {
    var pctChange = Math.round((thisWeekVol-prevWeekVol)/prevWeekVol*100);
    if (pctChange > 0) insights.push({ emoji:'📈', text: 'Twoja objętość wzrosła o ' + pctChange + '% względem poprzedniego tygodnia.' });
    else if (pctChange < -10) insights.push({ emoji:'📉', text: 'Objętość spadła o ' + Math.abs(pctChange) + '% względem poprzedniego tygodnia.' });
  }

  // Best record trend (check for recent PRs)
  var recentPRs = 0;
  Object.values(records).forEach(function(r) {
    if (r.maxWeightDate && (now - r.maxWeightDate.getTime()) < 7*86400000) recentPRs++;
  });
  if (recentPRs > 0) insights.push({ emoji:'🏆', text: 'Pobiłeś ' + recentPRs + ' rekord' + (recentPRs>1?'ów':'') + ' w ostatnich 7 dniach!' });

  if (!insights.length) insights.push({ emoji:'💡', text: 'Trenuj regularnie, aby zobaczyć spersonalizowane wskazówki.' });

  var el = document.getElementById('gym-insights');
  el.innerHTML = insights.map(function(i) {
    return '<div class="insight-row"><div class="insight-emoji">' + i.emoji + '</div><div>' + i.text + '</div></div>';
  }).join('');
}

function filterRecords(q) { recordsSearch = q; renderRecords(); }

function renderRecords() {
  var records = computeAllRecords();
  var arr = Object.values(records).filter(function(r){ return r.count > 0; });
  if (recordsSearch) {
    var q = recordsSearch.toLowerCase();
    arr = arr.filter(function(r){ return r.name.toLowerCase().indexOf(q) !== -1; });
  }
  arr.sort(function(a,b){ return b.maxE1RM - a.maxE1RM; });
  var now = Date.now();
  var el = document.getElementById('records-list');
  if (!arr.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><div class="empty-title">Brak rekordów</div><div class="empty-sub">Wykonaj trening, aby zobaczyć rekordy</div></div>';
    return;
  }
  el.innerHTML = arr.map(function(r) {
    var isNew = r.maxE1RMDate && (now - r.maxE1RMDate.getTime()) < 7*86400000;
    var def = getAllExercises().find(function(e){ return e.id===r.id; });
    var shortName = r.name.length > 35 ? r.name.slice(0,33)+'…' : r.name;
    return '<div class="record-card" onclick="showRecordDetail(' + JSON.stringify(r.id) + ')">' +
      (isNew ? '<div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:4px;">🔥 Nowy rekord!</div>' : '') +
      '<div class="record-name">' + shortName + '</div>' +
      '<div style="font-size:11px;color:var(--text4);margin-bottom:6px;">' + (def?def.muscle:'') + '</div>' +
      '<div class="record-badges">' +
        '<div class="record-badge gold">⚖️ ' + (r.bestWeight||r.maxWeight||'—') + 'kg × ' + (r.bestReps||'—') + '</div>' +
        '<div class="record-badge">🏋️ 1RM ~' + Math.round(r.maxE1RM||0) + 'kg</div>' +
        '<div class="record-badge">📊 ' + r.totalSets + ' serii</div>' +
        '<div class="record-badge">🏋️ ' + Math.round(r.maxTonnage) + 'kg tonaż</div>' +
      '</div>' +
      '<div class="record-date">' + (r.maxWeightDate ? r.maxWeightDate.toLocaleDateString('pl') : '') + ' · Wykonano ' + r.count + 'x</div>' +
    '</div>';
  }).join('');
}

function showRecordDetail(exId) {
  var r = computeAllRecords()[exId];
  if (!r) return;
  var history = [];
  state.workouts.forEach(function(w) {
    (w.exercises||[]).forEach(function(ex) {
      if (ex.id !== exId) return;
      var doneSets = (ex.sets||[]).filter(function(s){ return s.done; });
      if (!doneSets.length) return;
      var maxW = Math.max.apply(null, doneSets.map(function(s){ return parseFloat(s.weight)||0; }));
      var totT = doneSets.reduce(function(a,s){ return a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0); }, 0);
      history.push({ date: new Date(w.date), weight: maxW, tonnage: totT, sets: doneSets.length });
    });
  });
  history.sort(function(a,b){ return a.date-b.date; });
  var lines = [r.name + ' — Historia rekordów', ''].concat(history.map(function(h) {
    return h.date.toLocaleDateString('pl') + ': ' + h.weight + 'kg · ' + h.sets + ' serii · ' + h.tonnage.toFixed(0) + 'kg tonaż';
  }));
  alert(lines.join('\n'));
}

function renderFullStats() {
  var s = computeGymStats();
  var el = document.getElementById('full-stats-content');
  if (!s) { el.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">Brak danych</div></div>'; return; }
  var rows = [
    ['Łącznie treningów', s.count],
    ['Aktywne dni', s.activeDays],
    ['Łączny czas', formatTime(s.totalTime)],
    ['Łączny tonaż', s.totalTonnage.toLocaleString('pl') + 'kg'],
    ['Łącznie serii', s.totalSets],
    ['Łącznie powtórzeń', s.totalReps],
    ['Średni czas treningu', formatTime(s.avgTime)],
    ['Średni tonaż', s.avgTonnage.toLocaleString('pl') + 'kg'],
    ['Średnio ćwiczeń', s.avgEx],
    ['Średnio serii', s.avgSets],
    ['Średnio powtórzeń', s.avgReps],
    ['Najczęstsza partia', s.topMuscle],
    ['Najrzadziej trenowana', s.botMuscle],
    ['Ulubione ćwiczenie', s.topEx.length>30?s.topEx.slice(0,28)+'…':s.topEx],
    ['Najczęstszy dzień', s.topDay],
    ['Treningi / tydzień', s.weeklyAvg],
    ['Aktualny streak', s.streak + ' dni'],
    ['Rekordowy streak', s.maxStreak + ' dni']
  ];
  el.innerHTML = '<div class="card"><div class="card-title">Pełne statystyki</div>' +
    rows.map(function(r){ return '<div class="stat-row"><span class="stat-row-key">' + r[0] + '</span><span class="stat-row-val">' + r[1] + '</span></div>'; }).join('') +
    '</div>';
}

function setChartRange(days, el) {
  chartRange = days;
  document.querySelectorAll('[id^="chart-range-"]').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  renderCharts();
}

function filterChartEx(q) { chartExFilter = q; renderCharts(); }

function renderCharts() {
  var el = document.getElementById('charts-content');
  var cutoff = Date.now() - chartRange * 86400000;
  var filtered = state.workouts.filter(function(w){ return new Date(w.date).getTime() >= cutoff; });

  if (chartExFilter) {
    var q2 = chartExFilter.toLowerCase();
    filtered = filtered.filter(function(w){
      return (w.exercises||[]).some(function(ex){ return ex.name.toLowerCase().indexOf(q2) !== -1; });
    });
  }

  if (!filtered.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📈</div><div class="empty-title">Brak danych</div><div class="empty-sub">Wykonaj treningi w tym zakresie dat</div></div>';
    return;
  }

  filtered.sort(function(a,b){ return new Date(a.date)-new Date(b.date); });

  // SVG line chart builder
  function makeSVGChart(label, values, color, unit, dates) {
    var W = 320, H = 120, pad = { t:16, r:16, b:28, l:40 };
    var iW = W - pad.l - pad.r;
    var iH = H - pad.t - pad.b;
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    var range = max - min || 1;
    var n = values.length;

    function xPos(i) { return pad.l + (n === 1 ? iW/2 : i * iW / (n-1)); }
    function yPos(v) { return pad.t + iH - ((v - min) / range) * iH; }

    // Gradient fill path
    var pts = values.map(function(v,i){ return xPos(i) + ',' + yPos(v).toFixed(1); });
    var linePath = 'M' + pts.join('L');
    var fillPath = linePath + 'L' + xPos(n-1) + ',' + (pad.t+iH) + 'L' + xPos(0) + ',' + (pad.t+iH) + 'Z';

    // Y axis labels
    var yLabels = '';
    var steps = 3;
    for (var s = 0; s <= steps; s++) {
      var v = min + (range * s / steps);
      var y = yPos(v);
      var label2 = v >= 1000 ? (v/1000).toFixed(1)+'k' : Math.round(v)+'';
      yLabels += '<text x="'+(pad.l-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="9" fill="var(--text4)">'+label2+'</text>';
      yLabels += '<line x1="'+pad.l+'" y1="'+y+'" x2="'+(W-pad.r)+'" y2="'+y+'" stroke="var(--border2)" stroke-width="0.5" stroke-dasharray="3,3"/>';
    }

    // X axis date labels (max 5)
    var xLabels = '';
    var step = Math.max(1, Math.ceil(n/5));
    for (var i = 0; i < n; i += step) {
      var d = new Date(dates[i]);
      var lbl = (d.getDate()) + '/' + (d.getMonth()+1);
      xLabels += '<text x="'+xPos(i)+'" y="'+(H-6)+'" text-anchor="middle" font-size="9" fill="var(--text4)">'+lbl+'</text>';
    }

    // Dots with tooltips
    var dots = values.map(function(v,i){
      var tip = (v%1===0?v:v.toFixed(1)) + (unit||'');
      var x = xPos(i), y = yPos(v);
      return '<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="'+color+'" stroke="var(--bg)" stroke-width="1.5">'
        + '<title>'+tip+'</title></circle>'
        + '<circle cx="'+x+'" cy="'+y+'" r="8" fill="transparent">'
        + '<title>'+tip+'</title></circle>';
    }).join('');

    // Last value badge
    var lastV = values[values.length-1];
    var lastLabel = lastV >= 1000 ? (lastV/1000).toFixed(1)+'k'+unit : (lastV%1===0?lastV:lastV.toFixed(1))+unit;

    var gradId = 'g'+Math.random().toString(36).slice(2,6);

    var svg = '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">'
      + '<defs><linearGradient id="'+gradId+'" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="'+color+'" stop-opacity="0.3"/>'
      + '<stop offset="100%" stop-color="'+color+'" stop-opacity="0.02"/>'
      + '</linearGradient></defs>'
      + yLabels
      + '<path d="'+fillPath+'" fill="url(#'+gradId+')" />'
      + '<path d="'+linePath+'" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      + dots
      + xLabels
      + '</svg>';

    return '<div style="background:var(--surface);border-radius:16px;padding:14px 16px;margin-bottom:10px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      + '<div style="font-size:13px;font-weight:700;color:var(--text3);">'+label+'</div>'
      + '<div style="font-size:16px;font-weight:800;color:'+color+';">'+lastLabel+'</div>'
      + '</div>'
      + svg
      + '</div>';
  }

  var dates    = filtered.map(function(w){ return w.date; });
  var tonnages = filtered.map(function(w){ return w.tonnage||0; });
  var sets     = filtered.map(function(w){ return w.totalSets||0; });
  var reps     = filtered.map(function(w){ return w.totalReps||0; });
  var durations= filtered.map(function(w){ return Math.round((w.duration||0)/60); });

  var html = '<div style="padding:0 16px;">';

  if (chartExFilter) {
    var q3 = chartExFilter.toLowerCase();
    var weightData = filtered.map(function(w) {
      var ex = (w.exercises||[]).find(function(e){ return e.name.toLowerCase().indexOf(q3) !== -1; });
      if (!ex) return 0;
      return Math.max.apply(null, (ex.sets||[]).filter(function(s){ return s.done; }).map(function(s){ return parseFloat(s.weight)||0; }).concat([0]));
    });
    html += makeSVGChart('⚖️ Ciężar — '+chartExFilter, weightData, 'var(--accent)', 'kg', dates);
  }

  html += makeSVGChart('⚖️ Tonaż (kg)',   tonnages,  'var(--accent)', 'kg',  dates);
  html += makeSVGChart('📊 Serie',         sets,      '#0A84FF',       '',    dates);
  html += makeSVGChart('🔄 Powtórzenia',   reps,      '#BF5AF2',       '',    dates);
  html += makeSVGChart('⏱ Czas (min)',     durations, '#30D158',       'min', dates);
  html += '</div>';

  el.innerHTML = html;
}

function makeBarChart(label, values, color, unit) {
  // kept for backwards compatibility
  var max = Math.max.apply(null, values.concat([1]));
  return '<div style="margin-bottom:12px;"><div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:6px;">'+label+'</div>'
    + '<div style="display:flex;align-items:flex-end;gap:3px;height:80px;background:var(--surface2);border-radius:10px;padding:8px 8px 0;overflow:hidden;">'
    + values.map(function(v){
        var h = Math.max(3, Math.round((v/max)*64));
        return '<div style="flex:1;height:'+h+'px;background:'+color+';border-radius:3px 3px 0 0;min-width:4px;"></div>';
      }).join('')
    + '</div></div>';
}

function openGoalSheet() {
  document.getElementById('goal-desc-input').value = '';
  document.getElementById('goal-target-input').value = '';
  document.getElementById('goal-ex-input').value = '';
  document.getElementById('goal-type-input').value = 'workouts';
  document.getElementById('goal-ex-row').style.display = 'none';
  document.getElementById('goal-type-input').onchange = function() {
    document.getElementById('goal-ex-row').style.display = this.value==='weight' ? 'block' : 'none';
  };
  openSheet('goal-sheet');
}

function saveGoal() {
  var desc = document.getElementById('goal-desc-input').value.trim();
  var type = document.getElementById('goal-type-input').value;
  var target = parseFloat(document.getElementById('goal-target-input').value);
  if (!desc || !target) { showNotif('⚠️','Błąd','Uzupełnij opis i wartość docelową'); return; }
  var goal = {
    id: uid(), desc: desc, type: type, target: target,
    exName: document.getElementById('goal-ex-input').value.trim() || '',
    created: new Date().toISOString(), completed: false
  };
  if (!state.goals) state.goals = [];
  state.goals.push(goal);
  dbPut('goals', { id:'all', data:state.goals });
  addTimelineEvent({ type:'goal', title:'Nowy cel: ' + desc, sub:'Cel: ' + target, date:new Date().toISOString(), color:'var(--blue)' });
  closeSheet('goal-sheet');
  renderGoals();
  showNotif('🎯','Cel dodany', desc);
}

function getGoalProgress(goal) {
  var s = computeGymStats();
  if (!s) return 0;
  if (goal.type === 'workouts') return s.count;
  if (goal.type === 'tonnage')  return s.totalTonnage;
  if (goal.type === 'sets')     return s.totalSets;
  if (goal.type === 'reps')     return s.totalReps;
  if (goal.type === 'days')     return s.activeDays;
  if (goal.type === 'hours')    return Math.round(s.totalTime/3600);
  if (goal.type === 'weight') {
    var best = 0;
    var qn = (goal.exName||'').toLowerCase();
    state.workouts.forEach(function(w) {
      (w.exercises||[]).forEach(function(ex) {
        if (!qn || ex.name.toLowerCase().indexOf(qn) !== -1) {
          (ex.sets||[]).forEach(function(s2) {
            if (s2.done) best = Math.max(best, parseFloat(s2.weight)||0);
          });
        }
      });
    });
    return best;
  }
  return 0;
}

function renderGoals() {
  if (!state.goals) state.goals = [];
  var el = document.getElementById('goals-list');
  if (!state.goals.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🎯</div><div class="empty-title">Brak celów</div><div class="empty-sub">Dodaj swój pierwszy cel treningowy</div></div>';
    return;
  }
  el.innerHTML = state.goals.map(function(g, gi) {
    var curr = getGoalProgress(g);
    var pct = Math.min(100, Math.round((curr/g.target)*100));
    var isDone = pct >= 100;
    var col = isDone ? 'var(--green)' : pct>60 ? 'var(--yellow)' : 'var(--accent)';
    var typeLabel = { workouts:'treningi', tonnage:'kg tonaż', sets:'serie', reps:'powtórzenia', days:'dni', hours:'godziny', weight:'kg ciężar' }[g.type]||'';
    // ETA
    var eta = '';
    if (!isDone && computeGymStats()) {
      var s2 = computeGymStats();
      if (s2.count > 0) {
        var rate = curr / Math.max(1, s2.count);
        var remaining = g.target - curr;
        var workoutsNeeded = rate > 0 ? Math.ceil(remaining/rate) : null;
        if (workoutsNeeded) eta = '~' + workoutsNeeded + ' treningów do celu';
      }
    }
    return '<div class="goal-card">' +
      '<div class="goal-header"><div class="goal-name">' + g.desc + (isDone?' ✅':'') + '</div><div class="goal-pct" style="color:'+col+'">' + pct + '%</div></div>' +
      '<div class="goal-bar"><div class="goal-fill ' + (isDone?'goal-done':'') + '" style="width:' + pct + '%;background:'+col+'"></div></div>' +
      '<div class="goal-meta">' + curr.toLocaleString('pl') + ' / ' + g.target.toLocaleString('pl') + ' ' + typeLabel + (eta?' · '+eta:'') + '</div>' +
      '<div style="text-align:right;margin-top:6px;"><button style="background:none;border:none;color:var(--red);font-size:12px;cursor:pointer;" onclick="deleteGoal(' + gi + ')">Usuń</button></div>' +
    '</div>';
  }).join('');
}

function deleteGoal(i) {
  if (!confirm('Usunąć cel?')) return;
  state.goals.splice(i, 1);
  dbPut('goals', { id:'all', data: state.goals });
  renderGoals();
}

function checkGoalsOnWorkout() {
  if (!state.goals) return;
  state.goals.forEach(function(g) {
    if (g.completed) return;
    var curr = getGoalProgress(g);
    if (curr >= g.target) {
      g.completed = true;
      addTimelineEvent({ type:'goal_done', title:'Cel ukończony: ' + g.desc, sub:curr + ' / ' + g.target, date:new Date().toISOString(), color:'var(--green)' });
      setTimeout(function() { showNotif('🎯','Cel osiągnięty!', g.desc); }, 1000);
    }
  });
  dbPut('goals', { id:'all', data: state.goals });
}

function renderHallOfFame() {
  var el = document.getElementById('hall-of-fame-content');
  if (!state.workouts.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><div class="empty-title">Brak danych</div></div>';
    return;
  }

  var sorted = [...state.workouts].sort(function(a,b){ return (b.tonnage||0)-(a.tonnage||0); });
  var longestW = [...state.workouts].sort(function(a,b){ return (b.duration||0)-(a.duration||0); });
  var shortestW = [...state.workouts].filter(function(w){ return (w.duration||0)>60; }).sort(function(a,b){ return (a.duration||0)-(b.duration||0); });

  // Big lifts
  var bigLifts = { bench: null, squat: null, deadlift: null, ohp: null };
  var bigNames = {
    bench: ['bench press','wyciskanie sztangi na ławce','wyciskanie sztangi (bench'],
    squat: ['przysiad ze sztangą','back squat','squat'],
    deadlift: ['martwy ciąg klasyczny','deadlift','martwy ciąg'],
    ohp: ['wyciskanie żołnierskie','ohp','military press','overhead press']
  };
  state.workouts.forEach(function(w) {
    (w.exercises||[]).forEach(function(ex) {
      var nm = (ex.name||'').toLowerCase();
      Object.entries(bigNames).forEach(function(entry) {
        var key = entry[0], kws = entry[1];
        if (kws.some(function(k){ return nm.indexOf(k)!==-1; })) {
          (ex.sets||[]).filter(function(s){ return s.done; }).forEach(function(s) {
            var w2 = parseFloat(s.weight)||0;
            if (!bigLifts[key] || w2 > bigLifts[key].weight) {
              bigLifts[key] = { weight:w2, date:new Date(w.date), workout:w.planName||'Trening' };
            }
          });
        }
      });
    });
  });

  // Weekly max
  var weekMap = {};
  state.workouts.forEach(function(w) {
    var wk = getWeekKey(new Date(w.date));
    weekMap[wk] = (weekMap[wk]||0)+1;
  });
  var maxWeek = Object.values(weekMap).length ? Math.max.apply(null, Object.values(weekMap)) : 0;
  var monthMap = {};
  state.workouts.forEach(function(w) {
    var mk = new Date(w.date).toISOString().slice(0,7);
    monthMap[mk] = (monthMap[mk]||{ t:0, c:0 });
    monthMap[mk].t += w.tonnage||0;
    monthMap[mk].c++;
  });
  var bestMonth = Object.entries(monthMap).sort(function(a,b){ return b[1].t-a[1].t; })[0];

  var hof = [
    { icon:'🏋️', title:'Największy trening (tonaż)', val: sorted[0] ? sorted[0].tonnage.toFixed(0)+'kg' : '—', sub: sorted[0] ? sorted[0].planName + ' · ' + new Date(sorted[0].date).toLocaleDateString('pl') : '' },
    { icon:'⏱', title:'Najdłuższy trening', val: longestW[0] ? formatTime(longestW[0].duration) : '—', sub: longestW[0] ? new Date(longestW[0].date).toLocaleDateString('pl') : '' },
    { icon:'⚡', title:'Najkrótszy trening', val: shortestW[0] ? formatTime(shortestW[0].duration) : '—', sub: shortestW[0] ? new Date(shortestW[0].date).toLocaleDateString('pl') : '' },
    { icon:'🗓', title:'Największa liczba treningów / tydzień', val: maxWeek || '—', sub: '' },
    { icon:'📅', title:'Największy miesięczny tonaż', val: bestMonth ? (bestMonth[1].t/1000).toFixed(1)+'t' : '—', sub: bestMonth ? bestMonth[0] + ' · ' + bestMonth[1].c + ' treningów' : '' },
    { icon:'🏆', title:'Największy Bench Press', val: bigLifts.bench ? bigLifts.bench.weight+'kg' : '—', sub: bigLifts.bench ? bigLifts.bench.date.toLocaleDateString('pl') : 'Brak danych' },
    { icon:'🦵', title:'Największy Squat', val: bigLifts.squat ? bigLifts.squat.weight+'kg' : '—', sub: bigLifts.squat ? bigLifts.squat.date.toLocaleDateString('pl') : 'Brak danych' },
    { icon:'💀', title:'Największy Deadlift', val: bigLifts.deadlift ? bigLifts.deadlift.weight+'kg' : '—', sub: bigLifts.deadlift ? bigLifts.deadlift.date.toLocaleDateString('pl') : 'Brak danych' },
    { icon:'🙌', title:'Największy OHP', val: bigLifts.ohp ? bigLifts.ohp.weight+'kg' : '—', sub: bigLifts.ohp ? bigLifts.ohp.date.toLocaleDateString('pl') : 'Brak danych' },
  ];

  el.innerHTML = hof.map(function(h) {
    return '<div class="hof-card"><div class="hof-icon">' + h.icon + '</div><div><div class="hof-title">' + h.title + '</div><div class="hof-val">' + h.val + '</div><div class="hof-sub">' + h.sub + '</div></div></div>';
  }).join('');
}

function getWeekKey(d) {
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7);
  return d.getFullYear() + '-W' + week;
}

function setReportType(type, el) {
  reportType = type;
  document.querySelectorAll('[id^="rep-"]').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  renderReports();
}

function renderReports() {
  var el = document.getElementById('reports-content');
  var periods = [];
  var now = new Date();

  if (reportType === 'week') {
    for (var i = 0; i < 8; i++) {
      var end = new Date(now); end.setDate(end.getDate() - i*7); end.setHours(23,59,59);
      var start = new Date(end); start.setDate(start.getDate()-6); start.setHours(0,0,0);
      periods.push({ label: i===0?'Ten tydzień':'Tydzień -'+i, start:start, end:end });
    }
  } else if (reportType === 'month') {
    for (var i = 0; i < 12; i++) {
      var d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      var dEnd = new Date(d.getFullYear(), d.getMonth()+1, 0, 23, 59, 59);
      var monthNames = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
      periods.push({ label: monthNames[d.getMonth()] + ' ' + d.getFullYear(), start:d, end:dEnd });
    }
  } else {
    for (var i = 0; i < 5; i++) {
      var yr = now.getFullYear()-i;
      periods.push({ label: yr.toString(), start:new Date(yr,0,1), end:new Date(yr,11,31,23,59,59) });
    }
  }

  var html = '';
  periods.forEach(function(p) {
    var ws = state.workouts.filter(function(w) {
      var t = new Date(w.date);
      return t >= p.start && t <= p.end;
    });
    if (!ws.length) return;
    var totTime = ws.reduce(function(a,w){ return a+(w.duration||0); }, 0);
    var totTon = ws.reduce(function(a,w){ return a+(w.tonnage||0); }, 0);
    var totSets = ws.reduce(function(a,w){ return a+(w.totalSets||0); }, 0);
    var totReps = ws.reduce(function(a,w){ return a+(w.totalReps||0); }, 0);
    var bestW = ws.sort(function(a,b){ return (b.tonnage||0)-(a.tonnage||0); })[0];

    // New PRs in period
    var newPRs = 0;
    var records = computeAllRecords();
    Object.values(records).forEach(function(r) {
      if (r.maxWeightDate && r.maxWeightDate >= p.start && r.maxWeightDate <= p.end) newPRs++;
    });

    html += '<div class="report-card"><div class="report-header"><span>' + p.label + '</span><span class="report-period">' + ws.length + ' treningów</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Czas łączny</span><span class="stat-row-val">' + formatTime(totTime) + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Tonaż</span><span class="stat-row-val">' + totTon.toLocaleString('pl') + 'kg</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Serie</span><span class="stat-row-val">' + totSets + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Powtórzenia</span><span class="stat-row-val">' + totReps + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Nowe rekordy</span><span class="stat-row-val">' + (newPRs || 0) + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-key">Śr. czas treningu</span><span class="stat-row-val">' + formatTime(Math.round(totTime/ws.length)) + '</span></div>' +
      (bestW ? '<div class="report-highlight">🏆 Najlepszy trening: ' + bestW.planName + ' · ' + new Date(bestW.date).toLocaleDateString('pl') + ' · ' + (bestW.tonnage||0).toFixed(0) + 'kg tonaż</div>' : '') +
    '</div>';
  });

  el.innerHTML = html || '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Brak danych</div></div>';
}

function addTimelineEvent(event) {
  if (!state.timeline) state.timeline = [];
  state.timeline.push(event);
  // Keep last 100
  if (state.timeline.length > 100) state.timeline = state.timeline.slice(-100);
  dbPut('timeline', { id:'all', data: state.timeline });
}

function renderTimeline() {
  var el = document.getElementById('timeline-content');
  var events = [];

  // Auto-generate from workouts
  state.workouts.forEach(function(w) {
    events.push({ type:'workout', title:w.planName||'Trening', sub:(w.exercises||[]).length+' ćwiczeń · '+(w.tonnage||0).toFixed(0)+'kg', date:w.date, color:'var(--accent)' });
  });

  // Records
  var records = computeAllRecords();
  Object.values(records).forEach(function(r) {
    if (r.maxWeightDate) {
      events.push({ type:'record', title:'🏆 Rekord: ' + (r.name.length>25?r.name.slice(0,23)+'…':r.name), sub:r.maxWeight+'kg', date:r.maxWeightDate.toISOString(), color:'var(--yellow)' });
    }
  });

  // Saved timeline events
  if (state.timeline && state.timeline.length) {
    events = events.concat(state.timeline);
  }

  // Sort newest first
  events.sort(function(a,b){ return new Date(b.date)-new Date(a.date); });

  if (!events.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">Brak wydarzeń</div></div>';
    return;
  }

  var icons = { workout:'💪', record:'🏆', goal:'🎯', goal_done:'✅', streak:'🔥', gymdna:'🧬' };
  el.innerHTML = events.slice(0, 60).map(function(ev) {
    return '<div class="tl-item">' +
      '<div class="tl-dot" style="background:' + (ev.color||'var(--accent)') + '"></div>' +
      '<div class="tl-body"><div class="tl-title">' + (icons[ev.type]||'📌') + ' ' + ev.title + '</div>' +
      '<div class="tl-sub">' + (ev.sub||'') + '</div>' +
      '<div class="tl-date">' + new Date(ev.date).toLocaleDateString('pl', {day:'numeric',month:'short',year:'numeric'}) + '</div></div></div>';
  }).join('');
}

function updateProgressAfterWorkout(workout) {
  addTimelineEvent({
    type: 'workout',
    title: workout.planName || 'Trening',
    sub: (workout.exercises||[]).length + ' ćwiczeń · ' + (workout.tonnage||0).toFixed(0) + 'kg tonaż',
    date: workout.date,
    color: 'var(--accent)'
  });
  var streaks = computeStreaks();
  if (streaks.current > 1 && streaks.current % 7 === 0) {
    addTimelineEvent({ type:'streak', title:'🔥 ' + streaks.current + '-dniowy streak!', sub:'Niesamowita regularność!', date:workout.date, color:'var(--orange)' });
  }
  checkGoalsOnWorkout();
  // Check achievements with notification
  setTimeout(function(){ checkAchievements(true); }, 800);
}

