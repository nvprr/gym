// ===================== WIECEJ.JS =====================
// Nawigacja zakładki Więcej — kafelki + pod-widoki

var _wiecejSection = null;

function showWiecej(section) {
  _wiecejSection = section;
  var grid = document.getElementById('wiecej-grid');
  var sub  = document.getElementById('wiecej-subview');
  var title = document.getElementById('wiecej-subview-title');
  var content = document.getElementById('wiecej-subview-content');
  if (!grid || !sub || !title || !content) return;

  grid.style.display = 'none';
  sub.style.display = 'block';
  content.innerHTML = '';
  document.getElementById('content').scrollTop = 0;

  var titles = {
    profil:      '👤 Profil',
    pomiary:     '📏 Pomiary',
    osiagniecia: '🏅 Osiągnięcia',
    sezony:      '🌸 Sezony',
    wrapped:     '🎉 GymFlow Wrapped',
    ustawienia:  '⚙️ Ustawienia',
    dane:        '💾 Dane',
    changelog:   '📜 Historia zmian',
    biblioteka:  '📚 Biblioteka',
    kalkulatory: '🧮 Kalkulatory'
  };
  title.textContent = titles[section] || '';

  if (section === 'profil')      renderWiecejProfil(content);
  else if (section === 'pomiary')     renderWiecejPomiary(content);
  else if (section === 'osiagniecia') renderWiecejOsiagniecia(content);
  else if (section === 'sezony')      renderWiecejSezony(content);
  else if (section === 'wrapped')     renderWiecejWrapped(content);
  else if (section === 'ustawienia')  renderWiecejUstawienia(content);
  else if (section === 'dane')        renderWiecejDane(content);
  else if (section === 'changelog')   renderWiecejChangelog(content);
  else if (section === 'biblioteka')  renderWiecejBiblioteka(content);
  else if (section === 'kalkulatory') renderWiecejKalkulatory(content);
}

function hideWiecej() {
  var grid = document.getElementById('wiecej-grid');
  var sub  = document.getElementById('wiecej-subview');
  var content = document.getElementById('wiecej-subview-content');
  if (grid) grid.style.display = 'grid';
  if (sub)  sub.style.display = 'none';
  if (content) content.innerHTML = '';
  document.getElementById('content').scrollTop = 0;
  _wiecejSection = null;
}

// ── PROFIL ──
function renderWiecejProfil(el) {
  var avatar   = (state.settings && state.settings.avatar)   || '🦁';
  var username = (state.settings && state.settings.username) || 'GymFlow';
  var gender   = (state.settings && state.settings.gender)   || 'male';
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card" style="text-align:center;padding:24px 16px;">'
    +   '<div id="wp-avatar" style="font-size:64px;margin-bottom:8px;">'+avatar+'</div>'
    +   '<div id="wp-name" style="font-size:20px;font-weight:800;margin-bottom:20px;">'+username+'</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:12px;">'
    +     '<input id="wp-avatar-input" class="form-input" style="width:60px;text-align:center;font-size:22px;" value="'+avatar+'" maxlength="2">'
    +     '<input id="wp-name-input" class="form-input" style="flex:1;" value="'+username+'" placeholder="Twoje imię">'
    +   '</div>'
    +   '<button class="btn btn-primary" style="width:100%;margin:0;" onclick="saveWiecejProfil()">Zapisz</button>'
    + '</div>'
    + '<div class="card" style="margin-top:0;">'
    +   '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Płeć / Sylwetka</div>'
    +   '<div style="display:flex;gap:8px;">'
    +     '<button id="wp-male-btn" onclick="setWiecejGender(\'male\')" style="flex:1;padding:12px;border-radius:12px;border:2px solid '+(gender==='male'?'var(--accent)':'var(--border2)')+';background:'+(gender==='male'?'var(--accent-light)':'var(--surface2)')+';color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">👨 Mężczyzna</button>'
    +     '<button id="wp-female-btn" onclick="setWiecejGender(\'female\')" style="flex:1;padding:12px;border-radius:12px;border:2px solid '+(gender==='female'?'var(--accent)':'var(--border2)')+';background:'+(gender==='female'?'var(--accent-light)':'var(--surface2)')+';color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">👩 Kobieta</button>'
    +   '</div>'
    + '</div>'
    + '</div>';
}

function saveWiecejProfil() {
  var avatar   = (document.getElementById('wp-avatar-input').value.trim()) || '🦁';
  var username = (document.getElementById('wp-name-input').value.trim())   || 'GymFlow';
  state.settings.avatar   = avatar;
  state.settings.username = username;
  saveSettings();
  var a = document.getElementById('wp-avatar'); if (a) a.textContent = avatar;
  var n = document.getElementById('wp-name');   if (n) n.textContent = username;
  var pi = document.getElementById('profile-avatar-icon'); if (pi) pi.textContent = avatar;
  var pn = document.getElementById('profile-name-display'); if (pn) pn.textContent = username;
  showNotif('✅', 'Profil zapisany', '');
  refreshDashboard();
}

function setWiecejGender(g) {
  state.settings.gender = g;
  saveSettings();
  renderMuscleMapMain();
  showNotif('✅', 'Sylwetka zmieniona', g === 'male' ? 'Mężczyzna' : 'Kobieta');
  // Update button styles
  var mb = document.getElementById('wp-male-btn');
  var fb = document.getElementById('wp-female-btn');
  if (mb) { mb.style.borderColor = g==='male'?'var(--accent)':'var(--border2)'; mb.style.background = g==='male'?'var(--accent-light)':'var(--surface2)'; }
  if (fb) { fb.style.borderColor = g==='female'?'var(--accent)':'var(--border2)'; fb.style.background = g==='female'?'var(--accent-light)':'var(--surface2)'; }
  var gd = document.getElementById('gender-display'); if (gd) gd.textContent = g==='male'?'Mężczyzna':'Kobieta';
}

// ── POMIARY ──
function renderWiecejPomiary(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<button onclick="openBodyMeasurementsSheet()" class="btn btn-primary" style="width:100%;margin:0 0 12px;">+ Dodaj pomiary</button>'
    + '<div id="wp-bm-latest"></div>'
    + '<div id="wp-bm-history"></div>'
    + '</div>';
  // Render measurements into these new containers
  if (typeof renderBodyMeasurementsInto === 'function') {
    renderBodyMeasurementsInto('wp-bm-latest', 'wp-bm-history');
  } else {
    // Fallback: swap IDs temporarily
    var oL = document.getElementById('body-meas-latest');
    var oH = document.getElementById('body-meas-history');
    var nL = document.getElementById('wp-bm-latest');
    var nH = document.getElementById('wp-bm-history');
    if (oL && nL) { oL.id='_bml_h'; nL.id='body-meas-latest'; }
    if (oH && nH) { oH.id='_bmh_h'; nH.id='body-meas-history'; }
    if (typeof renderBodyMeasurements === 'function') renderBodyMeasurements();
    nL = document.getElementById('body-meas-latest');
    nH = document.getElementById('body-meas-history');
    var rL = document.getElementById('_bml_h');
    var rH = document.getElementById('_bmh_h');
    if (nL) nL.id = 'wp-bm-latest';
    if (nH) nH.id = 'wp-bm-history';
    if (rL) rL.id = 'body-meas-latest';
    if (rH) rH.id = 'body-meas-history';
  }
}

// ── OSIĄGNIĘCIA ──
function renderWiecejOsiagniecia(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div style="margin-bottom:12px;">'
    +   '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'
    +     '<div id="wp-ach-count" style="font-size:13px;color:var(--text3);"></div>'
    +     '<div id="wp-ach-pct" style="font-size:20px;font-weight:800;color:var(--accent);"></div>'
    +   '</div>'
    +   '<div style="background:var(--surface2);border-radius:6px;height:6px;overflow:hidden;">'
    +     '<div id="wp-ach-fill" style="height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:6px;width:0%;transition:width .6s;"></div>'
    +   '</div>'
    + '</div>'
    + '<div style="overflow-x:auto;display:flex;gap:6px;padding-bottom:12px;scrollbar-width:none;" id="wp-ach-chips">'
    +   '<button class="prog-tab active" onclick="setWiecejAchCat(\'all\',this)">Wszystkie</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'start\',this)">🚀 Start</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'streak\',this)">🔥 Streak</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'strength\',this)">🏋️ Siła</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'volume\',this)">📈 Objętość</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'sets\',this)">💪 Serie</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'reps\',this)">🔁 Powt.</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'time\',this)">⏱️ Czas</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'muscle\',this)">🦵 Partie</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'goals\',this)">🎯 Cele</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'gymdna\',this)">🧬 GymDNA</button>'
    +   '<button class="prog-tab" onclick="setWiecejAchCat(\'secret\',this)">⭐ Sekretne</button>'
    + '</div>'
    + '<div id="wp-ach-list"></div>'
    + '</div>';
  renderWiecejAchList('all');
}

function setWiecejAchCat(cat, btn) {
  document.querySelectorAll('#wp-ach-chips .prog-tab').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  renderWiecejAchList(cat);
}

