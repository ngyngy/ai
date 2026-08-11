/**
 * AI导航 - 多语言国际化模块
 * 支持: 中文(zh-CN)、English(en)、Deutsch(de)、Français(fr)、Español(es)、日本語(ja)、한국어(ko)
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['zh-CN', 'en', 'de', 'fr', 'es', 'ja', 'ko'];

  var LANG_LABELS = {
    'zh-CN': '中文',
    'en': 'English',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'ja': '日本語',
    'ko': '한국어'
  };

  // ========================= 分类名翻译映射 =========================
  // 数据库中的分类名为中文，此处映射到各语言翻译
  var CAT_TRANSLATIONS = {
    '热门推荐':     { en:'Hot Picks',        de:'Beliebte Empfehlungen', fr:'Recommandations',         es:'Recomendaciones',         ja:'おすすめ',             ko:'인기 추천' },
    '龙虾与Agent':  { en:'Lobster & Agent',  de:'Hummer & Agent',        fr:'Homard & Agent',         es:'Langosta & Agente',      ja:'ロブスターとエージェント', ko:'랍스터와 에이전트' },
    'AI搜索':       { en:'AI Search',        de:'KI-Suche',              fr:'Recherche IA',            es:'Búsqueda IA',            ja:'AI検索',                 ko:'AI 검색' },
    'AI聊天':       { en:'AI Chat',          de:'KI-Chat',               fr:'Chat IA',                 es:'Chat IA',                ja:'AIチャット',              ko:'AI 채팅' },
    'AI绘画':       { en:'AI Drawing',       de:'KI-Zeichnen',           fr:'Dessin IA',               es:'Dibujo IA',              ja:'AIお絵かき',              ko:'AI 그림' },
    'AI写作':       { en:'AI Writing',       de:'KI-Schreiben',          fr:'Écriture IA',             es:'Escritura IA',           ja:'AI文章作成',              ko:'AI 글쓰기' },
    'AI视频':       { en:'AI Video',         de:'KI-Video',              fr:'Vidéo IA',                es:'Video IA',               ja:'AI動画',                  ko:'AI 비디오' },
    'AI音视频':     { en:'AI Audio/Video',   de:'KI-Audio/Video',        fr:'Audio/Vidéo IA',          es:'Audio/Video IA',         ja:'AI音声動画',               ko:'AI 오디오비디오' },
    'AI设计':       { en:'AI Design',        de:'KI-Design',             fr:'Design IA',               es:'Diseño IA',              ja:'AIデザイン',               ko:'AI 디자인' },
    'AI办公':       { en:'AI Office',        de:'KI-Büro',               fr:'Bureau IA',               es:'Oficina IA',             ja:'AIオフィス',               ko:'AI 오피스' },
    'AI工具合集':   { en:'AI Tools Collection', de:'KI-Toolsammlung',    fr:'Collection d\'outils IA', es:'Colección IA',           ja:'AIツールコレクション',      ko:'AI 도구 모음' },
    'AI教育':       { en:'AI Education',     de:'KI-Bildung',            fr:'Éducation IA',            es:'Educación IA',           ja:'AI教育',                  ko:'AI 교육' },
    'AI医疗':       { en:'AI Healthcare',    de:'KI-Gesundheit',         fr:'Santé IA',                es:'Salud IA',               ja:'AI医療',                  ko:'AI 의료' },
    'AI金融':       { en:'AI Finance',       de:'KI-Finanzen',           fr:'Finance IA',              es:'Finanzas IA',            ja:'AI金融',                  ko:'AI 금융' },
    'AI游戏':       { en:'AI Gaming',        de:'KI-Spiele',             fr:'Jeux IA',                 es:'Juegos IA',              ja:'AIゲーム',                ko:'AI 게임' },
    'AI电商':       { en:'AI E-commerce',    de:'KI-E-Commerce',         fr:'E-commerce IA',           es:'E-commerce IA',          ja:'AI電子商取引',             ko:'AI 전자상거래' },
    'AI数据':       { en:'AI Data',          de:'KI-Daten',              fr:'Données IA',              es:'Datos IA',               ja:'AIデータ',                ko:'AI 데이터' },
    'AI营销':       { en:'AI Marketing',     de:'KI-Marketing',          fr:'Marketing IA',            es:'Marketing IA',           ja:'AIマーケティング',         ko:'AI 마케팅' },
    'AI翻译':       { en:'AI Translation',   de:'KI-Übersetzung',        fr:'Traduction IA',           es:'Traducción IA',          ja:'AI翻訳',                  ko:'AI 번역' },
    '糖果创意导航': { en:'Candy Creative',   de:'Süßigkeiten Kreativ',   fr:'Bonbons Créatifs',        es:'Dulces Creativos',       ja:'キャンディクリエイティブ',  ko:'캔디 크리에이티브' },
    '全部工具':     { en:'All Tools',        de:'Alle Tools',            fr:'Tous les outils',         es:'Todas las herramientas',  ja:'全ツール',              ko:'전체 도구' },
    'Skills':         { en:'Skills',            de:'Skills',                fr:'Compétences',             es:'Habilidades',             ja:'スキル',                  ko:'스킬' },
    'AI提示词':      { en:'AI Prompts',        de:'KI-Prompts',            fr:'Prompts IA',              es:'Prompts IA',              ja:'AIプロンプト',             ko:'AI 프롬프트' },
    'AI图像处理':    { en:'AI Image Processing', de:'KI-Bildverarbeitung',  fr:"Traitement d'image IA",  es:'Procesamiento IA',        ja:'AI画像処理',               ko:'AI 이미지 처리' },
    'UI设计':        { en:'UI Design',         de:'UI-Design',             fr:'Design UI',               es:'Diseño UI',               ja:'UIデザイン',               ko:'UI 디자인' },
    '平面设计':      { en:'Graphic Design',    de:'Grafikdesign',          fr:'Design graphique',        es:'Diseño gráfico',          ja:'グラフィックデザイン',     ko:'그래픽 디자인' },
    'AI智能写作':    { en:'AI Smart Writing',  de:'KI-Smart-Schreiben',    fr:'Écriture IA intelligente', es:'Escritura IA inteligente', ja:'AIスマートライティング',    ko:'AI 스마트 글쓰기' },
    '3D设计':        { en:'3D Design',         de:'3D-Design',             fr:'Design 3D',               es:'Diseño 3D',               ja:'3Dデザイン',              ko:'3D 디자인' },
    'AI学习':        { en:'AI Learning',       de:'KI-Lernen',             fr:'Apprentissage IA',        es:'Aprendizaje IA',          ja:'AI学習',                  ko:'AI 학습' },
    'AI编程助手':    { en:'AI Coding Assistant', de:'KI-Coding-Assistent', fr:'Assistant de code IA',    es:'Asistente de código IA',  ja:'AIコーディングアシスタント', ko:'AI 코딩 도우미' },
    'AI机构与达人':  { en:'AI Orgs & KOLs',    de:'KI-Organisationen',    fr:'Organisations IA',        es:'Organizaciones IA',       ja:'AI組織とインフルエンサー',  ko:'AI 기관 및 인플루언서' },
    'AI编程':        { en:'AI Coding',         de:'KI-Programmierung',     fr:'Programmation IA',        es:'Programación IA',         ja:'AIプログラミング',          ko:'AI 코딩' },
    // Header 导航特有标签 & 数据库中与映射表名称不完全一致的分类名
    '首页':          { en:'Home',              de:'Startseite',            fr:'Accueil',                 es:'Inicio',                  ja:'ホーム',                ko:'홈' },
    'AI编程开发':    { en:'AI Code Dev',       de:'KI-Codeentwicklung',    fr:'Dév. Code IA',            es:'Desarrollo IA',           ja:'AIコード開発',           ko:'AI 코드 개발' },
    'AI写作':        { en:'AI Writing',        de:'KI-Schreiben',          fr:'Écriture IA',             es:'Escritura IA',            ja:'AI文章作成',              ko:'AI 글쓰기' },
    'AI视频':        { en:'AI Video',          de:'KI-Video',              fr:'Vidéo IA',                es:'Video IA',                ja:'AI動画',                  ko:'AI 비디오' }
  };

  /**
   * 翻译分类名/导航标签
   * @param {string} chineseName - 中文分类名
   * @returns {string} 当前语言的翻译，如果没有翻译则返回原名
   */
  // Emoji regex: strips emoji prefix like "🔥 " → ""
  var RE_EMOJI_PREFIX = /^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{231A}-\u{23FF}\u{2702}-\u{27B0}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}][\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{231A}-\u{23FF}\u{2702}-\u{27B0}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]*\s*/u;

  function tCat(chineseName) {
    // 始终剥离 emoji 前缀，避免出现双图标（cat-icon-box + h2 各一个 emoji）
    var clean = chineseName.replace(RE_EMOJI_PREFIX, '');
    if (currentLang === 'zh-CN') return clean;
    var map = CAT_TRANSLATIONS[clean] || CAT_TRANSLATIONS[chineseName];
    if (!map) return clean;
    return map[currentLang] || clean;
  }

  /**
   * 翻译工具描述文字
   * @param {string} zhDesc - 中文描述
   * @returns {string} 当前语言的描述翻译
   */
  function tDesc(zhDesc) {
    if (!zhDesc || currentLang === 'zh-CN') return zhDesc;
    if (typeof window.DESC_TRANSLATIONS !== 'undefined') {
      var translated = window.DESC_TRANSLATIONS[zhDesc];
      if (translated) return translated;
    }
    return zhDesc;
  }

  // ========================= 翻译字典 =========================
  var DICT = {
    'zh-CN': {
      // 通用
      'site.name': 'AI导航',
      'site.slogan': '🦞 AI导航 — 发现优质AI工具，提升工作与创作效率',
      'site.desc': '精选全球数千款人工智能工具和应用，涵盖AI对话、AI绘画、AI编程、AI音视频等多个领域，为用户提供一站式的AI工具发现与导航服务。',
      'site.slogan_short': '🦞 AI导航',
      'site.desc_short': '发现更多优质AI工具，覆盖AI对话、绘画、编程等20+分类',

      // 导航
      'nav.home': '首页',
      'nav.all_categories': '全部分类',
      'nav.about': '关于我们',
      'nav.sitemap': '网站地图',

      // Hero
      'hero.title': 'AI导航',
      'hero.accent': '· 发现全球优质AI工具',
      'hero.subtitle': '最全AI工具体验平台，收录 ChatGPT / DeepSeek / Midjourney / Cursor 等数百款AI产品，一站式探索人工智能的无限可能',

      // 搜索
      'search.placeholder': '搜索你想要的 AI 工具…',
      'search.tab_local': '🔍 站内',
      'search.tab_baidu': '百度',
      'search.tab_google': 'Google',
      'search.no_result': '没有找到相关工具，试试其他关键词',
      'search.result_count': '找到 {count} 个相关工具',

      // 分类
      'category.all': '📋 全部工具',
      'category.empty': '暂无分类',
      'category.count_unit': ' 个',

      // 工具卡片
      'tool.hot': '热门',
      'tool.recommended': '推荐',
      'tool.visit': '访问',
      'tool.no_desc': '暂无描述',
      'tool.goto': '直达',
      'tool.view_detail': '查看 {title} 详细介绍',
      'tool.visit_site': '访问 {title}',

      // 详情页
      'detail.back': '← 返回首页',
      'detail.translating': '翻译中...',
      'detail.intro': '工具介绍',
      'detail.features': '核心特色',
      'detail.scenarios': '典型使用场景',
      'detail.pricing': '收费模式',
      'detail.tips': '使用技巧',
      'detail.visit_site': '访问官网',
      'detail.no_content': '暂无详细介绍',
      'detail.basic_info': '📋 基本信息',
      'detail.website': '🌐 官方网站',
      'detail.category': '📂 所属分类',
      'detail.browse_all': '浏览全部工具',
      'detail.related_tools': '🔗 相关工具推荐',
      'detail.hot': '🔥 热门',
      'detail.recommended': '⭐ 推荐',

      // 关于页
      'about.title': '关于 AI导航',
      'about.tagline': 'AI.txdd.cn — 您的 AI 工具导航专家',
      'about.no_content': '加载中…',

      // 页脚
      'footer.copyright': '© 2026 AI导航',

      // 语言
      'lang.switch': '切换语言',

      // 侧边栏
      'sidebar.all_tools': '📋 全部工具',
      'sidebar.submit': '📤 提交好站',

      // 提交好站表单
      'submit.title': '📤 推荐好站',
      'submit.title_label': '网站标题',
      'submit.url_label': '网址 URL',
      'submit.cat_label': '选择所属分类',
      'submit.desc_label': '网站简介',
      'submit.icon_label': '网站图标',
      'submit.contact_label': '联系方式',
      'submit.title_placeholder': '例如：ChatGPT',
      'submit.url_placeholder': '例如：https://chat.openai.com',
      'submit.desc_placeholder': '一句话介绍这个网站（选填）',
      'submit.icon_placeholder': '留空将自动获取 favicon，也可手动填写图片 URL',
      'submit.icon_hint': '输入网址后自动抓取，也支持手动粘贴图片链接',
      'submit.contact_placeholder': '选填，方便我们联系你（微信/QQ/邮箱）',
      'submit.select_cat': '-- 请选择分类 --',
      'submit.fetch': '🔍 自动抓取',
      'submit.fetching': '⏳ 抓取中...',
      'submit.connecting': '正在连接网站...',
      'submit.done': '✅ 完成',
      'submit.failed': '⚠️ 失败',
      'submit.refetch': '🔍 重新抓取',
      'submit.save': '提交推荐',
      'submit.cancel': '取消',
      'submit.saving': '提交中...',
      'submit.error_title': '请输入网站标题',
      'submit.error_url': '请输入网址 URL',
      'submit.error_url_format': '网址格式不正确，请输入完整的网站地址',
      'submit.error_network': '网络异常，请稍后重试',
      'submit.error_default': '提交失败，请重试',
      'submit.success_title': '感谢推荐！',
      'submit.success_desc': '我们已收到你的推荐<br>审核通过后将在网站展示<br>通常 24 小时内完成审核',
      'submit.success_close': '知道了',

      // 滚动
      'scroll.top': '回到顶部',

      // 头部
      'header.submit': '📤 提交好站',
      'header.toggle_sidebar': '切换侧边栏',
      'header.search': '搜索',

      // 热门标签
      'hot.recommend': '热门推荐'
    },

    'en': {
      'site.name': 'AI Lobster Nav',
      'site.slogan': '🦞 AI Lobster Nav — Discover quality AI tools to boost productivity',
      'site.desc': 'Curated collection of thousands of AI tools and applications covering AI chat, drawing, coding, video, audio, and more. Your one-stop AI tool discovery platform.',
      'site.slogan_short': '🦞 AI Lobster Nav',
      'site.desc_short': 'Discover more quality AI tools across 20+ categories',

      'nav.home': 'Home',
      'nav.all_categories': 'All Categories',
      'nav.about': 'About',
      'nav.sitemap': 'Sitemap',

      'hero.title': 'AI Lobster Nav',
      'hero.accent': '· Discover the Best AI Tools Worldwide',
      'hero.subtitle': 'The most comprehensive AI tool platform featuring ChatGPT, DeepSeek, Midjourney, Cursor and hundreds more — explore the limitless possibilities of AI',

      'search.placeholder': 'Search AI tools…',
      'search.tab_local': '🔍 Local',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': 'No matching tools found, try other keywords',
      'search.result_count': 'Found {count} tools',

      'category.all': '📋 All Tools',
      'category.empty': 'No categories',
      'category.count_unit': '',

      'tool.hot': 'Hot',
      'tool.recommended': 'Featured',
      'tool.visit': 'Visit',
      'tool.no_desc': 'No description',
      'tool.goto': 'Go',
      'tool.view_detail': 'View details of {title}',
      'tool.visit_site': 'Visit {title}',

      'detail.back': '← Back to Home',
      'detail.translating': 'Translating...',
      'detail.intro': 'Introduction',
      'detail.features': 'Key Features',
      'detail.scenarios': 'Use Cases',
      'detail.pricing': 'Pricing',
      'detail.tips': 'Tips',
      'detail.visit_site': 'Visit Website',
      'detail.no_content': 'No detailed introduction yet',
      'detail.basic_info': '📋 Basic Info',
      'detail.website': '🌐 Official Website',
      'detail.category': '📂 Category',
      'detail.browse_all': 'Browse All Tools',
      'detail.related_tools': '🔗 Related Tools',
      'detail.hot': '🔥 Hot',
      'detail.recommended': '⭐ Recommended',

      'about.title': 'About AI Lobster Nav',
      'about.tagline': 'AI.txdd.cn — Your AI Tool Navigation Expert',
      'about.no_content': 'Loading…',

      'footer.copyright': '© 2026 AI Lobster Nav',

      'lang.switch': 'Language',

      'sidebar.all_tools': '📋 All Tools',
      'sidebar.submit': '📤 Submit',

      'submit.title': '📤 Recommend a Site',
      'submit.title_label': 'Site Title',
      'submit.url_label': 'Website URL',
      'submit.cat_label': 'Category',
      'submit.desc_label': 'Description',
      'submit.icon_label': 'Site Icon',
      'submit.contact_label': 'Contact',
      'submit.title_placeholder': 'e.g. ChatGPT',
      'submit.url_placeholder': 'e.g. https://chat.openai.com',
      'submit.desc_placeholder': 'One sentence to describe this site (optional)',
      'submit.icon_placeholder': 'Leave blank to auto-fetch favicon, or paste image URL',
      'submit.icon_hint': 'Auto-fetch after entering URL, or paste image link manually',
      'submit.contact_placeholder': 'Optional, for us to contact you (email/phone)',
      'submit.select_cat': '-- Select Category --',
      'submit.fetch': '🔍 Auto-fetch',
      'submit.fetching': '⏳ Fetching...',
      'submit.connecting': 'Connecting to website...',
      'submit.done': '✅ Done',
      'submit.failed': '⚠️ Failed',
      'submit.refetch': '🔍 Retry',
      'submit.save': 'Submit',
      'submit.cancel': 'Cancel',
      'submit.saving': 'Submitting...',
      'submit.error_title': 'Please enter site title',
      'submit.error_url': 'Please enter website URL',
      'submit.error_url_format': 'Invalid URL format, please enter a complete website address',
      'submit.error_network': 'Network error, please try again later',
      'submit.error_default': 'Submission failed, please try again',
      'submit.success_title': 'Thank You!',
      'submit.success_desc': 'We have received your recommendation<br>It will appear on the site after review<br>Usually within 24 hours',
      'submit.success_close': 'Got it',

      'scroll.top': 'Back to Top',

      'header.submit': '📤 Submit',
      'header.toggle_sidebar': 'Toggle Sidebar',
      'header.search': 'Search',

      'hot.recommend': 'Hot Picks'
    },

    'de': {
      'site.name': 'AI Lobster Nav',
      'site.slogan': '🦞 AI Lobster Nav — Entdecke KI-Tools für mehr Produktivität',
      'site.desc': 'Kuratierte Sammlung tausender KI-Tools für Chat, Design, Programmierung, Video, Audio und mehr. Ihre zentrale Plattform zur KI-Tool-Entdeckung.',
      'site.slogan_short': '🦞 AI Lobster Nav',
      'site.desc_short': 'Entdecken Sie weitere KI-Tools in über 20 Kategorien',

      'nav.home': 'Startseite',
      'nav.all_categories': 'Alle Kategorien',
      'nav.about': 'Über uns',
      'nav.sitemap': 'Sitemap',

      'hero.title': 'AI Lobster Nav',
      'hero.accent': '· Entdecke die besten KI-Tools weltweit',
      'hero.subtitle': 'Die umfassendste KI-Tool-Plattform mit ChatGPT, DeepSeek, Midjourney, Cursor und Hunderten mehr — entdecke die grenzenlosen Möglichkeiten der KI',

      'search.placeholder': 'KI-Tools suchen…',
      'search.tab_local': '🔍 Lokal',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': 'Keine passenden Tools gefunden',
      'search.result_count': '{count} Tools gefunden',

      'category.all': '📋 Alle Tools',
      'category.empty': 'Keine Kategorien',
      'category.count_unit': '',

      'tool.hot': 'Beliebt',
      'tool.recommended': 'Empfohlen',
      'tool.visit': 'Besuchen',
      'tool.no_desc': 'Keine Beschreibung',
      'tool.goto': 'Los',
      'tool.view_detail': 'Details von {title} anzeigen',
      'tool.visit_site': '{title} besuchen',

      'detail.back': '← Zur Startseite',
      'detail.translating': 'Übersetzung läuft...',
      'detail.intro': 'Einführung',
      'detail.features': 'Funktionen',
      'detail.scenarios': 'Anwendungsfälle',
      'detail.pricing': 'Preise',
      'detail.tips': 'Tipps',
      'detail.visit_site': 'Website besuchen',
      'detail.no_content': 'Noch keine Details',
      'detail.basic_info': '📋 Basis-Info',
      'detail.website': '🌐 Offizielle Website',
      'detail.category': '📂 Kategorie',
      'detail.browse_all': 'Alle Tools durchsuchen',
      'detail.related_tools': '🔗 Ähnliche Tools',
      'detail.hot': '🔥 Beliebt',
      'detail.recommended': '⭐ Empfohlen',

      'about.title': 'Über AI Lobster Nav',
      'about.tagline': 'AI.txdd.cn — Ihr KI-Tool-Navigationsexperte',
      'about.no_content': 'Wird geladen…',

      'footer.copyright': '© 2026 AI Lobster Nav',

      'lang.switch': 'Sprache',

      'sidebar.all_tools': '📋 Alle Tools',
      'sidebar.submit': '📤 Einreichen',

      'submit.title': '📤 Website empfehlen',
      'submit.title_label': 'Seitentitel',
      'submit.url_label': 'Website-URL',
      'submit.cat_label': 'Kategorie',
      'submit.desc_label': 'Beschreibung',
      'submit.icon_label': 'Seiten-Icon',
      'submit.contact_label': 'Kontakt',
      'submit.title_placeholder': 'z.B. ChatGPT',
      'submit.url_placeholder': 'z.B. https://chat.openai.com',
      'submit.desc_placeholder': 'Ein Satz zur Beschreibung (optional)',
      'submit.icon_placeholder': 'Leer lassen für Auto-Favicon, oder Bild-URL einfügen',
      'submit.icon_hint': 'Automatisch nach URL-Eingabe abrufen',
      'submit.contact_placeholder': 'Optional, für Rückfragen (E-Mail/Telefon)',
      'submit.select_cat': '-- Kategorie wählen --',
      'submit.fetch': '🔍 Auto-abrufen',
      'submit.fetching': '⏳ Rufe ab...',
      'submit.connecting': 'Verbinde mit Website...',
      'submit.done': '✅ Fertig',
      'submit.failed': '⚠️ Fehlgeschlagen',
      'submit.refetch': '🔍 Erneut',
      'submit.save': 'Einreichen',
      'submit.cancel': 'Abbrechen',
      'submit.saving': 'Wird gesendet...',
      'submit.error_title': 'Bitte Seitentitel eingeben',
      'submit.error_url': 'Bitte Website-URL eingeben',
      'submit.error_url_format': 'Ungültiges URL-Format',
      'submit.error_network': 'Netzwerkfehler, bitte später erneut versuchen',
      'submit.error_default': 'Einreichung fehlgeschlagen',
      'submit.success_title': 'Vielen Dank!',
      'submit.success_desc': 'Wir haben Ihre Empfehlung erhalten<br>Sie erscheint nach Prüfung auf der Website<br>In der Regel innerhalb von 24 Stunden',
      'submit.success_close': 'Verstanden',

      'scroll.top': 'Nach oben',

      'header.submit': '📤 Einreichen',
      'header.toggle_sidebar': 'Seitenleiste umschalten',
      'header.search': 'Suchen',

      'hot.recommend': 'Empfehlungen'
    },

    'fr': {
      'site.name': 'AI Lobster Nav',
      'site.slogan': '🦞 AI Lobster Nav — Découvrez des outils IA de qualité',
      'site.desc': 'Collection soignée de milliers d\'outils IA pour le chat, le design, la programmation, la vidéo, l\'audio et plus. Votre plateforme unique de découverte d\'outils IA.',
      'site.slogan_short': '🦞 AI Lobster Nav',
      'site.desc_short': 'Découvrez plus d\'outils IA dans plus de 20 catégories',

      'nav.home': 'Accueil',
      'nav.all_categories': 'Catégories',
      'nav.about': 'À propos',
      'nav.sitemap': 'Plan du site',

      'hero.title': 'AI Lobster Nav',
      'hero.accent': '· Découvrez les meilleurs outils IA',
      'hero.subtitle': 'La plateforme d\'outils IA la plus complète avec ChatGPT, DeepSeek, Midjourney, Cursor et des centaines d\'autres — explorez les possibilités infinies de l\'IA',

      'search.placeholder': 'Rechercher des outils IA…',
      'search.tab_local': '🔍 Local',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': 'Aucun outil trouvé',
      'search.result_count': '{count} outils trouvés',

      'category.all': '📋 Tous les outils',
      'category.empty': 'Aucune catégorie',
      'category.count_unit': '',

      'tool.hot': 'Populaire',
      'tool.recommended': 'Recommandé',
      'tool.visit': 'Visiter',
      'tool.no_desc': 'Aucune description',
      'tool.goto': 'Aller',
      'tool.view_detail': 'Voir les détails de {title}',
      'tool.visit_site': 'Visiter {title}',

      'detail.back': '← Retour à l\'accueil',
      'detail.translating': 'Traduction en cours...',
      'detail.intro': 'Introduction',
      'detail.features': 'Fonctionnalités',
      'detail.scenarios': 'Cas d\'usage',
      'detail.pricing': 'Tarifs',
      'detail.tips': 'Conseils',
      'detail.visit_site': 'Visiter le site',
      'detail.no_content': 'Pas encore de détails',
      'detail.basic_info': '📋 Infos de base',
      'detail.website': '🌐 Site officiel',
      'detail.category': '📂 Catégorie',
      'detail.browse_all': 'Parcourir tous les outils',
      'detail.related_tools': '🔗 Outils similaires',
      'detail.hot': '🔥 Populaire',
      'detail.recommended': '⭐ Recommandé',

      'about.title': 'À propos d\'AI Lobster Nav',
      'about.tagline': 'AI.txdd.cn — Votre expert en navigation d\'outils IA',
      'about.no_content': 'Chargement…',

      'footer.copyright': '© 2026 AI Lobster Nav',

      'lang.switch': 'Langue',

      'sidebar.all_tools': '📋 Tous les outils',
      'sidebar.submit': '📤 Proposer',

      'submit.title': '📤 Proposer un site',
      'submit.title_label': 'Titre du site',
      'submit.url_label': 'URL du site',
      'submit.cat_label': 'Catégorie',
      'submit.desc_label': 'Description',
      'submit.icon_label': 'Icône du site',
      'submit.contact_label': 'Contact',
      'submit.title_placeholder': 'ex. ChatGPT',
      'submit.url_placeholder': 'ex. https://chat.openai.com',
      'submit.desc_placeholder': 'Une phrase pour décrire ce site (optionnel)',
      'submit.icon_placeholder': 'Laisser vide pour auto-favicon, ou coller une URL d\'image',
      'submit.icon_hint': 'Récupération automatique après saisie de l\'URL',
      'submit.contact_placeholder': 'Optionnel, pour vous contacter (email/téléphone)',
      'submit.select_cat': '-- Choisir une catégorie --',
      'submit.fetch': '🔍 Auto-récupérer',
      'submit.fetching': '⏳ Récupération...',
      'submit.connecting': 'Connexion au site...',
      'submit.done': '✅ Terminé',
      'submit.failed': '⚠️ Échec',
      'submit.refetch': '🔍 Réessayer',
      'submit.save': 'Soumettre',
      'submit.cancel': 'Annuler',
      'submit.saving': 'Envoi en cours...',
      'submit.error_title': 'Veuillez entrer le titre du site',
      'submit.error_url': 'Veuillez entrer l\'URL du site',
      'submit.error_url_format': 'Format d\'URL invalide',
      'submit.error_network': 'Erreur réseau, veuillez réessayer plus tard',
      'submit.error_default': 'Échec de la soumission',
      'submit.success_title': 'Merci !',
      'submit.success_desc': 'Nous avons reçu votre recommandation<br>Elle apparaîtra sur le site après validation<br>Généralement sous 24 heures',
      'submit.success_close': 'Compris',

      'scroll.top': 'Haut de page',

      'header.submit': '📤 Proposer',
      'header.toggle_sidebar': 'Basculer la barre latérale',
      'header.search': 'Rechercher',

      'hot.recommend': 'Recommandations'
    },

    'es': {
      'site.name': 'AI Lobster Nav',
      'site.slogan': '🦞 AI Lobster Nav — Descubre herramientas IA de calidad',
      'site.desc': 'Colección curada de miles de herramientas IA para chat, diseño, programación, video, audio y más. Tu plataforma única de descubrimiento de herramientas IA.',
      'site.slogan_short': '🦞 AI Lobster Nav',
      'site.desc_short': 'Descubre más herramientas IA en más de 20 categorías',

      'nav.home': 'Inicio',
      'nav.all_categories': 'Categorías',
      'nav.about': 'Acerca de',
      'nav.sitemap': 'Mapa del sitio',

      'hero.title': 'AI Lobster Nav',
      'hero.accent': '· Descubre las mejores herramientas IA',
      'hero.subtitle': 'La plataforma de herramientas IA más completa con ChatGPT, DeepSeek, Midjourney, Cursor y cientos más — explora las posibilidades ilimitadas de la IA',

      'search.placeholder': 'Buscar herramientas IA…',
      'search.tab_local': '🔍 Local',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': 'No se encontraron herramientas',
      'search.result_count': '{count} herramientas encontradas',

      'category.all': '📋 Todas las herramientas',
      'category.empty': 'Sin categorías',
      'category.count_unit': '',

      'tool.hot': 'Popular',
      'tool.recommended': 'Destacado',
      'tool.visit': 'Visitar',
      'tool.no_desc': 'Sin descripción',
      'tool.goto': 'Ir',
      'tool.view_detail': 'Ver detalles de {title}',
      'tool.visit_site': 'Visitar {title}',

      'detail.back': '← Volver al inicio',
      'detail.translating': 'Traduciendo...',
      'detail.intro': 'Introducción',
      'detail.features': 'Características',
      'detail.scenarios': 'Casos de uso',
      'detail.pricing': 'Precios',
      'detail.tips': 'Consejos',
      'detail.visit_site': 'Visitar sitio',
      'detail.no_content': 'Sin detalles aún',
      'detail.basic_info': '📋 Información básica',
      'detail.website': '🌐 Sitio oficial',
      'detail.category': '📂 Categoría',
      'detail.browse_all': 'Explorar todas las herramientas',
      'detail.related_tools': '🔗 Herramientas relacionadas',
      'detail.hot': '🔥 Popular',
      'detail.recommended': '⭐ Recomendado',

      'about.title': 'Acerca de AI Lobster Nav',
      'about.tagline': 'AI.txdd.cn — Tu experto en navegación de herramientas IA',
      'about.no_content': 'Cargando…',

      'footer.copyright': '© 2026 AI Lobster Nav',

      'lang.switch': 'Idioma',

      'sidebar.all_tools': '📋 Todas las herramientas',
      'sidebar.submit': '📤 Enviar',

      'submit.title': '📤 Recomendar un sitio',
      'submit.title_label': 'Título del sitio',
      'submit.url_label': 'URL del sitio',
      'submit.cat_label': 'Categoría',
      'submit.desc_label': 'Descripción',
      'submit.icon_label': 'Icono del sitio',
      'submit.contact_label': 'Contacto',
      'submit.title_placeholder': 'ej. ChatGPT',
      'submit.url_placeholder': 'ej. https://chat.openai.com',
      'submit.desc_placeholder': 'Una frase para describir este sitio (opcional)',
      'submit.icon_placeholder': 'Dejar en blanco para auto-favicon, o pegar URL de imagen',
      'submit.icon_hint': 'Recuperación automática tras ingresar la URL',
      'submit.contact_placeholder': 'Opcional, para contactarte (email/teléfono)',
      'submit.select_cat': '-- Seleccionar categoría --',
      'submit.fetch': '🔍 Auto-obtener',
      'submit.fetching': '⏳ Obteniendo...',
      'submit.connecting': 'Conectando al sitio...',
      'submit.done': '✅ Listo',
      'submit.failed': '⚠️ Falló',
      'submit.refetch': '🔍 Reintentar',
      'submit.save': 'Enviar',
      'submit.cancel': 'Cancelar',
      'submit.saving': 'Enviando...',
      'submit.error_title': 'Por favor ingresa el título del sitio',
      'submit.error_url': 'Por favor ingresa la URL del sitio',
      'submit.error_url_format': 'Formato de URL inválido',
      'submit.error_network': 'Error de red, intenta de nuevo más tarde',
      'submit.error_default': 'Error al enviar',
      'submit.success_title': '¡Gracias!',
      'submit.success_desc': 'Hemos recibido tu recomendación<br>Aparecerá en el sitio tras la revisión<br>Generalmente en 24 horas',
      'submit.success_close': 'Entendido',

      'scroll.top': 'Volver arriba',

      'header.submit': '📤 Enviar',
      'header.toggle_sidebar': 'Alternar barra lateral',
      'header.search': 'Buscar',

      'hot.recommend': 'Destacados'
    },

    'ja': {
      'site.name': 'AIロブスターナビ',
      'site.slogan': '🦞 AIロブスターナビ — 優れたAIツールで生産性を向上',
      'site.desc': 'AIチャット、デザイン、プログラミング、動画、音声など、数千のAIツールを厳選。ワンストップのAIツール発見プラットフォーム。',
      'site.slogan_short': '🦞 AIロブスターナビ',
      'site.desc_short': '20以上のカテゴリでさらにAIツールを発見',

      'nav.home': 'ホーム',
      'nav.all_categories': '全カテゴリ',
      'nav.about': '概要',
      'nav.sitemap': 'サイトマップ',

      'hero.title': 'AIロブスターナビ',
      'hero.accent': '· 世界最高のAIツールを発見',
      'hero.subtitle': 'ChatGPT、DeepSeek、Midjourney、Cursorなど数百のAIツールを網羅した最も包括的なAIツールプラットフォーム — AIの無限の可能性を探求',

      'search.placeholder': 'AIツールを検索…',
      'search.tab_local': '🔍 ローカル',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': '該当するツールが見つかりません',
      'search.result_count': '{count}件のツールが見つかりました',

      'category.all': '📋 全ツール',
      'category.empty': 'カテゴリなし',
      'category.count_unit': '件',

      'tool.hot': '人気',
      'tool.recommended': 'おすすめ',
      'tool.visit': 'アクセス',
      'tool.no_desc': '説明なし',
      'tool.goto': '移動',
      'tool.view_detail': '{title}の詳細を見る',
      'tool.visit_site': '{title}にアクセス',

      'detail.back': '← ホームに戻る',
      'detail.translating': '翻訳中...',
      'detail.intro': 'ツール紹介',
      'detail.features': '主な特徴',
      'detail.scenarios': '使用シーン',
      'detail.pricing': '料金プラン',
      'detail.tips': '活用のヒント',
      'detail.visit_site': '公式サイトへ',
      'detail.no_content': '詳細情報はまだありません',
      'detail.basic_info': '📋 基本情報',
      'detail.website': '🌐 公式サイト',
      'detail.category': '📂 カテゴリ',
      'detail.browse_all': 'すべてのツールを見る',
      'detail.related_tools': '🔗 関連ツール',
      'detail.hot': '🔥 人気',
      'detail.recommended': '⭐ おすすめ',

      'about.title': 'AIロブスターナビについて',
      'about.tagline': 'AI.txdd.cn — AIツールナビゲーションのエキスパート',
      'about.no_content': '読み込み中…',

      'footer.copyright': '© 2026 AIロブスターナビ',

      'lang.switch': '言語',

      'sidebar.all_tools': '📋 全ツール',
      'sidebar.submit': '📤 投稿',

      'submit.title': '📤 サイトを推薦',
      'submit.title_label': 'サイトタイトル',
      'submit.url_label': 'サイトURL',
      'submit.cat_label': 'カテゴリ',
      'submit.desc_label': '説明',
      'submit.icon_label': 'サイトアイコン',
      'submit.contact_label': '連絡先',
      'submit.title_placeholder': '例：ChatGPT',
      'submit.url_placeholder': '例：https://chat.openai.com',
      'submit.desc_placeholder': 'このサイトの一言説明（任意）',
      'submit.icon_placeholder': '空欄で自動取得、または画像URLを貼り付け',
      'submit.icon_hint': 'URL入力後に自動取得',
      'submit.contact_placeholder': '任意、ご連絡先用（メール/電話）',
      'submit.select_cat': '-- カテゴリを選択 --',
      'submit.fetch': '🔍 自動取得',
      'submit.fetching': '⏳ 取得中...',
      'submit.connecting': 'サイトに接続中...',
      'submit.done': '✅ 完了',
      'submit.failed': '⚠️ 失敗',
      'submit.refetch': '🔍 再試行',
      'submit.save': '送信',
      'submit.cancel': 'キャンセル',
      'submit.saving': '送信中...',
      'submit.error_title': 'サイトタイトルを入力してください',
      'submit.error_url': 'サイトURLを入力してください',
      'submit.error_url_format': '無効なURL形式です',
      'submit.error_network': 'ネットワークエラー、後でもう一度お試しください',
      'submit.error_default': '送信に失敗しました',
      'submit.success_title': 'ありがとうございます！',
      'submit.success_desc': '推薦を受け付けました<br>審査後、サイトに掲載されます<br>通常24時間以内',
      'submit.success_close': '了解',

      'scroll.top': 'トップへ',

      'header.submit': '📤 投稿',
      'header.toggle_sidebar': 'サイドバー切替',
      'header.search': '検索',

      'hot.recommend': 'おすすめ'
    },

    'ko': {
      'site.name': 'AI 랍스터 내비',
      'site.slogan': '🦞 AI 랍스터 내비 — 생산성을 높이는 AI 도구 발견',
      'site.desc': 'AI 채팅, 디자인, 코딩, 비디오, 오디오 등 수천 가지 AI 도구를 엄선. 원스톱 AI 도구 발견 플랫폼.',
      'site.slogan_short': '🦞 AI 랍스터 내비',
      'site.desc_short': '20개 이상의 카테고리에서 더 많은 AI 도구 발견',

      'nav.home': '홈',
      'nav.all_categories': '전체 카테고리',
      'nav.about': '소개',
      'nav.sitemap': '사이트맵',

      'hero.title': 'AI 랍스터 내비',
      'hero.accent': '· 최고의 AI 도구를 발견하세요',
      'hero.subtitle': 'ChatGPT, DeepSeek, Midjourney, Cursor 등 수백 가지 AI 도구를 갖춘 가장 포괄적인 AI 도구 플랫폼 — AI의 무한한 가능성을 탐험하세요',

      'search.placeholder': 'AI 도구 검색…',
      'search.tab_local': '🔍 로컬',
      'search.tab_baidu': 'Baidu',
      'search.tab_google': 'Google',
      'search.no_result': '일치하는 도구가 없습니다',
      'search.result_count': '{count}개의 도구를 찾았습니다',

      'category.all': '📋 전체 도구',
      'category.empty': '카테고리 없음',
      'category.count_unit': '개',

      'tool.hot': '인기',
      'tool.recommended': '추천',
      'tool.visit': '방문',
      'tool.no_desc': '설명 없음',
      'tool.goto': '이동',
      'tool.view_detail': '{title} 상세 보기',
      'tool.visit_site': '{title} 방문',

      'detail.back': '← 홈으로',
      'detail.translating': '번역 중...',
      'detail.intro': '도구 소개',
      'detail.features': '주요 기능',
      'detail.scenarios': '활용 사례',
      'detail.pricing': '요금제',
      'detail.tips': '사용 팁',
      'detail.visit_site': '웹사이트 방문',
      'detail.no_content': '아직 상세 정보가 없습니다',
      'detail.basic_info': '📋 기본 정보',
      'detail.website': '🌐 공식 웹사이트',
      'detail.category': '📂 카테고리',
      'detail.browse_all': '모든 도구 보기',
      'detail.related_tools': '🔗 관련 도구',
      'detail.hot': '🔥 인기',
      'detail.recommended': '⭐ 추천',

      'about.title': 'AI 랍스터 내비 소개',
      'about.tagline': 'AI.txdd.cn — AI 도구 내비게이션 전문가',
      'about.no_content': '로딩 중…',

      'footer.copyright': '© 2026 AI 랍스터 내비',

      'lang.switch': '언어',

      'sidebar.all_tools': '📋 전체 도구',
      'sidebar.submit': '📤 제출',

      'submit.title': '📤 사이트 추천',
      'submit.title_label': '사이트 제목',
      'submit.url_label': '웹사이트 URL',
      'submit.cat_label': '카테고리',
      'submit.desc_label': '설명',
      'submit.icon_label': '사이트 아이콘',
      'submit.contact_label': '연락처',
      'submit.title_placeholder': '예: ChatGPT',
      'submit.url_placeholder': '예: https://chat.openai.com',
      'submit.desc_placeholder': '이 사이트에 대한 한 줄 설명 (선택)',
      'submit.icon_placeholder': '비워두면 자동 파비콘, 또는 이미지 URL 붙여넣기',
      'submit.icon_hint': 'URL 입력 후 자동 가져오기',
      'submit.contact_placeholder': '선택 사항, 연락처 (이메일/전화)',
      'submit.select_cat': '-- 카테고리 선택 --',
      'submit.fetch': '🔍 자동 가져오기',
      'submit.fetching': '⏳ 가져오는 중...',
      'submit.connecting': '웹사이트 연결 중...',
      'submit.done': '✅ 완료',
      'submit.failed': '⚠️ 실패',
      'submit.refetch': '🔍 다시 시도',
      'submit.save': '제출',
      'submit.cancel': '취소',
      'submit.saving': '제출 중...',
      'submit.error_title': '사이트 제목을 입력하세요',
      'submit.error_url': '웹사이트 URL을 입력하세요',
      'submit.error_url_format': '잘못된 URL 형식입니다',
      'submit.error_network': '네트워크 오류, 나중에 다시 시도하세요',
      'submit.error_default': '제출 실패',
      'submit.success_title': '감사합니다!',
      'submit.success_desc': '추천이 접수되었습니다<br>검토 후 사이트에 표시됩니다<br>보통 24시간 이내',
      'submit.success_close': '확인',

      'scroll.top': '맨 위로',

      'header.submit': '📤 제출',
      'header.toggle_sidebar': '사이드바 전환',
      'header.search': '검색',

      'hot.recommend': '추천'
    }
  };

  // ========================= 核心 API =========================
  var currentLang = 'zh-CN';

  function t(key, params) {
    var dict = DICT[currentLang] || DICT['zh-CN'];
    var text = dict[key];
    if (text === undefined) {
      text = DICT['zh-CN'][key] || key;
    }
    if (params) {
      Object.keys(params).forEach(function (k) {
        text = text.replace('{' + k + '}', params[k]);
      });
    }
    return text;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    if (lang === currentLang) return;
    currentLang = lang;
    try { localStorage.setItem('ai_lobster_lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    applyToDOM();
    updateSwitcherUI();
    // 触发自定义事件，让 main.js 等模块响应语言切换
    try {
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    } catch (e) {
      // IE fallback
      var evt = document.createEvent('Event');
      evt.initEvent('langchange', true, true);
      evt.detail = { lang: lang };
      document.dispatchEvent(evt);
    }
  }

  function getLang() {
    return currentLang;
  }

  function autoDetect() {
    try {
      var saved = localStorage.getItem('ai_lobster_lang');
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        currentLang = saved;
        document.documentElement.lang = currentLang;
        return;
      }
    } catch (e) {}

    var navLang = (navigator.language || navigator.userLanguage || '').trim();
    var found = null;
    if (SUPPORTED_LANGS.includes(navLang)) {
      found = navLang;
    } else {
      var prefix = navLang.split('-')[0];
      for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
        if (SUPPORTED_LANGS[i].startsWith(prefix)) {
          found = SUPPORTED_LANGS[i];
          break;
        }
      }
    }

    currentLang = found || 'zh-CN';
    document.documentElement.lang = currentLang;
  }

  function applyToDOM(root) {
    root = root || document;
    var elements = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (!key) continue;

      var hasChildren = el.children.length > 0 && el.getAttribute('data-i18n-html') !== 'true';

      if (el.getAttribute('data-i18n-attr')) {
        var attrName = el.getAttribute('data-i18n-attr');
        el.setAttribute(attrName, t(key));
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', t(key));
      } else if (hasChildren) {
        _translateTextNodes(el, t(key));
      } else {
        el.textContent = t(key);
      }
    }

    // 处理 data-i18n-title
    var titleEls = root.querySelectorAll('[data-i18n-title]');
    for (var j = 0; j < titleEls.length; j++) {
      var tel = titleEls[j];
      tel.setAttribute('title', t(tel.getAttribute('data-i18n-title')));
    }

    // 处理 data-i18n-placeholder
    var phEls = root.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < phEls.length; k++) {
      var pel = phEls[k];
      pel.setAttribute('placeholder', t(pel.getAttribute('data-i18n-placeholder')));
    }
  }

  function _translateTextNodes(el, text) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent = text;
        return;
      }
    }
    el.insertBefore(document.createTextNode(text), el.firstChild);
  }

  function updateSwitcherUI() {
    var label = LANG_LABELS[currentLang] || currentLang;
    // 更新按钮文字
    var btns = document.querySelectorAll('.lang-switch-label');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = label;
    }
    // 更新下拉菜单的 active 状态
    var options = document.querySelectorAll('.lang-option');
    for (var j = 0; j < options.length; j++) {
      if (options[j].getAttribute('data-lang') === currentLang) {
        options[j].classList.add('active');
      } else {
        options[j].classList.remove('active');
      }
    }
  }

  function getSupportedLangs() {
    return SUPPORTED_LANGS.map(function (code) {
      return { code: code, label: LANG_LABELS[code] };
    });
  }

  function buildSwitcherHTML() {
    var currentLabel = LANG_LABELS[currentLang] || '中文';
    var html = '<div class="lang-switcher">';
    html += '<button class="lang-switch-btn" aria-label="' + t('lang.switch') + '">';
    // 地球图标 SVG
    html += '<svg class="lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
    html += '<circle cx="12" cy="12" r="10"/>';
    html += '<ellipse cx="12" cy="12" rx="4" ry="10"/>';
    html += '<path d="M2 12h20"/>';
    html += '<path d="M12 2v20"/>';
    html += '</svg>';
    html += '<span class="lang-switch-label">' + currentLabel + '</span>';
    // 向下箭头 SVG
    html += '<svg class="lang-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
    html += '<polyline points="6 9 12 15 18 9"/>';
    html += '</svg>';
    html += '</button>';
    html += '<ul class="lang-dropdown">';
    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var code = SUPPORTED_LANGS[i];
      var activeClass = code === currentLang ? ' active' : '';
      html += '<li class="lang-option' + activeClass + '" data-lang="' + code + '">' + LANG_LABELS[code] + '</li>';
    }
    html += '</ul>';
    html += '</div>';
    return html;
  }

  // ========================= 初始化 =========================
  autoDetect();

  function init() {
    applyToDOM();

    var containers = document.querySelectorAll('.lang-switcher-container');
    for (var i = 0; i < containers.length; i++) {
      containers[i].innerHTML = buildSwitcherHTML();
    }

    bindSwitcherEvents();
  }

  function bindSwitcherEvents() {
    // 按钮点击展开/收起下拉菜单
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-switch-btn');
      if (btn) {
        var switcher = btn.closest('.lang-switcher');
        switcher.classList.toggle('open');
        return;
      }
      // 点击选项切换语言
      var option = e.target.closest('.lang-option');
      if (option) {
        var lang = option.getAttribute('data-lang');
        var switcher = option.closest('.lang-switcher');
        switcher.classList.remove('open');
        setLang(lang);
        return;
      }
      // 点击外部关闭所有下拉菜单
      if (!e.target.closest('.lang-switcher')) {
        var allSwitchers = document.querySelectorAll('.lang-switcher.open');
        for (var i = 0; i < allSwitchers.length; i++) {
          allSwitchers[i].classList.remove('open');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ========================= 导出 =========================
  window.I18N = {
    t: t,
    tCat: tCat,
    tDesc: tDesc,
    setLang: setLang,
    getLang: getLang,
    applyToDOM: applyToDOM,
    getSupportedLangs: getSupportedLangs
  };

})();
