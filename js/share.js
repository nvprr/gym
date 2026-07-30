// ===================== SHARE.JS =====================
// GymFlow Share Studio — generowanie grafik PNG do udostępnienia po treningu.
// Zero screenshotów: wszystko rysowane od podstaw na <canvas>. Zero zewnętrznych
// bibliotek/API (zgodnie z filozofią GymFlow: zero frameworków, zero zewn. API).
//
// Architektura (żeby dodawanie kolejnych szablonów nie wymagało przebudowy):
//   SHARE_TEMPLATES  — rejestr szablonów: { key, icon, label, sub, available(ctx), draw(g,w,h,theme,ctx) }
//   SHARE_THEMES     — rejestr motywów kolorystycznych (Dark Minimal / Dark Neon / AMOLED Black)
//   SHARE_FORMATS    — rejestr formatów eksportu (Story / Post / Square)
// Dodanie nowego szablonu = dopisanie jednego obiektu do SHARE_TEMPLATES + jedna
// funkcja draw(). Nic innego w tym pliku nie trzeba ruszać.
//
// Dane czerpane WYŁĄCZNIE z istniejących funkcji (computeAllRecords, computeGymStats,
// ACHIEVEMENTS, findLastWorkoutBySameVariant z js/workout.js) — bez duplikowania logiki.

// ── Rejestr motywów ──
var SHARE_THEMES = {
  dark_minimal: {
    key:'dark_minimal', label:'Dark Minimal',
    bg:'#1c1c1c', bg2:'#141414', surface:'#242424', surface2:'#2e2e2e',
    accent:'#ffb753', accent2:'#ff8c00', text:'#ffffff',
    text2:'rgba(255,255,255,.72)', text3:'rgba(255,255,255,.45)', glow:false
  },
  dark_neon: {
    key:'dark_neon', label:'Dark Neon',
    bg:'#0b0b16', bg2:'#07070f', surface:'#161625', surface2:'#1e1e33',
    accent:'#ff2d95', accent2:'#7b2ff7', text:'#ffffff',
    text2:'rgba(255,255,255,.75)', text3:'rgba(255,255,255,.48)', glow:true
  },
  amoled_black: {
    key:'amoled_black', label:'AMOLED Black',
    bg:'#000000', bg2:'#000000', surface:'#111111', surface2:'#1a1a1a',
    accent:'#ffb753', accent2:'#ff8c00', text:'#ffffff',
    text2:'rgba(255,255,255,.7)', text3:'rgba(255,255,255,.42)', glow:false
  },
};

// ── Rejestr formatów eksportu ──
var SHARE_FORMATS = {
  story:  { key:'story',  label:'Instagram Story', w:1080, h:1920 },
  post:   { key:'post',   label:'Instagram Post',  w:1080, h:1350 },
  square: { key:'square', label:'Square',          w:1080, h:1080 },
};

// ── Stan modułu ──
var _shareState = {
  theme:'dark_minimal', format:'story', templateKey:'summary',
  ctx:null,          // wynik buildShareContext() — dane bieżącego treningu
  achIdx:0,          // indeks slajdu w slajderze osiągnięć
};

var _shareLogoImg = null;
var _shareLogoLoaded = false;
(function preloadShareLogo(){
  try {
    var img = new Image();
    img.onload = function(){ _shareLogoLoaded = true; if(_shareState.ctx) renderShareCanvas(); };
    img.src = 'icons/icon-192.png';
    _shareLogoImg = img;
  } catch(e) {}
})();

// ===================== WEJŚCIE DO MODUŁU =====================

// Wołane z przycisku "📤 Udostępnij" w summary-sheet (po zakończeniu treningu,
// przed zapisem — dane liczone są z żywej sesji workoutState, patrz buildShareContext).
function openShareStudio(){
  _shareState.ctx = buildShareContext(workoutState, true);
  _shareState.achIdx = 0;
  var available = SHARE_TEMPLATES.filter(function(t){ return t.available(_shareState.ctx); });
  _shareState.templateKey = available.length ? available[0].key : SHARE_TEMPLATES[0].key;
  renderShareStudioUI();
  openSheet('share-studio-sheet');
}

