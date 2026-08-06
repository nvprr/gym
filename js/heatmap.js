// ===================== HEATMAP.JS =====================
// Heatmapa aktywności treningowej — inspirowana GitHub Contribution Graph,
// dopasowana do stylu GymFlow (nie 1:1 kopia). Dane wyłącznie z istniejącego
// state.workouts — żaden nowy model danych. Współistnieje z prostym kalendarzem
// (js/workout.js: renderCalendar) jako osobna, bogatsza zakładka w Trening.
//
// Architektura źródeł (HEATMAP_SOURCES) — na przyszłość: dodanie heatmapy cardio
// lub nawodnienia to dopisanie kolejnego źródła (getEventsForDate/getEventWeight),
// bez przebudowy silnika renderowania/kolorowania poniżej.

var HEATMAP_SOURCES = {
  workouts: {
    key:'workouts', label:'Treningi',
    getEventsForDate: function(dateKey){
      return state.workouts.filter(function(w){ return _hmDateKey(w.date)===dateKey; });
    },
    // Waga zdarzenia użyta do liczenia intensywności dnia — tonaż, a gdy go brak
    // (np. bardzo krótki/testowy wpis) liczba ćwiczeń jako przybliżenie.
    getEventWeight: function(w){ return w.tonnage>0 ? w.tonnage : ((w.exercises||[]).length*100); },
  }
};
var _heatmapSourceKey = 'workouts';

// ── Stan zakresu (zapamiętywany między sesjami, jak inne preferencje UI w GymFlow) ──
var _heatmapRange = localStorage.getItem('gymflow_heatmap_range') || 'month';
var _heatmapWeekMonday = typeof getWeekMonday==='function' ? getWeekMonday(new Date()) : new Date();
var _heatmapMonth = new Date().getMonth();
var _heatmapMonthYear = new Date().getFullYear();
var _heatmapYear = new Date().getFullYear();

var DAYS_PL_SHORT = ['Pn','Wt','Śr','Cz','Pt','Sb','Nd'];
var MONTHS_PL = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
var MONTHS_PL_SHORT = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'];

