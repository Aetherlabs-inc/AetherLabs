'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const LINES = [
  'Welcome to your provenance studio.',
  'Every piece deserves a trusted record.',
  'Let’s open the archive together.'
]

const DISPLAY_MS = 2200
const TRANSITION_MS = 1200
const TRANSITION_S = TRANSITION_MS / 1000
const LINE_MS = DISPLAY_MS + TRANSITION_MS

export default function AuthIntro() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  const shouldRun = useMemo(() => pathname === '/login', [pathname])

  useEffect(() => {
    if (!shouldRun) return
    if (sessionStorage.getItem('aether_auth_intro_seen') === 'true') return

    setVisible(true)
    sessionStorage.setItem('aether_auth_intro_seen', 'true')

    const totalDuration = LINE_MS * LINES.length
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % LINES.length)
    }, LINE_MS)

    const timeout = window.setTimeout(() => {
      setVisible(false)
      window.clearInterval(interval)
    }, totalDuration)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [shouldRun])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9f8f6]/95 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_S, ease: 'easeInOut' }}
        >
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRANSITION_S, ease: 'easeInOut' }}
          >
            <div className="mx-auto mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[#2A2121]/60">
              <span className="h-2 w-2 rounded-full bg-[#BC8010]" />
              Studio Access
            </div>
            <motion.p
              key={index}
              className="text-2xl sm:text-3xl font-semibold text-[#2A2121]"
              initial={{ opacity: 0,decelerate: 0.2 }}
              animate={{ opacity: 1 ,decelerate: 0.2 }}
              exit={{ opacity: 0 ,decelerate: 0.2}}
              transition={{ duration: TRANSITION_S, ease: 'easeInOut', delay: 0.2 }}
            >
              {LINES[index]}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
