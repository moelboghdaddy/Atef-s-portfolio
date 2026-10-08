/**
 * theme-lang.js
 * Handles Dark Mode and Arabic Language switching with persistent state across pages.
 */
(function () {
  const THEME_KEY = 'site_theme';
  const LANG_KEY = 'site_lang';

  // 1. Immediate initialization to avoid FOUC (Flash of Unstyled Content)
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const savedLang = localStorage.getItem(LANG_KEY) || 'en';
  if (savedLang === 'ar') {
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  }

  // 2. Translation dictionaries
  const I18N = {
    en: {
      nav_work: 'Work',
      nav_services: 'Services',
      nav_about: 'About',
      nav_contact: 'Contact',
      hero_h1: 'Every brand deserves a personality.',
      hero_p: 'I design identities that feel like a living being, not just a static mark.',
      view_full_project: 'View full project',
      services_h2: 'My services',
      cat_branding: 'Branding',
      cat_branding_1: 'Brand Identity & Strategy',
      cat_branding_2: 'Logo Design',
      cat_branding_3: 'Naming & Positioning',
      cat_branding_4: 'Brand Guidelines',
      cat_visual: 'Visual Design',
      cat_visual_1: 'Illustration',
      cat_visual_2: 'Photo Manipulation',
      cat_visual_3: 'Poster & Print Design',
      cat_visual_4: 'Social Media Graphics',
      cat_content: 'Content & Campaigns',
      cat_content_1: 'Ad Campaigns',
      cat_content_2: 'YouTube Thumbnails',
      cat_content_3: 'Campaign Concept & Direction',
      cat_strategy: 'Strategy',
      cat_strategy_1: 'Brand Research',
      cat_strategy_2: 'Positioning & Messaging Strategy',
      cat_strategy_3: 'Market & Competitor Analysis',
      stat_1_num: '1M+',
      stat_1_desc: "Users and viewers reached through work I've designed",
      stat_2_num: '50+',
      stat_2_desc: "Businesses and creators I've worked with",
      stat_3_num: '5+',
      stat_3_desc: 'Countries where my work has been published',
      about_h2: 'About me',
      about_p1: "My name is Atef, a freelance designer based in Cairo. I'm an engineering graduate, but design has always been the thing that pulled at me, long before it became a career.",
      about_p2: 'It started as a teenager, making photo manipulation posters. That turned professional between 2020 and 2022, designing for YouTube creators and channels—mostly US based, with multiple channels having millions of subscribers, including one with over 15 million.',
      about_p3: "From there, my focus shifted toward what I care about most now: building brands, developing strategy, and giving businesses an identity that actually means something. Since then, I've worked with businesses across Egypt and around the world, helping them become brands worth remembering.",
      contact_h2: 'Contact',
      contact_p: "Available for new projects. Get in touch and I'll get back to you within a couple of days.",
      contact_email: 'Email',
      contact_phone: '+201225277824',
      contact_phone_label: 'Phone number : ',
      contact_ig: 'Instagram',
      contact_wa: 'WhatsApp',
      contact_be: 'Behance',
      get_in_touch: 'Get in touch',
      have_questions: 'Have any questions ?',
      section_my_work: 'My work',
      back_to_work: '← Back to work',
      direction_title: 'Direction',
      next_project_prefix: 'Next project: ',
      back_to_all_work: '← Back to all work',
      lang_btn_text: 'عربي',
      lang_btn_title: 'التحويل إلى العربية',
      theme_btn_title: 'Toggle dark mode',
    },
    ar: {
      nav_work: 'أعمالي',
      nav_services: 'خدماتي',
      nav_about: 'نبذة عني',
      nav_contact: 'تواصل معي',
      hero_h1: 'كل علامة تجارية تستحق شخصية حقيقية.',
      hero_p: 'أصمم هويات بصرية كأنها شخصية حقيقية، وليست مجرد علامة تجارية.',
      view_full_project: 'عرض المشروع كاملاً',
      services_h2: 'خدماتي',
      cat_branding: 'بناء الهوية',
      cat_branding_1: 'استراتيجية وبناء الهوية التجارية',
      cat_branding_2: 'تصميم الشعارات',
      cat_branding_3: 'التسمية والتموضع في السوق',
      cat_branding_4: 'أدلة الهوية البصرية',
      cat_visual: 'التصميم البصري',
      cat_visual_1: 'الرسوم الإيضاحية',
      cat_visual_2: 'معالجة الصور الرقمية',
      cat_visual_3: 'تصميم الملصقات والمطبوعات',
      cat_visual_4: 'تصاميم منصات التواصل',
      cat_content: 'المحتوى والحملات',
      cat_content_1: 'الحملات الإعلانية',
      cat_content_2: 'صور يوتيوب المصغرة',
      cat_content_3: 'فكرة وتوجيه الحملات',
      cat_strategy: 'الاستراتيجية',
      cat_strategy_1: 'أبحاث العلامات التجارية',
      cat_strategy_2: 'صياغة الرسائل والتموضع',
      cat_strategy_3: 'تحليل السوق والمنافسين',
      stat_1_num: '+1M',
      stat_1_desc: 'مستخدم ومشاهد وصلت إليهم الأعمال التي صممتها',
      stat_2_num: '+50',
      stat_2_desc: 'شركة وصانع محتوى تشرفت بالعمل معهم',
      stat_3_num: '+5',
      stat_3_desc: 'دول نُشرت فيها تصاميمي حول العالم',
      about_h2: 'نبذة عني',
      about_p1: 'اسمي عاطف، مصمم حر أعيش في القاهرة. تخرجت من كلية الهندسة، لكن التصميم كان دائماً الشغف الحقيقي الذي يجذبني، قبل وقت طويل من أن يصبح مساري المهني.',
      about_p2: 'بدأت الرحلة في سن المراهقة بتصميم بوسترات معالجة الصور الرقمية. تحول ذلك إلى مسار احترافي بين عامي 2020 و2022 بتصميم أعمال لصناع محتوى وقنوات يوتيوب — معظمها في الولايات المتحدة، بقنوات تمتلك ملايين المشتركين، إحداها تتجاوز 15 مليون مشترك.',
      about_p3: 'ومن هناك، تحول تركيزي نحو ما أهتم به أكثر اليوم: بناء العلامات التجارية، وتطوير الاستراتيجيات، ومنح المشاريع هوية متكاملة تحمل معنى حقيقياً. منذ ذلك الحين، عملت مع شركات في مصر وحول العالم، لمساعدتها على أن تصبح علامات تجارية تستحق أن تُتذكَر.',
      contact_h2: 'تواصل معي',
      contact_p: 'متاح للمشاريع الجديدة. تواصل معي وسأرد عليك خلال يومين.',
      contact_email: 'البريد الإلكتروني',
      contact_phone: '+201225277824',
      contact_phone_label: 'رقم الهاتف : ',
      contact_ig: 'انستغرام',
      contact_wa: 'واتساب',
      contact_be: 'بيهانس',
      get_in_touch: 'تواصل معي',
      have_questions: 'هل لديك أي استفسار؟',
      section_my_work: 'أعمالي',
      back_to_work: 'العودة إلى الأعمال ←',
      direction_title: 'التوجيه الإبداعي',
      next_project_prefix: 'المشروع التالي: ',
      back_to_all_work: 'العودة إلى كافة الأعمال ←',
      lang_btn_text: 'EN',
      lang_btn_title: 'Switch to English',
      theme_btn_title: 'تبديل المظهر الداكن/الفاتح',
    },
  };

  const PROJECT_TRANSLATIONS = {
    pepete: {
      title: 'بيبيتي',
      shortDesc: 'مخبز وكافيه صغير بطابع عصري، تديره صاحبته الشابة التي تنعكس شخصيتها في كل تفصيلة من العلامة.',
      description: [
        'بيبيتي مخبز وكافيه صغير بطابع عصري، تديره صاحبته الشابة التي تنعكس شخصيتها في كل تفصيلة من العلامة: مرحة، فيها شقاوة خفيفة، وصادقة مع نفسها بلا تكلف. وطبعًا، الكرواسون عندها ممتاز.'
      ],
      direction: [
        'الهوية مبنية لتعبّر عن حرية العلامة. بدل ما تلتزم بأسلوب بصري واحد، بيبيتي استعارت ثقة صاحبتها في وضع قواعدها الخاصة: صاخبة، مرحة، وفيها فوضى جميلة بشكل مقصود. الهدف كان استحضار إحساس أول مرة تدخل فيها من الباب، فرحة نقية تقريبًا طفولية، من النوع اللي مش محتاج إذن عشان يوجد.',
        'استخدام مجموعة ألوان واسعة وغير مقيدة كان مقصودًا. بيبيتي مش موجهة لفئة عملاء معينة، هي محايدة تمامًا، وده كان تحدي كبير جدًا أثناء تصميم هوية العلامة، لكنه في النهاية اللي خلاها ممتعة.'
      ]
    },
    era: {
      title: 'إرَا',
      shortDesc: 'شركة استثمار عقاري وسمسرة تعمل في القاهرة الجديدة، لتضع معيارًا جديدًا بدل ما تتبع اللي موجود.',
      description: [
        'إيرا شركة استثمار عقاري وسمسرة تعمل في القاهرة الجديدة، وهي علامة جديدة بالفعل دخلت السوق لتضع معيارًا جديدًا بدل ما تتبع اللي موجود.'
      ],
      direction: [
        'الهوية مبنية بشكل إنشائي حرفيًا. الشعار بيتقرأ زي كتلة من المباني: حاد، إنشائي، وقادر على التحمل. كل زاوية بين الحروف مقصودة، مقصوصة بنفس الدقة اللي تتوقعها من العمارة مش من الخط. الثقة الهندسية دي هي الرسالة كلها، وكأن الشعار والعلامة نفسها مبنيين على أرض صلبة.',
        'اللون بيحمل نفس النغمة. الأحمر القوي على الأسود الداكن مش بيطلب إعجابك، هو بيفرض انتباهك، زي ما تفرضه أفق المدينة بالليل. ومع شعار الحملة "A Brand New Era"، العلامة بتحط نفسها بالظبط في المكان اللي الاسم بيقوله: مش تطوير لحاجة قديمة، لكن معيار جديد تمامًا، وده مناسب لسوق زي القاهرة الجديدة لسه بيُبنى فعليًا.'
      ]
    },
    'buy-me-a-tea': {
      title: 'واحد شاي',
      shortDesc: 'النسخة المصرية من منصة Buy Me a Coffee العالمية، لدعم الفريلانسرز وصنّاع المحتوى من متابعيهم.',
      description: [
        'واحد شاي (Buy Me a Tea) هو النسخة المصرية من منصة Buy Me a Coffee العالمية، منصة يقدر فيها الفريلانسرز وصنّاع المحتوى يستقبلوا دعم وإكراميات من متابعي شغلهم.'
      ],
      direction: [
        'التوجه هنا مختلف مش بس في اللغة، لكن في الثقافة نفسها. الفريلانس لسه مفهوم جديد نسبيًا في مصر، من غير العقود اللي أسسته في أماكن تانية. منصة موجهة لخدمة الفئة دي كان لازم تحس شبابية وصاخبة وحيّة، حاجة بتتكلم بلغة جيل لسه بيكتشف الطريق ده بنفسه.',
        'عشان كده الهوية اعتمدت بشكل كامل على ألوان جريئة ومسيطرة وطابع رسومي مرسوم باليد. من رمز كوباية الشاي لحد الخط نفسه، كل حاجة اتبنت باليد مش من خلال أنظمة شبكية جامدة، فوضوية بشكل مقصود. الفوضى دي بتعمل حاجتين في نفس الوقت: بتلفت انتباه الجمهور الشاب في فييد مزدحم، والأهم إنها بتشبه حرفة الفريلانسر نفسه، فالتصميم كله حاسس إنه لوحة رسم مصنوعة باليد. وفعلًا هو كده، الشعار كله مرسوم باليد لكن منفذ رقميًا.'
      ]
    },
    'alwaai-hayat': {
      title: 'أكاديمية الوعي حياة',
      shortDesc: 'منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم.',
      description: [
        'أكاديمية الوعي حياة منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم. هدفها إنها ترشد الناس خلال أصعب مراحل التحول في الحياة نحو إحساس أوضح وأكثر ثباتًا بالذات.'
      ],
      direction: [
        'الهوية مبنية بنفس النية اللي بيتبني بيها أي منظمة غير ربحية: بسيطة، متعددة الألوان، وقوية. مفيش حاجة كان لازم تكون معقدة، الرسالة نفسها، الوعي والتجدد، كان لازم توصل من أول نظرة.',
        'الشعار تصوير حديث لزهرة اللوتس، الرمز اللي كان بيمثل في مصر القديمة البعث والتجدد، حياة جديدة بعد إعادة الخلق. بالطريقة اللي رُسمت بيها هنا، اللوتس بيتحول كمان لشمس شارقة، إشارة أعم للبداية الجديدة. الأوراق المفتوحة المتعددة الخطوط ليها معنى تاني كمان، بتتقرأ كذراعين مفتوحتين، مرحّبة ومطمئنة، وهو بالظبط الإحساس اللي العلامة عايزة حد يحسه لحظة ما يفكر إنه يطلب المساعدة.'
      ]
    },
    'الوعي حياة': {
      title: 'أكاديمية الوعي حياة',
      shortDesc: 'منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم.',
      description: [
        'أكاديمية الوعي حياة منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم. هدفها إنها ترشد الناس خلال أصعب مراحل التحول في الحياة نحو إحساس أوضح وأكثر ثباتًا بالذات.'
      ],
      direction: [
        'الهوية مبنية بنفس النية اللي بيتبني بيها أي منظمة غير ربحية: بسيطة، متعددة الألوان، وقوية. مفيش حاجة كان لازم تكون معقدة، الرسالة نفسها، الوعي والتجدد، كان لازم توصل من أول نظرة.',
        'الشعار تصوير حديث لزهرة اللوتس، الرمز اللي كان بيمثل في مصر القديمة البعث والتجدد، حياة جديدة بعد إعادة الخلق. بالطريقة اللي رُسمت بيها هنا، اللوتس بيتحول كمان لشمس شارقة، إشارة أعم للبداية الجديدة. الأوراق المفتوحة المتعددة الخطوط ليها معنى تاني كمان، بتتقرأ كذراعين مفتوحتين، مرحّبة ومطمئنة، وهو بالظبط الإحساس اللي العلامة عايزة حد يحسه لحظة ما يفكر إنه يطلب المساعدة.'
      ]
    },
    '': {
      title: 'أكاديمية الوعي حياة',
      shortDesc: 'منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم.',
      description: [
        'أكاديمية الوعي حياة منظمة لتدريب الحياة موجهة للآباء الجدد والمتزوجين حديثًا والأفراد اللي حاسين إنهم تايهين في حياتهم. هدفها إنها ترشد الناس خلال أصعب مراحل التحول في الحياة نحو إحساس أوضح وأكثر ثباتًا بالذات.'
      ],
      direction: [
        'الهوية مبنية بنفس النية اللي بيتبني بيها أي منظمة غير ربحية: بسيطة، متعددة الألوان، وقوية. مفيش حاجة كان لازم تكون معقدة، الرسالة نفسها، الوعي والتجدد، كان لازم توصل من أول نظرة.',
        'الشعار تصوير حديث لزهرة اللوتس، الرمز اللي كان بيمثل في مصر القديمة البعث والتجدد، حياة جديدة بعد إعادة الخلق. بالطريقة اللي رُسمت بيها هنا، اللوتس بيتحول كمان لشمس شارقة، إشارة أعم للبداية الجديدة. الأوراق المفتوحة المتعددة الخطوط ليها معنى تاني كمان، بتتقرأ كذراعين مفتوحتين، مرحّبة ومطمئنة، وهو بالظبط الإحساس اللي العلامة عايزة حد يحسه لحظة ما يفكر إنه يطلب المساعدة.'
      ]
    },
    'juhayna-redesign': {
      title: 'جهينة',
      shortDesc: 'واحدة من أكثر العلامات التجارية شهرة في مصر في مجال الألبان والعصائر، معروفة من 1983 بعلامتها المميزة.',
      description: [
        'جهينة واحدة من أكثر العلامات التجارية شهرة في مصر في مجال الألبان والعصائر، معروفة من 1983 بعلامتها المميزة على شكل زهرة والوعد اللي بيحمله شعارها "Caring Everyday".'
      ],
      direction: [
        'إعادة بناء الهوية تحتاج مهارة مختلفة عن بناء علامة من الصفر. مش مجرد تحسين للعلامة، لكن تحديد صحيح لإيه اللي فعلًا محتاج يتغير، والأهم، إيه اللي لازم يفضل زي ما هو بالظبط.',
        'في حالة جهينة، شكل الزهرة وتدرجها من أكثر العلامات اللي الناس في مصر بتتعرف عليها فورًا. تغييره مكانش خيار، والتوجه ده مغيروش. بدل من كده، اتضافت شعاع ضوء في نص الزهرة، واتعاد صياغة التدرجات نفسها عشان تحس أكثر طبيعية وأقل تسطحًا وأكثر حيوية، مع الحفاظ على هويتها اللي متعرفش إلا إنها جهينة.',
        'الخط اتبع نفس الفلسفة. الخط الحالي مصنوع بإتقان فعلاً، الياء المبتسمة في العربي والإنجليزي لمسة جميلة، لكن أشكال الحروف نفسها حاسة شوية جامدة، والعربي والإنجليزي مش حاسين إنهم من نفس عائلة الخطوط. التوجه ده بيقرب المسافة دي: الخطين دلوقتي بيشتركوا في نفس الإغلاقات والزوايا، وكل منهم فيه انحناءة خفيفة على طول الكلمة، بتردد نفس الابتسامة المختبئة في الياء، لكن ممتدة على الخط كله بدل حرف واحد، وبطريقة أقل مباشرة وأكثر رقة.'
      ]
    },
    'urban-oasis': {
      title: 'أوربان اواسِس',
      shortDesc: 'مفهوم لعلامة أسلوب حياة تجمع بين الزراعة الحضرية عالية التقنية ومنتجات الحياة المستدامة.',
      description: [
        'أوربان أوازيس مفهوم لعلامة أسلوب حياة تجمع بين الزراعة الحضرية عالية التقنية ومنتجات الحياة المستدامة.'
      ],
      direction: [
        'بما أن أوربان أوازيس تجمع بين التكنولوجيا والبيئة، ركزت لغة التصميم على البساطة الحديثة المستوحاة من الأشكال الطبيعية. الشعار يشبه إناء على شكل حرف U يحمل نخلة مرسومة بأسلوب البكسل، في إشارة إلى الواحة نفسها. العلامة معقدة في فكرتها لكن بسيطة في تنفيذها، وده بيعكس هوية العلامة ككل: مزيج البساطة والخضرة الطبيعية والألوان النيون المرسومة بهندسة بكسلية دقيقة هو جوهر العلامة تمامًا.',
        'لو نظرت للصورة الظلية عن قرب، هتلاقي ابتسامة مختبئة في الإناء، وذراعين مفتوحتين مكوّنتين من الأوراق. الفكرتين دول كانوا الشرارة الأولى، أول حاجة جت في البال لما قريت البريف. باقي الهوية فضلت بسيطة بشكل مقصود. حتى اللوحة الإعلانية مصممة على زجاج شفاف عشان الأشجار اللي وراها تبان، وده خلى الفكرة توضح نفسها بدل ما تُشرح بالكلام.'
      ]
    }
  };

  window.SITE_I18N = I18N;
  window.PROJECT_TRANSLATIONS = PROJECT_TRANSLATIONS;

  // 3. Translation Applier
  function applyTranslations(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update all static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.closest('.topnav')) {
          const words = dict[key].trim().split(/\s+/);
          el.innerHTML = words.map((w) => `<span class="nav-word">${w}</span>`).join(' ');
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update arrows in touch buttons
    document.querySelectorAll('.hero-touch-btn .project-strip__btn-arrow, .project-touch-btn .project-strip__btn-arrow').forEach((arrow) => {
      arrow.textContent = lang === 'ar' ? '←' : '→';
    });

    // Update language toggle button text and title
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = dict.lang_btn_text;
      langBtn.title = dict.lang_btn_title;
      langBtn.setAttribute('aria-label', dict.lang_btn_title);
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.title = dict.theme_btn_title;
      themeBtn.setAttribute('aria-label', dict.theme_btn_title);
    }

    // Custom updates for Homepage dynamic content
    if (typeof window.updateHomepageTranslations === 'function') {
      window.updateHomepageTranslations(lang);
    }

    // Custom updates for Project page dynamic content
    if (typeof window.updateProjectTranslations === 'function') {
      window.updateProjectTranslations(lang);
    }
  }

  // 4. Logo updater for dark/light mode
  function updateLogos(theme) {
    const isDark = theme === 'dark';
    const targetSrc = isDark ? 'assets/logo-dark.png' : 'assets/logo.png';
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && (src.includes('logo.png') || src.includes('logo-dark.png'))) {
        img.src = targetSrc;
      }
    });
  }

  // 5. Toggle functions
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem(THEME_KEY, newTheme);
    updateLogos(newTheme);
  }

  function toggleLang() {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(LANG_KEY, newLang);
    applyTranslations(newLang);
  }

  window.toggleTheme = toggleTheme;
  window.toggleLang = toggleLang;
  window.applyTranslations = applyTranslations;
  window.updateLogos = updateLogos;

  // 6. Setup event listeners when DOM is ready
  function initControls() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', toggleLang);
    }

    const currentLang = localStorage.getItem(LANG_KEY) || 'en';
    applyTranslations(currentLang);

    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    updateLogos(currentTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initControls);
  } else {
    initControls();
  }
})();
