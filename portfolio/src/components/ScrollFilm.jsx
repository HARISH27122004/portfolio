import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/ScrollFilm.css';

const SCROLL_THRESHOLD = 40; // px of scroll = 1 frame step

const ScrollFilm = ({ images = [], onComplete }) => {
  const canvasRef    = useRef(null);
  const imagesRef    = useRef([]);
  const frameIdx     = useRef(0);
  const scrollAccum  = useRef(0); // accumulated scroll delta

  const [displayFrame, setDisplayFrame] = useState(0);
  const [loaded,       setLoaded]       = useState(false);
  const [hintVisible,  setHintVisible]  = useState(true);
  const [fadeOut,      setFadeOut]      = useState(false);
  const [hidden,       setHidden]       = useState(false);

  const totalFrames = images.length;

  // ── Draw a frame onto the canvas ───────────────────────────────────────────
  const drawTo = useCallback((canvas, idx) => {
    const img = imagesRef.current[idx];
    if (!canvas || !img || !img.complete) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const ctx   = canvas.getContext('2d');
    const cAR   = W / H;
    const iAR   = img.naturalWidth / img.naturalHeight;
    let dW, dH;
    if (cAR > iAR) { dW = W; dH = W / iAR; }
    else            { dH = H; dW = H * iAR; }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, (W - dW) / 2, (H - dH) / 2, dW, dH);
  }, []);

  // ── Trigger complete sequence ──────────────────────────────────────────────
  const triggerComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 900);
  }, [onComplete]);

  // ── Scroll handler: accumulate → step frames manually ─────────────────────
  const onWheel = useCallback((e) => {
    if (fadeOut || hidden) return;
    e.preventDefault(); // prevent page scroll while film is active

    setHintVisible(false);

    scrollAccum.current += e.deltaY;

    // Step forward frames
    while (scrollAccum.current >= SCROLL_THRESHOLD) {
      scrollAccum.current -= SCROLL_THRESHOLD;
      const next = frameIdx.current + 1;
      if (next >= totalFrames) {
        frameIdx.current = totalFrames - 1;
        drawTo(canvasRef.current, frameIdx.current);
        setDisplayFrame(frameIdx.current);
        triggerComplete();
        return;
      }
      frameIdx.current = next;
      drawTo(canvasRef.current, next);
      setDisplayFrame(next);
    }

    // Step backward frames
    while (scrollAccum.current <= -SCROLL_THRESHOLD) {
      scrollAccum.current += SCROLL_THRESHOLD;
      const prev = frameIdx.current - 1;
      if (prev < 0) {
        frameIdx.current = 0;
        scrollAccum.current = 0;
        return;
      }
      frameIdx.current = prev;
      drawTo(canvasRef.current, prev);
      setDisplayFrame(prev);
    }
  }, [fadeOut, hidden, totalFrames, drawTo, triggerComplete]);

  // ── Touch support ──────────────────────────────────────────────────────────
  const touchStartY = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (touchStartY.current === null || fadeOut || hidden) return;
    e.preventDefault();
    const deltaY = touchStartY.current - e.touches[0].clientY; // invert: drag up = forward
    touchStartY.current = e.touches[0].clientY;

    scrollAccum.current += deltaY;

    while (scrollAccum.current >= SCROLL_THRESHOLD) {
      scrollAccum.current -= SCROLL_THRESHOLD;
      const next = frameIdx.current + 1;
      if (next >= totalFrames) {
        frameIdx.current = totalFrames - 1;
        drawTo(canvasRef.current, frameIdx.current);
        setDisplayFrame(frameIdx.current);
        triggerComplete();
        return;
      }
      frameIdx.current = next;
      drawTo(canvasRef.current, next);
      setDisplayFrame(next);
    }

    while (scrollAccum.current <= -SCROLL_THRESHOLD) {
      scrollAccum.current += SCROLL_THRESHOLD;
      const prev = frameIdx.current - 1;
      if (prev < 0) { frameIdx.current = 0; scrollAccum.current = 0; return; }
      frameIdx.current = prev;
      drawTo(canvasRef.current, prev);
      setDisplayFrame(prev);
    }
  }, [fadeOut, hidden, totalFrames, drawTo, triggerComplete]);

  // ── Preload images ─────────────────────────────────────────────────────────
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
          requestAnimationFrame(() => drawTo(canvasRef.current, 0));
        }
      };
      img.onerror = () => console.error(`Failed to load frame ${i}:`, src);
      img.src = src;
      imagesRef.current[i] = img;
    });
  }, [images, drawTo]);

  // ── Attach wheel + touch listeners (passive: false to allow preventDefault) 
  useEffect(() => {
    const el = window;
    el.addEventListener('wheel',      onWheel,      { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    return () => {
      el.removeEventListener('wheel',      onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
    };
  }, [onWheel, onTouchStart, onTouchMove]);

  // ── Resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => drawTo(canvasRef.current, frameIdx.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawTo]);

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

      {/* Spacer only needed if you want the page to be scrollable underneath */}
      <div className="sf-spacer" />
    </div>
  );
};

export default ScrollFilm;