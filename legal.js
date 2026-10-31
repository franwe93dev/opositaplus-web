/* ============================================================
   OpositaPlus · Comportamiento compartido de las páginas legales
   Tema claro/oscuro, borde de la barra al hacer scroll y
   aparición escalonada de los bloques.
   ============================================================ */

(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* --- Tema: sigue al sistema salvo que el usuario elija --- */
  try {
    var saved = localStorage.getItem('op-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var current = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('op-theme', next); } catch (e) {}
    });
  }

  /* --- Borde de la barra al hacer scroll --- */
  var topbar = document.getElementById('topbar');
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Test de muestra de las páginas de oposición --- */
  Array.prototype.slice.call(document.querySelectorAll('.quiz-q')).forEach(function (q) {
    var options = Array.prototype.slice.call(q.querySelectorAll('.quiz-opt'));
    var verdict = q.querySelector('.quiz-verdict');
    var solution = q.querySelector('.quiz-sol');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var right = option.hasAttribute('data-ok');
        options.forEach(function (o) {
          o.disabled = true;
          if (o.hasAttribute('data-ok')) o.classList.add('is-right');
        });
        if (!right) option.classList.add('is-wrong');
        if (verdict) {
          verdict.textContent = right ? '¡Correcto!' : 'Incorrecto';
          verdict.className = 'quiz-verdict ' + (right ? 'is-right' : 'is-wrong');
        }
        if (solution) solution.open = true;
      });
    });
  });

  /* --- Aparición escalonada --- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var showAll = function () {
    items.forEach(function (el) { el.classList.add('is-in'); });
  };

  if (!('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(entry.target.parentNode.children)
          .filter(function (n) { return n.classList && n.classList.contains('reveal'); });
        var index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.setProperty('--d', Math.min(index, 6) * 0.06 + 's');
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    items.forEach(function (el) { observer.observe(el); });
    setTimeout(showAll, 2500);
  }
})();
