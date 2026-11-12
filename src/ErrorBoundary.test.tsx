import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const Broken = () => {
  throw new Error('render failed');
};

describe('error boundary', () => {
  it('shows its children while they render', () => {
    render(
      <ErrorBoundary>
        <div>page content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('shows the crash screen when a child throws', () => {
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Page/ })).toBeInTheDocument();
  });
});
