import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

type PerformanceMetricName = 'CLS' | 'FCP' | 'LCP' | 'TTFB';

interface PerformanceThresholds {
  good: number;
  needsImprovement: number;
}

const THRESHOLDS: Record<PerformanceMetricName, PerformanceThresholds> = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

const getRating = (
  name: PerformanceMetricName,
  value: number,
): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

const logMetric = (metric: Metric) => {
  const rating = getRating(metric.name as PerformanceMetricName, metric.value);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
    });
  }
};

export const initPerformanceMonitoring = () => {
  onCLS(logMetric);
  onFCP(logMetric);
  onLCP(logMetric);
  onTTFB(logMetric);

  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navTiming = navEntries[0] as PerformanceNavigationTiming;

        const pageLoadTime = navTiming.loadEventEnd - navTiming.fetchStart;
        const connectTime = navTiming.responseEnd - navTiming.requestStart;
        const renderTime = navTiming.domComplete - navTiming.domInteractive;
        const dnsTime = navTiming.domainLookupEnd - navTiming.domainLookupStart;

        if (process.env.NODE_ENV === 'development') {
          console.log('[Performance] Page Load Metrics:', {
            pageLoadTime: `${Math.round(pageLoadTime)}ms`,
            connectTime: `${Math.round(connectTime)}ms`,
            renderTime: `${Math.round(renderTime)}ms`,
            dnsTime: `${Math.round(dnsTime)}ms`,
          });
        }
      }
    });
  }
};

export const measureRender = (componentName: string) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.log(`[Performance] ${componentName} render time: ${duration.toFixed(2)}ms`);
    }
  };
};

export const markMilestone = (name: string) => {
  if (typeof window !== 'undefined' && typeof window.performance?.mark === 'function') {
    performance.mark(name);
  }
};

export const measureBetween = (name: string, startMark: string, endMark: string) => {
  if (typeof window !== 'undefined' && typeof window.performance?.measure === 'function') {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      }

      return measure.duration;
    } catch {
      return null;
    }
  }
  return null;
};
