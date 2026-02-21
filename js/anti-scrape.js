(() => {
  const ARTICLE_SELECTOR = "#post #article-container";
  const WATERMARK_ID = "anti-scrape-watermark";
  const BOT_CLASS = "anti-scrape-bot";
  const SUSPICIOUS_UA_PARTS = [
    "gptbot",
    "oai-searchbot",
    "chatgpt-user",
    "google-extended",
    "claudebot",
    "anthropic-ai",
    "ccbot",
    "bytespider",
    "cohere-ai",
    "perplexitybot",
    "perplexity-user",
    "semrushbot",
    "mj12bot",
    "dotbot",
    "petalbot",
    "python-requests",
    "python-httpx",
    "scrapy",
    "curl/",
    "wget/",
    "go-http-client",
    "headlesschrome",
    "phantomjs",
    "selenium",
    "playwright",
    "puppeteer"
  ];

  function getArticle() {
    return document.querySelector(ARTICLE_SELECTOR);
  }

  function isNodeInArticle(node) {
    const article = getArticle();
    if (!article || !node) return false;
    const element = node.nodeType === 1 ? node : node.parentElement;
    return Boolean(element && article.contains(element));
  }

  function isLikelyBot() {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (navigator.webdriver === true) return true;
    return SUSPICIOUS_UA_PARTS.some((part) => ua.includes(part));
  }

  function blockArticleForBots() {
    const article = getArticle();
    if (!article || !isLikelyBot()) return;

    document.documentElement.classList.add(BOT_CLASS);
    article.innerHTML = "";

    const notice = document.createElement("div");
    notice.className = "anti-scrape-block-msg";
    notice.textContent = "Access denied for automated clients.";
    article.appendChild(notice);
  }

  function addWatermark() {
    const article = getArticle();
    if (!article || document.getElementById(WATERMARK_ID)) return;

    const layer = document.createElement("div");
    layer.id = WATERMARK_ID;
    layer.setAttribute("aria-hidden", "true");

    const stampDate = new Date().toISOString().slice(0, 10);
    const stamp = `${location.hostname} | ${stampDate} | ${location.pathname}`;

    for (let i = 0; i < 24; i += 1) {
      const item = document.createElement("span");
      item.textContent = stamp;
      layer.appendChild(item);
    }

    document.body.appendChild(layer);
  }

  function bindCopyAttribution() {
    if (document.body.dataset.antiScrapeCopyBound === "1") return;
    document.body.dataset.antiScrapeCopyBound = "1";

    document.addEventListener(
      "copy",
      (event) => {
        const article = getArticle();
        if (!article) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        if (!isNodeInArticle(selection.anchorNode)) return;

        const text = selection.toString().trim();
        if (text.length < 80) return;

        const payload = [
          text,
          "",
          `Source: ${document.title}`,
          `URL: ${location.href}`,
          `Copyright: ${location.hostname}`
        ].join("\n");

        if (event.clipboardData) {
          event.clipboardData.setData("text/plain", payload);
          event.preventDefault();
        }
      },
      true
    );
  }

  function bindArticleGuards() {
    const article = getArticle();
    if (!article || article.dataset.antiScrapeBound === "1") return;
    article.dataset.antiScrapeBound = "1";

    article.addEventListener("contextmenu", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("pre, code, a, button, input, textarea")) return;
      event.preventDefault();
    });

    article.addEventListener("dragstart", (event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    });
  }

  function init() {
    blockArticleForBots();
    addWatermark();
    bindCopyAttribution();
    bindArticleGuards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("pjax:complete", init);
})();
