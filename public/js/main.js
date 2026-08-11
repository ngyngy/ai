// ========== Utils ==========
function escapeHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ========== Data ==========
let allCategories = [];
let allLinks = [];
let currentCatId = 'all';
let currentSettings = null; // 保存站点设置，供语言切换时使用

const logoColors = [
  '#5b4af5','#ec4899','#f59e0b','#10b981','#3b82f6',
  '#8b5cf6','#ef4444','#06b6d4','#f97316','#84cc16',
  '#14b8a6','#6366f1','#d946ef','#0ea5e9','#e11d48',
  '#38bdf8','#a855f7','#f43f5e','#22c55e','#eab308',
];

function logoColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return logoColors[Math.abs(h) % logoColors.length];
}

function initials(title) {
  const clean = title.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim();
  return clean.slice(0, 2) || clean.slice(0, 1) || '?';
}

function fallbackFavicon(url) {
  try { return '/api/favicon?domain=' + new URL(url).hostname; }
  catch { return ''; }
}

// onload 回调：图片加载完成后添加 loaded class，触发淡入动画
var LOGO_ONLOAD = 'this.classList.add(\'loaded\')';
// 两步 fallback：先尝试本站 favicon 代理，失败后降级为文字首字母
function mkFallback(fb, title) {
  var initFn = 'this.parentElement.innerHTML=\'<span class=logo-text>' + initials(title) + '</span>\'';
  if (!fb) return initFn;
  return 'this.onerror=null;this.src=\'' + fb + '\';this.onload=function(){' + LOGO_ONLOAD + '};this.onerror=function(){' + initFn + '}';
}
function renderLogo(link) {
  var fb = fallbackFavicon(link.url);
  var initFn = 'this.parentElement.innerHTML=\'<span class=logo-text>' + initials(link.title) + '</span>\'';

  if (link.icon_url && link.icon_url.startsWith('/icons/')) {
    // 本地图标，直接加载（优先，通常最快）
    return '<img src="' + link.icon_url + '" alt="' + link.title + '" loading="lazy" decoding="async" onload="' + LOGO_ONLOAD + '" onerror="' + mkFallback(fb, link.title) + '">';
  }
  if (link.icon_url) {
    // 自定义图标 URL → 失败时走本站 favicon 代理 → 再失败降级文字
    return '<img src="' + link.icon_url + '" alt="' + link.title + '" loading="lazy" decoding="async" onload="' + LOGO_ONLOAD + '" onerror="' + mkFallback(fb, link.title) + '">';
  }
  if (fb) {
    // 无图标，直接走本站 favicon 代理
    return '<img src="' + fb + '" alt="' + link.title + '" loading="lazy" decoding="async" onload="' + LOGO_ONLOAD + '" onerror="' + initFn + '">';
  }
  return '<span class="logo-text">' + initials(link.title) + '</span>';
}

function renderBadges(tags) {
  if (!tags) return '';
  var map = {
    hot:'badge-hot', '热门':'badge-hot', '热':'badge-hot',
    recommend:'badge-rec', '推荐':'badge-rec', '荐':'badge-rec',
    cn:'badge-cn', '国内':'badge-cn', '国产':'badge-cn',
    en:'badge-en', '海外':'badge-en', '国外':'badge-en',
    new:'badge-new', '新':'badge-new', '新品':'badge-new'
  };
  return tags.split(/[,\s]+/).filter(Boolean).map(function(t) {
    var cls = map[t.toLowerCase()] || map[t] || '';
    return '<span class="badge ' + cls + '">' + escapeHtml(t) + '</span>';
  }).join('');
}

