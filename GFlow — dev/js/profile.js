// ===================== PROFILE.JS =====================

function renderProfileMetrics(){
  // Update achievements badge in header
  try {
    var unl = loadUnlockedAchievements();
    var done = Object.keys(unl).length;
    var tot = ACHIEVEMENTS.length;
    var badgeEl = document.getElementById('ach-summary-badge');
    if (badgeEl) badgeEl.textContent = done+'/'+tot;
  } catch(e) {}
  const summaryEl=document.getElementById('profile-metrics-summary');
  const historyEl=document.getElementById('profile-metrics-history');
  const chartEl=document.getElementById('profile-metrics-chart');
  if(!summaryEl||!historyEl||!chartEl)return;
  const sorted=[...state.measurements].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const latest=sorted[0];
  if(latest){
    const bmi=calculateBMI(latest.weight,latest.height);
    const status=weightStatusLabel(bmi);
    summaryEl.innerHTML=`
      <div class="metric-card"><div class="metric-card-title">Waga</div><div class="metric-card-value">${latest.weight.toFixed(1)} kg</div></div>
      <div class="metric-card"><div class="metric-card-title">BMI</div><div class="metric-card-value">${bmi?bmi.toFixed(1):'—'}</div></div>
      <div class="metric-card"><div class="metric-card-title">Wzrost</div><div class="metric-card-value">${latest.height?latest.height.toFixed(1)+' cm':'—'}</div></div>
      <div class="metric-card"><div class="metric-card-title">Status</div><div class="metric-card-value">${status}</div></div>`;
  } else {
    summaryEl.innerHTML='<div style="padding:16px;color:var(--text3);font-size:13px;">Dodaj pierwszy pomiar, aby zobaczyć historię i wykres.</div>';
  }
  if(!sorted.length){
    historyEl.innerHTML='';
    chartEl.innerHTML='';
    return;
  }
  historyEl.innerHTML=`<div class="metric-history-list">${sorted.map(m=>{
    const d=new Date(m.date);
    const bmi=calculateBMI(m.weight,m.height);
    const status=weightStatusLabel(bmi);
    return '<div class="metric-history-item"><div><div class="metric-history-date">'+d.toLocaleDateString('pl')+'</div><div style="font-size:14px;font-weight:700;">'+m.weight.toFixed(1)+' kg '+(m.height?'· '+m.height.toFixed(1)+' cm':'')+'</div><div style="font-size:12px;color:var(--text3);margin-top:4px;">BMI: '+(bmi?bmi.toFixed(1):'—')+' · Status: '+status+'</div></div><div style="text-align:right;color:var(--text4);font-size:12px;">'+(m.note||'Brak')+'</div></div>';
  }).join('')}</div>`;
  const chartData=sorted.slice(0,7).reverse();
  const maxWeight=Math.max(...chartData.map(m=>m.weight),1);
  chartEl.innerHTML=chartData.map(m=>{
    const height=(m.weight/maxWeight)*100;
    return `<div class="metric-chart-bar" style="height:${Math.max(12,height)}%"><span>${m.weight.toFixed(1)}</span></div>`;
  }).join('');
}

function toggleProfileSettings(){
  const body=document.getElementById('profile-settings-body');
  const chevron=document.getElementById('profile-settings-chevron');
  if(!body||!chevron)return;
  const isOpen=body.classList.toggle('open');
  body.classList.toggle('closed',!isOpen);
  chevron.style.transform=isOpen?'rotate(90deg)':'rotate(0deg)';
}

function toggleProfileData(){
  const body=document.getElementById('profile-data-body');
  const chevron=document.getElementById('profile-data-chevron');
  if(!body||!chevron)return;
  const isOpen=body.classList.toggle('open');
  body.classList.toggle('closed',!isOpen);
  chevron.style.transform=isOpen?'rotate(90deg)':'rotate(0deg)';
}

function toggleProfileExport(){
  const body=document.getElementById('profile-export-body');
  const chevron=document.getElementById('profile-export-chevron');
  if(!body||!chevron)return;
  const isOpen=body.classList.toggle('open');
  body.classList.toggle('closed',!isOpen);
  chevron.style.transform=isOpen?'rotate(90deg)':'rotate(0deg)';
}