// ===================== ZBIERANIE DANYCH =====================

// Buduje spójny obiekt danych karty na podstawie treningu — działa zarówno dla
// żywej sesji (workoutState, isLive=true) jak i już zapisanego treningu z
// state.workouts (isLive=false) — dzięki temu w przyszłości łatwo dodać "Udostępnij"
// też np. z historii treningów, bez zmian w reszcie modułu.
function buildShareContext(workout, isLive){
  var exercises = (workout.exercises||[]).map(function(ex){
    var doneSets = (ex.sets||[]).filter(function(s){ return s.done; });
    return { id:ex.id, name:ex.name, doneSets:doneSets };
  }).filter(function(ex){ return ex.doneSets.length>0; });

  var totalSets = exercises.reduce(function(a,ex){ return a+ex.doneSets.length; },0);
  var totalReps = exercises.reduce(function(a,ex){ return a+ex.doneSets.reduce(function(s,st){ return s+(parseInt(st.reps)||0); },0); },0);
  var totalTonnage = exercises.reduce(function(a,ex){ return a+ex.doneSets.reduce(function(s,st){ return s+(parseFloat(st.weight)||0)*(parseInt(st.reps)||0); },0); },0);
  var duration = isLive ? (window._wData && window._wData.duration || 0) : (workout.duration||0);

  // Rekordy pobite w tej sesji — porównanie z computeAllRecords() (istniejące dane
  // sprzed tego treningu, bo dla żywej sesji workout jeszcze nie jest w state.workouts).
  var existingRecords = computeAllRecords();
  var newRecords = [];
  exercises.forEach(function(ex){
    var best = ex.doneSets.slice().sort(function(a,b){ return (parseFloat(b.weight)||0)-(parseFloat(a.weight)||0); })[0];
    var w2 = parseFloat(best.weight)||0;
    var prevRec = existingRecords[ex.id];
    if (w2>0 && (!prevRec || w2>prevRec.maxWeight)) {
      newRecords.push({ name:ex.name, weight:w2, reps:parseInt(best.reps)||0, prevWeight: prevRec?prevRec.maxWeight:0 });
    }
  });

  var workoutNumber = isLive ? state.workouts.length+1 : (state.workouts.findIndex(function(w){ return w.id===workout.id; })+1);

  var top3 = exercises.map(function(ex){
    var best = ex.doneSets.slice().sort(function(a,b){ return (parseFloat(b.weight)||0)-(parseFloat(a.weight)||0); })[0];
    var tonnage = ex.doneSets.reduce(function(s,st){ return s+(parseFloat(st.weight)||0)*(parseInt(st.reps)||0); },0);
    return { name:ex.name, weight:parseFloat(best.weight)||0, reps:parseInt(best.reps)||0, tonnage:tonnage };
  }).sort(function(a,b){ return b.tonnage-a.tonnage; }).slice(0,3);

  return {
    workout:workout, isLive:isLive,
    planName: workout.planName||'Trening', dayName: workout.dayName||'',
    date: isLive ? new Date() : new Date(workout.date),
    duration:duration, exCount:exercises.length,
    totalSets:totalSets, totalReps:totalReps, totalTonnage:totalTonnage,
    newRecords:newRecords, top3:top3, workoutNumber:workoutNumber,
    exercises:exercises,
  };
}

// Lekki adapter kształtu na potrzeby findWorkoutsBySameVariant/getWorkoutVariantLabel
// z js/workout.js — workoutState (sesja w trakcie) nie ma pól id/date jak zapisany
// trening, więc dokładamy je tymczasowo (nic w state.workouts się nie zmienia).
function _shareWorkoutMeta(shareCtx){
  if (!shareCtx.isLive) return shareCtx.workout;
  return {
    id: undefined, date: shareCtx.date.toISOString(),
    planId: shareCtx.workout.planId, planName: shareCtx.workout.planName, dayName: shareCtx.workout.dayName
  };
}

