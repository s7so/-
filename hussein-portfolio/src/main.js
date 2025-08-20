import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 1) Hook: type-in headline and breathing arrow
const hookText = document.querySelector('.hook-text')
const headline = 'Good developers write code. Great developers build systems.'

if (!prefersReduced) {
  gsap.to(hookText, {
    duration: 3.6,
    text: headline,
    ease: 'power1.out',
    delay: 0.2
  })
} else {
  hookText.textContent = headline
}

// 2) Problem: refined 2D scatter -> converge with pinning
const chaosStage = document.getElementById('chaosStage')
const chaosWord = 'CHAOS'
const chaosCount = 14
const letters = []

for (let i = 0; i < chaosCount; i++) {
  const letter = document.createElement('div')
  letter.className = 'chaos-letter'
  letter.textContent = chaosWord[i % chaosWord.length]
  chaosStage.appendChild(letter)
  letters.push(letter)
}

if (!prefersReduced) {
  // Initial 2D scatter from center with subtle rotation
  letters.forEach((el) => {
    gsap.set(el, {
      x: gsap.utils.random(-220, 220, 1),
      y: gsap.utils.random(-140, 140, 1),
      rotation: gsap.utils.random(-20, 20, 1),
      opacity: gsap.utils.random(0.5, 0.85, 0.01)
    })
  })

  const chaosTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#problem',
      start: 'top top',
      end: '+=160%',
      scrub: true,
      pin: true
    }
  })

  // drift a bit
  chaosTl.to(letters, {
    x: (i, el) => gsap.getProperty(el, 'x') + gsap.utils.random(-40, 40, 1),
    y: (i, el) => gsap.getProperty(el, 'y') + gsap.utils.random(-26, 26, 1),
    rotation: (i, el) => gsap.getProperty(el, 'rotation') + gsap.utils.random(-8, 8, 1),
    ease: 'sine.inOut',
    stagger: { each: 0.02, from: 'random' }
  })
  // converge into neat CHAOS row centered
  .to(letters, {
    x: (i) => (i % chaosWord.length) * 84 - (chaosWord.length - 1) * 42,
    y: 0,
    rotation: 0,
    scale: 1.02,
    opacity: 1,
    ease: 'power3.out',
    stagger: { each: 0.04, from: 'center' }
  })
}

const problemPhrase = document.querySelector('.problem-phrase')
const phraseUnderline = document.querySelector('.phrase-underline')
if (!prefersReduced) {
  const phraseTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#problem',
      start: 'top 20%',
      end: 'bottom center',
      scrub: true
    }
  })
  phraseTl.to(problemPhrase, { opacity: 1, duration: 0.6, ease: 'power2.out' })
          .to(phraseUnderline, { width: '64%', opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
}

// 3) Solution: map icon reveal and tagline
const mapIcon = document.querySelector('.map-icon')
const methodTagline = document.querySelector('.method-tagline')
const shimmer = document.querySelector('.solution-question .shimmer')
const questionUnderline = document.querySelector('.solution-question .question-underline')

if (!prefersReduced) {
  const solTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#solution',
      start: 'top center',
      end: '+=60%',
      scrub: true
    }
  })
  solTl.to(shimmer, { backgroundPositionX: '100%', duration: 1.2, ease: 'power1.inOut' })
      .to(questionUnderline, { width: '56%', opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.6')
      .to(mapIcon, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to(methodTagline, { opacity: 1, duration: 0.6 }, '-=0.2')

  // SVG route draw and POI pulse
  gsap.to('.route', {
    scrollTrigger: { trigger: '#solution', start: 'top 40%', end: 'center 20%', scrub: true },
    strokeDashoffset: 0,
    ease: 'none'
  })
  gsap.fromTo('.poi', { scale: 0.6, opacity: 0.6 }, {
    scrollTrigger: { trigger: '#solution', start: 'top 40%', end: 'center 20%', scrub: true },
    scale: 1,
    opacity: 1,
    ease: 'power2.out'
  })
}

// 4) Sizes: pin and step through S -> M -> L
const sizeCards = gsap.utils.toArray('.size-card')
if (sizeCards.length) {
  if (!prefersReduced) {
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-wrapper',
        start: 'top top',
        end: '+=200%',
        scrub: true,
        pin: '.size-stage'
      }
    })

    sizeCards.forEach((card, index) => {
      pinTl.to(card, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' })
           .to(card, { opacity: 0, scale: 0.9, y: -20, duration: 0.5, ease: 'power2.in' }, '+=0.6')
    })
  } else {
    sizeCards.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none' })
  }
}

