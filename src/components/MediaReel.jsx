import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// Each reel only downloads and plays as it approaches the viewport.
export default function MediaReel({ src, poster, label, children, className = '' }) {
  const videoRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [nearViewport, setNearViewport] = useState(false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playPreference, setPlayPreference] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    loadObserver.observe(video);
    playObserver.observe(video);
    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const syncPlayback = () => {
      const wantsPlayback = playPreference?.reducedMotion === reducedMotion
        ? playPreference.play
        : !reducedMotion;
      if (nearViewport && inView && !document.hidden && wantsPlayback) {
        video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [nearViewport, inView, reducedMotion, playPreference]);

  return (
    <div className={`media-reel ${className}`}>
      <video
        ref={videoRef}
        src={nearViewport ? src : undefined}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload={nearViewport && !reducedMotion ? 'metadata' : 'none'}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {children}
      <button
        className="media-control"
        onClick={() => setPlayPreference({ play: !playing, reducedMotion })}
        aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
      >
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
