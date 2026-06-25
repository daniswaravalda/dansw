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
  document.querySelectorAll('.hero-content, .about-image, .about-content, .skill-card, .project-card, .contact-info, .contact-form').forEach((el) => {
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

  const contactForm = document.getElementById('contactForm')
  if (contactForm) {
    var lastSent = 0
    var cooldown = 60

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault()

      var now = Date.now()
      var elapsed = (now - lastSent) / 1000
      if (elapsed < cooldown) {
        var wait = Math.ceil(cooldown - elapsed)
        showNotification('Please wait ' + wait + 's before sending again')
        return
      }

      var btn = this.querySelector('button[type="submit"]')
      var formData = new FormData(this)
      var name = formData.get('name') || this.querySelector('input[placeholder*="Name"]')?.value || ''
      var email = formData.get('email') || this.querySelector('input[placeholder*="Email"]')?.value || ''
      var subject = formData.get('subject') || this.querySelector('input[placeholder*="Subject"]')?.value || ''
      var message = formData.get('message') || this.querySelector('textarea')?.value || ''

      var text = [
        '*New Contact Message*',
        '',
        '*Name:* ' + name,
        '*Email:* ' + email,
        '*Subject:* ' + subject,
        '*Message:* ' + message
      ].join('\n')

      btn.disabled = true
      showNotification('Sending...')

      fetch('https://api.telegram.org/bot6334424330:AAEnmh0IPMTz55bEGxeBMEmkX_29k10pxHk/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '5959448918',
          text: text,
          parse_mode: 'Markdown'
        })
      }).then(function (res) {
        if (res.ok) {
          lastSent = Date.now()
          this.reset()
          showNotification('Message sent successfully!')
        } else {
          showNotification('Failed to send message')
        }
        btn.disabled = false
      }.bind(this)).catch(function () {
        showNotification('Network error')
        btn.disabled = false
      })
    })
  }

  const projectGrid = document.getElementById('projectGrid');
  if (projectGrid) {
    const viewBtns = document.querySelectorAll('.view-btn');
    const savedView = localStorage.getItem('projectView') || 'card';

    function setView(view) {
      projectGrid.classList.remove('list-view');
      if (view === 'list') projectGrid.classList.add('list-view');
      viewBtns.forEach(function (b) {
        b.classList.remove('active');
        if (b.getAttribute('data-view') === view) b.classList.add('active');
      });
      localStorage.setItem('projectView', view);
    }

    setView(savedView);

    for (var i = 0; i < viewBtns.length; i++) {
      viewBtns[i].addEventListener('click', function (e) {
        setView(this.getAttribute('data-view'));
      });
    }
  }
})()
