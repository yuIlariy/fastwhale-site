# fastwhale-site 🚀

Modern multi-page static site for **FastWhale 🐋** — zero build step, served via GitHub Pages.

## Structure

```
├── index.html          Home — intro, skills, explore cards (must stay at root: GitHub Pages serves it as the homepage)
├── pages/
│   ├── bots.html       Telegram bots (flagship + utility, tabs & FAQ)
│   ├── stack.html      Tech stack & infrastructure
│   ├── channels.html   App/mod/ROM channels + tip jar
│   └── contact.html    Telegram, email, WhatsApp
├── site.config.js      ← THE config: brand, domain, links, tips, nav, pages
├── assets/
│   ├── css/style.css   All styles (theme variables, dark/light)
│   ├── js/main.js      Shared chrome + config hydration + interactions
│   └── favicon.svg
├── CNAME               GitHub Pages custom domain
└── LICENSE
```

Sub-pages live in `pages/` so the root stays clean. Their asset/config links
use `../`, and `main.js` automatically prefixes nav links with `../` on
sub-pages (nav `file` paths in `site.config.js` stay root-relative).

Every page loads `site.config.js` first, then `assets/js/main.js`, which renders the
shared header/nav/ticker/footer/terminal from the config and fills all
`data-site` / `data-site-link` placeholders in the page.

## Changing the domain (yearly)

1. Edit **`domain`** in `site.config.js` — that is the only place a domain lives.
   Everything is derived from it at runtime: `og:url`, `og:image`, canonical URL,
   the email address (`emailUser@domain`), the WhatsApp message text (`{domain}`
   placeholder), the footer, and the terminal prompt.
2. Update **`CNAME`** to the new domain so GitHub Pages routes it.

No domain string is hard-coded in any HTML page anymore.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Add a page

1. Create `pages/<name>.html` with `<body data-page="<name>">`, a `<main>` block,
   and head links using `../assets/...` + `../site.config.js`.
2. Add an entry to `nav` (root-relative `file: "pages/<name>.html"`) and `pages` in `site.config.js`.

## Notes

- Drop a `banner.jpg` at the repo root to make `og:image` resolve (path is
  configurable via `banner` in `site.config.js`).
- Theme preference persists in `localStorage` (`fw-theme`).
