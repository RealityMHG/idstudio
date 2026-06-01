import React, { useEffect, useRef, useState } from 'react'

const services = [
  {
    id: 1,
    title: 'Cut',
    caption: 'Precision shapes, lived-in layers, fringe work, and quiet corrections.'
  },
  {
    id: 2,
    title: 'Color',
    caption: 'Gloss, tone, dimensional blonding, rich brunettes, and color that grows out softly.'
  },
  {
    id: 3,
    title: 'Style',
    caption: 'Editorial finishing, event styling, blowouts, and texture with movement.'
  }
]

const galleryItems = [
  {
    image: '/images/studio-gallery-1.png',
    title: 'Gloss work',
    meta: 'Color refresh'
  },
  {
    image: '/images/studio-gallery-2.png',
    title: 'Sharp shape',
    meta: 'Cut and finish'
  },
  {
    image: '/images/studio-gallery-3.png',
    title: 'Behind the chair',
    meta: 'Tone and prep'
  },
  {
    image: '/images/studio-gallery-4.png',
    title: 'Soft movement',
    meta: 'Blowout styling'
  }
]

function HorizontalLookbook() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [railX, setRailX] = useState(0)

  useEffect(() => {
    let frameId = 0

    const updateRail = () => {
      const section = sectionRef.current
      const track = trackRef.current

      if (!section || !track) return

      const rect = section.getBoundingClientRect()
      const scrollableHeight = section.offsetHeight - window.innerHeight
      const rawProgress = scrollableHeight > 0 ? -rect.top / scrollableHeight : 0
      const progress = Math.min(1, Math.max(0, rawProgress))
      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth)

      setRailX(progress * maxTranslate)
    }

    const requestUpdate = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateRail)
    }

    updateRail()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section className="lookbook-scroll" id="lookbook" ref={sectionRef}>
      <div className="lookbook-sticky">
        <div className="lookbook-copy">
          <p className="intro__label">Lookbook</p>
          <h2>Scroll the studio wall.</h2>
        </div>
        <div
          className="lookbook-track"
          ref={trackRef}
          style={{ transform: `translate3d(-${railX}px, 0, 0)` }}
        >
          {galleryItems.map((item) => (
            <article className="lookbook-card" key={item.title}>
              <img src={item.image} alt={`${item.title} at id studio`} />
              <div>
                <span>{item.meta}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhotoshootReels() {
  const reelRef = useRef(null)

  useEffect(() => {
    const videos = reelRef.current?.querySelectorAll('video') ?? []

    videos.forEach((video) => {
      video.muted = true
      video.play().catch(() => {})
    })
  }, [])

  return (
    <section className="reels" aria-label="Photoshoot reels" ref={reelRef}>
      <div className="section-heading">
        <p>Reels</p>
        <h2>Small flashes from the chair.</h2>
      </div>
      <div className="reel-grid">
        <video src="/videos/studio-reel-1.mp4" poster="/images/studio-gallery-1.png" autoPlay muted loop playsInline preload="auto" />
        <video src="/videos/studio-reel-2.mp4" poster="/images/studio-gallery-4.png" autoPlay muted loop playsInline preload="auto" />
      </div>
    </section>
  )
}

function FullscreenReel() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <section className="fullscreen-reel" aria-label="id studio photoshoot loop">
      <video ref={videoRef} src="/videos/studio-reel-3.mp4" autoPlay muted loop playsInline preload="auto" />
      <div className="fullscreen-reel__caption">
        <p>In the chair</p>
        <h2>Movement, light, hair.</h2>
      </div>
    </section>
  )
}

export default function ContentSection(){
  return (
    <>
      <section className="intro" id="studio">
        <p className="intro__label">The salon</p>
        <h2>A studio for cuts, color, and the small details that change everything.</h2>
        <p>
          id studio is built around considered consultations, sharp technique, and hair
          that still feels natural after you leave the chair.
        </p>
      </section>

      <HorizontalLookbook />

      <section className="quote-band" aria-label="Studio philosophy">
        <p>"A good appointment should feel specific, not scripted."</p>
      </section>

      <FullscreenReel />

      <section className="services" id="services">
        <div className="section-heading">
          <p>Menu</p>
          <h2>Services with a point of view.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <span>0{service.id}</span>
              <h3>{service.title}</h3>
              <p>{service.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <PhotoshootReels />

      <section className="split-feature" id="booking">
        <div>
          <p className="intro__label">Appointments</p>
          <h2>Book the chair, bring the reference, leave with the edit.</h2>
        </div>
        <div className="booking-panel">
          <p>New clients start with a consultation so the shape, maintenance, and finish all line up.</p>
          <a href="https://wa.me/351926117055?text=Hi%20id%20studio%2C%20I%27d%20like%20to%20request%20a%20booking." target="_blank" rel="noreferrer">Request on WhatsApp</a>
        </div>
      </section>
    </>
  )
}
