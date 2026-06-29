// ===================== WORKOUT.JS =====================

// ── Zmienne globalne ──
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth();
let notifTimer;
let workoutState = {planName:'',dayName:'',startTime:null,stopwatchInterval:null,exercises:[],totalSets:0,totalReps:0,totalTonnage:0,totalRestTime:0,activeRestCount:0};
let timerState = {remaining:0,total:0,interval:null,paused:false,reminderTimeout:null};
let exFilter = {group:'all',sub:'all',cat:'all',search:''};


function beginWorkout(planId,dayIdx,day,planName){
  const prev=state.workouts.length?state.workouts[state.workouts.length-1]:null;
  workoutState={
    planId,dayIdx,planName,dayName:day.name,startTime:Date.now(),stopwatchInterval:null,
    exercises:day.exercises.map(ex=>{
      const prevEx=prev?.exercises?.find(e=>e.id===ex.id);
      const prevBest=getPrevBest(ex.id);
      return{
        ...ex,
        sets:Array.from({length:ex.sets||3},(_,si)=>{
          const prevSet=prevEx?.sets?.[si];
          return{num:si+1,weight:prevSet?.weight||'',reps:prevSet?.reps||'',done:false,type:'working',prevWeight:prevBest?.weight||'',prevReps:prevBest?.reps||''};
        })
      };
    }),
    totalSets:0,totalReps:0,totalTonnage:0,totalRestTime:0,activeRestCount:0,
  };
  var twPlan = document.getElementById('tw-plan-name');
  var twExTotal = document.getElementById('tw-ex-total');
  if(twPlan) twPlan.textContent = day.name;
  if(twExTotal) twExTotal.textContent = workoutState.exercises.length;
  renderTrainingView();
  document.getElementById('training-view').classList.add('open');
  workoutState.stopwatchInterval=setInterval(updateStopwatch,1000);
  updateStopwatch();
}

function endWorkout(){
  stopTimer();clearInterval(workoutState.stopwatchInterval);
  var _tv=document.getElementById('training-view');
  _tv.classList.remove('open');
  _tv.style.display='';
  document.getElementById('timer-overlay').classList.remove('open');
  var mb=document.getElementById('workout-mini-bar');
  if(mb) mb.style.display='none';
  const duration=Math.floor((Date.now()-workoutState.startTime)/1000);
  const avgRest=workoutState.activeRestCount>0?Math.round(workoutState.totalRestTime/workoutState.activeRestCount):0;
  recomputeLiveTotals();
  window._wData={duration,activeTime:duration-workoutState.totalRestTime,restTime:workoutState.totalRestTime,avgRest};
  document.getElementById('summary-stats').innerHTML=[
    ['⏱ Czas treningu',formatTime(duration)],['💪 Czas aktywny',formatTime(Math.max(0,duration-workoutState.totalRestTime))],
    ['😮‍💨 Łączny czas przerw',formatTime(workoutState.totalRestTime)],['⏱ Średnia przerwa',avgRest+'s'],
    ['📊 Serie',workoutState.totalSets],['🔄 Powtórzenia',workoutState.totalReps],['⚖️ Tonaż',workoutState.totalTonnage.toFixed(1)+'kg'],
  ].map(([k,v])=>`<div class="summary-stat"><span class="summary-key">${k}</span><span class="summary-val">${v}</span></div>`).join('');
  window._workoutRating=0;
  document.getElementById('rating-stars').innerHTML=[1,2,3,4,5,6,7,8,9,10].map(n=>`<span class="star" onclick="setRating(${n})" id="star-${n}">⭐</span>`).join('');
  document.getElementById('workout-note').value='';
  openSheet('summary-sheet');
}

function confirmEndWorkout(){if(!confirm('Zakończyć trening?'))return;endWorkout()}

