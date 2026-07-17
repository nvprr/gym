// ===================== EXERCISE_DETAIL.JS =====================
// Szczegóły ćwiczenia + Analiza planu

// ── Opisy ćwiczeń (baza wiedzy) ──
var EX_DESCRIPTIONS = {
  // Klatka
  'e1':  { desc:'Połóż się na ławce poziomej, chwyć sztangę na szerokość ramion. Opuść do klatki, wciśnij mocno w górę. Trzymaj łopatki ściągnięte przez cały ruch.', tips:['Trzymaj stopy płasko na podłodze','Nie odbijaj sztangi od klatki','Kontroluj fazę ekscentryczną'], mistakes:['Zbyt szerokie rozstawienie łokci','Wygięcie nadgarstków','Unoszenie bioder z ławki'] },
  'e4':  { desc:'Przyjmij pozycję deski, dłonie na szerokość barków. Zegnij łokcie i opuść klatkę do ziemi, następnie wypchnij w górę. Core napięty przez cały czas.', tips:['Utrzymuj prostą linię ciała','Wciągaj brzuch','Pełny zakres ruchu'], mistakes:['Opuszczanie bioder','Zbyt szybkie tempo','Niepełny wyprost łokci'] },
  // Plecy
  'e7':  { desc:'Chwyć drążek nachwytem na szerokość barków. Podciągnij się do momentu gdy broda przekroczy drążek, kontrolowanie opuść się. Łopatki ściągnięte przy podciąganiu.', tips:['Inicjuj ruch od łopatek','Nie kiwaj tułowiem','Pełny wyprost na dole'], mistakes:['Kiwanie się','Zbyt wąski chwyt','Brak kontroli przy opuszczaniu'] },
  'e8':  { desc:'Stań w skłonie 45°, chwyć sztangę podchwytem. Przyciągnij do brzucha, ściskając łopatki. Kontrolowanie opuść.', tips:['Utrzymuj neutralny kręgosłup','Przyciągaj łokcie blisko ciała','Ściągaj łopatki w końcowej fazie'], mistakes:['Zaokrąglone plecy','Zbyt duży ciężar','Ruch ramionami zamiast łopatkami'] },
  // Barki
  'e30': { desc:'Stań w lekkim rozkroku, chwyć hantle. Unieś boczne ramiona do poziomu barków, łokcie lekko ugięte. Kontrolowane opuszczanie.', tips:['Nie wzruszaj barkami','Lekkie ugięcie łokci','Zatrzymaj na poziomie barków'], mistakes:['Unoszenie ramion zbyt wysoko','Używanie rozmachu','Zbyt szybkie opuszczanie'] },
  // Biceps
  'e40': { desc:'Stań prosto, chwyć hantle podchwytem. Ugnij łokcie i unieś hantle do barków, ściskając biceps. Powoli opuść.', tips:['Trzymaj łokcie przy tułowiu','Pełny zakres ruchu','Nie kiwaj tułowiem'], mistakes:['Kiwanie ciałem','Zbyt szybki ruch ekscentryczny','Łokcie odrywają się od tułowia'] },
  // Triceps
  'e50': { desc:'Stań przy wyciągu górnym, chwyć uchwyt. Wyprostuj łokcie, dociskając drążek w dół. Górna część ramienia nieruchoma.', tips:['Stabilne łokcie przy tułowiu','Pełny wyprost','Powoli wracaj do góry'], mistakes:['Ruszanie łokciami','Zbyt duży ciężar','Brak pełnego wyprostu'] },
  // Nogi
  'e60': { desc:'Stań w rozkroku na szerokość barków, stopy lekko skierowane na zewnątrz. Zegnij kolana i opuść biodra do poziomu ud, następnie wstań. Core napięty.', tips:['Kolana idą w kierunku palców','Pięty na podłodze','Wciągaj brzuch'], mistakes:['Kolana do środka','Zaokrąglone plecy','Zbyt płytkie przysiady'] },
};

