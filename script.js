const hero = document.querySelector('.hero');
const trail = document.querySelector('.hero-trail');
const nav = document.querySelector('.site-nav');
const aboutText = document.querySelector('.about-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) document.documentElement.classList.add('entrances-enabled');
const trailSources = [
  'public/assets/images/cursor-1.png',
  'public/assets/images/cursor-2.png',
  'public/assets/images/cursor-3.png',
  'https://framerusercontent.com/images/CUB8IgvxS7sncAA39ccD0E7WQs.png?width=512&height=768'
];

let lastPoint = null;
let pieceIndex = 0;
let heroActive = true;

requestAnimationFrame(() => requestAnimationFrame(() => {
  document.documentElement.classList.add('page-ready');
  // The intro delay is only for the first page entrance, never for hover navigation.
  setTimeout(() => nav.classList.add('intro-complete'), 1850);
}));

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

const placeTrailPiece = (event, touchInput = false) => {
  if (!heroActive || !lastPoint) return;
  const deltaX = event.clientX - lastPoint.x;
  const deltaY = event.clientY - lastPoint.y;
  const distance = Math.hypot(deltaX, deltaY);
  // A phone's shorter gesture distance needs a tighter threshold to match
  // the density of a desktop cursor trail.
  if (distance < (touchInput ? 16 : 38)) return;
  lastPoint = { x: event.clientX, y: event.clientY };
  const directionX = deltaX / distance;
  const directionY = deltaY / distance;
  const momentum = Math.min(42, distance * .52);
  const jitter = () => Math.random() * 10 - 5;
  const bounds = hero.getBoundingClientRect();
  const image = document.createElement('img');
  image.className = 'trail-piece';
  image.src = trailSources[pieceIndex++ % trailSources.length];
  image.style.left = `${event.clientX - bounds.left}px`;
  image.style.top = `${event.clientY - bounds.top}px`;
  image.style.setProperty('--r', `${(Math.random() * 18 - 9).toFixed(1)}deg`);
  image.style.setProperty('--tilt', `${(directionX * 5 + Math.random() * 6 - 3).toFixed(1)}deg`);
  image.style.setProperty('--offset-x', `${(-directionX * momentum + jitter()).toFixed(1)}px`);
  image.style.setProperty('--offset-y', `${(-directionY * momentum + jitter()).toFixed(1)}px`);
  image.style.setProperty('--glide-x', `${(directionX * 5 + jitter() * .4).toFixed(1)}px`);
  image.style.setProperty('--glide-y', `${(directionY * 5 + jitter() * .4).toFixed(1)}px`);
  image.style.setProperty('--drift-x', `${(directionX * (momentum + 12) + jitter()).toFixed(1)}px`);
  image.style.setProperty('--drift-y', `${(directionY * (momentum + 12) + jitter()).toFixed(1)}px`);
  image.addEventListener('animationend', (event) => { if (event.animationName === 'trail-out') image.remove(); });
  trail.append(image);
};

hero.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch') return;
  heroActive = true;
  lastPoint = { x:event.clientX, y:event.clientY };
});
hero.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') return;
  heroActive = true;
  lastPoint = { x:event.clientX, y:event.clientY };
});
hero.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'touch') placeTrailPiece(event);
});
hero.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'touch') return;
  heroActive = false;
  lastPoint = null;
});

let activeTouchId = null;
const touchTrailEvent = (touch) => ({ clientX:touch.clientX, clientY:touch.clientY });
hero.addEventListener('touchstart', (event) => {
  const touch = event.changedTouches[0];
  if (!touch) return;
  activeTouchId = touch.identifier;
  heroActive = true;
  lastPoint = { x:touch.clientX, y:touch.clientY };
}, { passive:true });
hero.addEventListener('touchmove', (event) => {
  const touch = [...event.touches].find(({ identifier }) => identifier === activeTouchId);
  if (touch) placeTrailPiece(touchTrailEvent(touch), true);
}, { passive:true });
hero.addEventListener('touchend', (event) => {
  if ([...event.changedTouches].some(({ identifier }) => identifier === activeTouchId)) {
    activeTouchId = null;
    lastPoint = null;
  }
}, { passive:true });
hero.addEventListener('touchcancel', () => { activeTouchId = null; lastPoint = null; }, { passive:true });

