// ===================== DB.JS =====================
// IndexedDB wrapper + uid helper

const DB_NAME='GymFlowDB',DB_VER=4;let db;

function initDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>{const d=e.target.result;['plans','workouts','exercises','weights','measurements','goals','settings','timeline','cardio'].forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:'id'})})};r.onsuccess=e=>{db=e.target.result;res(db)};r.onerror=e=>rej(e)})}

function dbGet(s,id){return new Promise((res,rej)=>{const tx=db.transaction(s,'readonly');const r=id?tx.objectStore(s).get(id):tx.objectStore(s).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}

function dbPut(s,obj){return new Promise((res,rej)=>{const tx=db.transaction(s,'readwrite');const r=tx.objectStore(s).put(obj);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}

