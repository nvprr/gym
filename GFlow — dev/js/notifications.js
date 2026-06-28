// ===================== NOTIFICATIONS.JS =====================

function toggleNotifications(el){
  el.classList.toggle('on');
  const on=el.classList.contains('on');
  state.settings.notificationsEnabled=on;
  document.getElementById('notif-freq-row').style.display=on?'flex':'none';
  document.getElementById('notif-hour-row').style.display=on?'flex':'none';
  if(on)scheduleNotification();
  saveSettings();
}

function saveNotifSettings(){
  state.settings.notifFreq=parseInt(document.getElementById('notif-freq').value)||2;
  state.settings.notifHour=document.getElementById('notif-hour').value||'09:00';
  document.getElementById('notif-setting-sub').textContent=`Co ${state.settings.notifFreq===1?'dzień':state.settings.notifFreq+' dni'} · ${state.settings.notifHour}`;
  scheduleNotification();
  saveSettings();
}

function loadNotifSettings(){
  const s=state.settings;
  if(s.notificationsEnabled){
    document.getElementById('notif-toggle').classList.add('on');
    document.getElementById('notif-freq-row').style.display='flex';
    document.getElementById('notif-hour-row').style.display='flex';
  }
  if(s.notifFreq)document.getElementById('notif-freq').value=s.notifFreq;
  if(s.notifHour)document.getElementById('notif-hour').value=s.notifHour;
  document.getElementById('notif-setting-sub').textContent=`Co ${s.notifFreq===1?'dzień':(s.notifFreq||2)+' dni'} · ${s.notifHour||'09:00'}`;
  // Water reminder settings (loaded from hydration.js)
  if (typeof loadWaterNotifSettings === 'function') loadWaterNotifSettings();
}

function scheduleNotification(){
  if(!('Notification' in window))return;
  if(Notification.permission==='default'){
    Notification.requestPermission().then(p=>{if(p==='granted')doScheduleNotif()});
  } else if(Notification.permission==='granted'){doScheduleNotif();}
}

function doScheduleNotif(){
  // Use setTimeout for demo — in real PWA would use ServiceWorker push
  const freq=(state.settings.notifFreq||2)*86400000;
  const [h,m]=(state.settings.notifHour||'09:00').split(':').map(Number);
  const now=new Date();
  let next=new Date();next.setHours(h,m,0,0);
  if(next<=now)next.setDate(next.getDate()+(state.settings.notifFreq||2));
  const delay=next.getTime()-now.getTime();
  clearTimeout(window._notifTimeout);
  window._notifTimeout=setTimeout(()=>{
    if(Notification.permission==='granted'){
      new Notification('GymFlow 💪',{body:'Czas na trening!',icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>'});
    }
    if(state.settings.notificationsEnabled)doScheduleNotif();
  },delay);
}