// Cel porównania dla Progress Card — reużywa TĘ SAMĄ logikę co ekran porównania
// treningów (js/workout.js: findLastWorkoutBySameVariant), zero duplikacji.
function getShareCompareTarget(shareCtx){
  return findLastWorkoutBySameVariant(_shareWorkoutMeta(shareCtx));
}

function computeShareProgressDiffs(shareCtx, prevWorkout){
  var diffs = [];
  shareCtx.exercises.forEach(function(ex){
    var prevEx = (prevWorkout.exercises||[]).find(function(e){ return e.id===ex.id; });
    if (!prevEx) return;
    var prevBest = (prevEx.sets||[]).filter(function(s){ return s.done; }).sort(function(a,b){ return (parseFloat(b.weight)||0)-(parseFloat(a.weight)||0); })[0];
    if (!prevBest) return;
    var curBest = ex.doneSets.slice().sort(function(a,b){ return (parseFloat(b.weight)||0)-(parseFloat(a.weight)||0); })[0];
    var prevW=parseFloat(prevBest.weight)||0, curW=parseFloat(curBest.weight)||0;
    var prevR=parseInt(prevBest.reps)||0, curR=parseInt(curBest.reps)||0;
    if (curW===prevW && curR===prevR) return;
    diffs.push({ name:ex.name, prevWeight:prevW, curWeight:curW, prevReps:prevR, curReps:curR, up: curW>prevW || (curW===prevW && curR>prevR) });
  });
  return diffs.sort(function(a,b){ return (b.curWeight-b.prevWeight)-(a.curWeight-a.prevWeight); });
}

// Osiągnięcia odblokowane DOKŁADNIE tym treningiem — symulacja "przed/po" przez
// tymczasowe podmienienie state.workouts (przywracane od razu, zero trwałych
// skutków ubocznych) i wywołanie ISTNIEJĄCEJ computeAchievementData()/ACHIEVEMENTS
// — bez przepisywania logiki wykrywania osiągnięć (bench/squat/deadlift itd.).
function getShareAchievements(shareCtx){
  if (!shareCtx.isLive) return [];
  var unlocked = (typeof loadUnlockedAchievements==='function') ? loadUnlockedAchievements() : {};
  var before = computeAchievementData();

  var pendingWorkout = {
    id:'__share_preview__', date: shareCtx.date.toISOString(),
    planName: shareCtx.planName, dayName: shareCtx.dayName,
    exercises: shareCtx.exercises.map(function(ex){ return { id:ex.id, name:ex.name, sets:ex.doneSets, completedSets:ex.doneSets.length }; }),
    duration: shareCtx.duration, tonnage: shareCtx.totalTonnage,
    totalSets: shareCtx.totalSets, totalReps: shareCtx.totalReps, avgRest:0,
  };

  var realWorkouts = state.workouts;
  state.workouts = realWorkouts.concat([pendingWorkout]);
  var after = computeAchievementData();
  state.workouts = realWorkouts; // przywrócenie oryginalnej referencji — bez trwałych zmian

  var newly = [];
  ACHIEVEMENTS.forEach(function(ach){
    if (unlocked[ach.id]) return;
    if (!ach.check(before) && ach.check(after)) newly.push(ach);
  });
  return newly;
}

// ===================== REJESTR SZABLONÓW =====================

