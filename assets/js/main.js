/* FastWhale main.js — renders the shared chrome and hydrates every
 * config-driven value from window.SITE_CONFIG (see site.config.js).
 * Change the domain there once; this file propagates it everywhere.
 */
(function () {
  var cfg = window.SITE_CONFIG;
  if (!cfg) { document.body.insertAdjacentHTML('beforeend', '<p style="color:#ef4444;font-family:monospace">site.config.js failed to load.</p>'); return; }

  var page = document.body.getAttribute('data-page') || 'home';
  var domain = cfg.domain;
  var siteUrl = (cfg.protocol || 'https') + '://' + domain;
  var email = (cfg.emailUser || 'ping') + '@' + domain;
  var brand = cfg.brand || 'FastWhale';
  var emoji = cfg.emoji || '';
  var navItem = (cfg.nav || []).filter(function (n) { return n.id === page; })[0] || { file: 'index.html' };
  var pageInfo = (cfg.pages && cfg.pages[page]) || { title: brand, description: cfg.description || '' };
  var pageUrl = siteUrl + '/' + navItem.file;
  /* Sub-pages live in pages/, so links injected from the root-relative nav
   * paths need a ../ prefix when the current page is inside a folder. */
  var prefix = navItem.file.indexOf('/') !== -1 ? '../' : '';

  /* ---------- Head hydration (title, meta, canonical) ---------- */
  document.title = pageInfo.title;
  function setMeta(attr, name, content) {
    var m = document.head.querySelector('meta[' + attr + '="' + name + '"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute(attr, name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  setMeta('name', 'description', pageInfo.description);
  setMeta('property', 'og:title', pageInfo.title);
  setMeta('property', 'og:description', pageInfo.description);
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:image', siteUrl + (cfg.banner || '/banner.jpg'));
  var canon = document.head.querySelector('link[rel="canonical"]');
  if (!canon) { canon = document.createElement('link'); canon.setAttribute('rel', 'canonical'); document.head.appendChild(canon); }
  canon.setAttribute('href', pageUrl);

  /* ---------- Shared chrome injection ---------- */
  var boot = document.createElement('div');
  boot.id = 'boot-screen';
  boot.innerHTML = '<div id="boot-text-container"></div>';
  document.body.insertBefore(boot, document.body.firstChild);

  var particles = document.createElement('div');
  particles.id = 'particles-js';
  document.body.insertBefore(particles, document.body.firstChild);

  var navLinks = (cfg.nav || []).map(function (n) {
    var active = n.id === page ? ' class="active" aria-current="page"' : '';
    return '<a href="' + prefix + n.file + '"' + active + '><i class="' + n.icon + '"></i>' + n.label + '</a>';
  }).join('');

  var tickerItems = (cfg.ticker || []).map(function (t) {
    return '<div class="ticker__item">' + t + '</div>';
  }).join('');

  var header = document.createElement('header');
  header.innerHTML =
    '<div class="top-bar">' +
      '<a class="brand" href="' + prefix + 'index.html">' + emoji + ' <span data-site="brand"></span></a>' +
      '<div class="top-controls">' +
        '<div class="status-indicator" id="status-indicator">' +
          '<div class="pulse-dot" id="status-dot"></div>' +
          '<span id="status-text">Checking Node...</span>' +
        '</div>' +
        '<button class="term-btn" id="term-open" aria-label="Open Terminal"><i class="fas fa-terminal"></i></button>' +
        '<button class="toggle-btn" id="themeToggle" aria-label="Toggle Dark/Light Mode"></button>' +
      '</div>' +
    '</div>' +
    '<nav class="main-nav" aria-label="Main navigation">' + navLinks + '</nav>' +
    '<div class="ticker-wrap"><div class="ticker">' + tickerItems + '</div></div>';
  document.body.insertBefore(header, document.body.firstChild);

  var footer = document.createElement('footer');
  footer.innerHTML =
    '<div class="footer-whale"><i class="fas fa-terminal"></i></div><br>' +
    '<strong data-site="domain"></strong> &mdash; <span id="year"></span>' +
    '<div class="footer-quote" id="footerQuote"></div>';
  document.body.appendChild(footer);

  var termModal = document.createElement('div');
  termModal.id = 'terminal-modal';
  termModal.setAttribute('role', 'dialog');
  termModal.setAttribute('aria-modal', 'true');
  termModal.setAttribute('aria-label', 'Terminal Modal');
  termModal.innerHTML =
    '<div class="terminal-window">' +
      '<div class="terminal-header">' +
        '<span>nam@' + domain + ':~</span>' +
        '<span class="term-close" id="term-close" aria-label="Close Terminal"><i class="fas fa-times" style="font-size: 0.85rem;"></i></span>' +
      '</div>' +
      '<div class="terminal-body" id="term-body">' +
        '<div>Welcome to ' + brand + ' Server OS v2.0.</div>' +
        '<div style="opacity: 0.7;">Type \'help\' for a list of available commands.</div>' +
        '<br>' +
        '<div id="term-output"></div>' +
        '<div class="terminal-input-line">' +
          '<span class="term-prompt">nam@whale:~$</span>' +
          '<input type="text" id="term-input" autocomplete="off" spellcheck="false" aria-label="Terminal Input">' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(termModal);

  document.body.insertAdjacentHTML('beforeend',
    '<div id="toast" role="alert" aria-live="assertive"><i class="fas fa-check-circle" style="color: var(--accent-green); margin-right: 6px;"></i> <span id="toast-msg">Copied!</span></div>' +
    '<button id="backToTop" aria-label="Back to top"><i class="fas fa-chevron-up"></i></button>');

  /* ---------- Hydrate config-driven text & links in page content ---------- */
  function linkFor(key) {
    if (key === 'whatsapp' && cfg.whatsapp) {
      var msg = (cfg.whatsapp.message || '').split('{domain}').join(domain);
      return 'https://wa.me/' + cfg.whatsapp.number + '?text=' + encodeURIComponent(msg);
    }
    return (cfg.links && cfg.links[key]) || '#';
  }

  document.querySelectorAll('[data-site]').forEach(function (el) {
    var key = el.getAttribute('data-site');
    if (key === 'domain') el.textContent = domain;
    else if (key === 'siteUrl') el.textContent = siteUrl;
    else if (key === 'email') el.textContent = email;
    else if (key === 'brand') el.textContent = brand;
    else if (key === 'emoji') el.textContent = emoji;
    else if (key.indexOf('tip:') === 0) {
      var tip = (cfg.tips || [])[parseInt(key.slice(4), 10)];
      if (tip) el.textContent = tip.address;
    }
  });

  document.querySelectorAll('[data-site-link]').forEach(function (el) {
    el.setAttribute('href', linkFor(el.getAttribute('data-site-link')));
  });

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var toggleBtn = document.getElementById('themeToggle');
  function renderToggle() {
    toggleBtn.innerHTML = root.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  renderToggle();
  toggleBtn.addEventListener('click', function () {
    if (root.classList.contains('dark')) { root.classList.remove('dark'); root.classList.add('light'); }
    else { root.classList.remove('light'); root.classList.add('dark'); }
    try { localStorage.setItem('fw-theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
    renderToggle();
  });

  /* ---------- Boot screen ---------- */
  var bootScreen = document.getElementById('boot-screen');
  var bootContainer = document.getElementById('boot-text-container');
  var lines = [
    '[ OK ] Booting ' + brand + ' OS kernel...',
    '[ OK ] Mounting MongoDB distributed clusters...',
    '[ OK ] Initializing Pyrogram async workers...',
    '[ OK ] Verifying systemd bot services...',
    '[ OK ] Establishing secure connection...',
    '> Access Granted. Welcome, Nam.'
  ];
  function hideBoot() {
    bootScreen.style.opacity = '0';
    setTimeout(function () { bootScreen.style.visibility = 'hidden'; }, 400);
  }
  setTimeout(hideBoot, 2800); /* safety: never trap the page behind the boot screen */
  var delay = 100;
  lines.forEach(function (line, index) {
    setTimeout(function () {
      var div = document.createElement('div');
      div.className = 'boot-line';
      div.textContent = line;
      bootContainer.appendChild(div);
      if (index === lines.length - 1) setTimeout(hideBoot, 600);
    }, delay);
    delay += Math.floor(Math.random() * 150) + 100;
  });

  /* ---------- Particles ---------- */
  function initParticles() {
    if (!window.particlesJS) return;
    window.particlesJS('particles-js', {
      'particles': {
        'number': { 'value': 35, 'density': { 'enable': true, 'value_area': 800 } },
        'color': { 'value': '#8b5cf6' },
        'shape': { 'type': 'circle' },
        'opacity': { 'value': 0.3, 'random': true },
        'size': { 'value': 3, 'random': true },
        'line_linked': { 'enable': true, 'distance': 150, 'color': '#6366f1', 'opacity': 0.2, 'width': 1 },
        'move': { 'enable': true, 'speed': 1.2, 'direction': 'none', 'random': true, 'out_mode': 'out' }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': { 'onhover': { 'enable': true, 'mode': 'grab' }, 'onclick': { 'enable': true, 'mode': 'push' }, 'resize': true },
        'modes': { 'grab': { 'distance': 140, 'line_linked': { 'opacity': 0.4 } } }
      },
      'retina_detect': true
    });
  }
  var pScript = document.createElement('script');
  pScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  pScript.onload = initParticles;
  document.head.appendChild(pScript);

  /* ---------- Live ping monitor ---------- */
  async function checkServerStatus() {
    var statusText = document.getElementById('status-text');
    var statusDot = document.getElementById('status-dot');
    var indicator = document.getElementById('status-indicator');
    statusText.innerText = 'Pinging...';
    indicator.style.color = '#f59e0b';
    indicator.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    indicator.style.background = 'rgba(245, 158, 11, 0.1)';
    statusDot.style.backgroundColor = '#f59e0b';
    try {
      var startTime = Date.now();
      var response = await fetch(window.location.pathname + '?ping=' + startTime, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        var pingTime = Date.now() - startTime;
        statusText.innerText = 'Operational (' + pingTime + 'ms)';
        indicator.style.color = 'var(--accent-green)';
        indicator.style.borderColor = 'rgba(52, 211, 153, 0.3)';
        indicator.style.background = 'rgba(52, 211, 153, 0.1)';
        statusDot.style.backgroundColor = 'var(--accent-green)';
      } else {
        throw new Error('Degraded');
      }
    } catch (error) {
      statusText.innerText = 'System Degraded';
      indicator.style.color = '#ef4444';
      indicator.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      indicator.style.background = 'rgba(239, 68, 68, 0.1)';
      statusDot.style.backgroundColor = '#ef4444';
      statusDot.style.animation = 'none';
    }
  }
  setTimeout(checkServerStatus, 500);
  setInterval(checkServerStatus, 30000);

  /* ---------- Tabs ---------- */
  document.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('.tab-btn[data-tab]');
    if (!tabBtn) return;
    var tabName = tabBtn.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    var panel = document.getElementById(tabName);
    if (panel) panel.classList.add('active');
    tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', 'true');
  });

  /* ---------- Copy to clipboard (delegated) ---------- */
  function resolveCopyValue(key) {
    if (key === 'email') return email;
    if (key.indexOf('tip:') === 0) {
      var tip = (cfg.tips || [])[parseInt(key.slice(4), 10)];
      return tip ? tip.address : '';
    }
    return '';
  }
  function showToast(msg) {
    var toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = 'show';
    setTimeout(function () { toast.className = toast.className.replace('show', ''); }, 2500);
  }
  function handleCopy(el) {
    var value = resolveCopyValue(el.getAttribute('data-copy'));
    if (!value) return;
    navigator.clipboard.writeText(value).then(function () {
      showToast(el.getAttribute('data-copy-msg') || 'Copied!');
    }).catch(function (err) { console.error('Failed to copy: ', err); });
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-copy]');
    if (el) { e.preventDefault(); handleCopy(el); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest ? e.target.closest('[data-copy]') : null;
    if (el) { e.preventDefault(); handleCopy(el); }
  });

  /* ---------- Footer year & quote ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  var quotes = cfg.quotes || [];
  if (quotes.length) {
    document.getElementById('footerQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  /* ---------- Back to top ---------- */
  var backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
  });
  backToTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Terminal ---------- */
  var termInput = document.getElementById('term-input');
  var termOutput = document.getElementById('term-output');
  var termBody = document.getElementById('term-body');
  function openTerminal() {
    termModal.style.display = 'flex';
    setTimeout(function () { termInput.focus(); }, 100);
  }
  function closeTerminal() { termModal.style.display = 'none'; }
  document.getElementById('term-open').addEventListener('click', openTerminal);
  document.getElementById('term-close').addEventListener('click', closeTerminal);
  termModal.addEventListener('click', function (e) { if (e.target === termModal) closeTerminal(); });
  termInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var command = termInput.value.trim().toLowerCase();
    var response = '';
    switch (command) {
      case 'help': response = 'Available cmds: whoami, ping, stack, date, repo, clear, exit, root'; break;
      case 'whoami': response = 'Nam. Ads manager, builder, optimizer, bot architect.'; break;
      case 'ping': response = 'Pong! All nodes responding at 12ms. Status: GREEN.'; break;
      case 'stack': response = 'Python, Pyrogram, MongoDB, Redis, systemd, MikroTik RouterOS'; break;
      case 'date': response = new Date().toString(); break;
      case 'repo': response = 'Fetching source from GitHub... [Access Denied] Check out ' + (cfg.links && cfg.links.github ? cfg.links.github : 'https://github.com/yuIlariy') + ' instead.'; break;
      case 'sudo': response = 'User "nam" is not in the sudoers file. This incident will be reported.'; break;
      case 'root': response = 'Access denied. Nice try though.'; break;
      case 'clear': termOutput.innerHTML = ''; termInput.value = ''; return;
      case 'exit': closeTerminal(); termInput.value = ''; return;
      case '': break;
      default: response = 'bash: ' + command + ': command not found';
    }
    if (command !== '') {
      termOutput.innerHTML += '<div><span class="term-prompt">nam@whale:~$</span> ' + command + '</div>';
      if (response) termOutput.innerHTML += '<div style="color: #94a3b8; margin-bottom: 8px;">' + response + '</div>';
    }
    termInput.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  });
})();