function renderWiecejAchList(cat) {
  var countEl = document.getElementById('wp-ach-count');
  var pctEl   = document.getElementById('wp-ach-pct');
  var fillEl  = document.getElementById('wp-ach-fill');
  var listEl  = document.getElementById('wp-ach-list');
  if (!listEl) return;

  var data     = computeAchievementData();
  var unlocked = checkAchievements(false);
  var total    = ACHIEVEMENTS.length;
  var done     = Object.keys(unlocked).length;
  var pct      = Math.round(done / total * 100);

  if (countEl) countEl.textContent = done + ' / ' + total + ' osiągnięć';
  if (pctEl)   pctEl.textContent   = pct + '%';
  if (fillEl)  fillEl.style.width  = pct + '%';

  var list = ACHIEVEMENTS.filter(function(a) {
    return cat === 'all' || a.cat === cat;
  });
  list.sort(function(a,b) {
    var au=unlocked[a.id], bu=unlocked[b.id];
    if(au&&bu) return new Date(bu)-new Date(au);
    if(au) return -1; if(bu) return 1; return 0;
  });

  var cats = {start:'🚀 Start',streak:'🔥 Regularność',strength:'🏋️ Siła',volume:'📈 Objętość',sets:'💪 Serie',reps:'🔁 Powtórzenia',time:'⏱️ Czas',muscle:'🦵 Partie',goals:'🎯 Cele',gymdna:'🧬 GymDNA',secret:'⭐ Sekretne'};
  var html = '', lastCat = null;

  list.forEach(function(ach) {
    var isUnlocked = !!unlocked[ach.id];
    var isSecret   = ach.secret && !isUnlocked;
    if (cat === 'all' && ach.cat !== lastCat) {
      html += '<div class="ach-cat-header">'+(cats[ach.cat]||ach.cat)+'</div>';
      lastCat = ach.cat;
    }
    var prog = getAchProgress(ach, data);
    var showBar = ach.max > 1 && !isUnlocked;
    var barPct  = Math.round(prog/ach.max*100);
    var uDate   = unlocked[ach.id] ? new Date(unlocked[ach.id]).toLocaleDateString('pl',{day:'numeric',month:'short',year:'numeric'}) : '';
    html += '<div class="ach-card">';
    html += '<div class="ach-icon-wrap '+(isUnlocked?'unlocked':'locked')+(isSecret?' secret':'')+'">';
    html += isSecret ? '🔒' : (typeof renderAchIcon==='function' ? renderAchIcon(ach.icon,!isUnlocked) : ach.icon);
    html += '</div><div class="ach-info">';
    if (isSecret) {
      html += '<div class="ach-name locked">???</div><div class="ach-desc">Sekretne osiągnięcie</div>';
    } else {
      html += '<div class="ach-name'+(isUnlocked?'':' locked')+'">'+ach.name+'</div>';
      html += '<div class="ach-desc">'+ach.desc+'</div>';
      if (showBar) {
        var pd = ach.cat==='time'?prog.toFixed(1)+' / '+ach.max+' godz.':ach.cat==='volume'?prog.toLocaleString('pl')+' / '+ach.max.toLocaleString('pl')+' kg':prog+' / '+ach.max;
        html += '<div class="ach-progress-mini"><div class="ach-progress-fill" style="width:'+barPct+'%"></div></div>';
        html += '<div class="ach-progress-txt">'+pd+'</div>';
      }
      if (isUnlocked) html += '<div class="ach-date">🏅 Odblokowano '+uDate+'</div>';
    }
    html += '</div><div class="ach-badge '+(isUnlocked?'unlocked':'locked')+'">'+(isUnlocked?'🏅':'🔒')+'</div></div>';
  });
  listEl.innerHTML = html || '<div style="color:var(--text4);font-size:13px;padding:12px 0;">Brak osiągnięć.</div>';
}

// ── SEZONY ──
function renderWiecejSezony(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div id="wp-seasons-year-tabs" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;"></div>'
    + '<div id="wp-seasons-grid"></div>'
    + '<div id="wp-seasons-detail" style="display:none;"></div>'
    + '</div>';
  renderWiecejSezonyContent();
}

