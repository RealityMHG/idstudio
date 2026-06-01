import React, { useEffect, useRef } from 'react'

const logoStyles = ['serif-white', 'sans-rose', 'italic-gold', 'outline-black', 'mono-blue']

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const logo = logoRef.current

    if (!cursor || !logo || !window.matchMedia('(pointer: fine)').matches) return

    let logoX = 0
    let logoY = 0
    let targetX = 0
    let targetY = 0
    let frameId = 0
    let styleIndex = 0

    const render = () => {
      logoX += (targetX - logoX) * 0.18
      logoY += (targetY - logoY) * 0.18

      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      logo.style.transform = `translate3d(${logoX}px, ${logoY - 46}px, 0)`

      frameId = window.requestAnimationFrame(render)
    }

    const handleMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      cursor.classList.add('is-visible')
      logo.classList.add('is-visible')
    }

    const handleLeave = () => {
      cursor.classList.remove('is-visible')
      logo.classList.remove('is-visible')
    }

    const handleDown = () => {
      cursor.classList.add('is-pressed')
      logo.classList.add('is-pressed')
    }

    const handleUp = () => {
      cursor.classList.remove('is-pressed')
      logo.classList.remove('is-pressed')
    }

    const styleTimer = window.setInterval(() => {
      styleIndex = (styleIndex + 1) % logoStyles.length
      logo.dataset.style = logoStyles[styleIndex]
    }, 950)

    logo.dataset.style = logoStyles[styleIndex]
    frameId = window.requestAnimationFrame(render)
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)

    return () => {
      window.clearInterval(styleTimer)
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [])

  return (
    <>
      <div className="custom-cursor-logo" ref={logoRef} aria-hidden="true">
        <span>id</span>
      </div>
      <div className="custom-cursor-dot" ref={cursorRef} aria-hidden="true" />
    </>
  )
}
