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

    // Play video WITH sound on submission — the submit is a user gesture,
    // so browsers allow unmuted playback here.
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.volume = 1
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
    // Hold the "Ta La" message for 10s, then reset to the form and re-arm the video.
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.muted = true
      }
      setStatus('idle')
    }, 10000)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-black flex flex-col items-center justify-center sm:block" style={{ height: '100dvh' }}>

      {/* Media + banner — banner rides the top edge of the video */}
      <div className="relative w-full sm:static sm:w-auto">
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

        {/* Scrolling banner — sits directly on the top edge of the video */}
        <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden py-2.5 bg-black/25 backdrop-blur-[2px]">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array.from({ length: 16 }).map((_: unknown, i: number) => (
              <span
                key={i}
                className="text-[13px] sm:text-[13px] tracking-[0.4em] uppercase text-white/50 mx-8 sm:mx-14 font-light"
              >
                coming soon
              </span>
            ))}
          </div>
        </div>

        {/* Email form / thank you — overlaid on the bottom-right of the video, in the empty bar space */}
        <div className="absolute bottom-3 right-3 w-[78%] max-w-[300px] sm:bottom-8 sm:right-8 sm:w-[90%] sm:max-w-sm z-20">
        <div className="animate-fade-in-up">
          {status !== 'success' && (
            <div className="flex justify-center mb-1.5 pointer-events-none" aria-hidden="true">
              <svg
                className="animate-gentle-bounce w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.75)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          )}
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
                className="led-trail glass-card rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3 border border-white/35 hover:border-white/50 transition-colors duration-300"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value ?? '')}
                  placeholder="drop us your email here"
                  // font-size text-base (16px) on mobile stops iOS Safari auto-zoom, sm:text-sm (14px) on desktop is clean
                  className="flex-1 bg-transparent text-base sm:text-sm text-white/90 placeholder:text-white/55 focus:outline-none font-light tracking-wide py-1 min-w-0"
                  disabled={status === 'loading'}
                />
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="shrink-0 text-[11px] tracking-[0.25em] uppercase text-amber-300 hover:text-amber-200 transition-colors duration-300 disabled:opacity-30 font-normal px-2 py-1 select-none"
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
        </div>
        </div>
      </div>
    </div>
  )
}
