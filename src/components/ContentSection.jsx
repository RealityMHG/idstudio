import { useEffect, useRef } from 'react';
import MediaReel from './MediaReel';
import StatementPoster from './StatementPoster';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const services = [
  {
    id: 1,
    title: 'Cut',
    caption: 'Precision shapes, lived-in layers, fringe work, and quiet corrections.',
  },
  {
    id: 2,
    title: 'Color',
    caption: 'Gloss, tone, dimensional blonding, rich brunettes, and color that grows out softly.',
  },
  {
    id: 3,
    title: 'Style',
    caption: 'Editorial finishing, event styling, blowouts, and texture with movement.',
  },
];

const galleryItems = [
  {
    image: publicAsset('/images/studio-gallery-1.png'),
    title: 'Gloss work',
    meta: 'Color refresh',
  },
  {
    image: publicAsset('/images/studio-gallery-2.png'),
    title: 'Sharp shape',
    meta: 'Cut and finish',
  },
  {
    image: publicAsset('/images/studio-gallery-3.png'),
    title: 'Behind the chair',
    meta: 'Tone and prep',
  },
  {
    image: publicAsset('/images/studio-gallery-4.png'),
    title: 'Soft movement',
    meta: 'Blowout styling',
  },
];

function HorizontalLookbook() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const handleRailKey = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const rail = event.currentTarget;
    const track = trackRef.current;
    const nativeScroll = getComputedStyle(rail).overflowX === 'auto';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const current = nativeScroll ? rail.scrollLeft : -new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const max = Math.max(0, track.scrollWidth - rail.clientWidth);
    const gutter = parseFloat(getComputedStyle(track).paddingLeft);
    const stops = [...track.children].map((card) => Math.min(max, card.offsetLeft - gutter));
    stops.push(max);
    let destination;
    if (event.key === 'Home') destination = 0;
    else if (event.key === 'End') destination = max;
    else if (event.key === 'ArrowRight') destination = stops.find((stop) => stop > current + 8) ?? max;
    else destination = stops.filter((stop) => stop < current - 8).at(-1) ?? 0;

    if (nativeScroll) {
      rail.scrollTo({ left: destination, behavior: reducedMotion ? 'instant' : 'smooth' });
    } else {
      const section = sectionRef.current;
      const scrollDistance = section.offsetHeight - section.querySelector('.lookbook-sticky').offsetHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop + (max > 0 ? destination / max : 0) * scrollDistance, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let frameId = 0;
    const nativeScroll = window.matchMedia('(max-width: 780px), (prefers-reduced-motion: reduce), (pointer: coarse)');

    const updateRail = () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;
      if (nativeScroll.matches) {
        track.style.removeProperty('transform');
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - section.querySelector('.lookbook-sticky').offsetHeight;
      const rawProgress = scrollableHeight > 0 ? -rect.top / scrollableHeight : 0;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);

      // Update only the moving rail; scrolling does not re-render the page.
      track.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateRail);
    };

    updateRail();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    nativeScroll.addEventListener('change', requestUpdate);
    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(trackRef.current);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      nativeScroll.removeEventListener('change', requestUpdate);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className="lookbook-scroll" id="lookbook" ref={sectionRef}>
      <div className="lookbook-sticky">
        <div className="lookbook-copy">
          <p className="intro__label">Lookbook</p>
          <h2>Scroll the studio wall.</h2>
        </div>
        <div className="lookbook-rail" role="region" aria-label="Lookbook photographs" tabIndex={0} onKeyDown={handleRailKey}>
          <div className="lookbook-track" ref={trackRef}>
            {galleryItems.map((item) => (
              <article className="lookbook-card" key={item.title}>
                <img src={item.image} alt={`${item.title} at ID HAIR STUDIO`} width="1536" height="1024" loading="lazy" decoding="async" />
                <div>
                  <span>{item.meta}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoshootReels() {
  return (
    <section className="reels" aria-label="Photoshoot reels">
      <div className="section-heading">
        <p>Reels</p>
        <h2>Small flashes from the chair.</h2>
      </div>
      <div className="reel-grid">
        <MediaReel
          src={publicAsset('/videos/studio-reel-1.mp4')}
          poster={publicAsset('/images/studio-gallery-1.png')}
          label="Gloss work reel"
        />
        <MediaReel
          src={publicAsset('/videos/studio-reel-2.mp4')}
          poster={publicAsset('/images/studio-gallery-4.png')}
          label="Soft movement reel"
        />
      </div>
    </section>
  );
}

function FullscreenReel() {
  return (
    <section className="fullscreen-reel" aria-label="ID HAIR STUDIO photoshoot loop">
      <MediaReel
        src={publicAsset('/videos/studio-reel-3.mp4')}
        poster={publicAsset('/images/studio-gallery-3.png')}
        label="Movement, light, hair reel"
      >
        <div className="fullscreen-reel__caption">
          <p>In the chair</p>
          <h2>Movement, light, hair.</h2>
        </div>
      </MediaReel>
    </section>
  );
}

export default function ContentSection() {
  return (
    <>
      <section className="intro" id="studio">
        <p className="intro__label">The salon</p>
        <h2>A studio for cuts, color, and the small details that change everything.</h2>
        <p>
          ID HAIR STUDIO is built around considered consultations, sharp technique, and hair that still
          feels natural after you leave the chair.
        </p>
      </section>

      <HorizontalLookbook />

      <StatementPoster />

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
          <p>
            New clients start with a consultation so the shape, maintenance, and finish all line up.
          </p>
          <a
            href="https://wa.me/351926117055?text=Hi%20id%20studio%2C%20I%27d%20like%20to%20request%20a%20booking."
            target="_blank"
            rel="noreferrer"
          >
            Request on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
