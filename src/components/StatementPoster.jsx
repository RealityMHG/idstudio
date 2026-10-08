import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';
import EditorialPhoto from './EditorialPhoto';
import { salonImages } from '../content/salonImages';

const words = ['CUT', 'COLOR', 'TEXTURE', 'IDENTITY'];
const framePoints = [[1, 80], [1, 1], [1120, 1], [1199, 80], [1199, 599], [80, 599], [1, 520]];
const framePath = `M${framePoints.map((point) => point.join(' ')).join('L')}Z`;

export default function StatementPoster() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [marquee, setMarquee] = useState({ repetitions: 1, duration: 36 });
  const marqueeRef = useRef(null);
  const sequenceRef = useRef(null);
  const compositionRef = useRef(null);
  const enteredRef = useRef(false);
  const entranceAnimationsRef = useRef([]);

  useEffect(() => {
    const composition = compositionRef.current;
    // Cancelling removes temporary dash/opacity values and reveals the static CSS.
    const cancelEntrance = () => {
      entranceAnimationsRef.current.forEach((animation) => animation.cancel());
      entranceAnimationsRef.current = [];
    };
    if (reducedMotion) cancelEntrance();
    if (enteredRef.current || typeof IntersectionObserver === 'undefined') return cancelEntrance;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      enteredRef.current = true;
      observer.disconnect();
      if (reducedMotion) return;

      const frame = composition.querySelector('.statement-poster__frame path');
      const orbit = composition.querySelector('.statement-poster__orbit');
      if (typeof frame.animate !== 'function') return;
      const styles = getComputedStyle(composition);
      const orbitOpacity = getComputedStyle(orbit).opacity;
      const easing = styles.getPropertyValue('--ease').trim();
      // Non-scaling strokes use screen distances, even with pathLength="1".
      // Measure this polygon once so the draw starts cleanly at every aspect ratio.
      const matrix = frame.getScreenCTM();
      if (!matrix) return;
      const screenPoints = framePoints.map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      const screenLength = screenPoints.reduce((length, point, index) => {
        const next = screenPoints[(index + 1) % screenPoints.length];
        return length + Math.hypot(next.x - point.x, next.y - point.y);
      }, 0);
      const dash = String(screenLength / frame.getTotalLength());
      const draw = frame.animate(
        [{ strokeDasharray: dash, strokeDashoffset: dash }, { strokeDasharray: dash, strokeDashoffset: '0' }],
        { duration: parseFloat(styles.getPropertyValue('--motion-draw')), easing },
      );
      const fade = orbit.animate(
        [{ opacity: 0 }, { opacity: orbitOpacity }],
        {
          duration: parseFloat(styles.getPropertyValue('--motion-fast')),
          delay: parseFloat(styles.getPropertyValue('--motion-step')),
          easing,
          fill: 'backwards',
        },
      );
      entranceAnimationsRef.current = [draw, fade];
      entranceAnimationsRef.current.forEach((animation) => {
        animation.onfinish = () => {
          animation.cancel();
          entranceAnimationsRef.current = entranceAnimationsRef.current.filter((active) => active !== animation);
        };
      });
    }, { threshold: 0.2 });
    observer.observe(composition);
    window.addEventListener('resize', cancelEntrance);
    return () => {
      observer.disconnect();
      cancelEntrance();
      window.removeEventListener('resize', cancelEntrance);
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const measure = () => {
      const sequenceWidth = sequenceRef.current.getBoundingClientRect().width;
      if (!sequenceWidth) return;
      // Each half must cover the viewport; matching halves make the seam invisible.
      const repetitions = Math.max(1, Math.ceil(marqueeRef.current.clientWidth / sequenceWidth));
      const duration = repetitions * sequenceWidth / 28;
      setMarquee((previous) => (
        previous.repetitions === repetitions && previous.duration === duration
          ? previous
          : { repetitions, duration }
      ));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(marqueeRef.current);
    observer.observe(sequenceRef.current);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(marqueeRef.current);
    const updateVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <section
      className={`statement-poster${paused || reducedMotion || !inView || !tabVisible ? ' is-paused' : ''}`}
      aria-labelledby="statement-title"
      data-scroll-scene
      data-motion-paused={paused ? 'true' : undefined}
    >
      <div className="statement-poster__meta">
        <span>ID HAIR STUDIO</span>
        <span>Hair, shape, identity</span>
      </div>
      <div className="statement-poster__composition" ref={compositionRef}>
        <h2 id="statement-title" className="sr-only">Your hair is your ID</h2>
        <div className="statement-poster__type" aria-hidden="true">
          <span className="statement-poster__your">YOUR</span>
          <span className="statement-poster__hair">HAIR</span>
          <span className="statement-poster__is">is your</span>
          <span className="statement-poster__id"><span>ID</span></span>
        </div>
        <svg className="statement-poster__orbit" viewBox="0 0 600 500" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="0.8">
            <ellipse cx="300" cy="250" rx="284" ry="138" transform="rotate(-28 300 250)" />
            <ellipse cx="300" cy="250" rx="284" ry="116" transform="rotate(-28 300 250)" />
          </g>
        </svg>
        <svg className="statement-poster__frame" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
          <path d={framePath} pathLength="1" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="statement-poster__side" aria-hidden="true">CUT / COLOR / CREATE</span>
      </div>
      <div className="statement-poster__gallery">
        {salonImages.neon.map(({ image, caption }, index) => (
          <EditorialPhoto key={caption} image={image} caption={caption} sizes={`(max-width: 780px) ${[42, 56, 62][index]}vw, ${[30, 42, 32][index]}vw`} />
        ))}
      </div>
      <div className="statement-poster__footer">
        <p>"A good appointment should feel specific, not scripted."</p>
        {!reducedMotion && (
          <button className="poster-control" aria-controls="statement-marquee" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? 'Play motion' : 'Pause motion'}
          </button>
        )}
      </div>
      <div className="statement-poster__marquee" id="statement-marquee" ref={marqueeRef} aria-hidden="true">
        <div className="statement-poster__track" style={{ '--marquee-duration': `${marquee.duration}s` }}>
          {[0, 1].map((copy) => (
            <div className="statement-poster__words" key={copy}>
              {Array.from({ length: marquee.repetitions }, (_, repetition) => (
                <div
                  className="statement-poster__sequence"
                  key={repetition}
                  ref={copy === 0 && repetition === 0 ? sequenceRef : undefined}
                >
                  {words.map((word) => <span key={word}>{word}<i>/</i></span>)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
