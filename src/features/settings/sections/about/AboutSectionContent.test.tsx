import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../../../test';
import { mockStaticAsset } from '../../../../test/helpers/staticAsset';
import AboutSectionContent from './AboutSectionContent';
import { ABOUT_SECTION_CONSTANTS as ABOUT } from './constants';

const { LABELS, LICENSES_LIST } = ABOUT;

const PACKAGES = [
  { name: 'react', version: '19.0.0', license: 'MIT' },
  { name: 'antd', version: '6.0.0', license: 'MIT' },
];

describe('about settings', () => {
  it('shows the version and the third-party licenses', async () => {
    mockStaticAsset(LICENSES_LIST.JSON_URL, PACKAGES);

    renderApp(<AboutSectionContent />);

    expect(screen.getByText('0.0.0-test')).toBeInTheDocument();
    expect(await screen.findByText('react')).toBeInTheDocument();
    expect(screen.getByText('antd')).toBeInTheDocument();
  });

  it('filters the licenses by package name and says when nothing matches', async () => {
    mockStaticAsset(LICENSES_LIST.JSON_URL, PACKAGES);
    const { user } = renderApp(<AboutSectionContent />);
    await screen.findByText('react');
    const search = screen.getByPlaceholderText(LABELS.LICENSES_SEARCH_PLACEHOLDER);

    await user.type(search, 'an');
    await waitFor(() => expect(screen.queryByText('react')).not.toBeInTheDocument());
    expect(screen.getByText('antd')).toBeInTheDocument();

    await user.type(search, 'zzz');
    expect(await screen.findByText(LABELS.LICENSES_EMPTY)).toBeInTheDocument();
  });

  it('says so when the license list cannot be read', async () => {
    mockStaticAsset(LICENSES_LIST.JSON_URL, {}, 500);

    renderApp(<AboutSectionContent />);

    expect(await screen.findByText(LABELS.LICENSES_LOAD_ERROR)).toBeInTheDocument();
  });
});
