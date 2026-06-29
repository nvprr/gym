// ===================== HYDRATION.JS =====================

var HYDRATION_KEY = 'gymflow_hydration';

function loadHydrationData() {
  try {
    var raw = JSON.parse(localStorage.getItem(HYDRATION_KEY) || '{}');
    var today = new Date().toDateString();
    if (raw.date !== today) {
      var history = raw.history || [];
      if (raw.glasses > 0) { history.push({ date: raw.date, glasses: raw.glasses }); history = history.slice(-30); }
      raw = { date: today, glasses: 0, goal: raw.goal || 8, mlPerGlass: raw.mlPerGlass || 250, history: history };
      saveHydrationData(raw);
    }
    return { date: raw.date||today, glasses: raw.glasses||0, goal: raw.goal||8, mlPerGlass: raw.mlPerGlass||250, history: raw.history||[] };
  } catch(e) { return { date: new Date().toDateString(), glasses: 0, goal: 8, mlPerGlass: 250, history: [] }; }
}

function saveHydrationData(data) {
  localStorage.setItem(HYDRATION_KEY, JSON.stringify(data));
}

// FIX 1: Update ring in-place for smooth animation
function adjustHydration(delta) {
  var data = loadHydrationData();
  var prevGlasses = data.glasses;
  data.glasses = Math.max(0, data.glasses + delta);
  var wasReached = prevGlasses >= data.goal;
  var nowReached = data.glasses >= data.goal;
  saveHydrationData(data);

  if (!updateHydrationCardInPlace(data)) refreshDashboard();

  if (nowReached && !wasReached) {
    showNotif('🎉', 'Cel nawodnienia osiągnięty!', data.glasses * data.mlPerGlass + ' ml!');
    if (navigator.vibrate) navigator.vibrate([100,50,200]);
    stopWaterReminder();
  }
}

function updateHydrationCardInPlace(data) {
  // Find by id (more reliable than data-key)
  var card = document.getElementById('dash-card-hydration');
  if (!card) return false;

  var glasses = data.glasses, hGoal = data.goal, ml = data.mlPerGlass;
  var pct = Math.min(100, glasses / hGoal * 100);
  var reached = glasses >= hGoal;
  var r = 38;
  var circ = parseFloat((2 * Math.PI * r).toFixed(2));
  var filled = parseFloat((circ * pct / 100).toFixed(2));
  var offset = parseFloat((circ - filled).toFixed(2));
  var ringColor = reached ? 'var(--green)' : 'var(--accent)';

  // Update progress circle
  var circles = card.querySelectorAll('circle');
  if (circles[1]) {
    circles[1].style.transition = 'stroke-dashoffset .5s cubic-bezier(.4,0,.2,1), stroke .3s ease';
    circles[1].setAttribute('stroke-dashoffset', offset);
    circles[1].setAttribute('stroke', ringColor);
  }

  // Update ml text
  var texts = card.querySelectorAll('text');
  if (texts[1]) texts[1].textContent = (glasses * ml) + 'ml';

  // Update counter
  var counter = card.querySelector('[data-hc]');
  if (counter) { counter.textContent = glasses + ' / ' + hGoal; counter.style.color = reached ? 'var(--green)' : 'var(--accent)'; }

  // Update glass icons
  var icons = card.querySelector('[data-hi]');
  if (icons) {
    var h = '';
    for (var i = 0; i < hGoal; i++) h += '<span style="font-size:18px;opacity:'+(i<glasses?'1':'.3')+'">'+(i<glasses?'🥛':'⬜')+'</span>';
    icons.innerHTML = h;
  }

  // Update reached message
  var msg = card.querySelector('[data-hr]');
  if (msg) msg.style.display = reached ? 'block' : 'none';

  return true;
}

function setHydrationGoal(val) {
  var goal = Math.max(1, Math.min(20, parseInt(val) || 8));
  var data = loadHydrationData();
  data.goal = goal;
  saveHydrationData(data);
  refreshDashboard();
}

// Water Reminder
var _waterReminderTimer = null;

function toggleWaterNotif(el) {
  el.classList.toggle('on');
  var on = el.classList.contains('on');
  state.settings.waterNotifEnabled = on;
  var row = document.getElementById('water-notif-interval-row');
  if (row) row.style.display = on ? 'flex' : 'none';
  if (on) startWaterReminder(); else stopWaterReminder();
  saveSettings();
}

function saveWaterNotifSettings() {
  var sel = document.getElementById('water-notif-interval');
  state.settings.waterNotifInterval = parseInt(sel ? sel.value : 60) || 60;
  var sub = document.getElementById('water-notif-sub');
  if (sub) sub.textContent = 'Co ' + state.settings.waterNotifInterval + ' min';
  if (state.settings.waterNotifEnabled) startWaterReminder();
  saveSettings();
}