function _hmDateKey(d){
  var dt = new Date(d);
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
}
function _hmKeyFromYMD(y,m,d){ return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'); }

// ── Intensywność (0-4) — suma wag zdarzeń danego dnia względem maksimum
// zaobserwowanego w całej historii (kwartyle, podobnie jak GitHub). Kilka
// treningów tego samego dnia sumuje się automatycznie → ciemniejszy kwadrat. ──
var _heatmapCache = null;
function _heatmapComputeAll(){
  var source = HEATMAP_SOURCES[_heatmapSourceKey];
  var byDate = {};
  state.workouts.forEach(function(w){
    var key=_hmDateKey(w.date);
    byDate[key]=(byDate[key]||0)+source.getEventWeight(w);
  });
  var max=0;
  Object.keys(byDate).forEach(function(k){ if(byDate[k]>max) max=byDate[k]; });
  _heatmapCache = { byDate:byDate, max:max||1 };
  return _heatmapCache;
}

function _heatmapLevel(dateKey){
  if(!_heatmapCache) _heatmapComputeAll();
  var v = _heatmapCache.byDate[dateKey];
  if(!v) return 0;
  var ratio = v/_heatmapCache.max;
  if(ratio>0.75) return 4;
  if(ratio>0.5)  return 3;
  if(ratio>0.25) return 2;
  return 1;
}

// ===================== PRZEŁĄCZNIK ZAKRESU =====================

function setHeatmapRange(range){
  _heatmapRange = range;
  localStorage.setItem('gymflow_heatmap_range', range);
  renderHeatmap();
}

function renderHeatmap(){
  _heatmapComputeAll();

  document.querySelectorAll('#heatmap-range-segment .segment-btn').forEach(function(b){ b.classList.remove('active'); });
  var activeBtn=document.getElementById('heatmap-range-'+_heatmapRange);
  if(activeBtn) activeBtn.classList.add('active');

  var content = document.getElementById('heatmap-content');
  if(!content) return;

  // Płynne przejście przy zmianie zakresu / nawigacji (reużywa istniejącą .gf-fade-up)
  content.classList.remove('gf-fade-up');
  void content.offsetWidth;
  content.classList.add('gf-fade-up');

  if(_heatmapRange==='week') renderHeatmapWeek(content);
  else if(_heatmapRange==='year') renderHeatmapYear(content);
  else renderHeatmapMonth(content);

  renderHeatmapStats();
}

// ===================== WIDOK TYDZIEŃ =====================

function renderHeatmapWeek(content){
  var monday=_heatmapWeekMonday;
  var today=new Date(); today.setHours(0,0,0,0);
  var endLabel=new Date(monday); endLabel.setDate(endLabel.getDate()+6);
  var label = monday.toLocaleDateString('pl',{day:'numeric',month:'short'})+' – '+endLabel.toLocaleDateString('pl',{day:'numeric',month:'short',year:'numeric'});

  var cells='';
  for(var i=0;i<7;i++){
    var d=new Date(monday); d.setDate(d.getDate()+i);
    var key=_hmDateKey(d);
    var level=_heatmapLevel(key);
    var isToday=d.getTime()===today.getTime();
    cells += '<div style="text-align:center;">'
      + '<div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:6px;">'+DAYS_PL_SHORT[i]+'</div>'
      + '<div class="heat-day heat-'+level+(isToday?' today':'')+'" onclick="openHeatmapDaySheet(\''+key+'\')">'+d.getDate()+'</div>'
      + '</div>';
  }

  content.innerHTML =
    '<div class="card" style="padding:14px;">'
    +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +     '<button onclick="hmChangeWeek(-1)" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px 8px;">‹</button>'
    +     '<div style="font-size:14px;font-weight:700;">'+label+'</div>'
    +     '<button onclick="hmChangeWeek(1)" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px 8px;">›</button>'
    +   '</div>'
    +   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">'+cells+'</div>'
    + '</div>'
    + _heatmapLegendHtml();
}

function hmChangeWeek(dir){
  var d=new Date(_heatmapWeekMonday); d.setDate(d.getDate()+dir*7);
  _heatmapWeekMonday=d;
  renderHeatmap();
}

// ===================== WIDOK MIESIĄC =====================

function renderHeatmapMonth(content){
  var y=_heatmapMonthYear, m=_heatmapMonth;
  var firstDay=new Date(y,m,1).getDay();
  var startOffset=(firstDay+6)%7;
  var daysInMonth=new Date(y,m+1,0).getDate();
  var today=new Date();

  var headerCells = DAYS_PL_SHORT.map(function(d){
    return '<div style="text-align:center;font-size:10px;color:var(--text4);font-weight:600;padding:4px 0;">'+d+'</div>';
  }).join('');

  var cells='';
  for(var i=0;i<startOffset;i++) cells+='<div class="heat-day empty"></div>';
  for(var d=1; d<=daysInMonth; d++){
    var key=_hmKeyFromYMD(y,m,d);
    var level=_heatmapLevel(key);
    var isToday = d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
    cells += '<div class="heat-day heat-'+level+(isToday?' today':'')+'" onclick="openHeatmapDaySheet(\''+key+'\')">'+d+'</div>';
  }

  content.innerHTML =
    '<div class="card" style="padding:14px;">'
    +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">'
    +     '<button onclick="hmChangeMonth(-1)" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px 8px;">‹</button>'
    +     '<div style="font-size:16px;font-weight:700;">'+MONTHS_PL[m]+' '+y+'</div>'
    +     '<button onclick="hmChangeMonth(1)" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px 8px;">›</button>'
    +   '</div>'
    +   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px;">'+headerCells+'</div>'
    +   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;">'+cells+'</div>'
    + '</div>'
    + _heatmapLegendHtml();
}

function hmChangeMonth(dir){
  _heatmapMonth+=dir;
  if(_heatmapMonth<0){ _heatmapMonth=11; _heatmapMonthYear--; }
  if(_heatmapMonth>11){ _heatmapMonth=0; _heatmapMonthYear++; }
  renderHeatmap();
}

// ===================== WIDOK ROK =====================
// Najbliższy GitHubowi: cały rok podzielony na miesiące, każdy jako mini-siatka.

function renderHeatmapYear(content){
  var y=_heatmapYear;
  var today=new Date();
  var hasAnyData = state.workouts.some(function(w){ return new Date(w.date).getFullYear()===y; });

  var monthsHtml='';
  for(var m=0;m<12;m++){
    var firstDay=new Date(y,m,1).getDay();
    var startOffset=(firstDay+6)%7;
    var daysInMonth=new Date(y,m+1,0).getDate();
    var cells='';
    for(var i=0;i<startOffset;i++) cells+='<div class="heat-day-sm empty"></div>';
    for(var d=1; d<=daysInMonth; d++){
      var key=_hmKeyFromYMD(y,m,d);
      var level=_heatmapLevel(key);
      var isToday = d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
      cells += '<div class="heat-day-sm heat-'+level+(isToday?' today':'')+'" onclick="openHeatmapDaySheet(\''+key+'\')" title="'+d+' '+MONTHS_PL_SHORT[m]+'"></div>';
    }
    monthsHtml += '<div style="margin-bottom:14px;">'
      + '<div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;">'+MONTHS_PL_SHORT[m]+'</div>'
      + '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">'+cells+'</div>'
      + '</div>';
  }

  var nextDisabled = y>=today.getFullYear();
  content.innerHTML =
    '<div class="card" style="padding:14px;">'
    +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +     '<button onclick="hmChangeYear(-1)" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px 8px;">‹</button>'
    +     '<div style="font-size:16px;font-weight:700;">'+y+'</div>'
    +     '<button onclick="hmChangeYear(1)" style="background:none;border:none;color:'+(nextDisabled?'var(--text4)':'var(--accent)')+';font-size:20px;cursor:'+(nextDisabled?'default':'pointer')+';padding:4px 8px;" '+(nextDisabled?'disabled':'')+'>›</button>'
    +   '</div>'
    +   (hasAnyData ? monthsHtml : '<div style="text-align:center;color:var(--text4);padding:20px 0;font-size:13px;">Brak treningów w '+y+' roku.</div>')
    + '</div>'
    + _heatmapLegendHtml();
}

function hmChangeYear(dir){
  var today=new Date();
  var next=_heatmapYear+dir;
  if(next>today.getFullYear()) return;
  _heatmapYear=next;
  renderHeatmap();
}

// ===================== LEGENDA =====================

function _heatmapLegendHtml(){
  var labels=['Brak aktywności','Niska','Średnia','Wysoka','Bardzo wysoka'];
  return '<div style="margin:16px 16px 0;display:flex;flex-direction:column;gap:6px;">'
    + labels.map(function(lab,i){
        return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text3);">'
          + '<span class="heat-day-sm heat-'+i+'" style="width:16px;height:16px;cursor:default;flex-shrink:0;"></span>'+lab
          + '</div>';
      }).join('')
    + '</div>';
}

