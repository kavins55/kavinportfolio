// ── PREVIEW MODAL LOGIC ──────────────────
const modal = document.getElementById('preview-modal');
const modalImg = document.getElementById('modal-img');
const modalContent = document.querySelector('.modal-content');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');
const modalQr = document.getElementById('modal-qr');
const modalInfo = document.querySelector('.modal-info');

function openPreview(title, desc, imgSrc, qrSrc, bgColor) {
  modalTitle.innerText = title;
  modalDesc.innerText = desc;
  modalImg.src = imgSrc;

  if (bgColor) {
    modalContent.style.background = `linear-gradient(145deg, ${bgColor} 0%, #111 100%)`;
  } else {
    modalContent.style.background = 'var(--brown1)';
  }

  if (qrSrc) {
    modalQr.src = qrSrc;
    modalQr.style.display = 'block';
  } else {
    modalQr.style.display = 'none';
  }

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 400);
}

modalClose.onclick = closePreview;
modal.onclick = (e) => { if (e.target === modal) closePreview(); };

// ── CURSOR ────────────────────────────────
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function tick() {
  rx += (mx - rx) * .11; ry += (my - ry) * .11;
  curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button,select,.sk-card,.srv-card,.proj-card,.fl-row').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2.2)';
    curR.style.width = '52px'; curR.style.height = '52px';
    curR.style.borderColor = 'rgba(192,25,28,.5)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    curR.style.width = '34px'; curR.style.height = '34px';
    curR.style.borderColor = 'rgba(192,25,28,.35)';
  });
});

// ── SCROLL REVEAL ──────────────────────────
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
  });
}, { threshold: .08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

// ── SMOOTH SCROLL ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── 3D TILT ON SKILL CARDS ─────────────────
document.querySelectorAll('.sk-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

// ── 3D TILT ON IDENTITY CARD (ABOUT BOX) ───
const aboutBox = document.querySelector('.about-box');
if (aboutBox) {
  aboutBox.addEventListener('mousemove', e => {
    const r = aboutBox.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    aboutBox.style.setProperty('--mouse-x', `${x * 100}%`);
    aboutBox.style.setProperty('--mouse-y', `${y * 100}%`);

    const tiltX = (y - 0.5) * -12;
    const tiltY = (x - 0.5) * 12;
    aboutBox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
  });
  aboutBox.addEventListener('mouseleave', () => {
    aboutBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    aboutBox.style.setProperty('--mouse-x', '50%');
    aboutBox.style.setProperty('--mouse-y', '50%');
  });
}

// ── NAV active state ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--red)' : '';
  });
});

// ── CONTACT FORM TO GOOGLE SHEETS ──────────
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmit = document.getElementById('form-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // REPLACE THIS with your Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwy0L7T27ySQBma8f1L3qcgVelR8Xyi_ypQ0TdePsm87ONkVDYPSNVz6SPfA1Z0tRH5/exec';

    formSubmit.disabled = true;
    formSubmit.innerHTML = 'Sending...';
    formStatus.style.display = 'block';
    formStatus.style.color = 'var(--muted)';
    formStatus.innerHTML = 'Sending your message...';

    const formData = new FormData();
    formData.append('Name', document.getElementById('form-name').value);
    formData.append('Contact', document.getElementById('form-contact').value);
    formData.append('Service', document.getElementById('form-service').value);
    formData.append('Budget', document.getElementById('form-budget').value);
    formData.append('Description', document.getElementById('form-desc').value);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        formStatus.style.color = '#4CAF50';
        formStatus.innerHTML = '✅ Message sent successfully! I will get back to you soon.';
        contactForm.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      formStatus.style.color = 'var(--red)';
      formStatus.innerHTML = '❌ Oops! Something went wrong. Please try again or email me directly.';
    } finally {
      formSubmit.disabled = false;
      formSubmit.innerHTML = 'Send Message →';
    }
  });
}

function confirmEmail(email) {
  window.open("https://mail.google.com/mail/?view=cm&to=" + email, "_blank");
}

function toggleContact() {
  const card = document.getElementById('contact-card');
  const btn = document.getElementById('contact-toggle-btn');
  const isOpen = card.classList.contains('open');
  if (isOpen) {
    card.classList.remove('open');
    btn.innerHTML = '📬 Show My Contact Details';
  } else {
    card.classList.add('open');
    btn.innerHTML = '✕ Hide Contact Details';
  }
}

function showContact() {
  const card = document.getElementById('contact-card');
  const btn = document.getElementById('contact-toggle-btn');
  if (!card || card.classList.contains('open')) return;
  card.classList.add('open');
  btn.innerHTML = '✕ Hide Contact Details';
}
