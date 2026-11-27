import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../../../test';
import PanelThemePrewarm from './PanelThemePrewarm';

describe('panel theme prewarm', () => {
  it('renders the panel controls after a while, hidden from assistive tech', async () => {
    renderApp(<PanelThemePrewarm />);

    expect(await screen.findByRole('switch', { hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
