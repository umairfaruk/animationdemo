'use client'

import { createContext, useContext, useState } from 'react'

interface LoadingCtx {
  progress:    number          // 0–100
  setProgress: (n: number) => void
}

const Ctx = createContext<LoadingCtx | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  return <Ctx.Provider value={{ progress, setProgress }}>{children}</Ctx.Provider>
}

export function useLoading() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLoading must be used inside LoadingProvider')
  return ctx
}
