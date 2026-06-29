'use strict';

/**
 * Comportements du site (version statique pour GitHub Pages) :
 *  - menu de navigation sur mobile ;
 *  - année courante dans le pied de page ;
 *  - portrait : repli si la photo est absente ;
 *  - chargement et filtrage des documents depuis le fichier documents.json.
 *
 * Les données sont insérées via textContent / createElement (jamais innerHTML),
 * ce qui neutralise tout risque d'injection.
 */

(function () {
  // --- Menu mobile -------------------------------------------------------
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Année du pied de page --------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // --- Portrait : repli si la photo est absente -------------------------
  const portrait = document.querySelector('.portrait img');
  if (portrait) {
    portrait.addEventListener('error', () => {
      portrait.style.display = 'none';
    });
  }

  // --- Documents ---------------------------------------------------------
  const grid = document.getElementById('docs-grid');
  const filters = document.getElementById('doc-filters');
  if (!grid) return;

  const CATEGORY_LABELS = {
    'documents-personnels': 'Documents personnels',
    algorithmes: 'Algorithmes',
    'sujets-de-recherche': 'Sujets de recherche',
  };

  let allDocuments = [];
  let currentCategory = 'all';

  function buildCard(doc) {
    const card = document.createElement('article');
    card.className = 'doc-card';

    const cat = document.createElement('div');
    cat.className = 'doc-cat';
    cat.textContent = CATEGORY_LABELS[doc.category] || doc.category || '';

    const title = document.createElement('h3');
    title.textContent = doc.title || 'Document';

    const desc = document.createElement('p');
    desc.textContent = doc.description || '';

    const link = document.createElement('a');
    link.className = 'btn btn--ghost';
    // Le chemin du fichier est relatif au site (ex. "documents/cv.pdf").
    link.href = doc.file;
    link.setAttribute('rel', 'noopener');
    link.setAttribute('download', '');
    link.textContent = 'Télécharger';

    card.append(cat, title, desc, link);
    return card;
  }

  function render() {
    const list =
      currentCategory === 'all'
        ? allDocuments
        : allDocuments.filter((d) => d.category === currentCategory);

    grid.textContent = '';
    if (list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'doc-empty';
      empty.textContent = 'Aucun document disponible dans cette catégorie pour le moment.';
      grid.appendChild(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    list.forEach((doc) => fragment.appendChild(buildCard(doc)));
    grid.appendChild(fragment);
  }

  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.doc-filter');
      if (!btn) return;
      currentCategory = btn.dataset.cat;
      filters.querySelectorAll('.doc-filter').forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      render();
    });
  }

  fetch('documents.json', { headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      allDocuments = Array.isArray(data.documents) ? data.documents : [];
      render();
    })
    .catch(() => {
      grid.textContent = '';
      const err = document.createElement('p');
      err.className = 'doc-empty';
      err.textContent = 'Les documents ne sont pas disponibles pour le moment.';
      grid.appendChild(err);
    });
})();
