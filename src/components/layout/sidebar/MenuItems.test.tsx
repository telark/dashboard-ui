import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MENU_LABELS, NEW_TAG_TEXT, SIDEBAR_LAYOUT } from '../../../constants';
import { renderApp } from '../../../test';
import MenuItems from './MenuItems';

const CATEGORIES_NAME = `${MENU_LABELS.CATEGORIES}, ${NEW_TAG_TEXT}`;

describe('MenuItems', () => {
  it('shows the New tag on Categories only', () => {
    renderApp(<MenuItems />);

    const tag = screen.getByText(NEW_TAG_TEXT);
    const categories = screen.getByRole('button', { name: CATEGORIES_NAME });
    expect(tag).toBeVisible();
    expect(within(categories).getByText(NEW_TAG_TEXT)).toBe(tag);
  });

  it('hides the New tag on the collapsed rail', () => {
    renderApp(<MenuItems isCollapsed />);

    expect(screen.getByText(NEW_TAG_TEXT)).not.toBeVisible();
  });

  it('leaves the New tag off the phone rail', () => {
    const matchMedia = globalThis.matchMedia;
    vi.spyOn(globalThis, 'matchMedia').mockImplementation((query) => ({
      ...matchMedia(query),
      matches: query === SIDEBAR_LAYOUT.FORCE_COLLAPSE_QUERY,
    }));
    renderApp(<MenuItems isCollapsed />);

    expect(screen.queryByText(NEW_TAG_TEXT)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: MENU_LABELS.CATEGORIES })).toBeInTheDocument();
  });

  it.each([
    ['expanded, with its tag', false, CATEGORIES_NAME],
    ['collapsed, without the hidden tag', true, MENU_LABELS.CATEGORIES],
  ])('names Categories %s, and no other item', (_state, isCollapsed, name) => {
    renderApp(<MenuItems isCollapsed={isCollapsed} />);

    expect(screen.getByRole('button', { name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: MENU_LABELS.ROLES })).toBeInTheDocument();
  });
});