function cardHTML(link) {
  var hasDetail = !!(link.detail_content && link.detail_content.trim());
  var cardHref = hasDetail ? '/tool/' + (link.slug || '#') : link.url;
  var cardTarget = hasDetail ? '' : ' target="_blank" rel="noopener"';
  var cardTitle = hasDetail
    ? I18N.t('tool.view_detail', { title: link.title })
    : I18N.t('tool.visit_site', { title: link.title });
  var cardClass = 'link-card' + (hasDetail ? ' has-detail' : '');
  var arrowDot = hasDetail ? '<span class="link-logo-arrow">·</span>' : '';
  var gotoLabel = I18N.t('tool.goto');
  var gotoBtnHtml = hasDetail
    ? '<span class="link-goto-btn" role="link" tabindex="0" title="' + gotoLabel + ' ' + escapeHtml(link.title) + '"' +
        ' data-url="' + link.url + '"' +
        ' onclick="event.preventDefault();event.stopPropagation();window.open(\'' + link.url.replace(/'/g, "\\'") + '\',\'_blank\',\'noopener\')">' +
        gotoLabel + ' <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8L8 2M4 2h4v4"/></svg>' +
      '</span>'
    : '';
  return '<a class="' + cardClass + '" href="' + cardHref + '" title="' + cardTitle + '"' + cardTarget +
    ' itemscope itemtype="https://schema.org/SoftwareApplication">' +
    '<meta itemprop="applicationCategory" content="AI">' +
    '<span class="link-logo-link" onclick="event.preventDefault();event.stopPropagation();window.open(\'' + link.url.replace(/'/g, "\\'") + '\',\'_blank\',\'noopener\')" title="' + gotoLabel + ' ' + escapeHtml(link.title) + '" style="background:' + logoColor(link.title) + '">' + renderLogo(link) + arrowDot + '</span>' +
    '<div class="link-body">' +
      '<div class="link-name" itemprop="name">' + link.title + '</div>' +
      '<div class="link-desc" itemprop="description">' + I18N.tDesc(link.description || '') + '</div>' +
      '<div class="link-badges">' + renderBadges(link.tags) + '</div>' +
      '<meta itemprop="url" content="' + link.url + '">' +
    '</div>' +
    gotoBtnHtml +
    '</a>';
}

// ========== Sidebar ==========
function renderSidebar() {
  var nav = document.getElementById('sidebarNav');
  var countUnit = I18N.t('category.count_unit');
  var html = '<button class="sidebar-link active" data-cat="all">' + I18N.t('sidebar.all_tools') + '</button>';
  allCategories.forEach(function(cat) {
    var label = cat.name.replace(/^[\u{1F000}-\u{1FFFF}]\s*/u, '');
    var displayName = I18N.tCat(cat.name);
    var count = allLinks.filter(function(l) { return l.category_id === cat.id; }).length;
    html += '<button class="sidebar-link" data-cat="' + cat.id + '" data-cat-name="' + label + '">' +
      displayName + '<span class="sidebar-badge">' + count + countUnit + '</span></button>';
  });
  nav.innerHTML = html;

  // 绑定点击
  nav.querySelectorAll('.sidebar-link').forEach(function(btn) {
    btn.addEventListener('click', function() {
      nav.querySelectorAll('.sidebar-link').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var catId = btn.dataset.cat;
      currentCatId = catId;
      filterByCategory(catId === 'all' ? null : Number(catId));
      // 更新 URL hash
      var hash = catId === 'all' ? '' : 'cat-' + catId;
      history.replaceState(null, '', hash ? '#' + hash : window.location.pathname);
      // 移动端关闭侧栏
      closeSidebar();
    });
  });
}

function filterByCategory(catId) {
  document.getElementById('searchPanel').style.display = 'none';
  document.getElementById('noResult').style.display = 'none';
  document.getElementById('searchInput').value = '';
  document.getElementById('categoriesContainer').style.display = '';

  document.querySelectorAll('.category-section').forEach(function(s) {
    if (catId === null) {
      s.style.display = '';
    } else {
      s.style.display = s.dataset.cat === String(catId) ? '' : 'none';
    }
  });

  // 滚动到对应分类
  if (catId !== null) {
    var section = document.getElementById('cat-' + catId);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// 移动端侧边栏
var sidebar = document.getElementById('sidebar');
var overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

document.getElementById('sidebarToggle').addEventListener('click', function() {
  if (sidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// ========== Load ==========
async function smartFetchJson(apiUrl, staticUrl) {
  try {
    var res = await fetch(apiUrl);
    if (res.ok) {
      var contentType = res.headers.get('content-type') || '';
      if (contentType.indexOf('application/json') !== -1) {
        return await res.json();
      }
    }
  } catch (e) {
    console.warn('API fetch failed, falling back to static JSON:', apiUrl, e);
  }
  var resStatic = await fetch(staticUrl);
  return await resStatic.json();
}

async function loadData() {
  try {
    var results = await Promise.all([
      smartFetchJson('/api/categories', '/data/categories.json'),
      smartFetchJson('/api/links', '/data/links.json'),
      smartFetchJson('/api/site-settings', '/data/site-settings.json')
    ]);
    allCategories = results[0];
    allLinks = results[1];
    var settings = results[2];
    currentSettings = settings;
    var fc = document.getElementById('footerCount');
    if (fc) fc.textContent = allLinks.length;
    // 应用站点设置（含 header nav with translations）
    applySiteSettings(settings);
    renderSidebar();
    renderAll();
  } catch (e) {
    console.error('Failed to load data:', e);
  }
}

function applySiteSettings(settings) {
  // 网站名称、Logo、域名
  if (settings.site_name) {
    document.title = settings.site_name + (settings.site_domain ? ' | ' + settings.site_domain : '');
    var logoTextEl = document.querySelector('.header-logo-text');
    if (logoTextEl) logoTextEl.textContent = settings.site_name;
  }
  if (settings.site_domain) {
    var domainEl = document.querySelector('.header-logo-domain');
    if (domainEl) domainEl.textContent = settings.site_domain;
  }
  

  // Header 导航栏 — 使用 tCat 翻译标签
  if (settings.header_nav) {
    try {
      var navItems = JSON.parse(settings.header_nav);
      if (navItems.length) {
        var navHtml = navItems.map(function(item) {
          var label = I18N.tCat(item.label);
          return '<a href="' + item.url + '"' + (item.target ? ' target="' + item.target + '"' : '') + '>' + label + '</a>';
        }).join('');
        document.getElementById('headerNav').innerHTML = navHtml;
      }
    } catch(e) {}
  }
}

function renderAll() {
  var container = document.getElementById('categoriesContainer');
  var html = allCategories.map(function(cat) {
    var links = allLinks.filter(function(l) { return l.category_id === cat.id; });
    if (!links.length) return '';
    var label = cat.name.replace(/^[\u{1F000}-\u{1FFFF}]\s*/u, '');
    var displayName = I18N.tCat(cat.name);
    // 使用宽泛的 emoji 正则覆盖 U+2600-U+27BF (⚡) / U+2700-U+27BF (✍️) / U+1F000-U+1FFFF (🔥) 范围
    var EMOJI_RE = /^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2700}-\u{27BF}][\u{FE00}-\u{FE0F}]?/u;
    var emoji = cat.name.match(EMOJI_RE);
    emoji = emoji ? emoji[0] : '📌';
    var countUnit = I18N.t('category.count_unit');
    return '<section class="category-section" data-cat="' + cat.id + '" id="cat-' + cat.id + '">' +
      '<div class="cat-header">' +
        '<div class="cat-icon-box">' + emoji + '</div>' +
        '<h2 class="cat-name">' + displayName + '</h2>' +
        '<span class="cat-count">' + links.length + countUnit + '</span>' +
      '</div>' +
      '<div class="links-grid">' + links.map(cardHTML).join('') + '</div>' +
    '</section>';
  }).join('');
  // 淡入：先隐藏，写入 DOM，再触发重绘后显示
  container.style.opacity = '0';
  container.innerHTML = html;
  // rAF 保证浏览器先完成渲染再触发过渡
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      container.style.transition = 'opacity .3s ease';
      container.style.opacity = '1';
    });
  });
}

// ========== Search ==========
var searchInput = document.getElementById('searchInput');
var searchTimer;
var currentEngine = 'local';

// 搜索引擎切换
document.querySelectorAll('.search-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.search-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    currentEngine = tab.dataset.engine;
    // 切换引擎时更新 placeholder
    var map = { local: I18N.t('search.placeholder'), baidu: I18N.t('search.placeholder'), google: I18N.t('search.placeholder') };
    searchInput.placeholder = map[currentEngine] || map.local;
    searchInput.focus();
  });
});

