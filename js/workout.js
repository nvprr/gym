// ===================== WORKOUT.JS =====================

// ── Zmienne globalne ──
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth();
let notifTimer;
let workoutState = {planName:'',dayName:'',startTime:null,stopwatchInterval:null,mode:'standard',exercises:[],totalSets:0,totalReps:0,totalTonnage:0,totalRestTime:0,activeRestCount:0};
let timerState = {remaining:0,total:0,interval:null,paused:false,reminderTimeout:null};
let exFilter = {group:'all',sub:'all',cat:'all',search:''};


function beginWorkout(planId,dayIdx,day,planName,mode){
  const prev=state.workouts.length?state.workouts[state.workouts.length-1]:null;
  workoutState={
    planId,dayIdx,planName,dayName:day.name,startTime:Date.now(),stopwatchInterval:null,
    mode:mode||'standard',
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
  var twModeBadge = document.getElementById('tw-mode-badge');
  if(twPlan) twPlan.textContent = day.name;
  if(twExTotal) twExTotal.textContent = workoutState.exercises.length;
  if(twModeBadge){
    var modeInfo=WORKOUT_MODES[workoutState.mode]||WORKOUT_MODES.standard;
    twModeBadge.textContent = workoutState.mode==='standard' ? '' : (modeInfo.icon+' Tryb: '+modeInfo.label);
  }
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
  var tmb=document.getElementById('timer-mini-bar');
  if(tmb) tmb.style.display='none';
  timerState.minimized=false;
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
    var lastPerf=getLastExercisePerformance(ex.id);
    var record=workoutState.mode==='pr'?getExerciseRecord(ex.id):null;
    var modeSuggestion=getModeSuggestion(workoutState.mode,lastPerf,record);
    var allDone=completedSets===ex.sets.length&&ex.sets.length>0;
    html+='<div class="exercise-card" id="ex-card-'+ei+'">';
    html+='<div class="exercise-header">';
    html+='<div class="exercise-icon-circle">💪</div>';
    html+='<div style="flex:1;"><div class="exercise-name">'+ex.name+'</div>';
    html+='<div class="exercise-meta">'+(ex.reps||'—')+' powt. · '+(ex.restTime==='default'?'domyślna':ex.restTime+'s')+'</div></div>';
    if(allDone) html+='<span style="font-size:22px;margin-left:4px;">✅</span>';
    html+='<button onclick="openExerciseDetail(\''+ex.id+'\')" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:4px 6px;">ℹ️</button>';
    html+='<button onclick="removeExFromWorkout('+ei+')" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer;padding:4px 6px;">🗑</button>';
    html+='</div>';
    if(lastPerf) html+='<div style="padding:0 16px 6px;font-size:12px;color:var(--text3);">📊 Ostatni trening: <strong style="color:var(--text2);">'+lastPerf.weight+'kg × '+lastPerf.reps+'</strong> · '+lastPerf.dateLabel+'</div>';
    if(modeSuggestion) html+='<div style="margin:0 16px 8px;background:var(--surface2);border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><div style="font-size:12px;color:var(--accent);">💡 '+modeSuggestion.text+'</div><button onclick="applyModeSuggestion('+ei+','+modeSuggestion.weight+')" style="flex-shrink:0;background:var(--accent);color:#1c1c1c;border:none;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:700;cursor:pointer;">Użyj sugestii</button></div>';
    if(workoutState.mode==='deload'&&lastPerf) html+='<div style="padding:0 16px 8px;font-size:11px;color:var(--text3);">Deload pomaga zregenerować organizm i przygotować do dalszego progresu.</div>';
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

// Ostatnie wykonanie ćwiczenia — najlepsza (najcięższa) ukończona seria z
// najnowszego treningu, w którym to ćwiczenie wystąpiło, wraz z datą.
// Działa wyłącznie w oparciu o historię — nigdy jej nie modyfikuje.
function getLastExercisePerformance(exId){
  for(var i=state.workouts.length-1;i>=0;i--){
    var w=state.workouts[i];
    var ex=(w.exercises||[]).find(function(e){return e.id===exId;});
    if(ex){
      var best=(ex.sets||[]).filter(function(s){return s.done;}).sort(function(a,b){return (parseFloat(b.weight)||0)-(parseFloat(a.weight)||0);})[0];
      if(best){
        return {
          weight: parseFloat(best.weight)||0,
          reps: best.reps,
          date: w.date,
          dateLabel: new Date(w.date).toLocaleDateString('pl',{day:'numeric',month:'short'})
        };
      }
    }
  }
  return null;
}

// Rekord all-time (najcięższa ukończona seria w całej historii) — używany
// przez tryb "Próba rekordu (PR)". Nigdy niczego nie modyfikuje.
function getExerciseRecord(exId){
  var best=null;
  state.workouts.forEach(function(w){
    var ex=(w.exercises||[]).find(function(e){return e.id===exId;});
    if(!ex) return;
    (ex.sets||[]).forEach(function(s){
      if(!s.done) return;
      var wt=parseFloat(s.weight)||0;
      if(wt>0 && (!best||wt>best.weight)){
        best={weight:wt, reps:s.reps, date:w.date, dateLabel:new Date(w.date).toLocaleDateString('pl',{day:'numeric',month:'short',year:'numeric'})};
      }
    });
  });
  return best;
}

// Sugestia GymFlow zależna od trybu treningu. Zwraca null gdy tryb to
// 'standard' lub gdy brak historii tego ćwiczenia (wtedy nic nie sugerujemy).
function getModeSuggestion(mode, lastPerf, record){
  var roundHalf=function(n){return Math.round(n*2)/2;};
  if(mode==='deload'){
    if(!lastPerf||!lastPerf.weight) return null;
    var w=roundHalf(lastPerf.weight*0.775);
    return { weight:w, text:'Deload: spróbuj ok. '+w+'kg (75-80% ostatniego ciężaru)' };
  }
  if(mode==='pr'){
    if(!record||!record.weight) return null;
    var w=roundHalf(record.weight+2.5);
    return { weight:w, text:'Rekord: '+record.weight+'kg ('+record.dateLabel+') — spróbuj '+w+'kg' };
  }
  if(mode==='light'){
    if(!lastPerf||!lastPerf.weight) return null;
    var w=roundHalf(lastPerf.weight*0.8);
    return { weight:w, text:'Lekki trening: spróbuj '+w+'kg lub wykonaj mniej serii' };
  }
  return null;
}

// Wpisuje proponowany ciężar w pierwszą nieukończoną serię danego ćwiczenia.
// Użytkownik zawsze może to później zmienić ręcznie.
function applyModeSuggestion(ei, weightVal){
  var ex=workoutState.exercises[ei];
  if(!ex||!ex.sets.length) return;
  var targetIdx=ex.sets.findIndex(function(s){return !s.done;});
  if(targetIdx===-1) targetIdx=0;
  var input=document.getElementById('w-'+ei+'-'+targetIdx);
  if(input) input.value=weightVal;
  liveUpdateSet(ei,targetIdx,'weight',weightVal);
  showNotif('💡','Sugestia zastosowana',weightVal+'kg → seria '+(targetIdx+1));
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

function calcE1RM(weight, reps) {
  // Epley formula: weight * (1 + reps/30)
  return parseFloat(weight) * (1 + parseInt(reps) / 30);
}

function checkPR(ex, weight, reps) {
  if (!weight || !reps) return;
  var newE1RM = calcE1RM(weight, reps);

  // Find best historical e1RM for this exercise
  var bestE1RM = 0;
  var hasHistory = false;
  state.workouts.forEach(function(w) {
    (w.exercises || []).forEach(function(we) {
      if (we.id !== ex.id) return;
      hasHistory = true;
      (we.sets || []).forEach(function(s) {
        if (s.done && s.weight && s.reps) {
          var e1rm = calcE1RM(s.weight, s.reps);
          if (e1rm > bestE1RM) bestE1RM = e1rm;
        }
      });
    });
  });

  if (!hasHistory) return;
  if (newE1RM > bestE1RM) {
    showPRCelebration(ex.name, weight, reps);
  }
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
  timerState={remaining:seconds,total:seconds,paused:false,interval:null,reminderTimeout:null,startedAt:Date.now(),minimized:false};
  document.getElementById('timer-overlay').classList.add('open');
  document.getElementById('timer-set-info').textContent=setInfo;
  document.getElementById('timer-msg').style.display='none';
  document.getElementById('timer-pause-btn').textContent='⏸ Pauza';
  updateTimerDisplay();
  updateTimerRing();
  timerState.interval=setInterval(tickTimer,1000);
  // Zaplanuj powiadomienie push gdy timer skończy
  requestNotificationPermission(function(granted) {
    if (granted) scheduleTimerNotification(seconds);
  });
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
  var s=timerState.remaining;
  var mins=Math.floor(s/60);
  var secs=s%60;
  var secsStr=secs<10?'0'+secs:String(secs);
  var txt=(s>=60?mins+':'+secsStr:'0:'+secsStr);
  var el=document.getElementById('timer-display');
  if(el){el.textContent=txt;el.className='timer-big';if(s<=10&&s>0)el.classList.add('urgent');if(s<=0)el.classList.add('done-color');}
  var mini=document.getElementById('timer-mini-display');
  if(mini) mini.textContent=txt;
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

function minimizeTimer(){
  document.getElementById('timer-overlay').classList.remove('open');
  timerState.minimized=true;
  var mb=document.getElementById('timer-mini-bar');
  if(mb) mb.style.display='flex';
  updateTimerDisplay();
}

function maximizeTimer(){
  var mb=document.getElementById('timer-mini-bar');
  if(mb) mb.style.display='none';
  timerState.minimized=false;
  document.getElementById('timer-overlay').classList.add('open');
  updateTimerDisplay();
  updateTimerRing();
}

function skipTimer(){
  stopTimer();
  cancelTimerNotification();
  document.getElementById('timer-overlay').classList.remove('open');
  var mb=document.getElementById('timer-mini-bar');
  if(mb) mb.style.display='none';
  timerState.minimized=false;
  document.getElementById('timer-msg').style.display='none';
}

function stopTimer(){
  clearInterval(timerState.interval);
  clearTimeout(timerState.reminderTimeout);
  timerState.interval=null;
}

// Liczenie w tle — korekta po powrocie
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='visible'&&timerState.interval&&!timerState.paused&&timerState.startedAt){
    var elapsed=Math.floor((Date.now()-timerState.startedAt)/1000);
    var newRemaining=timerState.total-elapsed;
    if(newRemaining<=0){
      timerState.remaining=0;
      updateTimerDisplay();
      updateTimerRing();
      clearInterval(timerState.interval);
      timerState.interval=null;
      timerFinished();
      if(timerState.minimized) maximizeTimer();
    } else {
      timerState.remaining=newRemaining;
      updateTimerDisplay();
      updateTimerRing();
    }
  }
});

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

// ── Tryb treningu (Standardowy / Deload / PR / Lekki) ──
// Tryb wpływa wyłącznie na sugestie wyświetlane przy ćwiczeniach — nigdy nie
// nadpisuje historii, planów ani domyślnie wypełnionych pól ciężaru/powtórzeń.
var _pendingWorkoutStart = null;
var WORKOUT_MODES = {
  standard: { icon:'💪', label:'Standardowy' },
  deload:   { icon:'😌', label:'Deload' },
  pr:       { icon:'🔥', label:'Próba rekordu (PR)' },
  light:    { icon:'⚡', label:'Lekki / regeneracyjny' },
};

function startWorkout(pi){
  closeAllSheets();
  _pendingWorkoutStart={type:'plan',pi:pi};
  openSheet('workout-mode-sheet');
}

function startFreeWorkout(){
  closeAllSheets();
  _pendingWorkoutStart={type:'free'};
  openSheet('workout-mode-sheet');
}

function cancelWorkoutModeSheet(){
  _pendingWorkoutStart=null;
  closeAllSheets();
}

function chooseWorkoutMode(mode){
  var pending=_pendingWorkoutStart;
  _pendingWorkoutStart=null;
  closeAllSheets();
  if(!pending) return;
  if(pending.type==='plan'){
    var plan=state.plans[pending.pi];
    var dayObj={name:plan.name,exercises:plan.exercises||[],restTime:90};
    beginWorkout(plan.id,null,dayObj,plan.name,mode);
  } else {
    beginWorkout(null,null,{name:'Trening własny',exercises:[],restTime:90},'Trening własny',mode);
  }
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

var _historyExpandedMonths = null;

function _historyMonthPlural(n) {
  if (n === 1) return 'trening';
  var mod10 = n % 10, mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'treningi';
  return 'treningów';
}

function toggleHistoryMonth(key) {
  if (!_historyExpandedMonths) _historyExpandedMonths = {};
  _historyExpandedMonths[key] = !_historyExpandedMonths[key];
  renderHistory();
}

function renderHistory(){
  const el=document.getElementById('history-list');
  if(!state.workouts.length){el.innerHTML='<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Brak treningów</div><div class="empty-sub">Zacznij swój pierwszy trening!</div></div>';return}
  const months=['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  const monthNamesFull=['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];

  const sorted=[...state.workouts].reverse();
  const groups={}; const order=[];
  sorted.forEach(function(w){
    const d=new Date(w.date);
    const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    if(!groups[key]){groups[key]=[]; order.push(key);}
    groups[key].push(w);
  });

  const now=new Date();
  const currentKey=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  if(!_historyExpandedMonths){
    _historyExpandedMonths={};
    _historyExpandedMonths[currentKey]=true;
  }

  el.innerHTML=order.map(function(key){
    const parts=key.split('-'); const y=+parts[0], m=+parts[1]-1;
    const label=monthNamesFull[m]+' '+y;
    const items=groups[key];
    const expanded=!!_historyExpandedMonths[key];
    const itemsHtml=items.map(function(w){
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
    return '<div class="history-month-group" style="margin-bottom:6px;">'
      + '<div onclick="toggleHistoryMonth(\''+key+'\')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 4px;cursor:pointer;">'
      +   '<div style="font-size:14px;font-weight:700;">'+label+'</div>'
      +   '<div style="display:flex;align-items:center;gap:8px;color:var(--text3);font-size:12px;">'
      +     '<span>'+items.length+' '+_historyMonthPlural(items.length)+'</span>'
      +     '<span style="display:inline-block;transition:transform .2s;transform:rotate('+(expanded?90:0)+'deg);">›</span>'
      +   '</div>'
      + '</div>'
      + '<div style="display:'+(expanded?'block':'none')+';">'+itemsHtml+'</div>'
      + '</div>';
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
  var w = state.workouts.find(function(x){ return x.id===id; });
  if (!w) return;

  var sheet = document.getElementById('workout-detail-sheet');
  var body  = document.getElementById('workout-detail-body');
  if (!sheet || !body) return;

  var d = new Date(w.date);
  var months = ['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  var dateStr = d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
  var timeStr = ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);

  // ── Oblicz e1RM dla każdego setu żeby wykryć rekordy ──
  var allExercises = getAllExercises();
  var muscleLabels = {
    chest:'Klatka piersiowa', lats:'Najszerszy grzbiet', upperBack:'Górne plecy',
    lowerBack:'Dolne plecy', traps:'Czworoboczny', frontShoulder:'Barki przednie',
    midShoulder:'Barki boczne', rearShoulder:'Barki tylne', biceps:'Biceps',
    triceps:'Triceps', forearms:'Przedramiona', abs:'Brzuch',
    quads:'Czworogłowe uda', hamstrings:'Dwugłowe uda', glutes:'Pośladki', calves:'Łydki'
  };

  // Przelicz statystyki z serii
  var totalReps = 0, totalSets = 0, totalTonnage = 0;
  (w.exercises||[]).forEach(function(ex){
    (ex.sets||[]).forEach(function(s){
      if(!s.done) return;
      totalSets++;
      var r = parseInt(s.reps)||0;
      var wt = parseFloat(s.weight)||0;
      totalReps += r;
      totalTonnage += r*wt;
    });
  });
  totalTonnage = totalTonnage || w.tonnage || 0;
  totalSets    = totalSets    || w.totalSets || 0;
  totalReps    = totalReps    || w.totalReps || 0;

  // ── Sekcja 1: Podsumowanie ──
  var stats = [
    { icon:'📅', label:'Data i godzina',       val: dateStr+' · '+timeStr },
    { icon:'💪', label:'Plan treningowy',       val: (w.planName||'Trening')+(w.dayName?' — '+w.dayName:'') },
    { icon:'⏱️', label:'Czas trwania',          val: formatTime(w.duration||0) },
    { icon:'🏋️', label:'Ćwiczeń',              val: (w.exercises||[]).length },
    { icon:'🔢', label:'Serie',                 val: totalSets },
    { icon:'🔁', label:'Powtórzenia',           val: totalReps },
    { icon:'⚖️', label:'Tonaż',                val: (totalTonnage).toFixed(1)+' kg' },
  ];
  if (w.rating) stats.push({ icon:'⭐', label:'Ocena treningu', val: w.rating+' / 10' });
  if (w.note)   stats.push({ icon:'📝', label:'Notatka',        val: w.note });

  var s1 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  s1 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">📋 Podsumowanie</div>';
  s1 += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  stats.slice(0,6).forEach(function(s){
    s1 += '<div style="background:var(--surface2);border-radius:10px;padding:10px 12px;">'
      + '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+s.icon+' '+s.label+'</div>'
      + '<div style="font-size:14px;font-weight:700;">'+s.val+'</div></div>';
  });
  s1 += '</div>';
  // Tonaż i reszta szeroko
  stats.slice(6).forEach(function(s){
    s1 += '<div style="background:var(--surface2);border-radius:10px;padding:10px 12px;margin-top:8px;">'
      + '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+s.icon+' '+s.label+'</div>'
      + '<div style="font-size:14px;font-weight:700;">'+s.val+'</div></div>';
  });
  s1 += '</div>';

  // ── Sekcja 2: Analiza mięśni ──
  var muscleVol = {};
  var totalMusVol = 0;
  (w.exercises||[]).forEach(function(ex){
    var def = allExercises.find(function(e){ return e.id===ex.id; });
    if (!def || !def.muscles) return;
    var doneSets = (ex.sets||[]).filter(function(s){ return s.done; }).length || (ex.sets||[]).length;
    Object.keys(def.muscles).forEach(function(mk){
      var contrib = doneSets * (def.muscles[mk]/100);
      muscleVol[mk] = (muscleVol[mk]||0) + contrib;
      totalMusVol += contrib;
    });
  });

  var s2 = '';
  if (totalMusVol > 0) {
    var muscleArr = Object.keys(muscleVol)
      .map(function(k){ return { key:k, label:muscleLabels[k]||k, vol:muscleVol[k] }; })
      .filter(function(m){ return m.vol/totalMusVol > 0.03; })
      .sort(function(a,b){ return b.vol-a.vol; });
    var maxVol = muscleArr[0] ? muscleArr[0].vol : 1;

    s2 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    s2 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">💪 Analiza partii mięśniowych</div>';
    muscleArr.forEach(function(m){
      var pct = Math.round(m.vol/totalMusVol*100);
      var barW = Math.round(m.vol/maxVol*100);
      s2 += '<div style="margin-bottom:10px;">'
        + '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">'
        +   '<span style="font-weight:600;color:var(--text2);">'+m.label+'</span>'
        +   '<span style="color:var(--accent);font-weight:700;">'+pct+'%</span>'
        + '</div>'
        + '<div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;">'
        +   '<div style="width:'+barW+'%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;"></div>'
        + '</div></div>';
    });
    s2 += '</div>';
  }

  // ── Sekcja 3: Rekordy ──
  // Sprawdź czy jakiś set w tym treningu pobił rekord historyczny
  var prRecords = [];
  var workoutDate = new Date(w.date);
  (w.exercises||[]).forEach(function(ex){
    var def = allExercises.find(function(e){ return e.id===ex.id; });
    if (!def) return;
    var doneSets = (ex.sets||[]).filter(function(s){ return s.done && s.weight && s.reps; });
    if (!doneSets.length) return;

    // Find best e1RM for this exercise BEFORE this workout
    var historicalBest = 0;
    state.workouts.forEach(function(hw){
      if (new Date(hw.date) >= workoutDate) return; // only before
      (hw.exercises||[]).forEach(function(hex){
        if (hex.id !== ex.id) return;
        (hex.sets||[]).forEach(function(hs){
          if (!hs.done || !hs.weight || !hs.reps) return;
          var e = parseFloat(hs.weight)*(1+parseInt(hs.reps)/30);
          if (e > historicalBest) historicalBest = e;
        });
      });
    });

    // Find best e1RM in this workout's exercise
    var bestInWorkout = 0, bestW = 0, bestR = 0;
    doneSets.forEach(function(s){
      var e = parseFloat(s.weight)*(1+parseInt(s.reps)/30);
      if (e > bestInWorkout) { bestInWorkout=e; bestW=parseFloat(s.weight); bestR=parseInt(s.reps); }
    });

    if (bestInWorkout > historicalBest && historicalBest > 0) {
      prRecords.push({ name:def.name, weight:bestW, reps:bestR, e1rm:Math.round(bestInWorkout) });
    }
  });

  var s3 = '';
  if (prRecords.length) {
    s3 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;border-left:3px solid var(--accent);">';
    s3 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🏆 Pobite rekordy</div>';
    prRecords.forEach(function(pr){
      var shortName = pr.name.length>40 ? pr.name.slice(0,38)+'…' : pr.name;
      s3 += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:.5px solid var(--border2);">'
        + '<span style="font-size:20px;">🏆</span>'
        + '<div style="flex:1;"><div style="font-size:13px;font-weight:600;">'+shortName+'</div>'
        + '<div style="font-size:12px;color:var(--text3);">'+pr.weight+'kg × '+pr.reps+' powt. · 1RM ~'+pr.e1rm+'kg</div></div>'
        + '</div>';
    });
    s3 += '</div>';
  }

  // ── Sekcja 4: Porównanie z poprzednim treningiem ──
  var s4 = '';
  if (w.planId || w.planName) {
    var samePlan = state.workouts.filter(function(pw){
      return pw.id !== w.id && (pw.planId===w.planId || pw.planName===w.planName) && new Date(pw.date) < workoutDate;
    }).sort(function(a,b){ return new Date(b.date)-new Date(a.date); });

    if (samePlan.length) {
      var prev = samePlan[0];
      var prevDate = new Date(prev.date);
      var prevTonnage = prev.tonnage || 0;
      var prevSets    = prev.totalSets || 0;
      var prevReps    = prev.totalReps || 0;
      var prevDur     = prev.duration || 0;

      var diffs = [
        { icon:'⚖️', label:'Tonaż',        diff: totalTonnage - prevTonnage, unit:'kg', fmt:function(v){return v.toFixed(1);} },
        { icon:'🔢', label:'Serie',         diff: totalSets - prevSets,    unit:'',   fmt:function(v){return Math.round(v);} },
        { icon:'🔁', label:'Powtórzenia',   diff: totalReps - prevReps,    unit:'',   fmt:function(v){return Math.round(v);} },
        { icon:'⏱️', label:'Czas treningu', diff: (w.duration||0) - prevDur, unit:'', fmt:function(v){return formatTime(Math.abs(Math.round(v)));} },
      ];

      s4 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
      s4 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">📊 Vs poprzedni trening</div>';
      s4 += '<div style="font-size:11px;color:var(--text4);margin-bottom:10px;">'+prevDate.getDate()+' '+months[prevDate.getMonth()]+' '+prevDate.getFullYear()+'</div>';
      s4 += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
      diffs.forEach(function(df){
        if (df.diff === 0) return;
        var isPos = df.label === 'Czas treningu' ? df.diff < 0 : df.diff > 0;
        var sign  = df.diff > 0 ? '+' : '';
        var col   = isPos ? 'var(--green)' : 'var(--red)';
        var arrow = isPos ? '📈' : '📉';
        var valStr = df.label === 'Czas treningu'
          ? (df.diff>0?'+':'-')+df.fmt(df.diff)
          : sign+df.fmt(df.diff)+(df.unit?' '+df.unit:'');
        s4 += '<div style="background:var(--surface2);border-radius:10px;padding:10px 12px;">'
          + '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+df.icon+' '+df.label+'</div>'
          + '<div style="font-size:15px;font-weight:800;color:'+col+';">'+arrow+' '+valStr+'</div>'
          + '</div>';
      });
      s4 += '</div></div>';
    }
  }

  // ── Sekcja 5: Top 3 mięśnie ──
  var s5 = '';
  if (muscleArr && muscleArr.length >= 3) {
    var medals = ['🥇','🥈','🥉'];
    s5 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    s5 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🏅 Najbardziej zaangażowane mięśnie</div>';
    muscleArr.slice(0,3).forEach(function(m,i){
      s5 += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;'+(i<2?'border-bottom:.5px solid var(--border2);':'')+';">'
        + '<span style="font-size:24px;">'+medals[i]+'</span>'
        + '<div style="flex:1;font-size:14px;font-weight:700;">'+m.label+'</div>'
        + '<div style="font-size:13px;color:var(--accent);font-weight:700;">'+Math.round(m.vol/totalMusVol*100)+'%</div>'
        + '</div>';
    });
    s5 += '</div>';
  }

  // ── Lista ćwiczeń ──
  var s6 = '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  s6 += '<div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">📋 Wykonane ćwiczenia</div>';
  (w.exercises||[]).forEach(function(ex){
    var doneSets = (ex.sets||[]).filter(function(s){ return s.done; });
    if (!doneSets.length) return;
    var maxW = Math.max.apply(null, doneSets.map(function(s){return parseFloat(s.weight)||0;}));
    var totalR = doneSets.reduce(function(a,s){return a+(parseInt(s.reps)||0);},0);
    s6 += '<div style="padding:8px 0;border-bottom:.5px solid var(--border2);">'
      + '<div style="font-size:13px;font-weight:700;margin-bottom:3px;">'+ex.name+'</div>'
      + '<div style="font-size:12px;color:var(--text3);">'+doneSets.length+' serii · max '+maxW+'kg · '+totalR+' powt.</div>'
      + '</div>';
  });
  s6 += '</div>';

  body.innerHTML = s1 + s3 + s4 + s2 + s5 + s6;

  // Animuj paski po renderze
  requestAnimationFrame(function(){
    body.querySelectorAll('[style*="transition:width"]').forEach(function(el){
      var target = el.style.width;
      el.style.width = '0%';
      setTimeout(function(){ el.style.width = target; }, 50);
    });
  });

  openSheet('workout-detail-sheet');
}