var SHARE_TEMPLATES = [
  { key:'summary', icon:'🏋️', label:'Workout Summary', sub:'Pełne podsumowanie treningu',
    available: function(){ return true; }, draw: drawShareSummary },
  { key:'achievement', icon:'🏆', label:'Achievement Card', sub:'Karta osiągnięcia',
    available: function(ctx){ return getShareAchievements(ctx).length>0 || ctx.newRecords.length>0; }, draw: drawShareAchievement },
  { key:'progress', icon:'📈', label:'Progress Card', sub:'Porównanie z poprzednim treningiem',
    available: function(ctx){ var t=getShareCompareTarget(ctx); return !!t && computeShareProgressDiffs(ctx,t).length>0; }, draw: drawShareProgress },
  { key:'stats', icon:'💪', label:'Workout Stats', sub:'Minimalistyczna karta statystyk',
    available: function(){ return true; }, draw: drawShareStats },
];

// ===================== UI (sheet wyboru) =====================

function renderShareStudioUI(){
  var ctx = _shareState.ctx;
  var available = SHARE_TEMPLATES.filter(function(t){ return t.available(ctx); });
  if (available.indexOf(SHARE_TEMPLATES.find(function(t){ return t.key===_shareState.templateKey; })) === -1) {
    _shareState.templateKey = available.length ? available[0].key : SHARE_TEMPLATES[0].key;
  }

  var tplEl = document.getElementById('share-template-chips');
  if (tplEl) {
    tplEl.innerHTML = SHARE_TEMPLATES.map(function(t){
      var isAvailable = t.available(ctx);
      var active = t.key===_shareState.templateKey;
      return '<button class="ex-chip'+(active?' active':'')+'" style="'+(isAvailable?'':'opacity:.35;')+'" '
        + (isAvailable?('onclick="setShareTemplate(\''+t.key+'\')"'):'disabled')
        + '>'+t.icon+' '+t.label+'</button>';
    }).join('');
  }

  var themeEl = document.getElementById('share-theme-segment');
  if (themeEl) {
    themeEl.innerHTML = Object.keys(SHARE_THEMES).map(function(k){
      var th=SHARE_THEMES[k];
      return '<button class="segment-btn'+(k===_shareState.theme?' active':'')+'" onclick="setShareTheme(\''+k+'\')">'+th.label+'</button>';
    }).join('');
  }

  var fmtEl = document.getElementById('share-format-segment');
  if (fmtEl) {
    fmtEl.innerHTML = Object.keys(SHARE_FORMATS).map(function(k){
      var f=SHARE_FORMATS[k];
      return '<button class="segment-btn'+(k===_shareState.format?' active':'')+'" onclick="setShareFormat(\''+k+'\')">'+f.label+'</button>';
    }).join('');
  }

  var subEl = document.getElementById('share-template-sub');
  var activeTpl = SHARE_TEMPLATES.find(function(t){ return t.key===_shareState.templateKey; });
  if (subEl && activeTpl) subEl.textContent = activeTpl.sub;

  var sliderEl = document.getElementById('share-achievement-slider');
  if (sliderEl) {
    var achs = getShareAchievements(ctx);
    if (_shareState.templateKey==='achievement' && achs.length>1) {
      sliderEl.style.display='flex';
      sliderEl.innerHTML =
        '<button class="btn btn-secondary" style="padding:8px 14px;" onclick="shareAchievementNav(-1)">‹</button>'
        + '<div style="flex:1;text-align:center;font-size:12px;color:var(--text3);">Osiągnięcie '+(_shareState.achIdx+1)+' / '+achs.length+'</div>'
        + '<button class="btn btn-secondary" style="padding:8px 14px;" onclick="shareAchievementNav(1)">›</button>';
    } else {
      sliderEl.style.display='none';
    }
  }

  renderShareCanvas();
}

function setShareTemplate(key){ _shareState.templateKey=key; _shareState.achIdx=0; renderShareStudioUI(); }
function setShareTheme(key){ _shareState.theme=key; renderShareStudioUI(); }
function setShareFormat(key){ _shareState.format=key; renderShareStudioUI(); }
function shareAchievementNav(dir){
  var achs = getShareAchievements(_shareState.ctx);
  if (!achs.length) return;
  _shareState.achIdx = (_shareState.achIdx + dir + achs.length) % achs.length;
  renderShareStudioUI();
}

