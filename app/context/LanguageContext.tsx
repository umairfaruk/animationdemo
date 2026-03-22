'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { t, type Lang } from '../i18n/translations'

interface LangCtx {
  lang:   Lang
  isRtl:  boolean
  toggle: () => void
  tr:     typeof t.en        // always same shape
  fonts:  { display: string; body: string }
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const isRtl = lang === 'ar'

  // Apply dir + lang to <html> for full RTL cascade
  useEffect(() => {
    document.documentElement.dir  = isRtl ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRtl])

  const fonts = isRtl
    ? { display: 'var(--font-cairo)', body: 'var(--font-cairo)' }
    : { display: 'var(--font-cormorant)', body: 'var(--font-geist-sans)' }

  const value: LangCtx = {
    lang,
    isRtl,
    toggle: () => setLang(l => l === 'en' ? 'ar' : 'en'),
    tr:     t[lang] as typeof t.en,
    fonts,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
