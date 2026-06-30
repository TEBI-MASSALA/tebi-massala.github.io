'use strict';

/**
 * Aperçu de test — animation du hero : pluie de bits (0/1), formules
 * mathématiques (cryptographie + IA) qui dérivent, et réseau de neurones
 * discret. Dessiné par-dessus le dégradé animé (gradient.js).
 * Inclut aussi l'effet machine à écrire de la tagline.
 * Léger (canvas 2D), respecte prefers-reduced-motion, pause hors écran.
 */

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- Machine à écrire */
  var typeEl = document.getElementById('typewriter');
  var PHRASES = [
    'Cryptographie & intelligence artificielle',
    'Conception et analyse de S-boxes',
    'Cryptanalyse symétrique',
    'Apprentissage profond au service de la cryptographie',
  ];
  if (typeEl) {
    if (reduce) {
      typeEl.textContent = PHRASES[0];
    } else {
      var pi = 0, ci = 0, del = false;
      var tick = function () {
        var p = PHRASES[pi];
        ci += del ? -1 : 1;
        typeEl.textContent = p.slice(0, ci);
        var d = del ? 35 : 65;
        if (!del && ci === p.length) { d = 1800; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % PHRASES.length; d = 350; }
        window.setTimeout(tick, d);
      };
      window.setTimeout(tick, 600);
    }
  }

  /* ---------------------------------------------------------------- Canvas */
  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cols = [], nodes = [], forms = [], t = 0, raf = null, running = false;

  // Formules cryptographie + IA (filigrane).
  var FORMULAS = [
    'S(x) = Σ aᵤ xᵘ',
    'NL(f) = 2ⁿ⁻¹ − ½·max|W_f(a)|',
    'W_f(a) = Σ (−1)^(a·x ⊕ f(x))',
    'δ_F = max_{a≠0,b} |{x : F(x⊕a) ⊕ F(x) = b}|',
    'F : 𝔽₂ⁿ → 𝔽₂ⁿ',
    'APN ⇔ δ_F = 2',
    'E_k ∘ A = B ∘ E_k',
    'x ↦ x^(2ᵏ+1)',
    'σ(Wx + b)',
    '∇_θ L(θ)',
    'P(A → B) = Pr[E(A(x)) = B(E(x))]',
    'Tr(x) = x + x² + … + x^(2ⁿ⁻¹)',
    'H(X) = −Σ p·log₂ p',
    'AES · Midori · S-box',
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Colonnes de bits 0/1.
    cols = [];
    for (var x = 10; x < W; x += 22) {
      cols.push({ x: x, y: Math.random() * H, speed: rand(0.7, 1.8), gap: rand(14, 20) });
    }
    // Nœuds (réseau de neurones discret).
    var n = Math.max(8, Math.min(18, Math.floor(W / 90)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25), r: rand(1.4, 2.8), ph: Math.random() * Math.PI * 2 });
    }
    // Formules dérivantes.
    forms = [];
    var count = Math.max(4, Math.min(9, Math.floor(W / 220)));
    for (var k = 0; k < count; k++) {
      forms.push({
        text: FORMULAS[(Math.random() * FORMULAS.length) | 0],
        x: Math.random() * W, y: rand(40, H - 20),
        vx: rand(-0.18, -0.05), size: rand(13, 19), alpha: rand(0.06, 0.14),
      });
    }
  }

  function drawBits() {
    ctx.font = '14px ' + 'monospace';
    ctx.textAlign = 'center';
    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      var bit = Math.random() < 0.5 ? '0' : '1';
      // tête plus lumineuse, traînée plus faible
      ctx.fillStyle = 'rgba(150, 235, 190, 0.55)';
      ctx.fillText(bit, c.x, c.y);
      ctx.fillStyle = 'rgba(120, 200, 255, 0.12)';
      ctx.fillText(Math.random() < 0.5 ? '0' : '1', c.x, c.y - c.gap);
      c.y += c.speed;
      if (c.y > H + 16) { c.y = -16; c.speed = rand(0.7, 1.8); }
    }
  }

  function drawFormulas() {
    ctx.textAlign = 'left';
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      ctx.font = f.size + 'px ' + 'monospace';
      ctx.fillStyle = 'rgba(200, 235, 255, ' + f.alpha + ')';
      ctx.fillText(f.text, f.x, f.y);
      f.x += f.vx;
      if (f.x < -ctx.measureText(f.text).width - 20) {
        f.x = W + 20; f.y = rand(40, H - 20);
        f.text = FORMULAS[(Math.random() * FORMULAS.length) | 0];
        f.alpha = rand(0.06, 0.14);
      }
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
        var dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.strokeStyle = 'rgba(180, 230, 255, ' + (1 - d / 150) * 0.16 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var nd = nodes[k];
      var pulse = 0.5 + 0.5 * Math.sin(t * 2 + nd.ph);
      ctx.fillStyle = 'rgba(95, 206, 146, ' + (0.3 + 0.4 * pulse) + ')';
      ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r + pulse * 0.7, 0, Math.PI * 2); ctx.fill();
    }
  }

  function frameOnce() {
    ctx.clearRect(0, 0, W, H);
    drawNetwork();
    drawFormulas();
    drawBits();
  }
  function loop() { frameOnce(); raf = window.requestAnimationFrame(loop); }
  function start() { if (!running) { running = true; loop(); } }
  function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); }

  resize();
  window.addEventListener('resize', resize);

  if (reduce) { frameOnce(); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 }).observe(canvas);
  } else { start(); }
})();