// ===================== RYSOWANIE (canvas) =====================

function renderShareCanvas(){
  var canvas = document.getElementById('share-canvas');
  if (!canvas) return;
  var fmt = SHARE_FORMATS[_shareState.format];
  var theme = SHARE_THEMES[_shareState.theme];
  canvas.width = fmt.w; canvas.height = fmt.h;
  var g = canvas.getContext('2d');
  g.clearRect(0,0,fmt.w,fmt.h);

  var tpl = SHARE_TEMPLATES.find(function(t){ return t.key===_shareState.templateKey; }) || SHARE_TEMPLATES[0];
  tpl.draw(g, fmt.w, fmt.h, theme, _shareState.ctx);
}

// ── Pomocnicze prymitywy rysunkowe (współdzielone przez wszystkie szablony) ──
function _shRoundRect(g,x,y,w,h,r){
  if (typeof r==='number') r={tl:r,tr:r,br:r,bl:r};
  g.beginPath();
  g.moveTo(x+r.tl,y);
  g.lineTo(x+w-r.tr,y); g.arcTo(x+w,y,x+w,y+r.tr,r.tr);
  g.lineTo(x+w,y+h-r.br); g.arcTo(x+w,y+h,x+w-r.br,y+h,r.br);
  g.lineTo(x+r.bl,y+h); g.arcTo(x,y+h,x,y+h-r.bl,r.bl);
  g.lineTo(x,y+r.tl); g.arcTo(x,y,x+r.tl,y,r.tl);
  g.closePath();
}

function _shBg(g,w,h,theme){
  var grad = g.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,theme.bg2);
  grad.addColorStop(1,theme.bg);
  g.fillStyle = grad;
  g.fillRect(0,0,w,h);
  if (theme.glow) {
    var glow = g.createRadialGradient(w*0.8,h*0.1,0,w*0.8,h*0.1,w*0.9);
    glow.addColorStop(0, theme.accent+'33');
    glow.addColorStop(1, 'transparent');
    g.fillStyle = glow;
    g.fillRect(0,0,w,h);
    var glow2 = g.createRadialGradient(w*0.15,h*0.9,0,w*0.15,h*0.9,w*0.8);
    glow2.addColorStop(0, theme.accent2+'2b');
    glow2.addColorStop(1, 'transparent');
    g.fillStyle = glow2;
    g.fillRect(0,0,w,h);
  }
}

function _shText(g,text,x,y,opts){
  opts = opts||{};
  g.font = (opts.weight||400)+' '+(opts.size||28)+'px '+(opts.font||'-apple-system,"SF Pro Display","Helvetica Neue",sans-serif');
  g.fillStyle = opts.color||'#fff';
  g.textAlign = opts.align||'left';
  g.textBaseline = opts.baseline||'alphabetic';
  if (opts.maxWidth) text = _shTruncate(g,text,opts.maxWidth);
  g.fillText(text,x,y);
  return g.measureText(text).width;
}

function _shTruncate(g,text,maxWidth){
  if (g.measureText(text).width<=maxWidth) return text;
  var t=text;
  while (t.length>1 && g.measureText(t+'…').width>maxWidth) t=t.slice(0,-1);
  return t+'…';
}

function _shHeader(g,w,h,theme,shareCtx,pad){
  var y = pad;
  if (_shareLogoLoaded && _shareLogoImg) {
    g.save();
    _shRoundRect(g,pad,y,64,64,16);
    g.clip();
    g.drawImage(_shareLogoImg,pad,y,64,64);
    g.restore();
  } else {
    _shRoundRect(g,pad,y,64,64,16);
    g.fillStyle = theme.surface2;
    g.fill();
    _shText(g,'🏋️',pad+32,y+43,{size:30,align:'center'});
  }
  _shText(g,'GymFlow',pad+78,y+30,{size:26,weight:800,color:theme.text});
  var dateStr = shareCtx.date.toLocaleDateString('pl',{day:'numeric',month:'long',year:'numeric'});
  var timeStr = shareCtx.date.toLocaleTimeString('pl',{hour:'2-digit',minute:'2-digit'});
  _shText(g,dateStr+' · '+timeStr,pad+78,y+58,{size:20,color:theme.text3});
  return y+64+pad*0.6;
}

