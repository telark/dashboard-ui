import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { ActionConfirmModal } from '../../../../components/display/modal';
import { GRANT_CONFIRM as T } from '../constants/grantConfirm';
import { grantConfirmCopy, type GrantConfirmCopy } from '../utils/grants';

interface PendingGrant extends GrantConfirmCopy {
  open: boolean;
  release?: () => void;
}

interface UseGrantConfirmReturn {
  /** Runs `save` at once, or after the confirm when the roles grant Owner or Admin. */
  confirmGrant: (roleIds: string[], name: string, save: () => Promise<void>) => Promise<void>;
  modal: React.ReactNode;
}

export const useGrantConfirm = (offsetRight?: number): UseGrantConfirmReturn => {
  const roles = useSelector((state: RootState) => state.roles.roles);
  // The copy outlives `open`, so the text doesn't change under the closing animation.
  const [pending, setPending] = useState<PendingGrant | null>(null);

  // Cancel drops the pending save unsettled: the panel stays open with its selection, saving nothing.
  const confirmGrant = useCallback(
    (roleIds: string[], name: string, save: () => Promise<void>): Promise<void> => {
      const copy = grantConfirmCopy(
        roles.filter((role) => roleIds.includes(role.id)),
        name,
      );
      if (!copy) return save();
      return new Promise((resolve) => {
        setPending({ ...copy, open: true, release: () => resolve(save()) });
      });
    },
    [roles],
  );

  const modal = (
    <ActionConfirmModal
      open={pending?.open ?? false}
      onClose={() => setPending((prev) => prev && { ...prev, open: false, release: undefined })}
      onConfirm={() => pending?.release?.()}
      title={pending?.title ?? ''}
      action={pending?.action ?? ''}
      resourceName=""
      customMessage={pending?.body}
      cancelText={T.CANCEL}
      getContainer={() => document.body}
      offsetRight={offsetRight}
    />
  );

  return { confirmGrant, modal };
};
