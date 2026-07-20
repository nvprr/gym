// ===================== DASHBOARD.JS =====================

// ── Zmienne globalne ──
let dashboardDragKey = null;
let touchDragTargetKey = null;


function refreshDashboard(){
  const now=new Date();
  const days=['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
  const months=['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'];
  document.getElementById('hero-last-workout').textContent=`Dzisiaj jest ${days[now.getDay()]}.`;
  document.getElementById('hero-greeting').textContent=`👋 Cześć, ${state.settings.username||'GymFlow'}!`;
  const lastWorkout = state.workouts.length?state.workouts[state.workouts.length-1]:null;
  let daysSinceText='Brak historii treningów.';
  if(lastWorkout){
    const lastDate=new Date(lastWorkout.date);
    const today=new Date(now);
    today.setHours(0,0,0,0);
    const lastDay=new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const diffDays=Math.max(0,Math.round((today.getTime()-lastDay.getTime())/86400000));
    if(diffDays===0) daysSinceText='Ostatni trening był dzisiaj.';
    else if(diffDays===1) daysSinceText='Od ostatniego treningu minął 1 dzień.';
    else daysSinceText=`Od ostatniego treningu minęły ${diffDays} dni.`;
  }
  document.getElementById('hero-days-since').textContent=daysSinceText;
  const fatigue=calcMuscleFatigue();
  var muscleNamesPL={chest:'Klatka piersiowa',lats:'Najszerszy grzbietu',traps:'Czworoboczny',lowerBack:'Dolne plecy',rearShoulder:'Bark tylny',midShoulder:'Bark boczny',frontShoulder:'Bark przedni',biceps:'Biceps',triceps:'Triceps',forearms:'Przedramiona',abs:'Brzuch',quads:'Czworogłowe',hamstrings:'Dwugłowe ud',glutes:'Pośladki',calves:'Łydki'};
  const fatigueEntries=Object.entries(fatigue).filter(function(e){return typeof e[1]==='number';}).sort(function(a,b){return a[1]-b[1];});
  const regenerated=fatigueEntries.slice(0,2).map(function(e){return '✅ '+(muscleNamesPL[e[0]]||e[0]);});
  document.getElementById('hero-regenerated-list').innerHTML=regenerated.length?regenerated.join('<br>'):'Brak danych regeneracji';
  const weeklyCount=state.workouts.filter(w=>new Date(w.date).getTime()>Date.now()-7*86400000).length;
  const goal=state.settings.dashboardGoal||4;
  document.getElementById('hero-footer').textContent='Powodzenia! 💪';
  const goalInput=document.getElementById('dashboard-goal-profile-input');
  if(goalInput) goalInput.value=goal;
  renderDashboardCards();
}

function getDashboardOrder(){
  const order=Array.isArray(state.settings.dashboardOrder)&&state.settings.dashboardOrder.length?state.settings.dashboardOrder:DEFAULT_DASHBOARD_ORDER.slice();
  return order.filter(key=>key!=='quickActions');
}

function getDashboardHidden(){return Array.isArray(state.settings.dashboardHidden)?state.settings.dashboardHidden:[];}

function saveDashboardLayout(){state.settings.dashboardOrder=getDashboardOrder();state.settings.dashboardHidden=getDashboardHidden();saveSettings();}

function toggleDashboardEditMode(){
  state.dashboardEditMode=!state.dashboardEditMode;
  const edit=state.dashboardEditMode;
  document.getElementById('dashboard-edit-banner').style.display=edit?'flex':'none';
  document.getElementById('dashboard-edit-toggle').textContent=edit?'✅ Zakończ':'⚙️';
  renderDashboardCards();
}

function restoreDashboardDefaults(){
  state.settings.dashboardHidden=[];
  state.settings.dashboardOrder=DEFAULT_DASHBOARD_ORDER.slice();
  saveSettings();
  renderDashboardCards();
  showNotif('✅','Przywrócono domyślne','');
}

function renderDashboardCard(key,editMode){
  const hidden=getDashboardHidden().includes(key);
  const cardClass=`dashboard-card${hidden?' hidden':''}`;
  const handle=editMode?`<div class="dashboard-card-handle" draggable="true" ondragstart="dragDashboardCardStart(event,'${key}')" onmousedown="event.preventDefault()" ontouchstart="touchDashboardCardStart(event,'${key}')" ontouchmove="touchDashboardCardMove(event)" ontouchend="touchDashboardCardEnd()" title="Przeciągnij">≡</div>`:'';
  const hideLabel=hidden?'👁':'✕';
  const hideTitle=hidden?'Pokaż kartę':'Ukryj kartę';
  const hideBtn=editMode?`<button class="dashboard-card-hide" title="${hideTitle}" onclick="event.stopPropagation();toggleDashboardCardHidden('${key}')">${hideLabel}</button>`:'';
  return `<div class="${cardClass}" id="dash-card-${key}" ondragover="dragDashboardCardOver(event)" ondrop="dragDashboardCardDrop(event,'${key}')">${handle}${hideBtn}${renderDashboardCardContent(key,editMode)}</div>`;
}

function renderDashboardCardContent(key,editMode){
  const last=state.workouts.length?state.workouts[state.workouts.length-1]:null;
  const weeklyCount=state.workouts.filter(w=>new Date(w.date).getTime()>Date.now()-7*86400000).length;
  const goal=state.settings.dashboardGoal||4;
  const goalProgress=Math.min(100,Math.round((weeklyCount/goal)*100));
  const streak=calcStreak();
  const fatigue=calcMuscleFatigue();
  const fatigueEntries=Object.entries(fatigue).sort((a,b)=>b[1]-a[1]);
  const topFatigue=fatigueEntries.slice(0,3);
  const avgFatigue=fatigueEntries.length?Math.round(fatigueEntries.reduce((sum,[k,v])=>sum+v,0)/fatigueEntries.length):0;
  const recoveryLabel=avgFatigue?`${Math.round(100-avgFatigue)}%`:'100%';
  const recent=state.workouts.slice(-3).reverse();
  const plans=state.plans;
  const weekDays=['Pn','Wt','Śr','Cz','Pt','Sb','Nd'];
  const weekStart=new Date(); weekStart.setHours(0,0,0,0); const dayOfWeek=(weekStart.getDay()+6)%7; weekStart.setDate(weekStart.getDate()-dayOfWeek);
  const weekCells=[];
  for(let i=0;i<7;i++){ const date=new Date(weekStart); date.setDate(weekStart.getDate()+i); const count=state.workouts.filter(w=>{const d=new Date(w.date);return d.getFullYear()===date.getFullYear()&&d.getMonth()===date.getMonth()&&d.getDate()===date.getDate();}).length; weekCells.push({label:weekDays[i],count,active:count>0,today:date.toDateString()===new Date().toDateString()}); }
  switch(key){
    case 'statistics': return `<div class="card-title">Statystyki</div><div class="dashboard-card-grid"><div class="stat-card"><div class="stat-val accent">${weeklyCount}</div><div class="stat-label">Treningi w tygodniu</div></div><div class="stat-card"><div class="stat-val green">${state.workouts.length}</div><div class="stat-label">Treningi łącznie</div></div><div class="stat-card"><div class="stat-val">${streak.streak}</div><div class="stat-label">Aktualna seria</div></div><div class="stat-card"><div class="stat-val">${plans.length}</div><div class="stat-label">Aktywne plany</div></div></div>`;
    case 'weeklyGoals': return `<div class="card-title">Cel tygodnia</div><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><div><div style="font-size:17px;font-weight:700;">${weeklyCount}/${goal} treningi</div><div style="font-size:13px;color:var(--text3);margin-top:4px;">${weeklyCount>=goal?'Cel osiągnięty!':'Utrzymaj tempo przez resztę tygodnia.'}</div></div><div class="badge ${weeklyCount>=goal?'badge-green':'badge-accent'}">${goalProgress}%</div></div><div class="dashboard-card-progress"><div class="dashboard-card-progress-fill" style="width:${goalProgress}%"></div></div>`;
    case 'aiCoach': {
      const insights=[];
      if(!state.workouts.length) insights.push('Czas zacząć! Zrób pierwszy trening, aby otrzymać spersonalizowane wskazówki.');
      else if(last){
        const daysSince=Math.floor((Date.now()-new Date(last.date).getTime())/86400000);
        if(daysSince===0) insights.push('Świeżo po treningu — pamiętaj o regeneracji i lekkim rozciąganiu.');
        else if(daysSince===1) insights.push('Powrót na salę po dniu przerwy? Dobry moment na lekką sesję lub core.');
        else insights.push('Dłuższa przerwa? Zacznij od lżejszego rozruchu, by uniknąć kontuzji.');
      }
      if(avgFatigue>70) insights.push('Twoje mięśnie są mocno zmęczone. Zaplanuj dzień regeneracji lub trening niższej intensywności.');
      else if(weeklyCount>=goal) insights.push('Dobra robota! Utrzymujesz aktywność zgodnie z planem.');
      else insights.push('Spróbuj wykonać jeszcze jeden trening w tym tygodniu, żeby przyspieszyć progres.');
      return '<div class="card-title">AI Coach</div>'+insights.map(function(i){return '<div class="ai-insight"><div class="ai-insight-label">✨ AI Coach</div>'+i+'</div>';}).join('');
    }
    case 'regeneration': {
      var mNamesPL={chest:'Klatka',lats:'Najszerszy',traps:'Czworoboczny',lowerBack:'Dolne plecy',rearShoulder:'Bark tylny',midShoulder:'Bark boczny',frontShoulder:'Bark przedni',biceps:'Biceps',triceps:'Triceps',forearms:'Przedramiona',abs:'Brzuch',quads:'Czworogłowe',hamstrings:'Dwugłowe ud',glutes:'Pośladki',calves:'Łydki'};
      var topFatigueHtml = topFatigue.map(function(entry){
        var m=entry[0],v=entry[1];
        var mPL=mNamesPL[m]||m;
        return '<div class="mini-week-day" style="background:'+fatigueToColor(v)+';color:#fff;">'+mPL+'<span class="day-value">'+Math.round(v)+'%</span></div>';
      }).join('');
      var topLabel = topFatigue.length ? (mNamesPL[topFatigue[0][0]]||topFatigue[0][0])+' '+Math.round(topFatigue[0][1])+'%' : '-';
      return '<div class="card-title">Regeneracja</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div><div style="font-size:20px;font-weight:700;color:'+fatigueToColor(avgFatigue)+';">'+recoveryLabel+'</div><div style="font-size:13px;color:var(--text3);margin-top:4px;">Średnia regeneracja mięśni</div></div><div><div style="font-size:20px;font-weight:700;">'+topLabel+'</div><div style="font-size:13px;color:var(--text3);margin-top:4px;">Najbardziej zmęczone</div></div></div><div class="mini-week-grid" style="margin-top:12px;">'+topFatigueHtml+'</div>';
    }
    case 'lastWorkout': {
      var lastHtml = last
        ? '<div class="dashboard-card-note"><strong>'+(last.planName||'Trening')+'</strong><div style="font-size:13px;color:var(--text3);margin-top:6px;">'+(last.exercises?.length||0)+' ćwiczeń · '+formatTime(last.duration||0)+' · '+(last.tonnage||0).toFixed(0)+'kg</div><div style="font-size:13px;color:var(--text3);margin-top:8px;">'+new Date(last.date).toLocaleDateString('pl')+' · '+(last.dayName||'')+'</div></div>'
        : '<div class="dashboard-card-note">Brak poprzednich treningów. Zacznij teraz, aby zbudować historię!</div>';
      return '<div class="card-title">Ostatni trening</div>'+lastHtml+'<button class="btn btn-secondary" style="width:100%;margin-top:12px;" onclick="repeatLastWorkout()">🔁 Powtórz ostatni</button>';
    }
    case 'activePlans': {
      var plansHtml2 = plans.length
        ? plans.slice(0,3).map(function(p){return '<div class="plan-pill"><span>'+(p.emoji||'💪')+' '+p.name+'</span><span>'+(p.exercises||[]).length+' ćw.</span></div>';}).join('')
        : '<div class="dashboard-card-note">Brak planów. Stwórz nowy plan, aby zacząć.</div>';
      return '<div class="card-title">Aktywne plany</div>'+plansHtml2;
    }
    case 'miniCalendar': {
      var calHtml = weekCells.map(function(d){
        return '<div class="mini-week-day'+(d.active?' active':'')+(d.today?' today':'')+'"><span class="day-label">'+d.label+'</span><span class="day-value">'+(d.count?d.count:'-')+'</span></div>';
      }).join('');
      return '<div class="card-title">Mini kalendarz</div><div class="mini-week-grid">'+calHtml+'</div>';
    }
    case 'recentRecords': {
      const exRecords = last?.exercises?.map(ex => {
        const highestWeight = Math.max(...(ex.sets||[]).map(s => parseFloat(s.weight)||0));
        return {name:ex.name,maxWeight:highestWeight,exercise:ex};
      }) || [];
      const sortedByWeight = exRecords.filter(r=>r.maxWeight>0).sort((a,b)=>b.maxWeight-a.maxWeight);
      const selected = sortedByWeight.length>3 ? sortedByWeight.slice(0,Math.min(5,sortedByWeight.length)).sort(()=>Math.random()-0.5).slice(0,3) : sortedByWeight;
      var recHtml = selected.length
        ? selected.map(function(r){return '<div class="dashboard-record-item"><div class="dashboard-record-title">'+r.name+' · '+r.maxWeight.toFixed(0)+'kg</div><div class="dashboard-record-meta">'+(last?new Date(last.date).toLocaleDateString('pl'):'')+' · '+(r.exercise.sets?.length||0)+' serii</div></div>';}).join('')
        : '<div class="dashboard-card-note">Brak zapisanych rekordów z ostatniego treningu. Wykonaj trening, aby zapełnić kartę.</div>';
      return '<div class="card-title">Ostatnie rekordy</div>'+recHtml;
    }
    case 'hydration': {
      var hData = loadHydrationData();
      var glasses = hData.glasses;
      var hGoal = hData.goal;
      var mlPerGlass = hData.mlPerGlass;
      var totalMl = glasses * mlPerGlass;
      var goalMl = hGoal * mlPerGlass;
      var pct = Math.min(100, Math.round(glasses / hGoal * 100));
      var reached = glasses >= hGoal;
      // SVG ring — stroke-dashoffset technique (płynna animacja od 0%)
      var r = 38;
      var circ = parseFloat((2 * Math.PI * r).toFixed(2));
      var filled = parseFloat((circ * pct / 100).toFixed(2));
      var offset = parseFloat((circ - filled).toFixed(2));
      var ringColor = reached ? 'var(--green)' : 'var(--accent)';
      var ringHtml = '<svg width="100" height="100" viewBox="0 0 100 100" style="display:block;margin:0 auto 8px;">'
        + '<circle cx="50" cy="50" r="'+r+'" fill="none" stroke="var(--surface2)" stroke-width="8"/>'
        + '<circle cx="50" cy="50" r="'+r+'" fill="none" stroke="'+ringColor+'" stroke-width="8"'
        + ' stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'"'
        + ' stroke-linecap="round" transform="rotate(-90 50 50)"'
        + ' style="transition:stroke-dashoffset .5s cubic-bezier(.4,0,.2,1),stroke .3s ease;"/>'
        + '<text x="50" y="44" text-anchor="middle" font-size="13" fill="var(--text)" font-weight="700">💧</text>'
        + '<text x="50" y="60" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="800">'+totalMl+'ml</text>'
        + '</svg>';
      // Glasses icons
      var glassIcons = '';
      for (var gi = 0; gi < hGoal; gi++) {
        glassIcons += '<span style="font-size:18px;opacity:'+(gi<glasses?'1':'.3')+'">'+(gi<glasses?'🥛':'⬜')+'</span>';
      }
      var btnStyle = 'background:var(--surface2);border:none;border-radius:10px;padding:8px 18px;font-size:18px;cursor:pointer;color:var(--text);';
      var html = '<div class="card-title">💧 Nawodnienie</div>';
      html += ringHtml;
      html += '<div data-hi style="display:flex;justify-content:center;flex-wrap:wrap;gap:2px;margin:4px 0 8px;">'+glassIcons+'</div>';
      html += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px;">';
      html += '<button onclick="adjustHydration(-1)" style="'+btnStyle+'">➖</button>';
      html += '<div style="text-align:center;"><div data-hc style="font-size:18px;font-weight:800;color:'+(reached?'var(--green)':'var(--accent)')+'">'+glasses+' / '+hGoal+'</div><div style="font-size:11px;color:var(--text3);">szklanek</div></div>';
      html += '<button onclick="adjustHydration(1)" style="'+btnStyle+'">➕</button>';
      html += '</div>';
      html += '<div data-hr style="text-align:center;font-size:13px;color:var(--green);font-weight:700;padding:4px 0;display:'+(reached?'block':'none')+';">🎉 Dzienny cel osiągnięty!</div>';
      html += '<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;padding-top:10px;border-top:.5px solid var(--border2);">'
        + '<span style="font-size:11px;color:var(--text3);">Cel:</span>'
        + '<input type="number" min="1" max="20" value="'+hGoal+'" style="width:50px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;font-weight:700;text-align:center;padding:4px;" onchange="setHydrationGoal(this.value)">'
        + '<span style="font-size:11px;color:var(--text3);">szklanek</span>'
        + '</div>';
      return html;
    }
    case 'activeGoal': {
      var ag = state.settings.activeGoal;
      if (!ag) {
        return '<div class="card-title">🎯 Aktualny cel</div>'
          + '<div class="dashboard-card-note">Nie wybrałeś jeszcze celu.</div>'
          + '<button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="openActiveGoalSheet()">+ Ustaw cel</button>';
      }
      var gp = getActiveGoalProgress(ag);
      var barColor = gp.reached ? 'var(--green)' : 'var(--accent)';
      return '<div style="display:flex;align-items:center;justify-content:space-between;">'
        +   '<div class="card-title" style="margin-bottom:0;">🎯 Aktualny cel</div>'
        +   '<button onclick="event.stopPropagation();openActiveGoalSheet()" style="background:none;border:none;color:var(--text3);font-size:15px;cursor:pointer;padding:2px 4px;" title="Zmień cel">✏️</button>'
        + '</div>'
        + '<div style="font-size:16px;font-weight:800;margin:8px 0 10px;cursor:pointer;" onclick="openActiveGoalSheet()">' + ag.label + (gp.reached ? ' ✅' : '') + '</div>'
        + '<div class="dashboard-card-progress"><div class="dashboard-card-progress-fill" style="width:' + gp.pct + '%;background:' + barColor + ';transition:width .6s cubic-bezier(.4,0,.2,1);"></div></div>'
        + '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:13px;color:var(--text3);">'
        +   '<span>' + gp.displayCurrent + ' / ' + gp.displayTarget + ' ' + gp.unit + '</span>'
        +   '<span style="font-weight:700;color:' + barColor + ';">' + gp.pct + '%</span>'
        + '</div>';
    }
    case 'cardio': {
      var cActs = state.cardioActivities || [];
      var cSince = Date.now() - 7*86400000;
      var cWeek = cActs.filter(function(a){ return new Date(a.date).getTime() > cSince; });
      var cTime = cWeek.reduce(function(s,a){ return s+(parseFloat(a.duration)||0); }, 0);
      var cDist = cWeek.reduce(function(s,a){ return s+(parseFloat(a.distance)||0); }, 0);
      var cTimeLabel = typeof _fmtCardioDuration === 'function' ? _fmtCardioDuration(cTime) : Math.round(cTime)+' min';
      return '<div class="card-title">❤️ Cardio</div>'
        + '<div class="dashboard-card-grid">'
        +   '<div class="stat-card"><div class="stat-val accent">' + cWeek.length + '</div><div class="stat-label">Aktywności</div></div>'
        +   '<div class="stat-card"><div class="stat-val">' + cTimeLabel + '</div><div class="stat-label">Czas</div></div>'
        +   '<div class="stat-card"><div class="stat-val green">' + cDist.toFixed(1) + ' km</div><div class="stat-label">Dystans</div></div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;margin-top:10px;">'
        +   '<button class="btn btn-secondary" style="flex:1;" onclick="event.stopPropagation();openCardioAddSheet()">➕ Dodaj</button>'
        +   '<button class="btn btn-secondary" style="flex:1;" onclick="event.stopPropagation();openCardioHistorySheet()">📜 Historia</button>'
        + '</div>';
    }
    default: return `<div class="card-title">${key}</div><div class="dashboard-card-note">Brak danych.</div>`;
  }
}

function openCardioHistorySheet(){
  openSheet('cardio-history-sheet');
  if(typeof renderCardioTab==='function') renderCardioTab();
}

function renderDashboardCards(){
  const container=document.getElementById('dashboard-cards');
  if(!container) return;
  const editMode=!!state.dashboardEditMode;
  const order=getDashboardOrder();
  const hidden=getDashboardHidden();
  container.innerHTML=order.map(key=>{
    if(hidden.includes(key) && !editMode) return '';
    return renderDashboardCard(key,editMode);
  }).join('');
  const bannerText=document.getElementById('dashboard-edit-banner-text');
  if(bannerText){
    const hiddenCount=hidden.length;
    bannerText.textContent=hiddenCount?`Tryb edycji · ${hiddenCount} ukryta${hiddenCount===1?'a':'ych'} karta / przeciągnij, aby zmienić kolejność.`:'Tryb edycji · przeciągnij karty, aby zmienić kolejność.';
  }
  checkActiveGoalCompletion();
}

function renderDashMuscleMap() {
  // Small 6-tile preview on dashboard (front side, most important)
  const fatigue = calcMuscleFatigue();
  const front = document.getElementById('mm-dash-front');
  const back  = document.getElementById('mm-dash-back');
  if (!front || !back) return;

  const renderSmall = (el, side) => {
    const tiles = MUSCLE_TILES.filter(t => t.side === side).slice(0, 6);
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">` +
      tiles.map(tile => {
        const f = Math.min(100, tile.muscleKeys.reduce((a,k) => a + (fatigue[k]||0), 0) / tile.muscleKeys.length);
        const color = fatigueToColor(f);
        const icon = SVG_ICONS[tile.icon] || '';
        return `<div style="background:${color};border-radius:8px;padding:6px 4px;display:flex;flex-direction:column;align-items:center;gap:3px;">
          <div style="width:28px;height:28px;"><svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:brightness(0) invert(1)">${icon}</svg></div>
          <div style="font-size:8px;font-weight:700;color:#fff;text-align:center;">${tile.label}</div>
        </div>`;
      }).join('') + '</div>';
  };
  renderSmall(front, 'front');
  renderSmall(back, 'back');
}

function updateDashboardGoal(value){
  const goal=Math.max(1,parseInt(value)||4);
  state.settings.dashboardGoal=goal;
  saveSettings();
  refreshDashboard();
}

function toggleDashboardCardHidden(key){
  const hidden=getDashboardHidden();
  const idx=hidden.indexOf(key);
  if(idx>=0) hidden.splice(idx,1);
  else hidden.push(key);
  state.settings.dashboardHidden=hidden;
  saveDashboardLayout();
  renderDashboardCards();
}

function dragDashboardCardStart(event,key){
  dashboardDragKey=key;
  if(event.dataTransfer) event.dataTransfer.effectAllowed='move';
}

function dragDashboardCardOver(event){
  event.preventDefault();
  if(event.dataTransfer) event.dataTransfer.dropEffect='move';
}

function dragDashboardCardDrop(event,targetKey){
  event.preventDefault();
  if(!dashboardDragKey||dashboardDragKey===targetKey) return;
  const order=getDashboardOrder();
  const from=order.indexOf(dashboardDragKey);
  const to=order.indexOf(targetKey);
  if(from<0||to<0) return;
  order.splice(from,1);
  order.splice(to,0,dashboardDragKey);
  state.settings.dashboardOrder=order;
  saveDashboardLayout();
  renderDashboardCards();
}

function dragDashboardCardDropTouch(targetKey){
  const order=getDashboardOrder();
  const from=order.indexOf(dashboardDragKey);
  const to=order.indexOf(targetKey);
  if(from<0||to<0||from===to) return;
  order.splice(from,1);
  order.splice(to,0,dashboardDragKey);
  state.settings.dashboardOrder=order;
  saveDashboardLayout();
  renderDashboardCards();
}

function touchDashboardCardStart(event,key){
  if(!event.touches || !event.touches.length) return;
  dashboardDragKey=key;
  touchDragTargetKey=key;
  event.preventDefault();
}

function touchDashboardCardMove(event){
  if(!dashboardDragKey || !event.touches || !event.touches.length) return;
  const touch=event.touches[0];
  const el=document.elementFromPoint(touch.clientX,touch.clientY);
  if(!el) return;
  const card=el.closest('.dashboard-card');
  if(card && card.id.startsWith('dash-card-')){
    touchDragTargetKey=card.id.replace('dash-card-','');
  }
}

function touchDashboardCardEnd(){
  if(!dashboardDragKey) return;
  const targetKey=touchDragTargetKey||dashboardDragKey;
  if(targetKey && targetKey!==dashboardDragKey){
    dragDashboardCardDropTouch(targetKey);
  }
  dashboardDragKey=null;
  touchDragTargetKey=null;
}

// ── WIDGET "AKTUALNY CEL" ──

function openActiveGoalSheet(){
  var ag=state.settings.activeGoal||{type:'exercise',target:'',exerciseName:''};
  var typeInput=document.getElementById('ag-type-input');
  var exInput=document.getElementById('ag-ex-input');
  var targetInput=document.getElementById('ag-target-input');
  var clearBtn=document.getElementById('ag-clear-btn');
  if(!typeInput||!exInput||!targetInput) return;
  typeInput.value=ag.type||'exercise';
  exInput.value=ag.exerciseName||'';
  targetInput.value=ag.target||'';
  if(clearBtn) clearBtn.style.display=state.settings.activeGoal?'block':'none';
  _buildAgExerciseDatalist();
  onActiveGoalTypeChange();
  openSheet('active-goal-sheet');
}

function _buildAgExerciseDatalist(){
  var dl=document.getElementById('ag-ex-list');
  if(!dl) return;
  var all=typeof getAllExercises==='function'?getAllExercises():(typeof EXERCISES!=='undefined'?EXERCISES:[]);
  dl.innerHTML=all.map(function(ex){ return '<option value="'+String(ex.name).replace(/"/g,'&quot;')+'">'; }).join('');
}

function onActiveGoalTypeChange(){
  var typeInput=document.getElementById('ag-type-input');
  var exRow=document.getElementById('ag-ex-row');
  var targetLabel=document.getElementById('ag-target-label');
  if(!typeInput) return;
  var type=typeInput.value;
  if(exRow) exRow.style.display=type==='exercise'?'block':'none';
  var labels={
    exercise:'Docelowy ciężar — e1RM (kg)',
    bodyweight:'Docelowa masa ciała (kg)',
    workoutsMonth:'Treningi w tym miesiącu',
    tonnage:'Docelowy tonaż (kg)',
    weeklySets:'Docelowe serie w tygodniu'
  };
  if(targetLabel) targetLabel.textContent=labels[type]||'Wartość docelowa';
}

function saveActiveGoal(){
  var type=document.getElementById('ag-type-input').value;
  var target=parseFloat(document.getElementById('ag-target-input').value);
  if(!target||target<=0){ showNotif('⚠️','Błąd','Podaj wartość docelową'); return; }
  var exName=(document.getElementById('ag-ex-input').value||'').trim();
  var goal={ type:type, target:target, celebrated:false };
  if(type==='exercise'){
    if(!exName){ showNotif('⚠️','Błąd','Wybierz ćwiczenie'); return; }
    var all=typeof getAllExercises==='function'?getAllExercises():(typeof EXERCISES!=='undefined'?EXERCISES:[]);
    var match=all.find(function(e){ return e.name.toLowerCase()===exName.toLowerCase(); });
    goal.exerciseId=match?match.id:null;
    goal.exerciseName=exName;
    goal.label=exName+' '+target+' kg';
  } else if(type==='bodyweight'){
    goal.label='Masa ciała '+target+' kg';
  } else if(type==='workoutsMonth'){
    goal.label='Treningi w miesiącu: '+target;
  } else if(type==='tonnage'){
    goal.label='Tonaż '+target.toLocaleString('pl')+' kg';
  } else if(type==='weeklySets'){
    goal.label='Serie tygodniowo: '+target;
  }
  state.settings.activeGoal=goal;
  saveSettings();
  closeSheet('active-goal-sheet');
  renderDashboardCards();
  showNotif('🎯','Cel ustawiony',goal.label);
}

function clearActiveGoal(){
  state.settings.activeGoal=null;
  saveSettings();
  closeSheet('active-goal-sheet');
  renderDashboardCards();
}

function checkActiveGoalCompletion(){
  var ag=state.settings.activeGoal;
  if(!ag||ag.celebrated) return;
  if(typeof getActiveGoalProgress!=='function') return;
  var gp=getActiveGoalProgress(ag);
  if(gp.reached){
    ag.celebrated=true;
    saveSettings();
    celebrateGoalReached(ag.label);
  }
}

function celebrateGoalReached(label){
  var emojis=['🎉','🎊','⭐','🔥','💪','🏆'];
  for(var i=0;i<24;i++){
    (function(i){
      setTimeout(function(){
        var el=document.createElement('div');
        el.className='confetti-piece';
        el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left=(Math.random()*100)+'vw';
        el.style.fontSize=(16+Math.random()*14)+'px';
        el.style.animationDuration=(1.8+Math.random()*1.2)+'s';
        document.body.appendChild(el);
        setTimeout(function(){ el.remove(); },3300);
      },i*40);
    })(i);
  }
  if(typeof showNotif==='function') showNotif('🎉','Cel osiągnięty!',label);
}