function loadWaterNotifSettings() {
  var s = state.settings;
  var toggle = document.getElementById('water-notif-toggle');
  var row = document.getElementById('water-notif-interval-row');
  var sel = document.getElementById('water-notif-interval');
  var sub = document.getElementById('water-notif-sub');
  if (s.waterNotifEnabled && toggle) toggle.classList.add('on');
  if (row) row.style.display = s.waterNotifEnabled ? 'flex' : 'none';
  if (sel && s.waterNotifInterval) sel.value = s.waterNotifInterval;
  if (sub) sub.textContent = 'Co ' + (s.waterNotifInterval || 60) + ' min';
  if (s.waterNotifEnabled) startWaterReminder();
}

function startWaterReminder() {
  stopWaterReminder();
  var data = loadHydrationData();
  if (data.glasses >= data.goal) return;
  var interval = (state.settings.waterNotifInterval || 60) * 60 * 1000;
  _waterReminderTimer = setInterval(function() {
    var d = loadHydrationData();
    if (d.glasses >= d.goal) { stopWaterReminder(); return; }
    if (typeof showNotif === 'function') showNotif('💧', 'Napij się wody!', d.glasses+'/'+d.goal+' szklanek');
  }, interval);
}

function stopWaterReminder() {
  if (_waterReminderTimer) { clearInterval(_waterReminderTimer); _waterReminderTimer = null; }
}

// Backup
function createBackup() {
  var backup = {
    _version:'gymflow_backup_v1', _date:new Date().toISOString(),
    plans:state.plans, workouts:state.workouts, customExercises:state.customExercises,
    weights:state.weights, measurements:state.measurements, goals:state.goals,
    timeline:state.timeline, settings:state.settings,
    achievements:JSON.parse(localStorage.getItem('gymflow_achievements')||'{}'),
    hydration:JSON.parse(localStorage.getItem(HYDRATION_KEY)||'{}'),
    bodyMeasurements:JSON.parse(localStorage.getItem('gymflow_body_measurements')||'[]'),
    genderSet:localStorage.getItem('gymflow_gender_set')||'',
  };
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
  a.download = 'gymflow_backup_'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  showNotif('💾','Backup gotowy','Plik zapisany');
}

async function restoreBackup(input) {
  var file = input.files[0]; if (!file) return; input.value = '';
  var reader = new FileReader();
  reader.onload = async function(e) {
    try {
      var b = JSON.parse(e.target.result);
      if (!b._version||!b._version.startsWith('gymflow_backup')) { showNotif('❌','Błąd','Nieprawidłowy plik'); return; }
      if (!confirm('Przywrócić backup z '+new Date(b._date).toLocaleString('pl')+'?\nObecne dane zostaną zastąpione.')) return;
      if (b.plans)           state.plans           = b.plans;
      if (b.workouts)        state.workouts        = b.workouts;
      if (b.customExercises) state.customExercises = b.customExercises;
      if (b.weights)         state.weights         = b.weights;
      if (b.measurements)    state.measurements    = b.measurements;
      if (b.goals)           state.goals           = b.goals;
      if (b.timeline)        state.timeline        = b.timeline;
      if (b.settings)        state.settings        = Object.assign({}, state.settings, b.settings);
      await dbPut('plans',        {id:'all',data:state.plans});
      await dbPut('workouts',     {id:'all',data:state.workouts});
      await dbPut('exercises',    {id:'custom',data:state.customExercises});
      await dbPut('weights',      {id:'all',data:state.weights});
      await dbPut('measurements', {id:'all',data:state.measurements});
      await dbPut('goals',        {id:'all',data:state.goals});
      await dbPut('timeline',     {id:'all',data:state.timeline});
      if (b.achievements)     localStorage.setItem('gymflow_achievements',JSON.stringify(b.achievements));
      if (b.hydration)        localStorage.setItem(HYDRATION_KEY,JSON.stringify(b.hydration));
      if (b.bodyMeasurements) localStorage.setItem('gymflow_body_measurements',JSON.stringify(b.bodyMeasurements));
      if (b.genderSet)        localStorage.setItem('gymflow_gender_set',b.genderSet);
      localStorage.setItem('gymflow_settings',JSON.stringify(state.settings));
      loadSettings(); refreshDashboard(); renderPlans();
      showNotif('✅','Backup przywrócony!','');
    } catch(err) { showNotif('❌','Błąd przywracania','Sprawdź plik'); }
  };
  reader.readAsText(file);
}

// Midnight reset
(function() {
  function scheduleReset() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 5);
    setTimeout(function() { loadHydrationData(); refreshDashboard(); if (state.settings.waterNotifEnabled) startWaterReminder(); scheduleReset(); }, midnight - now);
  }
  scheduleReset();
})();
