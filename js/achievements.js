// ===================== ACHIEVEMENTS.JS =====================

// ── Zmienne globalne ──
var achUnlockQueue = [];
var achUnlockShowing = false;
var achAutoTimeout = null;
var achCatFilter = 'all';
var achBodyOpen = false;


function checkAchievements(showNotification) {
  var data = computeAchievementData();
  var unlocked = loadUnlockedAchievements();
  var newlyUnlocked = [];

  ACHIEVEMENTS.forEach(function(ach) {
    if (unlocked[ach.id]) return; // already unlocked
    if (ach.check(data)) {
      unlocked[ach.id] = new Date().toISOString();
      newlyUnlocked.push(ach);
    }
  });

  if (newlyUnlocked.length) {
    saveUnlockedAchievements(unlocked);
    if (showNotification) showAchievementUnlock(newlyUnlocked);
  }
  return unlocked;
}

function computeAchievementData() {
  var w = state.workouts;
  var s = computeGymStats() || {count:0,totalTime:0,totalTonnage:0,totalSets:0,totalReps:0,maxStreak:0};
  var streaks = computeStreaks();

  // Big lifts
  var bigLifts = {bench:0, squat:0, deadlift:0, ohp:0};
  var bigKws = {
    bench:    ['bench press','wyciskanie sztangi na ławce','wyciskanie sztangi (bench'],
    squat:    ['przysiad ze sztangą','back squat','squat (squat)','przysiad (squat)'],
    deadlift: ['martwy ciąg klasyczny','deadlift','martwy ciąg (deadlift'],
    ohp:      ['wyciskanie żołnierskie','ohp','military press','overhead press','wyciskanie militarne']
  };
  w.forEach(function(wo) {
    (wo.exercises||[]).forEach(function(ex) {
      var nm = (ex.name||'').toLowerCase();
      Object.keys(bigKws).forEach(function(k) {
        if (bigKws[k].some(function(kw){return nm.indexOf(kw)!==-1;})) {
          (ex.sets||[]).forEach(function(st) {
            if (st.done) bigLifts[k] = Math.max(bigLifts[k], parseFloat(st.weight)||0);
          });
        }
      });
    });
  });

  // Muscle first workout & counts
  var muscleFirst = {}, muscleCounts = {};
  var muscleDates = {};
  w.forEach(function(wo) {
    var woMuscles = new Set();
    (wo.exercises||[]).forEach(function(ex) {
      var def = getAllExercises().find(function(e){return e.id===ex.id;});
      if (!def || !ex.completedSets) return;
      woMuscles.add(def.muscle);
    });
    woMuscles.forEach(function(m) {
      if (!muscleDates[m]) muscleDates[m] = new Date(wo.date);
      muscleCounts[m] = (muscleCounts[m]||0) + 1;
    });
  });
  Object.keys(muscleDates).forEach(function(m){ muscleFirst[m] = true; });

  // Goals completed
  var goalsCompleted = (state.goals||[]).filter(function(g){return g.completed;}).length;

  // Consistency
  var consistency = computeConsistency();

  // Avg fatigue
  var mf = calcMuscleFatigue();
  var fvals = Object.values(mf);
  var avgFatigue = fvals.length ? fvals.reduce(function(a,b){return a+b;},0)/fvals.length : 0;

  // Secret checks
  var lateNight = w.some(function(wo){return new Date(wo.date).getHours()>=23;});
  var earlyBird = w.some(function(wo){return new Date(wo.date).getHours()<6;});
  var shortRest = w.some(function(wo){return wo.avgRest>0 && wo.avgRest<30 && wo.totalSets>=5;});
  var marathon  = w.some(function(wo){return (wo.duration||0)>=7200;});
  var mondayCount = w.filter(function(wo){return new Date(wo.date).getDay()===1;}).length;

  return {
    workouts:  s.count,
    hours:     s.totalTime/3600,
    tonnage:   s.totalTonnage,
    sets:      s.totalSets,
    reps:      s.totalReps,
    maxStreak: streaks.max,
    bench:     bigLifts.bench,
    squat:     bigLifts.squat,
    deadlift:  bigLifts.deadlift,
    ohp:       bigLifts.ohp,
    muscleFirst: muscleFirst,
    muscleCounts: muscleCounts,
    goalsCompleted: goalsCompleted,
    consistency: consistency,
    avgFatigue: avgFatigue,
    lateNight: lateNight,
    earlyBird: earlyBird,
    shortRest: shortRest,
    marathon:  marathon,
    mondayCount: mondayCount,
  };
}