function toggleProfilePanels(){
  const dataBody=document.getElementById('profile-data-body');
  const settingsBody=document.getElementById('profile-settings-body');
  const exportBody=document.getElementById('profile-export-body');
  const dataChevron=document.getElementById('profile-data-chevron');
  const settingsChevron=document.getElementById('profile-settings-chevron');
  const exportChevron=document.getElementById('profile-export-chevron');
  if(!dataBody||!settingsBody||!exportBody||!dataChevron||!settingsChevron||!exportChevron)return;
  const shouldOpen=!(dataBody.classList.contains('open') && settingsBody.classList.contains('open') && exportBody.classList.contains('open'));
  [dataBody,settingsBody,exportBody].forEach(body=>{
    body.classList.toggle('open',shouldOpen);
    body.classList.toggle('closed',!shouldOpen);
  });
  [dataChevron,settingsChevron,exportChevron].forEach(chev=>chev.style.transform=shouldOpen?'rotate(90deg)':'rotate(0deg)');
}

function openProfileSheet(){
  document.getElementById('profile-avatar-input').value=state.settings.avatar||'🦁';
  document.getElementById('profile-name-input').value=state.settings.username||'GymFlow';
  openSheet('profile-sheet');
}

function saveProfileSheet(){
  const avatar=document.getElementById('profile-avatar-input').value.trim()||'🦁';
  const username=document.getElementById('profile-name-input').value.trim()||'GymFlow';
  state.settings.avatar=avatar;
  state.settings.username=username;
  saveSettings();
  document.getElementById('profile-avatar-icon').textContent=avatar;
  document.getElementById('profile-name-display').textContent=username;
  closeSheet('profile-sheet');
  showNotif('✅','Profil zaktualizowany','');
  refreshDashboard();
}

function openWeightSheet(){
  document.getElementById('metric-date-input').value=new Date().toISOString().slice(0,10);
  document.getElementById('metric-weight-input').value='';
  document.getElementById('metric-height-input').value='';
  document.getElementById('metric-note-input').value='';
  openSheet('weight-sheet');
}

function saveMetricEntry(){
  const date=document.getElementById('metric-date-input').value;
  const weight=parseFloat(document.getElementById('metric-weight-input').value);
  const height=parseFloat(document.getElementById('metric-height-input').value);
  if(!date||isNaN(weight)){
    showNotif('❌','Waga wymagana','Podaj swoją wagę ciała');
    return;
  }
  const record={
    id:uid(),
    date:new Date(date).toISOString(),
    weight:weight,
    height:isNaN(height)?null:height,
    note:document.getElementById('metric-note-input').value||'',
    gender:state.settings.gender
  };
  state.measurements=state.measurements.filter(m=>new Date(m.date).toDateString()!==new Date(record.date).toDateString());
  state.measurements.push(record);
  state.measurements.sort((a,b)=>new Date(b.date)-new Date(a.date));
  dbPut('measurements',{id:'all',data:state.measurements}).then(()=>{
    closeAllSheets();
    showNotif('✅','Metryka zapisana','');
    renderProfileMetrics();
  }).catch(e=>{console.error(e);showNotif('❌','Błąd zapisu','Spróbuj ponownie');});
}

function calculateBMI(weight,height){
  if(!weight||!height)return null;
  const m=height/100;
  return weight/(m*m);
}

function weightStatusLabel(bmi){
  if(!bmi||isNaN(bmi))return 'Brak danych';
  if(bmi<18.5) return 'Niedowaga';
  if(bmi<25) return 'Waga prawidłowa';
  if(bmi<30) return 'Nadwaga';
  return 'Otyłość';
}

function exportData(){
  const data={version:'1.6.0',exportDate:new Date().toISOString(),plans:state.plans,workouts:state.workouts,customExercises:state.customExercises,weights:state.weights,measurements:state.measurements,settings:state.settings};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`gymflow_${new Date().toISOString().slice(0,10)}.json`;a.click();showNotif('✅','Eksport gotowy','');
}

function importData(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=async e=>{
    try{
      const data=JSON.parse(e.target.result);
      if(data.plans)state.plans=data.plans;if(data.workouts)state.workouts=data.workouts;
      if(data.customExercises)state.customExercises=data.customExercises;
      if(data.measurements)state.measurements=data.measurements;
      await dbPut('plans',{id:'all',data:state.plans});await dbPut('workouts',{id:'all',data:state.workouts});await dbPut('measurements',{id:'all',data:state.measurements});
      showNotif('✅','Import gotowy','');refreshDashboard();
    }catch(e){showNotif('❌','Błąd importu','Nieprawidłowy plik')}
  };reader.readAsText(file);input.value='';
}

async function clearData(){state.plans=[];state.workouts=[];state.customExercises=[];state.weights=[];state.measurements=[];await dbPut('plans',{id:'all',data:[]});await dbPut('workouts',{id:'all',data:[]});await dbPut('measurements',{id:'all',data:[]});refreshDashboard();renderPlans();showNotif('🗑','Dane usunięte','')}

