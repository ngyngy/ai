import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load initial data
const dataDir = path.join(__dirname, "data");
let categories: any[] = [];
let links: any[] = [];
let siteSettings: any = {};
let submissions: any[] = [];

try {
  const catPath = path.join(dataDir, "categories.json");
  if (fs.existsSync(catPath)) {
    categories = JSON.parse(fs.readFileSync(catPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load categories.json", e);
}

try {
  const linkPath = path.join(dataDir, "links.json");
  if (fs.existsSync(linkPath)) {
    links = JSON.parse(fs.readFileSync(linkPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load links.json", e);
}

try {
  const settingsPath = path.join(dataDir, "site-settings.json");
  if (fs.existsSync(settingsPath)) {
    siteSettings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load site-settings.json", e);
}

// Serve static assets from public & icons
app.use("/icons", express.static(path.join(__dirname, "public", "icons")));
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/data", express.static(path.join(__dirname, "public", "data")));
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

app.get("/api/links", (req, res) => {
  res.json(links);
});

app.get("/api/site-settings", (req, res) => {
  res.json(siteSettings);
});

app.post("/api/fetch-site-info", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i) ||
      html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i);

    const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;
    const description = descMatch ? descMatch[1].trim() : "";
    const icon_url = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;

    res.json({
      title,
      description,
      icon_url,
    });
  } catch (error: any) {
    res.json({
      title: "",
      description: "",
      icon_url: "",
    });
  }
});

app.post("/api/submissions", (req, res) => {
  const { title, url, category_id, description, icon_url, contact } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  const newSub = {
    id: Date.now(),
    title,
    url,
    category_id,
    description,
    icon_url,
    contact,
    created_at: new Date().toISOString(),
  };

  submissions.push(newSub);

  res.json({
    success: true,
    message: "提交成功，我们会尽快审核！",
  });
});

app.get("/api/favicon", (req, res) => {
  const domain = req.query.domain as string;
  if (!domain) {
    return res.redirect("/icons/logo-img.png");
  }
  return res.redirect(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
});

// Helper to escape HTML in SSR template
function escapeHtml(str: string) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Render tool detail page
function renderToolPage(link: any) {
  const category = categories.find((c) => c.id === link.category_id) || {
    id: 0,
    name: "AI工具",
  };
  const categoryName = category.name.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]\s*/u, "");

  let detailBlocks: any[] = [];
  if (link.detail_content) {
    try {
      const parsed = JSON.parse(link.detail_content);
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        detailBlocks = parsed.blocks;
      }
    } catch (e) {
      // fallback
    }
  }

  // Related tools from same category
  const relatedLinks = links
    .filter((l) => l.category_id === link.category_id && l.id !== link.id)
    .slice(0, 6);

  let blocksHtml = "";
  if (detailBlocks.length > 0) {
    blocksHtml = detailBlocks
      .map((block: any) => {
        if (block.type === "intro") {
          const ps = (block.content || "")
            .split("\n\n")
            .map((p: string) => `<p data-orig-detail-text="${escapeHtml(p)}">${escapeHtml(p)}</p>`)
            .join("");
          return `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">📖</span><span data-i18n="detail.intro">${escapeHtml(
            block.title || "简介"
          )}</span></h3>${ps}</div>`;
        } else if (block.type === "features") {
          const items = (block.items || [])
            .map((item: string) => `<li data-orig-detail-text="${escapeHtml(item)}">${escapeHtml(item)}</li>`)
            .join("");
          return `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">✨</span><span data-i18n="detail.features">${escapeHtml(
            block.title || "核心特色"
          )}</span></h3><ul class="td-feature-list">${items}</ul></div>`;
        } else if (block.type === "scenarios") {
          const items = (block.items || [])
            .map((item: string) => `<li data-orig-detail-text="${escapeHtml(item)}">${escapeHtml(item)}</li>`)
            .join("");
          return `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">🎯</span><span data-i18n="detail.scenarios">${escapeHtml(
            block.title || "应用场景"
          )}</span></h3><ul class="td-feature-list">${items}</ul></div>`;
        } else if (block.type === "pricing") {
          const items = (block.items || [])
            .map(
              (item: any) =>
                `<div class="td-pricing-item"><span class="td-p-name">${escapeHtml(
                  item.name
                )}</span><span class="td-p-price">${escapeHtml(
                  item.price
                )}</span><span class="td-p-desc">${escapeHtml(item.desc || "")}</span></div>`
            )
            .join("");
          return `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">💰</span><span data-i18n="detail.pricing">${escapeHtml(
            block.title || "收费模式"
          )}</span></h3><div class="td-pricing-grid">${items}</div></div>`;
        } else if (block.type === "tips") {
          const items = (block.items || [])
            .map((item: string) => `<li data-orig-detail-text="${escapeHtml(item)}">${escapeHtml(item)}</li>`)
            .join("");
          return `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">💡</span><span>${escapeHtml(
            block.title || "使用技巧"
          )}</span></h3><ul class="td-feature-list">${items}</ul></div>`;
        }
        return "";
      })
      .join("");
  } else {
    blocksHtml = `<div class="td-block"><h3 class="td-block-title"><span class="td-block-icon">📖</span><span data-i18n="detail.intro">简介</span></h3><p>${escapeHtml(
      link.description || "暂无详细介绍"
    )}</p></div>`;
  }

  const relatedHtml = relatedLinks
    .map(
      (r) =>
        `<a class="td-related-card" href="/tool/${r.slug || r.id}"><img src="${
          r.icon_url || "/icons/logo-img.png"
        }" alt="${escapeHtml(r.title)}" width="32" height="32" onerror="this.src='/icons/logo-img.png'"><div class="td-related-info"><div class="td-related-title">${escapeHtml(
          r.title
        )}</div><div class="td-related-desc">${escapeHtml(r.description || "")}</div></div></a>`
    )
    .join("");

  const tagsArr = (link.tags || "").split(" ").filter(Boolean);
  const tagsHtml = tagsArr
    .map((t: string) => `<span class="td-meta-tag ${t.toLowerCase()}">${escapeHtml(t)}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(link.title)} - AI导航</title>
  <link rel="icon" type="image/png" href="/icons/logo-img.png">
  <meta name="description" content="${escapeHtml(link.description || "")}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/tool-detail.css">
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="header-logo">
        <span class="header-logo-text" data-i18n="site.name">AI导航</span>
      </a>
      <nav class="header-nav">
        <a href="/">首页</a>
        <a href="/#cat-29">热门推荐</a>
        <a href="/#cat-30">龙虾与Agent</a>
        <a href="https://x.com/nangongyuan/" target="_blank" rel="noopener">南宫远推特</a>
      </nav>
      <div class="header-actions">
        
      </div>
    </div>
  </header>

  <main class="td-main">
    <nav class="td-breadcrumb">
      <a href="/" data-i18n="nav.home">首页</a> &gt;
      <a href="/#cat-${link.category_id}" data-orig-cat="${escapeHtml(category.name)}">${escapeHtml(
    categoryName
  )}</a> &gt;
      <span>${escapeHtml(link.title)}</span>
    </nav>

    <section class="td-hero">
      <div class="td-hero-icon">
        <img src="${link.icon_url || "/icons/logo-img.png"}" alt="${escapeHtml(
    link.title
  )}" width="72" height="72" onerror="this.src='/icons/logo-img.png'">
      </div>
      <div class="td-hero-info">
        <h1 class="td-hero-title">${escapeHtml(link.title)}</h1>
        <p class="td-hero-desc" data-orig-desc="${escapeHtml(link.description || "")}">${escapeHtml(
    link.description || ""
  )}</p>
        <div class="td-hero-meta">
          <span class="td-meta-tag">${escapeHtml(categoryName)}</span>
          ${link.is_recommended ? '<span class="td-meta-tag rec">⭐ 推荐</span>' : ""}
          ${tagsHtml}
        </div>
        <div class="td-hero-actions">
          <a href="${
            link.url
          }" target="_blank" rel="noopener" class="td-btn primary" data-i18n="detail.visit_website">🚀 访问官网</a>
          <button class="td-btn secondary" onclick="navigator.clipboard.writeText('${
            link.url
          }');alert('链接已复制到剪贴板！')" data-i18n="detail.copy_link">📋 复制链接</button>
        </div>
      </div>
    </section>

    <div class="td-content-grid">
      <div class="td-content-main">
        ${blocksHtml}
      </div>

      <aside class="td-sidebar">
        <div class="td-sidebar-card">
          <h3 class="td-side-title" data-i18n="detail.tool_info">ℹ️ 工具信息</h3>
          <div class="td-info-item">
            <span class="label">名称</span>
            <span class="value">${escapeHtml(link.title)}</span>
          </div>
          <div class="td-info-item">
            <span class="label">分类</span>
            <span class="value">${escapeHtml(categoryName)}</span>
          </div>
          <div class="td-info-item">
            <span class="label">链接</span>
            <a class="value link" href="${link.url}" target="_blank" rel="noopener">${escapeHtml(link.url)}</a>
          </div>
          <div class="td-info-item">
            <span class="label">更新时间</span>
            <span class="value">${escapeHtml(link.updated_at || link.created_at || "最近")}</span>
          </div>
        </div>
      </aside>
    </div>

    ${
      relatedLinks.length > 0
        ? `<section class="td-related">
      <h2 class="td-section-title" data-i18n="detail.related_tools">🔗 相关工具推荐</h2>
      <div class="td-related-grid">
        ${relatedHtml}
      </div>
    </section>`
        : ""
    }
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="friend-links-container">
        <h3 class="friend-links-title">🔗 友情链接</h3>
        <div class="friend-links-grid">
          <a href="https://btc.ngy123.com" target="_blank" rel="noopener">比特币导航站</a>
          <a href="https://fabi.ngy123.com" target="_blank" rel="noopener">全球法币排行榜</a>
          <a href="https://eth.ngy123.com" target="_blank" rel="noopener">以太坊资源导航</a>
          <a href="https://gxs.ngy123.com" target="_blank" rel="noopener">高晓松资源下载</a>
          <a href="https://btczy.ngy123.com" target="_blank" rel="noopener">比特币资源下载站</a>
          <a href="https://binance.ngy123.com" target="_blank" rel="noopener">币安</a>
          <a href="https://okx.ngy123.com" target="_blank" rel="noopener">OKX</a>
          <a href="https://tianya.ngy123.com" target="_blank" rel="noopener">天涯神贴分享站</a>
          <a href="https://xuexi.ngy123.com" target="_blank" rel="noopener">中小学学习资源网</a>
          <a href="https://dy.ngy123.com" target="_blank" rel="noopener">电影资源站</a>
        </div>
      </div>
      <div class="footer-copyright">
        <p>© AI导航 - AI导航 | AI好站 | 发现全球优质AI工具与资源</p>
      </div>
    </div>
  </footer>

  <script src="/js/i18n.js"></script>
  <script src="/js/desc-translations.js"></script>
  <script src="/js/detail-translate.js"></script>
</body>
</html>`;
}

// Tool detail page route
app.get("/tool/:slug", (req, res) => {
  const { slug } = req.params;
  const link = links.find((l) => l.slug === slug || String(l.id) === slug);
  if (!link) {
    return res.status(404).send("Tool not found");
  }
  res.send(renderToolPage(link));
});

app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/sitemap.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.html"));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI.txdd.cn Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
