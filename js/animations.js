// ===================== ANIMATIONS.JS =====================
// GymFlow — Premium UI/UX micro-interactions & animation helpers
// Nie zmienia logiki danych — tylko warstwa wizualna

// ── Core helpers ──

function animatePop(el) {
  if (!el) return;
  el.classList.remove('gf-pop');
  void el.offsetWidth; // reflow
  el.classList.add('gf-pop');
  el.addEventListener('animationend', function() {
    el.classList.remove('gf-pop');
  }, { once: true });
}

function animateFadeUp(el) {
  if (!el) return;
  el.classList.remove('gf-fade-up');
  void el.offsetWidth;
  el.classList.add('gf-fade-up');
  el.addEventListener('animationend', function() {
    el.classList.remove('gf-fade-up');
  }, { once: true });
}

function animateShake(el) {
  if (!el) return;
  el.classList.remove('gf-shake');
  void el.offsetWidth;
  el.classList.add('gf-shake');
  el.addEventListener('animationend', function() {
    el.classList.remove('gf-shake');
  }, { once: true });
}

function animateGlow(el, color) {
  if (!el) return;
  var cls = color === 'gold' ? 'gf-glow-gold' : 'gf-pr-glow';
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', function() {
    el.classList.remove(cls);
  }, { once: true });
}

function animateSlideIn(el) {
  if (!el) return;
  el.classList.remove('gf-slide-in');
  void el.offsetWidth;
  el.classList.add('gf-slide-in');
  el.addEventListener('animationend', function() {
    el.classList.remove('gf-slide-in');
  }, { once: true });
}

// ── CountUp ──
function countUp(el, target, duration, suffix) {
  if (!el) return;
  suffix = suffix || '';
  duration = duration || 800;
  var start = 0;
  var startTime = null;
  var isFloat = target % 1 !== 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    var ease = 1 - Math.pow(1 - progress, 3);
    var current = start + (target - start) * ease;
    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      el.classList.add('gf-count-pulse');
      el.addEventListener('animationend', function() {
        el.classList.remove('gf-count-pulse');
      }, { once: true });
    }
  }
  requestAnimationFrame(step);
}

// ── Ripple effect on tap ──
function addRipple(el) {
  if (!el) return;
  el.classList.add('gf-ripple-wrap');
  el.addEventListener('click', function(e) {
    var ripple = document.createElement('span');
    ripple.className = 'gf-ripple';
    var rect = el.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', function() {
      ripple.remove();
    });
  });
}

// ── Global button press feedback ──
function initButtonFeedback() {
  document.addEventListener('touchstart', function(e) {
    var btn = e.target.closest('.btn, .hero-btn, .tab-btn, .prog-tab, .mm-tile');
    if (!btn) return;
    btn.style.transform = 'scale(.95)';
    btn.style.opacity   = '.85';
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var btn = e.target.closest('.btn, .hero-btn, .tab-btn, .prog-tab, .mm-tile');
    if (!btn) return;
    setTimeout(function() {
      btn.style.transform = '';
      btn.style.opacity   = '';
    }, 150);
  }, { passive: true });
}

// ── Streak animation ──
function animateStreak(streakEl) {
  if (!streakEl) return;
  animateShake(streakEl);
  animateGlow(streakEl, 'accent');
  if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
}

// ── PR Record animation ──
function animatePR(prEl) {
  if (!prEl) return;
  animatePop(prEl);
  animateGlow(prEl, 'accent');
  if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
}

// ── Achievement unlock animation ──
function animateAchievementBadge(iconEl) {
  if (!iconEl) return;
  iconEl.classList.remove('gf-badge-pop');
  void iconEl.offsetWidth;
  iconEl.classList.add('gf-badge-pop');
  animateGlow(iconEl.closest('.ach-icon-wrap') || iconEl, 'gold');
  if (navigator.vibrate) navigator.vibrate([100, 50, 200, 50, 300]);
}

