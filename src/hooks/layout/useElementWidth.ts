import { useLayoutEffect, useRef, useState } from 'react';

// The sidebar changes the space a toolbar has without changing the viewport, so
// width has to be measured on the element rather than through a media query.
export const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  // Measured in a layout effect so the first paint already uses the real width;
  // a ResizeObserver alone reports a frame late and the layout visibly jumps.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const next = element.getBoundingClientRect().width;
      // A hidden (display: none) tab reports 0; keeping the last width lets it reappear already laid out.
      if (next > 0) setWidth(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
};
