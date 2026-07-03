// ===================== DATA.JS =====================
// Stałe dane: MUSCLE_TILES, ACHIEVEMENTS

const MUSCLE_TILES = [
  // FRONT
  { key:'chest',      label:'Klatka',         icon:'klatka',       group:'Klatka',   muscleKeys:['chest'],                          side:'front' },
  { key:'biceps',     label:'Biceps',          icon:'biceps',       group:'Biceps',   muscleKeys:['biceps'],                         side:'front' },
  { key:'abs',        label:'Brzuch',          icon:'brzuch',       group:'Brzuch',   muscleKeys:['abs'],                            side:'front' },
  { key:'forearms',   label:'Przedramiona',    icon:'przedramie',   group:'Inne',     muscleKeys:['forearms'],                       side:'front' },
  // BACK
  { key:'lats',       label:'Najszerszy',      icon:'plecy_grzbiet',group:'Plecy',    muscleKeys:['lats'],                           side:'back'  },
  { key:'traps',      label:'Czworoboczny',    icon:'czworoboczny', group:'Plecy',    muscleKeys:['traps'],                          side:'back'  },
  { key:'lowerBack',  label:'Dolne plecy',     icon:'plecy_dol',    group:'Plecy',    muscleKeys:['lowerBack'],                      side:'back'  },
  { key:'rearShoulder',label:'Bark tylny',     icon:'barki_tyl',    group:'Barki',    muscleKeys:['rearShoulder'],                   side:'back'  },
  { key:'triceps',    label:'Triceps',         icon:'triceps',      group:'Triceps',  muscleKeys:['triceps'],                        side:'back'  },
  { key:'glutes',     label:'Pośladki',        icon:'posladki',     group:'Pośladki', muscleKeys:['glutes'],                         side:'back'  },
  { key:'hamstrings', label:'Dwugłowe ud',     icon:'dwugłowe',     group:'Nogi',     muscleKeys:['hamstrings'],                     side:'back'  },
  { key:'calves',     label:'Łydki',           icon:'lydki',        group:'Nogi',     muscleKeys:['calves'],                         side:'back'  },
  // FRONT (lower)
  { key:'frontShoulder', label:'Bark przedni',    icon:'bark_przod',   group:'Barki',    muscleKeys:['frontShoulder'],                  side:'front' },
  { key:'quads',      label:'Czworogłowe',     icon:'dwugłowe',     group:'Nogi',     muscleKeys:['quads'],                          side:'front' },
];