// ── Mapa muscle keys → polskie nazwy ──
var MUSCLE_LABELS = {
  chest:         'Klatka piersiowa',
  lats:          'Najszerszy grzbiet',
  upperBack:     'Górne plecy',
  lowerBack:     'Dolne plecy',
  traps:         'Czworoboczny',
  frontShoulder: 'Barki przednie',
  midShoulder:   'Barki boczne',
  rearShoulder:  'Barki tylne',
  biceps:        'Biceps',
  triceps:       'Triceps',
  forearms:      'Przedramiona',
  abs:           'Brzuch / Core',
  quads:         'Czworogłowe uda',
  hamstrings:    'Dwugłowe uda',
  glutes:        'Pośladki',
  calves:        'Łydki',
};

// Display order for muscle bars (most important first)
var MUSCLE_DISPLAY_ORDER = [
  'chest','lats','quads','glutes','hamstrings',
  'frontShoulder','midShoulder','rearShoulder',
  'triceps','biceps','traps','lowerBack','abs',
  'calves','forearms',
];

var LEVEL_BADGES = {
  'łatwy':        { emoji:'🟢', label:'Łatwe' },
  'średni':       { emoji:'🟡', label:'Średnie' },
  'zaawansowany': { emoji:'🔴', label:'Trudne' },
};

// ── Pobierz historię ćwiczenia ──
function getExerciseHistory(exId) {
  var history = [];
  state.workouts.forEach(function(w) {
    (w.exercises||[]).forEach(function(ex) {
      if (ex.id !== exId) return;
      var doneSets = (ex.sets||[]).filter(function(s){ return s.done; });
      if (!doneSets.length) return;
      var maxW = Math.max.apply(null, doneSets.map(function(s){ return parseFloat(s.weight)||0; }));
      var maxR = Math.max.apply(null, doneSets.map(function(s){ return parseInt(s.reps)||0; }));
      var e1rm = maxW * (1 + maxR/30);
      history.push({ date: w.date, sets: doneSets.length, maxWeight: maxW, maxReps: maxR, e1rm: e1rm });
    });
  });
  history.sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
  return history;
}

