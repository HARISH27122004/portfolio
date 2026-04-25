import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/ScrollFilm.css';

// ── Desktop tuning (original logic) ───────────────────────────────────────
const SCROLL_THRESHOLD = 40; // px of deltaY = 1 frame step

// ── Mobile tuning (smooth lerp logic) ─────────────────────────────────────
const TOUCH_SENSITIVITY  = 0.12;  // touch px dragged → fractional frames
const LERP_SPEED         = 0.10;  // 0–1: how fast current catches target
const COMPLETE_THRESHOLD = 0.5;   // frames from end to trigger completion
const TOUCH_FRICTION     = 0.88;  // momentum decay after finger lifts

// ── Detect mobile/touch device ─────────────────────────────────────────────
const isMobile = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(pointer: coarse)').matches;

const ScrollFilm = ({ images = [], onComplete }) => {
  const canvasRef    = useRef(null);
  const imagesRef    = useRef([]);
  const mobile       = useRef(false); // set once on mount

  // ── Desktop state ──────────────────────────────────────────────────────
  const frameIdx     = useRef(0);
  const scrollAccum  = useRef(0);

  // ── Mobile state ───────────────────────────────────────────────────────
  const targetFrame      = useRef(0);
  const currentFrame     = useRef(0);
  const touchVelocity    = useRef(0);
  const lastTouchY       = useRef(null);
  const rafId            = useRef(null);
  const completedRef     = useRef(false);

  const [displayFrame, setDisplayFrame] = useState(0);
  const [loaded,       setLoaded]       = useState(false);
  const [hintVisible,  setHintVisible]  = useState(true);
  const [fadeOut,      setFadeOut]      = useState(false);
  const [hidden,       setHidden]       = useState(false);

  const totalFrames = images.length;

  // ── Draw ───────────────────────────────────────────────────────────────
  const drawAt = useCallback((canvas, floatIdx) => {
    const idx = Math.round(floatIdx);
    const img = imagesRef.current[idx];
    if (!canvas || !img || !img.complete) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const ctx = canvas.getContext('2d');
    const cAR = W / H;
    const iAR = img.naturalWidth / img.naturalHeight;
    let dW, dH;
    if (cAR > iAR) { dW = W; dH = W / iAR; }
    else            { dH = H; dW = H * iAR; }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, (W - dW) / 2, (H - dH) / 2, dW, dH);
  }, []);

  // ── Shared complete trigger ────────────────────────────────────────────
  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFadeOut(true);
    setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 900);
  }, [onComplete]);

  // ══════════════════════════════════════════════════════════════════════
  // DESKTOP — original accumulator logic
  // ══════════════════════════════════════════════════════════════════════
  const onWheel = useCallback((e) => {
    if (completedRef.current) return;
    e.preventDefault();
    setHintVisible(false);

    scrollAccum.current += e.deltaY;

    while (scrollAccum.current >= SCROLL_THRESHOLD) {
      scrollAccum.current -= SCROLL_THRESHOLD;
      const next = frameIdx.current + 1;
      if (next >= totalFrames) {
        frameIdx.current = totalFrames - 1;
        drawAt(canvasRef.current, frameIdx.current);
        setDisplayFrame(frameIdx.current);
        triggerComplete();
        return;
      }
      frameIdx.current = next;
      drawAt(canvasRef.current, next);
      setDisplayFrame(next);
    }

    while (scrollAccum.current <= -SCROLL_THRESHOLD) {
      scrollAccum.current += SCROLL_THRESHOLD;
      const prev = frameIdx.current - 1;
      if (prev < 0) {
        frameIdx.current    = 0;
        scrollAccum.current = 0;
        return;
      }
      frameIdx.current = prev;
      drawAt(canvasRef.current, prev);
      setDisplayFrame(prev);
    }
  }, [totalFrames, drawAt, triggerComplete]);

  // ══════════════════════════════════════════════════════════════════════
  // MOBILE — RAF lerp + momentum logic
  // ══════════════════════════════════════════════════════════════════════
  const tick = useCallback(() => {
    if (!completedRef.current) {
      // Decay touch momentum after finger lifts
      if (Math.abs(touchVelocity.current) > 0.1) {
        targetFrame.current = Math.max(
          0,
          Math.min(totalFrames - 1, targetFrame.current + touchVelocity.current)
        );
        touchVelocity.current *= TOUCH_FRICTION;
      }

      // Lerp toward target
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.01) {
        currentFrame.current += diff * LERP_SPEED;
        currentFrame.current  = Math.max(0, Math.min(totalFrames - 1, currentFrame.current));
        drawAt(canvasRef.current, currentFrame.current);
        setDisplayFrame(Math.round(currentFrame.current));

        if (currentFrame.current >= totalFrames - 1 - COMPLETE_THRESHOLD) {
          triggerComplete();
        }
      }
    }
    rafId.current = requestAnimationFrame(tick);
  }, [totalFrames, drawAt, triggerComplete]);

  const onTouchStart = useCallback((e) => {
    if (completedRef.current) return;
    lastTouchY.current    = e.touches[0].clientY;
    touchVelocity.current = 0;
    setHintVisible(false);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (completedRef.current || lastTouchY.current === null) return;
    e.preventDefault();

    const y     = e.touches[0].clientY;
    const delta = lastTouchY.current - y; // up = forward
    lastTouchY.current = y;

    touchVelocity.current = delta * TOUCH_SENSITIVITY;
    targetFrame.current   = Math.max(
      0,
      Math.min(totalFrames - 1, targetFrame.current + delta * TOUCH_SENSITIVITY)
    );
  }, [totalFrames]);

  const onTouchEnd = useCallback(() => {
    lastTouchY.current = null;
    // velocity keeps decaying in tick()
  }, []);

  // ══════════════════════════════════════════════════════════════════════
  // MOUNT — detect device, attach correct listeners, start RAF if mobile
  // ══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    mobile.current = isMobile();

    if (mobile.current) {
      // Mobile: smooth RAF loop + touch events
      rafId.current = requestAnimationFrame(tick);
      window.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove',  onTouchMove,  { passive: false });
      window.addEventListener('touchend',   onTouchEnd);
    } else {
      // Desktop: original wheel accumulator
      window.addEventListener('wheel', onWheel, { passive: false });
    }

    return () => {
      if (mobile.current) {
        cancelAnimationFrame(rafId.current);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove',  onTouchMove);
        window.removeEventListener('touchend',   onTouchEnd);
      } else {
        window.removeEventListener('wheel', onWheel);
      }
    };
  }, [tick, onWheel, onTouchStart, onTouchMove, onTouchEnd]);

  // ── Preload ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!images.length) return;
    let count = 0;
    imagesRef.current = new Array(images.length);
    setLoaded(false);

    images.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        count++;
        if (count === images.length) {
          setLoaded(true);
          requestAnimationFrame(() => drawAt(canvasRef.current, 0));
        }
      };
      img.onerror = () => console.error(`Failed to load frame ${i}:`, src);
      img.src = src;
      imagesRef.current[i] = img;
    });
  }, [images, drawAt]);

  // ── Resize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const idx = mobile.current ? currentFrame.current : frameIdx.current;
      drawAt(canvasRef.current, idx);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawAt]);

  if (hidden) return null;

  const progress = totalFrames > 1 ? (displayFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div className={`sf-wrap${fadeOut ? ' sf-fadeout' : ''}`}>
      <div className="sf-sticky">
        <canvas ref={canvasRef} className="sf-canvas sf-canvas--base" />

        {!loaded && (
          <div className="sf-loader">
            <div className="sf-loader-bar" />
            <p className="sf-loader-text">Loading frames…</p>
          </div>
        )}

        <div className="sf-vignette" />

        <div className="sf-hud">
          <div className="sf-progress" style={{ width: `${progress}%` }} />
          <div className="sf-counter">
            {String(displayFrame + 1).padStart(2, '0')}
            <span className="sf-counter-sep"> / </span>
            {String(totalFrames).padStart(2, '0')}
          </div>
          <div className={`sf-hint${hintVisible ? '' : ' sf-hint--hidden'}`}>
            <span>SCROLL TO PLAY</span>
            <div className="sf-arrow" />
          </div>
        </div>
      </div>

      <div className="sf-spacer" />
    </div>
  );
};

export default ScrollFilm;