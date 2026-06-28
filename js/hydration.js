// ===================== HYDRATION.JS =====================
// Nawodnienie + Backup/Restore + Przypomnienie o wodzie

// ── Hydration Storage ──

var HYDRATION_KEY = 'gymflow_hydration';
var HYDRATION_GOAL = 8;
var HYDRATION_ML   = 250;

function loadHydrationData() {
  try {
    var raw = JSON.parse(localStorage.getItem(HYDRATION_KEY) || '{}');
    var today = new Date().toDateString();
    // Auto-reset at midnight
    if (raw.date !== today) {
      raw = { date: today, glasses: 0, goal: raw.goal || HYDRATION_GOAL, mlPerGlass: raw.mlPerGlass || HYDRATION_ML, history: raw.history || [] };
      // Archive yesterday if has data
      if (raw.history && raw.glasses > 0) {
        raw.history.push({ date: raw.date, glasses: raw.glasses });
        raw.history = raw.history.slice(-30);
      }
      saveHydrationData(raw);
    }
    return {
      date:      raw.date      || today,
      glasses:   raw.glasses   || 0,
      goal:      raw.goal      || HYDRATION_GOAL,
      mlPerGlass:raw.mlPerGlass|| HYDRATION_ML,
      history:   raw.history   || [],
    };
  } catch(e) {
    return { date: new Date().toDateString(), glasses: 0, goal: HYDRATION_GOAL, mlPerGlass: HYDRATION_ML, history: [] };
  }
}

function saveHydrationData(data) {
  localStorage.setItem(HYDRATION_KEY, JSON.stringify(data));
}

function adjustHydration(delta) {
  var data = loadHydrationData();
  data.glasses = Math.max(0, data.glasses + delta);
  var wasReached = data.glasses - delta >= data.goal;
  var nowReached = data.glasses >= data.goal;
  saveHydrationData(data);
  refreshDashboard();
  if (nowReached && !wasReached) {
    showNotif('🎉', 'Cel nawodnienia osiągnięty!', data.glasses * data.mlPerGlass + ' ml wypite!');
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
    // Stop water reminders for today
    stopWaterReminder();
  }
}

// ── Stats for Wrapped / Seasons etc ──
function getHydrationStats() {
  var data = loadHydrationData();
  var history = data.history || [];
  var allDays = history.concat([{ date: data.date, glasses: data.glasses }]);
  var avgGlasses = allDays.length ? Math.round(allDays.reduce(function(a, d) { return a + d.glasses; }, 0) / allDays.length * 10) / 10 : 0;
  var bestDay = allDays.reduce(function(best, d) { return d.glasses > (best ? best.glasses : 0) ? d : best; }, null);
  // Streak: consecutive days hitting goal
  var streak = 0;
  var sorted = [...history].sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  for (var i = 0; i < sorted.length; i++) {
    if (sorted[i].glasses >= data.goal) streak++;
    else break;
  }
  return { today: data.glasses, todayMl: data.glasses * data.mlPerGlass, avg: avgGlasses, best: bestDay, streak: streak, goal: data.goal };
}

// ── Water Reminder ──
var _waterReminderTimer = null;

function toggleWaterNotif(el) {
  el.classList.toggle('on');
  var on = el.classList.contains('on');
  state.settings.waterNotifEnabled = on;
  var row = document.getElementById('water-notif-interval-row');
  if (row) row.style.display = on ? 'flex' : 'none';
  if (on) startWaterReminder();
  else stopWaterReminder();
  saveSettings();
}

function saveWaterNotifSettings() {
  var sel = document.getElementById('water-notif-interval');
  state.settings.waterNotifInterval = parseInt(sel ? sel.value : 60) || 60;
  var subEl = document.getElementById('water-notif-sub');
  if (subEl) subEl.textContent = 'Co ' + state.settings.waterNotifInterval + ' min';
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
  var interval = s.waterNotifInterval || 60;
  if (sub) sub.textContent = 'Co ' + interval + ' min';
  if (s.waterNotifEnabled) startWaterReminder();
}

