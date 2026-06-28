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

