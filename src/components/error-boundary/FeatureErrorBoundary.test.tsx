import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, FEATURE_ERROR_BOUNDARY_TEXT as T } from '../../constants';
import { clickButton, renderApp, currentLocation } from '../../test';
import { FeatureErrorBoundary } from '.';

const FEATURE = 'Roles';

const Flaky = () => {
  const [broken] = useState(() => sessionStorage.getItem('broken') !== 'fixed');
  if (broken) throw new Error('render failed');
  return <div>feature content</div>;
};

const renderBoundary = (route = '/roles') =>
  renderApp(
    <FeatureErrorBoundary featureName={FEATURE}>
      <Flaky />
    </FeatureErrorBoundary>,
    { route },
  );

describe('feature error boundary', () => {
  it('names the feature that crashed', () => {
    renderBoundary();

    expect(screen.getByText(T.TITLE(FEATURE))).toBeInTheDocument();
    expect(screen.getByText(T.DESCRIPTION)).toBeInTheDocument();
  });

  it('renders the feature again on Try Again', async () => {
    const { user } = renderBoundary();
    sessionStorage.setItem('broken', 'fixed');

    await clickButton(user, T.TRY_AGAIN);

    expect(await screen.findByText('feature content')).toBeInTheDocument();
  });

  it('leaves for the home page', async () => {
    const { user } = renderBoundary();

    await clickButton(user, T.GO_TO_DASHBOARD);

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
  });
});
