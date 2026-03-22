'use client'

import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { tr, fonts, isRtl } = useLang()
  const f = tr.footer

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer style={{ position: 'relative', background: '#000', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

      {/* ── Video background ── */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(8px)',
          transform: 'scale(1.05)',
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      >
        <source src="/footerbg.mp4" type="video/mp4" />
      </video>

      {/* ── Dark overlay on top of blurred video ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'rgba(0,0,0,0.62)',
      }} />

      {/* ── Top area: pill buttons ── */}
      <div style={{
        position: 'relative',
        padding: '8rem 3rem 0',
        display: 'flex',
        gap: '4rem',
        flexWrap: 'wrap',
      }}>
        {/* CALL US */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            padding: '0.45rem 1.2rem',
            marginBottom: '0.7rem',
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>
              {f.callUs}
            </span>
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em', paddingLeft: isRtl ? 0 : '0.2rem', paddingRight: isRtl ? '0.2rem' : 0 }}>
            {f.phone}
          </div>
        </div>

        {/* MEET US */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            padding: '0.45rem 1.2rem',
            marginBottom: '0.7rem',
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>
              {f.meetUs}
            </span>
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em', paddingLeft: isRtl ? 0 : '0.2rem', paddingRight: isRtl ? '0.2rem' : 0 }}>
            {f.address}
          </div>
        </div>
      </div>

      {/* ── Large editorial headline ── */}
      <div style={{ position: 'relative', padding: '0 2.5rem 0' }}>
        <h2 style={{
          fontFamily: fonts.display,
          fontWeight: 300,
          fontSize: 'clamp(1.8rem, 3.8vw, 4.5rem)',
          color: '#fff',
          lineHeight: 1.08,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          {f.headline1}
          <br />
          {f.headline2}{' '}
          <em style={{
            fontStyle: isRtl ? 'normal' : 'italic',
            fontWeight: 400,
            color: 'rgba(250,204,21,0.85)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(250,204,21,0.4)',
            textUnderlineOffset: '6px',
          }}>
            {f.email}
          </em>
        </h2>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '1.4rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Copyright */}
        <span style={{ fontFamily: fonts.body, fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
          {f.rights}
        </span>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {f.socials.map((s, i) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="#" style={{ fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
              >
                {s}
              </a>
              {i < f.socials.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem' }}>|</span>}
            </span>
          ))}
        </div>

        {/* To Top */}
        <button
          onClick={scrollToTop}
          style={{
            fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
        >
          {f.toTop}
        </button>

        {/* Legal */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {f.legal.map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="#" style={{ fontFamily: fonts.body, fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)' }}
              >
                {item}
              </a>
              {i < f.legal.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem' }}>|</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