function doSearch(q) {
  var kw = q.trim();
  if (!kw) {
    var container = document.getElementById('categoriesContainer');
    container.style.display = '';
    document.getElementById('searchPanel').style.display = 'none';
    document.getElementById('noResult').style.display = 'none';
    filterByCategory(currentCatId === 'all' ? null : Number(currentCatId));
    return;
  }

  // 根据引擎切换行为
  if (currentEngine === 'baidu') {
    window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(kw), '_blank');
    return;
  }
  if (currentEngine === 'google') {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(kw), '_blank');
    return;
  }

  // 本地搜索
  var container = document.getElementById('categoriesContainer');
  var panel = document.getElementById('searchPanel');
  var grid = document.getElementById('searchPanelGrid');
  var header = document.getElementById('searchPanelHeader');
  var noResult = document.getElementById('noResult');

  var k = kw.toLowerCase();
  var hits = allLinks.filter(function(l) {
    return l.title.toLowerCase().indexOf(k) > -1 ||
      (l.description || '').toLowerCase().indexOf(k) > -1 ||
      (l.tags || '').toLowerCase().indexOf(k) > -1;
  });

  if (!hits.length) {
    container.style.display = 'none';
    panel.style.display = 'none';
    noResult.style.display = '';
    return;
  }

  container.style.display = 'none';
  noResult.style.display = 'none';
  panel.style.display = '';
  header.innerHTML = I18N.t('search.result_count', { count: hits.length }) + ' "<strong>' + kw + '</strong>"';
  grid.innerHTML = hits.map(cardHTML).join('');
}

