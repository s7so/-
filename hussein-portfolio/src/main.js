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

// 2) Problem: CHAOS letters converge to phrase
const chaosGrid = document.getElementById('chaosGrid')
const chaosLetters = 'CHAOS'.split('')
const totalCells = 18
for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement('div')
  cell.className = 'chaos-cell'
  cell.textContent = chaosLetters[i % chaosLetters.length]
  chaosGrid.appendChild(cell)
}

const cells = gsap.utils.toArray('.chaos-cell')

if (!prefersReduced) {
  const scatterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#problem',
      start: 'top center',
      end: '+=80%',
      scrub: true
    }
  })

  scatterTl.fromTo(
    cells,
    { xPercent: () => gsap.utils.random(-120, 120), yPercent: () => gsap.utils.random(-120, 120), rotate: () => gsap.utils.random(-50, 50), opacity: 0.2 },
    { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' }
  )
}

const problemPhrase = document.querySelector('.problem-phrase')
if (!prefersReduced) {
  gsap.to(problemPhrase, {
    scrollTrigger: {
      trigger: '#problem',
      start: 'top 20%',
      end: 'bottom center',
      scrub: true
    },
    opacity: 1
  })
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
  gsap.utils.toArray('.work-card').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    })
  })
}

// 6) CTA: stagger in socials
if (!prefersReduced) {
  gsap.from('.social', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%' },
    scale: 0.8,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4,
    ease: 'power2.out'
  })
}
