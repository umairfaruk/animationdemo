'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'
import { useIsMobile } from '../hooks/useIsMobile'

const PROJECT_IMAGES = [
  '/project/project01.webp',
  '/project/project02.webp',
  '/project/project03.webp',
  '/project/project04.webp',
  '/project/project05.webp',
]

// ── Cursor-following image panel ─────────────────────────────────────────────
function CursorPanel({
  activeIndex,
  activeLabel,
}: {
  activeIndex: number | null
  activeLabel: string
}) {
  const panelRef    = useRef<HTMLDivElement>(null)
  const mouseRef    = useRef({ x: 0, y: 0 })
  const currentRef  = useRef({ x: 0, y: 0 })
  const velRef      = useRef({ x: 0, y: 0 })
  const prevRef     = useRef({ x: 0, y: 0 })
  const rafRef      = useRef<number | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const LERP = 0.09
    const tick = () => {
      const target = mouseRef.current
      const cur    = currentRef.current

      velRef.current.x = target.x - prevRef.current.x
      velRef.current.y = target.y - prevRef.current.y
      prevRef.current  = { ...target }

      cur.x += (target.x - cur.x) * LERP
      cur.y += (target.y - cur.y) * LERP

      // Subtle tilt from velocity
      const tiltX =  Math.max(-8, Math.min(8,  velRef.current.y * 0.35))
      const tiltY =  Math.max(-8, Math.min(8, -velRef.current.x * 0.35))

      if (panelRef.current) {
        panelRef.current.style.transform =
          `translate(${cur.x + 28}px, ${cur.y - 260}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const visible = activeIndex !== null
  const idx     = activeIndex ?? 0

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '260px',
        height: '340px',
        pointerEvents: 'none',
        zIndex: 999,
        transformStyle: 'preserve-3d',
        perspective: '800px',
        willChange: 'transform',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Card body */}
      <div style={{
        position: 'relative',
        width: '100%', height: '100%',
        borderRadius: '3px',
        overflow: 'hidden',
        transform: visible ? 'scale(1)' : 'scale(0.82)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>

        {/* Images — all pre-rendered, crossfade on index change */}
        {PROJECT_IMAGES.map((src, i) => (
          <div key={src} style={{ position: 'absolute', inset: 0, opacity: idx === i ? 1 : 0, transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            <Image src={src} alt="" fill sizes="260px" style={{ objectFit: 'cover' }} />
          </div>
        ))}

        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)' }} />

        {/* Grain texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")', backgroundSize: '180px', opacity: 0.5, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

        {/* Top row: index counter */}
        <div style={{ position: 'absolute', top: '1.1rem', left: '1.1rem', right: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            PROJECT
          </span>
          <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)' }}>
            {String(idx + 1).padStart(2, '0')} / {String(PROJECT_IMAGES.length).padStart(2, '0')}
          </span>
        </div>

        {/* Bottom content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem' }}>
          {/* Ghost large number */}
          <div style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: '5rem', lineHeight: 1, color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.04em', userSelect: 'none', marginBottom: '-0.6rem' }}>
            {String(idx + 1).padStart(2, '0')}
          </div>

          {/* Service label */}
          <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,204,21,0.75)', marginBottom: '0.45rem' }}>
            {activeLabel}
          </div>

          {/* Gold divider line */}
          <div style={{ width: '2rem', height: '1px', background: 'linear-gradient(90deg, #facc15, rgba(250,204,21,0))' }} />
        </div>

        {/* Corner accents */}
        <div style={{ position: 'absolute', top: '0.7rem', left: '0.7rem', width: '14px', height: '14px', borderTop: '1px solid rgba(250,204,21,0.5)', borderLeft: '1px solid rgba(250,204,21,0.5)' }} />
        <div style={{ position: 'absolute', bottom: '0.7rem', right: '0.7rem', width: '14px', height: '14px', borderBottom: '1px solid rgba(250,204,21,0.5)', borderRight: '1px solid rgba(250,204,21,0.5)' }} />
      </div>
    </div>
  )
}

// ── Individual service row ────────────────────────────────────────────────────
function ServiceRow({
  s, i, onEnter, onLeave,
}: {
  s: { num: string; title: string; desc: string; keyword: string }
  i: number
  onEnter: (i: number, label: string) => void
  onLeave: () => void
}) {
  const { fonts, isRtl } = useLang()
  const m = useIsMobile()
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => { setHovered(true);  onEnter(i % PROJECT_IMAGES.length, s.keyword) }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: m ? '1.4rem 0' : '2rem 0',
        cursor: 'none', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.022)', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: isRtl ? 'right' : 'left', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr auto' : '3rem 1fr auto', alignItems: 'center', gap: m ? '1rem' : '2rem' }}>
        {!m && (
          <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.15em', color: hovered ? 'rgba(250,204,21,0.8)' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s ease' }}>
            {s.num}
          </span>
        )}

        <div>
          <h3 style={{ fontFamily: fonts.display, fontWeight: 400, fontStyle: (!isRtl && hovered) ? 'italic' : 'normal', fontSize: m ? 'clamp(1.3rem, 5vw, 1.8rem)' : 'clamp(1.6rem, 2.8vw, 2.4rem)', color: '#fff', lineHeight: 1, transition: 'font-style 0.3s ease, letter-spacing 0.4s ease', marginBottom: hovered ? '0.5rem' : '0', letterSpacing: hovered ? '0.04em' : '0' }}>
            {s.title}
          </h3>
          <p style={{ fontFamily: fonts.body, fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '520px', maxHeight: hovered ? '80px' : '0px', overflow: 'hidden', opacity: hovered ? 1 : 0, transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease' }}>
            {s.desc}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: m ? '0.75rem' : '1.5rem', flexShrink: 0 }}>
          {!m && (
            <span style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: hovered ? 'rgba(250,204,21,0.9)' : 'rgba(255,255,255,0.18)', border: `1px solid ${hovered ? 'rgba(250,204,21,0.3)' : 'rgba(255,255,255,0.08)'}`, padding: '0.35rem 0.8rem', borderRadius: '999px', transition: 'color 0.3s ease, border-color 0.3s ease' }}>
              {s.keyword}
            </span>
          )}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${hovered ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: hovered ? 'rotate(-45deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke={hovered ? 'rgba(250,204,21,0.9)' : 'rgba(255,255,255,0.4)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Services() {
  const { tr, fonts } = useLang()
  const m = useIsMobile()
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVis, setHeaderVis]   = useState(false)
  const [activeImg, setActiveImg]   = useState<number | null>(null)
  const [activeLabel, setActiveLabel] = useState('')

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeaderVis(true) }, { threshold: 0.2 })
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  const s = tr.services

  return (
    <section id="services" style={{ background: '#000', padding: m ? '5rem 0' : '8rem 0' }}>

      {!m && <CursorPanel activeIndex={activeImg} activeLabel={activeLabel} />}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: m ? '0 1.25rem' : '0 2rem' }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? '2rem' : '4rem', alignItems: 'end', marginBottom: m ? '2.5rem' : '5rem', opacity: headerVis ? 1 : 0, transform: headerVis ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
              <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>{s.label}</span>
            </div>
            <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(2.8rem, 9vw, 6.5rem)', color: '#fff', lineHeight: 0.95, margin: 0 }}>
              {s.headline1}<br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.28)' }}>{s.headline2}</em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'flex-end' }}>
            <p style={{ fontFamily: fonts.body, fontSize: '0.9rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', flexWrap: 'wrap' }}>
              {s.stats.map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Rows ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {s.items.map((item, i) => (
            <ServiceRow
              key={i} s={item} i={i}
              onEnter={(idx, label) => { setActiveImg(idx); setActiveLabel(label) }}
              onLeave={() => { setActiveImg(null); setActiveLabel('') }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
