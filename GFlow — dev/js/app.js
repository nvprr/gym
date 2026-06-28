// ===================== APP.JS =====================

async function init(){
  await initDB();
  await loadAllData();
  loadSettings();

  // First launch → show gender picker
  if(!localStorage.getItem('gymflow_gender_set')){
    document.getElementById('gender-picker').classList.add('open');
  } else {
    refreshDashboard();
    renderMuscleMapMain();
  }

  // Retroactive achievements for existing users (silent — no animation)
  if(state.workouts.length > 0){
    checkAchievements(false);
  }

  // Seed sample plan
  if(!state.plans.length){
    state.plans.push({id:uid(),name:'Push Pull Legs',emoji:'🔥',days:[
      {id:uid(),name:'Push — Klatka / Barki / Triceps',restTime:90,exercises:[{id:'e1',name:'Wyciskanie sztangi (Bench Press)',sets:4,reps:'6-10',restTime:'default'},{id:'e17',name:'Wyciskanie żołnierskie (OHP)',sets:3,reps:'8-12',restTime:'default'},{id:'e18',name:'Boczne unoszenie hantli (Dumbbell Lateral Raise)',sets:3,reps:'12-15',restTime:'default'},{id:'e22',name:'Prostowanie ramion wyciąg (Tricep Pushdown)',sets:3,reps:'12-15',restTime:'default'}]},
      {id:uid(),name:'Pull — Plecy / Biceps',restTime:90,exercises:[{id:'e7',name:'Podciąganie na drążku (Pull Ups)',sets:4,reps:'6-10',restTime:'default'},{id:'e8',name:'Wiosłowanie sztangą (Bent Over Row)',sets:3,reps:'8-12',restTime:'default'},{id:'e20',name:'Uginanie ramion hantlami (Dumbbell Curl)',sets:3,reps:'10-15',restTime:'default'}]},
      {id:uid(),name:'Legs — Nogi',restTime:120,exercises:[{id:'e11',name:'Przysiad ze sztangą (Back Squat)',sets:4,reps:'6-10',restTime:'default'},{id:'e16',name:'Hip thrust ze sztangą (Barbell Hip Thrust)',sets:3,reps:'10-15',restTime:'default'},{id:'e15',name:'Wznosy łydek stojąc (Standing Calf Raise)',sets:4,reps:'15-20',restTime:'default'}]},
    ]});
    await dbPut('plans',{id:'all',data:state.plans});
  }
}

async function loadAllData(){
  try{
    const plans=await dbGet('plans','all');if(plans?.data)state.plans=plans.data;
    const workouts=await dbGet('workouts','all');if(workouts?.data)state.workouts=workouts.data;
    const exercises=await dbGet('exercises','custom');if(exercises?.data)state.customExercises=exercises.data;
    const weights=await dbGet('weights','all');if(weights?.data)state.weights=weights.data;
    const measurements=await dbGet('measurements','all');if(measurements?.data)state.measurements=measurements.data;
    const goals=await dbGet('goals','all');if(goals?.data)state.goals=goals.data;
    const timeline=await dbGet('timeline','all');if(timeline?.data)state.timeline=timeline.data;
  }catch(e){console.warn('Load:',e)}
}

function showTab(tab){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  const tabs=['dashboard','workout','plans','progress','musclemap','profile'];
  const idx=tabs.indexOf(tab);
  if(idx>=0)document.querySelectorAll('.tab-btn')[idx].classList.add('active');
  document.getElementById('content').scrollTop=0;
  if(tab==='dashboard')refreshDashboard();
  if(tab==='musclemap'){renderMuscleMapMain();renderBalancePreview()}
  if(tab==='plans')renderPlans();
  if(tab==='workout'){renderHistory();renderCalendar();}
  if(tab==='profile'){renderProfileMetrics();}
  if(tab==='progress'){renderProgressTab(progressTab);}
}

function openSheet(id){
  document.getElementById('sheet-overlay').classList.add('open');
  document.getElementById(id).classList.add('open');
}

function closeSheet(id){
  document.getElementById(id).classList.remove('open');
  // Only hide overlay if no sheets remain open
  if(!document.querySelectorAll('.sheet.open').length){
    document.getElementById('sheet-overlay').classList.remove('open');
  }
}

function closeAllSheets(){
  // Close all sheets but NEVER close training-view
  document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('open'));
  document.getElementById('sheet-overlay').classList.remove('open');
}

function setGenderFirstTime(g){
  const username=document.getElementById('startup-username-input')?.value.trim()||'GymFlow';
  state.settings.gender=g;
  state.settings.username=username;
  saveSettings();
  document.getElementById('gender-display').textContent=g==='male'?'Mężczyzna':'Kobieta';
  document.getElementById('profile-name-display').textContent=username;
  document.getElementById('gender-picker').classList.remove('open');
  refreshDashboard();
  renderMuscleMapMain();
}

function setGender(g,el){
  state.settings.gender=g;
  saveSettings();
  document.getElementById('gender-display').textContent=g==='male'?'Mężczyzna':'Kobieta';
  closeAllSheets();
  renderMuscleMapMain();
  showNotif('✅','Sylwetka zmieniona',g==='male'?'Mężczyzna':'Kobieta');
}

