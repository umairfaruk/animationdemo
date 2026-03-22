'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

function ServiceRow({ s, i }: { s: { num: string; title: string; desc: string; keyword: string }; i: number }) {
  const { fonts, isRtl } = useLang()
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 0',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hover fill bar */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.025)',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: isRtl ? 'right' : 'left',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '3rem 1fr auto', alignItems: 'center', gap: '2rem' }}>

        {/* Number */}
        <span style={{
          fontFamily: fonts.body,
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          color: hovered ? 'rgba(250,204,21,0.8)' : 'rgba(255,255,255,0.2)',
          transition: 'color 0.3s ease',
        }}>
          {s.num}
        </span>

        {/* Title + desc */}
        <div>
          <h3 style={{
            fontFamily: fonts.display,
            fontWeight: 400,
            fontStyle: (!isRtl && hovered) ? 'italic' : 'normal',
            fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
            color: '#fff', lineHeight: 1,
            transition: 'font-style 0.25s ease',
            marginBottom: hovered ? '0.6rem' : '0',
          }}>
            {s.title}
          </h3>
          <p style={{
            fontFamily: fonts.body,
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
            maxWidth: '520px',
            maxHeight: hovered ? '80px' : '0px',
            overflow: 'hidden',
            opacity: hovered ? 1 : 0,
            transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
          }}>
            {s.desc}
          </p>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <span style={{
            fontFamily: fonts.body,
            fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: hovered ? 'rgba(250,204,21,0.9)' : 'rgba(255,255,255,0.18)',
            border: `1px solid ${hovered ? 'rgba(250,204,21,0.3)' : 'rgba(255,255,255,0.08)'}`,
            padding: '0.35rem 0.8rem', borderRadius: '999px',
            transition: 'color 0.3s ease, border-color 0.3s ease',
          }}>
            {s.keyword}
          </span>

          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: `1px solid ${hovered ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5"
                stroke={hovered ? 'rgba(250,204,21,0.9)' : 'rgba(255,255,255,0.4)'}
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const { tr, fonts } = useLang()
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVis, setHeaderVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeaderVis(true) }, { threshold: 0.3 })
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  const s = tr.services

  return (
    <section id="services" style={{ background: '#000', padding: '8rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Header ── */}
        <div
          ref={headerRef}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end',
            marginBottom: '5rem',
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
              <span style={{ fontFamily: fonts.body, fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>
                {s.label}
              </span>
            </div>
            <h2 style={{
              fontFamily: fonts.display, fontWeight: 300,
              fontSize: 'clamp(3rem, 6vw, 6.5rem)', color: '#fff', lineHeight: 0.95, margin: 0,
            }}>
              {s.headline1}<br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.28)' }}>
                {s.headline2}
              </em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'flex-end' }}>
            <p style={{ fontFamily: fonts.body, fontSize: '0.9rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, margin: 0 }}>
              {s.desc}
            </p>
            <div style={{ display: 'flex', gap: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
              {s.stats.map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Service rows ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {s.items.map((item, i) => (
            <ServiceRow key={i} s={item} i={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
