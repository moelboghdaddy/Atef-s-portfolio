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
      contact_ig: 'Instagram',
      contact_wa: 'WhatsApp',
      contact_be: 'Behance',
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
      hero_p: 'أصمم هويات بصرية تشبه كائناً حياً، وليست مجرد علامة ثابتة.',
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
      contact_ig: 'انستغرام',
      contact_wa: 'واتساب',
      contact_be: 'بيهانس',
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
      shortDesc: 'مخبز عصري ومقهى في القاهرة يشتهر بالكرواسون الهش والمعجنات الصباحية والقهوة المختصة.',
      description: [
        'بيبيتي هو مخبز عصري ومقهى في القاهرة، يشتهر بالكرواسون الهش والمعجنات الصباحية الفاخرة والقهوة المختصة المحضرة بعناية. بدأت القصة مع مؤسس شاب مفعم بالحيوية وشغف حقيقي بالضيافة، وسرعان ما بنى المخبز قاعدة وفية من الزبائن الذين يقدرون أساليب الخبز الأوروبية الأصيلة دون أي تصنّع أو بساطة باهتة.',
        "كان الهدف الاستراتيجي هو ابتكار شخصية مميزة للعلامة تعكس روح المؤسس الجريئة والمرحة بدلاً من الانصهار في قوالب المقاهي التقليدية. صُمم 'بيبيتي' ليكون ملاذاً حيوياً في الحي، وركناً مرحاً يلتقي فيه فن المخبوزات الجاد مع أجواء مبهجة ودافئة تبقى في الذاكرة وتنبض بالمتعة الحقيقية.",
      ],
      direction: [
        "بُنيت الهوية لتعبّر عن حرية العلامة وانطلاقها. بدلاً من الاستقرار في مسار بصري تقليدي، تستعير 'بيبيتي' ثقة مؤسسها لتضع قواعدها الخاصة: جريئة، مبهجة، وفوضوية قليلاً بأفضل معنى ممكن. كان الهدف هو التقاط ذلك الشعور الصافي الذي يغمرك عند دخولك للمرة الأولى، فرحة طفولية عفوية تنطلق دون استئذان.",
        "اختيار لوحة الألوان الواسعة وغير المقيدة كان متعمداً. 'بيبيتي' لا تستهدف فئة معينة، بل هي محايدة تماماً، وهو ما شكّل تحدياً كبيراً أثناء تصميم الهوية لكنه في النهاية ما جعلها ممتعة للغاية.",
        'أما عن شعارهم وصوتهم؟ لديهم كل ما تحتاجه. ماذا عساي أن أقول؟',
      ],
    },
    era: {
      title: 'إرَا',
      shortDesc: 'شركة استثمار عقاري ووساطة تجارية رائدة بالقاهرة الجديدة لإدارة الاستحواذات والمحافظ العقارية.',
      description: [
        "'إرًا' هي شركة استثمار عقاري ووساطة تجارية رائدة تتخذ من القاهرة الجديدة مقراً لها. تأسست الشركة لترسيخ بصمة متميزة في سوق عقاري سريع التنافس، وتقدم خدمات استشارية مؤسسية وانتقاءً للمحافظ العقارية واستحواذات استراتيجية للمستثمرين الذين يبحثون عن فرص تطويرية ذات قيمة عالية. بدلاً من التماهي مع أساليب البيع التقليدية، صُممت 'إرًا' كقوة مؤسسية موثوقة.",
        "احتاجت الشركة إلى حضور يعكس الثبات المطلق والشفافية والاستدامة المعمارية. وفي مشهد عمراني سريع النمو تفوق فيه الوعود التجارية الواقع الملموس، تميزت 'إرًا' بالاعتماد على الموثوقية الاستثمارية والتحليل الدقيق، لتكون الخيار الأول للعملاء الراغبين في بناء ثروات عائلية ومؤسسية مستدامة في العاصمة المصرية.",
      ],
      direction: [
        'الهوية مبنية بشكل هندسي معماري بالمعنى الحرفي. الشعار يشبه كتلاً بنائية متماسكة: حادة، هيكلية، وحاملة للأثقال. كل زاوية بين الحروف متعمدة وقُطعت بدقة تتوقعها من الهندسة المعمارية لا مجرد خطوط مطبعية. هذه الثقة الهندسية هي جوهر الرسالة، وكأن الشعار — والعلامة ككل — يقفان على أرض صلبة راسخة.',
        'اللون يحمل نفس النبرة القوية؛ فالأحمر الجريء على الخلفية السوداء الداكنة يفرض حضوره تماماً كأفق المدينة ليلاً. ومع شعار الحملة \'حقبة جديدة كلياً\'، تؤكد الهوية مكانتها: ليست مجرد تطوير لما هو قديم، بل معيار جديد تماماً يناسب سوقاً مثل القاهرة الجديدة التي ما زالت تُبنى وتتطور.',
      ],
    },
    'buy-me-a-tea': {
      title: 'واحد شاي',
      shortDesc: 'النسخة المصرية لمنصة الدعم العالمية لدعم المبدعين والمصممين المستقلين بمصر.',
      description: [
        "منصة 'واحد شاي' هي النسخة المصرية لمنصة الدعم العالمية الشهيرة (Buy Me a Coffee). توفر المنصة مساحة رقمية مباشرة تتيح للمبدعين المستقلين والمصممين والفنانين والكتّاب تلقي الدعم والمكافآت التقديرية من جمهورهم ومتابعيهم. في مصر، ثقافة القهوة حاضرة، لكن كوب الشاي الساخن هو الطقس اليومي الأصيل الذي يجمع الناس في المقاهي واستوديوهات الإبداع.",
        "كان إنشاء علامة تجارية محلية لاقتصاد المبدعين يتطلب ترجمة مفهوم 'الدعم الرقمي' من قالبه الغربي المستورد إلى تعبير مصري دافئ ومألوف. فبدلاً من تقديم الدعم كمعاملة مالية جافة، تُصاغ المنصة كدعوة حميمة لشد كرسي والجلوس معاً وعزومة صديق على كوب شاي، احتفاءً بالجهد الإبداعي اليومي وجعل الامتنان المادي تجربة قريبة من القلب.",
      ],
      direction: [
        'التوجه الإبداعي هنا يتحدث بلغة وثقافة مختلفتين تماماً. العمل الحر لا يزال مفهوماً حديثاً نسبياً في مصر دون عقود من الألفة التي يتمتع بها في أماكن أخرى. لذا كان على المنصة التي تخدم هذا المجتمع أن تشعرهم بالشباب والحيوية والجرأة، وأن تخاطب جيلاً يبني مساره بنفسه.',
        'لذلك تعتمد الهوية بالكامل على ألوان مسيطرة وجريئة، وعنصر بصري مرسوم باليد بشكل عفوي. من علامة كوب الشاي إلى الشعار اللفظي، كل شيء مرسوم يدوياً بعيداً عن صرامة الشبكات الهندسية، مع لمسة فوضوية مقصودة تشبه مسودة الفنان ومكتب عمله النابض بالحياة.',
      ],
    },
    'alwaai-hayat': {
      title: 'الوعي حياة',
      shortDesc: 'مؤسسة مصرية متخصصة في الإرشاد النفسي والأسري وتطوير الذات.',
      description: [
        "مبادرة 'الوعي حياة' هي مؤسسة مصرية متخصصة في الإرشاد النفسي والأسري وتطوير الذات، تقدم استشارات متخصصة ودعماً نفسياً واعياً للأسر والأفراد. تأسست لدعم الأفراد خلال التحولات الحياتية الكبرى، وبدايات الزواج، وتربية الأبناء، عبر ورش عمل وجلسات فردية تُعنى بتعزيز المرونة النفسية والاتزان العاطفي والاستقرار الأسري الدائم.",
        "قد يبدو طلب الدعم النفسي أمراً صعباً أو محاطاً بالحرج في بعض المجتمعات التقليدية؛ لذا جاءت 'الوعي حياة' كملاذ آمن ورحيم يزيل الرهبة عن الإرشاد النفسي، ويقدم حلولاً عملية تساعد الأفراد والأزواج على استعادة الوضوح العاطفي، وتعميق الوعي بالذات، وبناء علاقات صحية متينة بكرامة ودفء وسلام داخلي.",
      ],
      direction: [
        'بُنيت الهوية بالبساطة والعمق اللذين تتميز بهما المنظمات الإنسانية الكبرى: واضحة، متناسقة، وقوية التأثير. لم يكن ثمة داعٍ للتعقيد، بل كان لا بد لرسالة الوعي والتجدد أن تصل بلمحة بصر.',
        'الشعار يمثل صياغة عصرية لزهرة اللوتس، التي كانت في مصر القديمة رمزاً للولادة الجديدة والانبعاث وتجدد الحياة. كما تدمج في شكلها شمس الإشراق، إشارة عالمية ليوم جديد. وتحمل أوراق الزهرة المفتوحة معنى إضافياً يشبه الأذرع المفتوحة التي تحتضن وتطمئن، وهو بالضبط ما تشعر به لحظة تواصلك وطلبك للمساعدة.',
      ],
    },
    '': {
      title: 'الوعي حياة',
      shortDesc: 'مؤسسة مصرية متخصصة في الإرشاد النفسي والأسري وتطوير الذات.',
      description: [
        "مبادرة 'الوعي حياة' هي مؤسسة مصرية متخصصة في الإرشاد النفسي والأسري وتطوير الذات، تقدم استشارات متخصصة ودعماً نفسياً واعياً للأسر والأفراد. تأسست لدعم الأفراد خلال التحولات الحياتية الكبرى، وبدايات الزواج، وتربية الأبناء، عبر ورش عمل وجلسات فردية تُعنى بتعزيز المرونة النفسية والاتزان العاطفي والاستقرار الأسري الدائم.",
        "قد يبدو طلب الدعم النفسي أمراً صعباً أو محاطاً بالحرج في بعض المجتمعات التقليدية؛ لذا جاءت 'الوعي حياة' كملاذ آمن ورحيم يزيل الرهبة عن الإرشاد النفسي، ويقدم حلولاً عملية تساعد الأفراد والأزواج على استعادة الوضوح العاطفي، وتعميق الوعي بالذات، وبناء علاقات صحية متينة بكرامة ودفء وسلام داخلي.",
      ],
      direction: [
        'بُنيت الهوية بالبساطة والعمق اللذين تتميز بهما المنظمات الإنسانية الكبرى: واضحة، متناسقة، وقوية التأثير. لم يكن ثمة داعٍ للتعقيد، بل كان لا بد لرسالة الوعي والتجدد أن تصل بلمحة بصر.',
        'الشعار يمثل صياغة عصرية لزهرة اللوتس، التي كانت في مصر القديمة رمزاً للولادة الجديدة والانبعاث وتجدد الحياة. كما تدمج في شكلها شمس الإشراق، إشارة عالمية ليوم جديد. وتحمل أوراق الزهرة المفتوحة معنى إضافياً يشبه الأذرع المفتوحة التي تحتضن وتطمئن، وهو بالضبط ما تشعر به لحظة تواصلك وطلبك للمساعدة.',
      ],
    },
    'juhayna-redesign': {
      title: 'جهينة',
      shortDesc: 'إعادة تصميم مستقلة ومبتكرة لأعرق علامة ألبان وعصائر بمصر.',
      description: [
        "جهينة هي صرح الأغذية والمشروبات المصري الأبرز، وعلامة عريقة رافقت العائلات المصرية منذ عام 1983 بمنتجات الألبان الطازجة، الزبادي، والعصائر الطبيعية. لأكثر من أربعة عقود، احتلت زهرة جهينة الرباعية الشهيرة وشعارها 'كل يوم بنهتم' مكانة أصيلة على موائد الإفطار وثلاجات ملايين البيوت المصرية، كرمز موثوق للراحة المنزلية والجودة الصادقة.",
        'ومع تطور المشهد البصري المعاصر واشتداد المنافسة في الأسواق، تحتاج العلامات الرائدة إلى تجديد حضورها بذكاء دون المساس برابطتها التاريخية مع المستهلك. كان الهدف من هذا المفهوم المستقل لإعادة التصميم هو الارتقاء بالحضور البصري لجهينة، وإضفاء لمسة حداثية راقية على عبواتها ونقاط اتصالها الاستهلاكية بوضوح وأناقة عالية.',
        'احتراماً للرابطة العاطفية العميقة التي تجمع المستهلك المصري بتغليف جهينة التاريخي، يحافظ هذا التصميم على الركائز الأساسية للعلامة مع حل التوترات الطباعية واستقامة التدرجات اللونية، لتخرج الهوية بحلة عصرية خالدة تحافظ على ريادتها كعلامة الألبان والعصائر المفضلة في كل بيت.',
      ],
      direction: [
        'إعادة تصميم العلامات التاريخية تتطلب مهارة خاصة تفوق بناء العلامة من الصفر؛ فالأمر لا يتعلق بتغيير كل شيء، بل بمعرفة ما يحتاج للتطوير وما يجب الحفاظ عليه بحرص.',
        'في حالة جهينة، بتلات الزهرة وتدرجها اللوني هما من أكثر العلامات رسوخاً في الذاكرة البصرية بمصر. المساس بهما لم يكن خياراً، بل تم إدخال شعاع ضوء ناعم في مركز الزهرة مع تحسين تدرجات الألوان لتبدو أكثر حيوية ونضارة.',
        'أما الخط العربي والإنجليزي، فرغم جودة الشعار الأصلي وبسمة حرف الياء، إلا أن الحروف كانت تفتقر إلى الانسيابية بين اللغتين. ردم هذا التصميم تلك الفجوة: حيث تشترك اللغتان في نفس الزوايا والنهايات والانحناءات الرقيقة، ممتدة بالابتسامة عبر كامل الكلمة بأسلوب ناعم وأنيق.',
      ],
    },
    'urban-oasis': {
      title: 'أوربن اوايسِس',
      shortDesc: 'علامة مستدامة لدمج النباتات والزراعة المائية الذكية بالمنازل الحضرية.',
      description: [
        "'أوربن اوايسِس' هي علامة عصرية مستدامة تهدف إلى إعادة ربط سكان المدن بالطبيعة الخضراء عبر أنظمة الزراعة المائية الذكية داخل المنازل، والأواني المعمارية، والمنتجات البيئية. مع تزايد الكثافة الحضرية وابتعاد الشقق السكنية عن الطبيعة، تقدم العلامة حلولاً بيئية سهلة العناية تحوّل المساحات الإسمنتية إلى واحات منزلية حية تنقي الهواء وتنعش الحياة اليومية.",
        'تجمع العلامة بين الكفاءة التقنية للزراعة المؤتمتة والجماليات الهادئة للتصميم الداخلي المعاصر، مما يمكّن سكان المدن من زراعة أعشابهم ونباتاتهم مباشرة على جدران منازلهم. ومن خلال الاعتماد على المواد المعاد تدويرها والحفاظ على المياه والخطوط النحتية البسيطة، تعكس العلامة فلسفة بيئية واعية تجعل النباتات والإنسان والتصميم في تناغم تام.',
      ],
      direction: [
        "نظراً لأن 'أوربن اوايسِس' تدمج التكنولوجيا بالبيئة، تركز لغة التصميم على البساطة المعمارية المستوحاة من الطبيعة. الشعار يشبه حوض نباتات على شكل حرف U يحتضن نخلة بأسلوب البكسل، في إشارة إلى فكرة الواحة ذاتها. هذا المزيج بين الخضرة الطبيعية والهندسة الرقمية هو لب العلامة وجوهرها.",
        'عند التدقيق في الشعار ستلمح ابتسامة لطيفة في الحوض، وأذرعاً مفتوحة في سعف النخيل، وهي الفكرة الأولى التي لمعت عند قراءة موجز المشروع. وكل شيء آخر في الهوية ظل بسيطاً ومدروساً، حتى الإعلانات الطرقية صُممت على ألواح زجاجية شفافة لتمر الأشجار من خلفها وتتحدث الطبيعة عن نفسها.',
      ],
    },
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
        el.textContent = dict[key];
      }
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
