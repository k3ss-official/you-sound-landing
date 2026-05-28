'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault?.()
    const trimmed = email?.trim?.() ?? ''
    if (!trimmed) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res?.json?.().catch(() => ({}))
      if (res?.ok) {
        setEmail('')
        // Play the video — it's already loaded and sitting on frame 1
        videoRef.current?.play?.().catch(() => {})
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [email])

  const handleVideoEnd = useCallback(() => {
    setStatus('success')
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* Single video element — paused on first frame = the "image" */}
      <video
        ref={videoRef}
        src="/hero-video.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Scrolling banner — top edge */}
      <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden py-3 sm:py-4 bg-black/20 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 16 }).map((_: unknown, i: number) => (
            <span
              key={i}
              className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mx-8 sm:mx-12 font-light"
            >
              coming soon
            </span>
          ))}
        </div>
      </div>

      {/* Email form / thank you — bottom right */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-10 w-[85%] max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="glass-card rounded-xl px-5 py-3.5 text-right"
              >
                <p className="text-sm text-white/90 tracking-wide font-light">
                  Ta La, we&apos;ll be in touch.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="glass-card rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value ?? '')}
                  placeholder="drop us your email here"
                  className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/40 focus:outline-none font-light tracking-wide py-1 min-w-0"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="shrink-0 text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white transition-all duration-300 disabled:opacity-30 font-light px-2 py-1"
                  aria-label="Subscribe"
                >
                  {status === 'loading' ? (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : status === 'error' ? (
                    'retry'
                  ) : (
                    'enter'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