async function finalizeWorkout(){
  // Recompute final totals from ground truth
  let finalSets=0,finalReps=0,finalTonnage=0;
  workoutState.exercises.forEach(ex=>{
    ex.sets.forEach(s=>{
      if(s.done){finalSets++;finalReps+=parseInt(s.reps)||0;finalTonnage+=(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);}
    });
  });
  const workout={id:uid(),date:new Date().toISOString(),planName:workoutState.planName,dayName:workoutState.dayName,
    exercises:workoutState.exercises.map(ex=>({id:ex.id,name:ex.name,sets:ex.sets,completedSets:ex.sets.filter(s=>s.done).length})),
    duration:window._wData?.duration||0,activeTime:window._wData?.activeTime||0,restTime:window._wData?.restTime||0,
    avgRest:window._wData?.avgRest||0,tonnage:finalTonnage,totalSets:finalSets,
    totalReps:finalReps,rating:window._workoutRating||0,note:document.getElementById('workout-note').value};
  state.workouts.push(workout);
  await dbPut('workouts',{id:'all',data:state.workouts});
  updateProgressAfterWorkout(workout);
  closeAllSheets();showNotif('🎉','Trening zapisany!',`${formatTime(workout.duration)} · ${workout.tonnage.toFixed(0)}kg`);
  refreshDashboard();renderDashMuscleMap();showTab('dashboard');
}

function renderTrainingView(){
  var exTotalEl=document.getElementById('tw-ex-total');
  if(exTotalEl) exTotalEl.textContent=workoutState.exercises.length;
  var body=document.getElementById('training-body');
  if(!body) return;
  var SET_TYPES=[{v:'working',l:'Robocza'},{v:'warmup',l:'Rozgrzewkowa'},{v:'dropset',l:'Dropset'},{v:'restpause',l:'Rest-Pause'},{v:'failure',l:'Do upadku'}];
  var html='';
  workoutState.exercises.forEach(function(ex,ei){
    var completedSets=ex.sets.filter(function(s){return s.done;}).length;
    var completedTonnage=ex.sets.filter(function(s){return s.done;}).reduce(function(a,s){return a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);},0);
    var currentTonnage=ex.sets.reduce(function(a,s){return a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);},0);
    var prevBest=getPrevBest(ex.id);
    var suggestion=prevBest&&parseFloat(prevBest.weight)>0?'💡 Poprzednio: '+prevBest.weight+'kg×'+prevBest.reps+' — spróbuj '+(parseFloat(prevBest.weight)+2.5).toFixed(1)+'kg':'';
    var allDone=completedSets===ex.sets.length&&ex.sets.length>0;
    html+='<div class="exercise-card" id="ex-card-'+ei+'">';
    html+='<div class="exercise-header">';
    html+='<div class="exercise-icon-circle">💪</div>';
    html+='<div style="flex:1;"><div class="exercise-name">'+ex.name+'</div>';
    html+='<div class="exercise-meta">'+(ex.reps||'—')+' powt. · '+(ex.restTime==='default'?'domyślna':ex.restTime+'s')+'</div></div>';
    if(allDone) html+='<span style="font-size:22px;margin-left:4px;">✅</span>';
    html+='</div>';
    if(suggestion) html+='<div style="padding:0 16px 8px;font-size:12px;color:var(--accent)">'+suggestion+'</div>';
    if(ex.note) html+='<div style="padding:0 16px 8px;font-size:12px;color:var(--text3);">📝 '+ex.note+'</div>';
    html+='<table class="sets-table">';
    html+='<thead><tr><th style="width:28px;">S</th><th>Poprz.</th><th>kg</th><th>Powt.</th><th style="width:52px;">Typ</th><th style="width:44px;text-align:center;">Stan</th><th style="width:28px;"></th></tr></thead>';
    html+='<tbody>';
    ex.sets.forEach(function(set,si){
      var rowBg=set.done?'background:rgba(48,209,88,.07);':'';
      html+='<tr id="set-row-'+ei+'-'+si+'" style="'+rowBg+'">';
      html+='<td class="set-num">'+(si+1)+'</td>';
      html+='<td class="set-prev">'+(set.prevWeight?set.prevWeight+'×'+set.prevReps:'—')+'</td>';
      html+='<td><input class="set-input" type="number" inputmode="decimal" value="'+set.weight+'" placeholder="0" id="w-'+ei+'-'+si+'" oninput="liveUpdateSet('+ei+','+si+',\'weight\',this.value)"'+(set.done?' disabled':'')+'></td>';
      html+='<td><input class="set-input" type="number" inputmode="numeric" value="'+set.reps+'" placeholder="'+((ex.reps||'8').split('-')[0])+'" id="r-'+ei+'-'+si+'" oninput="liveUpdateSet('+ei+','+si+',\'reps\',this.value)"'+(set.done?' disabled':'')+'></td>';
      var optHtml='';
      SET_TYPES.forEach(function(t){optHtml+='<option value="'+t.v+'"'+(set.type===t.v?' selected':'')+'>'+t.l+'</option>';});
      html+='<td><select class="set-type-select" onchange="updateSetValue('+ei+','+si+',\'type\',this.value)"'+(set.done?' disabled':'')+'>'+optHtml+'</select></td>';
      html+='<td style="text-align:center;"><button onclick="completeSet('+ei+','+si+')" style="background:none;border:none;font-size:22px;cursor:pointer;line-height:1;padding:0 4px;" id="btn-'+ei+'-'+si+'">'+(set.done?'✅':'❌')+'</button></td>';
      html+='<td><button class="set-del-btn" onclick="deleteSet('+ei+','+si+')" title="Usuń serię">✕</button></td>';
      html+='</tr>';
    });
    html+='</tbody></table>';
    html+='<button class="add-set-btn" onclick="addSetToExercise('+ei+')">+ Dodaj serię</button>';
    var ti='';
    if(currentTonnage>0) ti+='Tonaż: <strong style="color:var(--accent)">'+currentTonnage.toFixed(0)+'kg</strong>';
    if(completedSets>0) ti+=' · '+completedSets+'/'+ex.sets.length+' serii ✅';
    html+='<div style="padding:8px 16px;font-size:12px;color:var(--text3);border-top:.5px solid var(--border2);">'+ti+'</div>';
    html+='</div>';
  });
  html+='<div style="padding:8px 16px 16px;"><button class="btn btn-secondary" style="width:100%;" onclick="openExercisePickerForWorkout()">+ Dodaj ćwiczenie</button></div>';
  body.innerHTML=html;
}

