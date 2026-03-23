'use client'

import { useEffect, useRef, useState } from 'react'
import { useLoading } from '../context/LoadingContext'

const LETTERS_BAZ     = ['B', 'A', 'Z']
const LETTERS_HOLDING = ['H', 'O', 'L', 'D', 'I', 'N', 'G']

const MIN_DISPLAY = 3000  // always show at least 3 s even if assets load instantly

// Resets on every page reload; persists across client-side navigation
let introPlayed = false

export default function IntroAnimation({ fontClass }: { fontClass: string }) {
  const { progress }  = useLoading()           // 0–100 from real asset loading
  const [phase, setPhase]   = useState<'intro' | 'exit' | 'done'>('intro')
  const startTime           = useRef(Date.now())
  const exitScheduled       = useRef(false)

  function markDone() {
    introPlayed = true
    document.body.style.overflow = ''
    setPhase('done')
  }

  // Lock scroll + skip if already played this session
  useEffect(() => {
    if (introPlayed) {
      document.body.style.overflow = ''
      setPhase('done')
      return
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Exit when BOTH: assets loaded (progress === 100) AND min display elapsed
  useEffect(() => {
    if (progress < 100 || exitScheduled.current) return
    exitScheduled.current = true

    const elapsed   = Date.now() - startTime.current
    const remaining = Math.max(0, MIN_DISPLAY - elapsed)

    const exitTimer = setTimeout(() => setPhase('exit'), remaining)
    const doneTimer = setTimeout(markDone, remaining + 1000)

    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  if (phase === 'done') return null

  return (
    <div className={`intro-overlay ${phase === 'exit' ? 'intro-exit' : ''}`} aria-hidden="true">

      <div className="intro-grain" />
      <div className="intro-sweep" />

      <div className="intro-content">
        <div className="intro-stamp">
          <div className="intro-stamp-line" />
          <span className="intro-stamp-text">Est. 2019 · Dubai, UAE</span>
          <div className="intro-stamp-line" />
        </div>

        <div className={`intro-baz-row ${fontClass}`}>
          {LETTERS_BAZ.map((l, i) => (
            <span key={l} className="intro-letter-wrap" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
              <span className="intro-letter-inner">{l}</span>
            </span>
          ))}
        </div>

        <div className="intro-line-wrap"><div className="intro-line" /></div>

        <div className={`intro-holding-row ${fontClass}`}>
          {LETTERS_HOLDING.map((l, i) => (
            <span key={i} className="intro-holding-letter" style={{ animationDelay: `${0.6 + i * 0.055}s` }}>
              {l}
            </span>
          ))}
        </div>

        <p className="intro-tagline">Global Marketing Agency</p>
      </div>

      {/* Loading — counter tied to real asset progress */}
      <div className="intro-loader">
        <div className="intro-loader-row">
          <div className="intro-loader-counter">
            {String(progress).padStart(3, '0')}<sup>%</sup>
          </div>
          <div className="intro-loader-right">
            <span className="intro-loader-label">Loading assets</span>
            <div className="intro-loader-dots">
              <div className="intro-loader-dot" />
              <div className="intro-loader-dot" />
              <div className="intro-loader-dot" />
            </div>
          </div>
        </div>

        <div className="intro-loader-bars">
          <div className="intro-loader-track">
            <div className="intro-loader-fill" style={{
              animation: 'none',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <div className="intro-loader-track">
            <div className="intro-loader-fill" style={{
              animation: 'none',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s',
            }} />
          </div>
          <div className="intro-loader-track">
            <div className="intro-loader-fill" style={{
              animation: 'none',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }} />
          </div>
        </div>
      </div>

      <div className="intro-corner intro-corner-tl" />
      <div className="intro-corner intro-corner-tr" />
      <div className="intro-corner intro-corner-bl" />
      <div className="intro-corner intro-corner-br" />
    </div>
  )
}