// Kafelek statystyki — używany przez Summary i Stats
function _shStatTile(g,x,y,w,h,icon,value,label,theme,big){
  _shRoundRect(g,x,y,w,h,20);
  g.fillStyle = theme.surface;
  g.fill();
  var cy = y+h/2;
  if (icon) _shText(g,icon,x+24,cy-(big?4:2),{size:big?34:26,align:'left',baseline:'middle'});
  var vx = icon ? x+24+50 : x+24;
  _shText(g,value,vx,cy-(big?8:6),{size:big?40:30,weight:800,color:theme.text,align:'left',baseline:'middle'});
  _shText(g,label,vx,cy+(big?30:24),{size:big?18:16,color:theme.text3,align:'left',baseline:'middle'});
}

function _shFmtDuration(sec){
  sec=Math.round(sec||0);
  var h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60);
  return h>0 ? (h+'h '+m+'min') : (m+'min');
}

// ── Szablon 1: Workout Summary ──
function drawShareSummary(g,w,h,theme,shareCtx){
  var pad = w*0.06;
  _shBg(g,w,h,theme);
  var y = _shHeader(g,w,h,theme,shareCtx,pad);

  y += pad*0.4;
  _shText(g,'🏋️ Trening ukończony',w/2,y+40,{size:44,weight:800,color:theme.text,align:'center'});
  var titleLine2 = shareCtx.planName + (shareCtx.dayName && shareCtx.dayName!==shareCtx.planName ? ' — '+shareCtx.dayName : '');
  _shText(g,titleLine2,w/2,y+80,{size:24,color:theme.accent,align:'center',maxWidth:w-pad*2});
  y += 130;

  // Kafelki (tylko istniejące dane)
  var tiles = [];
  tiles.push({icon:'⏱', value:_shFmtDuration(shareCtx.duration), label:'Czas'});
  tiles.push({icon:'🏋️', value:shareCtx.totalTonnage.toFixed(0)+' kg', label:'Objętość'});
  tiles.push({icon:'💪', value:String(shareCtx.exCount), label:'Ćwiczenia'});
  if (shareCtx.workout.calories) tiles.push({icon:'🔥', value:Math.round(shareCtx.workout.calories)+' kcal', label:'Spalone kcal'});
  if (shareCtx.newRecords.length) tiles.push({icon:'🥇', value:String(shareCtx.newRecords.length), label:'Rekordy'});
  tiles.push({icon:'📅', value:'#'+shareCtx.workoutNumber, label:'Numer treningu'});

  var cols=2, gap=pad*0.45, tileW=(w-pad*2-gap)/cols, tileH=h*0.10;
  tiles.forEach(function(t,i){
    var col=i%cols, row=Math.floor(i/cols);
    _shStatTile(g,pad+col*(tileW+gap),y+row*(tileH+gap*0.6),tileW,tileH,t.icon,t.value,t.label,theme,false);
  });
  y += Math.ceil(tiles.length/cols)*(tileH+gap*0.6);

  // TOP 3 ćwiczenia
  if (shareCtx.top3.length) {
    y += pad*0.5;
    _shText(g,'TOP ĆWICZENIA',pad,y,{size:20,weight:800,color:theme.text3,align:'left'});
    y += pad*0.5;
    var rowH = h*0.095;
    shareCtx.top3.forEach(function(ex,i){
      _shRoundRect(g,pad,y,w-pad*2,rowH,18);
      g.fillStyle = theme.surface; g.fill();
      _shText(g,(i+1)+'.',pad+22,y+rowH/2,{size:26,weight:800,color:theme.accent,align:'left',baseline:'middle'});
      _shText(g,ex.name,pad+70,y+rowH/2-14,{size:24,weight:700,color:theme.text,align:'left',baseline:'middle',maxWidth:w-pad*2-260});
      var repStr = ex.weight>0 ? (ex.weight+' kg × '+ex.reps) : (ex.reps+' powt.');
      _shText(g,repStr,pad+70,y+rowH/2+18,{size:19,color:theme.text3,align:'left',baseline:'middle'});
      y += rowH+gap*0.4;
    });
  }

  _shFooterBottom(g,w,h,theme,pad);
}