function completeSet(ei,si){
  var ex=workoutState.exercises[ei];
  var set=ex.sets[si];
  var wInput=document.getElementById('w-'+ei+'-'+si);
  var rInput=document.getElementById('r-'+ei+'-'+si);
  var weight=parseFloat(wInput?wInput.value:0)||0;
  var reps=parseInt(rInput?rInput.value:0)||0;

  var plannedReps=parseInt((ex.reps||'').split('-')[0])||0;
  var fallbackWeight=parseFloat(set.weight)||0;
  var fallbackReps=parseInt(set.reps)||plannedReps||0;

  if(!weight&&fallbackWeight) weight=fallbackWeight;
  if(!reps&&fallbackReps) reps=fallbackReps;

  if(!set.done){
    set.weight=weight;
    set.reps=reps;
    set.done=true;
    recomputeLiveTotals();
    renderTrainingView();
    checkPR(ex,weight,reps);
    var exDef=getAllExercises().find(function(e){return e.id===ex.id;});
    var restTime=ex.restTime==='default'
      ?getDefaultRest(exDef?exDef.category:null)
      :parseInt(ex.restTime)||90;
    startRestTimer(restTime,ex.name+' — seria '+(si+1));
  } else {
    set.done=false;
    recomputeLiveTotals();
    renderTrainingView();
  }
}

function deleteSet(ei,si){
  var wEl=document.getElementById('w-'+ei+'-'+si);
  var rEl=document.getElementById('r-'+ei+'-'+si);
  if(wEl) workoutState.exercises[ei].sets[si].weight=wEl.value;
  if(rEl) workoutState.exercises[ei].sets[si].reps=rEl.value;
  workoutState.exercises[ei].sets.splice(si,1);
  workoutState.exercises[ei].sets.forEach(function(s,i){s.num=i+1;});
  recomputeLiveTotals();
  renderTrainingView();
}

function addSetToExercise(ei){
  var ex=workoutState.exercises[ei];
  var prev=ex.sets.length>0?ex.sets[ex.sets.length-1]:null;
  ex.sets.push({
    num:ex.sets.length+1,
    weight:prev?prev.weight:'',
    reps:prev?prev.reps:'',
    done:false,
    type:'working',
    prevWeight:prev?prev.prevWeight:'',
    prevReps:prev?prev.prevReps:''
  });
  renderTrainingView();
}

function liveUpdateSet(ei,si,field,val){
  workoutState.exercises[ei].sets[si][field]=val;
  recomputeLiveTotals();
}

function updateSetValue(ei,si,field,val){workoutState.exercises[ei].sets[si][field]=val}

