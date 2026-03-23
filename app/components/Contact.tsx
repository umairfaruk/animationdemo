'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props { onOpen: () => void }

export default function Contact({ onOpen }: Props) {
  const { tr, fonts, isRtl } = useLang()
  const m = useIsMobile()
  const c = tr.contact
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="contact" style={{ position: 'relative', background: '#000', padding: m ? '6rem 1.25rem' : '10rem 2rem', overflow: 'hidden' }}>

      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28, pointerEvents: 'none' }}>
        <source src="/Contactbg.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

        {/* Ghost lettering — hidden on mobile to avoid overflow */}
        {!m && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', overflow: 'hidden' }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(8rem, 22vw, 22rem)', lineHeight: 1, color: 'rgba(255,255,255,0.045)', whiteSpace: 'nowrap', letterSpacing: '-0.04em' }}>
              {c.ghost}
            </span>
          </div>
        )}

        <div ref={ref} style={{ position: 'relative', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
            <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>{c.label}</span>
            <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
          </div>

          <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: m ? 'clamp(3rem, 13vw, 6rem)' : 'clamp(4rem, 10vw, 11rem)', color: '#fff', lineHeight: 0.92, margin: '0 0 2rem', letterSpacing: '-0.02em', padding: m ? '0 0 2rem 0' : '0 0 6rem 0' }}>
            {c.headline1}
          </h2>

          <p style={{ fontFamily: fonts.body, fontSize: '0.88rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.85, maxWidth: '420px', margin: '0 auto 3rem' }}>
            {c.desc}
          </p>

          <button
            onClick={onOpen}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', fontFamily: fonts.body, fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, background: '#facc15', color: '#000', border: 'none', padding: '1.1rem 2.8rem', cursor: 'pointer', transition: 'background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fde68a'; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 20px 60px rgba(250,204,21,0.18)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#facc15'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
          >
            {c.cta}
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: m ? '1.5rem' : '3rem', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
            {c.info.map(([val, lbl]) => (
              <div key={lbl as string} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: fonts.body, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>{val}</div>
                <div style={{ fontFamily: fonts.body, fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
