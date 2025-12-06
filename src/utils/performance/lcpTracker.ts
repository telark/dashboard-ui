import type { LCPMetric } from 'web-vitals';

interface ReactFiber {
  elementType?: { name?: string; displayName?: string };
  type?: { name?: string; displayName?: string };
  _debugSource?: { fileName?: string; lineNumber?: number };
  return?: ReactFiber;
}

interface ComponentInfo {
  componentName: string;
  filePath: string;
  lineNumber?: number;
  depth: number;
}

const FILE_PATH_REGEX = /^.*\/src\//;
const MAX_DEPTH = 20;
const MAX_PARENT_COMPONENTS = 6;
const SEPARATOR = '='.repeat(80);

const FIBER_KEYS = ['__reactFiber$', '__reactInternalInstance$'];

function getReactFiber(element: HTMLElement): ReactFiber | null {
  for (const key in element) {
    if (FIBER_KEYS.some((prefix) => key.startsWith(prefix))) {
      return (element as any)[key];
    }
  }
  return null;
}

function getComponentName(fiber: ReactFiber): string | null {
  return (
    fiber.elementType?.displayName ||
    fiber.elementType?.name ||
    fiber.type?.displayName ||
    fiber.type?.name ||
    null
  );
}

function getComponentInfo(fiber: ReactFiber | null): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  let currentFiber = fiber;
  let depth = 0;

  while (currentFiber && depth < MAX_DEPTH) {
    const componentName = getComponentName(currentFiber);
    const debugSource = currentFiber._debugSource;

    if (componentName && componentName !== 'Anonymous') {
      const filePath = debugSource?.fileName || 'unknown';
      components.push({
        componentName,
        filePath: filePath.replace(FILE_PATH_REGEX, 'src/'),
        lineNumber: debugSource?.lineNumber,
        depth,
      });
    }

    currentFiber = currentFiber.return || null;
    depth++;
  }

  return components;
}

function formatFilePath(filePath: string, lineNumber?: number): string {
  return lineNumber ? `${filePath}:${lineNumber}` : filePath;
}

function getElementSelector(element: HTMLElement): string {
  const parts: string[] = [element.tagName.toLowerCase()];
  if (element.id) parts.push(`#${element.id}`);
  if (element.className) {
    const classes = element.className.split(' ').filter(Boolean).slice(0, 3).join('.');
    if (classes) parts.push(`.${classes}`);
  }
  return parts.join('');
}

function getElementContent(element: HTMLElement): string {
  if (element.tagName === 'IMG') {
    return `<img src="${(element as HTMLImageElement).src.slice(0, 80)}...">`;
  }
  const text = element.textContent?.trim().slice(0, 100);
  return text ? `"${text}..."` : element.outerHTML.slice(0, 100);
}

function getRating(value: number): string {
  if (value <= 2500) return '✅ GOOD';
  if (value <= 4000) return '⚠️ NEEDS IMPROVEMENT';
  return '❌ POOR';
}

function logOptimizationTips(isImage: boolean): void {
  console.log(`\n%c💡 Optimization Tips:`, 'color: #14b8a6; font-weight: bold');
  if (isImage) {
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
}

export function trackLCPComponent(metric: LCPMetric): void {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries;
  const lcpEntry = entries?.[entries.length - 1];

  if (!lcpEntry?.element) {
    console.log(`%c[LCP Performance] ${metric.value.toFixed(0)}ms`, 'color: #10b981; font-weight: bold; font-size: 14px');
    console.log('⚠️ No LCP element found');
    return;
  }

  const lcpElement = lcpEntry.element as HTMLElement;
  const components = getComponentInfo(getReactFiber(lcpElement));
  const selector = getElementSelector(lcpElement);
  const content = getElementContent(lcpElement);
  const rating = getRating(metric.value);
  const isImage = lcpElement.tagName === 'IMG';

  console.log(`\n${SEPARATOR}`);
  console.log(`%c🎯 LARGEST CONTENTFUL PAINT (LCP) DETECTED`, 'color: #10b981; font-weight: bold; font-size: 16px');
  console.log(SEPARATOR);
  console.log(`%c⏱️  LCP Time: ${metric.value.toFixed(0)}ms`, 'color: #3b82f6; font-weight: bold; font-size: 14px');
  console.log(`%c📊 Rating: ${rating}`, 'color: #6366f1; font-weight: bold');
  console.log(`\n%c🔍 DOM Element:`, 'color: #f59e0b; font-weight: bold');
  console.log(`   Selector: ${selector}`);
  console.log(`   Content: ${content}`);
  console.log('   Element:', lcpElement);

  if (components.length > 0) {
    const primaryComponent = components[0];
    console.log(`\n%c⚛️  React Component Tree (${components.length} components):`, 'color: #8b5cf6; font-weight: bold');
    console.log(`%c   🎯 Primary: ${primaryComponent.componentName}`, 'color: #ec4899; font-weight: bold; font-size: 13px');
    console.log(`      📁 ${formatFilePath(primaryComponent.filePath, primaryComponent.lineNumber)}`);

    if (components.length > 1) {
      console.log(`\n   📦 Parent Components:`);
      const parents = components.slice(1, MAX_PARENT_COMPONENTS + 1);
      parents.forEach((comp, index) => {
        const indent = '      ' + '  '.repeat(index);
        console.log(`${indent}↳ ${comp.componentName}`);
        console.log(`${indent}  📁 ${formatFilePath(comp.filePath, comp.lineNumber)}`);
      });
      if (components.length > MAX_PARENT_COMPONENTS + 1) {
        console.log(`      ... and ${components.length - MAX_PARENT_COMPONENTS - 1} more parent components`);
      }
    }
  } else {
    console.log(`\n%c⚠️  Could not map to React component`, 'color: #ef4444; font-weight: bold');
    console.log('   This might be a static HTML element or non-React content');
  }

  logOptimizationTips(isImage);

  if (metric.value > 2500) {
    console.log(`\n%c⚡ Action Required:`, 'color: #ef4444; font-weight: bold');
    console.log(`   LCP is ${(metric.value - 2500).toFixed(0)}ms over the "good" threshold (2500ms)`);
    console.log(`   Focus optimization on: ${components[0]?.componentName || selector}`);
  }

  console.log(`${SEPARATOR}\n`);

  if (components.length > 0) {
    console.groupCollapsed('📋 Full Component Tree Details');
    components.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.componentName}`);
      console.log(`   File: ${comp.filePath}`);
      if (comp.lineNumber) console.log(`   Line: ${comp.lineNumber}`);
      console.log(`   Depth: ${comp.depth}`);
    });
    console.groupEnd();
  }
}

export function trackLCPCandidates(metric: LCPMetric): void {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries;
  if (!entries || entries.length <= 1) return;

  console.groupCollapsed(`🔄 LCP Candidates (${entries.length} detected)`);
  entries.forEach((entry, index) => {
    if (entry.element) {
      const element = entry.element as HTMLElement;
      const components = getComponentInfo(getReactFiber(element));
      const componentName = components[0]?.componentName || 'Unknown';
      console.log(`${index + 1}. ${entry.renderTime.toFixed(0)}ms - ${componentName} (${getElementSelector(element)})`);
    }
  });
  console.groupEnd();
}
