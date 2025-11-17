// Only export pages that are not lazy-loaded in AppRoutes.tsx
// Pages that are lazy-loaded should be imported directly to enable code splitting
export { default as Startup } from './analyze/Startup';
export { default as Welcome } from './analyze/Welcome';
