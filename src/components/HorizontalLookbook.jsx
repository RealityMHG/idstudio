import { useEffect, useRef } from 'react';
import EditorialPhoto from './EditorialPhoto';
import { salonImages } from '../content/salonImages';

const frameWidths = [
  { mobile: 85, native: 50, desktop: 38 },
  { mobile: 65, native: 34, desktop: 25 },
  { mobile: 100, native: 50, desktop: 42 },
  { mobile: 75, native: 44, desktop: 33 },
];

export default function HorizontalLookbook() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const handleRailKey = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const rail = event.currentTarget;
    const track = trackRef.current;
    // On phones this becomes a vertical photo essay with ordinary page scrolling.
    if (getComputedStyle(track).flexDirection === 'column') return;
    event.preventDefault();
    const nativeScroll = getComputedStyle(rail).overflowX === 'auto';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const current = nativeScroll ? rail.scrollLeft : -new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const max = Math.max(0, track.scrollWidth - rail.clientWidth);
    const gutter = parseFloat(getComputedStyle(track).paddingLeft);
    const stops = [...track.children].map((photo) => Math.min(max, photo.offsetLeft - gutter));
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
      const distance = section.offsetHeight - section.querySelector('.lookbook-sticky').offsetHeight;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (max ? destination / max : 0) * distance, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const sticky = section.querySelector('.lookbook-sticky');
    const rail = section.querySelector('.lookbook-rail');
    const nativeScroll = window.matchMedia('(max-width: 780px), (max-height: 620px), (prefers-reduced-motion: reduce), (pointer: coarse)');
    let frameId = 0;
    let visible = false;
    let distance = 1;
    let travel = 0;

    const render = () => {
      frameId = 0;
      if (nativeScroll.matches || !visible || document.hidden) return;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance));
      track.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
      section.style.setProperty('--rail-progress', progress.toFixed(4));
    };
    const requestRender = () => {
      if (!frameId && visible && !document.hidden) frameId = window.requestAnimationFrame(render);
    };
    const measure = () => {
      // Width and pin distance change only on resize/font load, never per frame.
      distance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      travel = Math.max(0, track.scrollWidth - rail.clientWidth);
      section.classList.toggle('is-motion-active', visible && !nativeScroll.matches);
      if (nativeScroll.matches) {
        track.style.removeProperty('transform');
        section.style.removeProperty('--rail-progress');
      } else {
        // A touch rail may have been dragged before connecting a mouse/resizing.
        rail.scrollLeft = 0;
        requestRender();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      section.classList.toggle('is-motion-active', visible && !nativeScroll.matches);
      requestRender();
    }, { rootMargin: '160px 0px' });
    observer.observe(section);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    resizeObserver.observe(sticky);
    measure();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', requestRender);
    nativeScroll.addEventListener('change', measure);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', requestRender);
      nativeScroll.removeEventListener('change', measure);
      section.classList.remove('is-motion-active');
      track.style.removeProperty('transform');
      section.style.removeProperty('--rail-progress');
    };
  }, []);

  return (
    <section className="lookbook-scroll" id="lookbook" ref={sectionRef}>
      <div className="lookbook-sticky">
        <div className="lookbook-copy">
          <p className="lookbook-copy__title">Lookbook</p>
          <h2>Scroll the studio wall.</h2>
        </div>
        <div className="lookbook-rail" role="region" aria-label="Lookbook photographs" tabIndex={0} onKeyDown={handleRailKey}>
          <div className="lookbook-track" ref={trackRef}>
            {salonImages.gallery.map((item, index) => (
              <article className="lookbook-card" key={item.title}>
                <EditorialPhoto image={item.image} sizes={`(max-width: 780px) ${frameWidths[index].mobile}vw, (pointer: coarse) ${frameWidths[index].native}vw, (prefers-reduced-motion: reduce) ${frameWidths[index].native}vw, (max-height: 620px) ${frameWidths[index].native}vw, ${frameWidths[index].desktop}vw`} />
                <div className="lookbook-card__caption">
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
