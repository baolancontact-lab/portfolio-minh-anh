const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const motionTargets = document.querySelectorAll([
  '.reveal',
  '.degree-card',
  '.credential',
  '.project-highlights li',
  '.experience-tasks li',
  '.contact-links > *'
].join(','));

motionTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
  observer.observe(element);
});

const progress = document.querySelector('.scroll-progress span');
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.body.classList.add('has-pointer');
  window.addEventListener('pointermove', event => {
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  }, { passive: true });
}

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

const buildProjectDeck = () => {
  const deck = document.getElementById('project-deck');
  if (!deck || deck.childElementCount) return;
  const total = Number(deck.dataset.total);
  const fragment = document.createDocumentFragment();
  for (let page = 1; page <= total; page += 1) {
    const number = String(page).padStart(2, '0');
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');
    image.src = `assets/case-study/vinamilk/page-${number}.webp`;
    image.alt = `Slide ${page} của dự án Vinamilk Sữa Hạt Cà Phê`;
    image.loading = 'lazy';
    image.decoding = 'async';
    caption.textContent = `SLIDE ${number} / ${total}`;
    figure.append(image, caption);
    fragment.appendChild(figure);
  }
  deck.appendChild(fragment);
};

document.querySelectorAll('[data-modal]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modal = document.getElementById(trigger.dataset.modal);
    if (modal.id === 'project-modal') buildProjectDeck();
    modal.showModal();
    document.body.classList.add('modal-open');
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  const close = () => {
    modal.close();
    document.body.classList.remove('modal-open');
  };
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.addEventListener('click', event => {
    const box = modal.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (outside) close();
  });
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
});

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Portfolio inquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`);
  document.querySelector('.form-status').textContent = 'Đang mở ứng dụng email của bạn…';
  window.location.href = `mailto:Phamminhanhnt@gmail.com?subject=${subject}&body=${body}`;
});