function showAchievementUnlock(achs) {
  achUnlockQueue = achUnlockQueue.concat(achs);
  if (!achUnlockShowing) processAchUnlockQueue();
}

function skipAchCelebration() {
  if (!achUnlockShowing) return;
  clearTimeout(achAutoTimeout);
  var cel = document.getElementById('ach-celebration');
  cel.style.display = 'none';
  achUnlockShowing = false;
  setTimeout(processAchUnlockQueue, 200);
}

// Helper: renderuje ikonę osiągnięcia — emoji lub PNG
function renderAchIcon(icon, locked) {
  if (!icon) return '🏅';
  if (icon.startsWith('img:')) {
    var src = icon.slice(4);
    var style = locked ? 'width:36px;height:36px;object-fit:contain;opacity:.35;filter:grayscale(1);' : 'width:36px;height:36px;object-fit:contain;';
    return '<img src="' + src + '" style="' + style + '" loading="lazy">';
  }
  return icon;
}

function processAchUnlockQueue() {
  if (!achUnlockQueue.length) { achUnlockShowing = false; return; }
  achUnlockShowing = true;
  var ach = achUnlockQueue.shift();
  var cel = document.getElementById('ach-celebration');
  var iconEl = document.getElementById('ach-cel-icon');
  if (ach.icon && ach.icon.startsWith('img:')) {
    iconEl.innerHTML = '<img src="' + ach.icon.slice(4) + '" style="width:48px;height:48px;object-fit:contain;">';
  } else {
    iconEl.textContent = ach.icon;
  }
  document.getElementById('ach-cel-name').textContent = ach.name;
  document.getElementById('ach-cel-desc').textContent = ach.desc;
  var qEl = document.getElementById('ach-cel-queue');
  if (qEl) qEl.textContent = achUnlockQueue.length > 0 ? 'Dotknij, aby pominąć · jeszcze ' + achUnlockQueue.length : 'Dotknij, aby pominąć';
  cel.style.display = 'flex';
  if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
  achAutoTimeout = setTimeout(function() {
    cel.style.display = 'none';
    achUnlockShowing = false;
    setTimeout(processAchUnlockQueue, 300);
  }, 2600);
}

function setAchCat(cat, el) {
  achCatFilter = cat;
  document.querySelectorAll('#ach-cat-chips .prog-tab').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  renderAchievements();
}

function toggleAchievements() {
  achBodyOpen = !achBodyOpen;
  document.getElementById('ach-body').style.display = achBodyOpen ? 'block' : 'none';
  document.getElementById('ach-chevron').style.transform = achBodyOpen ? 'rotate(90deg)' : '';
  if (achBodyOpen) renderAchievements();
}