function showNotif(icon,title,sub){
  clearTimeout(notifTimer);
  document.getElementById('notif-icon').textContent=icon;
  document.getElementById('notif-title').textContent=title;
  document.getElementById('notif-sub').textContent=sub;
  document.getElementById('notif').classList.add('show');
  notifTimer=setTimeout(()=>document.getElementById('notif').classList.remove('show'),3000);
}

function overlayClick(){
  // Clicking overlay background: only close picker/detail sheets, not training
  closeAllSheets();
}

function setRating(n){window._workoutRating=n;for(let i=1;i<=10;i++)document.getElementById('star-'+i).classList.toggle('lit',i<=n)}

function openExDetail(exId){
  state.selectedExercise=getAllExercises().find(e=>e.id===exId);
  if(!state.selectedExercise)return;
  document.getElementById('ex-detail-name').textContent=state.selectedExercise.name;
  document.getElementById('ex-detail-desc').textContent=state.selectedExercise.desc||'';
  document.getElementById('ex-detail-muscles').textContent=`Główna: ${state.selectedExercise.muscle}${state.selectedExercise.aux?.length?' · Pomocnicze: '+state.selectedExercise.aux.join(', '):''}`;
  document.getElementById('ex-sets-input').value='3';
  document.getElementById('ex-reps-input').value='8-12';
  document.getElementById('ex-rest-input').value='default';
  document.getElementById('ex-note-input').value='';
  openSheet('ex-detail-sheet');
}

function renderExerciseLibrary(){
  let f=getAllExercises();
  if(exFilter.group!=='all') f=f.filter(e=>e.muscle===exFilter.group);
  if(exFilter.sub!=='all')   f=f.filter(e=>e.sub===exFilter.sub);
  if(exFilter.cat!=='all')   f=f.filter(e=>e.category===exFilter.cat);
  if(exFilter.search)        f=f.filter(e=>e.name.toLowerCase().includes(exFilter.search.toLowerCase())||(e.sub||'').toLowerCase().includes(exFilter.search.toLowerCase()));

  const countEl=document.getElementById('ex-count-label');
  if(countEl) countEl.textContent=`${f.length} ćwiczeń`;

  const el=document.getElementById('exercise-library-list');
  if(!f.length){
    el.innerHTML=`<div style="text-align:center;color:var(--text4);padding:20px;font-size:14px;">Brak wyników.</div>`;
    return;
  }
  el.innerHTML=f.map(function(ex){
    var auxHtml=(ex.aux||[]).slice(0,2).map(function(a){return '<span class="muscle-tag">'+a+'</span>';}).join('');
    return '<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:.5px solid var(--border2);cursor:pointer;" onclick="openExDetail(\''+ex.id+'\')">'
      +'<div style="flex:1;">'
      +'<div style="font-weight:600;font-size:14px;">'+ex.name+'</div>'
      +'<div style="display:flex;gap:5px;margin-top:3px;flex-wrap:wrap;">'
      +'<span class="muscle-tag" style="background:rgba(255,55,95,.15);color:var(--accent);">'+(ex.sub||ex.muscle)+'</span>'
      +auxHtml
      +'<span class="muscle-tag" style="font-style:italic;">'+ex.category+'</span>'
      +'</div></div>'
      +'<div style="font-size:18px;color:var(--text4);">›</div>'
      +'</div>';
  }).join('');
}

function filterExercises(q){exFilter.search=q;renderExerciseLibrary()}

function filterExByMuscle(g,el){setExGroup(g,el)}

function resetExFilter(){
  exFilter={group:'all',sub:'all',cat:'all',search:''};
  document.getElementById('ex-search').value='';
  document.querySelectorAll('#ex-group-chips .ex-chip').forEach(b=>b.classList.remove('active'));
  document.querySelector('#ex-group-chips .ex-chip').classList.add('active');
  document.querySelectorAll('.ex-chip-sm').forEach(b=>b.classList.remove('active'));
  document.getElementById('excat-all').classList.add('active');
  document.getElementById('ex-sub-chips').innerHTML='';
  renderExerciseLibrary();
}

function setExCat(c,el){
  exFilter.cat=c;
  document.querySelectorAll('.ex-chip-sm').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderExerciseLibrary();
}

function setExGroup(g,el){
  exFilter.group=g;exFilter.sub='all';
  document.querySelectorAll('#ex-group-chips .ex-chip').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  // Build sub-chips
  const subs=[...new Set(getAllExercises().filter(e=>g==='all'||e.muscle===g).map(e=>e.sub).filter(Boolean))];
  const subEl=document.getElementById('ex-sub-chips');
  if(subs.length>1){
    subEl.innerHTML=`<button class="ex-chip active" onclick="setExSub('all',this)">Wszystkie</button>`
      +subs.map(s=>`<button class="ex-chip" onclick="setExSub('${s}',this)">${s}</button>`).join('');
  } else {subEl.innerHTML='';}
  renderExerciseLibrary();
}

function setExSub(s,el){
  exFilter.sub=s;
  document.querySelectorAll('#ex-sub-chips .ex-chip').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderExerciseLibrary();
}

function openCustomExSheet(){}

function openExercisePickerFromDay(){
  state.exercisePickerFrom='day';
  resetExFilter();
  openSheet('exercise-picker-sheet');
}

