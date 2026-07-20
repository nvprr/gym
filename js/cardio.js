// ===================== CARDIO.JS =====================
// Prosty moduł do ręcznego zapisywania aktywności cardio.
// Bez GPS, bez map, bez zewnętrznych API — tylko IndexedDB (store 'cardio').
// Dane: state.cardioActivities = [{ id, type, date, duration, distance, note }]
//   duration → minuty, distance → km (dla basenu liczony automatycznie).

// ── Konfiguracja typów ──
var CARDIO_TYPES = [
  { key:'run',   icon:'🏃', label:'Bieganie' },
  { key:'walk',  icon:'🚶', label:'Spacer' },
  { key:'bike',  icon:'🚴', label:'Rower' },
  { key:'swim',  icon:'🏊', label:'Basen' },
  { key:'other', icon:'❤️', label:'Inne' },
];

// Podpowiedzi po zapisaniu aktywności — patrz getCardioTipMessage() niżej (reguły, bez losowości).

// ── Zmienne UI ──
var _cardioType = 'run';
var _cardioEditId = null;
var _cardioChartMode = 'distance'; // 'distance' | 'duration'
var _cardioChartWeeks = []; // dane ostatnich 6 tygodni (do obsługi kliknięcia w punkt wykresu)

function _cardioTypeInfo(key) {
  return CARDIO_TYPES.find(function(t) { return t.key === key; }) || CARDIO_TYPES[CARDIO_TYPES.length - 1];
}

function _fmtCardioDuration(totalMin) {
  totalMin = Math.round(totalMin || 0);
  var h = Math.floor(totalMin / 60);
  var m = totalMin % 60;
  return h > 0 ? (h + 'h ' + m + 'min') : (m + ' min');
}

// ── Główny render zakładki ──
function renderCardioTab() {
  renderCardioStats();
  renderCardioChart();
  renderCardioHistory();
}

function renderCardioStats() {
  var el = document.getElementById('cardio-stats');
  if (!el) return;
  var acts = state.cardioActivities || [];
  var since = Date.now() - 7 * 86400000;
  var weekActs = acts.filter(function(a) { return new Date(a.date).getTime() > since; });
  var totalTime = acts.reduce(function(s, a) { return s + (parseFloat(a.duration) || 0); }, 0);
  var totalDist = acts.reduce(function(s, a) { return s + (parseFloat(a.distance) || 0); }, 0);
  el.innerHTML =
    '<div class="stat-card"><div class="stat-val accent">' + weekActs.length + '</div><div class="stat-label">Aktywności w tygodniu</div></div>'
    + '<div class="stat-card"><div class="stat-val">' + _fmtCardioDuration(totalTime) + '</div><div class="stat-label">Łączny czas</div></div>'
    + '<div class="stat-card"><div class="stat-val green">' + totalDist.toFixed(1) + ' km</div><div class="stat-label">Łączny dystans</div></div>';
}