// ── Szablon 2: Achievement Card ──
function drawShareAchievement(g,w,h,theme,shareCtx){
  _shBg(g,w,h,theme);
  var pad = w*0.06;
  var achs = getShareAchievements(shareCtx);
  var achData = achs.length ? achs[_shareState.achIdx % achs.length] : null;

  g.save();
  var glowGrad = g.createRadialGradient(w/2,h*0.38,0,w/2,h*0.38,w*0.6);
  glowGrad.addColorStop(0, theme.accent+'40');
  glowGrad.addColorStop(1, 'transparent');
  g.fillStyle = glowGrad;
  g.fillRect(0,0,w,h);
  g.restore();

  var cy = h*0.36;
  if (achData) {
    var icon = achData.icon && achData.icon.indexOf('img:')===0 ? '🏅' : (achData.icon||'🏆');
    _shText(g,icon,w/2,cy,{size:150,align:'center',baseline:'middle'});
    _shText(g,'NOWE OSIĄGNIĘCIE',w/2,cy+110,{size:22,weight:800,color:theme.accent,align:'center'});
    _shText(g,achData.name,w/2,cy+165,{size:42,weight:800,color:theme.text,align:'center',maxWidth:w-pad*2});
    _shText(g,achData.desc,w/2,cy+205,{size:22,color:theme.text3,align:'center',maxWidth:w-pad*2});
  } else if (shareCtx.newRecords.length) {
    var rec = shareCtx.newRecords[0];
    _shText(g,'🏆',w/2,cy,{size:150,align:'center',baseline:'middle'});
    _shText(g,'NOWY REKORD',w/2,cy+110,{size:22,weight:800,color:theme.accent,align:'center'});
    _shText(g,rec.name,w/2,cy+165,{size:42,weight:800,color:theme.text,align:'center',maxWidth:w-pad*2});
    _shText(g,rec.weight+' kg × '+rec.reps,w/2,cy+215,{size:30,weight:700,color:theme.text2,align:'center'});
    if (rec.prevWeight>0) _shText(g,'+'+(rec.weight-rec.prevWeight).toFixed(1)+' kg',w/2,cy+255,{size:24,weight:700,color:theme.accent,align:'center'});
  }

  _shText(g,'GymFlow',w/2,h-h*0.08,{size:26,weight:800,color:theme.accent,align:'center'});
}

