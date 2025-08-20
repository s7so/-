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