function recomputeLiveTotals(){
  var sets=0,reps=0,tonnage=0;
  workoutState.exercises.forEach(function(ex){
    ex.sets.forEach(function(s){
      if(s.done){
        sets++;
        reps+=parseInt(s.reps)||0;
        tonnage+=(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);
      }
    });
  });
  workoutState.totalSets=sets;
  workoutState.totalReps=reps;
  workoutState.totalTonnage=tonnage;
  var twSets=document.getElementById('tw-sets');
  var twReps=document.getElementById('tw-reps');
  var twTon=document.getElementById('tw-tonnage');
  var twEx=document.getElementById('tw-exercises');
  if(twSets) twSets.textContent=sets;
  if(twReps) twReps.textContent=reps;
  if(twTon)  twTon.textContent=tonnage.toFixed(0)+'kg';
  var exDone=workoutState.exercises.filter(function(e){return e.sets.length>0&&e.sets.every(function(s){return s.done;});}).length;
  if(twEx) twEx.textContent=exDone+'/'+workoutState.exercises.length;
}

function updateStopwatch(){
  var elapsed=Math.floor((Date.now()-workoutState.startTime)/1000);
  var swEl=document.getElementById('sw-time');
  if(swEl) swEl.textContent=formatTime(elapsed);

  var done=workoutState.exercises.reduce(function(a,e){return a+e.sets.filter(function(s){return s.done;}).length;},0);
  var total=workoutState.exercises.reduce(function(a,e){return a+e.sets.length;},0);
  var pct=total>0?done/total:0;

  var etaFill=document.getElementById('eta-fill');
  if(etaFill) etaFill.style.width=(pct*100)+'%';
  var twPct=document.getElementById('tw-progress-pct');
  if(twPct) twPct.textContent=Math.round(pct*100)+'%';

  if(done>0&&elapsed>0&&pct>0&&pct<1){
    var eta=Math.round(elapsed/pct*(1-pct));
    var etaEl=document.getElementById('tw-eta');
    if(etaEl) etaEl.textContent=new Date(Date.now()+eta*1000).toLocaleTimeString('pl',{hour:'2-digit',minute:'2-digit'});
  }

  // Update mini bar
  var miniTime=document.getElementById('mini-time');
  if(miniTime) miniTime.textContent=formatTime(elapsed);
  var miniStats=document.getElementById('mini-stats');
  if(miniStats) miniStats.textContent=workoutState.totalSets+' serii · '+workoutState.totalTonnage.toFixed(0)+'kg';
}

function checkPR(ex,weight,reps){
  if(!weight||!reps)return;
  var found=false;
  state.workouts.forEach(function(w){
    if(found)return;
    (w.exercises||[]).forEach(function(we){
      if(we.id!==ex.id)return;
      (we.sets||[]).forEach(function(s){
        if(s.done&&parseFloat(s.weight)>=weight&&parseInt(s.reps)>=reps) found=true;
      });
    });
  });
  if(found) return;
  var hasHistory=state.workouts.some(function(w){return (w.exercises||[]).some(function(e){return e.id===ex.id;});});
  if(hasHistory) showPRCelebration(ex.name,weight,reps);
}

function showPRCelebration(name,weight,reps){
  document.getElementById('pr-title').textContent='🏆 Nowy rekord!';
  document.getElementById('pr-sub').textContent=name+': '+weight+'kg × '+reps;
  var cel=document.getElementById('pr-celebration');
  cel.classList.add('open');cel.style.pointerEvents='all';
  setTimeout(function(){cel.classList.remove('open');cel.style.pointerEvents='none';},2500);
}

function startRestTimer(seconds,setInfo){
  stopTimer();
  timerState={remaining:seconds,total:seconds,paused:false,interval:null,reminderTimeout:null};
  document.getElementById('timer-overlay').classList.add('open');
  document.getElementById('timer-set-info').textContent=setInfo;
  document.getElementById('timer-msg').style.display='none';
  document.getElementById('timer-pause-btn').textContent='⏸ Pauza';
  updateTimerDisplay();
  updateTimerRing();
  timerState.interval=setInterval(tickTimer,1000);
}

function tickTimer(){
  if(timerState.paused)return;
  timerState.remaining--;
  if(timerState.remaining<=0){
    timerState.remaining=0;
    updateTimerDisplay();
    updateTimerRing();
    clearInterval(timerState.interval);
    timerFinished();
    return;
  }
  updateTimerDisplay();
  updateTimerRing();
}

