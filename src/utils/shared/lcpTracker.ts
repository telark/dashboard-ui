import type { LCPMetric } from 'web-vitals';

interface ReactFiber {
  elementType?: {
    name?: string;
    displayName?: string;
  };
  type?: {
    name?: string;
    displayName?: string;
  };
  _debugSource?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  _debugOwner?: ReactFiber;
  return?: ReactFiber;
  stateNode?: HTMLElement;
}

interface ComponentInfo {
  componentName: string;
  filePath: string;
  lineNumber?: number;
  renderTime?: number;
  depth: number;
}

/**
 * Get React Fiber from DOM element
 */
function getReactFiber(element: HTMLElement): ReactFiber | null {
  const keys = Object.keys(element);
  const fiberKey = keys.find(
    (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'),
  );
  if (fiberKey) {
    return (element as any)[fiberKey];
  }
  return null;
}

/**
 * Extract component info from React Fiber
 */
function getComponentInfo(fiber: ReactFiber | null, depth: number = 0): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  let currentFiber = fiber;

  while (currentFiber && depth < 20) {
    const componentName =
      currentFiber.elementType?.displayName ||
      currentFiber.elementType?.name ||
      currentFiber.type?.displayName ||
      currentFiber.type?.name;

    const debugSource = currentFiber._debugSource;

    if (componentName && componentName !== 'Anonymous') {
      const filePath = debugSource?.fileName || 'unknown';
      const cleanFilePath = filePath.replace(/^.*\/src\//, 'src/');

      components.push({
        componentName,
        filePath: cleanFilePath,
        lineNumber: debugSource?.lineNumber,
        depth,
      });
    }

    currentFiber = currentFiber.return || null;
    depth++;
  }

  return components;
}

/**
 * Get all parent components leading to the LCP element
 */
function getComponentTree(element: HTMLElement): ComponentInfo[] {
  const fiber = getReactFiber(element);
  if (!fiber) {
    return [];
  }
  return getComponentInfo(fiber);
}

/**
 * Format file path for display
 */
function formatFilePath(filePath: string, lineNumber?: number): string {
  if (lineNumber) {
    return `${filePath}:${lineNumber}`;
  }
  return filePath;
}

/**
 * Get element selector for debugging
 */
function getElementSelector(element: HTMLElement): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className
    ? `.${element.className.split(' ').filter(Boolean).slice(0, 3).join('.')}`
    : '';
  return `${tag}${id}${classes}`;
}

/**
 * Get element content preview
 */
function getElementContent(element: HTMLElement): string {
  if (element.tagName === 'IMG') {
    return `<img src="${(element as HTMLImageElement).src.slice(0, 80)}...">`;
  }
  const text = element.textContent?.trim().slice(0, 100) || '';
  return text ? `"${text}..."` : element.outerHTML.slice(0, 100);
}

/**
 * Measure and log LCP with React component mapping
 */
