'use strict';

/**
 * Animation de la section d'accueil : arrière-plan « cryptographie + IA »
 * (colonnes de symboles hexadécimaux qui tombent + réseau de neurones qui
 * pulse) et effet machine à écrire sur la tagline.
 *
 * - Purement décoratif (canvas masqué aux lecteurs d'écran).
 * - Discret : opacités réduites, palette du site (cuivre / blanc sur navy).
 * - Respecte « prefers-reduced-motion » et se met en pause hors écran.
 */

(function () {
  // ---------------------------------------------------------------- Typewriter
  var typeEl = document.getElementById('typewriter');
  var PHRASES = [
    'Cryptographie & intelligence artificielle',
    'Conception et analyse de S-boxes',
    'Cryptanalyse symétrique',
    'Apprentissage profond au service de la cryptographie',
  ];
  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeEl) {
    if (reduceMotion) {
      typeEl.textContent = PHRASES[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      var tick = function () {
        var phrase = PHRASES[pi];
        ci += deleting ? -1 : 1;
        typeEl.textContent = phrase.slice(0, ci);
        var delay = deleting ? 35 : 65;
        if (!deleting && ci === phrase.length) {
          delay = 1800; deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false; pi = (pi + 1) % PHRASES.length; delay = 350;
        }
        window.setTimeout(tick, delay);
      };
      window.setTimeout(tick, 600);
    }
  }

  // ------------------------------------------------------------- Canvas / fond
  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, columns = [], nodes = [], t = 0, raf = null, running = false;
  var GLYPHS = '0123456789ABCDEF⊕'; // hexadécimal + symbole XOR

  function resize() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var step = 24;
    columns = [];
    for (var x = 8; x < W; x += step) {
      columns.push({ x: x, y: Math.random() * H, speed: 0.6 + Math.random() * 1.1 });
    }
    var n = Math.max(10, Math.min(22, Math.floor(W / 70)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: 1.6 + Math.random() * 1.6, ph: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawColumns() {
    ctx.font = '15px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(120, 220, 170, 0.18)'; // vert clair, très discret
    for (var i = 0; i < columns.length; i++) {
      var c = columns[i];
      ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], c.x, c.y);
      c.y += c.speed;
      if (c.y > H + 18) { c.y = -18; c.speed = 0.6 + Math.random() * 1.1; }
    }
  }

  function drawNetwork() {
    t += 0.016;
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.strokeStyle = 'rgba(234, 240, 247, ' + (1 - d / 150) * 0.18 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var nd = nodes[k];
      var pulse = 0.5 + 0.5 * Math.sin(t * 2 + nd.ph);
      ctx.fillStyle = 'rgba(90, 210, 150, ' + (0.35 + 0.45 * pulse) + ')';
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r + pulse * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawColumns();
    drawNetwork();
    raf = window.requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; frame(); } }
  function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    // Un seul rendu statique (pas d'animation).
    ctx.clearRect(0, 0, W, H);
    drawNetwork();
    return;
  }

  // Met l'animation en pause quand l'accueil n'est pas visible (performances).
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 });
    io.observe(canvas);
  } else {
    start();
  }
})();
