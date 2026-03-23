'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useLoading } from '../context/LoadingContext'

const TOTAL_FRAMES = 296
const FRAME_DIR    = '/Frames'
// Snappier lerp — 0.22 reaches 95% of target in ~12 rAF ticks (~200ms at 60fps)
const LERP_FACTOR  = 0.22

function frameUrl(i: number) {
  return `${FRAME_DIR}/SSbg${String(i).padStart(3, '0')}.png`
}

export default function Hero() {
  const { tr, fonts, isRtl } = useLang()
  const { setProgress } = useLoading()
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  // Store GPU-decoded ImageBitmaps (with HTMLImageElement as fallback for older browsers)
  const bitmapsRef      = useRef<(ImageBitmap | HTMLImageElement | null)[]>(Array.from({ length: TOTAL_FRAMES }, () => null))
  const ctxRef          = useRef<CanvasRenderingContext2D | null>(null)

  const targetFrameRef  = useRef(0)
  const currentFrameRef = useRef(0)
  const rafRef          = useRef<number | null>(null)
  // Cache cover geometry so we don't recompute every draw call
  const coverCacheRef   = useRef<{ w: number; h: number; bw: number; bh: number; sx: number; sy: number; sw: number; sh: number } | null>(null)

  const [loaded, setLoaded]             = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  // ── Draw using cached ImageBitmap ─────────────────────────────────────────
  const drawFrame = (floatIndex: number) => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    const lo    = Math.floor(floatIndex)
    const hi    = Math.min(TOTAL_FRAMES - 1, lo + 1)
    const alpha = floatIndex - lo

    const bmpLo = bitmapsRef.current[lo]
    if (!bmpLo) return

    // Recompute cover geometry only when canvas or bitmap size changes
    const cache = coverCacheRef.current
    if (!cache || cache.w !== canvas.width || cache.h !== canvas.height || cache.bw !== bmpLo.width || cache.bh !== bmpLo.height) {
      const scale = Math.max(canvas.width / bmpLo.width, canvas.height / bmpLo.height)
      coverCacheRef.current = {
        w:  canvas.width,
        h:  canvas.height,
        bw: bmpLo.width,
        bh: bmpLo.height,
        // Integer coords — sub-pixel drawing triggers expensive anti-aliasing
        sx: Math.round((canvas.width  - bmpLo.width  * scale) / 2),
        sy: Math.round((canvas.height - bmpLo.height * scale) / 2),
        sw: Math.round(bmpLo.width  * scale),
        sh: Math.round(bmpLo.height * scale),
      }
    }
    const { sx, sy, sw, sh } = coverCacheRef.current!

    // Draw base frame (alpha: false ctx means no clearRect needed — overwrites)
    ctx.globalAlpha = 1
    ctx.drawImage(bmpLo, sx, sy, sw, sh)

    // Cross-fade only in the middle range — extreme alphas waste a draw call
    const bmpHi = bitmapsRef.current[hi]
    if (bmpHi && alpha > 0.08 && alpha < 0.92) {
      ctx.globalAlpha = alpha
      ctx.drawImage(bmpHi, sx, sy, sw, sh)
      ctx.globalAlpha = 1
    }
  }

  // ── Resize: invalidate cover cache so geometry is recalculated ────────────
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    coverCacheRef.current = null        // force geometry recalc
    drawFrame(currentFrameRef.current)
  }

  // ── Preload: skip on mobile, load all frames on desktop ──────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768

    const canvas = canvasRef.current!
    ctxRef.current = canvas.getContext('2d', { alpha: false, desynchronized: true })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mobile: 296 PNGs are too heavy — signal 100 % immediately
    if (isMobile) {
      setLoadProgress(100)
      setProgress(100)
      setLoaded(true)
      return () => window.removeEventListener('resize', resizeCanvas)
    }

    // Desktop: full frame load
    let done = 0
    let safetyTimer: ReturnType<typeof setTimeout>
    const bitmaps = bitmapsRef.current
    const canBitmap = typeof createImageBitmap !== 'undefined'

    function onFrameDone(i: number, bmp: ImageBitmap | HTMLImageElement) {
      bitmaps[i] = bmp
      done++
      const pct = Math.round((done / TOTAL_FRAMES) * 100)
      setLoadProgress(pct)
      setProgress(pct)
      if (i === 0) drawFrame(0)
      if (done === TOTAL_FRAMES) { clearTimeout(safetyTimer); setLoaded(true) }
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        if (canBitmap) createImageBitmap(img).then(b => onFrameDone(i, b)).catch(() => onFrameDone(i, img))
        else onFrameDone(i, img)
      }
      img.onerror = () => onFrameDone(i, img)
    }

    safetyTimer = setTimeout(() => {
      if (done < TOTAL_FRAMES) { setLoadProgress(100); setProgress(100); setLoaded(true) }
    }, 12000)

    return () => { window.removeEventListener('resize', resizeCanvas); clearTimeout(safetyTimer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Scroll → update target frame ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return
      const { top, height } = container.getBoundingClientRect()
      const scrollable = height - window.innerHeight
      const progress   = Math.min(1, Math.max(0, -top) / scrollable)
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── rAF loop: lerp + draw ─────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current
      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += diff * LERP_FACTOR
        drawFrame(currentFrameRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Canvas — will-change promotes to GPU compositor layer */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', willChange: 'contents' }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }} />
        <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }} />

        {/* Loading */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
            <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Loading
            </span>
            <div className="w-40 h-px bg-white/10 overflow-hidden">
              <div className="h-full bg-white/60 transition-all duration-200"
                style={{ width: `${loadProgress}%` }} />
            </div>
          </div>
        )}

        {/* ── Layout ── */}
        <div className="absolute inset-0 flex flex-col justify-between px-7 py-6">

          <div className="h-16" />

          {/* Middle nav */}
          <div className="flex items-start justify-between px-2 md:px-8">
            <nav className="flex flex-col gap-4">
              {tr.hero.navLeft.map(item => (
                <a key={item} href="#services"
                  className="text-white/55 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: fonts.body, fontWeight: 400, letterSpacing: isRtl ? '0.01em' : '0.03em', fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)' }}>
                  {item}
                </a>
              ))}
            </nav>
            <nav className={`flex flex-col gap-4 ${isRtl ? 'text-left' : 'text-right'}`}>
              {tr.hero.navRight.map(({ label, href }) => (
                <a key={label} href={href}
                  className="text-white/55 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: fonts.body, fontWeight: 400, letterSpacing: isRtl ? '0.01em' : '0.03em', fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)' }}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-white leading-[1.15] max-w-[88%] md:max-w-[78%]"
              style={{ fontFamily: fonts.display, fontWeight: isRtl ? 400 : 300, fontSize: 'clamp(2.6rem, 6.5vw, 7rem)' }}>
              {tr.hero.tagline.split('\n').map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h1>
            <div className={`${isRtl ? 'text-left' : 'text-right'} shrink-0 hidden md:block`}
              style={{ fontFamily: fonts.body }}>
              <p className="text-white/40 tracking-[0.2em] uppercase leading-relaxed"
                style={{ fontSize: '0.8rem' }}>
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
