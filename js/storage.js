// ===================== STORAGE.JS =====================

function loadSettings(){
  const s=JSON.parse(localStorage.getItem('gymflow_settings')||'null');
  if(s)state.settings={...state.settings,...s};
  if(!Array.isArray(state.settings.dashboardOrder) || !state.settings.dashboardOrder.length){
    state.settings.dashboardOrder=DEFAULT_DASHBOARD_ORDER.slice();
  }
  if(!Array.isArray(state.settings.dashboardHidden)){
    state.settings.dashboardHidden=[];
  }
  if(!state.settings.dashboardGoal) state.settings.dashboardGoal=4;
  applyTheme();
  // theme handled by applyTheme()
  document.getElementById('rest-compound').value=state.settings.restCompound||90;
  document.getElementById('rest-isolation').value=state.settings.restIsolation||60;
  document.getElementById('rest-abs').value=state.settings.restAbs||45;
  document.getElementById('gender-display').textContent=state.settings.gender==='female'?'Kobieta':'Mężczyzna';
  document.getElementById('profile-name-display').textContent=state.settings.username||'GymFlow';
  document.getElementById('profile-avatar-icon').textContent=state.settings.avatar||'🦁';
  const goalInput=document.getElementById('dashboard-goal-profile-input');
  if(goalInput) goalInput.value=state.settings.dashboardGoal||4;
  if(!state.settings.vibration)document.getElementById('vibration-toggle').classList.remove('on');
  if(!state.settings.sound)document.getElementById('sound-toggle').classList.remove('on');
  loadNotifSettings();
}

function saveSettings(){
  state.settings.restCompound=parseInt(document.getElementById('rest-compound').value)||90;
  state.settings.restIsolation=parseInt(document.getElementById('rest-isolation').value)||60;
  state.settings.restAbs=parseInt(document.getElementById('rest-abs').value)||45;
  if(!state.settings.username) state.settings.username='GymFlow';
  if(!state.settings.avatar) state.settings.avatar='🦁';
  if(!state.settings.dashboardGoal) state.settings.dashboardGoal=4;
  localStorage.setItem('gymflow_settings',JSON.stringify(state.settings));
}

function loadUnlockedAchievements() {
  try { return JSON.parse(localStorage.getItem('gymflow_achievements') || '{}'); }
  catch(e) { return {}; }
}

function saveUnlockedAchievements(unlocked) {
  localStorage.setItem('gymflow_achievements', JSON.stringify(unlocked));
}

function applyTheme() {
  var mode = state.settings.theme || 'dark';
  if (mode === 'auto') {
    var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('light-mode', !dark);
  } else {
    document.body.classList.toggle('light-mode', mode === 'light');
  }
  applyAccentColor(state.settings.accentTheme || 'orange');
  // Update mode button styles
  ['dark','light','auto'].forEach(function(m) {
    var btn = document.getElementById('mode-'+m);
    if (!btn) return;
    var active = m === mode;
    btn.style.borderColor = active ? 'var(--accent)' : 'var(--border2)';
    btn.style.color = active ? 'var(--accent)' : 'var(--text3)';
    btn.style.background = active ? 'var(--surface3)' : 'var(--surface2)';
  });
  if (!window._themeListener) {
    window._themeListener = true;
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      if (state.settings.theme === 'auto') applyTheme();
    });
  }
}

// ── Theme System ──
var ACCENT_THEMES = {
  orange:   {accent:'#FF375F',accent2:'#FF6B35',glow:'rgba(255,55,95,0.25)',hover:'#e02d52',light:'rgba(255,55,95,0.15)',gs:'#FF375F',ge:'#FF6B35'},
  blue:     {accent:'#0A84FF',accent2:'#34AADC',glow:'rgba(10,132,255,0.25)',hover:'#0070e0',light:'rgba(10,132,255,0.15)',gs:'#0A84FF',ge:'#34AADC'},
  green:    {accent:'#30D158',accent2:'#34C759',glow:'rgba(48,209,88,0.25)',hover:'#28b84d',light:'rgba(48,209,88,0.15)',gs:'#30D158',ge:'#34C759'},
  purple:   {accent:'#BF5AF2',accent2:'#9B59B6',glow:'rgba(191,90,242,0.25)',hover:'#a84ee0',light:'rgba(191,90,242,0.15)',gs:'#BF5AF2',ge:'#9B59B6'},
  red:      {accent:'#FF453A',accent2:'#FF6961',glow:'rgba(255,69,58,0.25)',hover:'#e03c32',light:'rgba(255,69,58,0.15)',gs:'#FF453A',ge:'#FF6961'},
  pink:     {accent:'#FF2D92',accent2:'#FF6EB0',glow:'rgba(255,45,146,0.25)',hover:'#e0207e',light:'rgba(255,45,146,0.15)',gs:'#FF2D92',ge:'#FF6EB0'},
  graphite: {accent:'#8E8E93',accent2:'#AEAEB2',glow:'rgba(142,142,147,0.25)',hover:'#737378',light:'rgba(142,142,147,0.15)',gs:'#8E8E93',ge:'#AEAEB2'},
};

function applyAccentColor(themeName) {
  var t = ACCENT_THEMES[themeName] || ACCENT_THEMES.orange;
  var r = document.documentElement;
  r.style.setProperty('--accent',         t.accent);
  r.style.setProperty('--accent2',        t.accent2);
  r.style.setProperty('--accent-glow',    t.glow);
  r.style.setProperty('--accent-hover',   t.hover);
  r.style.setProperty('--accent-light',   t.light);
  r.style.setProperty('--gradient-start', t.gs);
  r.style.setProperty('--gradient-end',   t.ge);
  // Update accent button borders
  ['orange','blue','green','purple','red','pink','graphite'].forEach(function(n) {
    var btn = document.getElementById('ac-'+n);
    if (btn) btn.style.borderColor = n === themeName ? '#fff' : 'transparent';
  });
}

function setAppearanceMode(mode) {
  state.settings.theme = mode;
  applyTheme();
  saveSettings();
}

function setAccentTheme(name) {
  state.settings.accentTheme = name;
  applyAccentColor(name);
  saveSettings();
}


function toggleTheme(el){el.classList.toggle('on');state.settings.theme=el.classList.contains('on')?'light':'dark';applyTheme();saveSettings()}

function toggleVibration(el){el.classList.toggle('on');state.settings.vibration=el.classList.contains('on');saveSettings()}

function toggleSound(el){el.classList.toggle('on');state.settings.sound=el.classList.contains('on');saveSettings()}