// ── Szablon 3: Progress Card ──
function drawShareProgress(g,w,h,theme,shareCtx){
  _shBg(g,w,h,theme);
  var pad = w*0.06;
  var y = _shHeader(g,w,h,theme,shareCtx,pad);
  y += pad*0.5;
  var prev = getShareCompareTarget(shareCtx);
  var diffs = prev ? computeShareProgressDiffs(shareCtx,prev) : [];

  _shText(g,'📈 Progres',w/2,y+40,{size:40,weight:800,color:theme.text,align:'center'});
  y += 90;

  var maxRows = Math.min(diffs.length, Math.floor((h*0.62)/ (h*0.11)));
  var rowH = h*0.10;
  diffs.slice(0,maxRows).forEach(function(d){
    _shRoundRect(g,pad,y,w-pad*2,rowH,18);
    g.fillStyle = theme.surface; g.fill();
    var arrow = d.up ? '⬆' : '⬇';
    var col = d.up ? theme.accent : theme.text3;
    _shText(g,arrow,pad+24,y+rowH/2,{size:30,color:col,align:'left',baseline:'middle'});
    _shText(g,d.name,pad+70,y+rowH/2-16,{size:23,weight:700,color:theme.text,align:'left',baseline:'middle',maxWidth:w-pad*2-100});
    var valStr = d.curWeight!==d.prevWeight
      ? (d.prevWeight+' → '+d.curWeight+' kg')
      : (d.prevReps+' → '+d.curReps+' powt.');
    _shText(g,valStr,pad+70,y+rowH/2+16,{size:20,color:theme.text2,align:'left',baseline:'middle'});
    y += rowH+pad*0.25;
  });

  y += pad*0.4;
  var tonnageDiff = prev ? (shareCtx.totalTonnage-(prev.tonnage||0)) : 0;
  _shRoundRect(g,pad,y,w-pad*2,h*0.13,20);
  g.fillStyle = theme.surface2; g.fill();
  var cy2=y+h*0.13/2;
  _shText(g,'+'+shareCtx.newRecords.length+' rekordy',w/2,cy2-16,{size:28,weight:800,color:theme.accent,align:'center'});
  _shText(g,(tonnageDiff>=0?'+':'')+tonnageDiff.toFixed(0)+' kg objętości',w/2,cy2+22,{size:22,color:theme.text2,align:'center'});

  _shText(g,'GymFlow',w/2,h-h*0.045,{size:22,weight:800,color:theme.accent,align:'center'});
}

// ── Szablon 4: Workout Stats (minimalistyczny) ──
function drawShareStats(g,w,h,theme,shareCtx){
  _shBg(g,w,h,theme);
  var pad = w*0.08;
  var items = [
    { value:_shFmtDuration(shareCtx.duration), label:'czas treningu' },
    { value:String(shareCtx.exCount), label:'ćwiczeń' },
    { value:String(shareCtx.totalSets), label:'serii' },
    { value:shareCtx.totalTonnage.toFixed(0)+' kg', label:'tonażu' },
  ];
  if (shareCtx.newRecords.length) items.push({ value:String(shareCtx.newRecords.length), label:'rekordy' });

  var totalH = items.length*(h*0.16);
  var y = (h-totalH)/2 + h*0.08;
  items.forEach(function(it){
    _shText(g,it.value,w/2,y,{size:76,weight:800,color:theme.text,align:'center'});
    _shText(g,it.label,w/2,y+42,{size:26,color:theme.accent,align:'center'});
    y += h*0.16;
  });

  _shText(g,'GymFlow',w/2,h-h*0.05,{size:24,weight:800,color:theme.text3,align:'center'});
}

function _shFooterBottom(g,w,h,theme,pad){
  var y=h-pad*0.55;
  _shText(g,'Made with GymFlow',w/2,y,{size:20,weight:700,color:theme.text3,align:'center'});
}

// ===================== EKSPORT PNG + UDOSTĘPNIANIE =====================

function downloadShareImage(){
  var canvas = document.getElementById('share-canvas');
  if (!canvas) return;
  canvas.toBlob(function(blob){
    if (!blob) { showNotif('⚠️','Błąd','Nie udało się wygenerować grafiki'); return; }
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gymflow-'+_shareState.templateKey+'-'+Date.now()+'.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); },2000);
    showNotif('✅','Zapisano grafikę','');
  }, 'image/png');
}

function shareShareImage(){
  var canvas = document.getElementById('share-canvas');
  if (!canvas) return;
  canvas.toBlob(function(blob){
    if (!blob) { showNotif('⚠️','Błąd','Nie udało się wygenerować grafiki'); return; }
    var fileName = 'gymflow-'+_shareState.templateKey+'.png';
    var file = new File([blob], fileName, { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[file] })) {
      navigator.share({ files:[file], title:'GymFlow' }).catch(function(){});
    } else {
      downloadShareImage();
    }
  }, 'image/png');
}