function renderAchievements() {
  var data = computeAchievementData();
  var unlocked = checkAchievements(false);

  var total = ACHIEVEMENTS.length;
  var done = Object.keys(unlocked).length;
  var pct = Math.round(done/total*100);

  document.getElementById('ach-summary-badge').textContent = done+'/'+total;
  document.getElementById('ach-count-label').textContent = done+' / '+total+' osiągnięć';
  document.getElementById('ach-pct-label').textContent = pct+'%';
  document.getElementById('ach-progress-fill').style.width = pct+'%';

  var list = ACHIEVEMENTS.filter(function(a) {
    if (achCatFilter === 'all') return true;
    return a.cat === achCatFilter;
  });

  // Sort: unlocked first (by date), then locked
  list.sort(function(a,b) {
    var au = unlocked[a.id], bu = unlocked[b.id];
    if (au && bu) return new Date(bu)-new Date(au);
    if (au) return -1;
    if (bu) return 1;
    return 0;
  });

  // Group by category
  var cats = {
    start:'🚀 Start', streak:'🔥 Regularność', strength:'🏋️ Siła',
    volume:'📈 Objętość', sets:'💪 Serie', reps:'🔁 Powtórzenia',
    time:'⏱️ Czas', muscle:'🦵 Partie', goals:'🎯 Cele',
    gymdna:'🧬 GymDNA', secret:'⭐ Sekretne'
  };

  var html = '';
  var lastCat = null;

  list.forEach(function(ach) {
    var isUnlocked = !!unlocked[ach.id];
    var isSecret = ach.secret && !isUnlocked;

    if (achCatFilter === 'all' && ach.cat !== lastCat) {
      html += '<div class="ach-cat-header">'+(cats[ach.cat]||ach.cat)+'</div>';
      lastCat = ach.cat;
    }

    var prog = getAchProgress(ach, data);
    var showBar = ach.max > 1 && !isUnlocked;
    var barPct = Math.round(prog/ach.max*100);
    var unlockedDate = unlocked[ach.id] ? new Date(unlocked[ach.id]).toLocaleDateString('pl',{day:'numeric',month:'short',year:'numeric'}) : '';

    html += '<div class="ach-card">';
    // Icon
    html += '<div class="ach-icon-wrap '+(isUnlocked?'unlocked':'locked')+(isSecret?' secret':'')+'">';
    html += isSecret ? '🔒' : renderAchIcon(ach.icon, !isUnlocked);
    html += '</div>';
    // Info
    html += '<div class="ach-info">';
    if (isSecret) {
      html += '<div class="ach-name locked">???</div>';
      html += '<div class="ach-desc">Sekretne osiągnięcie — odblokuj, aby zobaczyć opis</div>';
    } else {
      html += '<div class="ach-name'+(isUnlocked?'':' locked')+'">'+ach.name+'</div>';
      html += '<div class="ach-desc">'+ach.desc+'</div>';
      if (showBar) {
        var progDisplay = ach.cat==='time' ? prog.toFixed(1)+' / '+ach.max+' godz.' :
                          ach.cat==='volume' ? prog.toLocaleString('pl')+' / '+ach.max.toLocaleString('pl')+' kg' :
                          prog+' / '+ach.max;
        html += '<div class="ach-progress-mini"><div class="ach-progress-fill" style="width:'+barPct+'%"></div></div>';
        html += '<div class="ach-progress-txt">'+progDisplay+'</div>';
      }
      if (isUnlocked) html += '<div class="ach-date">🏅 Odblokowano '+unlockedDate+'</div>';
    }
    html += '</div>';
    // Badge
    html += '<div class="ach-badge '+(isUnlocked?'unlocked':'locked')+'">'+(isUnlocked?'🏅':'🔒')+'</div>';
    html += '</div>';
  });

  document.getElementById('ach-list').innerHTML = html || '<div style="color:var(--text4);font-size:13px;padding:12px 0;">Brak osiągnięć w tej kategorii.</div>';
}

function getAchProgress(ach, data) {
  if (ach.cat === 'start')    return Math.min(data.workouts, ach.max);
  if (ach.cat === 'streak')   return Math.min(data.maxStreak, ach.max);
  if (ach.cat === 'volume')   return Math.min(data.tonnage, ach.max);
  if (ach.cat === 'sets')     return Math.min(data.sets, ach.max);
  if (ach.cat === 'reps')     return Math.min(data.reps, ach.max);
  if (ach.cat === 'time')     return Math.min(data.hours, ach.max);
  if (ach.cat === 'strength') {
    if (ach.id.startsWith('b'))  return Math.min(data.bench, ach.max);
    if (ach.id.startsWith('sq')) return Math.min(data.squat, ach.max);
    if (ach.id.startsWith('dl')) return Math.min(data.deadlift, ach.max);
    if (ach.id.startsWith('o'))  return Math.min(data.ohp, ach.max);
  }
  if (ach.cat === 'muscle') {
    if (ach.id.startsWith('m100')) {
      var muscle = ach.id==='m100legs'?'Nogi':ach.id==='m100back'?'Plecy':'Klatka';
      return Math.min(data.muscleCounts[muscle]||0, ach.max);
    }
    return ach.check(data) ? 1 : 0;
  }
  if (ach.cat === 'goals')  return Math.min(data.goalsCompleted, ach.max);
  if (ach.cat === 'gymdna' && ach.id==='dna2') return Math.min(data.consistency, ach.max);
  return ach.check(data) ? ach.max : 0;
}

