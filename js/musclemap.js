// ===================== MUSCLEMAP.JS =====================
// MuscleMap — kolory, fatigue, kafelki, balance

// ── Zmienne globalne ──
let mmSide = 'front', mmMode = 'normal', mmSelected = null;


// ===================== MUSCLE COLOR ENGINE =====================
// fatigueToColor — przeniesione do js/
function lerpColor(a,b,t){
  const r1=parseInt(a.slice(1,3),16),g1=parseInt(a.slice(3,5),16),b1=parseInt(a.slice(5,7),16);
  const r2=parseInt(b.slice(1,3),16),g2=parseInt(b.slice(3,5),16),b2=parseInt(b.slice(5,7),16);
  const r=Math.round(r1+(r2-r1)*t),g=Math.round(g1+(g2-g1)*t),bv=Math.round(b1+(b2-b1)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bv.toString(16).padStart(2,'0')}`;
}

// calcMuscleFatigue — przeniesione do js/

// ===================== MUSCLE SVG DEFINITIONS =====================
// Each muscle group maps to SVG path IDs
// SVG_ICONS — przeniesione do js/svg_icons.js


// MuscleMap tile definitions
// MUSCLE_TILES — przeniesione do js/data.js


const MUSCLE_DEFS={
  // Front muscles → path IDs in front SVG
  chest:{label:'Klatka piersiowa',front:true,color:'#FF375F',group:'Klatka'},
  abs:{label:'Brzuch',front:true,color:'#FF375F',group:'Brzuch'},
  frontShoulder:{label:'Barki (przód)',front:true,color:'#FF375F',group:'Barki'},
  midShoulder:{label:'Barki (bok)',front:true,color:'#FF375F',group:'Barki'},
  biceps:{label:'Biceps',front:true,color:'#FF375F',group:'Biceps'},
  quads:{label:'Czworogłowe uda',front:true,color:'#FF375F',group:'Nogi'},
  calves:{label:'Łydki',front:true,color:'#FF375F',group:'Nogi'},
  forearms:{label:'Przedramiona',front:true,color:'#FF375F',group:'Inne'},
  // Back muscles → path IDs in back SVG
  lats:{label:'Mięśnie grzbietu',front:false,color:'#FF375F',group:'Plecy'},
  traps:{label:'Czworoboczny',front:false,color:'#FF375F',group:'Plecy'},
  lowerBack:{label:'Dolne plecy',front:false,color:'#FF375F',group:'Plecy'},
  rearShoulder:{label:'Barki (tył)',front:false,color:'#FF375F',group:'Barki'},
  triceps:{label:'Triceps',front:false,color:'#FF375F',group:'Triceps'},
  glutes:{label:'Pośladki',front:false,color:'#FF375F',group:'Pośladki'},
  hamstrings:{label:'Dwugłowe uda',front:false,color:'#FF375F',group:'Nogi'},
};

// Generate SVG body (male or female, front or back)
function generateBodySVG(gender,view){
  // We build detailed SVG paths for anatomically correct muscle groups
  const isFemale=gender==='female';
  const isBack=view==='back';
  const W=100,H=220;

  // Body proportions
  const cx=50;
  const headY=isFemale?14:13;
  const headR=isFemale?11:12;
  const neckY=headY+headR+1;
  const shoulderY=neckY+8;
  const shoulderW=isFemale?26:30;
  const waistY=shoulderY+45;
  const waistW=isFemale?16:18;
  const hipY=waistY+14;
  const hipW=isFemale?28:24;
  const kneeY=hipY+52;
  const ankleY=kneeY+52;

  let paths='';
  const mf=calcMuscleFatigue();

  function mc(key){return fatigueToColor(mf[key]||0)}
  function mp(key,d,label){
    return `<path class="muscle-path" id="mp-${key}" data-muscle="${key}" data-label="${label||MUSCLE_DEFS[key]?.label||key}" fill="${mc(key)}" d="${d}" onclick="selectMuscle('${key}')"/>`
  }

  if(!isBack){
    // FRONT VIEW
    // Body silhouette (background)
    paths+=`<path class="body-struct" d="M${cx},${shoulderY} C${cx-shoulderW},${shoulderY+5} ${cx-shoulderW-4},${shoulderY+20} ${cx-shoulderW-2},${waistY} C${cx-waistW-2},${waistY+5} ${cx-hipW},${hipY-6} ${cx-hipW},${hipY} L${cx-hipW+4},${kneeY} L${cx-hipW+6},${ankleY} L${cx-hipW+10},${ankleY+8} L${cx-6},${ankleY+8} L${cx-4},${kneeY+2} L${cx+4},${kneeY+2} L${cx+6},${ankleY+8} L${cx+hipW-10},${ankleY+8} L${cx+hipW-6},${ankleY} L${cx+hipW-4},${kneeY} L${cx+hipW},${hipY} C${cx+hipW},${hipY-6} ${cx+waistW+2},${waistY+5} ${cx+waistW+2},${waistY} C${cx+shoulderW+4},${shoulderY+20} ${cx+shoulderW},${shoulderY+5} ${cx},${shoulderY} Z" opacity="0.3"/>`;

    // Head
    paths+=`<ellipse class="body-head" cx="${cx}" cy="${headY}" rx="${headR}" ry="${headR+1}"/>`;
    // Neck
    paths+=`<rect class="body-struct" x="${cx-5}" y="${neckY}" width="10" height="8" rx="3" opacity="0.5"/>`;

    // CHEST
    if(!isFemale){
      paths+=mp('chest',`M${cx-2},${shoulderY+10} C${cx-18},${shoulderY+8} ${cx-shoulderW+2},${shoulderY+12} ${cx-shoulderW},${shoulderY+28} C${cx-shoulderW+2},${shoulderY+36} ${cx-14},${shoulderY+38} ${cx-2},${shoulderY+34} Z`,'Klatka (L)');
      paths+=mp('chest',`M${cx+2},${shoulderY+10} C${cx+18},${shoulderY+8} ${cx+shoulderW-2},${shoulderY+12} ${cx+shoulderW},${shoulderY+28} C${cx+shoulderW-2},${shoulderY+36} ${cx+14},${shoulderY+38} ${cx+2},${shoulderY+34} Z`,'Klatka (P)');
    } else {
      // Female chest (more rounded)
      paths+=mp('chest',`M${cx-2},${shoulderY+14} C${cx-16},${shoulderY+12} ${cx-shoulderW+2},${shoulderY+18} ${cx-shoulderW+2},${shoulderY+32} C${cx-14},${shoulderY+42} ${cx-4},${shoulderY+40} ${cx-2},${shoulderY+36} Z`,'Klatka (L)');
      paths+=mp('chest',`M${cx+2},${shoulderY+14} C${cx+16},${shoulderY+12} ${cx+shoulderW-2},${shoulderY+18} ${cx+shoulderW-2},${shoulderY+32} C${cx+14},${shoulderY+42} ${cx+4},${shoulderY+40} ${cx+2},${shoulderY+36} Z`,'Klatka (P)');
    }

    // FRONT SHOULDERS (deltoid anterior)
    paths+=mp('frontShoulder',`M${cx-shoulderW+2},${shoulderY+4} C${cx-shoulderW-6},${shoulderY+2} ${cx-shoulderW-8},${shoulderY+14} ${cx-shoulderW-4},${shoulderY+26} C${cx-shoulderW},${shoulderY+28} ${cx-shoulderW+2},${shoulderY+16} ${cx-shoulderW+2},${shoulderY+4} Z`,'Bark przód (L)');
    paths+=mp('frontShoulder',`M${cx+shoulderW-2},${shoulderY+4} C${cx+shoulderW+6},${shoulderY+2} ${cx+shoulderW+8},${shoulderY+14} ${cx+shoulderW+4},${shoulderY+26} C${cx+shoulderW},${shoulderY+28} ${cx+shoulderW-2},${shoulderY+16} ${cx+shoulderW-2},${shoulderY+4} Z`,'Bark przód (P)');

    // BICEPS
    paths+=mp('biceps',`M${cx-shoulderW-4},${shoulderY+28} C${cx-shoulderW-8},${shoulderY+36} ${cx-shoulderW-8},${shoulderY+52} ${cx-shoulderW-4},${shoulderY+58} C${cx-shoulderW},${shoulderY+52} ${cx-shoulderW},${shoulderY+36} ${cx-shoulderW+2},${shoulderY+28} Z`,'Biceps (L)');
    paths+=mp('biceps',`M${cx+shoulderW+4},${shoulderY+28} C${cx+shoulderW+8},${shoulderY+36} ${cx+shoulderW+8},${shoulderY+52} ${cx+shoulderW+4},${shoulderY+58} C${cx+shoulderW},${shoulderY+52} ${cx+shoulderW},${shoulderY+36} ${cx+shoulderW-2},${shoulderY+28} Z`,'Biceps (P)');

    // FOREARMS
    paths+=mp('forearms',`M${cx-shoulderW-4},${shoulderY+60} C${cx-shoulderW-8},${shoulderY+68} ${cx-shoulderW-8},${shoulderY+80} ${cx-shoulderW-5},${shoulderY+88} L${cx-shoulderW-1},${shoulderY+86} C${cx-shoulderW},${shoulderY+74} ${cx-shoulderW},${shoulderY+62} ${cx-shoulderW-4},${shoulderY+60} Z`,'Przedramię (L)');
    paths+=mp('forearms',`M${cx+shoulderW+4},${shoulderY+60} C${cx+shoulderW+8},${shoulderY+68} ${cx+shoulderW+8},${shoulderY+80} ${cx+shoulderW+5},${shoulderY+88} L${cx+shoulderW+1},${shoulderY+86} C${cx+shoulderW},${shoulderY+74} ${cx+shoulderW},${shoulderY+62} ${cx+shoulderW+4},${shoulderY+60} Z`,'Przedramię (P)');

    // ABS (6-pack style)
    const absTop=waistY-22,absH=8,absW=7;
    for(let row=0;row<3;row++){
      paths+=mp('abs',`M${cx-absW-1},${absTop+row*absH+1} L${cx-2},${absTop+row*absH+1} L${cx-2},${absTop+(row+1)*absH-1} L${cx-absW-1},${absTop+(row+1)*absH-1} Z`,'Brzuch');
      paths+=mp('abs',`M${cx+2},${absTop+row*absH+1} L${cx+absW+1},${absTop+row*absH+1} L${cx+absW+1},${absTop+(row+1)*absH-1} L${cx+2},${absTop+(row+1)*absH-1} Z`,'Brzuch');
    }

    // OBLIQUES
    paths+=`<path class="muscle-path" id="mp-abs" data-muscle="abs" data-label="Skośne brzucha" fill="${mc('abs')}" d="M${cx-waistW-2},${waistY-8} C${cx-waistW-6},${waistY} ${cx-waistW-4},${waistY+8} ${cx-hipW},${hipY-4} L${cx-waistW-1},${waistY-8} Z" onclick="selectMuscle('abs')"/>`;
    paths+=`<path class="muscle-path" id="mp-abs" data-muscle="abs" data-label="Skośne brzucha" fill="${mc('abs')}" d="M${cx+waistW+2},${waistY-8} C${cx+waistW+6},${waistY} ${cx+waistW+4},${waistY+8} ${cx+hipW},${hipY-4} L${cx+waistW+1},${waistY-8} Z" onclick="selectMuscle('abs')"/>`;

    // HIP FLEXORS (upper quads)
    const legCx_L=cx-hipW+10,legCx_R=cx+hipW-10;
    // QUADS
    paths+=mp('quads',`M${legCx_L+2},${hipY+4} C${legCx_L-8},${hipY+12} ${legCx_L-10},${hipY+35} ${legCx_L-6},${kneeY-8} L${legCx_L+6},${kneeY-8} C${legCx_L+8},${hipY+35} ${legCx_L+10},${hipY+12} ${legCx_L+2},${hipY+4} Z`,'Czworogłowe (L)');
    paths+=mp('quads',`M${legCx_R-2},${hipY+4} C${legCx_R+8},${hipY+12} ${legCx_R+10},${hipY+35} ${legCx_R+6},${kneeY-8} L${legCx_R-6},${kneeY-8} C${legCx_R-8},${hipY+35} ${legCx_R-10},${hipY+12} ${legCx_R-2},${hipY+4} Z`,'Czworogłowe (P)');

    // KNEE CAPS
    paths+=`<ellipse class="body-struct" cx="${legCx_L}" cy="${kneeY}" rx="7" ry="5" fill="#333" opacity="0.8"/>`;
    paths+=`<ellipse class="body-struct" cx="${legCx_R}" cy="${kneeY}" rx="7" ry="5" fill="#333" opacity="0.8"/>`;

    // SHINS / TIBIALIS
    paths+=`<path class="body-struct" d="M${legCx_L-5},${kneeY+6} C${legCx_L-6},${kneeY+20} ${legCx_L-4},${ankleY-16} ${legCx_L-2},${ankleY-4} L${legCx_L+2},${ankleY-4} C${legCx_L+4},${ankleY-14} ${legCx_L+2},${kneeY+20} ${legCx_L+3},${kneeY+6} Z" fill="#2a2a2a" opacity="0.7"/>`;
    paths+=`<path class="body-struct" d="M${legCx_R-3},${kneeY+6} C${legCx_R-2},${kneeY+20} ${legCx_R-4},${ankleY-14} ${legCx_R-2},${ankleY-4} L${legCx_R+2},${ankleY-4} C${legCx_R+4},${ankleY-16} ${legCx_R+6},${kneeY+20} ${legCx_R+5},${kneeY+6} Z" fill="#2a2a2a" opacity="0.7"/>`;

    // CALVES (front visible)
    paths+=mp('calves',`M${legCx_L-6},${kneeY+6} C${legCx_L-10},${kneeY+20} ${legCx_L-10},${ankleY-24} ${legCx_L-5},${ankleY-6} L${legCx_L-2},${ankleY-4} C${legCx_L-2},${ankleY-20} ${legCx_L-4},${kneeY+18} ${legCx_L-6},${kneeY+6} Z`,'Łydki (L)');
    paths+=mp('calves',`M${legCx_R+6},${kneeY+6} C${legCx_R+10},${kneeY+20} ${legCx_R+10},${ankleY-24} ${legCx_R+5},${ankleY-6} L${legCx_R+2},${ankleY-4} C${legCx_R+2},${ankleY-20} ${legCx_R+4},${kneeY+18} ${legCx_R+6},${kneeY+6} Z`,'Łydki (P)');

    // FEET
    paths+=`<ellipse class="body-struct" cx="${legCx_L}" cy="${ankleY+6}" rx="7" ry="5" fill="#2a2a2a" opacity="0.8"/>`;
    paths+=`<ellipse class="body-struct" cx="${legCx_R}" cy="${ankleY+6}" rx="7" ry="5" fill="#2a2a2a" opacity="0.8"/>`;

    // Mid-shoulder visible from front
    paths+=mp('midShoulder',`M${cx-shoulderW-2},${shoulderY+14} C${cx-shoulderW-8},${shoulderY+16} ${cx-shoulderW-8},${shoulderY+26} ${cx-shoulderW-4},${shoulderY+28} C${cx-shoulderW},${shoulderY+26} ${cx-shoulderW},${shoulderY+14} ${cx-shoulderW-2},${shoulderY+14} Z`,'Bark bok (L)');
    paths+=mp('midShoulder',`M${cx+shoulderW+2},${shoulderY+14} C${cx+shoulderW+8},${shoulderY+16} ${cx+shoulderW+8},${shoulderY+26} ${cx+shoulderW+4},${shoulderY+28} C${cx+shoulderW},${shoulderY+26} ${cx+shoulderW},${shoulderY+14} ${cx+shoulderW+2},${shoulderY+14} Z`,'Bark bok (P)');

  } else {
    // BACK VIEW
    paths+=`<path class="body-struct" d="M${cx},${shoulderY} C${cx-shoulderW},${shoulderY+5} ${cx-shoulderW-4},${shoulderY+20} ${cx-shoulderW-2},${waistY} C${cx-waistW-2},${waistY+5} ${cx-hipW},${hipY-6} ${cx-hipW},${hipY} L${cx-hipW+4},${kneeY} L${cx-hipW+6},${ankleY} L${cx-hipW+10},${ankleY+8} L${cx-6},${ankleY+8} L${cx-4},${kneeY+2} L${cx+4},${kneeY+2} L${cx+6},${ankleY+8} L${cx+hipW-10},${ankleY+8} L${cx+hipW-6},${ankleY} L${cx+hipW-4},${kneeY} L${cx+hipW},${hipY} C${cx+hipW},${hipY-6} ${cx+waistW+2},${waistY+5} ${cx+waistW+2},${waistY} C${cx+shoulderW+4},${shoulderY+20} ${cx+shoulderW},${shoulderY+5} ${cx},${shoulderY} Z" opacity="0.3"/>`;

    // Head (back)
    paths+=`<ellipse class="body-head" cx="${cx}" cy="${headY}" rx="${headR}" ry="${headR+1}"/>`;
    paths+=`<rect class="body-struct" x="${cx-5}" y="${neckY}" width="10" height="8" rx="3" opacity="0.5"/>`;

    // TRAPS
    paths+=mp('traps',`M${cx-4},${neckY+6} C${cx-14},${shoulderY+2} ${cx-shoulderW},${shoulderY+4} ${cx-shoulderW+2},${shoulderY+14} C${cx-14},${shoulderY+18} ${cx-4},${shoulderY+20} ${cx-2},${shoulderY+14} Z`,'Kapturowy (L)');
    paths+=mp('traps',`M${cx+4},${neckY+6} C${cx+14},${shoulderY+2} ${cx+shoulderW},${shoulderY+4} ${cx+shoulderW-2},${shoulderY+14} C${cx+14},${shoulderY+18} ${cx+4},${shoulderY+20} ${cx+2},${shoulderY+14} Z`,'Kapturowy (P)');
    // Lower trap
    paths+=mp('traps',`M${cx-2},${shoulderY+14} C${cx-12},${shoulderY+20} ${cx-14},${shoulderY+32} ${cx-2},${shoulderY+36} L${cx+2},${shoulderY+36} C${cx+14},${shoulderY+32} ${cx+12},${shoulderY+20} ${cx+2},${shoulderY+14} Z`,'Kapturowy (dolny)');

    // REAR SHOULDERS
    paths+=mp('rearShoulder',`M${cx-shoulderW+2},${shoulderY+4} C${cx-shoulderW-6},${shoulderY+2} ${cx-shoulderW-8},${shoulderY+16} ${cx-shoulderW-4},${shoulderY+26} C${cx-shoulderW},${shoulderY+28} ${cx-shoulderW+2},${shoulderY+18} ${cx-shoulderW+2},${shoulderY+4} Z`,'Bark tył (L)');
    paths+=mp('rearShoulder',`M${cx+shoulderW-2},${shoulderY+4} C${cx+shoulderW+6},${shoulderY+2} ${cx+shoulderW+8},${shoulderY+16} ${cx+shoulderW+4},${shoulderY+26} C${cx+shoulderW},${shoulderY+28} ${cx+shoulderW-2},${shoulderY+18} ${cx+shoulderW-2},${shoulderY+4} Z`,'Bark tył (P)');

    // LATS
    paths+=mp('lats',`M${cx-4},${shoulderY+16} C${cx-18},${shoulderY+20} ${cx-shoulderW-2},${shoulderY+28} ${cx-waistW-6},${waistY+4} C${cx-waistW-2},${waistY+2} ${cx-4},${waistY-4} ${cx-2},${shoulderY+28} Z`,'Najszersze (L)');
    paths+=mp('lats',`M${cx+4},${shoulderY+16} C${cx+18},${shoulderY+20} ${cx+shoulderW+2},${shoulderY+28} ${cx+waistW+6},${waistY+4} C${cx+waistW+2},${waistY+2} ${cx+4},${waistY-4} ${cx+2},${shoulderY+28} Z`,'Najszersze (P)');

    // TRICEPS
    paths+=mp('triceps',`M${cx-shoulderW-2},${shoulderY+28} C${cx-shoulderW-8},${shoulderY+36} ${cx-shoulderW-8},${shoulderY+52} ${cx-shoulderW-4},${shoulderY+58} C${cx-shoulderW},${shoulderY+52} ${cx-shoulderW},${shoulderY+36} ${cx-shoulderW},${shoulderY+28} Z`,'Triceps (L)');
    paths+=mp('triceps',`M${cx+shoulderW+2},${shoulderY+28} C${cx+shoulderW+8},${shoulderY+36} ${cx+shoulderW+8},${shoulderY+52} ${cx+shoulderW+4},${shoulderY+58} C${cx+shoulderW},${shoulderY+52} ${cx+shoulderW},${shoulderY+36} ${cx+shoulderW},${shoulderY+28} Z`,'Triceps (P)');

    // LOWER BACK / ERECTORS
    paths+=mp('lowerBack',`M${cx-2},${waistY-8} C${cx-8},${waistY-2} ${cx-8},${waistY+16} ${cx-4},${hipY-2} L${cx},${hipY+2} L${cx},${waistY-10} Z`,'Dolne plecy (L)');
    paths+=mp('lowerBack',`M${cx+2},${waistY-8} C${cx+8},${waistY-2} ${cx+8},${waistY+16} ${cx+4},${hipY-2} L${cx},${hipY+2} L${cx},${waistY-10} Z`,'Dolne plecy (P)');

    // GLUTES
    const gHipW=isFemale?hipW+4:hipW;
    paths+=mp('glutes',`M${cx-2},${hipY-2} C${cx-14},${hipY-4} ${cx-gHipW},${hipY} ${cx-gHipW+4},${hipY+24} C${cx-gHipW+10},${hipY+32} ${cx-8},${hipY+28} ${cx-2},${hipY+20} Z`,'Pośladki (L)');
    paths+=mp('glutes',`M${cx+2},${hipY-2} C${cx+14},${hipY-4} ${cx+gHipW},${hipY} ${cx+gHipW-4},${hipY+24} C${cx+gHipW-10},${hipY+32} ${cx+8},${hipY+28} ${cx+2},${hipY+20} Z`,'Pośladki (P)');

    // HAMSTRINGS
    const legCx_L=cx-hipW+10,legCx_R=cx+hipW-10;
    paths+=mp('hamstrings',`M${legCx_L+2},${hipY+24} C${legCx_L-8},${hipY+32} ${legCx_L-10},${hipY+54} ${legCx_L-6},${kneeY-6} L${legCx_L+6},${kneeY-6} C${legCx_L+8},${hipY+54} ${legCx_L+10},${hipY+32} ${legCx_L+2},${hipY+24} Z`,'Dwugłowe (L)');
    paths+=mp('hamstrings',`M${legCx_R-2},${hipY+24} C${legCx_R+8},${hipY+32} ${legCx_R+10},${hipY+54} ${legCx_R+6},${kneeY-6} L${legCx_R-6},${kneeY-6} C${legCx_R-8},${hipY+54} ${legCx_R-10},${hipY+32} ${legCx_R-2},${hipY+24} Z`,'Dwugłowe (P)');

    // KNEE
    paths+=`<ellipse class="body-struct" cx="${legCx_L}" cy="${kneeY}" rx="7" ry="5" fill="#333" opacity="0.8"/>`;
    paths+=`<ellipse class="body-struct" cx="${legCx_R}" cy="${kneeY}" rx="7" ry="5" fill="#333" opacity="0.8"/>`;

    // CALVES (back - more prominent)
    paths+=mp('calves',`M${legCx_L-5},${kneeY+6} C${legCx_L-10},${kneeY+18} ${legCx_L-10},${ankleY-28} ${legCx_L-5},${ankleY-8} C${legCx_L},${ankleY-6} ${legCx_L+5},${ankleY-8} ${legCx_L+8},${ankleY-26} C${legCx_L+8},${kneeY+18} ${legCx_L+5},${kneeY+6} ${legCx_L-5},${kneeY+6} Z`,'Łydki (L)');
    paths+=mp('calves',`M${legCx_R-5},${kneeY+6} C${legCx_R-10},${kneeY+18} ${legCx_R-10},${ankleY-28} ${legCx_R-5},${ankleY-8} C${legCx_R},${ankleY-6} ${legCx_R+5},${ankleY-8} ${legCx_R+8},${ankleY-26} C${legCx_R+8},${kneeY+18} ${legCx_R+5},${kneeY+6} ${legCx_R-5},${kneeY+6} Z`,'Łydki (P)');

    // FEET
    paths+=`<ellipse class="body-struct" cx="${legCx_L}" cy="${ankleY+6}" rx="7" ry="5" fill="#2a2a2a" opacity="0.8"/>`;
    paths+=`<ellipse class="body-struct" cx="${legCx_R}" cy="${ankleY+6}" rx="7" ry="5" fill="#2a2a2a" opacity="0.8"/>`;

    // FOREARMS BACK
    paths+=mp('forearms',`M${cx-shoulderW-4},${shoulderY+60} C${cx-shoulderW-8},${shoulderY+68} ${cx-shoulderW-8},${shoulderY+80} ${cx-shoulderW-5},${shoulderY+88} L${cx-shoulderW-1},${shoulderY+88} C${cx-shoulderW},${shoulderY+76} ${cx-shoulderW},${shoulderY+62} ${cx-shoulderW-4},${shoulderY+60} Z`,'Przedramię (L)');
    paths+=mp('forearms',`M${cx+shoulderW+4},${shoulderY+60} C${cx+shoulderW+8},${shoulderY+68} ${cx+shoulderW+8},${shoulderY+80} ${cx+shoulderW+5},${shoulderY+88} L${cx+shoulderW+1},${shoulderY+88} C${cx+shoulderW},${shoulderY+76} ${cx+shoulderW},${shoulderY+62} ${cx+shoulderW+4},${shoulderY+60} Z`,'Przedramię (P)');
  }

  return`<svg class="body-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

// MuscleMap — przeniesione do js/musclemap.js

// === Dodatkowe funkcje ===
// ===================== MUSCLEMAP.JS =====================

function closeMusclePanel() {
  mmSelected = null;
  const panel = document.getElementById('muscle-detail-panel');
  if (panel) panel.style.display = 'none';
}

function selectMuscleTile(key) {
  if (mmSelected === key) { mmSelected = null; closeMusclePanel(); renderMuscleMapMain(); return; }
  mmSelected = key;
  renderMuscleMapMain();
  const tile = MUSCLE_TILES.find(t => t.key === key);
  if (!tile) return;
  showMuscleTileDetail(tile);
}

function setMMSide(side, el) {
  mmSide = side;
  document.getElementById('mm-front-btn').classList.toggle('active', side === 'front');
  document.getElementById('mm-back-btn').classList.toggle('active', side === 'back');
  closeMusclePanel();
  renderMuscleMapMain();
}

function setMMMode(mode, el) {
  mmMode = mode;
  document.getElementById('mm-normal-btn').classList.toggle('active', mode === 'normal');
  document.getElementById('mm-heat-btn').classList.toggle('active', mode === 'heat');
  renderMuscleMapMain();
}

function renderMuscleMapMain() {
  const fatigue = calcMuscleFatigue();
  const tiles = MUSCLE_TILES.filter(t => t.side === mmSide);
  const grid = document.getElementById('mm-tile-grid');
  if (!grid) return;

  grid.innerHTML = tiles.map(tile => {
    const f = Math.min(100, tile.muscleKeys.reduce((a,k) => a + (fatigue[k]||0), 0) / tile.muscleKeys.length);
    const color = fatigueToColor(f);
    const icon = SVG_ICONS[tile.icon] || '';
    const isSelected = mmSelected === tile.key;
    return `<div class="mm-tile ${isSelected ? 'selected' : ''}"
      id="tile-${tile.key}"
      style="background:${color};"
      onclick="selectMuscleTile('${tile.key}')">
      <div class="mm-tile-icon"><svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">${icon}</svg></div>
      <div class="mm-tile-pct">${Math.round(f)}%</div>
      <div class="mm-tile-label">${tile.label}</div>
      <div class="mm-tile-bar"><div class="mm-tile-bar-fill" style="width:${f}%"></div></div>
    </div>`;
  }).join('');
}

function showMuscleTileDetail(tile) {
  try {
    const fatigue = calcMuscleFatigue();
    const f = Math.min(100, tile.muscleKeys.reduce(function(a,k){ return a + (fatigue[k]||0); }, 0) / tile.muscleKeys.length);
    const recovery = Math.max(0, 100 - f);
    const recoveryHours = Math.round((f / 100) * 72);
    const color = fatigueToColor(f);

    // Weekly sets
    const weekAgo = Date.now() - 7 * 86400000;
    let weeklySets = 0, weeklyTonnage = 0, lastDate = null, exerciseNames = [];
    state.workouts.forEach(function(w) {
      const wt = new Date(w.date).getTime();
      const isWeek = wt > weekAgo;
      (w.exercises || []).forEach(function(ex) {
        const def = getAllExercises().find(function(e){ return e.id === ex.id; });
        if (!def || !def.muscles) return;
        const hits = tile.muscleKeys.some(function(k){ return def.muscles[k] >= 30; });
        if (!hits) return;
        if (isWeek) {
          weeklySets += ex.completedSets || 0;
          weeklyTonnage += (ex.sets||[]).filter(function(s){ return s.done; }).reduce(function(a,s){
            return a + (parseFloat(s.weight)||0) * (parseInt(s.reps)||0);
          }, 0);
        }
        if (!lastDate || wt > new Date(lastDate).getTime()) lastDate = w.date;
        if (exerciseNames.indexOf(def.name) === -1) exerciseNames.push(def.name);
      });
    });

    const daysSince = lastDate ? Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000) : null;

    // 12-week volume chart
    const weeklyVol = [];
    for (let i = 11; i >= 0; i--) {
      const wStart = Date.now() - (i+1)*7*86400000;
      const wEnd   = Date.now() - i*7*86400000;
      let vol = 0;
      state.workouts.forEach(function(w) {
        const wt = new Date(w.date).getTime();
        if (wt < wStart || wt >= wEnd) return;
        (w.exercises||[]).forEach(function(ex) {
          const def = getAllExercises().find(function(e){ return e.id === ex.id; });
          if (!def || !def.muscles) return;
          if (tile.muscleKeys.some(function(k){ return def.muscles[k] >= 30; })) vol += ex.completedSets||0;
        });
      });
      weeklyVol.push(vol);
    }
    const maxVol = Math.max.apply(null, weeklyVol.concat([1]));
    const insights = generateMuscleInsights(tile.key, f, weeklySets, daysSince, weeklyVol);

    // Build HTML without nested template literals
    const pctStr = Math.round(f) + '%';
    const recovStr = Math.round(recovery) + '% · Pełna za ~' + recoveryHours + 'h';
    const tonnStr = (weeklyTonnage/1000).toFixed(1) + 't';
    const daySinceStr = daysSince !== null ? daysSince + 'd' : '—';

    const lastDateHtml = lastDate
      ? '<div style="font-size:12px;color:var(--text4);margin-top:8px;">Ostatni trening: ' + new Date(lastDate).toLocaleDateString('pl') + '</div>'
      : '';
    const exNamesHtml = exerciseNames.length
      ? '<div style="font-size:12px;color:var(--text3);margin-top:4px;">Ćwiczenia: ' + exerciseNames.slice(0,3).join(', ') + '</div>'
      : '';

    const chartBars = weeklyVol.map(function(v) {
      const h = Math.max(4, (v/maxVol*100));
      const bg = v > 0 ? color : 'var(--surface3)';
      return '<div class="mini-bar" style="height:' + h + '%;background:' + bg + '"></div>';
    }).join('');

    const insightsHtml = insights.map(function(i) {
      return '<div class="ai-insight"><div class="ai-insight-label">✨ AI Coach</div>' + i + '</div>';
    }).join('');

    const panel = document.getElementById('muscle-detail-panel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.innerHTML =
      '<div class="muscle-panel" style="margin:0 16px;">' +
        '<div class="muscle-panel-header">' +
          '<div>' +
            '<div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;">' + tile.group + '</div>' +
            '<div class="muscle-panel-name">' + tile.label + '</div>' +
          '</div>' +
          '<button class="muscle-panel-close" onclick="closeMusclePanel();mmSelected=null;renderMuscleMapMain()">✕</button>' +
        '</div>' +
        '<div style="font-size:13px;color:var(--text3);margin-bottom:4px;">Zmęczenie: <strong style="color:' + color + '">' + pctStr + '</strong></div>' +
        '<div class="fatigue-meter"><div class="fatigue-fill" style="width:' + f + '%;background:' + color + ';"></div></div>' +
        '<div style="font-size:12px;color:var(--text4);margin-bottom:10px;">Regeneracja: ' + recovStr + '</div>' +
        '<div class="muscle-stats-row">' +
          '<div class="muscle-stat"><div class="muscle-stat-val accent">' + weeklySets + '</div><div class="muscle-stat-label">Serie/tydzień</div></div>' +
          '<div class="muscle-stat"><div class="muscle-stat-val">' + daySinceStr + '</div><div class="muscle-stat-label">Dni od treningu</div></div>' +
          '<div class="muscle-stat"><div class="muscle-stat-val">' + tonnStr + '</div><div class="muscle-stat-label">Tonaż/tydzień</div></div>' +
        '</div>' +
        lastDateHtml +
        exNamesHtml +
        '<div style="margin-top:10px;">' +
          '<div style="font-size:11px;color:var(--text4);margin-bottom:4px;text-transform:uppercase;font-weight:600;">Objętość — 12 tygodni</div>' +
          '<div class="mini-chart">' + chartBars + '</div>' +
        '</div>' +
        insightsHtml +
      '</div>';

    setTimeout(function(){ panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  } catch(err) {
    console.error('showMuscleTileDetail error:', err);
  }
}

function generateMuscleInsights(key, fatigue, weeklySets, daysSince, weeklyVol) {
  var insights = [];
  var avg12 = weeklyVol.reduce(function(a,b){return a+b;},0) / 12;
  var lastWeek = weeklyVol[weeklyVol.length-1];
  var prevWeek = weeklyVol[weeklyVol.length-2] || 0;

  if (daysSince === null) {
    insights.push('Ta partia jeszcze nie była trenowana. Czas zacząć!');
  } else if (daysSince > 7) {
    insights.push('Ta partia nie była trenowana od ' + daysSince + ' dni. Zaplanuj trening!');
  } else if (daysSince === 0) {
    insights.push('Świeżo po treningu — mięsień potrzebuje odpoczynku.');
  }

  if (fatigue > 85) {
    insights.push('Mięsień jest bardzo zmęczony. Rozważ dzień regeneracji.');
  } else if (fatigue < 10 && weeklySets > 0) {
    insights.push('Mięsień jest prawie w pełni zregenerowany. Czas na kolejny trening!');
  }

  if (lastWeek > 0 && prevWeek > 0) {
    var pct = Math.round((lastWeek - prevWeek) / prevWeek * 100);
    if (pct > 15) insights.push('Objętość wzrosła o ' + pct + '% względem poprzedniego tygodnia. Dobry postęp!');
    else if (pct < -15) insights.push('Objętość spadła o ' + Math.abs(pct) + '% względem poprzedniego tygodnia.');
  }
  if (avg12 > 0 && lastWeek < avg12 * 0.7) {
    insights.push('Objętość tej partii jest niższa niż średnia z ostatnich 12 tygodni (' + Math.round(avg12) + ' serie).');
  }
  return insights.slice(0, 2);
}

function renderBalancePreview(){
  const el=document.getElementById('balance-preview');
  if(!el)return;
  const data=getBalanceData();
  const maxSets=Math.max(...data.map(d=>d.sets),1);
  el.innerHTML='<div style="padding:0 16px 8px;">'
    +data.slice(0,5).map(function(d){
      return '<div class="balance-row">'
        +'<div class="balance-name">'+d.label+'</div>'
        +'<div class="balance-bar-wrap"><div class="balance-fill" style="width:'+(d.sets/maxSets*100)+'%;background:'+fatigueToColor(d.sets/maxSets*100)+';"></div></div>'
        +'<div class="balance-val">'+d.sets+'s</div>'
        +'</div>';
    }).join('')
    +'</div>';
  renderAIInsights(data);
}

function renderAIInsights(data){
  const el=document.getElementById('ai-insights-panel');
  if(!el)return;
  const insights=generateBalanceInsights(data);
  if(!insights.length){el.innerHTML='';return;}
  el.innerHTML='<div style="padding:0 16px 12px;"><div style="font-size:13px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">✨ AI Wskazówki</div>'
    +insights.map(function(i){return '<div class="insight-item"><div class="insight-icon">'+i.icon+'</div><div>'+i.text+'</div></div>';}).join('')
    +'</div>';
}

function generateBalanceInsights(data){
  const insights=[];
  if(!data.some(d=>d.sets>0)){
    return[{icon:'💡',text:'Zacznij trenować, aby zobaczyć analizę balansu.'}];
  }
  const top=data.filter(d=>d.sets>0).sort((a,b)=>b.sets-a.sets);
  const legs=data.find(d=>d.label==='Nogi');
  const back=data.find(d=>d.label==='Plecy');
  const chest=data.find(d=>d.label==='Klatka');
  const shoulders=data.find(d=>d.label==='Barki');

  if(top[0]) insights.push({icon:'🔥',text:`${top[0].label} to obecnie najbardziej trenowana partia (${top[0].sets} serii w tym tygodniu).`});
  if(legs&&legs.sets<4&&top[0]&&top[0].sets>8) insights.push({icon:'⚠️',text:`Trenujesz znacznie częściej górną część ciała niż nogi. Zalecane minimum to 8-10 serii tygodniowo.`});
  if(back&&chest&&Math.abs(back.sets-chest.sets)<=2&&back.sets>0) insights.push({icon:'✅',text:`Plecy i klatka są trenowane w podobnym stopniu. Dobry balans!`});
  if(shoulders&&shoulders.sets>16) insights.push({icon:'📊',text:`Objętość barków jest bardzo wysoka (${shoulders.sets} serii). Upewnij się, że regenerujesz się odpowiednio.`});
  if(top.length>=3&&top[top.length-1].sets===0) insights.push({icon:'💡',text:`${data.filter(d=>d.sets===0).map(d=>d.label).join(', ')} nie były trenowane w tym tygodniu.`});
  return insights.slice(0,4);
}

function getBalanceData(){
  const weekAgo=Date.now()-7*86400000;
  const groups={
    'Klatka':{label:'Klatka',keys:['chest'],sets:0},
    'Plecy':{label:'Plecy',keys:['lats','traps','lowerBack'],sets:0},
    'Barki':{label:'Barki',keys:['frontShoulder','midShoulder','rearShoulder'],sets:0},
    'Nogi':{label:'Nogi',keys:['quads','hamstrings','calves'],sets:0},
    'Pośladki':{label:'Pośladki',keys:['glutes'],sets:0},
    'Brzuch':{label:'Brzuch',keys:['abs'],sets:0},
    'Biceps':{label:'Biceps',keys:['biceps'],sets:0},
    'Triceps':{label:'Triceps',keys:['triceps'],sets:0},
  };
  state.workouts.forEach(w=>{
    if(new Date(w.date).getTime()<weekAgo)return;
    (w.exercises||[]).forEach(ex=>{
      const def=getAllExercises().find(e=>e.id===ex.id);
      if(!def?.muscles)return;
      const done=ex.completedSets||0;
      Object.entries(groups).forEach(([g,gd])=>{
        if(gd.keys.some(k=>def.muscles[k]&&def.muscles[k]>=60)){
          gd.sets+=done;
        }
      });
    });
  });
  return Object.values(groups).sort((a,b)=>b.sets-a.sets);
}

function showFullBalance(){
  const data=getBalanceData();
  const maxSets=Math.max(...data.map(d=>d.sets),1);
  const insights=generateBalanceInsights(data);
  document.getElementById('balance-sheet-body').innerHTML=
    data.map(function(d){
      return '<div class="balance-row" style="margin-bottom:12px;">'
        +'<div class="balance-name" style="font-size:14px;">'+d.label+'</div>'
        +'<div class="balance-bar-wrap"><div class="balance-fill" style="width:'+(d.sets/maxSets*100)+'%;background:'+fatigueToColor(d.sets/maxSets*100)+';"></div></div>'
        +'<div class="balance-val" style="font-size:13px;">'+d.sets+' serii</div>'
        +'</div>';
    }).join('')
    +'<div style="margin-top:20px;"><div style="font-size:13px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">✨ Analiza AI</div>'
    +insights.map(function(i){return '<div class="insight-item"><div class="insight-icon">'+i.icon+'</div><div>'+i.text+'</div></div>';}).join('')
    +'</div>';
  openSheet('balance-sheet');
}