// ── Tab switch animation ──
function animateTabSwitch(viewEl) {
  if (!viewEl) return;
  viewEl.style.opacity = '0';
  viewEl.style.transform = 'translateY(8px)';
  requestAnimationFrame(function() {
    viewEl.style.transition = 'opacity .25s ease, transform .25s ease';
    viewEl.style.opacity = '1';
    viewEl.style.transform = 'translateY(0)';
    setTimeout(function() {
      viewEl.style.transition = '';
    }, 300);
  });
}

// ── Workout result screen ──
function animateWorkoutResult(containerEl) {
  if (!containerEl) return;
  var cards = containerEl.querySelectorAll('.stat-card, .card');
  cards.forEach(function(card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';
    setTimeout(function() {
      card.style.transition = 'opacity .4s ease, transform .4s cubic-bezier(.34,1.56,.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 100);
  });
}

// ── Notification toast animation ──
var _origShowNotif = null;
function upgradeShowNotif() {
  if (typeof showNotif !== 'function') return;
  _origShowNotif = showNotif;
  window.showNotif = function(icon, title, msg) {
    _origShowNotif(icon, title, msg);
    var bar = document.getElementById('notif-bar');
    if (bar) {
      bar.classList.remove('show');
      void bar.offsetWidth;
      bar.classList.add('show');
    }
  };
}

// ── Init all animations ──
function initAnimations() {
  initButtonFeedback();
  upgradeShowNotif();

  // Add ripple to primary buttons
  document.querySelectorAll('.btn-primary, .hero-btn').forEach(addRipple);

  // Animate cards on dashboard load
  document.querySelectorAll('.dashboard-card').forEach(function(card, i) {
    card.style.animationDelay = (i * 0.06) + 's';
    card.classList.add('gf-fade-up');
  });
}

// ── Hook into existing functions ──

// Patch showTab to animate view transitions
var _origShowTab = null;
function patchShowTab() {
  if (typeof showTab !== 'function') return;
  _origShowTab = showTab;
  window.showTab = function(tab) {
    _origShowTab(tab);
    var view = document.getElementById('view-' + tab);
    if (view) animateTabSwitch(view);
  };
}

// Patch finalizeWorkout to animate result
var _origFinalizeWorkout = null;
function patchFinalizeWorkout() {
  if (typeof finalizeWorkout !== 'function') return;
  _origFinalizeWorkout = finalizeWorkout;
  window.finalizeWorkout = async function() {
    await _origFinalizeWorkout();
    // Animate dashboard stats after workout saved
    setTimeout(function() {
      var stats = document.querySelectorAll('.stat-card, .hero-stat');
      stats.forEach(function(el) { animatePop(el); });
    }, 400);
  };
}

// Patch showPRCelebration to add glow
var _origShowPR = null;
function patchShowPR() {
  if (typeof showPRCelebration !== 'function') return;
  _origShowPR = showPRCelebration;
  window.showPRCelebration = function(name, weight, reps) {
    _origShowPR(name, weight, reps);
    var cel = document.getElementById('pr-celebration');
    if (cel) {
      animatePop(cel);
      animateGlow(cel, 'accent');
    }
  };
}

// Patch processAchUnlockQueue to animate icon
var _origProcessAch = null;
function patchAchievements() {
  if (typeof processAchUnlockQueue !== 'function') return;
  _origProcessAch = processAchUnlockQueue;
  window.processAchUnlockQueue = function() {
    _origProcessAch();
    setTimeout(function() {
      var icon = document.getElementById('ach-cel-icon');
      if (icon) animateAchievementBadge(icon);
    }, 50);
  };
}

// Run all patches after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initAnimations();
  // Patch after init() runs (functions defined)
  setTimeout(function() {
    patchShowTab();
    patchFinalizeWorkout();
    patchShowPR();
    patchAchievements();
  }, 500);
});
