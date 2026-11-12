import type { ComponentProps } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderApp, clickButton } from '../../../../test';
import ActionConfirmModal from './ActionConfirmModal';

const renderModal = (overrides: Partial<ComponentProps<typeof ActionConfirmModal>> = {}) => {
  const onClose = vi.fn();
  const onConfirm = vi.fn(async () => undefined);
  const view = renderApp(
    <ActionConfirmModal
      open
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete role"
      action="delete"
      resourceName="release_reviewer"
      {...overrides}
    />,
  );
  return { ...view, onClose, onConfirm };
};

describe('action confirmation modal', () => {
  it('asks about the named resource and confirms, then closes', async () => {
    const { user, onConfirm, onClose } = renderModal({
      resourceType: 'role',
      note: 'Members lose access.',
    });

    expect(screen.getByRole('dialog', { name: 'Delete role' })).toHaveTextContent(
      'release_reviewer',
    );
    expect(screen.getByText('Members lose access.')).toBeInTheDocument();
    await clickButton(user, 'delete');

    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does nothing on cancel but close', async () => {
    const { user, onConfirm, onClose } = renderModal({ confirmText: 'Remove' });

    await clickButton(user, 'Cancel');

    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('shows a custom message instead of the default sentence', () => {
    renderModal({ customMessage: <em>Custom body</em> });

    expect(screen.getByText('Custom body')).toBeInTheDocument();
  });

  it('keeps Confirm off when disabled', () => {
    renderModal({ confirmDisabled: true });

    expect(screen.getByRole('button', { name: 'delete' })).toBeDisabled();
  });

  it('shows nothing when closed', () => {
    renderModal({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
