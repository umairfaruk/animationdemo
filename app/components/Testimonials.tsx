'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useIsMobile } from '../hooks/useIsMobile'

function useVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

function TestimonialCard({ t, i }: { t: { quote: string; author: string; role: string; index: string }; i: number }) {
  const { fonts, isRtl } = useLang()
  const { ref, vis } = useVisible(0.15)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s ease ${i * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
        position: 'relative', padding: '2.4rem 1.8rem', borderTop: '1px solid rgba(255,255,255,0.07)',
        cursor: 'default', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.022)', transform: hovered ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: fonts.body, fontSize: '0.58rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.18)' }}>{t.index}</span>
          <span style={{ fontFamily: fonts.display, fontSize: '3rem', lineHeight: 0.7, color: hovered ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.08)', transition: 'color 0.4s ease', userSelect: 'none' }}>
            {isRtl ? '«' : '"'}
          </span>
        </div>
        <blockquote style={{ fontFamily: fonts.display, fontWeight: 300, fontStyle: isRtl ? 'normal' : 'italic', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: '2rem' }}>
          {t.quote}
        </blockquote>
        <div style={{ width: hovered ? '2rem' : '1rem', height: '1px', background: '#facc15', marginBottom: '1.2rem', transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
        <div>
          <div style={{ fontFamily: fonts.body, fontSize: '0.82rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>{t.author}</div>
          <div style={{ fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { tr, fonts } = useLang()
  const m = useIsMobile()
  const t = tr.testimonials
  const header = useVisible(0.2)
  const logos  = useVisible(0.2)
  const brands = ['NOVAPULSE', 'ARCLINE', 'LUXE & CO', 'TERRASCALE', 'MERIDIAN', 'VANTEX']

  return (
    <section id="testimonials" style={{ background: '#000', padding: m ? '5rem 0' : '8rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: m ? '0 1.25rem' : '0 2rem' }}>

        {/* ── Header ── */}
        <div ref={header.ref} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? '2rem' : '4rem', alignItems: 'end', marginBottom: m ? '2.5rem' : '5rem', opacity: header.vis ? 1 : 0, transform: header.vis ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
              <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>{t.label}</span>
            </div>
            <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(2.8rem, 9vw, 6.5rem)', color: '#fff', lineHeight: 0.95, margin: 0 }}>
              {t.headline1}<br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.22)' }}>{t.headline2}</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-end' }}>
            <p style={{ fontFamily: fonts.body, fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.85, margin: 0 }}>
              {t.desc.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
            </p>
            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.4rem', flexWrap: 'wrap' }}>
              {t.stats.map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginTop: '0.3rem' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '4rem' }}>
          {t.items.map((item, i) => (
            <div key={i} style={{ borderRight: !m && i < t.items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <TestimonialCard t={item} i={i} />
            </div>
          ))}
        </div>

        {/* ── Logo strip ── */}
        <div ref={logos.ref} style={{ opacity: logos.vis ? 1 : 0, transform: logos.vis ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: fonts.body, fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>{t.trustedBy}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem 2.5rem' }}>
            {brands.map((brand, i) => (
              <span key={brand} style={{ fontFamily: fonts.body, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)', opacity: logos.vis ? 1 : 0, transition: `opacity 0.6s ease ${0.3 + i * 0.06}s` }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
