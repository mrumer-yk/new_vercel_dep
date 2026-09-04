// CodeMaster — Learn to Code
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

document.documentElement.classList.add('js-enabled');

const CHIP_MAKER_DOWNLOAD_URL = 'https://github.com/sureshq134-tech/chip_maker/raw/refs/heads/main/chip-maker-windows-linux.zip';

// FAQ toggles
function setupFAQ() {
  const items = document.querySelectorAll('.faq-card');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    const icon = btn?.querySelector('.toggle');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      ans.hidden = expanded;
      if (icon) icon.textContent = expanded ? '+' : '×';
    });

  });
}

// Double-clicking About opens the Windows/Linux application download.
function setupAboutDownload() {
  const aboutLink = document.getElementById('aboutLink');
  if (!aboutLink) return;

  aboutLink.addEventListener('dblclick', (event) => {
    event.preventDefault();
    const link = document.createElement('a');
    link.href = CHIP_MAKER_DOWNLOAD_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

// Mobile menu
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('mobileNavOverlay');
  if (!btn || !nav || !overlay) return;
  function open() { nav.classList.add('active'); btn.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow='hidden'; }
  function close() { nav.classList.remove('active'); btn.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow=''; }
  function toggle() { nav.classList.contains('active') ? close() : open(); }
  btn.addEventListener('click', toggle);
  overlay.addEventListener('click', close);
  nav.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', close));
  window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape' && nav.classList.contains('active')) close(); });
}

// Section reveal
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { rootMargin:'0px 0px -10% 0px', threshold:0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Newsletter form (stores locally, tries Firebase if available)
let saveRegistrationToFirebase = null;
import('./auth.js').then(m => {
  saveRegistrationToFirebase = m.saveRegistrationToFirebase;
  console.log('Auth module loaded');
}).catch(err => {
  console.warn('Auth module failed to load:', err);
  const ab = document.getElementById('auth-buttons');
  if (ab) ab.innerHTML = '<span style="color:#ef4444;font-size:13px;">Auth unavailable</span>';
});

function setupNewsletter() {
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  const countEl = document.getElementById('subscriberCount');
  if (!form) return;

  // animate count a bit
  let count = 12431;
  setInterval(() => {
    count += Math.floor(Math.random()*2);
    if (countEl) countEl.textContent = count.toLocaleString();
  }, 30000);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = new FormData(form).get('email')?.toString().trim();
    if (!email) return;
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }

    const payload = { email, source:'newsletter', timestamp: new Date().toISOString() };
    try {
      if (saveRegistrationToFirebase) {
        const res = await saveRegistrationToFirebase(payload);
        if (!res.success && !res.fallback) throw new Error(res.error || 'save failed');
      } else {
        const arr = JSON.parse(localStorage.getItem('cm_newsletter') || '[]');
        arr.push(payload);
        localStorage.setItem('cm_newsletter', JSON.stringify(arr));
      }
      form.reset();
      if (msg) msg.style.display = 'block';
      if (countEl) { count += 1; countEl.textContent = count.toLocaleString(); }
    } catch (err) {
      console.error(err);
      alert('Subscription failed. Please try again.');
      if (btn) { btn.textContent = orig; btn.disabled = false; return; }
    }
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  });
}

setupFAQ();
setupAboutDownload();
setupMobileMenu();
setupReveal();
setupNewsletter();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
      history.pushState(null,'',id);
    }
  });
});
