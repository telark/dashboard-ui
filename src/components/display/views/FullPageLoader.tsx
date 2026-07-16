import React from 'react';
import { FancySpinner } from '../../animation';

interface FullPageLoaderProps {
  label?: string;
  /** Defaults to filling whatever container it's placed in. */
  minHeight?: string | number;
}

/**
 * The one loading state for a full page or route boundary. Every screen using
 * this — instead of its own centered-spinner div — changes look and feel from
 * a single place, and two of these can never stack into the double-spinner
 * glitch a nested Suspense boundary would otherwise produce.
 */
const FullPageLoader: React.FC<FullPageLoaderProps> = ({ label, minHeight = '100%' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight,
      width: '100%',
    }}
  >
    <FancySpinner label={label} showLabel={Boolean(label)} size={32} />
  </div>
);

export default FullPageLoader;