// 5) Work: gentle rise-in on enter
if (!prefersReduced) {
  const cards = gsap.utils.toArray('.work-card')
  cards.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    })
  })

  // subtle parallax/tilt by mouse within grid scope
  const tiltScope = document.querySelector('[data-tilt-scope]')
  if (tiltScope) {
    const maxTilt = 6
    const updateTilt = (e) => {
      const rect = tiltScope.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      cards.forEach((card) => {
        const accent = card.getAttribute('data-accent') || 'rgba(139,92,246,0.35)'
        gsap.to(card, { rotateY: dx * maxTilt, rotateX: -dy * maxTilt, transformPerspective: 800, duration: 0.4, ease: 'power2.out' })
        gsap.to(card.querySelector('.work-media'), { background: `radial-gradient(650px 220px at ${50 + dx * 20}% ${-10 + dy * 10}%, ${accent}, transparent 60%)`, duration: 0.4, ease: 'power2.out' })
      })
    }
    const resetTilt = () => {
      cards.forEach((card) => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
        gsap.to(card.querySelector('.work-media'), { background: 'radial-gradient(600px 180px at 50% -10%, rgba(255,255,255,0.08), transparent 60%)', duration: 0.5 })
      })
    }
    tiltScope.addEventListener('mousemove', updateTilt)
    tiltScope.addEventListener('mouseleave', resetTilt)
  }
}

// Blur-up ready state for images
const lazyImgs = Array.from(document.querySelectorAll('.work-img'))
lazyImgs.forEach((img) => {
  if (img.complete) {
    img.classList.add('is-ready')
  } else {
    img.addEventListener('load', () => img.classList.add('is-ready'), { once: true })
  }
})

// Filters
const filterChips = Array.from(document.querySelectorAll('.filter-chip'))
const workCards = Array.from(document.querySelectorAll('.work-card'))
const setFilter = (key) => {
  filterChips.forEach((b) => b.classList.toggle('active', b.dataset.filter === key))
  workCards.forEach((card) => {
    const show = key === 'all' || card.dataset.category === key
    gsap.to(card, { opacity: show ? 1 : 0.12, scale: show ? 1 : 0.98, duration: 0.35, ease: 'power2.out', pointerEvents: show ? 'auto' : 'none' })
  })
}
filterChips.forEach((btn) => btn.addEventListener('click', () => setFilter(btn.dataset.filter)))

// 6) CTA: stagger in socials
if (!prefersReduced) {
  gsap.fromTo('.social',
    { y: 8, opacity: 0 },
    {
      scrollTrigger: { trigger: '#contact', start: 'top 80%' },
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.45,
      ease: 'power2.out'
    }
  )
}

