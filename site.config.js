/* FastWhale site config — the single source of truth.
 *
 * YEARLY DOMAIN CHANGE: edit only `domain` below. Every domain reference on
 * the site is rendered from it at runtime (og:url, og:image, canonical, email,
 * WhatsApp message text, footer, terminal prompt). No domain is hard-coded in
 * the HTML pages. For GitHub Pages, also update the `CNAME` file to match.
 */
window.SITE_CONFIG = {
  domain: "fastwhale.app",
  protocol: "https",

  brand: "FastWhale",
  emoji: "\uD83D\uDC0B",
  tagline: "Telegram Bot Architect",
  description: "Builder, optimizer, and Telegram bot architect. Zero tolerance for fluff and full commitment to precision.",
  banner: "/banner.jpg",

  emailUser: "ping",

  whatsapp: {
    number: "254708583813",
    message: "Hey Nam! Just landed on {domain} and had to say \u2014 slick setup. Got a minute?"
  },

  links: {
    github: "https://github.com/yuIlariy",
    telegram: "https://t.me/xspes",
    botsChannel: "https://t.me/OtherBs",
    appsChannel: "https://t.me/UnlimAPKS",
    flagshipBot: "https://t.me/DigitalAutoRenameBot",
    utilityBot: "https://t.me/digitalfilesrenamebot"
  },

  // `file` paths are root-relative. Only index.html lives at the root
  // (GitHub Pages serves it as the homepage); sub-pages live in pages/.
  nav: [
    { id: "home", label: "Home", file: "index.html", icon: "fas fa-home" },
    { id: "bots", label: "Bots", file: "pages/bots.html", icon: "fas fa-robot" },
    { id: "stack", label: "Stack", file: "pages/stack.html", icon: "fas fa-network-wired" },
    { id: "channels", label: "Channels", file: "pages/channels.html", icon: "fas fa-bullhorn" }
  ],

  pages: {
    home: {
      title: "FastWhale \uD83D\uDC0B | Telegram Bot Architect",
      description: "Builder, optimizer, and Telegram bot architect. Zero tolerance for fluff and full commitment to precision."
    },
    bots: {
      title: "Bots | FastWhale \uD83D\uDC0B",
      description: "Flagship and utility Telegram bots \u2014 worker-based auto-renaming, 2GB+ files, sequence tracking."
    },
    stack: {
      title: "Tech Stack | FastWhale \uD83D\uDC0B",
      description: "The tools and engines powering my deployments and bots: Python, Pyrogram, MongoDB, Redis, systemd, MikroTik."
    },
    channels: {
      title: "Channels | FastWhale \uD83D\uDC0B",
      description: "App hub and premium mods \u2014 stable releases and unlocked APKs."
    }
  },

  tips: [
    { label: "USDT (BEP20)", icon: "fas fa-wallet", address: "0x3374677728e264dc0e006821dea242c4424766f1", msg: "BEP20 Address copied!" },
    { label: "USDT (TRC20)", icon: "fas fa-coins", address: "TRUfcJwrPWb3q5wbETJZDQuQY3WZQbKDGg", msg: "TRC20 Address copied!" },
    { label: "Binance Pay ID", icon: "fas fa-qrcode", address: "734131187", msg: "Binance ID copied!" }
  ],

  ticker: [
    "[v2.4] Digital Auto Rename Bot - Worker architecture optimized.",
    "[Update] Sequence tracking for Series now live.",
    "[Status] All core database clusters operating at optimal efficiency.",
    "[Feature] Max limit handling increased for premium tasks."
  ],

  quotes: [
    "FastWhale: Where bots don't sleep and DNS never fails.",
    "Built fast. Runs faster. Breaks never.",
    "Precision is my love language.",
    "If it's patched, it's probably Nam.",
    "Minimal by design, maximal by impact."
  ]
};
