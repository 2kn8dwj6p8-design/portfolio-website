(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */

  var themeListeners = [];

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function currentTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeSet === theme));
    });

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var next = theme === 'dark' ? 'Light' : 'Dark';
      btn.textContent = next;
      btn.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
    });

    themeListeners.forEach(function (fn) { fn(theme); });
  }

  function setTheme(theme) {
    try { localStorage.setItem('theme', theme); } catch (e) {}
    applyTheme(theme);
  }

  document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
    btn.addEventListener('click', function () { setTheme(btn.dataset.themeSet); });
  });

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  // Follow the system setting until the visitor picks a theme themselves
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var saved = storedTheme();
    if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'dark' : 'light');
  });

  // Sync button states with the theme set by the inline script in <head>
  applyTheme(currentTheme());

  /* ---------- Turntable ---------- */

  var FRAMES = [];
  for (var i = 0; i <= 18; i++) FRAMES.push(String(i * 5).padStart(2, '0'));
  var LAST = FRAMES.length - 1;
  var IDLE_DELAY = 2500;  // ms after interaction before auto-rotate resumes
  var AUTO_SPEED = 0.0035; // frames per ms

  function frameSrc(theme, frame) {
    return 'img/turntable/' + theme + '/' + frame + '.png';
  }

  function initTurntable(el) {
    var stage = el.querySelector('.turntable__stage');
    var status = el.querySelector('.turntable__status');
    var marker = el.querySelector('.turntable__marker');
    var angle = el.querySelector('.turntable__angle');

    var imgs = FRAMES.map(function () {
      var img = document.createElement('img');
      img.alt = '';
      img.draggable = false;
      stage.insertBefore(img, status);
      return img;
    });

    var pos = LAST / 2;
    var shown = -1;
    var drag = null;
    var lastInteraction = 0;
    var direction = 1;
    var loadId = 0;

    function render() {
      var index = Math.round(pos);
      if (index !== shown) {
        if (shown >= 0) imgs[shown].classList.remove('is-active');
        imgs[index].classList.add('is-active');
        shown = index;
        angle.textContent = FRAMES[index] + '°';
        stage.setAttribute('aria-valuenow', String(index * 5));
        stage.setAttribute('aria-valuetext', FRAMES[index] + '°');
      }
      marker.style.left = (pos / LAST) * 100 + '%';
    }

    // Preload a full set, swapping each frame in once it is ready so the
    // current image never goes blank when the theme changes.
    function load(theme) {
      var id = ++loadId;
      var loaded = 0;
      status.hidden = false;
      status.textContent = 'Loading 0/' + FRAMES.length;

      FRAMES.forEach(function (frame, index) {
        var src = frameSrc(theme, frame);
        var pre = new Image();
        pre.onload = pre.onerror = function () {
          if (id !== loadId) return;
          imgs[index].src = src;
          loaded++;
          status.textContent = 'Loading ' + loaded + '/' + FRAMES.length;
          if (loaded === FRAMES.length) status.hidden = true;
        };
        pre.src = src;
      });
    }

    stage.addEventListener('pointerdown', function (e) {
      stage.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, start: pos };
    });

    stage.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var delta = ((e.clientX - drag.x) / stage.offsetWidth) * LAST * 1.4;
      pos = Math.max(0, Math.min(LAST, drag.start - delta));
      lastInteraction = performance.now();
      render();
    });

    function endDrag() {
      drag = null;
      lastInteraction = performance.now();
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    stage.addEventListener('keydown', function (e) {
      var step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
      if (e.key === 'Home') pos = 0;
      else if (e.key === 'End') pos = LAST;
      else if (step) pos = Math.max(0, Math.min(LAST, Math.round(pos) + step));
      else return;
      e.preventDefault();
      lastInteraction = performance.now();
      render();
    });

    if (!reducedMotion) {
      var prev = performance.now();
      var tick = function (now) {
        var dt = now - prev;
        prev = now;
        if (!drag && now - lastInteraction > IDLE_DELAY) {
          pos += direction * dt * AUTO_SPEED;
          if (pos >= LAST) { pos = LAST; direction = -1; }
          if (pos <= 0) { pos = 0; direction = 1; }
          render();
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    themeListeners.push(load);
    render();
    load(currentTheme());
  }

  document.querySelectorAll('[data-turntable]').forEach(initTurntable);

  /* ---------- Manifesto ---------- */

  document.querySelectorAll('[data-manifesto-toggle]').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close manifesto —' : 'Read the full manifesto +';
      panel.hidden = !open;
    });
  });
})();