function startWaterReminder() {
  stopWaterReminder();
  var data = loadHydrationData();
  if (data.glasses >= data.goal) return; // Already done for today
  var interval = (state.settings.waterNotifInterval || 60) * 60 * 1000;
  _waterReminderTimer = setInterval(function() {
    var d = loadHydrationData();
    if (d.glasses >= d.goal) {
      stopWaterReminder();
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification('💧 Napij się wody!', {
        body: 'Twoje ciało będzie Ci wdzięczne. (' + d.glasses + '/' + d.goal + ' szklanek)',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>'
      });
    } else {
      showNotif('💧', 'Napij się wody!', d.glasses + '/' + d.goal + ' szklanek dzisiaj');
    }
  }, interval);

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function stopWaterReminder() {
  if (_waterReminderTimer) {
    clearInterval(_waterReminderTimer);
    _waterReminderTimer = null;
  }
}

// Check midnight reset
(function scheduleHydrationReset() {
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  var msUntilMidnight = midnight - now;
  setTimeout(function() {
    // Force reload hydration (will auto-reset)
    loadHydrationData();
    refreshDashboard();
    if (state.settings.waterNotifEnabled) startWaterReminder();
    scheduleHydrationReset();
  }, msUntilMidnight);
})();

// ── Backup / Restore ──

function createBackup() {
  var backup = {
    _version: 'gymflow_backup_v1',
    _date: new Date().toISOString(),
    // IndexedDB data (from state)
    plans:           state.plans,
    workouts:        state.workouts,
    customExercises: state.customExercises,
    weights:         state.weights,
    measurements:    state.measurements,
    goals:           state.goals,
    timeline:        state.timeline,
    settings:        state.settings,
    // localStorage keys
    achievements:    JSON.parse(localStorage.getItem('gymflow_achievements') || '{}'),
    hydration:       JSON.parse(localStorage.getItem('gymflow_hydration')    || '{}'),
    bodyMeasurements:JSON.parse(localStorage.getItem('gymflow_body_measurements') || '[]'),
    genderSet:       localStorage.getItem('gymflow_gender_set') || '',
  };

  var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gymflow_backup_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  showNotif('💾', 'Backup gotowy', 'Plik zapisany na urządzeniu');
}

async function restoreBackup(input) {
  var file = input.files[0];
  if (!file) return;
  input.value = '';

  var reader = new FileReader();
  reader.onload = async function(e) {
    try {
      var backup = JSON.parse(e.target.result);

      if (!backup._version || !backup._version.startsWith('gymflow_backup')) {
        showNotif('❌', 'Błąd', 'To nie jest plik backup GymFlow');
        return;
      }

      if (!confirm('Przywrócić kopię zapasową z ' + new Date(backup._date).toLocaleString('pl') + '?\n\nOBUWAGA: Obecne dane zostaną zastąpione.')) return;

      // Restore state
      if (backup.plans)           state.plans           = backup.plans;
      if (backup.workouts)        state.workouts        = backup.workouts;
      if (backup.customExercises) state.customExercises = backup.customExercises;
      if (backup.weights)         state.weights         = backup.weights;
      if (backup.measurements)    state.measurements    = backup.measurements;
      if (backup.goals)           state.goals           = backup.goals;
      if (backup.timeline)        state.timeline        = backup.timeline;
      if (backup.settings)        state.settings        = Object.assign({}, state.settings, backup.settings);

      // Save to IndexedDB
      await dbPut('plans',       { id: 'all', data: state.plans });
      await dbPut('workouts',    { id: 'all', data: state.workouts });
      await dbPut('exercises',   { id: 'custom', data: state.customExercises });
      await dbPut('weights',     { id: 'all', data: state.weights });
      await dbPut('measurements',{ id: 'all', data: state.measurements });
      await dbPut('goals',       { id: 'all', data: state.goals });
      await dbPut('timeline',    { id: 'all', data: state.timeline });

      // Restore localStorage
      if (backup.achievements)     localStorage.setItem('gymflow_achievements',       JSON.stringify(backup.achievements));
      if (backup.hydration)        localStorage.setItem('gymflow_hydration',          JSON.stringify(backup.hydration));
      if (backup.bodyMeasurements) localStorage.setItem('gymflow_body_measurements',  JSON.stringify(backup.bodyMeasurements));
      if (backup.genderSet)        localStorage.setItem('gymflow_gender_set',         backup.genderSet);

      // Save settings
      localStorage.setItem('gymflow_settings', JSON.stringify(state.settings));

      // Reload UI
      loadSettings();
      refreshDashboard();
      renderPlans();

      showNotif('✅', 'Backup przywrócony!', 'Dane zostały wczytane pomyślnie');
    } catch(err) {
      console.error('Backup restore error:', err);
      showNotif('❌', 'Błąd przywracania', 'Sprawdź plik i spróbuj ponownie');
    }
  };
  reader.readAsText(file);
}

function setHydrationGoal(val) {
  var goal = Math.max(1, Math.min(20, parseInt(val) || 8));
  var data = loadHydrationData();
  data.goal = goal;
  saveHydrationData(data);
  refreshDashboard();
}
