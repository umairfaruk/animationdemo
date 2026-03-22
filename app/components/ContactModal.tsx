'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

interface Props { open: boolean; onClose: () => void }

export default function ContactModal({ open, onClose }: Props) {
  const { tr, fonts, isRtl } = useLang()
  const m = tr.modal

  const [visible, setVisible]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [sent, setSent]         = useState(false)
  const firstInput              = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const t = setTimeout(() => setVisible(true), 10)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
      const t = setTimeout(() => { setMounted(false); setSent(false) }, 500)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [onClose])
  useEffect(() => { if (visible) setTimeout(() => firstInput.current?.focus(), 200) }, [visible])

  if (!mounted) return null

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', color: '#fff',
    fontFamily: fonts.body, fontSize: '0.85rem',
    padding: '0.8rem 1rem', outline: 'none', resize: 'none' as const,
    transition: 'border-color 0.25s ease', borderRadius: 0,
    textAlign: isRtl ? 'right' : 'left',
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        background: visible ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        transition: 'background 0.45s ease, backdrop-filter 0.45s ease',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto',
        background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
        transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 0, [isRtl ? 'right' : 'left']: 0, width: 32, height: 32, borderTop: '1px solid rgba(250,204,21,0.35)', [isRtl ? 'borderRight' : 'borderLeft']: '1px solid rgba(250,204,21,0.35)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, [isRtl ? 'left' : 'right']: 0, width: 32, height: 32, borderBottom: '1px solid rgba(250,204,21,0.35)', [isRtl ? 'borderLeft' : 'borderRight']: '1px solid rgba(250,204,21,0.35)', pointerEvents: 'none' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', [isRtl ? 'left' : 'right']: '1.5rem',
            width: '2.2rem', height: '2.2rem', border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', transition: 'border-color 0.3s, color 0.3s', zIndex: 10,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ padding: '3.5rem 3.5rem 3rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', border: '1px solid rgba(250,204,21,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4.5 4.5L15 5" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: '2.8rem', color: '#fff', marginBottom: '0.8rem' }}>
                {m.successTitle}
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
                {m.successDesc.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: '2.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ width: '1.5rem', height: '1px', background: '#facc15', display: 'block' }} />
                  <span style={{ fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#facc15' }}>
                    {m.label}
                  </span>
                </div>
                <h2 style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#fff', lineHeight: 0.95, margin: 0 }}>
                  {m.headline1}{' '}
                  <em style={{ fontStyle: isRtl ? 'normal' : 'italic', fontWeight: 400, color: '#facc15' }}>{m.headline2}</em>
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem' }}>

                <div>
                  <Label fonts={fonts}>{m.name}</Label>
                  <input ref={firstInput} type="text" placeholder={m.namePh} required style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }} />
                </div>

                <div>
                  <Label fonts={fonts}>{m.email}</Label>
                  <input type="email" placeholder={m.emailPh} required style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }} />
                </div>

                <div>
                  <Label fonts={fonts}>{m.company}</Label>
                  <input type="text" placeholder={m.companyPh} style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }} />
                </div>

                <div>
                  <Label fonts={fonts}>{m.budget}</Label>
                  <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                    <option value="">{m.budgetPh}</option>
                    {m.budgetOpts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Label fonts={fonts}>{m.service}</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {m.services.map(s => <ServicePill key={s} label={s} fonts={fonts} />)}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Label fonts={fonts}>{m.message}</Label>
                  <textarea rows={3} placeholder={m.messagePh} style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <p style={{ fontFamily: fonts.body, fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.05em' }}>
                    {m.note}
                  </p>
                  <button type="submit" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
                    fontFamily: fonts.body, fontSize: '0.72rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', fontWeight: 600,
                    background: '#facc15', color: '#000', border: 'none',
                    padding: '0.85rem 2rem', cursor: 'pointer',
                    transition: 'background 0.25s ease, transform 0.25s ease',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fde68a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#facc15'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                  >
                    {m.submit}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Label({ children, fonts }: { children: React.ReactNode; fonts: { body: string; display: string } }) {
  return (
    <div style={{ fontFamily: fonts.body, fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.55rem' }}>
      {children}
    </div>
  )
}

function ServicePill({ label, fonts }: { label: string; fonts: { body: string; display: string } }) {
  const [active, setActive] = useState(false)
  return (
    <button type="button" onClick={() => setActive(v => !v)} style={{
      fontFamily: fonts.body, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
      padding: '0.4rem 0.9rem',
      border: `1px solid ${active ? 'rgba(250,204,21,0.5)' : 'rgba(255,255,255,0.08)'}`,
      background: active ? 'rgba(250,204,21,0.08)' : 'transparent',
      color: active ? '#facc15' : 'rgba(255,255,255,0.35)',
      cursor: 'pointer', borderRadius: '999px', transition: 'all 0.25s ease',
    }}>
      {label}
    </button>
  )
}
