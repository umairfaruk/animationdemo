'use client'

import { useEffect, useRef, useState } from 'react'
import { useLoading } from '../context/LoadingContext'

const LETTERS_BAZ     = ['B', 'A', 'Z']
const LETTERS_HOLDING = ['H', 'O', 'L', 'D', 'I', 'N', 'G']

// Minimum time the intro stays visible (ms)
const MIN_DISPLAY = 2600

export default function IntroAnimation({ fontClass }: { fontClass: string }) {
  const { progress } = useLoading()
  const [phase, setPhase]     = useState<'intro' | 'exit' | 'done'>('intro')
  const startTime             = useRef(Date.now())
  const exitScheduled         = useRef(false)

  // Trigger exit when BOTH conditions are met:
  // 1. progress has reached 100
  // 2. at least MIN_DISPLAY ms have elapsed
  useEffect(() => {
    if (progress < 100 || exitScheduled.current) return
    exitScheduled.current = true

    const elapsed   = Date.now() - startTime.current
    const remaining = Math.max(0, MIN_DISPLAY - elapsed)

    const exitTimer = setTimeout(() => setPhase('exit'), remaining)
    const doneTimer = setTimeout(() => setPhase('done'),  remaining + 900)

    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer) }
  }, [progress])

  if (phase === 'done') return null

  return (
    <div
      className={`intro-overlay ${phase === 'exit' ? 'intro-exit' : ''}`}
      aria-hidden="true"
    >
      {/* Scanline texture */}
      <div className="intro-scanlines" />

      {/* Center content */}
      <div className="intro-content">

        {/* BAZ */}
        <div className={`intro-baz-row ${fontClass}`}>
          {LETTERS_BAZ.map((l, i) => (
            <span key={l} className="intro-letter-wrap" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
              <span className="intro-letter-inner">{l}</span>
            </span>
          ))}
        </div>

        {/* Yellow divider */}
        <div className="intro-line-wrap">
          <div className="intro-line" />
        </div>

        {/* HOLDING */}
        <div className={`intro-holding-row ${fontClass}`}>
          {LETTERS_HOLDING.map((l, i) => (
            <span key={i} className="intro-holding-letter" style={{ animationDelay: `${0.55 + i * 0.06}s` }}>
              {l}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className="intro-tagline">Global Marketing Agency</p>

        {/* ── Loading bar ── */}
        <div style={{
          marginTop: '2.8rem',
          width: 'min(52vw, 600px)',
          opacity: 0,
          animation: 'taglineFade 0.6s 1.4s ease forwards',
        }}>
          {/* Track */}
          <div style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Fill */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #facc15, #fde68a)',
              transformOrigin: 'left',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>

          {/* Percentage */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.55rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
            }}>
              Loading
            </span>
            <span style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              color: progress === 100 ? 'rgba(250,204,21,0.8)' : 'rgba(255,255,255,0.35)',
              transition: 'color 0.4s ease',
            }}>
              {progress}%
            </span>
          </div>
        </div>

      </div>

      {/* Corner accents */}
      <div className="intro-corner intro-corner-tl" />
      <div className="intro-corner intro-corner-br" />
    </div>
  )
}
