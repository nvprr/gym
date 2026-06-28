// ===================== BODY_MEASUREMENTS.JS =====================
// Pomiary ciała — jeden formularz: waga, wzrost, wymiary
// Dane: localStorage 'gymflow_body_measurements'

// ── Definicja wszystkich pól ──
var BM_FIELDS = [
  // Ogólne
  { id:'weight',    label:'Waga',              unit:'kg',  group:'general', icon:'⚖️',  step:'0.1' },
  { id:'height',    label:'Wzrost',            unit:'cm',  group:'general', icon:'📏',  step:'0.1' },
  // Góra ciała
  { id:'chest',     label:'Klatka piersiowa',  unit:'cm',  group:'upper',   icon:'💪',  step:'0.1' },
  { id:'bicep-l',   label:'Biceps lewy',        unit:'cm',  group:'upper',   icon:'💪',  step:'0.1' },
  { id:'bicep-r',   label:'Biceps prawy',       unit:'cm',  group:'upper',   icon:'💪',  step:'0.1' },
  { id:'forearm-l', label:'Przedramię lewe',    unit:'cm',  group:'upper',   icon:'💪',  step:'0.1' },
  { id:'forearm-r', label:'Przedramię prawe',   unit:'cm',  group:'upper',   icon:'💪',  step:'0.1' },
  // Core
  { id:'waist',     label:'Brzuch',            unit:'cm',  group:'core',    icon:'🎯',  step:'0.1' },
  { id:'hip-l',     label:'Biodra lewe',        unit:'cm',  group:'core',    icon:'🎯',  step:'0.1' },
  { id:'hip-r',     label:'Biodra prawe',       unit:'cm',  group:'core',    icon:'🎯',  step:'0.1' },
  // Dół ciała
  { id:'thigh',     label:'Uda',               unit:'cm',  group:'lower',   icon:'🦵',  step:'0.1' },
  { id:'calf-l',    label:'Łydka lewa',         unit:'cm',  group:'lower',   icon:'🦵',  step:'0.1' },
  { id:'calf-r',    label:'Łydka prawa',        unit:'cm',  group:'lower',   icon:'🦵',  step:'0.1' },
];

var BM_GROUPS = {
  general: { label: '⚖️ Ogólne',    fields: ['weight','height'] },
  upper:   { label: '💪 Góra ciała', fields: ['chest','bicep-l','bicep-r','forearm-l','forearm-r'] },
  core:    { label: '🎯 Core',       fields: ['waist','hip-l','hip-r'] },
  lower:   { label: '🦵 Dół ciała',  fields: ['thigh','calf-l','calf-r'] },
};

// ── Storage ──
function loadBodyMeasurements() {
  try { return JSON.parse(localStorage.getItem('gymflow_body_measurements') || '[]'); }
  catch(e) { return []; }
}
function saveBodyMeasurementsLS(data) {
  localStorage.setItem('gymflow_body_measurements', JSON.stringify(data));
}

// ── Toggle section ──
var bmOpen = false;
function toggleBodyMeasurements() {
  bmOpen = !bmOpen;
  var body = document.getElementById('body-meas-body');
  var chev = document.getElementById('body-meas-chevron');
  if (!body || !chev) return;
  body.style.display = bmOpen ? 'block' : 'none';
  chev.style.transform = bmOpen ? 'rotate(90deg)' : '';
  if (bmOpen) renderBodyMeasurements();
}

// ── Open sheet ──
function openBodyMeasurementsSheet() {
  var dateEl = document.getElementById('bm-date-input');
  if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);
  BM_FIELDS.forEach(function(f) {
    var el = document.getElementById('bm-' + f.id);
    if (el) el.value = '';
  });
  openSheet('body-measurements-sheet');
}

// ── Save ──
function saveBodyMeasurements() {
  var dateEl = document.getElementById('bm-date-input');
  if (!dateEl || !dateEl.value) { showNotif('⚠️', 'Błąd', 'Wybierz datę'); return; }

  var record = { id: uid(), date: new Date(dateEl.value).toISOString() };
  var hasAny = false;
  BM_FIELDS.forEach(function(f) {
    var el = document.getElementById('bm-' + f.id);
    var val = el ? parseFloat(el.value) : NaN;
    record[f.id] = (!isNaN(val) && val > 0) ? val : null;
    if (!isNaN(val) && val > 0) hasAny = true;
  });

  if (!hasAny) { showNotif('⚠️', 'Brak danych', 'Wpisz przynajmniej jeden pomiar'); return; }

  var all = loadBodyMeasurements().filter(function(r) {
    return new Date(r.date).toDateString() !== new Date(record.date).toDateString();
  });
  all.push(record);
  all.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  saveBodyMeasurementsLS(all);
  closeAllSheets();
  showNotif('✅', 'Pomiary zapisane', '');
  renderBodyMeasurements();
}

