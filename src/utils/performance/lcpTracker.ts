import type { LCPMetric } from 'web-vitals';
import logger from '../../logging';

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
      return (element as unknown as Record<string, ReactFiber>)[key];
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
  logger.info('💡 Optimization Tips:');
  if (isImage) {
    logger.info('• This is an image - consider:');
    logger.info('- Adding width/height attributes to prevent layout shift');
    logger.info('- Using next-gen formats (WebP, AVIF)');
    logger.info('- Lazy loading with priority for above-fold images');
    logger.info('- Optimizing image size and compression');
  } else {
    logger.info('• This is a text/content element - consider:');
    logger.info('- Reducing time to first byte (TTFB)');
    logger.info('- Minimizing render-blocking resources');
    logger.info('- Using font-display: swap for web fonts');
    logger.info('- Reducing JavaScript blocking main thread');
  }
}

export function trackLCPComponent(metric: LCPMetric): void {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries;
  const lcpEntry = entries?.[entries.length - 1];

  if (!lcpEntry?.element) {
    logger.info(`[LCP Performance] ${metric.value.toFixed(0)}ms`);
    logger.warn('⚠️ No LCP element found');
    return;
  }

  const lcpElement = lcpEntry.element as HTMLElement;
  const components = getComponentInfo(getReactFiber(lcpElement));
  const selector = getElementSelector(lcpElement);
  const content = getElementContent(lcpElement);
  const rating = getRating(metric.value);
  const isImage = lcpElement.tagName === 'IMG';

  logger.info(`${SEPARATOR}`);
  logger.info('Largest Contentful Paint (LCP) Detected');
  logger.info(SEPARATOR);
  logger.info(`LCP Time: ${metric.value.toFixed(0)}ms`);
  logger.info(`Rating: ${rating}`);
  logger.info('DOM Element:');
  logger.info(`Selector: ${selector}`);
  logger.info(`Content: ${content}`);
  logger.debug('Element:', lcpElement);

  if (components.length > 0) {
    const primaryComponent = components[0];
    logger.info(`React Component Tree (${components.length} components):`);
    logger.info(`Primary: ${primaryComponent.componentName}`);
    logger.info(`      ${formatFilePath(primaryComponent.filePath, primaryComponent.lineNumber)}`);

    if (components.length > 1) {
      logger.info('Parent Components:');
      const parents = components.slice(1, MAX_PARENT_COMPONENTS + 1);
      parents.forEach((comp, index) => {
        const indent = '      ' + '  '.repeat(index);
        logger.info(`${indent}↳ ${comp.componentName}`);
        logger.info(`${indent}  📁 ${formatFilePath(comp.filePath, comp.lineNumber)}`);
      });
      if (components.length > MAX_PARENT_COMPONENTS + 1) {
        logger.info(
          `      ... and ${components.length - MAX_PARENT_COMPONENTS - 1} more parent components`,
        );
      }
    }
  } else {
    logger.warn('Could not map to React component');
    logger.info('This might be a static HTML element or non-React content');
  }

  logOptimizationTips(isImage);

  if (metric.value > 2500) {
    logger.warn('Action Required:');
    logger.warn(`LCP is ${(metric.value - 2500).toFixed(0)}ms over the "good" threshold (2500ms)`);
    logger.warn(`Focus optimization on: ${components[0]?.componentName || selector}`);
  }

  logger.info(`${SEPARATOR}`);

  if (components.length > 0) {
    logger.debug('Full Component Tree Details:');
    components.forEach((comp, index) => {
      logger.debug(`${index + 1}. ${comp.componentName}`);
      logger.debug(`File: ${comp.filePath}`);
      if (comp.lineNumber) logger.debug(`Line: ${comp.lineNumber}`);
      logger.debug(`Depth: ${comp.depth}`);
    });
  }
}

export function trackLCPCandidates(metric: LCPMetric): void {
  if (process.env.NODE_ENV !== 'development') return;

  const entries = metric.entries;
  if (!entries || entries.length <= 1) return;

  logger.debug(`🔄 LCP Candidates (${entries.length} detected):`);
  entries.forEach((entry, index) => {
    if (entry.element) {
      const element = entry.element as HTMLElement;
      const components = getComponentInfo(getReactFiber(element));
      const componentName = components[0]?.componentName || 'Unknown';
      logger.debug(
        `${index + 1}. ${entry.renderTime.toFixed(0)}ms - ${componentName} (${getElementSelector(element)})`,
      );
    }
  });
}