function updateTimerDisplay(){
  var el=document.getElementById('timer-display');
  if(!el)return;
  var s=timerState.remaining;
  var mins=Math.floor(s/60);
  var secs=s%60;
  var secsStr=secs<10?'0'+secs:String(secs);
  el.textContent=(s>=60?mins+':'+secsStr:'0:'+secsStr);
  el.className='timer-big';
  if(s<=10&&s>0) el.classList.add('urgent');
  if(s<=0) el.classList.add('done-color');
}

function updateTimerRing(){
  var c=document.getElementById('timer-ring-circle');
  if(!c)return;
  var pct=timerState.total>0?timerState.remaining/timerState.total:0;
  c.style.strokeDashoffset=628*(1-pct);
  c.style.stroke=timerState.remaining<=10?'var(--orange)':'var(--accent)';
}

function timerFinished(){
  var msg=document.getElementById('timer-msg');
  msg.style.display='block';
  msg.textContent='💪 Czas na następną serię!';
  if(state.settings.vibration&&navigator.vibrate) navigator.vibrate([200,100,200,100,400]);
  if(state.settings.sound) playBeep();
  workoutState.totalRestTime+=timerState.total;
  workoutState.activeRestCount++;
  timerState.reminderTimeout=setTimeout(function(){
    var rb=document.getElementById('reminder-banner');
    if(rb) rb.classList.add('show');
  },60000);
}

function playBeep(){
  try{
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    [0,200,400].forEach(function(d){
      var o=ctx.createOscillator();
      var g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=d===400?880:660;
      o.type='sine';
      g.gain.setValueAtTime(0.3,ctx.currentTime+d/1000);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d/1000+0.3);
      o.start(ctx.currentTime+d/1000);
      o.stop(ctx.currentTime+d/1000+0.4);
    });
  }catch(e){}
}

function toggleTimerPause(){
  timerState.paused=!timerState.paused;
  document.getElementById('timer-pause-btn').textContent=timerState.paused?'▶ Wznów':'⏸ Pauza';
}

function skipTimer(){
  stopTimer();
  document.getElementById('timer-overlay').classList.remove('open');
  document.getElementById('timer-msg').style.display='none';
}

function stopTimer(){
  clearInterval(timerState.interval);
  clearTimeout(timerState.reminderTimeout);
  timerState.interval=null;
}

function adjustTimer(d){
  timerState.remaining=Math.max(5,timerState.remaining+d);
  timerState.total=Math.max(timerState.total,timerState.remaining);
  updateTimerDisplay();
  updateTimerRing();
}

function closeReminder(){
  var rb=document.getElementById('reminder-banner');
  if(rb) rb.classList.remove('show');
}

function minimizeWorkout(){
  var _tv2=document.getElementById('training-view');
  _tv2.classList.remove('open');
  _tv2.style.display='';
  var bar=document.getElementById('workout-mini-bar');
  bar.style.display='flex';
  var mn=document.getElementById('mini-plan-name');
  if(mn) mn.textContent=workoutState.planName||'Trening';
}

function maximizeWorkout(){
  document.getElementById('workout-mini-bar').style.display='none';
  var _tv3=document.getElementById('training-view');
  _tv3.style.display='';
  _tv3.classList.add('open');
}

function repeatLastWorkout(){
  if(!state.workouts.length){showNotif('⚠️','Brak historii','Wykonaj najpierw jeden trening');return}
  const last=state.workouts[state.workouts.length-1];
  // Find matching plan
  for(let pi=0;pi<state.plans.length;pi++){
    const plan=state.plans[pi];
    if(plan.name===last.planName){
      startWorkout(pi);return;
    }
  }
  // Fallback: build from history
  const fakeDay={name:last.dayName||'Poprzedni trening',exercises:last.exercises?.map(ex=>({id:ex.id,name:ex.name,sets:(ex.sets||[]).length||3,reps:'8-12',restTime:'default'}))||[],restTime:90};
  beginWorkout(null,null,fakeDay,last.planName||'Poprzedni trening');
}

