import React, { useEffect, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const logoStyles = ['display', 'serif', 'italic', 'outline', 'mono']

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const logoRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const cursor = cursorRef.current
    const logo = logoRef.current

    if (!cursor || !logo || reducedMotion) return

    let logoX = 0
    let logoY = 0
    let targetX = 0
    let targetY = 0
    let frameId = 0
    let visible = false
    let styleIndex = 0
    let styleTimer = 0

    logo.dataset.style = logoStyles[styleIndex]

    const startStyleCycle = () => {
      if (styleTimer) return
      styleTimer = window.setInterval(() => {
        styleIndex = (styleIndex + 1) % logoStyles.length
        logo.dataset.style = logoStyles[styleIndex]
      }, 1000)
    }

    const render = () => {
      logoX += (targetX - logoX) * 0.18
      logoY += (targetY - logoY) * 0.18

      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      logo.style.transform = `translate3d(${logoX}px, ${logoY - 46}px, 0)`

      if (visible && (Math.abs(targetX - logoX) > 0.1 || Math.abs(targetY - logoY) > 0.1)) {
        frameId = window.requestAnimationFrame(render)
      } else {
        frameId = 0
      }
    }

    const handleMove = (event) => {
      // The actual input supports hybrids and mice connected after page load.
      if (event.pointerType !== 'mouse') {
        handleLeave()
        return
      }
      targetX = event.clientX
      targetY = event.clientY
      if (!visible) {
        logoX = targetX
        logoY = targetY
      }
      visible = true
      document.documentElement.classList.add('has-custom-cursor')
      cursor.classList.add('is-visible')
      logo.classList.add('is-visible')
      logo.classList.toggle('is-link', Boolean(event.target.closest('a, button')))
      startStyleCycle()
      if (!frameId) frameId = window.requestAnimationFrame(render)
    }

    const handleLeave = () => {
      visible = false
      document.documentElement.classList.remove('has-custom-cursor')
      cursor.classList.remove('is-visible')
      logo.classList.remove('is-visible')
      cursor.classList.remove('is-pressed')
      logo.classList.remove('is-pressed')
      window.cancelAnimationFrame(frameId)
      frameId = 0
      window.clearInterval(styleTimer)
      styleTimer = 0
    }

    const handleDown = (event) => {
      if (event.pointerType !== 'mouse') {
        handleLeave()
        return
      }
      if (!visible) return
      cursor.classList.add('is-pressed')
      logo.classList.add('is-pressed')
    }

    const handleUp = () => {
      cursor.classList.remove('is-pressed')
      logo.classList.remove('is-pressed')
    }

    const handleKey = (event) => {
      if (event.key === 'Tab' || event.key === 'Escape') handleLeave()
    }
    const handleVisibility = () => {
      if (document.hidden) handleLeave()
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handleLeave)
    window.addEventListener('blur', handleLeave)
    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('keydown', handleKey)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      handleLeave()
      document.documentElement.classList.remove('has-custom-cursor')
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handleMove)
      document.documentElement.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('blur', handleLeave)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [reducedMotion])

  return (
    <>
      <div className="custom-cursor-logo" ref={logoRef} aria-hidden="true">
        <span>ID</span>
      </div>
      <div className="custom-cursor-dot" ref={cursorRef} aria-hidden="true" />
    </>
  )
}
