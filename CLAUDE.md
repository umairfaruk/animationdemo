# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build — must pass before deploy
npm run lint     # ESLint
npm run start    # serve production build
```

## Stack

- **Next.js 16.2.1** (App Router) · **React 19.2.4** · **TypeScript** · **Tailwind CSS v4** · **GSAP 3**
- Tailwind v4 uses `@import "tailwindcss"` in globals.css — no `tailwind.config.js`. Use `bg-linear-to-b` not `bg-gradient-to-b`.

## Architecture

### Loading pipeline
Two React contexts wire the loading experience together:

1. **`LoadingContext`** (`app/context/LoadingContext.tsx`) — holds `progress` (0–100) and `setProgress`. `Hero` calls `setProgress` as the hero video buffers.
2. **`LoadingProvider` → `LanguageProvider` → `IntroAnimation` + `{children}`** — this nesting order in `layout.tsx` is intentional; both contexts must wrap IntroAnimation.

`IntroAnimation` reads `progress` and exits only when `progress === 100` AND `MIN_DISPLAY` ms have elapsed. A module-level `let introPlayed = false` flag skips the animation on client-side navigation but replays on full page reload.

### Hero scroll animation
`Hero` (`app/components/Hero.tsx`) uses a **video-scrub-to-canvas** approach:
- Hidden `<video>` element with `preload="auto"` loads `/public/Herobg.mp4`
- A `requestAnimationFrame` loop lerps `currentProgressRef` toward `targetProgressRef` (set by scroll), then seeks the video and draws the current frame onto a `<canvas>` via `ctx.drawImage(video, …)`
- The canvas is capped at 1920×1080 for GPU performance
- Seeking is clamped to `video.buffered` range to prevent stalls on partially-loaded video
- `uiReady` state (set on `loadedmetadata`) gates the entrance animation of the hero text overlay

### Language / RTL
`LanguageContext` (`app/context/LanguageContext.tsx`) provides `{ lang, isRtl, toggle, tr, fonts }` to all components via `useLang()`. Switching language sets `document.documentElement.dir` and swaps font variables:
- EN: `--font-cormorant` (display) + `--font-geist-sans` (body)
- AR: `--font-cairo` for both

All translations live in `app/i18n/translations.ts`. Add keys to both `en` and `ar` objects when adding new copy.

### Responsive breakpoint
`app/hooks/useIsMobile.ts` — `useIsMobile(breakpoint = 768)` hook used by all section components to switch between mobile and desktop layouts via inline styles.

### Scroll reset on reload
An inline `<script>` in `layout.tsx` runs `history.scrollRestoration='manual'; window.scrollTo(0,0)` before React hydrates, ensuring the page always starts at the top.

## Public assets

| Path | Used by |
|---|---|
| `/public/Herobg.mp4` | Hero scroll animation |
| `/public/Contactbg.mp4` | Contact section background |
| `/public/footerbg.mp4` | Footer background (blurred) |
| `/public/project/project01-05.webp` | Services section cursor panel |
| `/public/uniqe/uniqe01-05.webp` | Showcase section slides |

## Key patterns

- All section components are `'use client'` and use `IntersectionObserver` for entrance animations.
- Inline styles are used throughout (not Tailwind classes) for dynamic/animated values.
- GSAP `ScrollTrigger` is used in `Showcase.tsx` with CSS `position: sticky` (not GSAP pin) to avoid pin conflicts.
- `ContactModal` is opened from `page.tsx` via `modalOpen` state passed as props to `Contact` and `ContactModal`.
