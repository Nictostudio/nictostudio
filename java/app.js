const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const thumbs = Array.from(document.querySelectorAll('.thumb'));

const items = thumbs.map((btn, i) => ({
  thumb: btn.dataset.thumb || '',
  full: btn.dataset.full || '',
  alt: btn.dataset.alt || btn.querySelector('img')?.alt || `Imagen ${i + 1}`
}));

let currentIndex = 0;

function openModal(index) {
  if (!items.length) return;

  currentIndex = (index + items.length) % items.length;

  // (Opcional) placeholder rápido con miniatura mientras carga la grande:
  // modalImg.src = items[currentIndex].thumb;

  modalImg.src = items[currentIndex].full;
  modalImg.alt = items[currentIndex].alt;

  modal.setAttribute('aria-hidden', 'false');
  modalClose.focus();
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
  modalImg.alt = '';
}

function next() { openModal(currentIndex + 1); }
function prev() { openModal(currentIndex - 1); }

// Abrir al click en miniatura
thumbs.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.index ?? 0);
    openModal(idx);
  });
});

// Cerrar
modalClose.addEventListener('click', closeModal);

// Cerrar si haces click en el fondo (overlay)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Teclado
document.addEventListener('keydown', (e) => {
  const isOpen = modal.getAttribute('aria-hidden') === 'false';
  if (!isOpen) return;

  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Swipe (móvil)
let startX = 0;
let startY = 0;
let isTouching = false;

modal.addEventListener('touchstart', (e) => {
  if (modal.getAttribute('aria-hidden') !== 'false') return;
  const t = e.changedTouches[0];
  startX = t.clientX;
  startY = t.clientY;
  isTouching = true;
}, { passive: true });

modal.addEventListener('touchend', (e) => {
  if (!isTouching) return;
  isTouching = false;

  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < 45) return;
  if (absDy > 60) return;

  if (dx < 0) next();
  else prev();
});
btnPrev?.addEventListener('click', prev);
btnNext?.addEventListener('click', next);




