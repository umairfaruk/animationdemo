'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const images = [
  '/uniqe/uniqe01.webp',
  '/uniqe/uniqe02.webp',
  '/uniqe/uniqe03.webp',
  '/uniqe/uniqe04.webp',
  '/uniqe/uniqe05.webp',
]

const SCRUB = 1.6

export default function Showcase() {
  const { tr, fonts, isRtl } = useLang()
  const s = tr.showcase
  const slides = s.slides.map((sl, i) => ({ ...sl, image: images[i] }))

  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const slideRefs  = useRef<(HTMLDivElement | null)[]>([])
  const ghostRefs  = useRef<(HTMLDivElement | null)[]>([])
  const infoRefs   = useRef<(HTMLDivElement | null)[]>([])
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const vh = window.innerHeight

      gsap.fromTo(ghostRefs.current[0],
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
      )
      gsap.fromTo(infoRefs.current[0],
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.85 }
      )

      slides.forEach((_, i) => {
        if (i === 0) return
        const imgStart  = `top+=${(i - 1)    * vh} top`
        const imgEnd    = `top+=${i          * vh} top`
        const txtStart  = `top+=${(i - 0.72) * vh} top`
        const infoStart = `top+=${(i - 0.5)  * vh} top`

        ScrollTrigger.create({
          trigger: wrapper, start: imgStart, end: imgEnd,
          onEnter:     () => setActiveSlide(i),
          onLeaveBack: () => setActiveSlide(i - 1),
        })

        gsap.fromTo(slideRefs.current[i],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
            scrollTrigger: { trigger: wrapper, start: imgStart, end: imgEnd, scrub: SCRUB } }
        )
        gsap.fromTo(ghostRefs.current[i],
          { x: 200, opacity: 0 },
          { x: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: wrapper, start: txtStart, end: imgEnd, scrub: SCRUB } }
        )
        gsap.fromTo(infoRefs.current[i],
          { x: 90, opacity: 0 },
          { x: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: wrapper, start: infoStart, end: imgEnd, scrub: SCRUB } }
        )
      })
    }, wrapperRef)

    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="work" className="bg-black">

      {/* ── Section header ── */}
      <div className="px-8 pt-28 pb-16 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-yellow-400" />
            <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>
              {s.label}
            </span>
          </div>
          <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(3rem, 6.5vw, 7rem)', color: '#fff', lineHeight: 1 }}>
            {s.headline1}{' '}
            <em style={{ fontStyle: isRtl ? 'normal' : 'italic', fontWeight: 400 }}>{s.headline2}</em>
          </h2>
        </div>
        <span className="hidden md:block pb-2" style={{ fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
          {slides.length} {s.projects}
        </span>
      </div>

      {/* ── Tall scroll wrapper ── */}
      <div ref={wrapperRef} style={{ height: `${slides.length * 100}vh`, position: 'relative' }}>

        {/* ── Sticky viewport ── */}
        <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#000' }}>

          {slides.map((slide, i) => (
            <div
              key={i}
              ref={el => { slideRefs.current[i] = el }}
              style={{
                position: 'absolute', inset: 0, zIndex: i + 1,
                clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                overflow: 'hidden',
              }}
            >
              <Image src={slide.image} alt={`${slide.line1} ${slide.line2}`} fill className="object-cover" sizes="100vw" priority={i === 0} />

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.38) 100%)' }} />

              {/* Ghost text */}
              <div
                ref={el => { ghostRefs.current[i] = el }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none', userSelect: 'none', opacity: 0, transform: 'translateX(200px)',
                }}
              >
                <span style={{ display: 'block', fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(5rem, 15vw, 17rem)', lineHeight: 0.86, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.13)', whiteSpace: 'nowrap' }}>
                  {slide.line1}
                </span>
                <span style={{ display: 'block', fontFamily: fonts.display, fontWeight: 300, fontStyle: isRtl ? 'normal' : 'italic', fontSize: 'clamp(5rem, 15vw, 17rem)', lineHeight: 0.86, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.13)', whiteSpace: 'nowrap' }}>
                  {slide.line2}
                </span>
              </div>

              {/* Info panel */}
              <div
                ref={el => { infoRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  bottom: '2.8rem',
                  [isRtl ? 'right' : 'left']: '2.8rem',
                  display: 'flex', flexDirection: 'column', gap: '0.45rem',
                  opacity: 0, transform: 'translateX(90px)',
                }}
              >
                <p style={{ fontFamily: fonts.display, fontWeight: 300, fontStyle: isRtl ? 'normal' : 'italic', fontSize: 'clamp(1.7rem, 3vw, 2.8rem)', color: 'rgba(255,255,255,0.92)', lineHeight: 1, margin: 0 }}>
                  {slide.line1} {slide.line2}
                </p>
                <span style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
                  {slide.tag}
                </span>
              </div>
            </div>
          ))}

          {/* ── Slide counter ── */}
          <div style={{ position: 'absolute', top: '2.5rem', [isRtl ? 'right' : 'left']: '2.8rem', zIndex: slides.length + 20, pointerEvents: 'none' }}>
            <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)' }}>
              {String(activeSlide + 1).padStart(2, '0')}
              <span style={{ color: 'rgba(255,255,255,0.14)', marginLeft: '0.4rem' }}>
                / {String(slides.length).padStart(2, '0')}
              </span>
            </span>
          </div>

          {/* ── Progress pips ── */}
          <div style={{
            position: 'absolute', [isRtl ? 'left' : 'right']: '2.5rem', top: '50%', transform: 'translateY(-50%)',
            zIndex: slides.length + 20,
            display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center',
          }}>
            {slides.map((_, j) => (
              <div key={j} style={{
                width: '1px',
                height: j === activeSlide ? '36px' : '8px',
                background: j === activeSlide ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
                borderRadius: '1px',
                transition: 'height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
              }} />
            ))}
          </div>

          {/* ── Border frame ── */}
          <div style={{ position: 'absolute', inset: 0, border: '14px solid #000', zIndex: slides.length + 25, boxSizing: 'border-box', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  )
}
