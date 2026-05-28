'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function HeroSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault?.()
    const trimmed = email?.trim?.() ?? ''
    if (!trimmed) return

    setStatus('loading')
    
    // Play video instantly on submission
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res?.json?.().catch(() => ({}))
      if (res?.ok) {
        setEmail('')
        toast.success(data.message || "You're on the list!")
      } else {
        // Pause and reset if submission fails
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
        setStatus('error')
        toast.error(data.error || "Failed to subscribe. Please try again.")
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      // Pause and reset on network error
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      setStatus('error')
      toast.error("Something went wrong. Please check your connection.")
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [email])

  const handleVideoEnd = useCallback(() => {
    setStatus('success')
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-black flex flex-col sm:block" style={{ height: '100dvh' }}>

      <video
        ref={videoRef}
        key={isMobile ? 'mobile' : 'desktop'}
        src={isMobile ? "/hero-video-mobile.mp4" : "/hero-video.mp4"}
        poster={isMobile ? "/hero-mobile.webp" : "/hero.webp"}
        width={isMobile ? 720 : 1280}
        height={isMobile ? 720 : 720}
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className={isMobile ? "w-full h-auto aspect-square block bg-black" : "absolute inset-0 w-full h-full object-cover block bg-black"}
      />

      {/* Scrolling banner — top edge */}
      <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden py-3 bg-black/20 backdrop-blur-[2px]">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 16 }).map((_: unknown, i: number) => (
            <span
              key={i}
              className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-white/40 mx-10 sm:mx-14 font-light"
            >
              coming soon
            </span>
          ))}
        </div>
      </div>

      {/* Email form / thank you — responsive block-bottom (mobile) / absolute-bottom-right (desktop) */}
      <div className="relative mt-auto mb-10 mx-auto w-[90%] max-w-sm sm:absolute sm:bottom-8 sm:right-8 sm:translate-x-0 sm:left-auto sm:m-0 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="glass-card rounded-xl px-6 py-4 text-center sm:text-right"
              >
                <p className="text-[13px] sm:text-sm text-white/90 tracking-wider font-light">
                  Ta La, we&apos;ll be in touch.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="glass-card rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3 border border-white/10 hover:border-white/20 transition-colors duration-300"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value ?? '')}
                  placeholder="drop us your email here"
                  // font-size text-base (16px) on mobile stops iOS Safari auto-zoom, sm:text-sm (14px) on desktop is clean
                  className="flex-1 bg-transparent text-base sm:text-sm text-white/90 placeholder:text-white/35 focus:outline-none font-light tracking-wide py-1 min-w-0"
                  disabled={status === 'loading'}
                />
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="shrink-0 text-[10px] tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors duration-300 disabled:opacity-20 font-light px-2 py-1 select-none"
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
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
