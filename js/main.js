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

  // Hide the loading screen promptly once initial page is interactive
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const hideLoadingScreen = () => {
      if (!loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
      }
    };
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      requestAnimationFrame(hideLoadingScreen);
    } else {
      document.addEventListener('DOMContentLoaded', hideLoadingScreen);
    }
    window.addEventListener('load', hideLoadingScreen);
    setTimeout(hideLoadingScreen, 1200); // safety net
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
  const MARQUEE_SPEED = 65;

  data.projects.forEach((project, index) => {
    const strip = document.createElement('article');
    strip.className = 'project-strip';

    const num = String(index + 1).padStart(2, '0');
    const head = document.createElement('div');
    head.className = 'project-strip__head';
    head.innerHTML = `
      <div class="project-strip__title-wrap">
        <span class="project-strip__num">${num}</span>
        <h3>${escapeHTML(project.title)}</h3>
      </div>
      <span class="project-strip__hint"><span class="dot"></span>Auto-playing — hover to pause</span>
    `;

    const track = document.createElement('div');
    track.className = 'project-strip__track';

    const marquee = document.createElement('div');
    marquee.className = 'project-strip__marquee';

    // Render the gallery twice back to back so the loop from 0% to -50%
    // is seamless, like a belt of images passing by.
    const MAX_MARQUEE_IMAGES = 8;
    const images = project.gallery.length
      ? project.gallery.slice(0, MAX_MARQUEE_IMAGES)
      : [project.cover].filter(Boolean);

    const buildFrame = (item, hidden, cardIndex, stripIndex) => {
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
        media.addEventListener('loadeddata', () => {
          media.classList.add('is-loaded');
          wrap.classList.add('is-loaded');
        }, { once: true });
      } else {
        media = document.createElement('img');
        // Use optimized thumbnail for ultra-fast, smooth marquee performance
        media.src = item.thumb || item.src;
        // Prioritize immediately visible cards so there is never a blank grey card
        const isImmediatelyVisible = !hidden && cardIndex < 4;
        if (isImmediatelyVisible) {
          media.loading = 'eager';
          if (stripIndex <= 1) {
            media.fetchPriority = 'high';
          }
        } else {
          media.loading = 'lazy';
        }
        media.decoding = 'async';
        media.alt = project.title;
        media.width = 380;
        media.height = 260;

        const onLoaded = () => {
          media.classList.add('is-loaded');
          wrap.classList.add('is-loaded');
        };

        if (media.complete && media.naturalWidth > 0) {
          requestAnimationFrame(onLoaded);
        } else {
          media.addEventListener('load', onLoaded, { once: true });
          media.addEventListener('error', onLoaded, { once: true });
        }
      }
      wrap.appendChild(media);

      const title = document.createElement('span');
      title.className = 'frame__title';
      title.innerHTML = `
        <span class="frame__title-text">${escapeHTML(project.title)}</span>
        <span class="frame__title-arrow">&rarr;</span>
      `;

      a.appendChild(wrap);
      a.appendChild(title);
      return a;
    };

    images.forEach((src, idx) => marquee.appendChild(buildFrame(src, false, idx, index)));
    images.forEach((src, idx) => marquee.appendChild(buildFrame(src, true, idx, index)));

    track.appendChild(marquee);
    strip.appendChild(head);
    strip.appendChild(track);
    workList.appendChild(strip);

    // Duration is based on the width of a single (non-doubled) set, so
    // every project's belt moves at the same visual speed.
    const setDuration = () => {
      const fullWidth = marquee.scrollWidth;
      const oneSetWidth = fullWidth / 2;
      if (oneSetWidth > 0) {
        const duration = Math.max(oneSetWidth / MARQUEE_SPEED, 8);
        marquee.style.animationDuration = `${duration}s`;
      }
    };
    requestAnimationFrame(setDuration);
  });

  // Fade + blur each project strip in smoothly as it approaches the viewport
  // and trigger eager preloading of all images 500px in advance.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          entry.target.classList.add('is-animating');
          // Preload remaining lazy images in this strip immediately
          const lazyImgs = entry.target.querySelectorAll('img[loading="lazy"]');
          lazyImgs.forEach((img) => {
            img.loading = 'eager';
          });
        } else {
          entry.target.classList.remove('is-animating');
        }
      });
    },
    { rootMargin: '500px 0px', threshold: 0.02 }
  );

  document.querySelectorAll('.project-strip').forEach((el) => observer.observe(el));

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
