// ===================== PLANS.JS =====================

function renderPlans(){
  const el=document.getElementById('plans-list');
  if(!state.plans.length){el.innerHTML='<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Brak planów</div><div class="empty-sub">Stwórz swój pierwszy plan</div></div>';return}
  el.innerHTML=state.plans.map((p,i)=>{
    const exCount=(p.exercises||[]).length;
    return`<div class="plan-card">
      <div class="plan-header">
        <div class="plan-color" style="background:rgba(255,55,95,.15);">${p.emoji||'💪'}</div>
        <div class="plan-info"><div class="plan-name">${p.name}</div><div class="plan-days-count">${exCount} ćwiczeń</div></div>
      </div>
      <div class="plan-actions">
        <button class="plan-action-btn" onclick="editPlan(${i})">✏️ Edytuj</button>
        <button class="plan-action-btn" onclick="copyPlan(${i})">📋 Kopiuj</button>
        <button class="plan-action-btn" onclick="showPlanAnalysis('${p.id}')">📊 Analizuj</button>
        <button class="plan-action-btn" onclick="deletePlan(${i})">🗑 Usuń</button>
      </div>
    </div>`;
  }).join('');
}

function openNewPlanSheet(){state.editingPlan={id:uid(),name:'',emoji:'💪',exercises:[]};document.getElementById('plan-name-input').value='';document.getElementById('plan-emoji-input').value='💪';document.getElementById('plan-sheet-title').textContent='Nowy plan';renderPlanExercises();openSheet('plan-sheet')}

function editPlan(i){state.editingPlan=JSON.parse(JSON.stringify(state.plans[i]));state.currentPlanIdx=i;document.getElementById('plan-name-input').value=state.editingPlan.name;document.getElementById('plan-emoji-input').value=state.editingPlan.emoji||'💪';document.getElementById('plan-sheet-title').textContent='Edytuj plan';renderPlanExercises();openSheet('plan-sheet')}

function savePlan(){
  const name=document.getElementById('plan-name-input').value.trim();
  if(!name){showNotif('⚠️','Błąd','Podaj nazwę planu');return}
  state.editingPlan.name=name;state.editingPlan.emoji=document.getElementById('plan-emoji-input').value||'💪';
  if(state.currentPlanIdx!=null){state.plans[state.currentPlanIdx]=state.editingPlan;state.currentPlanIdx=null}
  else state.plans.push(state.editingPlan);
  dbPut('plans',{id:'all',data:state.plans});closeAllSheets();renderPlans();showNotif('✅','Plan zapisany',state.editingPlan.name);
}

function deletePlan(i){if(!confirm(`Usunąć "${state.plans[i].name}"?`))return;state.plans.splice(i,1);dbPut('plans',{id:'all',data:state.plans});renderPlans()}

function copyPlan(i){const c=JSON.parse(JSON.stringify(state.plans[i]));c.id=uid();c.name+=' (kopia)';state.plans.push(c);dbPut('plans',{id:'all',data:state.plans});renderPlans();showNotif('📋','Plan skopiowany','')}

function renderPlanExercises(){
  const el=document.getElementById('plan-days-list');
  if(!(state.editingPlan.exercises||[]).length){el.innerHTML='<div style="color:var(--text4);font-size:14px;text-align:center;padding:16px;">Brak ćwiczeń w planie. Dodaj pierwsze!</div><button class="btn btn-secondary" style="width:100%;margin:0 16px;" onclick="openExercisePickerFromPlan()">+ Dodaj ćwiczenie</button>';return}
  el.innerHTML=(state.editingPlan.exercises||[]).map((ex,i)=>{
    const def=getAllExercises().find(e=>e.id===ex.id);
    return`<div style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="flex:1;"><div style="font-weight:600;">${def?.name||ex.name}</div><div style="font-size:12px;color:var(--text3);">${ex.sets||3}×${ex.reps||'8-12'}</div></div>
        <button class="btn" style="background:rgba(255,69,58,.12);color:var(--red);padding:4px 10px;font-size:18px;border-radius:8px;" onclick="removePlanExercise(${i})">−</button>
      </div>
      <div style="display:flex;gap:8px;font-size:12px;">
        <input type="number" min="1" max="10" value="${ex.sets||3}" placeholder="Serie" style="width:60px;padding:6px;border-radius:8px;border:none;background:var(--surface3);color:var(--text);font-family:var(--font);" onchange="updatePlanExercise(${i},'sets',this.value)">
        <input type="text" value="${ex.reps||'8-12'}" placeholder="Powt." style="flex:1;padding:6px;border-radius:8px;border:none;background:var(--surface3);color:var(--text);font-family:var(--font);" onchange="updatePlanExercise(${i},'reps',this.value)">
      </div>
    </div>`;
  }).join('')+`<button class="btn btn-secondary" style="width:100%;margin-top:8px;" onclick="openExercisePickerFromPlan()">+ Dodaj ćwiczenie</button>`;
}