function startWorkoutPrompt(){
  if(!state.plans.length){showNotif('⚠️','Brak planów','Stwórz plan najpierw');showTab('plans');return}
  const body=document.getElementById('start-workout-body');
  body.innerHTML=state.plans.map((plan,pi)=>`
    <div style="margin-bottom:16px;">
      <div style="font-size:13px;color:var(--text3);font-weight:700;text-transform:uppercase;margin-bottom:8px;">${plan.emoji||'💪'} ${plan.name}</div>
      <div class="list-item" style="border-radius:12px;cursor:pointer;" onclick="startWorkout(${pi})">
        <div class="list-text"><div class="list-title">Rozpocznij trening</div><div class="list-sub">${(plan.exercises||[]).length} ćwiczeń</div></div>
        <div style="color:var(--accent);font-size:20px;">▶</div>
      </div>
    </div>`).join('')+`<button class="btn btn-secondary" style="width:100%;margin-top:8px;" onclick="startFreeWorkout()">🆓 Trening własny</button>`;
  openSheet('start-workout-sheet');
}

function startFreeWorkout(){
  closeAllSheets();
  beginWorkout(null,null,{name:'Trening własny',exercises:[],restTime:90},'Trening własny');
}

function startWorkout(pi){
  closeAllSheets();
  const plan=state.plans[pi];
  const dayObj={name:plan.name,exercises:plan.exercises||[],restTime:90};
  beginWorkout(plan.id,null,dayObj,plan.name);
}

function switchWorkoutTab(t,el){
  document.getElementById('workout-tab-history').style.display=t==='history'?'block':'none';
  document.getElementById('workout-tab-calendar').style.display=t==='calendar'?'block':'none';
  document.querySelectorAll('#view-workout .segment-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  if(t==='calendar')renderCalendar();
}

function openExercisePickerForWorkout(){
  state.exercisePickerFrom='workout';
  resetExFilter();
  openSheet('exercise-picker-sheet');
}

function renderHistory(){
  const el=document.getElementById('history-list');
  if(!state.workouts.length){el.innerHTML='<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Brak treningów</div><div class="empty-sub">Zacznij swój pierwszy trening!</div></div>';return}
  const months=['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  el.innerHTML=[...state.workouts].reverse().map(function(w){
    const d=new Date(w.date);
    var ratingHtml=w.rating?'<div style="font-size:14px;font-weight:700;color:var(--yellow)">'+w.rating+'/10</div>':'';
    return '<div class="history-item" style="display:flex;align-items:center;gap:8px;">'
      +'<div style="display:flex;align-items:center;flex:1;cursor:pointer;min-width:0;" onclick="showWorkoutDetail(\''+w.id+'\')">'
      +'<div class="history-date-badge"><div class="history-date-day">'+d.getDate()+'</div><div class="history-date-month">'+months[d.getMonth()]+'</div></div>'
      +'<div style="flex:1;min-width:0;"><div style="font-weight:700;">'+(w.planName||'Trening')+'</div><div style="font-size:12px;color:var(--text3);">'+(w.dayName||'')+'</div><div style="font-size:12px;color:var(--text3);margin-top:2px;">'+(w.exercises?.length||0)+' ćwiczeń · '+formatTime(w.duration||0)+' · '+(w.tonnage||0).toFixed(0)+'kg</div></div>'
      +'<div style="text-align:right;margin-right:6px;">'+ratingHtml+'<div style="color:var(--text4);font-size:18px;">›</div></div>'
      +'</div>'
      +'<button onclick="event.stopPropagation();deleteWorkout(\''+w.id+'\')" style="flex-shrink:0;background:rgba(255,69,58,.12);border:none;color:var(--red);font-size:14px;padding:7px 10px;border-radius:10px;cursor:pointer;">🗑</button>'
      +'</div>';
  }).join('');
}


async function deleteWorkout(id){
  if(!confirm('Usunąć ten trening?'))return;
  state.workouts=state.workouts.filter(function(w){return w.id!==id;});
  await dbPut('workouts',{id:'all',data:state.workouts});
  renderHistory();
  renderCalendar();
  refreshDashboard();
  showNotif('🗑','Trening usunięty','');
}
function calChangeMonth(d){
  calMonth+=d;
  if(calMonth<0){calMonth=11;calYear--;}
  if(calMonth>11){calMonth=0;calYear++;}
  renderCalendar();
}