// 7) Phases: reveal cards on enter and scrollspy for nav
if (!prefersReduced) {
  gsap.utils.toArray('.phase-card').forEach((card) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
}

// Phase tabs and dynamic Phase 1 panel
const phasesSection = document.getElementById('phases')
const tabsContainer = phasesSection?.querySelector('.phase-tabs')
const ensurePhase1Panel = () => {
  const existing = phasesSection.querySelector('.phase-panel[data-phase="1"]')
  if (existing) return existing
  const panel = document.createElement('div')
  panel.className = 'phase-panel'
  panel.setAttribute('data-phase', '1')
  panel.innerHTML = `
            <div class="phase-header">
              <div class="phase-badge">Phase 1</div>
              <h3 class="phase-heading">Idea Autopsy</h3>
              <div class="phase-chip subtle">Specs to Execution</div>
            </div>

            <div class="phase-grid">
              <aside class="phase-nav" aria-label="Phase 1 sections">
                <nav>
                  <a href="#p10">1.0 - Vision</a>
                  <a href="#p11">1.1 - One‑pager / Pitch</a>
                  <a href="#p12">1.2 - Interface Sketch</a>
                  <a href="#p13">1.3 - Component Inventory</a>
                  <a href="#p14">1.4 - Interaction Matrix</a>
                  <a href="#p15">1.5 - a11y / i18n</a>
                  <a href="#p16">1.6 - Acceptance Criteria</a>
                  <a href="#p17">1.7 - Traceability</a>
                  <a href="#p18">1.8 - Prioritization</a>
                  <a href="#p19">1.9 - Security / Privacy</a>
                  <a href="#p110">1.10 - Time‑Box</a>
                  <a href="#p111">1.11 - DoR</a>
                  <a href="#p1sign">Sign‑off</a>
                  <a href="#p1check">Quick checklist</a>
                </nav>
              </aside>

              <div class="phase-content">
                <section class="phase-card" id="p10" aria-labelledby="p10-h">
                  <h4 id="p10-h" class="phase-card-title">1.0 - Vision (1‑sentence)</h4>
                  <p class="one-liner">اكتب الجملة التي تشرح المشروع لطفل 10 سنوات.</p>
                  <p class="note"><strong>Example:</strong> "تطبيق يساعدك تحفظ مصاريفك وتعرف تصرفاتك الشهرية".</p>
                </section>

                <section class="phase-card" id="p11" aria-labelledby="p11-h">
                  <h4 id="p11-h" class="phase-card-title">1.1 - One‑pager / Pitch</h4>
                  <ul class="bullets">
                    <li><strong>Problem:</strong> …</li>
                    <li><strong>Solution:</strong> …</li>
                    <li><strong>Key metrics:</strong> …</li>
                    <li><strong>MVP scope (3 top features):</strong> …</li>
                    <li><strong>Risks & Assumptions:</strong> …</li>
                    <li><strong>Stakeholders & approvers:</strong> …</li>
                  </ul>
                </section>

                <section class="phase-card" id="p12" aria-labelledby="p12-h">
                  <h4 id="p12-h" class="phase-card-title">1.2 - Interface Sketch</h4>
                  <ul class="bullets">
                    <li>إرفاق صورة <code>designs/01-home-screen.png</code> أو رابط Figma.</li>
                    <li>Designer: اضف نسخة Export (PNG / SVG) مع أسماء الطبقات المهمة.</li>
                  </ul>
                </section>

                <section class="phase-card" id="p13" aria-labelledby="p13-h">
                  <h4 id="p13-h" class="phase-card-title">1.3 - Component Inventory</h4>
                  <div class="table-wrap">
                    <table class="inventory">
                      <thead>
                        <tr><th>id</th><th>Component</th><th>Type</th><th>Purpose</th><th>State (Design/Dev)</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>C‑01</td><td>Add Button</td><td>Button</td><td>فتح Modal إضافة</td><td>Design ready</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section class="phase-card" id="p14" aria-labelledby="p14-h">
                  <h4 id="p14-h" class="phase-card-title">1.4 - Interaction Matrix</h4>
                  <div class="table-wrap">
                    <table class="matrix">
                      <thead>
                        <tr><th>Component</th><th>Action</th><th>Expected Result</th><th>Error states</th><th>Owner</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Add Button</td><td>Click</td><td>Show Add Modal</td><td>Validation error</td><td>Dev/QA</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section class="phase-card" id="p15" aria-labelledby="p15-h">
                  <h4 id="p15-h" class="phase-card-title">1.5 - Accessibility & Internationalization (a11y / i18n)</h4>
                  <ul class="checklist">
                    <li>هل تم تحديد RTL support (إذا مطلوب)؟</li>
                    <li>تحقق من contrast ratios > 4.5:1 للـ body text؟</li>
                    <li>الحقول لديها aria‑labels والوصف الصحيح؟</li>
                  </ul>
                </section>

                <section class="phase-card" id="p16" aria-labelledby="p16-h">
                  <h4 id="p16-h" class="phase-card-title">1.6 - Acceptance Criteria (DoD entry for stories)</h4>
                  <p>لكل User Story: صيغة Gherkin قصيرة + Definition of Done.</p>
                  <pre class="codeblock"><code>Feature: Add expense
  Scenario: Successful addition
    Given user opens Add modal
    When user fills valid data
    Then expense appears in list and success toast shown</code></pre>
                </section>

                <section class="phase-card" id="p17" aria-labelledby="p17-h">
                  <h4 id="p17-h" class="phase-card-title">1.7 - Traceability (linking)</h4>
                  <p>Link كل عنصر (Component, Story) إلى ملف في <code>docs/</code> وIssue في المستودع (مثال: <code>#45</code>).</p>
                </section>

                <section class="phase-card" id="p18" aria-labelledby="p18-h">
                  <h4 id="p18-h" class="phase-card-title">1.8 - Prioritization (apply RICE quickly)</h4>
                  <p>عيّن قيم R/I/C/E لكل ميزة MVP، احسب RICE، رتب.</p>
                </section>

                <section class="phase-card" id="p19" aria-labelledby="p19-h">
                  <h4 id="p19-h" class="phase-card-title">1.9 - Security / Privacy notes (for Feature)</h4>
                  <ul class="bullets">
                    <li>أي Feature تتعامل مع PII يجب أن تُدرج tags: <code>#PII</code> و<code>#sensitive</code>.</li>
                    <li>Features التي تعرض بيانات مالية تتطلب SRE + Security sign‑off قبل release.</li>
                  </ul>
                </section>

                <section class="phase-card" id="p110" aria-labelledby="p110-h">
                  <h4 id="p110-h" class="phase-card-title">1.10 - Time‑Box (اقتراح)</h4>
                  <ul class="bullets">
                    <li>Vision + Sketch: <strong>45 دقيقة</strong></li>
                    <li>Component Inventory + Interaction: <strong>30 دقيقة</strong></li>
                  </ul>
                </section>

                <section class="phase-card" id="p111" aria-labelledby="p111-h">
                  <h4 id="p111-h" class="phase-card-title">1.11 - Definition of Ready (DoR)</h4>
                  <ul class="checklist">
                    <li>Vision مكتوبة وموقعة من PO.</li>
                    <li>Sketch مُرفق أو رابط Figma.</li>
                    <li>Component inventory مملوء وروابط التصميم.</li>
                    <li>Top‑3 features مُصنّفة بالأولوية (RICE / Betting).</li>
                    <li>أي تداخل أمني/خصوصية مُعلّم وتمت مخاطبة Security.</li>
                  </ul>
                </section>

                <section class="phase-card" id="p1sign" aria-labelledby="p1sign-h">
                  <h4 id="p1sign-h" class="phase-card-title">Sign‑off template (Phase‑0 → Phase‑1)</h4>
                  <div class="table-wrap">
                    <table class="signoff">
                      <tbody>
                        <tr><td>PO:</td><td>__________________________ (date)</td></tr>
                        <tr><td>Tech Lead:</td><td>__________________ (date)</td></tr>
                        <tr><td>SRE / DevOps:</td><td>______________ (date)</td></tr>
                        <tr><td>Security Reviewer:</td><td>______ (date)</td></tr>
                        <tr><td>Designer:</td><td>__________________________ (date)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section class="phase-card" id="p1check" aria-labelledby="p1check-h">
                  <h4 id="p1check-h" class="phase-card-title">Quick checklist for the Repo (what to add now)</h4>
                  <ul class="bullets">
                    <li><code>docs/phase-0-1-enhanced.md</code> (هذا الملف).</li>
                    <li><code>docs/roles-and-raci.md</code> (مفصّل إن احتجت).</li>
                    <li><code>templates/prioritization/rice-template.md</code> (حيث تحسب RICE لكل backlog item).</li>
                    <li><code>security/snyk-dependabot.md</code> (خطوات تشغيل SCA).</li>
                  </ul>
                </section>
              </div>
            </div>
  `
  // insert before container closing in phases
  const container = phasesSection.querySelector('.container')
  container.appendChild(panel)
  return panel
}

// Update Phase 1 tab label if placeholder
const phase1Tab = tabsContainer?.querySelector('[data-phase="1"]')
if (phase1Tab) {
  phase1Tab.textContent = 'Phase 1 — Idea Autopsy'
  phase1Tab.removeAttribute('disabled')
}

// Tab switching
const getPhasePanels = () => Array.from(phasesSection.querySelectorAll('.phase-panel'))
const getPhaseChips = () => Array.from(phasesSection.querySelectorAll('.phase-chip'))
const activatePhase = (phaseKey) => {
  if (phaseKey === '1') ensurePhase1Panel()
  getPhasePanels().forEach((p) => p.classList.toggle('active', p.getAttribute('data-phase') === phaseKey))
  getPhaseChips().forEach((c) => {
    const active = c.getAttribute('data-phase') === phaseKey
    c.classList.toggle('active', active)
    c.setAttribute('aria-selected', active ? 'true' : 'false')
  })
  // refresh scrollspy links for active panel
  computeActiveNav()
}
getPhaseChips().forEach((chip) => chip.addEventListener('click', () => activatePhase(chip.getAttribute('data-phase'))))

// Scrollspy limited to active panel
let activeNavLinks = []
let activeSections = []
const computeActiveNav = () => {
  const activePanel = phasesSection.querySelector('.phase-panel.active') || phasesSection.querySelector('.phase-panel')
  activeNavLinks = Array.from(activePanel.querySelectorAll('.phase-nav a'))
  activeSections = activeNavLinks.map((a) => document.querySelector(a.getAttribute('href')))
}
const setActiveNav = () => {
  const scrollY = window.scrollY + 120
  for (let i = 0; i < activeSections.length; i++) {
    const sec = activeSections[i]
    if (!sec) continue
    const top = sec.offsetTop
    const bottom = top + sec.offsetHeight
    const isActive = scrollY >= top && scrollY < bottom
    activeNavLinks[i].classList.toggle('active', isActive)
  }
}
computeActiveNav()
window.addEventListener('scroll', setActiveNav)