// ── Delete ──
function deleteBodyMeasurement(id) {
  if (!confirm('Usunąć ten pomiar?')) return;
  var all = loadBodyMeasurements().filter(function(r) { return r.id !== id; });
  saveBodyMeasurementsLS(all);
  renderBodyMeasurements();
  showNotif('🗑', 'Pomiar usunięty', '');
}

// ── Render ──
function renderBodyMeasurements() {
  var all = loadBodyMeasurements();
  var latestEl  = document.getElementById('body-meas-latest');
  var historyEl = document.getElementById('body-meas-history');
  if (!latestEl || !historyEl) return;

  if (!all.length) {
    latestEl.innerHTML  = '<div style="color:var(--text3);font-size:13px;padding:8px 0 4px;">Brak pomiarów. Dodaj pierwszy wpis.</div>';
    historyEl.innerHTML = '';
    return;
  }

  var latest = all[0];
  var prev   = all[1] || null;

  // ── Latest: karty per grupa ──
  var lHtml = '<div style="font-size:11px;color:var(--text4);margin-bottom:10px;">Ostatni wpis: ' + new Date(latest.date).toLocaleDateString('pl', {day:'numeric',month:'short',year:'numeric'}) + '</div>';

  Object.keys(BM_GROUPS).forEach(function(gKey) {
    var g = BM_GROUPS[gKey];
    var fieldDefs = BM_FIELDS.filter(function(f) { return g.fields.indexOf(f.id) !== -1; });
    var hasData = fieldDefs.some(function(f) { return latest[f.id] != null; });
    if (!hasData) return;

    lHtml += '<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin:12px 0 6px;">' + g.label + '</div>';
    lHtml += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    fieldDefs.forEach(function(f) {
      if (latest[f.id] == null) return;
      var diff = '';
      if (prev && prev[f.id] != null) {
        var d = +(latest[f.id] - prev[f.id]).toFixed(1);
        var col = (f.id === 'weight' || f.id === 'waist') ? (d < 0 ? 'var(--green)' : d > 0 ? 'var(--accent)' : 'var(--text3)') : (d > 0 ? 'var(--green)' : d < 0 ? 'var(--accent)' : 'var(--text3)');
        if (d !== 0) diff = '<span style="font-size:11px;color:' + col + ';margin-left:4px;">' + (d > 0 ? '+' : '') + d + '</span>';
      }
      lHtml += '<div style="background:var(--surface2);border-radius:10px;padding:10px 12px;">'
        + '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">' + f.label + '</div>'
        + '<div style="font-size:16px;font-weight:700;">' + (+latest[f.id]).toFixed(1) + ' ' + f.unit + diff + '</div>'
        + '</div>';
    });
    lHtml += '</div>';
  });

  latestEl.innerHTML = lHtml;

  // ── History list ──
  if (all.length <= 1) { historyEl.innerHTML = ''; return; }

  var hHtml = '<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 6px;">Historia</div>';
  all.slice(1).forEach(function(rec) {
    var summary = BM_FIELDS.filter(function(f) { return rec[f.id] != null; })
      .slice(0, 3).map(function(f) { return f.label + ': ' + (+rec[f.id]).toFixed(1) + f.unit; }).join(' · ');
    hHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:.5px solid var(--border2);">'
      + '<div><div style="font-size:13px;font-weight:600;">' + new Date(rec.date).toLocaleDateString('pl') + '</div>'
      + '<div style="font-size:11px;color:var(--text3);margin-top:2px;">' + (summary || 'Brak danych') + '</div></div>'
      + '<button onclick="deleteBodyMeasurement(\'' + rec.id + '\')" style="background:none;border:none;color:var(--red);font-size:18px;cursor:pointer;padding:4px 8px;">✕</button>'
      + '</div>';
  });
  historyEl.innerHTML = hHtml;
}
