export const enableViewTransitions = () => {
  if ('startViewTransition' in document && typeof document.startViewTransition === 'function') {
    return true;
  }
  return false;
};

export const withViewTransition = (callback: () => void) => {
  if (enableViewTransitions() && document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
};

export const addViewTransitionStyles = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'view-transition-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 0.15s;
    }

    @media (prefers-reduced-motion: reduce) {
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 0.01s;
      }
    }

    html.transitioning {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
};

export const optimizeScrollRestoration = () => {
  if (typeof window === 'undefined') return;

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
};

export const smoothScrollToTop = (duration: number = 150) => {
  const start = window.pageYOffset;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, start * (1 - easeOut));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const initNavigationOptimizations = () => {
  addViewTransitionStyles();
  optimizeScrollRestoration();

  if (process.env.NODE_ENV === 'development') {
    console.log('[Navigation] View Transitions supported:', enableViewTransitions());
  }
};

