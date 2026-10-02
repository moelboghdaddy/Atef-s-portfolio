(function () {
  const data = window.SITE_DATA || { logo: null, projects: [] };
// Hide the navbar on scroll down, reveal it on scroll up.
const topbar = document.querySelector('.topbar');
if (topbar) {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > topbar.offsetHeight) {
      topbar.classList.add('nav-hidden');
    } else {
      topbar.classList.remove('nav-hidden');
    }
    lastY = y;
  }, { passive: true });
}
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Logo (top bar + favicon + loading screen)
  if (data.logo) {
    const link = document.getElementById('logo-link');
    const fallback = document.getElementById('logo-fallback');
    const img = new Image();
    img.src = data.logo;
    img.alt = 'Logo';
    img.onload = () => fallback.replaceWith(img);

    const favicon = document.getElementById('favicon');
    if (favicon) favicon.href = data.logo;

    const loadingLogo = document.getElementById('loading-logo');
    if (loadingLogo) loadingLogo.src = data.logo;
  } else {
    const loadingLogo = document.getElementById('loading-logo');
    if (loadingLogo) loadingLogo.style.display = 'none';
  }

  // Hide the blurred loading screen once the page has settled in.
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const hideLoadingScreen = () => loadingScreen.classList.add('hidden');
    window.addEventListener('load', () => requestAnimationFrame(hideLoadingScreen));
    setTimeout(hideLoadingScreen, 2500); // safety net
  }

  const workList = document.getElementById('work-list');

  if (!data.projects.length) {
    workList.innerHTML = `
      <div class="empty-state">
        <h3>No projects yet</h3>
        <p>Add a folder for each project inside <code>/assets</code>, name the images
        <code>1L</code>, <code>2s L</code>, <code>2s R</code>, <code>3L</code>… and run
        <code>node build.js</code>. This page will pick them up automatically.</p>
      </div>`;
    return;
  }

  // Pixels per second the belt moves. Kept constant across projects so
  // longer galleries just take proportionally longer to loop.
  const MARQUEE_SPEED = 55;

  data.projects.forEach((project) => {
    const strip = document.createElement('article');
    strip.className = 'project-strip';

    const head = document.createElement('div');
    head.className = 'project-strip__head';
    head.innerHTML = `
      <h3>${escapeHTML(project.title)}</h3>
      <span class="project-strip__hint"><span class="dot"></span>Auto-playing — hover to pause</span>
    `;

    const track = document.createElement('div');
    track.className = 'project-strip__track';

    const marquee = document.createElement('div');
    marquee.className = 'project-strip__marquee';

    // Render the gallery twice back to back so the loop from 0% to -50%
    // is seamless, like a belt of images passing by.
    const MAX_MARQUEE_IMAGES = 14;
    const images = project.gallery.length
  ? project.gallery.slice(0, MAX_MARQUEE_IMAGES)
  : [project.cover].filter(Boolean);
  const buildFrame = (item, hidden) => {
    const a = document.createElement('a');
    a.className = 'frame';
    a.href = `project.html?p=${encodeURIComponent(project.slug)}`;
    if (hidden) a.setAttribute('aria-hidden', 'true');
  
    const wrap = document.createElement('div');
    wrap.className = 'frame__img-wrap';
  
    let media;
    if (item.video) {
      media = document.createElement('video');
      media.src = item.src;
      media.autoplay = true;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
    } else {
      media = document.createElement('img');
      media.src = item.src;
      media.loading = 'lazy';
      media.decoding = 'async';
      media.alt = project.title;
    }
    wrap.appendChild(media);
      const title = document.createElement('span');
      title.className = 'frame__title';
      title.textContent = project.title;

      a.appendChild(wrap);
      a.appendChild(title);
      return a;
    };

    images.forEach((src) => marquee.appendChild(buildFrame(src, false)));
images.forEach((src) => marquee.appendChild(buildFrame(src, true)));

    track.appendChild(marquee);
    strip.appendChild(head);
    strip.appendChild(track);
    workList.appendChild(strip);

    // Duration is based on the width of a single (non-doubled) set, so
    // every project's belt moves at the same visual speed.
    requestAnimationFrame(() => {
      const fullWidth = marquee.scrollWidth;
      const oneSetWidth = fullWidth / 2;
      const duration = Math.max(oneSetWidth / MARQUEE_SPEED, 8);
      marquee.style.animationDuration = `${duration}s`;
    });
  });

  // Fade + blur each project strip in as a whole, once, when it scrolls
  // into view — the belt only starts moving once it's visible.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.project-strip').forEach((el) => observer.observe(el));

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