function calDayClick(d){
  const workouts=state.workouts.filter(w=>{const wd=new Date(w.date);return wd.getFullYear()===calYear&&wd.getMonth()===calMonth&&wd.getDate()===d});
  const panel=document.getElementById('cal-day-detail');
  if(!workouts.length){panel.style.display='none';return;}
  panel.style.display='block';
  var monthsShort=['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'];
  panel.innerHTML='<div class="card" style="animation:slideUp .2s ease;">'
    +'<div class="card-title">'+d+' '+monthsShort[calMonth]+' '+calYear+'</div>'
    +workouts.map(function(w){
      return '<div style="padding:10px 0;border-bottom:.5px solid var(--border2);">'
        +'<div style="font-weight:700;">'+(w.planName||'Trening')+' — '+(w.dayName||'')+'</div>'
        +'<div style="font-size:13px;color:var(--text3);margin-top:3px;">'+(w.exercises?.length||0)+' ćwiczeń · '+formatTime(w.duration||0)+' · '+(w.tonnage||0).toFixed(0)+'kg</div>'
        +(w.note?'<div style="font-size:12px;color:var(--text3);margin-top:2px;">📝 '+w.note+'</div>':'')
        +'</div>';
    }).join('')
    +'</div>';
}

function renderCalendar(){
  const monthNames=['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
  document.getElementById('cal-month-title').textContent=`${monthNames[calMonth]} ${calYear}`;

  const firstDay=new Date(calYear,calMonth,1).getDay(); // 0=Sun
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const startOffset=(firstDay+6)%7; // Monday-first

  // Build set of workout dates
  const workoutDates={};
  state.workouts.forEach(w=>{
    const d=new Date(w.date);
    if(d.getFullYear()===calYear&&d.getMonth()===calMonth){
      const key=d.getDate();
      if(!workoutDates[key])workoutDates[key]=[];
      workoutDates[key].push(w);
    }
  });

  const today=new Date();
  const grid=document.getElementById('cal-grid');
  let html='';
  // Empty cells
  for(let i=0;i<startOffset;i++) html+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const isToday=d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
    const hasW=workoutDates[d];
    html+=`<div class="cal-day ${hasW?'has-workout':'no-workout'} ${isToday?'today':''}" onclick="calDayClick(${d})">${d}</div>`;
  }
  grid.innerHTML=html;

  // Stats
  const monthWorkouts=Object.keys(workoutDates).length;
  document.getElementById('cal-month-days').textContent=monthWorkouts;
  document.getElementById('cal-month-vol').textContent=state.workouts.filter(w=>{const d=new Date(w.date);return d.getFullYear()===calYear&&d.getMonth()===calMonth}).length;

  // Streak calc
  const {streak,maxStreak}=calcStreak();
  document.getElementById('cal-streak').textContent=streak;
  document.getElementById('cal-max-streak').textContent=maxStreak;
}

function calcStreak(){
  if(!state.workouts.length)return{streak:0,maxStreak:0};
  const days=[...new Set(state.workouts.map(w=>new Date(w.date).toDateString()))].map(d=>new Date(d)).sort((a,b)=>b-a);
  let streak=0,maxStreak=0,cur=1;
  const today=new Date();today.setHours(0,0,0,0);
  // Current streak: allow up to 2 days gap between workouts
  if(days.length){
    const first=new Date(days[0]);first.setHours(0,0,0,0);
    const firstDiff=Math.round((today-first)/86400000);
    if(firstDiff<=2){
      streak=1;
      let prev=first;
      for(let i=1;i<days.length;i++){
        const current=new Date(days[i]);current.setHours(0,0,0,0);
        const gap=Math.round((prev-current)/86400000);
        if(gap<=2){
          streak++;
          prev=current;
        } else break;
      }
    }
  }
  // Max streak in history with same rule
  for(let i=0;i<days.length;i++){
    if(i===0){cur=1;}
    else{
      const diff=Math.round((days[i-1]-days[i])/86400000);
      if(diff<=2)cur++;else cur=1;
    }
    maxStreak=Math.max(maxStreak,cur);
  }
  return{streak,maxStreak};
}

function showWorkoutDetail(id){
  const w=state.workouts.find(x=>x.id===id);if(!w)return;
  const d=new Date(w.date);
  alert([`📅 ${d.toLocaleDateString('pl')} · ${formatTime(w.duration||0)}`,`💪 ${w.exercises?.length||0} ćwiczeń · ${w.totalSets||0} serii`,`⚖️ Tonaż: ${(w.tonnage||0).toFixed(1)}kg`,w.note?`📝 ${w.note}`:''].filter(Boolean).join('\n'));
}

