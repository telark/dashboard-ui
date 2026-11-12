import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { permissionsSeed, renderApp, type StoreSeed } from '../../../../test';
import { signIn } from '../../../../test/helpers/session';
import { SCOPE_LABELS } from '../../../../components/shared';
import { AUTH_PERMISSIONS_LABELS as LABELS } from '../../../auth/constants';
import { denyRuleSentence } from '../../../access-and-permissions/roles/constants';
import { MyPermissionsSectionContent } from '.';

const scopeRoles = (level: string, rules: string[] = [], scope = 'applications'): StoreSeed =>
  ({
    permissions: {
      ready: true,
      userID: 'user-1',
      scopeIndex: { applications: { level, rules } },
      roles: [
        {
          roleID: 'role-1',
          roleName: 'release_reviewer',
          status: 'Active',
          priority: 1,
          isExpired: false,
          sources: [{ kind: 'inherited', groupName: 'platform' }],
          scopes: [{ scope, level, rules }],
        },
      ],
    },
  }) as never;

describe('my permissions settings', () => {
  it('tells users without roles to ask for access', async () => {
    renderApp(<MyPermissionsSectionContent />, {
      seed: { permissions: { ready: true, userID: 'user-1', roles: [], scopeIndex: {} } },
    });

    expect(await screen.findByText(LABELS.NO_PERMISSIONS_TITLE)).toBeInTheDocument();
  });

  it('shows full access for the bootstrap account', async () => {
    signIn({ bootstrap: true });

    renderApp(<MyPermissionsSectionContent />, { seed: permissionsSeed() });

    expect(await screen.findByText(LABELS.FULL_ACCESS_TITLE)).toBeInTheDocument();
  });

  it('lists the level, the source and the deny rules of each scope', async () => {
    const deny = 'applications.deleteapplication.deny';

    renderApp(<MyPermissionsSectionContent />, { seed: scopeRoles('Contributor', [deny]) });

    expect(await screen.findByText(LABELS.EFFECTIVE_PERMISSIONS_TITLE)).toBeInTheDocument();
    expect(screen.getByText(SCOPE_LABELS.applications)).toBeInTheDocument();
    expect(screen.getByText('Contributor')).toBeInTheDocument();
    expect(screen.getByText(LABELS.SOURCE_INHERITED('platform'))).toBeInTheDocument();
    expect(screen.getByText(denyRuleSentence(deny))).toBeInTheDocument();
  });

  it('shows an all-scopes grant first', async () => {
    renderApp(<MyPermissionsSectionContent />, { seed: scopeRoles('Admin', [], 'ALL') });

    expect(await screen.findByText(LABELS.ALL_SCOPES_TITLE)).toBeInTheDocument();
  });
});