const ACHIEVEMENTS = [
  // 🚀 START
  {id:'w1',   cat:'start',   icon:'🎯', name:'Pierwszy krok',        desc:'Wykonaj swój pierwszy trening',    check:function(d){return d.workouts>=1},      max:1},
  {id:'w5',   cat:'start',   icon:'img:icons/achievements/achievement-warmup.png', name:'Rozgrzewka',            desc:'5 ukończonych treningów',          check:function(d){return d.workouts>=5},      max:5},
  {id:'w10',  cat:'start',   icon:'🔟', name:'Dziesiątka',            desc:'10 ukończonych treningów',         check:function(d){return d.workouts>=10},     max:10},
  {id:'w25',  cat:'start',   icon:'💥', name:'Ćwierć setki',          desc:'25 ukończonych treningów',         check:function(d){return d.workouts>=25},     max:25},
  {id:'w50',  cat:'start',   icon:'🔥', name:'Półsetka',              desc:'50 ukończonych treningów',         check:function(d){return d.workouts>=50},     max:50},
  {id:'w100', cat:'start',   icon:'💯', name:'Setka',                 desc:'100 ukończonych treningów',        check:function(d){return d.workouts>=100},    max:100},
  {id:'w250', cat:'start',   icon:'🚀', name:'Prawdziwy zawodnik',    desc:'250 ukończonych treningów',        check:function(d){return d.workouts>=250},    max:250},
  {id:'w500', cat:'start',   icon:'🏆', name:'Pięćsetka',             desc:'500 ukończonych treningów',        check:function(d){return d.workouts>=500},    max:500},
  {id:'w1000',cat:'start',   icon:'👑', name:'Legenda siłowni',       desc:'1000 ukończonych treningów',       check:function(d){return d.workouts>=1000},   max:1000},

  // 🔥 REGULARNOŚĆ
  {id:'s3',   cat:'streak',  icon:'🔥', name:'Trzy z rzędu',         desc:'Streak 3 dni treningowych',        check:function(d){return d.maxStreak>=3},     max:3},
  {id:'s7',   cat:'streak',  icon:'🗓', name:'Tydzień bez przerwy',   desc:'Streak 7 dni treningowych',        check:function(d){return d.maxStreak>=7},     max:7},
  {id:'s14',  cat:'streak',  icon:'💪', name:'Dwa tygodnie',          desc:'Streak 14 dni treningowych',       check:function(d){return d.maxStreak>=14},    max:14},
  {id:'s30',  cat:'streak',  icon:'📅', name:'Miesiąc determinacji',  desc:'Streak 30 dni treningowych',       check:function(d){return d.maxStreak>=30},    max:30},
  {id:'s60',  cat:'streak',  icon:'⚡', name:'Dwa miesiące',          desc:'Streak 60 dni treningowych',       check:function(d){return d.maxStreak>=60},    max:60},
  {id:'s100', cat:'streak',  icon:'💎', name:'100 dni z rzędu',       desc:'Streak 100 dni treningowych',      check:function(d){return d.maxStreak>=100},   max:100},

  // 🏋️ SIŁA
  {id:'b60',  cat:'strength',icon:'🏋️', name:'Bench 60 kg',          desc:'Wyciskanie sztangi 60 kg',         check:function(d){return d.bench>=60},        max:60},
  {id:'b80',  cat:'strength',icon:'💪', name:'Bench 80 kg',           desc:'Wyciskanie sztangi 80 kg',         check:function(d){return d.bench>=80},        max:80},
  {id:'b100', cat:'strength',icon:'🔥', name:'Bench 100 kg',          desc:'Wyciskanie sztangi 100 kg — setka!',check:function(d){return d.bench>=100},      max:100},
  {id:'b120', cat:'strength',icon:'👑', name:'Bench 120 kg',          desc:'Wyciskanie sztangi 120 kg — elita!',check:function(d){return d.bench>=120},      max:120},
  {id:'sq100',cat:'strength',icon:'🦵', name:'Squat 100 kg',          desc:'Przysiad ze sztangą 100 kg',       check:function(d){return d.squat>=100},       max:100},
  {id:'dl150',cat:'strength',icon:'💀', name:'Deadlift 150 kg',       desc:'Martwy ciąg 150 kg',               check:function(d){return d.deadlift>=150},    max:150},
  {id:'o60',  cat:'strength',icon:'🙌', name:'OHP 60 kg',             desc:'Wyciskanie żołnierskie 60 kg',     check:function(d){return d.ohp>=60},          max:60},

  // 📈 OBJĘTOŚĆ (tonaż)
  {id:'t10k', cat:'volume',  icon:'📦', name:'10 ton',                desc:'Łączny tonaż 10 000 kg',           check:function(d){return d.tonnage>=10000},   max:10000},
  {id:'t50k', cat:'volume',  icon:'🏗', name:'50 ton',                desc:'Łączny tonaż 50 000 kg',           check:function(d){return d.tonnage>=50000},   max:50000},
  {id:'t100k',cat:'volume',  icon:'🚛', name:'100 ton',               desc:'Łączny tonaż 100 000 kg',          check:function(d){return d.tonnage>=100000},  max:100000},
  {id:'t250k',cat:'volume',  icon:'🏭', name:'Ćwierć miliona',        desc:'Łączny tonaż 250 000 kg',          check:function(d){return d.tonnage>=250000},  max:250000},
  {id:'t500k',cat:'volume',  icon:'🌋', name:'Pół miliona',           desc:'Łączny tonaż 500 000 kg',          check:function(d){return d.tonnage>=500000},  max:500000},
  {id:'t1m',  cat:'volume',  icon:'🌍', name:'Milion kilogramów',     desc:'Łączny tonaż 1 000 000 kg',        check:function(d){return d.tonnage>=1000000}, max:1000000},

  // 💪 SERIE
  {id:'se100', cat:'sets',   icon:'1️⃣', name:'Pierwsze 100 serii',   desc:'Łącznie 100 serii treningowych',   check:function(d){return d.sets>=100},        max:100},
  {id:'se500', cat:'sets',   icon:'5️⃣', name:'500 serii',            desc:'Łącznie 500 serii treningowych',   check:function(d){return d.sets>=500},        max:500},
  {id:'se1k',  cat:'sets',   icon:'🔢', name:'1000 serii',            desc:'Łącznie 1000 serii treningowych',  check:function(d){return d.sets>=1000},       max:1000},
  {id:'se5k',  cat:'sets',   icon:'🌊', name:'5000 serii',            desc:'Łącznie 5000 serii treningowych',  check:function(d){return d.sets>=5000},       max:5000},

  // 🔁 POWTÓRZENIA
  {id:'r1k',  cat:'reps',    icon:'🔁', name:'Tysiąc powtórzeń',     desc:'Łącznie 1000 powtórzeń',           check:function(d){return d.reps>=1000},       max:1000},
  {id:'r5k',  cat:'reps',    icon:'🔄', name:'5000 powtórzeń',        desc:'Łącznie 5000 powtórzeń',           check:function(d){return d.reps>=5000},       max:5000},
  {id:'r10k', cat:'reps',    icon:'⚡', name:'10 000 powtórzeń',      desc:'Łącznie 10 000 powtórzeń',         check:function(d){return d.reps>=10000},      max:10000},
  {id:'r50k', cat:'reps',    icon:'🌟', name:'50 000 powtórzeń',      desc:'Łącznie 50 000 powtórzeń',         check:function(d){return d.reps>=50000},      max:50000},

  // ⏱ CZAS
  {id:'h10',  cat:'time',    icon:'⏰', name:'10 godzin',             desc:'10 godzin spędzonych na treningach', check:function(d){return d.hours>=10},      max:10},
  {id:'h50',  cat:'time',    icon:'⌚', name:'50 godzin',             desc:'50 godzin spędzonych na treningach', check:function(d){return d.hours>=50},      max:50},
  {id:'h100', cat:'time',    icon:'🕐', name:'100 godzin',            desc:'100 godzin spędzonych na treningach',check:function(d){return d.hours>=100},     max:100},
  {id:'h250', cat:'time',    icon:'🏅', name:'250 godzin',            desc:'250 godzin spędzonych na treningach',check:function(d){return d.hours>=250},     max:250},
  {id:'h500', cat:'time',    icon:'💫', name:'500 godzin',            desc:'500 godzin spędzonych na treningach',check:function(d){return d.hours>=500},     max:500},

  // 🦵 PARTIE
  {id:'m_legs',  cat:'muscle',icon:'🦵', name:'Dzień nóg',           desc:'Pierwszy trening nóg',              check:function(d){return d.muscleFirst['Nogi']},        max:1},
  {id:'m_back',  cat:'muscle',icon:'🔙', name:'Dzień pleców',        desc:'Pierwszy trening pleców',           check:function(d){return d.muscleFirst['Plecy']},       max:1},
  {id:'m_chest', cat:'muscle',icon:'💥', name:'Dzień klatki',        desc:'Pierwszy trening klatki',           check:function(d){return d.muscleFirst['Klatka']},      max:1},
  {id:'m_arms',  cat:'muscle',icon:'💪', name:'Dzień ramion',        desc:'Pierwszy trening bicepsa',          check:function(d){return d.muscleFirst['Biceps']},      max:1},
  {id:'m_sho',   cat:'muscle',icon:'🏋️', name:'Dzień barków',       desc:'Pierwszy trening barków',           check:function(d){return d.muscleFirst['Barki']},       max:1},
  {id:'m_abs',   cat:'muscle',icon:'🎯', name:'Dzień brzucha',       desc:'Pierwszy trening brzucha',          check:function(d){return d.muscleFirst['Brzuch']},      max:1},
  {id:'m_glut',  cat:'muscle',icon:'🍑', name:'Dzień pośladków',     desc:'Pierwszy trening pośladków',        check:function(d){return d.muscleFirst['Pośladki']},    max:1},
  {id:'m100legs',cat:'muscle',icon:'🏆', name:'100× nogi',           desc:'100 treningów z ćwiczeniami nóg',  check:function(d){return d.muscleCounts['Nogi']>=100},   max:100},
  {id:'m100back',cat:'muscle',icon:'🏆', name:'100× plecy',          desc:'100 treningów z ćwiczeniami pleców',check:function(d){return d.muscleCounts['Plecy']>=100},  max:100},
  {id:'m100che', cat:'muscle',icon:'🏆', name:'100× klatka',         desc:'100 treningów z ćwiczeniami klatki',check:function(d){return d.muscleCounts['Klatka']>=100}, max:100},

  // 🎯 CELE
  {id:'g1',   cat:'goals',   icon:'🎯', name:'Pierwszy cel',         desc:'Ukończ swój pierwszy cel treningowy', check:function(d){return d.goalsCompleted>=1},  max:1},
  {id:'g10',  cat:'goals',   icon:'🏹', name:'10 celów',             desc:'Ukończ 10 celów treningowych',       check:function(d){return d.goalsCompleted>=10}, max:10},
  {id:'g50',  cat:'goals',   icon:'🌟', name:'50 celów',             desc:'Ukończ 50 celów treningowych',       check:function(d){return d.goalsCompleted>=50}, max:50},

  // 🧬 GYMDNA
  {id:'dna1', cat:'gymdna',  icon:'🧬', name:'Pierwsza analiza',     desc:'Otwórz sekcję GymDNA po pierwszym treningu', check:function(d){return d.workouts>=1},          max:1},
  {id:'dna2', cat:'gymdna',  icon:'💯', name:'100% Consistency',     desc:'Osiągnij 100% Gym Consistency',              check:function(d){return d.consistency>=100},      max:100},
  {id:'dna3', cat:'gymdna',  icon:'🌿', name:'Elite Recovery',       desc:'Wszystkie partie mięśniowe wypoczęte (zmęczenie < 20%)', check:function(d){return d.avgFatigue<20&&d.workouts>0}, max:1},

  // ⭐ SEKRETNE
  {id:'sec1', cat:'secret',  icon:'🌙', name:'Nocny Marek',          desc:'Wykonaj trening po godzinie 23:00',  check:function(d){return d.lateNight},  max:1, secret:true},
  {id:'sec2', cat:'secret',  icon:'🌅', name:'Poranny Wojownik',     desc:'Wykonaj trening przed godziną 6:00', check:function(d){return d.earlyBird},  max:1, secret:true},
  {id:'sec3', cat:'secret',  icon:'⚡', name:'Bez odpoczynku',       desc:'Trening ze średnią przerwą poniżej 30 sekund', check:function(d){return d.shortRest}, max:1, secret:true},
  {id:'sec4', cat:'secret',  icon:'🏃', name:'Maratończyk',          desc:'Trening trwający ponad 2 godziny',   check:function(d){return d.marathon},   max:1, secret:true},
  {id:'sec5', cat:'secret',  icon:'🗓', name:'7 dni w tygodniu',     desc:'Trenuj przez 7 dni z rzędu',         check:function(d){return d.maxStreak>=7},max:7, secret:true},
  {id:'sec6', cat:'secret',  icon:'💤', name:'Poniedziałek nie gryzie', desc:'3 treningi w poniedziałek',        check:function(d){return d.mondayCount>=3}, max:3, secret:true},
];