function renderWiecejSezonyContent() {
  var years = getAvailableYears ? getAvailableYears() : [];
  if (!years.length) { var el = document.getElementById('wp-seasons-grid'); if(el) el.innerHTML='<div style="color:var(--text3);padding:16px;text-align:center;">Brak treningów.</div>'; return; }

  if (typeof seasonsYear === 'undefined') window.seasonsYear = years[0];
  if (years.indexOf(seasonsYear) === -1) seasonsYear = years[0];

  // Year tabs
  var tabsEl = document.getElementById('wp-seasons-year-tabs');
  if (tabsEl) {
    tabsEl.innerHTML = years.map(function(y) {
      return '<button class="prog-tab'+(y===seasonsYear?' active':'')+'" onclick="seasonsYear='+y+';renderWiecejSezonyContent()">'+y+'</button>';
    }).join('');
  }

  var gridEl = document.getElementById('wp-seasons-grid');
  var detEl  = document.getElementById('wp-seasons-detail');
  if (!gridEl) return;
  detEl.style.display = 'none';
  gridEl.style.display = '';

  var order = ['spring','summer','autumn','winter'];
  var html  = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
  order.forEach(function(key) {
    var def   = getSeasonDef(key);
    var stats = computeSeasonStats(seasonsYear, key);
    html += '<div onclick="openWiecejSeasonDetail('+seasonsYear+',\''+key+'\')" style="background:var(--surface2);border-radius:16px;padding:16px;cursor:pointer;">';
    html += '<div style="font-size:28px;margin-bottom:6px;">'+def.icon+'</div>';
    html += '<div style="font-weight:700;font-size:15px;">'+def.label+'</div>';
    if (!stats) {
      html += '<div style="font-size:12px;color:var(--text4);margin-top:4px;">Brak treningów</div>';
    } else {
      html += '<div style="font-size:22px;font-weight:800;color:var(--accent);margin-top:4px;">'+stats.count+'</div>';
      html += '<div style="font-size:11px;color:var(--text3);">treningów · '+stats.consistency+'%</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  gridEl.innerHTML = html;
}

function openWiecejSeasonDetail(year, seasonKey) {
  var stats = computeSeasonStats(year, seasonKey);
  var def   = getSeasonDef(seasonKey);
  var gridEl = document.getElementById('wp-seasons-grid');
  var detEl  = document.getElementById('wp-seasons-detail');
  var tabsEl = document.getElementById('wp-seasons-year-tabs');
  if (!detEl) return;

  if (!stats) { showNotif('ℹ️','Brak danych','Brak treningów w tym sezonie'); return; }

  // Compare with prev
  var order=['spring','summer','autumn','winter'];
  var idx=order.indexOf(seasonKey);
  var prevKey = idx===0?'winter':order[idx-1];
  var prevYear= idx===0?year-1:year;
  var prevStats=computeSeasonStats(prevYear,prevKey);

  var html='<button onclick="closeWiecejSeasonDetail()" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 0 12px;">← Powrót</button>';
  html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;"><div style="font-size:36px;">'+def.icon+'</div><div><div style="font-size:20px;font-weight:800;">'+def.label+' '+year+'</div>';
  if(prevStats) html+='<div style="font-size:12px;color:var(--text3);">vs '+getSeasonDef(prevKey).label+' '+prevYear+'</div>';
  html+='</div></div>';

  if(prevStats) {
    html+='<div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:14px;">';
    html+='<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Zmiana vs poprzedni sezon</div>';
    [{l:'treningów',a:stats.count,b:prevStats.count},{l:'tonaż',a:stats.tonnage,b:prevStats.tonnage},{l:'PR',a:stats.prs||0,b:prevStats.prs||0}].forEach(function(c){
      var d=c.a-(c.b||0); var col=d>0?'var(--green)':d<0?'var(--accent)':'var(--text3)'; var sign=d>0?'+':'';
      html+='<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;"><span style="color:var(--text3);">'+c.l+'</span><span style="font-weight:700;">'+c.a+(d!==0?' <span style="color:'+col+';font-size:12px;">('+sign+d+')</span>':'')+'</span></div>';
    });
    html+='</div>';
  }

  var items=[
    {icon:'🏋️',label:'Treningi',val:stats.count},
    {icon:'📦',label:'Tonaż',val:(stats.tonnage/1000).toFixed(1)+'t'},
    {icon:'💪',label:'Serie',val:stats.sets},
    {icon:'🔁',label:'Powtórzenia',val:stats.reps},
    {icon:'⏱️',label:'Avg czas',val:formatTime(stats.avgDuration)},
    {icon:'🔥',label:'Best streak',val:stats.streak+' dni'},
    {icon:'💯',label:'Consistency',val:stats.consistency+'%'},
    {icon:'🦵',label:'Top partia',val:stats.topMuscle},
    {icon:'⭐',label:'Top ćwiczenie',val:stats.topExercise},
  ];
  html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  items.forEach(function(s){
    html+='<div style="background:var(--surface2);border-radius:12px;padding:12px;">'
      +'<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+s.icon+' '+s.label+'</div>'
      +'<div style="font-size:15px;font-weight:700;">'+s.val+'</div></div>';
  });
  html+='</div>';

  detEl.innerHTML=html;
  detEl.style.display='block';
  if(gridEl) gridEl.style.display='none';
  if(tabsEl) tabsEl.style.display='none';
}

function closeWiecejSeasonDetail() {
  var gridEl=document.getElementById('wp-seasons-grid');
  var detEl=document.getElementById('wp-seasons-detail');
  var tabsEl=document.getElementById('wp-seasons-year-tabs');
  if(detEl) detEl.style.display='none';
  if(gridEl){gridEl.style.display='';gridEl.innerHTML='';}
  if(tabsEl) tabsEl.style.display='flex';
  renderWiecejSezonyContent();
}

// ── WRAPPED ──
function renderWiecejWrapped(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div id="wp-wrapped-year-tabs" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;"></div>'
    + '<div id="wp-wrapped-container"></div>'
    + '</div>';
  renderWiecejWrappedYears();
}

function renderWiecejWrappedYears() {
  var years = getAvailableYears ? getAvailableYears() : [new Date().getFullYear()];
  if (typeof wrappedYear === 'undefined') window.wrappedYear = years[0];
  if (years.indexOf(wrappedYear)===-1) wrappedYear=years[0];

  var tabsEl=document.getElementById('wp-wrapped-year-tabs');
  if(tabsEl) {
    tabsEl.innerHTML=years.map(function(y){
      return '<button class="prog-tab'+(y===wrappedYear?' active':'')+'" onclick="wrappedYear='+y+';renderWiecejWrappedYears()">'+y+'</button>';
    }).join('');
  }

  var cont=document.getElementById('wp-wrapped-container');
  if(!cont) return;
  var workouts=state.workouts.filter(function(w){return new Date(w.date).getFullYear()===wrappedYear;});
  if(!workouts.length){
    cont.innerHTML='<div style="text-align:center;padding:24px;color:var(--text3);">Brak treningów w '+wrappedYear+'.</div>';
    return;
  }
  cont.innerHTML='<div style="text-align:center;padding:20px 0;">'
    +'<div style="font-size:48px;margin-bottom:8px;">🎉</div>'
    +'<div style="font-size:22px;font-weight:800;margin-bottom:4px;">Twój '+wrappedYear+' w GymFlow</div>'
    +'<div style="font-size:14px;color:var(--text3);margin-bottom:20px;">'+workouts.length+' treningów za tobą</div>'
    +'<button class="btn btn-primary" style="width:100%;" onclick="startWiecejWrapped('+wrappedYear+')">▶ Odtwórz Wrapped</button>'
    +'</div>';
}

function startWiecejWrapped(year) {
  if(typeof buildWrappedSlides!=='function'){showNotif('❌','Błąd','Brak funkcji Wrapped');return;}
  window.wrappedYear=year;
  window.wrappedSlide=0;
  window.wrappedSlides=buildWrappedSlides(year);
  renderWiecejWrappedSlide();
}

function renderWiecejWrappedSlide() {
  var cont=document.getElementById('wp-wrapped-container');
  if(!cont||!window.wrappedSlides||!window.wrappedSlides.length) return;
  var slide=window.wrappedSlides[window.wrappedSlide];
  if(!slide) return;
  var isLast=window.wrappedSlide===window.wrappedSlides.length-1;
  var isFirst=window.wrappedSlide===0;

  var html='<div style="background:'+(slide.bg||'var(--surface2)')+';border-radius:20px;padding:32px 20px;text-align:center;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;">';
  html+='<div style="font-size:56px;margin-bottom:12px;">'+slide.icon+'</div>';
  html+='<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">'+slide.label+'</div>';
  if(slide.final){
    html+='<div style="font-size:16px;font-weight:700;margin-bottom:6px;">Dziękujemy za wspólny rok!</div>';
    html+='<div style="font-size:13px;color:var(--text3);">'+slide.sub+'</div>';
  } else {
    html+='<div style="font-size:32px;font-weight:800;color:'+(slide.color||'var(--accent)')+';margin-bottom:6px;" id="wp-wrapped-val">'+slide.val+'</div>';
    html+='<div style="font-size:13px;color:var(--text3);">'+slide.sub+'</div>';
  }
  html+='</div>';

  html+='<div style="display:flex;gap:8px;margin-top:12px;align-items:center;">';
  if(!isFirst) html+='<button class="btn btn-secondary" style="flex:1;" onclick="window.wrappedSlide--;renderWiecejWrappedSlide()">← Wstecz</button>';
  if(!isLast)  html+='<button class="btn btn-primary" style="flex:2;" onclick="window.wrappedSlide++;renderWiecejWrappedSlide()">Dalej →</button>';
  else         html+='<button class="btn btn-secondary" style="flex:1;" onclick="renderWiecejWrappedYears()">✕ Zamknij</button>';
  html+='</div>';

  html+='<div style="display:flex;justify-content:center;gap:5px;margin-top:10px;">';
  for(var i=0;i<window.wrappedSlides.length;i++)
    html+='<div style="width:6px;height:6px;border-radius:50%;background:'+(i===window.wrappedSlide?'var(--accent)':'var(--surface2)')+'"></div>';
  html+='</div>';

  cont.innerHTML=html;

  // Count-up for numbers
  if(!slide.noCount&&!slide.final&&typeof countUp==='function'){
    var valEl=document.getElementById('wp-wrapped-val');
    if(valEl&&slide.val&&String(slide.val).match(/^[\d.]+/)){
      var num=parseFloat(slide.val);
      var suffix=String(slide.val).replace(/^[\d.]+/,'');
      if(!isNaN(num)) countUp(valEl,num,1000,suffix);
    }
  }
}

// ── USTAWIENIA ──
function renderWiecejUstawienia(el) {
  el.innerHTML =
    '<div style="padding:0 16px;"><div class="card" style="padding:0;overflow:hidden;">'
    + '<div style="padding:12px 16px;border-bottom:.5px solid var(--border2);">'
    +   '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🌓 Wygląd</div>'
    +   '<div style="display:flex;gap:8px;">'
    +     '<button id="mode-dark"  onclick="setAppearanceMode(\'dark\')"  style="flex:1;padding:9px 4px;border-radius:10px;border:1.5px solid var(--border2);background:var(--surface2);color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;">🌙 Ciemny</button>'
    +     '<button id="mode-light" onclick="setAppearanceMode(\'light\')" style="flex:1;padding:9px 4px;border-radius:10px;border:1.5px solid var(--border2);background:var(--surface2);color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;">☀️ Jasny</button>'
    +     '<button id="mode-auto"  onclick="setAppearanceMode(\'auto\')"  style="flex:1;padding:9px 4px;border-radius:10px;border:1.5px solid var(--border2);background:var(--surface2);color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;">🌓 Auto</button>'
    +   '</div>'
    + '</div>'
    + '<div style="padding:12px 16px;border-bottom:.5px solid var(--border2);">'
    +   '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🎨 Kolor akcentu</div>'
    +   '<div style="display:flex;gap:10px;flex-wrap:wrap;">'
    +     '<button id="ac-orange"   onclick="setAccentTheme(\'orange\')"   style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#FF375F,#FF6B35);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-blue"     onclick="setAccentTheme(\'blue\')"     style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#0A84FF,#34AADC);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-green"    onclick="setAccentTheme(\'green\')"    style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#30D158,#34C759);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-purple"   onclick="setAccentTheme(\'purple\')"   style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#BF5AF2,#9B59B6);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-red"      onclick="setAccentTheme(\'red\')"      style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#FF453A,#FF6961);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-pink"     onclick="setAccentTheme(\'pink\')"     style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#FF2D92,#FF6EB0);border:3px solid transparent;cursor:pointer;"></button>'
    +     '<button id="ac-graphite" onclick="setAccentTheme(\'graphite\')" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#8E8E93,#AEAEB2);border:3px solid transparent;cursor:pointer;"></button>'
    +   '</div>'
    + '</div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Cel tygodnia</div></div>'
    +   '<input class="form-input" type="number" min="1" id="dashboard-goal-profile-input" style="width:70px;padding:6px 8px;" value="'+(state.settings.dashboardGoal||4)+'" onchange="updateDashboardGoal(this.value)"></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Przerwa — wielostawowe</div></div>'
    +   '<select class="form-input" style="width:90px;padding:6px 8px;" id="rest-compound" onchange="saveSettings()">'
    +   '<option value="60">60s</option><option value="90"'+(( state.settings.restCompound||90)==90?' selected':'')+'>90s</option><option value="120">120s</option><option value="180">180s</option></select></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Przerwa — izolacja</div></div>'
    +   '<select class="form-input" style="width:90px;padding:6px 8px;" id="rest-isolation" onchange="saveSettings()">'
    +   '<option value="30">30s</option><option value="45">45s</option><option value="60"'+(( state.settings.restIsolation||60)==60?' selected':'')+'>60s</option><option value="90">90s</option></select></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Wibracje</div></div>'
    +   '<button class="toggle '+(state.settings.vibration!==false?'on':'')+'" id="vibration-toggle" onclick="toggleVibration(this)"></button></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Dźwięk</div></div>'
    +   '<button class="toggle '+(state.settings.sound!==false?'on':'')+'" id="sound-toggle" onclick="toggleSound(this)"></button></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">Powiadomienia treningowe</div><div class="list-sub" id="notif-setting-sub">Co '+(state.settings.notifFreq||2)+' dni · '+(state.settings.notifHour||'09:00')+'</div></div>'
    +   '<button class="toggle '+(state.settings.notificationsEnabled?'on':'')+'" id="notif-toggle" onclick="toggleNotifications(this)"></button></div>'
    + '<div class="list-item"><div class="list-text"><div class="list-title">💧 Przypomnienie o wodzie</div><div class="list-sub" id="water-notif-sub">Co '+(state.settings.waterNotifInterval||60)+' min</div></div>'
    +   '<button class="toggle '+(state.settings.waterNotifEnabled?'on':'')+'" id="water-notif-toggle" onclick="toggleWaterNotif(this)"></button></div>'
    + '</div></div>';
  if(typeof applyTheme==='function') applyTheme();
}

// ── DANE ──
function renderWiecejDane(el) {
  el.innerHTML =
    '<div style="padding:0 16px;"><div class="card" style="padding:0;overflow:hidden;">'
    + '<div class="list-item" onclick="exportData()" style="cursor:pointer;"><div class="list-icon" style="background:rgba(48,209,88,.15);">📤</div><div class="list-text"><div class="list-title">Eksportuj dane</div></div><div class="list-chevron">›</div></div>'
    + '<div class="list-item" onclick="importData_trigger()" style="cursor:pointer;"><div class="list-icon" style="background:rgba(10,132,255,.15);">📥</div><div class="list-text"><div class="list-title">Importuj dane</div></div><div class="list-chevron">›</div></div>'
    + '<div class="list-item" onclick="createBackup()" style="cursor:pointer;"><div class="list-icon" style="background:rgba(48,209,88,.15);">💾</div><div class="list-text"><div class="list-title">Utwórz kopię zapasową</div><div class="list-sub">Pełny backup</div></div><div class="list-chevron">›</div></div>'
    + '<div class="list-item" onclick="restoreBackup_trigger()" style="cursor:pointer;"><div class="list-icon" style="background:rgba(255,159,10,.15);">📂</div><div class="list-text"><div class="list-title">Przywróć kopię zapasową</div></div><div class="list-chevron">›</div></div>'
    + '<div class="list-item" onclick="if(confirm(\'Na pewno?\'))clearData()" style="cursor:pointer;"><div class="list-icon" style="background:rgba(255,69,58,.15);">🗑</div><div class="list-text"><div class="list-title" style="color:var(--red);">Wyczyść dane</div></div><div class="list-chevron">›</div></div>'
    + '</div></div>';
}

// ── CHANGELOG ──
var CHANGELOG = [
  {
    version: '2.1.4',
    date: '2025-07-17',
    changes: [
      '✨ Biblioteka ćwiczeń — przeglądaj wszystkie 480+ ćwiczeń z opisami',
      '⭐ System ulubionych ćwiczeń',
      '🔍 Wyszukiwanie i filtrowanie po partii mięśniowej',
      '📜 Changelog — historia zmian',
    ]
  },
  {
    version: '2.1.0',
    date: '2026-07-13',
    changes: [
      '✨ Zakładka Więcej — nowe kafelki nawigacji',
      '✨ Changelog — historia zmian aplikacji',
      '🔔 Baner aktualizacji przy nowej wersji',
      '🔧 Naprawiono PR — teraz używa estymacji 1RM',
      '🔧 Naprawiono dodawanie celów treningowych',
      '⏱️ Minimalizacja timera przerwy',
      '🔧 Naprawiono przywracanie kopii zapasowej',
    ]
  },
  {
    version: '2.0.0',
    date: '2026-06-28',
    changes: [
      '✨ Sezony — podział roku na Wiosnę/Lato/Jesień/Zimę',
      '✨ GymFlow Wrapped — roczne podsumowanie',
      '✨ System motywów kolorystycznych (7 kolorów)',
      '✨ Tryb Jasny / Ciemny / Auto',
      '✨ Nawodnienie — karta na dashboardzie',
      '✨ Backup & Restore — pełna kopia zapasowa',
      '✨ Przypomnienia o wodzie',
      '🔧 Animacje SVG ringa nawodnienia',
      '🔧 Naprawiono drugie uruchomienie treningu',
    ]
  },
  {
    version: '1.6.0',
    date: '2026-06-24',
    changes: [
      '✨ Pomiary ciała — waga, wzrost i wymiary',
      '✨ Usuwanie treningów z historii',
      '✨ Ikony PNG dla osiągnięć',
      '✨ Wykresy SVG w Progress',
      '🔧 Naprawiono zapis profilu użytkownika',
    ]
  },
  {
    version: '1.0.0',
    date: '2026-06-25',
    changes: [
      '🎉 Pierwsza wersja GymFlow',
      '✨ Dashboard z kartami',
      '✨ Plany treningowe',
      '✨ Historia treningów',
      '✨ MuscleMap',
      '✨ Osiągnięcia',
      '✨ Progress & Statystyki',
    ]
  },
];

function renderWiecejChangelog(el) {
  var lastSeen = localStorage.getItem('gymflow_last_version') || '';
  var latest = CHANGELOG[0].version;
  localStorage.setItem('gymflow_last_version', latest);

  var html = '<div style="padding:0 16px;">';
  CHANGELOG.forEach(function(entry, i) {
    var isNew = i === 0 && lastSeen !== latest && lastSeen !== '';
    html += '<div class="card" style="margin-bottom:10px;padding:0;overflow:hidden;">';
    html += '<div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;">';
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<span style="font-size:15px;font-weight:800;">v'+entry.version+'</span>';
    if (isNew) html += '<span style="background:var(--accent);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">NOWE</span>';
    html += '</div>';
    html += '<span style="font-size:12px;color:var(--text3);">'+entry.date+'</span>';
    html += '</div>';
    html += '<div style="display:'+(i===0?'block':'none')+';padding:0 16px 14px;">';
    entry.changes.forEach(function(c) {
      html += '<div style="font-size:13px;padding:4px 0;color:var(--text2);">'+c+'</div>';
    });
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ── BIBLIOTEKA ĆWICZEŃ ──

var _bibFilter = { muscle: 'all', search: '', fav: false };

// ── BIBLIOTEKA — główna (3 podsekcje) ──
function renderWiecejBiblioteka(el) {
  var sections = [
    { key:'atlas',     icon:'📚', title:'Atlas ćwiczeń',            sub:'Baza 480+ ćwiczeń z opisami i filtrami' },
    { key:'slownik',   icon:'📖', title:'Słownik pojęć',            sub:'Definicje terminów treningowych' },
    { key:'zamienniki',icon:'🔄', title:'Zamienniki ćwiczeń',       sub:'Znajdź alternatywę dla ćwiczenia' },
  ];
  var html = '<div style="padding:0 16px;">';
  sections.forEach(function(s) {
    html += '<div onclick="showBibSection(\''+s.key+'\')" style="background:var(--surface2);border-radius:16px;padding:16px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;gap:14px;">'
      + '<span style="font-size:32px;">'+s.icon+'</span>'
      + '<div><div style="font-size:15px;font-weight:700;">'+s.title+'</div>'
      + '<div style="font-size:12px;color:var(--text3);margin-top:2px;">'+s.sub+'</div></div>'
      + '<div style="margin-left:auto;color:var(--text4);font-size:20px;">›</div>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

var _bibSection = 'atlas';
function showBibSection(key) {
  _bibSection = key;
  var titles = { atlas:'📚 Atlas ćwiczeń', slownik:'📖 Słownik pojęć', zamienniki:'🔄 Zamienniki ćwiczeń' };
  var titleEl = document.getElementById('wiecej-subview-title');
  if (titleEl) titleEl.textContent = titles[key] || key;
  var content = document.getElementById('wiecej-subview-content');
  if (!content) return;
  // Back button to biblioteka menu
  content.innerHTML = '<button onclick="showWiecej(\'biblioteka\')" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 16px 12px;">← Biblioteka</button>'
    + '<div id="bib-section-content"></div>';
  var sec = document.getElementById('bib-section-content');
  if (key === 'atlas')      renderBibAtlas(sec);
  if (key === 'slownik')    renderBibSlownik(sec);
  if (key === 'zamienniki') renderBibZamienniki(sec);
}

// ── ATLAS ĆWICZEŃ ──
var _bibFilter = { muscle: 'all', search: '', fav: false };

function renderBibAtlas(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div style="margin-bottom:10px;">'
    +   '<input id="bib-search" class="form-input" placeholder="🔍 Szukaj ćwiczenia..." style="padding-left:12px;"'
    +   ' oninput="_bibFilter.search=this.value;renderBibList()">'
    + '</div>'
    + '<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;margin-bottom:4px;" id="bib-muscle-chips">'
    +   _buildBibChips()
    + '</div>'
    + '<div id="bib-list"></div>'
    + '</div>';
  renderBibList();
}

function _buildBibChips() {
  var muscles = ['all','Klatka','Plecy','Barki','Biceps','Triceps','Nogi','Pośladki','Brzuch','Łydki'];
  var labels  = ['Wszystkie','Klatka','Plecy','Barki','Biceps','Triceps','Nogi','Pośladki','Brzuch','Łydki'];
  var html = '';
  muscles.forEach(function(m, i) {
    var active = m === _bibFilter.muscle ? ' active' : '';
    html += '<button class="prog-tab'+active+'" onclick="_bibFilter.search=\'\';setBibMuscle(\''+m+'\',this)">'+labels[i]+'</button>';
  });
  html += '<button class="prog-tab'+(_bibFilter.fav?' active':'')+'" onclick="toggleBibFav(this)" style="white-space:nowrap;">⭐ Ulubione</button>';
  return html;
}

function setBibMuscle(muscle, btn) {
  _bibFilter.muscle = muscle;
  _bibFilter.fav = false;
  document.querySelectorAll('#bib-muscle-chips .prog-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderBibList();
}

function toggleBibFav(btn) {
  _bibFilter.fav = !_bibFilter.fav;
  _bibFilter.muscle = 'all';
  document.querySelectorAll('#bib-muscle-chips .prog-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.toggle('active', _bibFilter.fav);
  renderBibList();
}

function getBibFavs() {
  try { return JSON.parse(localStorage.getItem('gymflow_fav_exercises') || '[]'); } catch(e) { return []; }
}
function saveBibFavs(favs) { localStorage.setItem('gymflow_fav_exercises', JSON.stringify(favs)); }

function toggleExFav(id, btn) {
  var favs = getBibFavs();
  var idx = favs.indexOf(id);
  if (idx > -1) { favs.splice(idx,1); btn.textContent='☆'; btn.style.color='var(--text4)'; }
  else           { favs.push(id);      btn.textContent='⭐'; btn.style.color='#ffb753'; }
  saveBibFavs(favs);
  if (_bibFilter.fav) renderBibList();
}

function renderBibList() {
  var listEl = document.getElementById('bib-list');
  if (!listEl) return;
  var favs = getBibFavs();
  var all  = typeof getAllExercises === 'function' ? getAllExercises() : (typeof EXERCISES !== 'undefined' ? EXERCISES : []);
  var list = all.filter(function(ex) {
    if (_bibFilter.fav && favs.indexOf(ex.id) === -1) return false;
    if (_bibFilter.muscle !== 'all' && ex.muscle !== _bibFilter.muscle) return false;
    if (_bibFilter.search) {
      var q = _bibFilter.search.toLowerCase();
      return ex.name.toLowerCase().indexOf(q) !== -1
          || (ex.muscle||'').toLowerCase().indexOf(q) !== -1
          || (ex.sub||'').toLowerCase().indexOf(q) !== -1;
    }
    return true;
  });
  if (!list.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text4);">Brak ćwiczeń</div>';
    return;
  }
  var groups = {};
  list.forEach(function(ex) { var m=ex.muscle||'Inne'; if(!groups[m]) groups[m]=[]; groups[m].push(ex); });
  var muscleOrder = ['Klatka','Plecy','Barki','Biceps','Triceps','Nogi','Pośladki','Brzuch','Łydki','Inne'];
  var usedOrder = _bibFilter.muscle !== 'all' ? [_bibFilter.muscle] : muscleOrder;
  var levelDots = {'łatwy':'🟢','średni':'🟡','zaawansowany':'🔴'};
  var html = '';
  usedOrder.forEach(function(m) {
    if (!groups[m]||!groups[m].length) return;
    if (_bibFilter.muscle==='all'&&!_bibFilter.fav)
      html += '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:12px 0 6px;">'+m+'</div>';
    groups[m].forEach(function(ex) {
      var isFav = favs.indexOf(ex.id)!==-1;
      html += '<div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:8px;cursor:pointer;" onclick="openBibDetail(\''+ex.id+'\')">'
        + '<div style="display:flex;align-items:flex-start;gap:8px;">'
        +   '<div style="flex:1;">'
        +     '<div style="font-weight:700;font-size:14px;margin-bottom:4px;">'+ex.name+'</div>'
        +     '<div style="display:flex;gap:5px;flex-wrap:wrap;">'
        +       '<span style="background:var(--accent-light);color:var(--accent);border-radius:20px;padding:2px 8px;font-size:11px;font-weight:600;">'+(ex.sub||ex.muscle)+'</span>'
        +       (ex.aux||[]).slice(0,2).map(function(a){return '<span style="background:var(--surface);border-radius:20px;padding:2px 8px;font-size:11px;color:var(--text3);">'+a+'</span>';}).join('')
        +       '<span style="font-size:11px;color:var(--text4);">'+(levelDots[ex.level]||'🟡')+' '+(ex.level||'')+'</span>'
        +     '</div>'
        +   '</div>'
        +   '<button onclick="event.stopPropagation();toggleExFav(\''+ex.id+'\',this)" style="background:none;border:none;font-size:20px;cursor:pointer;padding:0 4px;color:'+(isFav?'#ffb753':'var(--text4)')+';">'+(isFav?'⭐':'☆')+'</button>'
        + '</div></div>';
    });
  });
  listEl.innerHTML = html;
}

function openBibDetail(exId) {
  if (typeof openExerciseDetail === 'function') openExerciseDetail(exId);
}

// ── SŁOWNIK POJĘĆ ──
var SLOWNIK = [
  { term:'1RM (One Rep Max)',     def:'Maksymalny ciężar jaki możesz podnieść w jednym powtórzeniu.',                               ex:'Twój 1RM w bench press to 100kg.' },
  { term:'RIR (Reps In Reserve)', def:'Liczba powtórzeń jaką mógłbyś jeszcze wykonać przed osiągnięciem upadku.',                   ex:'RIR 2 = mogłeś zrobić jeszcze 2 powt.' },
  { term:'RPE (Rate of Perceived Exertion)', def:'Skala wysiłku 1-10. RPE 10 = absolutny upadek.',                                 ex:'Seria na RPE 8 = 2 powt. zapasu (RIR 2).' },
  { term:'Progressive Overload',  def:'Stopniowe zwiększanie obciążenia, objętości lub intensywności treningu.',                    ex:'Co tydzień dodaj 2.5kg lub 1 serię.' },
  { term:'Drop Set',              def:'Seria do upadku, po czym natychmiast zmniejszasz ciężar i kontynuujesz.',                    ex:'100kg do upadku → 80kg → 60kg bez przerwy.' },
  { term:'Super Set',             def:'Dwa ćwiczenia wykonywane bez przerwy, zazwyczaj antagonistyczne partie.',                    ex:'Biceps curl → triceps pushdown bez pauzy.' },
  { term:'Giant Set',             def:'Trzy lub więcej ćwiczeń pod rząd bez przerwy.',                                              ex:'Bench → OHP → Push-up → Dips bez przerwy.' },
  { term:'Tempo',                 def:'Szybkość faz ruchu: ekscentryczna/pauza/koncentryczna/pauza. Zapis 3-1-2-0.',               ex:'Tempo 3-0-1-0: 3 sek w dół, 1 sek w górę.' },
  { term:'ROM (Range of Motion)', def:'Pełny zakres ruchu w ćwiczeniu.',                                                            ex:'Pełny ROM w przysiądzie = uda poniżej poziomu.' },
  { term:'Deload',                def:'Tydzień z obniżonym obciążeniem ok. 40-60% dla regeneracji.',                                ex:'Co 4-6 tygodni tydzień deload dla uniknięcia przetrenowania.' },
  { term:'Failure (Upadek mięśniowy)', def:'Moment gdy nie możesz wykonać kolejnego powtórzenia z prawidłową techniką.',           ex:'Seria do upadku = ostatnie powt. nie wychodzi.' },
  { term:'Warm-up',               def:'Rozgrzewka przed treningiem: cardio + ćwiczenia mobilizacyjne + serie rozgrzewkowe.',        ex:'5 min orbitrek + 2 serie z 50% ciężaru roboczego.' },
  { term:'Cool-down',             def:'Wyciszenie po treningu: stretching, lekkie cardio, powolny powrót do normalnego tętna.',     ex:'10 min spokojny marsz + rozciąganie statyczne.' },
  { term:'Compound Exercise',     def:'Ćwiczenie wielostawowe angażujące wiele grup mięśniowych jednocześnie.',                     ex:'Przysiad, martwy ciąg, bench press, OHP.' },
  { term:'Isolation Exercise',    def:'Ćwiczenie jednostawowe skupiające się na jednej grupie mięśniowej.',                         ex:'Uginanie bicepsa, prostowanie tricepsa.' },
  { term:'Volume (Objętość)',     def:'Łączna liczba serii × powtórzenia × ciężar w danym treningu lub tygodniu.',                  ex:'10 serii × 8 powt. × 100kg = 8000kg objętości.' },
  { term:'Intensity (Intensywność)', def:'Procentowy stosunek ciężaru do 1RM.',                                                     ex:'80% 1RM przy 1RM=100kg = praca z 80kg.' },
  { term:'Frequency (Częstotliwość)', def:'Ile razy w tygodniu trenujesz daną partię mięśniową.',                                  ex:'Częstotliwość 2 = każda partia 2x w tygodniu.' },
  { term:'TUT (Time Under Tension)', def:'Czas pod napięciem — jak długo mięsień pracuje podczas serii.',                          ex:'Seria 8 powt. z tempem 3-0-2 = 40 sek TUT.' },
  { term:'Cheat Reps',            def:'Użycie rozmachu lub dodatkowych mięśni do wykonania trudnych powtórzeń na końcu serii.',     ex:'Kiwanie tułowiem przy ostatnich 2 powt. uginania.' },
  { term:'Rest-Pause',            def:'Krótka pauza 10-20 sek w środku serii do wykonania większej liczby powtórzeń.',             ex:'8 powt. → pauza 15 sek → 4 powt. → pauza → 3 powt.' },
  { term:'Mechanical Drop Set',   def:'Zmiana wariantu ćwiczenia (nie ciężaru) gdy osiągniesz upadek.',                            ex:'Dumbbell incline press → flat press → floor press.' },
  { term:'AMRAP',                 def:'As Many Reps As Possible — jak najwięcej powtórzeń w danym czasie lub serii.',              ex:'AMRAP 5 minut: max pompki.' },
  { term:'EMOM',                  def:'Every Minute On the Minute — określona praca co minutę przez X minut.',                     ex:'EMOM 10 min: 5 pull-upów na starcie każdej minuty.' },
  { term:'HIIT',                  def:'High Intensity Interval Training — naprzemienny wysiłek maksymalny i odpoczynek.',          ex:'20 sek sprint / 40 sek marsz × 10 rund.' },
];

var _slownikSearch = '';

function renderBibSlownik(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<input id="slownik-search" class="form-input" placeholder="🔍 Szukaj pojęcia..." style="margin-bottom:12px;" oninput="_slownikSearch=this.value;renderSlownikList()">'
    + '<div id="slownik-list"></div>'
    + '</div>';
  renderSlownikList();
}

function renderSlownikList() {
  var el = document.getElementById('slownik-list');
  if (!el) return;
  var q = _slownikSearch.toLowerCase();
  var list = SLOWNIK.filter(function(s) {
    return !q || s.term.toLowerCase().indexOf(q) !== -1 || s.def.toLowerCase().indexOf(q) !== -1;
  });
  if (!list.length) { el.innerHTML='<div style="text-align:center;padding:24px;color:var(--text4);">Brak wyników</div>'; return; }
  el.innerHTML = list.map(function(s) {
    return '<div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:8px;">'
      + '<div style="font-size:14px;font-weight:800;color:var(--accent);margin-bottom:6px;">'+s.term+'</div>'
      + '<div style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:6px;">'+s.def+'</div>'
      + '<div style="font-size:12px;color:var(--text3);background:var(--surface);border-radius:8px;padding:6px 10px;">💡 '+s.ex+'</div>'
      + '</div>';
  }).join('');
}

// ── ZAMIENNIKI ĆWICZEŃ ──
var ZAMIENNIKI = {
  'e1':  ['p9','p5','e4b','f3','e3b','p4'],
  'e2':  ['p9','e2b','e2c','f4','e3c'],
  'e4':  ['f9','f10','f11','p6','p7','p8','p26','p27'],
  'e6':  ['g11','g12','e6b','e6c','g13','g14','g15','p216'],
  'e6b': ['p167','g15','e6c'],
  'e7':  ['e7b','p34','p35','e9','p51','p69','p70','p71'],
  'e8':  ['e8b','e10','g4','g5','g6','g3','p32','p33','p38'],
  'e9':  ['g7','g8','p62','p64','p65','p50'],
  'e10': ['g5','p44','p66','g19'],
  'e11': ['e11b','e11c','e11d','e11e','k3','k4','k5','p203','p205'],
  'e11d':['e11','e11e','k17','p187','p182','p192','k27'],
  'e12': ['e12b','e12c','k15','k16','p160','p166','p190'],
  'e13': ['p186','p191','k15','p164'],
  'e14': ['e14b','k10','k11','k12','p185','p198'],
  'e15': ['e15b','k18','k19','k20','k21','p202','p210'],
  'e16': ['e16b','e16d','l2','l1','p181'],
  'e16c':['k25','k26','p171','p193','p195','p179'],
  'e17': ['e17b','e17c','h2','h4','p93','p99','p101','p102'],
  'e18': ['e18b','h3','h5','p96','p98','p103'],
  'e19': ['h6','p85','p87','p92'],
  'e19b':['p77','p84','p94','p109'],
  'e20': ['e21','e21b','e21c','e21d','e21e','i3','i4','i6'],
  'e21': ['e20','e21b','e21c','i10'],
  'e22': ['p153','p152','j1','j2','p140','p141'],
  'e23': ['e23c','j7','p142','p150'],
  'e23b':['e23e','p154','j3','j4','j10'],
  'e24': ['e26f','m11','m12','p231'],
  'e25': ['e25b','p223','p225','m14','m15'],
  'e26': ['e26b','m3','m7','p221','p222'],
  'e10b':['h11','p81'],
  'e10d':['p52','p54','p76','p53'],
  'h11': ['e10b','p81','h6'],
  'n6':  ['p238','p264','p261'],
};

var _zamMuscle = null;
var _zamExId   = null;

var ZAM_MUSCLE_ICONS = {
  'Klatka':'🎯','Plecy':'🔙','Barki':'🏋️','Biceps':'💪','Triceps':'💪',
  'Nogi':'🦵','Pośladki':'🍑','Brzuch':'🧱','Łydki':'🦶'
};
var ZAM_MUSCLE_ORDER = ['Klatka','Plecy','Barki','Biceps','Triceps','Nogi','Pośladki','Brzuch','Łydki'];

// Poziom 1: lista partii mięśniowych
function renderBibZamienniki(el) {
  _zamMuscle = null;
  _zamExId   = null;
  el.innerHTML = '<div id="zam-nav"></div>';
  renderZamMuscles();
}

function renderZamMuscles() {
  var nav = document.getElementById('zam-nav');
  if (!nav) return;
  var all = typeof getAllExercises==='function' ? getAllExercises() : EXERCISES;
  var counts = {};
  Object.keys(ZAMIENNIKI).forEach(function(id) {
    var ex = all.find(function(e){ return e.id===id; });
    if (!ex) return;
    var m = ex.muscle || 'Inne';
    counts[m] = (counts[m]||0) + 1;
  });
  var html = '<div style="padding:0 16px;">'
    + '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Wybierz partię mięśniową, aby znaleźć zamienniki ćwiczeń.</div>';
  var any = false;
  ZAM_MUSCLE_ORDER.forEach(function(m) {
    if (!counts[m]) return;
    any = true;
    html += '<div onclick="selectZamMuscle(\''+m+'\')" style="background:var(--surface2);border-radius:16px;padding:14px 16px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:14px;">'
      + '<span style="font-size:28px;">'+(ZAM_MUSCLE_ICONS[m]||'💪')+'</span>'
      + '<div style="flex:1;"><div style="font-size:15px;font-weight:700;">'+m+'</div>'
      + '<div style="font-size:12px;color:var(--text3);margin-top:2px;">'+counts[m]+' ćwiczeń z zamiennikami</div></div>'
      + '<div style="color:var(--text4);font-size:20px;">›</div>'
      + '</div>';
  });
  if (!any) html += '<div style="text-align:center;padding:24px;color:var(--text4);">Brak danych o zamiennikach.</div>';
  html += '</div>';
  nav.innerHTML = html;
}

// Poziom 2: lista ćwiczeń danej partii (tylko te posiadające zamienniki w bazie)
function selectZamMuscle(muscle) {
  _zamMuscle = muscle;
  _zamExId   = null;
  var nav = document.getElementById('zam-nav');
  if (!nav) return;
  var all = typeof getAllExercises==='function' ? getAllExercises() : EXERCISES;
  var list = Object.keys(ZAMIENNIKI)
    .map(function(id){ return all.find(function(e){ return e.id===id; }); })
    .filter(function(ex){ return ex && ex.muscle===muscle; });
  var html = '<button onclick="renderZamMuscles()" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 16px 12px;">← Partie mięśniowe</button>'
    + '<div style="padding:0 16px;">'
    + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">'+(ZAM_MUSCLE_ICONS[muscle]||'')+' '+muscle+'</div>';
  if (!list.length) {
    html += '<div style="text-align:center;padding:24px;color:var(--text4);">Brak ćwiczeń w tej partii.</div>';
  } else {
    list.forEach(function(ex) {
      html += '<div onclick="selectZamEx(\''+ex.id+'\')" style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">'
        + '<div><div style="font-weight:600;font-size:13px;">'+ex.name+'</div>'
        + '<div style="font-size:11px;color:var(--text3);">'+(ex.sub||ex.muscle)+' · <span style="color:var(--accent);">'+ZAMIENNIKI[ex.id].length+' zamienników</span></div></div>'
        + '<div style="color:var(--text4);">›</div>'
        + '</div>';
    });
  }
  html += '</div>';
  nav.innerHTML = html;
}

// Poziom 3: zamienniki dla wybranego ćwiczenia
function selectZamEx(id) {
  _zamExId = id;
  var all = typeof getAllExercises==='function' ? getAllExercises() : EXERCISES;
  var ex = all.find(function(e){ return e.id===id; });
  var nav = document.getElementById('zam-nav');
  if (!nav || !ex) return;
  var altIds = ZAMIENNIKI[id] || [];
  var levelDots = {'łatwy':'🟢','średni':'🟡','zaawansowany':'🔴'};
  var equipMap  = {'wielostawowe':'Sztanga/Hantle','izolacyjne':'Maszyna/Wyciąg','kalisteniczne':'Masa ciała','cardio':'Brak sprzętu'};
  var html = '<button onclick="selectZamMuscle(\''+_zamMuscle+'\')" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 16px 12px;">← '+_zamMuscle+'</button>'
    + '<div style="padding:0 16px;">'
    + '<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text3);">Zamienniki dla: <span style="color:var(--text);">'+ex.name+'</span></div>';
  if (!altIds.length) {
    html += '<div style="background:var(--surface2);border-radius:14px;padding:16px;text-align:center;color:var(--text3);">Brak zamienników w bazie.</div>';
  } else {
    altIds.forEach(function(altId) {
      var alt = all.find(function(e){ return e.id===altId; });
      if (!alt) return;
      html += '<div onclick="openBibDetail(\''+altId+'\')" style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-bottom:6px;cursor:pointer;">'
        + '<div style="font-weight:600;font-size:13px;margin-bottom:4px;">'+alt.name+'</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;">'
        + '<span style="background:var(--accent-light);color:var(--accent);border-radius:20px;padding:2px 8px;font-size:11px;font-weight:600;">'+(alt.sub||alt.muscle)+'</span>'
        + '<span style="background:var(--surface);border-radius:20px;padding:2px 8px;font-size:11px;color:var(--text3);">'+(equipMap[alt.category]||alt.category||'')+'</span>'
        + '<span style="font-size:11px;color:var(--text4);">'+(levelDots[alt.level]||'🟡')+' '+(alt.level||'')+'</span>'
        + '</div></div>';
    });
  }
  html += '</div>';
  nav.innerHTML = html;
}

// ── KALKULATORY ──
// Modułowa architektura: każdy kalkulator to wpis w KALKULATORY_LIST (kafelek)
// + funkcja renderująca w KALKULATORY_RENDERERS. Aby dodać kolejny kalkulator,
// wystarczy dopisać wpis do listy i funkcję renderKalkXxx(el).
var KALKULATORY_LIST = [
  { key:'1rm',      icon:'🏋️', title:'Kalkulator 1RM',    sub:'Oblicz swój maksymalny ciężar' },
  { key:'objetosc', icon:'📊', title:'Objętość treningowa', sub:'Ciężar × Serie × Powtórzenia' },
  { key:'tdee',     icon:'🔥', title:'TDEE',                sub:'Całkowite dzienne zapotrzebowanie kaloryczne' },
  { key:'makro',    icon:'🍗', title:'Makroskładniki',      sub:'Białko / węglowodany / tłuszcze' },
  { key:'bmi',      icon:'⚖️', title:'BMI',                 sub:'Wskaźnik masy ciała' },
  { key:'ffmi',     icon:'💪', title:'FFMI',                sub:'Wskaźnik beztłuszczowej masy ciała' },
  { key:'tempo',    icon:'🏃', title:'Tempo biegu',         sub:'Tempo i przewidywane czasy na dystansach' },
];

var KALKULATORY_RENDERERS = {
  '1rm':      renderKalk1RM,
  'objetosc': renderKalkObjetosc,
  'tdee':     renderKalkTDEE,
  'makro':    renderKalkMakro,
  'bmi':      renderKalkBMI,
  'ffmi':     renderKalkFFMI,
  'tempo':    renderKalkTempo,
};

function renderWiecejKalkulatory(el) {
  var html = '<div style="padding:0 16px;">';
  KALKULATORY_LIST.forEach(function(c) {
    html += '<div onclick="showKalkulator(\''+c.key+'\')" style="background:var(--surface2);border-radius:16px;padding:16px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;gap:14px;">'
      + '<span style="font-size:32px;">'+c.icon+'</span>'
      + '<div><div style="font-size:15px;font-weight:700;">'+c.title+'</div>'
      + '<div style="font-size:12px;color:var(--text3);margin-top:2px;">'+c.sub+'</div></div>'
      + '<div style="margin-left:auto;color:var(--text4);font-size:20px;">›</div>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

function showKalkulator(key) {
  var cfg = KALKULATORY_LIST.find(function(c){ return c.key===key; });
  var titleEl = document.getElementById('wiecej-subview-title');
  if (titleEl) titleEl.textContent = cfg ? (cfg.icon+' '+cfg.title) : key;
  var content = document.getElementById('wiecej-subview-content');
  if (!content) return;
  content.innerHTML = '<button onclick="showWiecej(\'kalkulatory\')" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer;padding:0 16px 12px;">← Kalkulatory</button>'
    + '<div id="kalk-content"></div>';
  var sec = document.getElementById('kalk-content');
  var renderFn = KALKULATORY_RENDERERS[key];
  if (renderFn) renderFn(sec);
}

// Pomocnicze: ostatni wpis pomiarów (waga/wzrost) do wstępnego uzupełnienia pól
function _kalkLatestMeasurement() {
  return typeof getLatestMeasurementEntry === 'function' ? getLatestMeasurementEntry() : null;
}

function renderKalk1RM(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card" style="margin-bottom:12px;">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Podaj ciężar i liczbę powtórzeń, a obliczę Twój szacowany 1RM (formuła Epley).</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Ciężar (kg)</label><input id="k1rm-weight" class="form-input" type="number" min="1" placeholder="100" oninput="calc1RM()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Powtórzenia</label><input id="k1rm-reps" class="form-input" type="number" min="1" max="30" placeholder="5" oninput="calc1RM()"></div>'
    +   '</div>'
    +   '<div id="k1rm-result"></div>'
    + '</div>'
    + '</div>';
}

function calc1RM() {
  var w = parseFloat(document.getElementById('k1rm-weight').value);
  var r = parseInt(document.getElementById('k1rm-reps').value);
  var el = document.getElementById('k1rm-result');
  if (!el) return;
  if (!w || !r || r < 1) { el.innerHTML=''; return; }
  var e1rm = w * (1 + r/30);
  var pcts = [50,60,70,75,80,85,90,95,100];
  var html = '<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:12px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);">Szacowany 1RM</div>'
    + '<div style="font-size:36px;font-weight:800;color:var(--accent);">'+Math.round(e1rm)+' kg</div>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Sugerowane ciężary</div>';
  pcts.forEach(function(p) {
    var kg = Math.round(e1rm * p/100 * 4) / 4;
    var barW = p;
    var isHighlight = p === 80 || p === 85;
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
      + '<div style="width:36px;font-size:12px;color:'+(isHighlight?'var(--accent)':'var(--text3)')+';font-weight:'+(isHighlight?'700':'400')+';">'+p+'%</div>'
      + '<div style="flex:1;background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;">'
      +   '<div style="width:'+barW+'%;height:100%;background:'+(isHighlight?'var(--accent)':'var(--surface3)')+';border-radius:4px;"></div>'
      + '</div>'
      + '<div style="width:60px;text-align:right;font-size:13px;font-weight:'+(isHighlight?'700':'400')+';color:'+(isHighlight?'var(--accent)':'var(--text)')+';">'+kg+' kg</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

function renderKalkObjetosc(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Oblicz całkowitą objętość treningową dla danego ćwiczenia.</div>'
    +   '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">'
    +     '<div><label class="form-label">Ciężar (kg)</label><input id="kobj-weight" class="form-input" type="number" min="0" placeholder="80" oninput="calcObjetosc()"></div>'
    +     '<div><label class="form-label">Serie</label><input id="kobj-sets" class="form-input" type="number" min="1" placeholder="4" oninput="calcObjetosc()"></div>'
    +     '<div><label class="form-label">Powt.</label><input id="kobj-reps" class="form-input" type="number" min="1" placeholder="8" oninput="calcObjetosc()"></div>'
    +   '</div>'
    +   '<div id="kobj-result"></div>'
    + '</div>'
    + '</div>';
}

function calcObjetosc() {
  var w = parseFloat(document.getElementById('kobj-weight').value);
  var s = parseInt(document.getElementById('kobj-sets').value);
  var r = parseInt(document.getElementById('kobj-reps').value);
  var el = document.getElementById('kobj-result');
  if (!el) return;
  if (!w || !s || !r) { el.innerHTML=''; return; }
  var vol = w * s * r;
  var tons = (vol/1000).toFixed(2);
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:16px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);margin-bottom:4px;">Objętość treningowa</div>'
    + '<div style="font-size:36px;font-weight:800;color:var(--accent);">'+vol.toLocaleString('pl')+' kg</div>'
    + '<div style="font-size:13px;color:var(--text3);margin-top:4px;">'+(tons)+' ton</div>'
    + '<div style="margin-top:14px;padding-top:14px;border-top:.5px solid var(--border2);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'
    + _kObjStat('⚖️ Ciężar',w+' kg')+_kObjStat('🔢 Serie',s)+_kObjStat('🔁 Powt.',r)
    + '</div></div>';
}

function _kObjStat(label, val) {
  return '<div style="text-align:center;"><div style="font-size:11px;color:var(--text3);">'+label+'</div><div style="font-size:15px;font-weight:700;">'+val+'</div></div>';
}

// ── TDEE ──
function renderKalkTDEE(el) {
  var m = _kalkLatestMeasurement();
  var defW = m && m.weight != null ? m.weight : '';
  var defH = m && m.height != null ? m.height : '';
  var defGender = (state.settings && state.settings.gender) || 'male';
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Oblicz całkowite dzienne zapotrzebowanie kaloryczne (formuła Mifflin-St Jeor).</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Waga (kg)</label><input id="tdee-weight" class="form-input" type="number" step="0.1" value="'+defW+'" placeholder="80" oninput="calcTDEE()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Wzrost (cm)</label><input id="tdee-height" class="form-input" type="number" step="0.1" value="'+defH+'" placeholder="180" oninput="calcTDEE()"></div>'
    +   '</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Wiek</label><input id="tdee-age" class="form-input" type="number" min="1" placeholder="25" oninput="calcTDEE()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Płeć</label><select id="tdee-gender" class="form-input" onchange="calcTDEE()">'
    +       '<option value="male"'+(defGender==='male'?' selected':'')+'>Mężczyzna</option>'
    +       '<option value="female"'+(defGender==='female'?' selected':'')+'>Kobieta</option>'
    +     '</select></div>'
    +   '</div>'
    +   '<div class="form-group" style="margin-bottom:10px;"><label class="form-label">Poziom aktywności</label>'
    +     '<select id="tdee-activity" class="form-input" onchange="calcTDEE()">'
    +       '<option value="1.2">Siedzący (brak aktywności)</option>'
    +       '<option value="1.375">Lekko aktywny (1-3x/tydz.)</option>'
    +       '<option value="1.55" selected>Umiarkowanie aktywny (3-5x/tydz.)</option>'
    +       '<option value="1.725">Bardzo aktywny (6-7x/tydz.)</option>'
    +       '<option value="1.9">Ekstremalnie aktywny (sport + praca fizyczna)</option>'
    +     '</select>'
    +   '</div>'
    +   '<div id="tdee-result"></div>'
    + '</div>'
    + '</div>';
  calcTDEE();
}

function calcTDEE() {
  var w = parseFloat(document.getElementById('tdee-weight').value);
  var h = parseFloat(document.getElementById('tdee-height').value);
  var age = parseFloat(document.getElementById('tdee-age').value);
  var gender = document.getElementById('tdee-gender').value;
  var act = parseFloat(document.getElementById('tdee-activity').value);
  var el = document.getElementById('tdee-result');
  if (!el) return;
  if (!w || !h || !age) { el.innerHTML=''; return; }
  var bmr = gender==='male' ? (10*w + 6.25*h - 5*age + 5) : (10*w + 6.25*h - 5*age - 161);
  var tdee = bmr * act;
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:10px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);">Twoje TDEE</div>'
    + '<div style="font-size:36px;font-weight:800;color:var(--accent);">'+Math.round(tdee)+' kcal</div>'
    + '<div style="font-size:12px;color:var(--text3);margin-top:4px;">BMR: '+Math.round(bmr)+' kcal</div>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Kalorie wg celu</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'
    + _kObjStat('📉 Redukcja', Math.round(tdee*0.8)+' kcal')
    + _kObjStat('⚖️ Utrzymanie', Math.round(tdee)+' kcal')
    + _kObjStat('📈 Masa', Math.round(tdee*1.15)+' kcal')
    + '</div>';
}

// ── MAKROSKŁADNIKI ──
function renderKalkMakro(el) {
  var m = _kalkLatestMeasurement();
  var defW = m && m.weight != null ? m.weight : '';
  var defH = m && m.height != null ? m.height : '';
  var defGender = (state.settings && state.settings.gender) || 'male';
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Rozkład makroskładników na podstawie TDEE i wybranego celu.</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Waga (kg)</label><input id="mak-weight" class="form-input" type="number" step="0.1" value="'+defW+'" placeholder="80" oninput="calcMakro()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Wzrost (cm)</label><input id="mak-height" class="form-input" type="number" step="0.1" value="'+defH+'" placeholder="180" oninput="calcMakro()"></div>'
    +   '</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Wiek</label><input id="mak-age" class="form-input" type="number" min="1" placeholder="25" oninput="calcMakro()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Płeć</label><select id="mak-gender" class="form-input" onchange="calcMakro()">'
    +       '<option value="male"'+(defGender==='male'?' selected':'')+'>Mężczyzna</option>'
    +       '<option value="female"'+(defGender==='female'?' selected':'')+'>Kobieta</option>'
    +     '</select></div>'
    +   '</div>'
    +   '<div class="form-group" style="margin-bottom:10px;"><label class="form-label">Poziom aktywności</label>'
    +     '<select id="mak-activity" class="form-input" onchange="calcMakro()">'
    +       '<option value="1.2">Siedzący</option>'
    +       '<option value="1.375">Lekko aktywny</option>'
    +       '<option value="1.55" selected>Umiarkowanie aktywny</option>'
    +       '<option value="1.725">Bardzo aktywny</option>'
    +       '<option value="1.9">Ekstremalnie aktywny</option>'
    +     '</select>'
    +   '</div>'
    +   '<div class="form-group" style="margin-bottom:10px;"><label class="form-label">Cel</label>'
    +     '<select id="mak-goal" class="form-input" onchange="calcMakro()">'
    +       '<option value="cut">Redukcja</option>'
    +       '<option value="maint" selected>Utrzymanie</option>'
    +       '<option value="bulk">Masa</option>'
    +     '</select>'
    +   '</div>'
    +   '<div id="makro-result"></div>'
    + '</div>'
    + '</div>';
  calcMakro();
}

function calcMakro() {
  var w = parseFloat(document.getElementById('mak-weight').value);
  var h = parseFloat(document.getElementById('mak-height').value);
  var age = parseFloat(document.getElementById('mak-age').value);
  var gender = document.getElementById('mak-gender').value;
  var act = parseFloat(document.getElementById('mak-activity').value);
  var goal = document.getElementById('mak-goal').value;
  var el = document.getElementById('makro-result');
  if (!el) return;
  if (!w || !h || !age) { el.innerHTML=''; return; }
  var bmr = gender==='male' ? (10*w + 6.25*h - 5*age + 5) : (10*w + 6.25*h - 5*age - 161);
  var tdee = bmr * act;
  var calMult = goal==='cut' ? 0.8 : (goal==='bulk' ? 1.15 : 1);
  var calories = tdee * calMult;
  var proteinG = Math.round(w * 2);
  var fatG = Math.round(calories * 0.25 / 9);
  var proteinKcal = proteinG*4, fatKcal = fatG*9;
  var carbsKcal = Math.max(0, calories - proteinKcal - fatKcal);
  var carbsG = Math.round(carbsKcal/4);
  var goalLabel = goal==='cut' ? 'Redukcja' : (goal==='bulk' ? 'Masa' : 'Utrzymanie');
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:12px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);">Cel kaloryczny (' + goalLabel + ')</div>'
    + '<div style="font-size:32px;font-weight:800;color:var(--accent);">'+Math.round(calories)+' kcal</div>'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;">'
    + _kMacroBar('🥩 Białko', proteinG, proteinKcal, calories, 'var(--red)')
    + _kMacroBar('🍚 Węglowodany', carbsG, carbsKcal, calories, 'var(--accent)')
    + _kMacroBar('🥑 Tłuszcze', fatG, fatKcal, calories, 'var(--yellow)')
    + '</div>';
}

function _kMacroBar(label, grams, kcal, totalKcal, color) {
  var pct = totalKcal > 0 ? Math.round(kcal/totalKcal*100) : 0;
  return '<div>'
    + '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span style="color:var(--text3);">'+label+'</span><span style="font-weight:700;">'+grams+' g · '+pct+'%</span></div>'
    + '<div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:'+color+';border-radius:4px;"></div></div>'
    + '</div>';
}

// ── BMI ──
function renderKalkBMI(el) {
  var m = _kalkLatestMeasurement();
  var defW = m && m.weight != null ? m.weight : '';
  var defH = m && m.height != null ? m.height : '';
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Oblicz swój wskaźnik masy ciała (BMI).</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Waga (kg)</label><input id="bmi-weight" class="form-input" type="number" step="0.1" value="'+defW+'" placeholder="80" oninput="calcBMI()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Wzrost (cm)</label><input id="bmi-height" class="form-input" type="number" step="0.1" value="'+defH+'" placeholder="180" oninput="calcBMI()"></div>'
    +   '</div>'
    +   '<div id="bmi-result"></div>'
    + '</div>'
    + '</div>';
  calcBMI();
}

function calcBMI() {
  var w = parseFloat(document.getElementById('bmi-weight').value);
  var h = parseFloat(document.getElementById('bmi-height').value);
  var el = document.getElementById('bmi-result');
  if (!el) return;
  if (!w || !h) { el.innerHTML=''; return; }
  var hm = h/100;
  var bmi = w/(hm*hm);
  var cat, color;
  if (bmi < 18.5)      { cat='Niedowaga'; color='var(--blue)'; }
  else if (bmi < 25)   { cat='Norma';     color='var(--green)'; }
  else if (bmi < 30)   { cat='Nadwaga';   color='var(--yellow)'; }
  else                 { cat='Otyłość';   color='var(--red)'; }
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:16px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);margin-bottom:4px;">Twoje BMI</div>'
    + '<div style="font-size:36px;font-weight:800;color:'+color+';">'+bmi.toFixed(1)+'</div>'
    + '<div style="font-size:14px;font-weight:700;color:'+color+';margin-top:4px;">'+cat+'</div>'
    + '</div>';
}

// ── FFMI ──
function renderKalkFFMI(el) {
  var m = _kalkLatestMeasurement();
  var defW = m && m.weight != null ? m.weight : '';
  var defH = m && m.height != null ? m.height : '';
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Fat-Free Mass Index — wskaźnik beztłuszczowej masy mięśniowej.</div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Waga (kg)</label><input id="ffmi-weight" class="form-input" type="number" step="0.1" value="'+defW+'" placeholder="80" oninput="calcFFMI()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Wzrost (cm)</label><input id="ffmi-height" class="form-input" type="number" step="0.1" value="'+defH+'" placeholder="180" oninput="calcFFMI()"></div>'
    +   '</div>'
    +   '<div class="form-group" style="margin-bottom:10px;"><label class="form-label">Tkanka tłuszczowa (%)</label><input id="ffmi-bf" class="form-input" type="number" step="0.1" placeholder="15" oninput="calcFFMI()"></div>'
    +   '<div id="ffmi-result"></div>'
    + '</div>'
    + '</div>';
  calcFFMI();
}

function calcFFMI() {
  var w = parseFloat(document.getElementById('ffmi-weight').value);
  var h = parseFloat(document.getElementById('ffmi-height').value);
  var bf = parseFloat(document.getElementById('ffmi-bf').value);
  var el = document.getElementById('ffmi-result');
  if (!el) return;
  if (!w || !h || isNaN(bf)) { el.innerHTML=''; return; }
  var hm = h/100;
  var leanMass = w * (1 - bf/100);
  var ffmi = (leanMass / (hm*hm)) + 6.1*(1.8 - hm);
  var interpretation, color;
  if (ffmi < 18)       { interpretation='Poniżej przeciętnej';                              color='var(--blue)'; }
  else if (ffmi < 20)  { interpretation='Przeciętna';                                       color='var(--text)'; }
  else if (ffmi < 22)  { interpretation='Ponadprzeciętna';                                  color='var(--green)'; }
  else if (ffmi < 25)  { interpretation='Bardzo dobra (blisko naturalnego limitu)';          color='var(--accent)'; }
  else                 { interpretation='Wyjątkowo wysoka (powyżej typowego naturalnego zakresu)'; color='var(--yellow)'; }
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:16px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);margin-bottom:4px;">Twój FFMI</div>'
    + '<div style="font-size:36px;font-weight:800;color:'+color+';">'+ffmi.toFixed(1)+'</div>'
    + '<div style="font-size:13px;font-weight:600;color:'+color+';margin-top:4px;">'+interpretation+'</div>'
    + '<div style="font-size:11px;color:var(--text4);margin-top:8px;">Masa beztłuszczowa: '+leanMass.toFixed(1)+' kg</div>'
    + '</div>';
}

// ── TEMPO BIEGU ──
function renderKalkTempo(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    + '<div class="card">'
    +   '<div style="font-size:13px;color:var(--text3);margin-bottom:12px;">Podaj dystans i czas, aby obliczyć tempo oraz przewidywane wyniki na innych dystansach (formuła Riegela).</div>'
    +   '<div class="form-group" style="margin-bottom:10px;"><label class="form-label">Dystans (km)</label><input id="tempo-dist" class="form-input" type="number" step="0.01" min="0.1" placeholder="5" oninput="calcTempoBiegu()"></div>'
    +   '<div style="display:flex;gap:8px;margin-bottom:10px;">'
    +     '<div style="flex:1;"><label class="form-label">Czas — minuty</label><input id="tempo-min" class="form-input" type="number" min="0" placeholder="25" oninput="calcTempoBiegu()"></div>'
    +     '<div style="flex:1;"><label class="form-label">Czas — sekundy</label><input id="tempo-sec" class="form-input" type="number" min="0" max="59" placeholder="30" oninput="calcTempoBiegu()"></div>'
    +   '</div>'
    +   '<div id="tempo-result"></div>'
    + '</div>'
    + '</div>';
}

function _fmtPace(secPerKm) {
  var mm = Math.floor(secPerKm/60);
  var ss = Math.round(secPerKm%60);
  if (ss === 60) { mm++; ss = 0; }
  return mm+':'+(ss<10?'0':'')+ss+' /km';
}

function _fmtDuration(totalSec) {
  var h = Math.floor(totalSec/3600);
  var m = Math.floor((totalSec%3600)/60);
  var s = Math.round(totalSec%60);
  if (s === 60) { s = 0; m++; }
  if (m === 60) { m = 0; h++; }
  var mm = (m<10?'0':'')+m;
  var ss = (s<10?'0':'')+s;
  return h > 0 ? (h+':'+mm+':'+ss) : (mm+':'+ss);
}

function calcTempoBiegu() {
  var dist = parseFloat(document.getElementById('tempo-dist').value);
  var min = parseFloat(document.getElementById('tempo-min').value) || 0;
  var sec = parseFloat(document.getElementById('tempo-sec').value) || 0;
  var el = document.getElementById('tempo-result');
  if (!el) return;
  var totalSec = min*60 + sec;
  if (!dist || !totalSec) { el.innerHTML=''; return; }
  var paceSecPerKm = totalSec / dist;
  var distances = [
    { label:'5 km',        km:5 },
    { label:'10 km',       km:10 },
    { label:'Półmaraton',  km:21.0975 },
    { label:'Maraton',     km:42.195 }
  ];
  var predHtml = distances.map(function(d) {
    var predSec = totalSec * Math.pow(d.km/dist, 1.06);
    var isCurrent = Math.abs(d.km-dist) < 0.05;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:.5px solid var(--border2);">'
      + '<span style="font-size:13px;color:var(--text3);">'+d.label+(isCurrent?' <span style="color:var(--accent);">(Twój wynik)</span>':'')+'</span>'
      + '<span style="font-size:14px;font-weight:700;">'+_fmtDuration(predSec)+'</span>'
      + '</div>';
  }).join('');
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:12px;text-align:center;">'
    + '<div style="font-size:13px;color:var(--text3);">Twoje tempo</div>'
    + '<div style="font-size:32px;font-weight:800;color:var(--accent);">'+_fmtPace(paceSecPerKm)+'</div>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Przewidywane czasy</div>'
    + predHtml;
}

