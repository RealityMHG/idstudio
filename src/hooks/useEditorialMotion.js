import { useLayoutEffect } from 'react';
import useReducedMotion from './useReducedMotion';

const clamp = (value) => Math.min(1, Math.max(0, value));

export default function useEditorialMotion(rootRef) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || typeof IntersectionObserver === 'undefined') return;

    const reveals = [...root.querySelectorAll('[data-reveal]')];
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('is-revealed');
        revealObserver.unobserve(target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0 });
    reveals.forEach((element) => {
      // The default is fully visible. Only the enhanced path arms a reveal.
      if (!element.classList.contains('is-revealed')) {
        element.classList.add('motion-ready');
        revealObserver.observe(element);
      }
    });

    const desktop = window.matchMedia('(min-width: 781px) and (not (pointer: coarse))');
    const scenes = [...root.querySelectorAll('[data-scroll-scene]')];
    const active = new Set();
    let frameId = 0;
    let viewportHeight = window.innerHeight;

    const render = () => {
      frameId = 0;
      if (!desktop.matches || document.hidden) return;
      // Batch every geometry read before writing transforms to any scene.
      const measurements = [...active].filter((element) => element.dataset.motionPaused !== 'true')
        .map((element) => ({ element, rect: element.getBoundingClientRect() }));
      measurements.forEach(({ element, rect }) => {
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
        const exitDistance = element.dataset.scrollScene === 'cover' ? rect.height : rect.height - viewportHeight;
        const exit = clamp(-rect.top / Math.max(1, exitDistance));
        element.style.setProperty('--scene-progress', progress.toFixed(4));
        element.style.setProperty('--scene-exit', exit.toFixed(4));
      });
    };
    const requestRender = () => {
      if (!frameId && desktop.matches && !document.hidden) frameId = window.requestAnimationFrame(render);
    };
    const syncViewport = () => {
      viewportHeight = window.innerHeight;
      scenes.forEach((element) => element.classList.toggle('is-motion-active', desktop.matches && active.has(element)));
      requestRender();
    };
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) active.add(target);
        else active.delete(target);
        target.classList.toggle('is-motion-active', isIntersecting && desktop.matches);
      });
      requestRender();
    }, { rootMargin: '160px 0px' });
    scenes.forEach((element) => sceneObserver.observe(element));

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', syncViewport);
    document.addEventListener('visibilitychange', requestRender);
    desktop.addEventListener('change', syncViewport);
    const resizeObserver = new ResizeObserver(requestRender);
    resizeObserver.observe(root);

    return () => {
      window.cancelAnimationFrame(frameId);
      revealObserver.disconnect();
      sceneObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', syncViewport);
      document.removeEventListener('visibilitychange', requestRender);
      desktop.removeEventListener('change', syncViewport);
      reveals.forEach((element) => element.classList.remove('motion-ready'));
      scenes.forEach((element) => {
        element.classList.remove('is-motion-active');
        element.style.removeProperty('--scene-progress');
        element.style.removeProperty('--scene-exit');
      });
    };
  }, [rootRef, reducedMotion]);
}