searchInput.addEventListener('input', function() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function() { doSearch(searchInput.value); }, 300);
});
document.getElementById('searchBtn').addEventListener('click', function() { doSearch(searchInput.value); });
searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(searchInput.value); });

// ========== Hot Tags ==========
document.querySelectorAll('.hot-tag').forEach(function(tag) {
  tag.addEventListener('click', function() {
    searchInput.value = tag.dataset.kw;
    doSearch(tag.dataset.kw);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ========== Scroll Top ==========
var scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', function() { scrollTop.classList.toggle('show', window.scrollY > 500); });
scrollTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ========== Particle Animation ==========
(function() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 70;
  var maxDist = 120;
  var mouse = { x: -1000, y: -1000 };

  function resize() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse interaction
      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        var force = (150 - dist) / 150 * 0.3;
        p.vx -= dx * force * 0.02;
        p.vy -= dy * force * 0.02;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,' + p.opacity + ')';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,' + (p.opacity * 0.25) + ')';
      ctx.fill();
    }

    // Connecting lines
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          var alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(168,85,247,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', function() {
    resize();
    createParticles();
  });

  var hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function() {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  resize();
  createParticles();
  animate();
})();

// ========== Init ==========
loadData();

// ========== 顶部菜单锚点跳转（支持 #cat-{id} 格式） ==========
function handleHashChange() {
  var hash = window.location.hash;
  if (!hash || !hash.startsWith('#cat-')) return;
  var catId = hash.replace('#cat-', '');
  if (!catId || catId === '') return;

  // 更新侧栏激活状态
  var nav = document.getElementById('sidebarNav');
  if (nav) {
    nav.querySelectorAll('.sidebar-link').forEach(function(b) { b.classList.remove('active'); });
    var targetBtn = nav.querySelector('.sidebar-link[data-cat=\"' + catId + '\"]');
    if (targetBtn) targetBtn.classList.add('active');
  }

  // 应用分类筛选
  currentCatId = catId;
  filterByCategory(Number(catId));
}

// 监听 hash 变化（顶部菜单点击）
window.addEventListener('hashchange', handleHashChange);

// 初始加载时处理已有 hash
if (window.location.hash && window.location.hash.startsWith('#cat-')) {
  // 数据加载完成后执行（稍微延迟确保 DOM 就绪）
  setTimeout(handleHashChange, 100);
}

// ========== 语言切换：全站重新渲染动态内容 ==========
document.addEventListener('langchange', function() {
  // 保存当前状态
  var savedCatId = currentCatId;
  var searchKw = searchInput.value.trim();
  var searchPanelVisible = document.getElementById('searchPanel').style.display !== 'none';

  // 重新渲染 header 导航（使用翻译后的标签）
  if (currentSettings) {
    applySiteSettings(currentSettings);
  }

  // 重新渲染侧边栏和分类
  renderSidebar();
  renderAll();

  // 恢复分类筛选
  if (savedCatId === 'all') {
    document.querySelectorAll('.category-section').forEach(function(s) { s.style.display = ''; });
    var nav = document.getElementById('sidebarNav');
    if (nav) {
      nav.querySelectorAll('.sidebar-link').forEach(function(b) { b.classList.remove('active'); });
      var allBtn = nav.querySelector('.sidebar-link[data-cat="all"]');
      if (allBtn) allBtn.classList.add('active');
    }
  } else {
    filterByCategory(Number(savedCatId));
  }

  // 恢复搜索状态
  if (searchKw && searchPanelVisible) {
    doSearch(searchKw);
  }

  // 更新搜索引擎 placeholder
  var map = { local: I18N.t('search.placeholder'), baidu: I18N.t('search.placeholder'), google: I18N.t('search.placeholder') };
  searchInput.placeholder = map[currentEngine] || map.local;

  // 翻译搜索标签按钮
  document.querySelectorAll('.search-tab').forEach(function(tab) {
    if (tab.dataset.engine === 'local') tab.textContent = I18N.t('search.tab_local');
    else if (tab.dataset.engine === 'baidu') tab.textContent = I18N.t('search.tab_baidu');
    else if (tab.dataset.engine === 'google') tab.textContent = I18N.t('search.tab_google');
  });

  // 翻译无结果提示
  var noResultEl = document.getElementById('noResult');
  if (noResultEl && noResultEl.style.display !== 'none') {
    var p = noResultEl.querySelector('p');
    if (p) p.textContent = I18N.t('search.no_result');
  }
});
(function() {
  var submitBtn = document.getElementById('submitSiteBtn');
  var headerSubmitBtn = document.getElementById('headerSubmitBtn');
  var modal = document.getElementById('submitModal');
  var closeBtn = document.getElementById('submitModalClose');
  var cancelBtn = document.getElementById('submitModalCancel');
  var saveBtn = document.getElementById('submitModalSave');
  var fetchBtn = document.getElementById('submitFetchBtn');
  var errorEl = document.getElementById('submitError');
  var modalContent = modal.querySelector('.modal');

  // 加载分类下拉
  var catSelect = document.getElementById('submitCategory');
  var submitCats = [];
  smartFetchJson('/api/categories', '/data/categories.json').then(function(cats) {
    submitCats = cats;
    var html = '<option value="">' + I18N.t('submit.select_cat') + '</option>';
    cats.forEach(function(c) { html += '<option value="' + c.id + '">' + escapeHtml(I18N.tCat(c.name)) + '</option>'; });
    catSelect.innerHTML = html;
  });

  // 图标预览
  function updateIconPreview(url) {
    var box = document.getElementById('submitIconPreview');
    if (url) {
      box.innerHTML = '<img src="' + url + '" alt="" onerror="this.parentElement.innerHTML=\'🏷\'">';
      box.classList.add('has');
    } else {
      box.innerHTML = '';
      box.classList.remove('has');
    }
  }
  document.getElementById('submitIcon').addEventListener('input', function() {
    updateIconPreview(this.value.trim());
  });

  // 自动抓取网站信息
  function fetchSiteInfo(url, fillTitle, fillDesc, fillIcon) {
    fetchBtn.disabled = true;
    fetchBtn.textContent = I18N.t('submit.fetching');
    var progressEl = document.getElementById('submitFetchProgress');
    if (progressEl) {
      progressEl.style.display = 'flex';
      progressEl.querySelector('.fetch-status').textContent = I18N.t('submit.connecting');
    }

    fetch('/api/fetch-site-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url }),
    }).then(function(r) { return r.json(); }).then(function(data) {
      var filled = [];

      if (fillIcon && data.iconUrl) {
        document.getElementById('submitIcon').value = data.iconUrl;
        updateIconPreview(data.iconUrl);
        filled.push('图标');
      }
      if (fillTitle && data.title) {
        var tEl = document.getElementById('submitTitle');
        if (!tEl.value.trim()) { tEl.value = data.title; filled.push('标题'); }
      }
      if (fillDesc && data.description) {
        var dEl = document.getElementById('submitDesc');
        if (!dEl.value.trim()) { dEl.value = data.description; filled.push('简介'); }
      }

      if (progressEl) progressEl.style.display = 'none';
      if (filled.length > 0) { fetchBtn.textContent = I18N.t('submit.done'); }
      else if (data.error) { fetchBtn.textContent = I18N.t('submit.failed'); }
      else { fetchBtn.textContent = I18N.t('submit.refetch'); }
    }).catch(function() {
      if (progressEl) progressEl.style.display = 'none';
      fetchBtn.textContent = I18N.t('submit.failed');
    }).finally(function() {
      setTimeout(function() { fetchBtn.textContent = I18N.t('submit.fetch'); fetchBtn.disabled = false; }, 2000);
    });
  }

  // URL 失焦自动抓取
  document.getElementById('submitUrl').addEventListener('blur', function() {
    var url = this.value.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    var tE = !document.getElementById('submitTitle').value.trim();
    var dE = !document.getElementById('submitDesc').value.trim();
    var iE = !document.getElementById('submitIcon').value.trim();
    if (tE || dE || iE) fetchSiteInfo(url, tE, dE, iE);
  });

  // 手动点击抓取按钮
  fetchBtn.addEventListener('click', function() {
    var url = document.getElementById('submitUrl').value.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    document.getElementById('submitIcon').value = '';
    updateIconPreview('');
    fetchSiteInfo(url, true, true, true);
  });

  function openModal() {
    // 刷新分类下拉
    if (allCategories.length > 0) {
      var html = '<option value="">' + I18N.t('submit.select_cat') + '</option>';
      allCategories.forEach(function(c) { html += '<option value="' + c.id + '">' + escapeHtml(I18N.tCat(c.name)) + '</option>'; });
      catSelect.innerHTML = html;
    }
    modal.classList.add('show');
    document.getElementById('submitUrl').focus();
    errorEl.style.display = 'none';
  }

  function restoreForm() {
    var mc = modal.querySelector('.modal');
    mc.innerHTML = [
      '<div class="modal-header"><h3 data-i18n="submit.title">' + I18N.t('submit.title') + '</h3><button class="modal-close" id="submitModalClose">&times;</button></div>',
      '<div class="form-group"><label data-i18n="submit.title_label">' + I18N.t('submit.title_label') + ' <span class="req">*</span></label><input type="text" id="submitTitle" data-i18n-placeholder="submit.title_placeholder" placeholder="' + I18N.t('submit.title_placeholder') + '" maxlength="60" autocomplete="off"></div>',
      '<div class="form-group"><label data-i18n="submit.url_label">' + I18N.t('submit.url_label') + ' <span class="req">*</span></label><input type="text" id="submitUrl" data-i18n-placeholder="submit.url_placeholder" placeholder="' + I18N.t('submit.url_placeholder') + '" autocomplete="off"></div>',
      '<div class="form-group"><label data-i18n="submit.cat_label">' + I18N.t('submit.cat_label') + '</label><select id="submitCategory"><option value="">' + I18N.t('submit.select_cat') + '</option></select></div>',
      '<div class="form-group"><label data-i18n="submit.desc_label">' + I18N.t('submit.desc_label') + '</label><textarea id="submitDesc" data-i18n-placeholder="submit.desc_placeholder" placeholder="' + I18N.t('submit.desc_placeholder') + '" maxlength="120" rows="2"></textarea></div>',
      '<div class="form-group"><label data-i18n="submit.icon_label">' + I18N.t('submit.icon_label') + '</label>',
        '<div class="icon-input-row"><input type="text" id="submitIcon" data-i18n-placeholder="submit.icon_placeholder" placeholder="' + I18N.t('submit.icon_placeholder') + '" class="icon-input"><div class="icon-preview-box" id="submitIconPreview"></div></div>',
        '<div class="icon-hint-row"><span class="hint" data-i18n="submit.icon_hint">' + I18N.t('submit.icon_hint') + '</span><button type="button" class="btn btn-fetch" id="submitFetchBtn" data-i18n="submit.fetch">' + I18N.t('submit.fetch') + '</button></div>',
        '<div class="fetch-progress" id="submitFetchProgress"><div class="fetch-spinner"></div><span class="fetch-status">' + I18N.t('submit.connecting') + '</span></div>',
      '</div>',
      '<div class="form-group"><label data-i18n="submit.contact_label">' + I18N.t('submit.contact_label') + '</label><input type="text" id="submitContact" data-i18n-placeholder="submit.contact_placeholder" placeholder="' + I18N.t('submit.contact_placeholder') + '" maxlength="60"></div>',
      '<div id="submitError" class="submit-error"></div>',
      '<div class="form-actions"><button class="btn btn-cancel" id="submitModalCancel" data-i18n="submit.cancel">' + I18N.t('submit.cancel') + '</button><button class="btn btn-submit" id="submitModalSave" data-i18n="submit.save">' + I18N.t('submit.save') + '</button></div>'
    ].join('');
    // Rebind references
    errorEl = document.getElementById('submitError');
    catSelect = document.getElementById('submitCategory');
    fetchBtn = document.getElementById('submitFetchBtn');
    // Refill category dropdown
    var h = '<option value="">' + I18N.t('submit.select_cat') + '</option>';
    allCategories.forEach(function(c) { h += '<option value="' + c.id + '">' + escapeHtml(I18N.tCat(c.name)) + '</option>'; });
    catSelect.innerHTML = h;
    // Rebind events
    document.getElementById('submitModalClose').addEventListener('click', closeModal);
    document.getElementById('submitModalCancel').addEventListener('click', closeModal);
    document.getElementById('submitModalSave').addEventListener('click', handleSubmit);
    fetchBtn.addEventListener('click', function() {
      var u = document.getElementById('submitUrl').value.trim();
      if (!u) return;
      if (!/^https?:\/\//.test(u)) u = 'https://' + u;
      document.getElementById('submitIcon').value = '';
      updateIconPreview('');
      fetchSiteInfo(u, true, true, true);
    });
    document.getElementById('submitUrl').addEventListener('blur', function() {
      var u = this.value.trim();
      if (!u) return;
      if (!/^https?:\/\//.test(u)) u = 'https://' + u;
      var tE = !document.getElementById('submitTitle').value.trim();
      var dE = !document.getElementById('submitDesc').value.trim();
      var iE = !document.getElementById('submitIcon').value.trim();
      if (tE || dE || iE) fetchSiteInfo(u, tE, dE, iE);
    });
    document.getElementById('submitIcon').addEventListener('input', function() {
      updateIconPreview(this.value.trim());
    });
  }

  function closeModal() {
    modal.classList.remove('show');
    // 如果是成功页，先恢复表单再重置
    var mc = modal.querySelector('.modal');
    if (mc && mc.querySelector('.submit-success')) {
      restoreForm();
    }
    // 重置表单（仅在表单元素存在时操作）
    var el;
    el = document.getElementById('submitTitle'); if (el) el.value = '';
    el = document.getElementById('submitUrl'); if (el) el.value = '';
    el = document.getElementById('submitDesc'); if (el) el.value = '';
    el = document.getElementById('submitIcon'); if (el) el.value = '';
    el = document.getElementById('submitContact'); if (el) el.value = '';
    if (catSelect) catSelect.value = '';
    updateIconPreview('');
    if (errorEl) errorEl.style.display = 'none';
  }

  function handleSubmit() {
    var url = document.getElementById('submitUrl').value.trim();
    var title = document.getElementById('submitTitle').value.trim();

    if (!title) {
      errorEl.textContent = I18N.t('submit.error_title');
      errorEl.style.display = 'block';
      return;
    }
    if (!url) {
      errorEl.textContent = I18N.t('submit.error_url');
      errorEl.style.display = 'block';
      return;
    }

    // URL 校验
    if (!/^https?:\/\/.+/.test(url)) url = 'https://' + url;
    try { new URL(url); } catch(e) {
      errorEl.textContent = I18N.t('submit.error_url_format');
      errorEl.style.display = 'block';
      return;
    }

    var data = {
      url: url,
      title: title,
      description: document.getElementById('submitDesc').value.trim(),
      category_id: catSelect.value || null,
      icon_url: document.getElementById('submitIcon').value.trim(),
      contact: document.getElementById('submitContact').value.trim(),
    };

    saveBtn.disabled = true;
    saveBtn.classList.add('btn-loading');
    saveBtn.textContent = I18N.t('submit.saving');
    errorEl.style.display = 'none';

    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(function(r) { return r.json().then(function(result) { return { ok: r.ok, result: result }; }); })
    .then(function(res) {
      if (!res.ok) {
        errorEl.textContent = res.result.error || I18N.t('submit.error_default');
        errorEl.style.display = 'block';
        saveBtn.disabled = false;
        saveBtn.classList.remove('btn-loading');
        saveBtn.textContent = I18N.t('submit.save');
        return;
      }
      // 显示成功页面
      var mc = modal.querySelector('.modal');
      mc.innerHTML = [
        '<div class="submit-success">',
        '<span class="success-icon">🎉</span>',
        '<div class="success-title">' + I18N.t('submit.success_title') + '</div>',
        '<div class="success-desc">' + I18N.t('submit.success_desc') + '</div>',
        '<button class="btn btn-submit" id="submitSuccessClose">' + I18N.t('submit.success_close') + '</button>',
        '</div>'
      ].join('');
      document.getElementById('submitSuccessClose').addEventListener('click', closeModal);
    }).catch(function() {
      errorEl.textContent = I18N.t('submit.error_network');
      errorEl.style.display = 'block';
      saveBtn.disabled = false;
      saveBtn.classList.remove('btn-loading');
      saveBtn.textContent = I18N.t('submit.save');
    });
  }

  submitBtn.addEventListener('click', openModal);
  if (headerSubmitBtn) if (headerSubmitBtn) headerSubmitBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  saveBtn.addEventListener('click', handleSubmit);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
})();
