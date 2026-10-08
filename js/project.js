(function () {
  const data = window.SITE_DATA || { logo: null, projects: [] };
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('p');

  // Logo (top bar + favicon + loading screen)
  if (data.logo) {
    const fallback = document.getElementById('logo-fallback');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const effectiveLogo = isDark ? 'assets/logo-dark.png' : data.logo;
    const img = new Image();
    img.src = effectiveLogo;
    img.alt = 'Logo';
    img.onload = () => fallback.replaceWith(img);

    const favicon = document.getElementById('favicon');
    if (favicon) favicon.href = 'assets/favicon.png';

    const loadingLogo = document.getElementById('loading-logo');
    if (loadingLogo) loadingLogo.src = effectiveLogo;
  } else {
    const loadingLogo = document.getElementById('loading-logo');
    if (loadingLogo) loadingLogo.style.display = 'none';
  }

  // Hide the loading screen once the initial page has settled.
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
    setTimeout(hideLoadingScreen, 1200); // safety fallback
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

  const pageTitle = `${project.title} | Atef Portfolio`;
  document.title = pageTitle;
  document.getElementById('page-title').textContent = pageTitle;
  document.getElementById('project-title').textContent = project.title;

  const ogTitle = document.getElementById('og-title');
  if (ogTitle) ogTitle.content = pageTitle;
  const twTitle = document.getElementById('tw-title');
  if (twTitle) twTitle.content = pageTitle;

  const descSnippet = Array.isArray(project.description) ? project.description[0] : project.description;
  if (descSnippet) {
    const metaDesc = document.getElementById('meta-desc');
    if (metaDesc) metaDesc.content = descSnippet;
    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.content = descSnippet;
    const twDesc = document.getElementById('tw-desc');
    if (twDesc) twDesc.content = descSnippet;
  }

  const ogUrl = document.getElementById('og-url');
  if (ogUrl) ogUrl.content = window.location.href;
  function renderParagraphs(container, content) {
    if (!container) return;
    container.innerHTML = '';
    if (!content) return;
    const paragraphs = Array.isArray(content) ? content : [content];
    paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      container.appendChild(p);
    });
  }

  const directionWrap = document.getElementById('project-direction-wrap');
  const descContainer = document.getElementById('project-description');
  const dirContainer = document.getElementById('project-direction');
  const titleEl = document.getElementById('project-title');
  const pageTitleEl = document.getElementById('page-title');
  const backLink = document.getElementById('back-link');
  const next = data.projects[(index + 1) % data.projects.length];

  // Dynamic project page translations
  window.updateProjectTranslations = function (lang) {
    const isAr = lang === 'ar';
    const translations = window.PROJECT_TRANSLATIONS || {};
    const pTrans = translations[slug];

    const currentTitle = isAr && pTrans ? pTrans.title : project.title;
    const siteTitle = isAr ? `${currentTitle} | محفظة أعمال عاطف` : `${project.title} | Atef Portfolio`;

    document.title = siteTitle;
    if (pageTitleEl) pageTitleEl.textContent = siteTitle;
    if (titleEl) titleEl.textContent = currentTitle;

    // Render description paragraphs
    const descContent = isAr && pTrans && pTrans.description ? pTrans.description : project.description;
    renderParagraphs(descContainer, descContent);

    // Render direction paragraphs
    const dirContent = isAr && pTrans && pTrans.direction ? pTrans.direction : project.direction;
    if (dirContent) {
      if (directionWrap) directionWrap.style.display = '';
      renderParagraphs(dirContainer, dirContent);
    } else if (directionWrap) {
      directionWrap.style.display = 'none';
    }

    // Update back link
    if (backLink) {
      backLink.innerHTML = isAr ? 'العودة إلى الأعمال &larr;' : '&larr; Back to work';
    }

    // Update project nav link
    if (navEl) {
      if (next && next.slug !== project.slug) {
        const nextTrans = translations[next.slug];
        const nextTitle = isAr && nextTrans ? nextTrans.title : next.title;
        navEl.innerHTML = isAr
          ? `<a href="project.html?p=${encodeURIComponent(next.slug)}">المشروع التالي: ${escapeHTML(nextTitle)} &larr;</a>`
          : `<a href="project.html?p=${encodeURIComponent(next.slug)}">Next project: ${escapeHTML(next.title)} &rarr;</a>`;
      } else {
        navEl.innerHTML = isAr
          ? `<a href="index.html#work">العودة إلى كافة الأعمال &larr;</a>`
          : `<a href="index.html#work">&larr; Back to all work</a>`;
      }
    }

    // Update touch prompt & button
    const touchPrompt = document.querySelector('.project-touch-prompt');
    if (touchPrompt) {
      touchPrompt.textContent = isAr ? 'هل لديك أي استفسار؟' : 'Have any questions ?';
    }
    const touchBtn = document.querySelector('.project-touch-btn .project-strip__btn-text');
    if (touchBtn) {
      touchBtn.textContent = isAr ? 'تواصل معي' : 'Get in touch';
    }
    const touchArrow = document.querySelector('.project-touch-btn .project-strip__btn-arrow');
    if (touchArrow) {
      touchArrow.textContent = isAr ? '←' : '→';
    }
  };

  // Initial render of text
  const initialLang = localStorage.getItem('site_lang') || 'en';
  window.updateProjectTranslations(initialLang);

  function mediaTag(src, isVideo, thumb, isPriority) {
    if (!src) return '';
    if (isVideo) {
      return `<div class="frame__img-wrap"><video src="${src}" autoplay muted loop playsinline></video></div>`;
    }
    const fullSrc = src || thumb;
    const loadingAttr = isPriority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    return `<div class="frame__img-wrap"><img src="${fullSrc}" ${loadingAttr} decoding="async" alt="${escapeHTML(project.title)}"></div>`;
  }

  project.rows.forEach((row, rIdx) => {
    const isPriority = rIdx < 2;
    if (row.type === 'large') {
      const div = document.createElement('div');
      div.className = 'row row--large';
      div.innerHTML = mediaTag(row.src, row.video, row.thumb, isPriority);
      rowsEl.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'row row--pair';
      div.innerHTML = mediaTag(row.left, row.leftVideo, row.leftThumb, isPriority) +
                      mediaTag(row.right, row.rightVideo, row.rightThumb, isPriority);
      rowsEl.appendChild(div);
    }
  });

  // Move the description/direction block to sit right after the first image row.
  const textBlock = document.getElementById('project-hero__text');
  if (textBlock && rowsEl) {
    if (rowsEl.children.length > 1) {
      rowsEl.insertBefore(textBlock, rowsEl.children[1]);
    } else {
      rowsEl.appendChild(textBlock);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('visible');
          if (target.tagName === 'IMG' && target.loading === 'lazy') {
            target.loading = 'eager';
          }
          const nested = target.querySelectorAll ? target.querySelectorAll('img, video') : [];
          nested.forEach((item) => {
            item.classList.add('visible');
            if (item.loading === 'lazy') item.loading = 'eager';
          });
          observer.unobserve(target);
        }
      });
    },
    { rootMargin: '800px 0px', threshold: 0 }
  );

  document.querySelectorAll('.row').forEach((row) => observer.observe(row));
  document.querySelectorAll('.row img, .row video').forEach((media) => {
    const wrap = media.closest('.frame__img-wrap');
    const onLoaded = () => {
      media.classList.add('is-loaded', 'visible');
      if (wrap) wrap.classList.add('is-loaded');
    };
    if (media.tagName === 'VIDEO') {
      media.addEventListener('loadeddata', onLoaded, { once: true });
    } else if (media.complete && media.naturalWidth > 0) {
      requestAnimationFrame(onLoaded);
    } else {
      media.addEventListener('load', onLoaded, { once: true });
      media.addEventListener('error', onLoaded, { once: true });
    }
    observer.observe(media);
  });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
