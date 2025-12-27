import { useEffect, useRef, useState } from 'react';

const BottomScrollSync = ({ forRef }) => {
  const barRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const el = forRef?.current;
    const bar = barRef.current;
    if (!el || !bar) return;

    const syncFromMain = () => {
      bar.scrollLeft = el.scrollLeft;
      setContentWidth(Math.max(el.scrollWidth, el.clientWidth));
    };
    const syncFromBar = () => {
      el.scrollLeft = bar.scrollLeft;
    };
    const measure = () => syncFromMain();

    el.addEventListener('scroll', syncFromMain);
    bar.addEventListener('scroll', syncFromBar);
    window.addEventListener('resize', measure);
    syncFromMain();
    return () => {
      el.removeEventListener('scroll', syncFromMain);
      bar.removeEventListener('scroll', syncFromBar);
      window.removeEventListener('resize', measure);
    };
  }, [forRef?.current]);

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full bg-dark-surface/60 backdrop-blur-sm border-t border-dark-border z-40">
      <div ref={barRef} className="overflow-x-auto">
        <div style={{ width: contentWidth, height: 16 }} />
      </div>
    </div>
  );
};

export default BottomScrollSync;
