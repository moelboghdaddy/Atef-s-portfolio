(function () {
  const data = window.SITE_DATA || { logo: null, projects: [] };
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('p');
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
  // Logo (top bar + favicon + loading screen)
  if (data.logo) {
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

  const index = data.projects.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? data.projects[index] : null;
  const rowsEl = document.getElementById('project-rows');
  const navEl = document.getElementById('project-nav');

  if (!project) {
    document.getElementById('project-title').textContent = 'Project not found';
    document.getElementById('project-description').textContent =
      "This project doesn't exist, or the link is out of date.";
    navEl.innerHTML = `<a href="index.html#work">&larr; Back to all work</a>`;
    return;
  }

  document.title = project.title;
  document.getElementById('page-title').textContent = project.title;
  document.getElementById('project-title').textContent = project.title;
  function renderParagraphs(container, content) {
    if (!content) return;
    const paragraphs = Array.isArray(content) ? content : [content];
    paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      container.appendChild(p);
    });
  }
  
  renderParagraphs(document.getElementById('project-description'), project.description);
  
  const directionWrap = document.getElementById('project-direction-wrap');
  if (project.direction) {
    renderParagraphs(document.getElementById('project-direction'), project.direction);
  } else if (directionWrap) {
    directionWrap.style.display = 'none';
  }

  function mediaTag(src, isVideo) {
    if (!src) return '';
    if (isVideo) {
      return `<div class="frame__img-wrap"><video src="${src}" autoplay muted loop playsinline></video></div>`;
    }
    return `<div class="frame__img-wrap"><img src="${src}" loading="lazy" alt="${escapeHTML(project.title)}"></div>`;
  }
  
  project.rows.forEach((row) => {
    if (row.type === 'large') {
      const div = document.createElement('div');
      div.className = 'row row--large';
      div.innerHTML = mediaTag(row.src, row.video);
      rowsEl.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'row row--pair';
      div.innerHTML = mediaTag(row.left, row.leftVideo) + mediaTag(row.right, row.rightVideo);
      rowsEl.appendChild(div);
    }
    project.rows.forEach((row) => {
      if (row.type === 'large') {
        const div = document.createElement('div');
        div.className = 'row row--large';
        div.innerHTML = mediaTag(row.src, row.video);
        rowsEl.appendChild(div);
      } else {
        const div = document.createElement('div');
        div.className = 'row row--pair';
        div.innerHTML = mediaTag(row.left, row.leftVideo) + mediaTag(row.right, row.rightVideo);
        rowsEl.appendChild(div);
      }
    });
    
    // Move the description/direction block to sit right after the first image row.
    const textBlock = document.getElementById('project-hero__text');
    if (textBlock) {
      if (rowsEl.children.length > 1) {
        rowsEl.insertBefore(textBlock, rowsEl.children[1]);
      } else {
        rowsEl.appendChild(textBlock);
      }
    }
  });
  const next = data.projects[(index + 1) % data.projects.length];
  navEl.innerHTML =
    next && next.slug !== project.slug
      ? `<a href="project.html?p=${encodeURIComponent(next.slug)}">Next project: ${escapeHTML(next.title)} &rarr;</a>`
      : `<a href="index.html#work">&larr; Back to all work</a>`;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.row img, .row video').forEach((el) => observer.observe(el));

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
