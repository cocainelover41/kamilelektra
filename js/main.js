const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const triggers = document.querySelectorAll('[data-lightbox]');

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
}

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const src = trigger.getAttribute('data-lightbox');
    const alt = trigger.getAttribute('data-lightbox-alt') || '';
    openLightbox(src, alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

// Click outside the image (on the dialog backdrop area) closes it
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Clear the image source after close so a lingering large image
// doesn't stay decoded in memory between previews
const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

lightbox.addEventListener('close', () => {
  lightboxImage.src = BLANK_IMAGE;
  lightboxImage.alt = '';
});
