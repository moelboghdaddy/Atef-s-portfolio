(function () {
  const data = window.SITE_DATA || { logo: null, projects: [] };
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Logo (top bar + favicon + loading screen)
  if (data.logo) {
    const link = document.getElementById('logo-link');
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
    strip.dataset.slug = project.slug;

    const num = String(index + 1).padStart(2, '0');
    const projectUrl = `project.html?p=${encodeURIComponent(project.slug || '')}`;

    let shortDesc = '';
    if (project.description) {
      const fullDesc = Array.isArray(project.description) ? project.description[0] : project.description;
      if (fullDesc) {
        const sentenceMatch = fullDesc.match(/^([^.?!]+[.?!])/);
        const sentence = sentenceMatch ? sentenceMatch[1] : fullDesc;
        shortDesc = sentence.length > 120 ? sentence.slice(0, 117).trim() + '…' : sentence;
      }
    }

    const head = document.createElement('div');
    head.className = 'project-strip__head';
    head.innerHTML = `
      <div class="project-strip__info">
        <div class="project-strip__title-wrap">
          <span class="project-strip__num">${num}</span>
          <a href="${projectUrl}" class="project-strip__title-link">
            <h3 class="project-strip__title-text">${escapeHTML(project.title)}</h3>
          </a>
        </div>
        ${shortDesc ? `<p class="project-strip__desc">${escapeHTML(shortDesc)}</p>` : ''}
      </div>
      <a href="${projectUrl}" class="project-strip__btn">
        <span class="project-strip__btn-text">View full project</span>
        <span class="project-strip__btn-arrow">&rarr;</span>
      </a>
    `;

    const track = document.createElement('div');
    track.className = 'project-strip__track';

    const marquee = document.createElement('div');
    marquee.className = 'project-strip__marquee';

    // Show only the first 3 images of each project, repeated seamlessly
    let firstThree = project.gallery.length
      ? [...project.gallery.slice(0, 3)]
      : [project.cover].filter(Boolean);

    // Specific carousel adjustments requested by user:
    // 1. Juhayna redesign: replace second image with 9L
    if (project.slug === 'juhayna-redesign' && firstThree.length >= 2) {
      firstThree[1] = {
        src: 'assets/Juhayna redesign/9L.webp',
        thumb: 'assets/thumbs/Juhayna redesign/9L.webp',
        video: false
      };
    }

    // 2. Era: replace second image with 6s L
    if (project.slug === 'era' && firstThree.length >= 2) {
      firstThree[1] = {
        src: 'assets/Era/6s L.webp',
        thumb: 'assets/thumbs/Era/6s L.webp',
        video: false
      };
    }

    const repeatTimes = Math.max(2, Math.ceil(6 / Math.max(1, firstThree.length)));
    const repeated = [];
    for (let r = 0; r < repeatTimes; r++) {
      repeated.push(...firstThree);
    }

    const buildFrame = (item, hidden, cardIndex, stripIndex) => {
      const a = document.createElement('a');
      a.className = 'frame';
      a.href = projectUrl;
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
        media.setAttribute('playsinline', '');
        media.setAttribute('webkit-playsinline', '');
        media.setAttribute('muted', '');

        media.addEventListener('loadeddata', () => {
          media.classList.add('is-loaded');
          wrap.classList.add('is-loaded');
          media.play().catch(() => {});
        }, { once: true });

        // User request: video on Pepete needs to start playing on phone after first hover / tap
        a.addEventListener('mouseenter', () => {
          if (media.paused) media.play().catch(() => {});
        });
        a.addEventListener('touchstart', () => {
          if (media.paused) media.play().catch(() => {});
        }, { passive: true });

        a.addEventListener('click', (e) => {
          if (media.paused) {
            e.preventDefault();
            e.stopPropagation();
            media.play().catch(() => {});
          }
        });
        a.addEventListener('touchend', (e) => {
          if (media.paused) {
            e.preventDefault();
            media.play().catch(() => {});
          }
        }, { passive: false });
      } else {
        media = document.createElement('img');
        // Era first image crop requirement: crop from right side so left side copy is fully seen
        if (project.slug === 'era' && item.src && item.src.includes('Era/1L')) {
          media.classList.add('frame__img--crop-right');
        }

        // High quality with responsive srcset for sharp display on Retina/high-res screens
        const fullSrc = item.src || item.thumb;
        const thumbSrc = item.thumb || item.src;
        media.src = fullSrc;
        if (thumbSrc && fullSrc && thumbSrc !== fullSrc) {
          media.srcset = `${thumbSrc} 760w, ${fullSrc} 1600w`;
          media.sizes = '(max-width: 680px) 74vw, 390px';
        }
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

    repeated.forEach((src, idx) => marquee.appendChild(buildFrame(src, false, idx, index)));
    repeated.forEach((src, idx) => marquee.appendChild(buildFrame(src, true, idx, index)));

    track.appendChild(marquee);
    strip.appendChild(head);
    strip.appendChild(track);

    const foot = document.createElement('div');
    foot.className = 'project-strip__foot';
    foot.innerHTML = `
      <div class="project-strip__touch">
        <span class="project-strip__touch-text" data-i18n="have_questions">Have any questions ?</span>
        <a href="https://wa.me/201225277824" target="_blank" rel="noopener" class="project-strip__btn project-strip__touch-btn">
          <span class="project-strip__btn-text" data-i18n="get_in_touch">Get in touch</span>
          <span class="project-strip__btn-arrow">&rarr;</span>
        </a>
      </div>
    `;
    strip.appendChild(foot);

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

  // Dynamic Homepage translations
  window.updateHomepageTranslations = function (lang) {
    const isAr = lang === 'ar';
    const translations = window.PROJECT_TRANSLATIONS || {};

    document.querySelectorAll('.project-strip').forEach((strip) => {
      const slug = strip.dataset.slug;
      const projectObj = data.projects.find((p) => p.slug === slug);
      if (!projectObj) return;

      const pTrans = translations[slug];
      const currentTitle = isAr && pTrans ? pTrans.title : projectObj.title;

      // 1. Update strip header title
      const titleEl = strip.querySelector('.project-strip__title-text');
      if (titleEl) titleEl.textContent = currentTitle;

      // 2. Update strip description
      const descEl = strip.querySelector('.project-strip__desc');
      if (descEl) {
        if (isAr && pTrans && pTrans.shortDesc) {
          descEl.textContent = pTrans.shortDesc;
        } else {
          let enDesc = '';
          if (projectObj.description) {
            const fullDesc = Array.isArray(projectObj.description) ? projectObj.description[0] : projectObj.description;
            if (fullDesc) {
              const sentenceMatch = fullDesc.match(/^([^.?!]+[.?!])/);
              const sentence = sentenceMatch ? sentenceMatch[1] : fullDesc;
              enDesc = sentence.length > 120 ? sentence.slice(0, 117).trim() + '…' : sentence;
            }
          }
          descEl.textContent = enDesc;
        }
      }

      // 3. Update view full project button text & arrow
      const btnText = strip.querySelector('.project-strip__btn-text');
      if (btnText) {
        btnText.textContent = isAr ? 'عرض المشروع كاملاً' : 'View full project';
      }
      const btnArrow = strip.querySelector('.project-strip__btn-arrow');
      if (btnArrow) {
        btnArrow.textContent = isAr ? '←' : '→';
      }

      // 4. Update frame titles inside marquee
      strip.querySelectorAll('.frame__title-text').forEach((ft) => {
        ft.textContent = currentTitle;
      });
      strip.querySelectorAll('.frame__title-arrow').forEach((fa) => {
        fa.textContent = isAr ? '←' : '→';
      });

      // 5. Update touch prompt & button under each project strip
      const touchPrompt = strip.querySelector('.project-strip__touch-text');
      if (touchPrompt) {
        touchPrompt.textContent = isAr ? 'هل لديك أي استفسار؟' : 'Have any questions ?';
      }
      const touchBtn = strip.querySelector('.project-strip__touch-btn .project-strip__btn-text');
      if (touchBtn) {
        touchBtn.textContent = isAr ? 'تواصل معي' : 'Get in touch';
      }
      const touchArrow = strip.querySelector('.project-strip__touch-btn .project-strip__btn-arrow');
      if (touchArrow) {
        touchArrow.textContent = isAr ? '←' : '→';
      }
    });
  };

  // Run initial translations if language is Arabic on load
  const initialLang = localStorage.getItem('site_lang') || 'en';
  if (initialLang === 'ar') {
    window.updateHomepageTranslations('ar');
  }

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
