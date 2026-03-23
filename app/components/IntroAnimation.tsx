'use client'

import { useEffect, useRef, useState } from 'react'

const LETTERS_BAZ     = ['B', 'A', 'Z']
const LETTERS_HOLDING = ['H', 'O', 'L', 'D', 'I', 'N', 'G']

const HOLD_MS = 3200   // total intro duration

// Resets on every page reload; persists across client-side navigation
let introPlayed = false

export default function IntroAnimation({ fontClass }: { fontClass: string }) {
  const [phase, setPhase] = useState<'intro' | 'exit' | 'done'>('intro')
  const [pct, setPct]     = useState(0)
  const scheduled         = useRef(false)

  // Count 0 → 100 over HOLD_MS − 400 ms so it hits 100 just before exit
  useEffect(() => {
    if (introPlayed) return
    const duration = HOLD_MS - 500
    const start    = Date.now()
    let raf: number
    const tick = () => {
      const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100))
      setPct(p)
      if (p < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    // Skip on client-side navigation
    if (introPlayed) {
      document.body.style.overflow = ''
      setPhase('done')
      return
    }

    document.body.style.overflow = 'hidden'
    if (scheduled.current) return
    scheduled.current = true

    const exitTimer = setTimeout(() => setPhase('exit'), HOLD_MS)
    const doneTimer = setTimeout(() => {
      introPlayed = true
      document.body.style.overflow = ''
      setPhase('done')
    }, HOLD_MS + 1000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`intro-overlay ${phase === 'exit' ? 'intro-exit' : ''}`} aria-hidden="true">

      {/* Animated grain */}
      <div className="intro-grain" />

      {/* Gold sweep line */}
      <div className="intro-sweep" />

      {/* Main content */}
      <div className="intro-content">

        {/* Stamp */}
        <div className="intro-stamp">
          <div className="intro-stamp-line" />
          <span className="intro-stamp-text">Est. 2019 · Dubai, UAE</span>
          <div className="intro-stamp-line" />
        </div>

        {/* BAZ */}
        <div className={`intro-baz-row ${fontClass}`}>
          {LETTERS_BAZ.map((l, i) => (
            <span key={l} className="intro-letter-wrap" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
              <span className="intro-letter-inner">{l}</span>
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="intro-line-wrap">
          <div className="intro-line" />
        </div>

        {/* HOLDING */}
        <div className={`intro-holding-row ${fontClass}`}>
          {LETTERS_HOLDING.map((l, i) => (
            <span key={i} className="intro-holding-letter" style={{ animationDelay: `${0.6 + i * 0.055}s` }}>
              {l}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className="intro-tagline">Global Marketing Agency</p>

      </div>

      {/* Loading section — bottom */}
      <div className="intro-loader">

        {/* Counter row */}
        <div className="intro-loader-row">
          {/* Large editorial percentage */}
          <div className="intro-loader-counter">
            {String(pct).padStart(3, '0')}<sup>%</sup>
          </div>

          {/* Right side: label + animated dots */}
          <div className="intro-loader-right">
            <span className="intro-loader-label">Initialising experience</span>
            <div className="intro-loader-dots">
              <div className="intro-loader-dot" />
              <div className="intro-loader-dot" />
              <div className="intro-loader-dot" />
            </div>
          </div>
        </div>

        {/* Multi-layer bars */}
        <div className="intro-loader-bars">
          <div className="intro-loader-track"><div className="intro-loader-fill" /></div>
          <div className="intro-loader-track"><div className="intro-loader-fill" /></div>
          <div className="intro-loader-track"><div className="intro-loader-fill" /></div>
        </div>

      </div>

      {/* All 4 corners */}
      <div className="intro-corner intro-corner-tl" />
      <div className="intro-corner intro-corner-tr" />
      <div className="intro-corner intro-corner-bl" />
      <div className="intro-corner intro-corner-br" />
    </div>
  )
}
