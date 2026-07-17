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
    biblioteka:  '📚 Biblioteka ćwiczeń'
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

function renderWiecejBiblioteka(el) {
  el.innerHTML =
    '<div style="padding:0 16px;">'
    // Wyszukiwarka
    + '<div style="position:relative;margin-bottom:10px;">'
    +   '<input id="bib-search" class="form-input" placeholder="🔍 Szukaj ćwiczenia..." style="padding-left:12px;"'
    +   ' oninput="_bibFilter.search=this.value;renderBibList()">'
    + '</div>'
    // Filtry partii + ulubione
    + '<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;margin-bottom:4px;" id="bib-muscle-chips">'
    +   _buildBibChips()
    + '</div>'
    // Lista
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
    html += '<button class="prog-tab'+active+'" onclick="setBibMuscle(\''+m+'\',this)">'+labels[i]+'</button>';
  });
  html += '<button class="prog-tab'+(_bibFilter.fav?' active':'')
        + '" onclick="toggleBibFav(this)" style="white-space:nowrap;">⭐ Ulubione</button>';
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

function saveBibFavs(favs) {
  localStorage.setItem('gymflow_fav_exercises', JSON.stringify(favs));
}

function toggleExFav(id, btn) {
  var favs = getBibFavs();
  var idx = favs.indexOf(id);
  if (idx > -1) { favs.splice(idx, 1); btn.textContent = '☆'; btn.style.color = 'var(--text4)'; }
  else           { favs.push(id);       btn.textContent = '⭐'; btn.style.color = '#ffb753'; }
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

  // Group by muscle
  var groups = {};
  list.forEach(function(ex) {
    var m = ex.muscle || 'Inne';
    if (!groups[m]) groups[m] = [];
    groups[m].push(ex);
  });

  var muscleOrder = ['Klatka','Plecy','Barki','Biceps','Triceps','Nogi','Pośladki','Brzuch','Łydki','Inne'];
  var html = '';
  var usedOrder = _bibFilter.muscle !== 'all' ? [_bibFilter.muscle] : muscleOrder;

  usedOrder.forEach(function(m) {
    if (!groups[m] || !groups[m].length) return;
    if (_bibFilter.muscle === 'all' && !_bibFilter.fav) {
      html += '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;'
            + 'letter-spacing:.5px;padding:12px 0 6px;">'+m+'</div>';
    }
    groups[m].forEach(function(ex) {
      var isFav = favs.indexOf(ex.id) !== -1;
      var levelColors = { 'łatwy':'var(--green)', 'średni':'var(--yellow)', 'zaawansowany':'var(--red)' };
      var levelDots   = { 'łatwy':'🟢', 'średni':'🟡', 'zaawansowany':'🔴' };
      html +=
        '<div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:8px;cursor:pointer;"'
        +' onclick="openBibDetail(\''+ex.id+'\')">'
        +  '<div style="display:flex;align-items:flex-start;gap:8px;">'
        +    '<div style="flex:1;">'
        +      '<div style="font-weight:700;font-size:14px;margin-bottom:4px;">'+ex.name+'</div>'
        +      '<div style="display:flex;gap:5px;flex-wrap:wrap;">'
        +        '<span style="background:var(--accent-light);color:var(--accent);border-radius:20px;padding:2px 8px;font-size:11px;font-weight:600;">'+(ex.sub||ex.muscle)+'</span>'
        +        (ex.aux||[]).slice(0,2).map(function(a){ return '<span style="background:var(--surface);border-radius:20px;padding:2px 8px;font-size:11px;color:var(--text3);">'+a+'</span>'; }).join('')
        +        '<span style="font-size:11px;color:var(--text4);">'+(levelDots[ex.level]||'🟡')+' '+(ex.level||'')+'</span>'
        +      '</div>'
        +    '</div>'
        +    '<button onclick="event.stopPropagation();toggleExFav(\''+ex.id+'\',this)"'
        +     ' style="background:none;border:none;font-size:20px;cursor:pointer;padding:0 4px;color:'+(isFav?'#ffb753':'var(--text4)')+';">'
        +      (isFav?'⭐':'☆')
        +    '</button>'
        +  '</div>'
        +'</div>';
    });
  });

  listEl.innerHTML = html;
}

function openBibDetail(exId) {
  // Używa istniejącej funkcji z exercise_detail.js
  if (typeof openExerciseDetail === 'function') {
    openExerciseDetail(exId);
  }
}
