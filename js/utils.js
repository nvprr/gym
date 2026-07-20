// ===================== UTILS.JS =====================
// Funkcje pomocnicze

function fatigueToColor(f){
  // 0→gray, 20→green, 40→yellow, 60→orange, 80→red, 100→darkred
  f=Math.max(0,Math.min(100,f));
  if(f<5) return '#444444';
  if(f<20){const t=(f-5)/15;return lerpColor('#444444','#30D158',t)}
  if(f<40){const t=(f-20)/20;return lerpColor('#30D158','#FFD60A',t)}
  if(f<60){const t=(f-40)/20;return lerpColor('#FFD60A','#FF9F0A',t)}
  if(f<80){const t=(f-60)/20;return lerpColor('#FF9F0A','#FF453A',t)}
  const t=(f-80)/20;return lerpColor('#FF453A','#8B0000',t);
}

function calcMuscleFatigue(){
  const fatigue={};
  const now=Date.now();
  const recoveryMs=72*3600*1000;
  state.workouts.forEach(w=>{
    const age=now-new Date(w.date).getTime();
    if(age>recoveryMs*1.5)return;
    const rf=Math.max(0,1-age/recoveryMs);
    (w.exercises||[]).forEach(ex=>{
      const def=getAllExercises().find(e=>e.id===ex.id);
      if(!def||!def.muscles)return;
      const doneSets=ex.completedSets||0;
      Object.entries(def.muscles).forEach(([m,pct])=>{
        if(!fatigue[m])fatigue[m]=0;
        fatigue[m]+=(pct/100)*rf*doneSets*12;
      });
    });
  });
  return fatigue;
}

function formatTime(s){
  var h=Math.floor(s/3600);
  var m=Math.floor((s%3600)/60);
  var sec=s%60;
  var mm=m<10?'0'+m:String(m);
  var ss=sec<10?'0'+sec:String(sec);
  if(h>0){var hh=h<10?'0'+h:String(h);return hh+':'+mm+':'+ss;}
  return mm+':'+ss;
}

function getDefaultRest(cat){if(cat==='wielostawowe')return state.settings.restCompound||90;if(cat==='izolacja')return state.settings.restIsolation||60;if(cat==='core')return state.settings.restAbs||45;return 90}

function getPrevBest(exId){
  for(let i=state.workouts.length-1;i>=0;i--){
    const ex=(state.workouts[i].exercises||[]).find(e=>e.id===exId);
    if(ex){const best=(ex.sets||[]).filter(s=>s.done).sort((a,b)=>(parseFloat(b.weight)||0)-(parseFloat(a.weight)||0))[0];if(best)return best}
  }
  return null;
}

// ── Streak treningowy (tygodniowy) ──
// Streak liczy kolejne tygodnie kalendarzowe (poniedziałek–niedziela), w których
// był co najmniej 1 trening — nie kolejne dni. Dzięki temu przerwa w obrębie
// tygodnia (np. trening w piątek, potem w poniedziałek następnego tygodnia)
// NIE zeruje streaka, bo to wciąż 2 kolejne tygodnie z treningiem.
// Streak zeruje się dopiero, gdy minie CAŁY tydzień kalendarzowy bez treningu.
function getWeekMonday(d) {
  var date = new Date(d);
  date.setHours(0, 0, 0, 0);
  var day = date.getDay(); // 0=Niedz,1=Pon,...,6=Sob
  var diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function computeStreaks() {
  var workouts = state.workouts;
  if (!workouts || !workouts.length) return { current: 0, max: 0 };

  var WEEK_MS = 7 * 86400000;
  var weekSet = {};
  workouts.forEach(function(w) {
    weekSet[getWeekMonday(w.date).getTime()] = true;
  });
  var weekTimes = Object.keys(weekSet).map(Number).sort(function(a, b) { return a - b; });

  // Najdłuższy streak w historii (kolejne tygodnie treningowe)
  var max = 1, run = 1;
  for (var i = 1; i < weekTimes.length; i++) {
    var diffWeeks = Math.round((weekTimes[i] - weekTimes[i - 1]) / WEEK_MS);
    if (diffWeeks === 1) { run++; max = Math.max(max, run); }
    else run = 1;
  }

  // Aktualny streak — zeruje się tylko gdy minął cały tydzień bez treningu
  var thisMonday = getWeekMonday(new Date()).getTime();
  var lastTrainedWeek = weekTimes[weekTimes.length - 1];
  var weeksSinceLastTrained = Math.round((thisMonday - lastTrainedWeek) / WEEK_MS);
  if (weeksSinceLastTrained > 1) {
    return { current: 0, max: max };
  }

  var current = 1;
  for (var j = weekTimes.length - 2; j >= 0; j--) {
    var d = Math.round((weekTimes[j + 1] - weekTimes[j]) / WEEK_MS);
    if (d === 1) current++;
    else break;
  }
  return { current: current, max: Math.max(max, current) };
}

