'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang }    from '../context/LanguageContext'
import { useLoading } from '../context/LoadingContext'

// Per-frame lerp at 60 Hz reference — converted to delta-time in the loop
// so smoothness is identical at 60/120/144 Hz displays
const LERP_60 = 0.14

export default function Hero() {
  const { tr, fonts, isRtl } = useLang()
  const { setProgress }      = useLoading()

  const containerRef       = useRef<HTMLDivElement>(null)
  const videoRef           = useRef<HTMLVideoElement>(null)
  const canvasRef          = useRef<HTMLCanvasElement>(null)
  const ctxRef             = useRef<CanvasRenderingContext2D | null>(null)

  const targetProgressRef  = useRef(0)
  const currentProgressRef = useRef(0)
  const rafRef             = useRef<number | null>(null)
  const lastTickRef        = useRef(0)
  const coverRef           = useRef<{ sx: number; sy: number; sw: number; sh: number; cw: number; ch: number } | null>(null)

  const [uiReady,      setUiReady]      = useState(false)
  const scrubReadyRef  = useRef(false)   // true when fully buffered — used in rAF
  const lastProgressRef = useRef(0)      // prevents onProgress from lowering progress

  // ── Canvas setup — half physical resolution for faster GPU blits ──────────
  useEffect(() => {
    const canvas = canvasRef.current!
    ctxRef.current = canvas.getContext('2d', { alpha: false, desynchronized: true })

    const resize = () => {
      // Cap at 1280×720 — indistinguishable from 1080p fullscreen, but
      // drawImage is ~2× faster which directly reduces frame stutter
      canvas.width  = Math.min(window.innerWidth,  1280)
      canvas.height = Math.min(window.innerHeight, 720)
      coverRef.current = null
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Video loading: track real buffer progress → drives intro loading bar ──
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Fire on every chunk downloaded — update loading bar with real %
    function onProgress() {
      if (!video!.duration || !video!.buffered.length) return
      const pct = Math.round(
        (video!.buffered.end(video!.buffered.length - 1) / video!.duration) * 100
      )
      const next = Math.min(99, pct)
      if (next > lastProgressRef.current) {
        lastProgressRef.current = next
        setProgress(next)
      }
    }

    // canplaythrough = fully buffered — seeking is now instant everywhere
    function onReady() {
      video!.pause()
      scrubReadyRef.current = true
      lastProgressRef.current = 100
      setProgress(100)
      setUiReady(true)
    }

    // loadedmetadata fires fast (~100ms) — release the intro immediately
    // don't wait for full buffer (canplaythrough) on large videos
    function onMeta() {
      video!.pause()
      lastProgressRef.current = 100
      setProgress(100)
      setUiReady(true)
    }

    video.addEventListener('progress',       onProgress)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('canplaythrough', onReady)

    // Fire immediately if already buffered (cached from previous visit)
    if (video.readyState >= 4) { onReady(); }
    else if (video.readyState >= 1) { onMeta(); }

    // Safety net — never block intro longer than 5 s on very slow connections
    const safety = setTimeout(() => {
      scrubReadyRef.current = true
      lastProgressRef.current = 100
      setProgress(100)
      setUiReady(true)
    }, 5000)

    return () => {
      video.removeEventListener('progress',       onProgress)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('canplaythrough', onReady)
      clearTimeout(safety)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Scroll → update target progress ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return
      const { top, height } = container.getBoundingClientRect()
      targetProgressRef.current = Math.min(1, Math.max(0, -top) / (height - window.innerHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── rAF loop: lerp → seek → draw to canvas ────────────────────────────────
  // Delta-time lerp keeps smoothness identical at 60/120/144 Hz.
  // imageSmoothingEnabled=false skips bilinear upscale (~20% faster drawImage).
  useEffect(() => {
    const tick = (now: number) => {
      const video  = videoRef.current
      const canvas = canvasRef.current
      const ctx    = ctxRef.current

      if (video && ctx && canvas && video.readyState >= 2) {
        // Delta-time lerp — frame-rate independent smoothing
        const dt    = Math.min(now - (lastTickRef.current || now), 50) // cap at 50 ms
        lastTickRef.current = now
        const alpha = 1 - Math.pow(1 - LERP_60, dt / 16.667)

        const diff = targetProgressRef.current - currentProgressRef.current
        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current += diff * alpha
          video.currentTime = currentProgressRef.current * video.duration
        } else if (diff !== 0) {
          // Snap to avoid infinite micro-lerp
          currentProgressRef.current = targetProgressRef.current
        }

        // Recompute cover geometry only when canvas size changes
        const vw = video.videoWidth, vh = video.videoHeight
        const cw = canvas.width,     ch = canvas.height
        const c  = coverRef.current
        if (!c || c.cw !== cw || c.ch !== ch) {
          const scale = Math.max(cw / vw, ch / vh)
          coverRef.current = {
            sx: Math.round((cw - vw * scale) / 2),
            sy: Math.round((ch - vh * scale) / 2),
            sw: Math.round(vw * scale),
            sh: Math.round(vh * scale),
            cw, ch,
          }
        }

        // Draw last decoded frame — skip bilinear for faster GPU blit
        ctx.imageSmoothingEnabled = false
        const { sx, sy, sw, sh } = coverRef.current!
        ctx.drawImage(video, sx, sy, sw, sh)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div ref={containerRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Hidden video — only used as decode source, canvas renders it */}
        <video
          ref={videoRef}
          muted playsInline preload="auto"
          style={{ display: 'none' }}
        >
          <source src="/Herobg.mp4" type="video/mp4" />
        </video>

        {/* Canvas — GPU-composited, shows last decoded frame instantly */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            willChange: 'contents',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }} />
        <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }} />

        {/* ── UI — fades in once video metadata is ready ── */}
        <div
          className="absolute inset-0 flex flex-col justify-between px-7 py-6"
          style={{
            opacity:    uiReady ? 1 : 0,
            transform:  uiReady ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="h-16" />

          {/* Middle nav */}
          <div className="flex items-start justify-between px-2 md:px-8">
            <nav className="flex flex-col gap-4">
              {tr.hero.navLeft.map((item, i) => (
                <a key={item} href="#services"
                  className="text-white/55 hover:text-white transition-colors duration-300"
                  style={{
                    fontFamily: fonts.body, fontWeight: 400,
                    letterSpacing: isRtl ? '0.01em' : '0.03em',
                    fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)',
                    opacity:    uiReady ? 1 : 0,
                    transform:  uiReady ? 'translateY(0)' : 'translateY(14px)',
                    transition: `opacity 0.7s ease ${0.1 + i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s`,
                  }}>
                  {item}
                </a>
              ))}
            </nav>
            <nav className={`flex flex-col gap-4 ${isRtl ? 'text-left' : 'text-right'}`}>
              {tr.hero.navRight.map(({ label, href }, i) => (
                <a key={label} href={href}
                  className="text-white/55 hover:text-white transition-colors duration-300"
                  style={{
                    fontFamily: fonts.body, fontWeight: 400,
                    letterSpacing: isRtl ? '0.01em' : '0.03em',
                    fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)',
                    opacity:    uiReady ? 1 : 0,
                    transform:  uiReady ? 'translateY(0)' : 'translateY(14px)',
                    transition: `opacity 0.7s ease ${0.15 + i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s`,
                  }}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-white leading-[1.15] max-w-[88%] md:max-w-[78%]"
              style={{
                fontFamily: fonts.display, fontWeight: isRtl ? 400 : 300,
                fontSize: 'clamp(2.6rem, 6.5vw, 7rem)',
                opacity:    uiReady ? 1 : 0,
                transform:  uiReady ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 1s ease 0.25s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.25s',
              }}>
              {tr.hero.tagline.split('\n').map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h1>
            <div className={`${isRtl ? 'text-left' : 'text-right'} shrink-0 hidden md:block`}
              style={{
                fontFamily: fonts.body,
                opacity:    uiReady ? 1 : 0,
                transform:  uiReady ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s',
              }}>
              <p className="text-white/40 tracking-[0.2em] uppercase leading-relaxed" style={{ fontSize: '0.8rem' }}>
                {tr.hero.location.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