// ===================== STATYSTYKI NAD HEATMAPĄ =====================

function _heatmapRangeBounds(){
  if(_heatmapRange==='week'){
    var start=new Date(_heatmapWeekMonday); start.setHours(0,0,0,0);
    var end=new Date(start); end.setDate(end.getDate()+7);
    return { start:start, end:end };
  }
  if(_heatmapRange==='year'){
    return { start:new Date(_heatmapYear,0,1), end:new Date(_heatmapYear+1,0,1) };
  }
  return { start:new Date(_heatmapMonthYear,_heatmapMonth,1), end:new Date(_heatmapMonthYear,_heatmapMonth+1,1) };
}

function _hmShortLabel(dateKey){
  var parts=dateKey.split('-');
  var d=new Date(+parts[0],+parts[1]-1,+parts[2]);
  return d.getDate()+' '+MONTHS_PL_SHORT[d.getMonth()].toLowerCase();
}

function computeHeatmapStats(){
  var b=_heatmapRangeBounds();
  var inRange = state.workouts.filter(function(w){ var t=new Date(w.date); return t>=b.start && t<b.end; });
  var count = inRange.length;

  var source=HEATMAP_SOURCES[_heatmapSourceKey];
  var byDate={};
  inRange.forEach(function(w){
    var key=_hmDateKey(w.date);
    byDate[key]=(byDate[key]||0)+source.getEventWeight(w);
  });
  var topDate=null, topVal=0;
  Object.keys(byDate).forEach(function(k){ if(byDate[k]>topVal){ topVal=byDate[k]; topDate=k; } });
  var topLabel = topDate ? _hmShortLabel(topDate) : '—';

  var effectiveEnd = b.end < new Date() ? b.end : new Date();
  var spanDays = Math.max(1, Math.round((effectiveEnd-b.start)/86400000));
  var avgPerWeek = (count/Math.max(1,spanDays/7)).toFixed(1);

  var streaks = (typeof computeStreaks==='function') ? computeStreaks() : {current:0};

  return { count:count, streak:streaks.current, topLabel:topLabel, avgPerWeek:avgPerWeek };
}

