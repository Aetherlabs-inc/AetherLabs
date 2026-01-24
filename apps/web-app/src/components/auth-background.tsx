'use client'

import { useEffect, useRef } from 'react'

export default function AuthBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      targetX = (x - 0.5) * 14
      targetY = (y - 0.5) * 14
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      el.style.setProperty('--mx', `${currentX}px`)
      el.style.setProperty('--my', `${currentY}px`)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div ref={ref} className="auth-bg" aria-hidden="true">
      <div className="auth-blob auth-blob--gold" />
      <div className="auth-blob auth-blob--terracotta" />
      <div className="auth-blob auth-blob--charcoal" />
      <div className="auth-blob auth-blob--pearl" />
    </div>
  )
}
