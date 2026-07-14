const hero = document.querySelector('.hero');
const trail = document.querySelector('.hero-trail');
const nav = document.querySelector('.site-nav');
const aboutText = document.querySelector('.about-text');
const trailSources = [
  'public/assets/images/cursor-1.png',
  'public/assets/images/cursor-2.png',
  'public/assets/images/cursor-3.png',
  'https://framerusercontent.com/images/CUB8IgvxS7sncAA39ccD0E7WQs.png?width=512&height=768'
];

let lastPoint = null;
let pieceIndex = 0;
let heroActive = true;

requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('page-ready')));

const aboutParagraph = aboutText?.querySelector('p');
const aboutCharacters = [];
if (aboutParagraph) {
  const characters = [...aboutParagraph.textContent];
  aboutParagraph.replaceChildren();
  characters.forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.className = 'about-character';
    characterSpan.textContent = character;
    aboutParagraph.append(characterSpan);
    aboutCharacters.push(characterSpan);
  });
}

const placeTrailPiece = (event) => {
  if (!heroActive || !lastPoint) return;
  const distance = Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y);
  if (distance < 38) return;
  lastPoint = { x: event.clientX, y: event.clientY };
  const bounds = hero.getBoundingClientRect();
  const image = document.createElement('img');
  image.className = 'trail-piece';
  image.src = trailSources[pieceIndex++ % trailSources.length];
  image.style.left = `${event.clientX - bounds.left}px`;
  image.style.top = `${event.clientY - bounds.top}px`;
  image.style.setProperty('--r', `${(Math.random() * 24 - 12).toFixed(1)}deg`);
  image.style.setProperty('--offset-x', `${(Math.random() * 28 - 14).toFixed(1)}px`);
  image.style.setProperty('--offset-y', `${(Math.random() * 28 - 14).toFixed(1)}px`);
  image.style.setProperty('--drift-x', `${(Math.random() * 34 - 17).toFixed(1)}px`);
  image.style.setProperty('--drift-y', `${(Math.random() * 26 - 13).toFixed(1)}px`);
  image.addEventListener('animationend', (event) => { if (event.animationName === 'trail-out') image.remove(); });
  trail.append(image);
};

hero.addEventListener('pointerenter', (event) => { heroActive = true; lastPoint = { x:event.clientX, y:event.clientY }; });
hero.addEventListener('pointermove', placeTrailPiece);
hero.addEventListener('pointerleave', () => { heroActive = false; lastPoint = null; });

let pointerY = Number.POSITIVE_INFINITY;
let navigationRequested = false;
const updateNavigation = () => {
  const pastHero = window.scrollY > hero.offsetHeight - 100;
  nav.classList.toggle('is-hidden', pastHero && !navigationRequested);
};
window.addEventListener('mousemove', (event) => {
  pointerY = event.clientY;
  if (window.scrollY > hero.offsetHeight - 100) navigationRequested = pointerY <= 112;
  updateNavigation();
}, { passive: true });
window.addEventListener('scroll', () => {
  if (window.scrollY > hero.offsetHeight - 100) navigationRequested = false;
  updateNavigation();
}, { passive: true });

const modal = document.querySelector('.image-modal');
const modalImage = modal.querySelector('img');
const openPreview = (image) => {
  modalImage.src = image.currentSrc || image.src;
  modalImage.alt = image.alt;
  if (!modal.open) modal.showModal();
};
document.querySelector('.shirt').addEventListener('click', () => openPreview(document.querySelector('.shirt img')));
document.querySelectorAll('.works .work-art').forEach((art) => {
  const image = art.querySelector('img');
  if (!image) return;
  art.tabIndex = 0;
  art.setAttribute('role', 'button');
  art.setAttribute('aria-label', `Open ${image.alt} preview`);
  art.addEventListener('click', () => openPreview(image));
  art.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPreview(image);
    }
  });
});
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

const aboutAside = document.querySelector('.about-aside');
const clamp = (value) => Math.min(1, Math.max(0, value));
let aboutFrame = null;
const updateAboutOnScroll = () => {
  aboutFrame = null;
  if (!aboutText || !aboutAside) return;
  const textRect = aboutText.getBoundingClientRect();
  const guyRect = aboutAside.getBoundingClientRect();
  const textProgress = clamp((window.innerHeight - textRect.top) / (window.innerHeight + textRect.height));
  const characterCount = Math.max(aboutCharacters.length - 1, 1);
  aboutCharacters.forEach((character, index) => {
    const start = (index / characterCount) * .72;
    const end = start + .28;
    const progress = clamp((textProgress - start) / (end - start));
    const ink = Math.round(102 + (153 * progress));
    character.style.color = `rgb(${ink}, ${ink}, ${ink})`;
  });
  const guyProgress = clamp((window.innerHeight * .22 - guyRect.top) / (guyRect.height * .8));
  aboutAside.style.setProperty('--guy-opacity', `${1 - guyProgress}`);
  aboutAside.style.setProperty('--guy-y', `${-16 * guyProgress}px`);
};
const scheduleAboutUpdate = () => {
  if (aboutFrame === null) aboutFrame = requestAnimationFrame(updateAboutOnScroll);
};
window.addEventListener('scroll', scheduleAboutUpdate, { passive:true });
window.addEventListener('resize', scheduleAboutUpdate, { passive:true });
scheduleAboutUpdate();

document.querySelectorAll('.logos img').forEach((logo) => {
  const resetLogo = () => {
    logo.style.setProperty('--logo-x', '0px');
    logo.style.setProperty('--logo-y', '0px');
    logo.style.setProperty('--logo-r', '0deg');
    logo.style.setProperty('--logo-scale', '1');
  };
  logo.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = logo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    logo.style.setProperty('--logo-x', `${(x * 10).toFixed(1)}px`);
    logo.style.setProperty('--logo-y', `${(y * 10).toFixed(1)}px`);
    logo.style.setProperty('--logo-r', `${(x * 3).toFixed(1)}deg`);
    logo.style.setProperty('--logo-scale', '1.045');
  });
  logo.addEventListener('pointerleave', resetLogo);
});

const email = document.querySelector('.email');
const copyStatus = document.querySelector('.copy-status');
const copyEmail = async () => {
  try { await navigator.clipboard.writeText(email.textContent.trim()); copyStatus.textContent = 'EMAIL COPIED'; }
  catch { copyStatus.textContent = 'SELECT & COPY'; }
  setTimeout(() => { copyStatus.textContent = ''; }, 1800);
};
email.addEventListener('click', copyEmail);
email.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); copyEmail(); } });
