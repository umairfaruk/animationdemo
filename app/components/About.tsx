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

export default function About() {
  const { tr, fonts, isRtl } = useLang()
  const m = useIsMobile()
  const a = tr.about

  const headline = useVisible(0.2)
  const body     = useVisible(0.2)
  const statsEl  = useVisible(0.15)
  const valuesEl = useVisible(0.15)

  return (
    <section id="about" style={{ background: '#000', overflow: 'hidden' }}>

      {/* ── Marquee strip ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '0.9rem 0', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ display: 'flex', gap: '3rem', animation: `${isRtl ? 'marqueeRtl' : 'marquee'} 22s linear infinite`, whiteSpace: 'nowrap', width: 'max-content' }}>
          {Array.from({ length: 6 }).flatMap(() =>
            a.marquee.map(t => (
              <span key={Math.random()} style={{ fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                {t} <span style={{ color: 'rgba(250,204,21,0.5)', margin: '0 1rem' }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: m ? '4rem 1.25rem' : '7rem 2rem' }}>

        {/* ── Headline block ── */}
        <div
          ref={headline.ref}
          style={{
            marginBottom: m ? '3rem' : '6rem',
            opacity: headline.vis ? 1 : 0,
            transform: headline.vis ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
            <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>
              {a.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? '1rem' : '2rem', alignItems: 'end' }}>
            <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(3rem, 10vw, 8rem)', color: '#fff', lineHeight: 0.92, margin: 0 }}>
              {a.headline1}<br />
              <em style={{ fontStyle: isRtl ? 'normal' : 'italic', fontWeight: 400 }}>{a.headline1b}</em>
            </h2>
            {!m && (
              <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(3rem, 7vw, 8rem)', color: 'rgba(255,255,255,0.18)', lineHeight: 0.92, margin: 0, textAlign: isRtl ? 'left' : 'right' }}>
                {a.headline2}<br />
                <em style={{ fontStyle: isRtl ? 'normal' : 'italic', fontWeight: 400 }}>{a.headline2b}</em>
              </h2>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div
          ref={statsEl.ref}
          style={{
            display: 'grid',
            gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: m ? '3rem' : '6rem',
            opacity: statsEl.vis ? 1 : 0,
            transition: 'opacity 0.8s ease 0.1s',
          }}
        >
          {a.stats.map(({ num, label, sub }, i) => (
            <div
              key={label}
              style={{
                padding: m ? '1.8rem 1rem' : '2.5rem 2rem',
                borderRight: m
                  ? (i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none')
                  : (i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'),
                borderBottom: m && i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transform: statsEl.vis ? 'translateY(0)' : 'translateY(20px)',
                transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: m ? '2rem' : 'clamp(2.5rem, 4vw, 4.5rem)', color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>{num}</div>
              <div style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '0.2rem' }}>{label}</div>
              <div style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Body + values ── */}
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? '2.5rem' : '6rem', alignItems: 'start' }}>
          <div
            ref={body.ref}
            style={{
              opacity: body.vis ? 1 : 0,
              transform: body.vis ? 'translateX(0)' : `translateX(${isRtl ? '24px' : '-24px'})`,
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <p style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {a.body1}<em style={{ fontStyle: isRtl ? 'normal' : 'italic', color: '#fff' }}>{a.body1em}</em>{a.body1b}
            </p>
            <p style={{ fontFamily: fonts.body, fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.9, marginBottom: '2.5rem' }}>{a.body2}</p>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontFamily: fonts.body, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.3rem' }}>
              {a.cta}
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          <div
            ref={valuesEl.ref}
            style={{
              display: 'flex', flexDirection: 'column', gap: 0,
              opacity: valuesEl.vis ? 1 : 0,
              transform: valuesEl.vis ? 'translateX(0)' : `translateX(${isRtl ? '-24px' : '24px'})`,
              transition: 'opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          >
            {a.values.map(({ title, desc, icon }, i) => (
              <div key={title} style={{ padding: '1.5rem 0', borderBottom: i < a.values.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', display: 'grid', gridTemplateColumns: '2.5rem 1fr', gap: '1rem', alignItems: 'start', opacity: valuesEl.vis ? 1 : 0, transform: valuesEl.vis ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.6s ease ${0.4 + i * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.1}s` }}>
                <span style={{ color: 'rgba(250,204,21,0.6)', fontSize: '1.1rem', marginTop: '0.15rem' }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>{title}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee    { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRtl { from { transform: translateX(0); } to { transform: translateX(50%);  } }
      `}</style>
    </section>
  )
}