function renderHeatmapStats(){
  var s = computeHeatmapStats();
  var streakEl=document.getElementById('hm-stat-streak');
  var countEl=document.getElementById('hm-stat-count');
  var topEl=document.getElementById('hm-stat-topday');
  var avgEl=document.getElementById('hm-stat-avg');
  if(streakEl) streakEl.textContent=s.streak;
  if(countEl) countEl.textContent=s.count;
  if(topEl) topEl.textContent=s.topLabel;
  if(avgEl) avgEl.textContent=s.avgPerWeek;
}

// ===================== BOTTOM SHEET SZCZEGÓŁÓW DNIA =====================

function _hmPluralActivity(n){
  if(n===1) return 'aktywność';
  var mod10=n%10, mod100=n%100;
  if(mod10>=2&&mod10<=4&&(mod100<12||mod100>14)) return 'aktywności';
  return 'aktywności';
}

function openHeatmapDaySheet(dateKey){
  var parts=dateKey.split('-');
  var y=+parts[0], m=+parts[1]-1, d=+parts[2];
  var dateObj=new Date(y,m,d);

  var titleEl=document.getElementById('hm-day-sheet-title');
  if(titleEl) titleEl.textContent='📅 '+dateObj.toLocaleDateString('pl',{day:'numeric',month:'long',year:'numeric'});

  var bodyEl=document.getElementById('hm-day-sheet-body');
  if(!bodyEl) return;

  var workouts = state.workouts.filter(function(w){ return _hmDateKey(w.date)===dateKey; });
  // Cardio dolicza się do widoku dnia, jeśli moduł Cardio jest obecny (state.cardioActivities) —
  // heatmapa sama w sobie kolorowana jest wyłącznie z treningów (HEATMAP_SOURCES.workouts).
  var cardioActs = (state.cardioActivities||[]).filter(function(a){ return _hmDateKey(a.date)===dateKey; });
  var totalCount = workouts.length + cardioActs.length;

  if(!totalCount){
    bodyEl.innerHTML = '<div style="text-align:center;color:var(--text4);padding:28px 0;">W tym dniu nie wykonano żadnego treningu.</div>';
    openSheet('heatmap-day-sheet');
    return;
  }

  var html = '<div style="font-size:13px;color:var(--text3);margin-bottom:10px;">'+totalCount+' '+_hmPluralActivity(totalCount)+'</div>';

  workouts.forEach(function(w){
    html += '<div style="padding:10px 0;border-bottom:.5px solid var(--border2);">'
      + '<div style="font-weight:700;">'+(w.planName||'Trening')+(w.dayName?' — '+w.dayName:'')+'</div>'
      + '<div style="font-size:13px;color:var(--text3);margin-top:3px;">'+formatTime(w.duration||0)+' · '+(w.tonnage||0).toFixed(0)+' kg</div>'
      + '</div>';
  });
  cardioActs.forEach(function(a){
    var t = (typeof _cardioTypeInfo==='function') ? _cardioTypeInfo(a.type) : {icon:'❤️',label:'Cardio'};
    var durLabel = (typeof _fmtCardioDuration==='function') ? _fmtCardioDuration(a.duration) : (a.duration+' min');
    html += '<div style="padding:10px 0;border-bottom:.5px solid var(--border2);">'
      + '<div style="font-weight:700;">'+t.icon+' '+t.label+'</div>'
      + '<div style="font-size:13px;color:var(--text3);margin-top:3px;">'+durLabel+(a.distance?' · '+(+a.distance).toFixed(2)+' km':'')+'</div>'
      + '</div>';
  });

  var totalTonnage = workouts.reduce(function(a,w){ return a+(w.tonnage||0); },0);
  var totalDuration = workouts.reduce(function(a,w){ return a+(w.duration||0); },0)
    + cardioActs.reduce(function(a,c){ return a+(parseFloat(c.duration)||0)*60; },0);

  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">'
    + '<div class="stat-card"><div class="stat-val">'+totalTonnage.toFixed(0)+' kg</div><div class="stat-label">Łączna objętość</div></div>'
    + '<div class="stat-card"><div class="stat-val">'+formatTime(totalDuration)+'</div><div class="stat-label">Łączny czas</div></div>'
    + '</div>';

  bodyEl.innerHTML = html;
  openSheet('heatmap-day-sheet');
  // Krótka animacja potwierdzająca otwarcie (reużywa istniejącą klasę .gf-pop)
  bodyEl.classList.remove('gf-pop');
  void bodyEl.offsetWidth;
  bodyEl.classList.add('gf-pop');
}
