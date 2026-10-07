import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// Each reel only downloads and plays as it approaches the viewport.
export default function MediaReel({ src, poster, label, children, className = '' }) {
  const videoRef = useRef(null);
  const playRequestRef = useRef(0);
  const statusId = useId();
  const reducedMotion = useReducedMotion();
  const [nearViewport, setNearViewport] = useState(false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playPreference, setPlayPreference] = useState(null);
  const [playbackIssue, setPlaybackIssue] = useState(null);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    const request = ++playRequestRef.current;
    video.play()?.catch((error) => {
      // Ignore superseded requests and ordinary pauses during scroll/unmount.
      if (request !== playRequestRef.current || error.name === 'AbortError') return;
      setPlaying(false);
      setPlaybackIssue(error.name === 'NotAllowedError' ? 'blocked' : 'unavailable');
    });
  }, []);

  const pausePlayback = useCallback(() => {
    playRequestRef.current += 1;
    videoRef.current?.pause();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    const wantsPlayback = video.paused || video.ended;
    setPlayPreference({ play: wantsPlayback, reducedMotion });
    setPlaybackIssue(null);
    if (wantsPlayback) {
      // Keep play() inside the click/keyboard activation for restrictive browsers.
      if (!video.getAttribute('src')) video.src = src;
      setNearViewport(true);
      startPlayback();
    } else {
      pausePlayback();
    }
  };

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
    const syncPlayback = () => {
      const wantsPlayback = playPreference?.reducedMotion === reducedMotion
        ? playPreference.play
        : !reducedMotion;
      if (nearViewport && inView && !document.hidden && wantsPlayback) {
        startPlayback();
      } else {
        pausePlayback();
      }
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [nearViewport, inView, reducedMotion, playPreference, startPlayback, pausePlayback]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      playRequestRef.current += 1;
      video.pause();
    };
  }, []);

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
        controls={playbackIssue === 'blocked'}
        preload={nearViewport && !reducedMotion ? 'metadata' : 'none'}
        onPlay={() => {
          setPlaying(true);
          setPlaybackIssue(null);
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setPlaybackIssue('unavailable');
        }}
      />
      {children}
      {playbackIssue && (
        <p className="media-status" id={statusId} role="status">
          {playbackIssue === 'blocked' ? 'Press Play to watch.' : 'Video unavailable. Please try again.'}
        </p>
      )}
      <button
        className="media-control"
        onClick={togglePlayback}
        aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
        aria-describedby={playbackIssue ? statusId : undefined}
      >
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