function removePlanExercise(i){(state.editingPlan.exercises||[]).splice(i,1);renderPlanExercises()}

function updatePlanExercise(i,field,val){if(state.editingPlan.exercises&&state.editingPlan.exercises[i]){state.editingPlan.exercises[i][field]=(field==='sets'?parseInt(val):val)||state.editingPlan.exercises[i][field];renderPlanExercises()}}

function openExercisePickerFromPlan(){state.exercisePickerFrom='plan';resetExFilter();openSheet('exercise-picker-sheet')}

function addExerciseToDay(){
  if(!state.selectedExercise)return;
  const sets=parseInt(document.getElementById('ex-sets-input').value)||3;
  const reps=document.getElementById('ex-reps-input').value||'8-12';
  const rest=document.getElementById('ex-rest-input').value;
  const note=document.getElementById('ex-note-input').value;
  if(state.exercisePickerFrom==='workout'){
    const prevBest=getPrevBest(state.selectedExercise.id);
    workoutState.exercises.push({
      id:state.selectedExercise.id,
      name:state.selectedExercise.name,
      sets:Array.from({length:sets},(_,si)=>({
        num:si+1,weight:'',reps:'',done:false,type:'working',
        prevWeight:prevBest?.weight||'',prevReps:prevBest?.reps||''
      })),
      reps,restTime:rest,note
    });
    // Close only the sheets, leave training-view untouched
    document.getElementById('ex-detail-sheet').classList.remove('open');
    document.getElementById('exercise-picker-sheet').classList.remove('open');
    document.getElementById('sheet-overlay').classList.remove('open');
    renderTrainingView();
    showNotif('✅','Dodano do treningu',state.selectedExercise.name);
  } else if(state.exercisePickerFrom==='plan'){
    if(!state.editingPlan)return;
    state.editingPlan.exercises=(state.editingPlan.exercises||[]);
    state.editingPlan.exercises.push({
      id:state.selectedExercise.id,name:state.selectedExercise.name,sets,reps,restTime:rest,note
    });
    closeSheet('ex-detail-sheet');
    renderPlanExercises();
    showNotif('✅','Dodano',state.selectedExercise.name);
  }
}

function generatePlan(type){
  const templates={
    fbw:{name:'FBW — Full Body Workout',emoji:'🔄',exercises:['e1','e7','e11','e17','e20','e22','e24']},
    ppl:{name:'Push Pull Legs',emoji:'💪',exercises:['e1','e17','e18','e22','e7','e8','e20','e11','e16','e15']},
    ul:{name:'Upper / Lower Split',emoji:'⬆️',exercises:['e1','e7','e17','e20','e22','e11','e16','e14','e15']},
    split3:{name:'Split 3-dniowy',emoji:'📋',exercises:['e1','e2','e3','e7','e8','e9','e17','e18','e11','e12','e22','e20']},
  };
  const tpl=templates[type];
  if(!tpl)return;
  const plan={
    id:uid(),name:tpl.name,emoji:tpl.emoji,
    exercises:tpl.exercises.map(id=>{
      const ex=EXERCISES.find(e=>e.id===id);
      return{id:ex.id,name:ex.name,sets:3,reps:'8-12',restTime:'default'};
    })
  };
  state.editingPlan=plan;
  state.currentPlanIdx=null;
  document.getElementById('plan-name-input').value=plan.name;
  document.getElementById('plan-emoji-input').value=plan.emoji;
  document.getElementById('plan-sheet-title').textContent='Nowy plan (szablon)';
  renderPlanExercises();
  openSheet('plan-sheet');
  showNotif('📋','Szablon załadowany','Możesz teraz edytować plan');
}