// ── Otwórz szczegóły ćwiczenia ──
function openExerciseDetail(exId) {
  var exDef = getAllExercises().find(function(e){ return e.id===exId; });
  if (!exDef) return;

  var sheet = document.getElementById('exercise-detail-sheet');
  if (!sheet) return;

  var history = getExerciseHistory(exId);
  var info = EX_DESCRIPTIONS[exId] || {};
  var levelBadge = LEVEL_BADGES[exDef.level] || { emoji:'🟡', label:'Średnie' };

  // Header
  document.getElementById('exd-name').textContent = exDef.name;

  // Content
  var html = '';

  // ── Level + muscle ──
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">';
  html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">'+levelBadge.emoji+' '+levelBadge.label+'</span>';
  html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">💪 '+exDef.muscle+'</span>';
  if (exDef.category) html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">🔧 '+exDef.category+'</span>';
  html += '</div>';

  // ── Muscles map ──
  if (exDef.muscles && Object.keys(exDef.muscles).length) {
    html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    html += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;">🦵 Zaangażowanie mięśni</div>';
    // Sort by involvement
    var muscleEntries = Object.entries(exDef.muscles).sort(function(a,b){ return b[1]-a[1]; });
    muscleEntries.forEach(function(entry) {
      var key = entry[0], val = entry[1];
      var label = MUSCLE_LABELS[key] || key;
      html += '<div style="margin-bottom:8px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">';
      html += '<span style="color:var(--text2);">'+label+'</span>';
      html += '<span style="color:var(--accent);font-weight:700;">'+val+'%</span>';
      html += '</div>';
      html += '<div style="background:var(--surface2);border-radius:4px;height:6px;overflow:hidden;">';
      html += '<div style="width:'+val+'%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;"></div>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  // ── Description ──
  if (info.desc) {
    html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    html += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">📋 Jak wykonać</div>';
    html += '<div style="font-size:13px;color:var(--text2);line-height:1.6;">'+info.desc+'</div>';
    if (info.tips && info.tips.length) {
      html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">✅ Wskazówki</div>';
      info.tips.forEach(function(t){ html += '<div style="font-size:13px;color:var(--text2);padding:2px 0;">• '+t+'</div>'; });
    }
    if (info.mistakes && info.mistakes.length) {
      html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">⚠️ Częste błędy</div>';
      info.mistakes.forEach(function(m){ html += '<div style="font-size:13px;color:var(--text3);padding:2px 0;">• '+m+'</div>'; });
    }
    html += '</div>';
  }

  // ── Personal Records ──
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;">🏆 Twoje rekordy</div>';
  if (!history.length) {
    html += '<div style="font-size:13px;color:var(--text4);">Brak historii wykonania.</div>';
  } else {
    var bestW = Math.max.apply(null, history.map(function(h){ return h.maxWeight; }));
    var bestR = Math.max.apply(null, history.map(function(h){ return h.maxReps; }));
    var bestE1RM = Math.max.apply(null, history.map(function(h){ return h.e1rm; }));
    var totalSets = history.reduce(function(a,h){ return a+h.sets; }, 0);
    var last = history[0];
    var recs = [
      { icon:'⚖️', label:'Największy ciężar', val: bestW+'kg' },
      { icon:'🔁', label:'Najwięcej powtórzeń', val: bestR+' powt.' },
      { icon:'🏋️', label:'Szacowany 1RM', val: Math.round(bestE1RM)+'kg' },
      { icon:'📊', label:'Łączna liczba serii', val: totalSets+' serii' },
      { icon:'📅', label:'Ostatnio', val: new Date(last.date).toLocaleDateString('pl')+' · '+last.maxWeight+'kg×'+last.maxReps },
    ];
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    recs.forEach(function(r) {
      html += '<div style="background:var(--surface2);border-radius:12px;padding:10px 12px;">';
      html += '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+r.icon+' '+r.label+'</div>';
      html += '<div style="font-size:14px;font-weight:700;">'+r.val+'</div>';
      html += '</div>';
    });
    html += '</div>';

    // Last 5 sessions
    html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">📈 Ostatnie sesje</div>';
    history.slice(0,5).forEach(function(h) {
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:.5px solid var(--border2);font-size:13px;">';
      html += '<span style="color:var(--text3);">'+new Date(h.date).toLocaleDateString('pl')+'</span>';
      html += '<span style="font-weight:600;">'+h.maxWeight+'kg × '+h.maxReps+' · '+h.sets+' serii</span>';
      html += '</div>';
    });
  }
  html += '</div>';

  // ── Future slots ──
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;border:1px dashed var(--border2);opacity:.6;">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:4px;">🔮 Wkrótce</div>';
  html += '<div style="font-size:12px;color:var(--text4);">GIF instruktażowy · Film · Wskazówki AI · Analiza słabych punktów</div>';
  html += '</div>';

  // ── YouTube ──
  var ytQuery = encodeURIComponent(exDef.name.replace(/\s*\([^)]+\)/g, '').trim());
  html += '<a href="https://www.youtube.com/results?search_query='+ytQuery+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#FF0000;color:#fff;border-radius:12px;padding:14px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:16px;">🎥 Jak wykonać ćwiczenie</a>';

  document.getElementById('exd-content').innerHTML = html;
  sheet.classList.add('open');
}

function closeExerciseDetail() {
  var sheet = document.getElementById('exercise-detail-sheet');
  if (sheet) sheet.classList.remove('open');
}

// ── Analiza planu ──
var MUSCLE_GROUPS_MAP = {
  chest:         'Klatka piersiowa',
  lats:          'Najszerszy grzbiet',
  upperBack:     'Górne plecy',
  lowerBack:     'Dolne plecy',
  traps:         'Czworoboczny',
  frontShoulder: 'Barki przednie',
  midShoulder:   'Barki boczne',
  rearShoulder:  'Barki tylne',
  biceps:        'Biceps',
  triceps:       'Triceps',
  forearms:      'Przedramiona',
  abs:           'Brzuch / Core',
  quads:         'Czworogłowe uda',
  hamstrings:    'Dwugłowe uda',
  glutes:        'Pośladki',
  calves:        'Łydki',
};

function analyzePlan(plan) {
  var muscleVolume = {};   // weighted sets per muscle
  var muscleSets = {};     // raw set count per muscle key
  var totalSets = 0;
  var totalExercises = 0;

  (plan.exercises||[]).forEach(function(ex) {
    var sets = parseInt(ex.sets)||3;
    totalSets += sets;
    totalExercises++;

    var exDef = getAllExercises().find(function(e){ return e.id===ex.id; });
    if (!exDef || !exDef.muscles) return;

    Object.keys(exDef.muscles).forEach(function(key) {
      var pct = exDef.muscles[key];
      // Only count muscles with >= 40% involvement as "real" volume
      if (pct >= 40) {
        var contribution = sets * (pct / 100);
        muscleVolume[key] = (muscleVolume[key]||0) + contribution;
        muscleSets[key] = (muscleSets[key]||0) + sets;
      }
    });
  });

  // Sort muscles by display order, then by volume
  var allKeys = Object.keys(muscleVolume);
  allKeys.sort(function(a, b) {
    var oa = MUSCLE_DISPLAY_ORDER ? MUSCLE_DISPLAY_ORDER.indexOf(a) : 99;
    var ob = MUSCLE_DISPLAY_ORDER ? MUSCLE_DISPLAY_ORDER.indexOf(b) : 99;
    if (oa === -1) oa = 99;
    if (ob === -1) ob = 99;
    if (oa !== ob) return oa - ob;
    return (muscleVolume[b]||0) - (muscleVolume[a]||0);
  });

  var sorted = allKeys.map(function(key) {
    return {
      key: key,
      label: MUSCLE_LABELS[key] || MUSCLE_GROUPS_MAP[key] || key,
      volume: Math.round(muscleVolume[key] * 10) / 10,
      sets: muscleSets[key] || 0,
      pct: totalSets > 0 ? Math.round(muscleVolume[key] / totalSets * 100) : 0,
    };
  });

  // ── Detect issues ──
  var warnings = [];

  var chest  = muscleVolume['chest']  || 0;
  var lats   = muscleVolume['lats']   || 0;
  var quads  = muscleVolume['quads']  || 0;
  var hams   = muscleVolume['hamstrings'] || 0;
  var glutes = muscleVolume['glutes'] || 0;
  var rearS  = muscleVolume['rearShoulder'] || 0;
  var frontS = muscleVolume['frontShoulder'] || 0;
  var abs    = muscleVolume['abs']    || 0;

  // Push/Pull balance
  var push = chest + frontS + (muscleVolume['triceps']||0);
  var pull = lats + (muscleVolume['traps']||0) + (muscleVolume['biceps']||0);
  if (push > 0 && pull > 0 && push > pull * 1.6)
    warnings.push('⚠️ Push (klatka/barki) dominuje nad Pull (plecy) — ryzyko dysbalansu ramion.');
  if (pull > 0 && push > 0 && pull > push * 1.6)
    warnings.push('⚠️ Pull (plecy) dominuje nad Push — sprawdź czy to zamierzone.');

  // Quad/Ham balance
  if (quads > 0 && hams > 0 && quads > hams * 2.5)
    warnings.push('⚠️ Czworogłowe mają znacznie większą objętość niż dwugłowe uda.');
  if (quads > 0 && glutes > 0 && quads > glutes * 2)
    warnings.push('⚠️ Dominacja czworogłowych — rozważ więcej ćwiczeń biodrowych (hip thrust, RDL).');

  // Rear delt check
  if (frontS > 0 && rearS < frontS * 0.4)
    warnings.push('⚠️ Tylny akton barków słabo zaangażowany — dodaj facepull lub wznosy w opadzie.');

  // Missing major groups (ignore minor accessories)
  var majorGroups = {
    chest: 'Klatka piersiowa',
    lats: 'Najszerszy grzbiet (plecy)',
    quads: 'Czworogłowe uda',
    glutes: 'Pośladki',
    abs: 'Brzuch / Core',
  };
  Object.keys(majorGroups).forEach(function(key) {
    if (!muscleVolume[key] || muscleVolume[key] < 0.5) {
      warnings.push('⚠️ Brak ćwiczeń angażujących: ' + majorGroups[key] + '.');
    }
  });

  // Low volume warnings
  if (abs > 0 && abs < 1.5) warnings.push('⚠️ Bardzo mało objętości na brzuch.');
  if (rearS === 0 && (chest > 2 || frontS > 2))
    warnings.push('⚠️ Brak ćwiczeń na tylny bark — kluczowe przy dużej ilości wyciskań.');

  if (!warnings.length) warnings.push('✅ Plan jest dobrze zbilansowany.');

  return {
    totalExercises: totalExercises,
    totalSets: totalSets,
    muscles: sorted,
    warnings: warnings,
  };
}

function showPlanAnalysis(planId) {
  var plan = state.plans.find(function(p){ return p.id===planId; });
  if (!plan) return;

  var analysis = analyzePlan(plan);
  var sheet = document.getElementById('plan-analysis-sheet');
  if (!sheet) return;

  document.getElementById('pa-title').textContent = plan.name;

  var html = '';

  // Summary
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">';
  html += '<div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center;">';
  html += '<div style="font-size:24px;font-weight:800;color:var(--accent);">'+analysis.totalExercises+'</div>';
  html += '<div style="font-size:12px;color:var(--text3);">ćwiczeń</div></div>';
  html += '<div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center;">';
  html += '<div style="font-size:24px;font-weight:800;color:var(--accent);">'+analysis.totalSets+'</div>';
  html += '<div style="font-size:12px;color:var(--text3);">serii łącznie</div></div>';
  html += '</div>';

  // Warnings
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">🔍 Analiza bilansu</div>';
  analysis.warnings.forEach(function(w) {
    var isOk = w.startsWith('✅');
    html += '<div style="font-size:13px;padding:4px 0;color:'+(isOk?'var(--green)':'var(--yellow)')+';">'+w+'</div>';
  });
  html += '</div>';

  // Muscle volume
  html += '<div class="card" style="padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;">💪 Objętość na partie</div>';
  if (!analysis.muscles.length) {
    html += '<div style="font-size:13px;color:var(--text4);">Brak danych — przypisz ćwiczenia do planu.</div>';
  } else {
    var maxVol = Math.max.apply(null, analysis.muscles.map(function(m){ return m.volume; }));
    analysis.muscles.filter(function(m){ return m.volume > 0; }).forEach(function(m) {
      var barPct = maxVol > 0 ? Math.round(m.volume/maxVol*100) : 0;
      html += '<div style="margin-bottom:10px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">';
      html += '<span style="color:var(--text2);font-weight:600;">'+m.label+'</span>';
      html += '<span style="color:var(--text3);">'+(m.sets||Math.round(m.volume))+' serii · '+m.pct+'%</span>';
      html += '</div>';
      html += '<div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;">';
      html += '<div style="width:'+barPct+'%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;"></div>';
      html += '</div></div>';
    });
  }
  html += '</div>';

  document.getElementById('pa-content').innerHTML = html;
  sheet.classList.add('open');
}

// ── Remove exercise from active workout ──
function removeExFromWorkout(ei) {
  if (!confirm('Usunąć to ćwiczenie z bieżącego treningu?')) return;
  workoutState.exercises.splice(ei, 1);
  // Recalculate totals
  workoutState.totalSets = workoutState.exercises.reduce(function(a,ex){ return a+(ex.sets||[]).filter(function(s){return s.done;}).length; }, 0);
  workoutState.totalTonnage = workoutState.exercises.reduce(function(a,ex){ return a+(ex.sets||[]).filter(function(s){return s.done;}).reduce(function(b,s){return b+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);},0); }, 0);
  renderTrainingView();
  showNotif('🗑','Ćwiczenie usunięte','');
}
