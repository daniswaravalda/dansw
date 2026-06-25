(function () {
  const html = document.documentElement
  const settingsBtn = document.getElementById('settingsBtn')
  const modal = document.getElementById('settingsModal')
  const modalClose = document.getElementById('modalClose')

  const defaults = { theme: 'system', fontSize: 'normal', animation: 'standard' }
  let saved = {}
  let notificationTimer

  function toKebab(str) {
    return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  }

  function showNotification(msg) {
    const el = document.getElementById('notification')
    el.textContent = msg
    el.classList.add('show')
    clearTimeout(notificationTimer)
    notificationTimer = setTimeout(() => el.classList.remove('show'), 2200)
  }

  function loadSettings() {
    try {
      saved = JSON.parse(localStorage.getItem('portfolioSettings'))
      if (!saved || typeof saved !== 'object') saved = {}
    } catch {
      saved = {}
    }
    Object.keys(defaults).forEach((key) => {
      if (!saved[key]) saved[key] = defaults[key]
    })
  }

  function applySettings() {
    Object.entries(saved).forEach(([key, val]) => {
      html.setAttribute(`data-${toKebab(key)}`, val)
    })
    handleSystemTheme()
    document.querySelectorAll('[data-setting]').forEach((group) => {
      const key = group.dataset.setting
      group.querySelectorAll('.setting-option').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.value === saved[key])
      })
    })
  }

  function handleSystemTheme() {
    if (saved.theme !== 'system') return
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }

  function saveAndApply() {
    localStorage.setItem('portfolioSettings', JSON.stringify(saved))
    applySettings()
    showNotification('Settings saved successfully!')
  }

  function openModal() {
    modal.classList.add('active')
  }

  function closeModal() {
    modal.classList.remove('active')
  }

  settingsBtn.addEventListener('click', openModal)
  modalClose.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })

  document.querySelectorAll('.setting-options').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.setting-option')
      if (!btn) return
      const key = group.dataset.setting
      const value = btn.dataset.value
      saved[key] = value
      saveAndApply()
    })
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (saved.theme === 'system') handleSystemTheme()
  })

  loadSettings()
  applySettings()

  const sections = document.querySelectorAll('.section, .hero')
  const navLinks = document.querySelectorAll('.nav-link')
  const hamburger = document.getElementById('hamburger')
  const navLinksContainer = document.querySelector('.nav-links')

  const observerOptions = { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        })
      }
    })
  }, observerOptions)
  sections.forEach((s) => sectionObserver.observe(s))

  const scrollAnim = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          scrollAnim.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.hero-content, .about-image, .about-content, .skill-card, .store-card, .contact-info, .contact-form').forEach((el) => {
    el.classList.add('fade-in')
    scrollAnim.observe(el)
  })

  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active')
  })
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active')
    })
  })

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('button[type="submit"]')
    const orig = btn.textContent
    btn.textContent = 'Message Sent!'
    btn.disabled = true
    setTimeout(() => {
      btn.textContent = orig
      btn.disabled = false
      e.target.reset()
    }, 2500)
  })

  const storeGrid = document.getElementById('storeGrid');
  if (storeGrid) {
    const viewBtns = document.querySelectorAll('.view-btn');
    const savedView = localStorage.getItem('storeView') || 'card';

    function setView(view) {
      storeGrid.classList.remove('list-view');
      if (view === 'list') storeGrid.classList.add('list-view');
      viewBtns.forEach(function (b) {
        b.classList.remove('active');
        if (b.getAttribute('data-view') === view) b.classList.add('active');
      });
      localStorage.setItem('storeView', view);
    }

    setView(savedView);

    for (var i = 0; i < viewBtns.length; i++) {
      viewBtns[i].addEventListener('click', function (e) {
        setView(this.getAttribute('data-view'));
      });
    }
  }
})()