function renderCardioChart() {
  var el = document.getElementById('cardio-chart');
  if (!el) return;
  var acts = state.cardioActivities || [];

  var thisMonday = typeof getWeekMonday === 'function' ? getWeekMonday(new Date()) : (function() {
    var d = new Date(); d.setHours(0, 0, 0, 0); return d;
  })();

  var weeks = [];
  for (var i = 5; i >= 0; i--) {
    var wStart = new Date(thisMonday); wStart.setDate(wStart.getDate() - i * 7);
    var wEnd = new Date(wStart); wEnd.setDate(wEnd.getDate() + 7);
    weeks.push({ start: wStart, end: wEnd, distance: 0, duration: 0, count: 0 });
  }
  acts.forEach(function(a) {
    var d = new Date(a.date);
    for (var j = 0; j < weeks.length; j++) {
      if (d >= weeks[j].start && d < weeks[j].end) {
        weeks[j].distance += parseFloat(a.distance) || 0;
        weeks[j].duration += parseFloat(a.duration) || 0;
        weeks[j].count++;
        break;
      }
    }
  });
  _cardioChartWeeks = weeks;

  var vals = weeks.map(function(w) { return _cardioChartMode === 'distance' ? w.distance : w.duration; });
  var max = Math.max.apply(null, vals.concat([1]));

  var W = 320, H = 170, padX = 26, padTop = 34, padBottom = 28;
  var stepX = weeks.length > 1 ? (W - padX * 2) / (weeks.length - 1) : 0;
  var chartH = H - padTop - padBottom;
  var points = vals.map(function(v, idx) {
    var x = padX + stepX * idx;
    var y = padTop + (max > 0 ? (1 - v / max) : 1) * chartH;
    return { x: x, y: y, v: v };
  });

  var pathD = points.map(function(p, idx) { return (idx === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');

  var dotsSvg = points.map(function(p, idx) {
    var label = _cardioChartMode === 'distance' ? (p.v > 0 ? p.v.toFixed(1) : '0') : (p.v > 0 ? Math.round(p.v) : '0');
    var wLabel = weeks[idx].start.toLocaleDateString('pl', { day: 'numeric', month: 'numeric' });
    return '<g onclick="showCardioWeekDetail(' + idx + ')" style="cursor:pointer;">'
      +   '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="16" fill="transparent"></circle>'
      +   '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6" fill="' + (p.v > 0 ? 'var(--accent)' : 'var(--surface3)') + '" stroke="var(--surface2)" stroke-width="2"></circle>'
      +   '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 14).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">' + label + '</text>'
      +   '<text x="' + p.x.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--text4)">' + wLabel + '</text>'
      + '</g>';
  }).join('');

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block;min-height:150px;">'
    +   '<path d="' + pathD + '" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.4"></path>'
    +   dotsSvg
    + '</svg>';

  el.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">'
    +   '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;">Ostatnie 6 tygodni</div>'
    +   '<div class="segment" style="width:auto;">'
    +     '<button class="segment-btn' + (_cardioChartMode === 'distance' ? ' active' : '') + '" style="padding:4px 10px;font-size:12px;" onclick="setCardioChartMode(\'distance\')">Dystans</button>'
    +     '<button class="segment-btn' + (_cardioChartMode === 'duration' ? ' active' : '') + '" style="padding:4px 10px;font-size:12px;" onclick="setCardioChartMode(\'duration\')">Czas</button>'
    +   '</div>'
    + '</div>'
    + svg
    + '<div id="cardio-week-detail"></div>';
}

function showCardioWeekDetail(idx) {
  var weeks = _cardioChartWeeks || [];
  var w = weeks[idx];
  var el = document.getElementById('cardio-week-detail');
  if (!w || !el) return;
  var endInclusive = new Date(w.end.getTime() - 86400000);
  var rangeLabel = w.start.toLocaleDateString('pl', { day: 'numeric', month: 'short' }) + ' – ' + endInclusive.toLocaleDateString('pl', { day: 'numeric', month: 'short' });
  if (!w.count) {
    el.innerHTML = '<div style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-top:10px;text-align:center;color:var(--text3);font-size:13px;">Brak aktywności w tygodniu ' + rangeLabel + '</div>';
    return;
  }
  el.innerHTML =
    '<div style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-top:10px;">'
    +   '<div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:8px;">Tydzień ' + rangeLabel + '</div>'
    +   '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'
    +     '<div style="text-align:center;"><div style="font-size:15px;font-weight:700;">' + w.count + '</div><div style="font-size:11px;color:var(--text3);">Aktywności</div></div>'
    +     '<div style="text-align:center;"><div style="font-size:15px;font-weight:700;">' + _fmtCardioDuration(w.duration) + '</div><div style="font-size:11px;color:var(--text3);">Czas</div></div>'
    +     '<div style="text-align:center;"><div style="font-size:15px;font-weight:700;">' + w.distance.toFixed(1) + ' km</div><div style="font-size:11px;color:var(--text3);">Dystans</div></div>'
    +   '</div>'
    + '</div>';
}

function setCardioChartMode(mode) {
  _cardioChartMode = mode;
  renderCardioChart();
}

function renderCardioHistory() {
  var el = document.getElementById('cardio-history');
  if (!el) return;
  var acts = (state.cardioActivities || []).slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  if (!acts.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❤️</div><div class="empty-title">Brak aktywności cardio</div><div class="empty-sub">Dodaj swoją pierwszą aktywność przyciskiem + powyżej</div></div>';
    return;
  }
  el.innerHTML = acts.map(function(a) {
    var t = _cardioTypeInfo(a.type);
    var dateStr = new Date(a.date).toLocaleDateString('pl', { day: 'numeric', month: 'short', year: 'numeric' });
    var distPart = (a.distance && a.distance > 0) ? (' · ' + (+a.distance).toFixed(2) + ' km') : '';
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">'
      +   '<div onclick="openCardioDetail(\'' + a.id + '\')" style="display:flex;align-items:center;flex:1;min-width:0;gap:12px;background:var(--surface2);border-radius:14px;padding:12px 14px;cursor:pointer;">'
      +     '<div style="font-size:26px;">' + t.icon + '</div>'
      +     '<div style="flex:1;min-width:0;">'
      +       '<div style="font-weight:700;font-size:14px;">' + t.label + '</div>'
      +       '<div style="font-size:12px;color:var(--text3);margin-top:2px;">' + dateStr + ' · ' + _fmtCardioDuration(a.duration) + distPart + '</div>'
      +     '</div>'
      +     '<div style="color:var(--text4);font-size:18px;">›</div>'
      +   '</div>'
      +   '<button onclick="event.stopPropagation();deleteCardioActivity(\'' + a.id + '\')" style="flex-shrink:0;background:rgba(255,69,58,.12);border:none;color:var(--red);font-size:14px;padding:11px 12px;border-radius:12px;cursor:pointer;">🗑</button>'
      + '</div>';
  }).join('');
}

// ── Sheet dodawania / edycji ──
function openCardioAddSheet() {
  _cardioEditId = null;
  _cardioType = 'run';
  var titleEl = document.getElementById('cardio-sheet-title');
  if (titleEl) titleEl.textContent = '➕ Dodaj aktywność';
  document.getElementById('cardio-date-input').value = new Date().toISOString().slice(0, 10);
  document.getElementById('cardio-duration-input').value = '';
  document.getElementById('cardio-distance-input').value = '';
  document.getElementById('cardio-note-input').value = '';
  document.getElementById('cardio-pool-length').value = '50';
  document.getElementById('cardio-pool-length-custom').value = '';
  document.getElementById('cardio-pool-laps').value = '';
  document.getElementById('cardio-pool-length-custom-row').style.display = 'none';
  var delBtn = document.getElementById('cardio-delete-btn');
  if (delBtn) delBtn.style.display = 'none';
  _renderCardioTypeChips();
  _toggleCardioPoolFields();
  openSheet('cardio-add-sheet');
}

function _renderCardioTypeChips() {
  var wrap = document.getElementById('cardio-type-chips');
  if (!wrap) return;
  wrap.innerHTML = CARDIO_TYPES.map(function(t) {
    var active = t.key === _cardioType;
    return '<button onclick="setCardioType(\'' + t.key + '\')" style="flex:1;min-width:60px;padding:10px 4px;border-radius:12px;border:2px solid ' + (active ? 'var(--accent)' : 'var(--border2)') + ';background:' + (active ? 'var(--accent-light)' : 'var(--surface2)') + ';color:var(--text);font-size:11px;font-weight:600;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;">'
      +   '<span style="font-size:20px;">' + t.icon + '</span>' + t.label
      + '</button>';
  }).join('');
}

function setCardioType(key) {
  _cardioType = key;
  _renderCardioTypeChips();
  _toggleCardioPoolFields();
}

function _toggleCardioPoolFields() {
  var isPool = _cardioType === 'swim';
  var poolRow = document.getElementById('cardio-pool-row');
  var distRow = document.getElementById('cardio-distance-row');
  if (poolRow) poolRow.style.display = isPool ? 'block' : 'none';
  if (distRow) distRow.style.display = isPool ? 'none' : 'block';
  if (isPool) _calcPoolDistance();
}

function onCardioPoolLengthChange() {
  var sel = document.getElementById('cardio-pool-length').value;
  var customRow = document.getElementById('cardio-pool-length-custom-row');
  if (customRow) customRow.style.display = sel === 'custom' ? 'block' : 'none';
  _calcPoolDistance();
}

function _getPoolLengthM() {
  var sel = document.getElementById('cardio-pool-length').value;
  if (sel === 'custom') return parseFloat(document.getElementById('cardio-pool-length-custom').value) || 0;
  return parseFloat(sel) || 0;
}

function _calcPoolDistance() {
  var lenM = _getPoolLengthM();
  var laps = parseFloat(document.getElementById('cardio-pool-laps').value) || 0;
  var distKm = (lenM * laps) / 1000;
  var out = document.getElementById('cardio-pool-distance-out');
  if (out) out.textContent = distKm > 0 ? distKm.toFixed(2) + ' km' : '—';
  return distKm;
}

function saveCardioActivity() {
  var dateEl = document.getElementById('cardio-date-input');
  var durEl = document.getElementById('cardio-duration-input');
  if (!dateEl.value) { showNotif('⚠️', 'Błąd', 'Wybierz datę'); return; }
  var duration = parseFloat(durEl.value);
  if (!duration || duration <= 0) { showNotif('⚠️', 'Błąd', 'Podaj czas trwania'); return; }

  var distance;
  if (_cardioType === 'swim') {
    distance = _calcPoolDistance();
  } else {
    distance = parseFloat(document.getElementById('cardio-distance-input').value) || 0;
  }

  var note = (document.getElementById('cardio-note-input').value || '').trim();

  if (!state.cardioActivities) state.cardioActivities = [];

  var newActivity = null;
  if (_cardioEditId) {
    var existing = state.cardioActivities.find(function(a) { return a.id === _cardioEditId; });
    if (existing) {
      existing.type = _cardioType;
      existing.date = new Date(dateEl.value).toISOString();
      existing.duration = duration;
      existing.distance = distance;
      existing.note = note;
    }
  } else {
    newActivity = {
      id: uid(),
      type: _cardioType,
      date: new Date(dateEl.value).toISOString(),
      duration: duration,
      distance: distance,
      note: note
    };
    state.cardioActivities.push(newActivity);
  }

  dbPut('cardio', { id: 'all', data: state.cardioActivities });
  var wasEdit = !!_cardioEditId;
  _cardioEditId = null;
  closeAllSheets();
  renderCardioTab();
  if (typeof renderDashboardCards === 'function') renderDashboardCards();
  showNotif('✅', wasEdit ? 'Aktywność zaktualizowana' : 'Aktywność zapisana', '');
  if (!wasEdit && newActivity) showCardioTip(newActivity);
}

// ── Podpowiedź po zapisaniu (statyczna, bez AI) ──
function getCardioTipMessage(newActivity) {
  var others = (state.cardioActivities || []).filter(function(a) { return a.id !== newActivity.id; });
  if (!others.length) {
    return 'Pierwszy krok jest najtrudniejszy. Tak trzymaj!';
  }
  var sorted = others.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var prev = sorted[0];
  var gapDays = (new Date(newActivity.date) - new Date(prev.date)) / 86400000;
  if (gapDays > 7) {
    return 'Dobry powrót! Staraj się trenować regularniej.';
  }
  var newDist = parseFloat(newActivity.distance) || 0;
  var prevDist = parseFloat(prev.distance) || 0;
  if (newDist > 0 && newDist > prevDist) {
    return 'Świetna robota! Dystans rośnie.';
  }
  return 'Regularność jest ważniejsza niż jednorazowo długi trening.';
}

function showCardioTip(newActivity) {
  var tip = getCardioTipMessage(newActivity);
  setTimeout(function() { showNotif('💡', 'Wskazówka', tip); }, 1500);
}

// ── Szczegóły / edycja / usuwanie ──
function openCardioDetail(id) {
  var a = (state.cardioActivities || []).find(function(x) { return x.id === id; });
  if (!a) return;
  _cardioEditId = id;
  var t = _cardioTypeInfo(a.type);
  var dateStr = new Date(a.date).toLocaleDateString('pl', { day: 'numeric', month: 'long', year: 'numeric' });
  var body = document.getElementById('cardio-detail-body');
  if (body) {
    body.innerHTML =
      '<div style="text-align:center;margin-bottom:16px;">'
      +   '<div style="font-size:40px;">' + t.icon + '</div>'
      +   '<div style="font-size:17px;font-weight:800;margin-top:6px;">' + t.label + '</div>'
      +   '<div style="font-size:13px;color:var(--text3);">' + dateStr + '</div>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">'
      +   '<div class="stat-card"><div class="stat-val">' + _fmtCardioDuration(a.duration) + '</div><div class="stat-label">Czas</div></div>'
      +   '<div class="stat-card"><div class="stat-val">' + (a.distance ? (+a.distance).toFixed(2) : '0') + ' km</div><div class="stat-label">Dystans</div></div>'
      + '</div>'
      + (a.note ? '<div style="background:var(--surface2);border-radius:12px;padding:12px;font-size:13px;color:var(--text2);">' + a.note + '</div>' : '')
      + '<button class="btn btn-secondary" style="width:100%;margin-top:14px;" onclick="deleteCardioActivity()">🗑 Usuń aktywność</button>';
  }
  openSheet('cardio-detail-sheet');
}

function editCardioFromDetail() {
  var a = (state.cardioActivities || []).find(function(x) { return x.id === _cardioEditId; });
  if (!a) return;
  closeSheet('cardio-detail-sheet');
  var titleEl = document.getElementById('cardio-sheet-title');
  if (titleEl) titleEl.textContent = '✏️ Edytuj aktywność';
  _cardioType = a.type;
  document.getElementById('cardio-date-input').value = new Date(a.date).toISOString().slice(0, 10);
  document.getElementById('cardio-duration-input').value = a.duration;
  document.getElementById('cardio-distance-input').value = a.distance || '';
  document.getElementById('cardio-note-input').value = a.note || '';
  document.getElementById('cardio-pool-length-custom-row').style.display = 'none';
  var delBtn = document.getElementById('cardio-delete-btn');
  if (delBtn) delBtn.style.display = 'block';
  _renderCardioTypeChips();
  _toggleCardioPoolFields();
  openSheet('cardio-add-sheet');
}

function deleteCardioActivity(id) {
  var targetId = id || _cardioEditId;
  if (!targetId) return;
  if (!confirm('Usunąć tę aktywność?')) return;
  state.cardioActivities = (state.cardioActivities || []).filter(function(a) { return a.id !== targetId; });
  dbPut('cardio', { id: 'all', data: state.cardioActivities });
  if (targetId === _cardioEditId) _cardioEditId = null;
  var detailSheet = document.getElementById('cardio-detail-sheet');
  if (detailSheet && detailSheet.classList.contains('open')) closeSheet('cardio-detail-sheet');
  renderCardioTab();
  if (typeof renderDashboardCards === 'function') renderDashboardCards();
  showNotif('🗑', 'Aktywność usunięta', '');
}