export function trackLCPComponent(metric: LCPMetric) {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries || [];
  const lcpEntry = entries[entries.length - 1];

  if (!lcpEntry || !lcpEntry.element) {
    console.log(
      `%c[LCP Performance] ${metric.value.toFixed(0)}ms`,
      'color: #10b981; font-weight: bold; font-size: 14px',
    );
    console.log('⚠️ No LCP element found');
    return;
  }

  const lcpElement = lcpEntry.element as HTMLElement;
  const components = getComponentTree(lcpElement);
  const selector = getElementSelector(lcpElement);
  const content = getElementContent(lcpElement);

  console.log('\n' + '='.repeat(80));
  console.log(
    `%c🎯 LARGEST CONTENTFUL PAINT (LCP) DETECTED`,
    'color: #10b981; font-weight: bold; font-size: 16px',
  );
  console.log('='.repeat(80));

  console.log(
    `%c⏱️  LCP Time: ${metric.value.toFixed(0)}ms`,
    'color: #3b82f6; font-weight: bold; font-size: 14px',
  );

  const rating = metric.value <= 2500 ? '✅ GOOD' : metric.value <= 4000 ? '⚠️ NEEDS IMPROVEMENT' : '❌ POOR';
  console.log(`%c📊 Rating: ${rating}`, 'color: #6366f1; font-weight: bold');

  console.log(`\n%c🔍 DOM Element:`, 'color: #f59e0b; font-weight: bold');
  console.log(`   Selector: ${selector}`);
  console.log(`   Content: ${content}`);
  console.log('   Element:', lcpElement);

  if (components.length > 0) {
    console.log(`\n%c⚛️  React Component Tree (${components.length} components):`, 'color: #8b5cf6; font-weight: bold');
    
    const primaryComponent = components[0];
    console.log(
      `%c   🎯 Primary: ${primaryComponent.componentName}`,
      'color: #ec4899; font-weight: bold; font-size: 13px',
    );
    console.log(`      📁 ${formatFilePath(primaryComponent.filePath, primaryComponent.lineNumber)}`);

    if (components.length > 1) {
      console.log(`\n   📦 Parent Components:`);
      components.slice(1, 6).forEach((comp, index) => {
        const indent = '      ' + '  '.repeat(index);
        console.log(`${indent}↳ ${comp.componentName}`);
        console.log(`${indent}  📁 ${formatFilePath(comp.filePath, comp.lineNumber)}`);
      });

      if (components.length > 6) {
        console.log(`      ... and ${components.length - 6} more parent components`);
      }
    }
  } else {
    console.log(`\n%c⚠️  Could not map to React component`, 'color: #ef4444; font-weight: bold');
    console.log('   This might be a static HTML element or non-React content');
  }

  console.log(`\n%c💡 Optimization Tips:`, 'color: #14b8a6; font-weight: bold');
  
  if (lcpElement.tagName === 'IMG') {
    console.log('   • This is an image - consider:');
    console.log('     - Adding width/height attributes to prevent layout shift');
    console.log('     - Using next-gen formats (WebP, AVIF)');
    console.log('     - Lazy loading with priority for above-fold images');
    console.log('     - Optimizing image size and compression');
  } else {
    console.log('   • This is a text/content element - consider:');
    console.log('     - Reducing time to first byte (TTFB)');
    console.log('     - Minimizing render-blocking resources');
    console.log('     - Using font-display: swap for web fonts');
    console.log('     - Reducing JavaScript blocking main thread');
  }

  if (metric.value > 2500) {
    console.log(`\n%c⚡ Action Required:`, 'color: #ef4444; font-weight: bold');
    console.log(`   LCP is ${(metric.value - 2500).toFixed(0)}ms over the "good" threshold (2500ms)`);
    console.log(`   Focus optimization on: ${components[0]?.componentName || selector}`);
  }

  console.log('='.repeat(80) + '\n');

  if (components.length > 0) {
    console.groupCollapsed('📋 Full Component Tree Details');
    components.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.componentName}`);
      console.log(`   File: ${comp.filePath}`);
      if (comp.lineNumber) {
        console.log(`   Line: ${comp.lineNumber}`);
      }
      console.log(`   Depth: ${comp.depth}`);
    });
    console.groupEnd();
  }
}

/**
 * Track multiple LCP candidates
 */
export function trackLCPCandidates(metric: LCPMetric) {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries || [];
  
  if (entries.length > 1) {
    console.groupCollapsed(`🔄 LCP Candidates (${entries.length} detected)`);
    
    entries.forEach((entry, index) => {
      if (entry.element) {
        const element = entry.element as HTMLElement;
        const selector = getElementSelector(element);
        const components = getComponentTree(element);
        const componentName = components[0]?.componentName || 'Unknown';
        
        console.log(
          `${index + 1}. ${entry.renderTime.toFixed(0)}ms - ${componentName} (${selector})`,
        );
      }
    });
    
    console.groupEnd();
  }
}

