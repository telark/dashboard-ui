import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TIME_REMAINING, TIME_TEXTS } from '../../../constants';
import { renderApp } from '../../../test';
import TimeRemaining from './TimeRemaining';

const NOW = Date.parse('2026-01-15T12:00:00Z');

const after = (ms: number) => new Date(NOW + ms).toISOString();

describe('time remaining', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'], now: NOW });
  });

  afterEach(() => vi.useRealTimers());

  it.each([
    [45_000, `45${TIME_REMAINING.UNIT_SECOND}`],
    [30 * 60_000, `30${TIME_REMAINING.UNIT_MINUTE}`],
    [2 * 3_600_000, `2${TIME_REMAINING.UNIT_HOUR}`],
    [3 * 86_400_000, `3${TIME_REMAINING.UNIT_DAY}`],
  ])('shows what is left of %i ms', (ms, label) => {
    renderApp(<TimeRemaining date={after(ms)} prefix="Ends in" />);

    expect(screen.getByText(`Ends in ${label}`)).toBeInTheDocument();
  });

  it('says when it has already ended', () => {
    renderApp(<TimeRemaining date={after(-60_000)} endedPrefix="Ended" />);

    expect(screen.getByText(/^Ended/)).toBeInTheDocument();
  });

  it('reports an unreadable date', () => {
    renderApp(<TimeRemaining date="not a date" />);

    expect(screen.getByText(TIME_TEXTS.INVALID_DATE)).toBeInTheDocument();
  });
});