const phoneSource = document.querySelector('.phone-source');
const phoneCanvas = document.querySelector('.contact-phone canvas');
if (phoneSource && phoneCanvas) {
  const phoneContext = phoneCanvas.getContext('2d', { alpha:true, desynchronized:true });
  let phoneFrame = null;
  let phoneVisible = true;
  const sizePhoneCanvas = () => {
    const ratio = phoneSource.videoWidth / phoneSource.videoHeight || 1.5;
    phoneCanvas.width = 960;
    phoneCanvas.height = Math.round(phoneCanvas.width / ratio);
  };
  const drawPhoneFrame = () => {
    phoneFrame = null;
    if (!phoneVisible) return;
    if (phoneSource.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      phoneContext.drawImage(phoneSource, 0, 0, phoneCanvas.width, phoneCanvas.height);
    }
    phoneFrame = requestAnimationFrame(drawPhoneFrame);
  };
  const startPhoneDrawing = () => {
    if (phoneVisible && phoneFrame === null) phoneFrame = requestAnimationFrame(drawPhoneFrame);
  };
  phoneSource.addEventListener('loadedmetadata', sizePhoneCanvas, { once:true });
  phoneSource.play().catch(() => {});
  new IntersectionObserver(([entry]) => {
    phoneVisible = entry.isIntersecting;
    if (phoneVisible) startPhoneDrawing();
  }, { rootMargin:'160px 0px' }).observe(phoneCanvas);
  startPhoneDrawing();
}

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
  modalImage.src = image.dataset.fullsrc || image.currentSrc || image.src;
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
  if (textRect.bottom < -64 || textRect.top > window.innerHeight * 1.2) return;
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

const headingEntrances = document.querySelectorAll(
  '.section-heading h2, .services-title > span, .services h3, .find-me h3, .credits h3'
);
const copyEntrances = document.querySelectorAll(
  '.works .work-copy, .availability, .credits p'
);
const runEntrance = (target, className) => {
  target.dataset.entered = 'true';
  target.classList.add(className);
};

if (!reducedMotion) {
  const entranceTargets = [];
  headingEntrances.forEach((target) => {
    target.dataset.entrance = 'enter-heading';
    entranceTargets.push(target);
  });
  copyEntrances.forEach((target) => {
    target.dataset.entrance = 'enter-copy';
    entranceTargets.push(target);
  });
  let entranceFrame = null;
  let entrancesActivated = false;
  const triggerEntrances = () => {
    entranceFrame = null;
    entranceTargets.forEach((target) => {
      if (target.dataset.entered) return;
      const rect = target.getBoundingClientRect();
      // Also resolve items that were crossed during a very fast desktop scroll.
      if (rect.top <= window.innerHeight * .84) runEntrance(target, target.dataset.entrance);
    });
  };
  const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.entered) return;
      runEntrance(entry.target, entry.target.dataset.entrance);
      entranceObserver.unobserve(entry.target);
    });
  }, { rootMargin:'0px 0px -16% 0px', threshold:0 });
  const activateEntrances = () => {
    if (!entrancesActivated) {
      entrancesActivated = true;
      entranceTargets.forEach((target) => entranceObserver.observe(target));
    }
    if (entranceFrame === null) entranceFrame = requestAnimationFrame(triggerEntrances);
  };
  window.addEventListener('scroll', activateEntrances, { passive: true });
  window.addEventListener('resize', () => {
    if (entrancesActivated) activateEntrances();
  }, { passive: true });
}

document.querySelectorAll('.logos img').forEach((logo) => {
  const resetLogo = () => {
    logo.style.setProperty('--logo-x', '0px');
    logo.style.setProperty('--logo-y', '0px');
    logo.style.setProperty('--logo-r', '0deg');
    logo.style.setProperty('--logo-scale', '1');
  };
  logo.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    logo.style.setProperty('--logo-x', '0px');
    logo.style.setProperty('--logo-y', '-12px');
    logo.style.setProperty('--logo-r', '0deg');
    logo.style.setProperty('--logo-scale', '1.075');
  });
  logo.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = logo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    logo.style.setProperty('--logo-x', `${(x * 9).toFixed(1)}px`);
    logo.style.setProperty('--logo-y', `${(-12 + y * 7).toFixed(1)}px`);
    logo.style.setProperty('--logo-r', `${(x * 2.2).toFixed(1)}deg`);
    logo.style.setProperty('--logo-scale', '1.075');
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
