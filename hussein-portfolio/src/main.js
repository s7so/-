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

if (!prefersReduced) {
  const solTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#solution',
      start: 'top center',
      end: '+=60%',
      scrub: true
    }
  })
  solTl.to(mapIcon, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
      .to(methodTagline, { opacity: 1, duration: 0.6 }, '-=0.2')
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
