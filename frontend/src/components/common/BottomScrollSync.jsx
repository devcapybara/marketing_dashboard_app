import { useEffect, useRef, useState } from 'react';

const BottomScrollSync = ({ forRef, containerRef, offsetBottom = 8 }) => {
  const barRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const el = forRef?.current;
    const bar = barRef.current;
    if (!el || !bar) return;

    const syncFromMain = () => {
      bar.scrollLeft = el.scrollLeft;
      setContentWidth(el.scrollWidth);
      setViewportWidth(el.clientWidth);
    };
    const syncFromBar = () => {
      el.scrollLeft = bar.scrollLeft;
    };
    const measure = () => {
      const rect = containerRef?.current?.getBoundingClientRect();
      if (rect) {
        setLeft(rect.left);
        setViewportWidth(rect.width);
      }
    };
    el.addEventListener('scroll', syncFromMain);
    bar.addEventListener('scroll', syncFromBar);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    syncFromMain();
    measure();
    return () => {
      el.removeEventListener('scroll', syncFromMain);
      bar.removeEventListener('scroll', syncFromBar);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [forRef?.current, containerRef?.current]);

  return (
    <div style={{ position: 'fixed', bottom: offsetBottom, left, width: viewportWidth }} className="bg-dark-surface/60 backdrop-blur-sm z-40">
      <div ref={barRef} className="overflow-x-auto">
        <div style={{ width: contentWidth, height: 16 }} />
      </div>
    </div>
  );
};

export default BottomScrollSync;
