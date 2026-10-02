import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App as AntdApp } from 'antd';
import type { AppDispatch, RootState } from '../../../../../store';
import type { ExtendedAxiosError } from '../../../../../api/client/normalize';
import { HTTP_STATUS } from '../../../../../constants';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';
import { buildEnrollUrl, getCurrentUser } from '../../../../auth/utils';
import { useHasRoleAboveCaller } from '../../../roles/hooks';
import { createUserEnrollLink, revokeUserEnrollLink } from '../../clients';
import { fetchAllUsersSilentThunk } from '../../store';
import { USERS_CONSTANTS as UC } from '../../constants';
import { getEffectiveRoleRefs } from '../../utils';
import type { User } from '../../models';

const C = UC.LABELS.ENROLL_LINK;
const MANAGE = ACTION_PERMISSIONS.users.manageEnrollLinks;

const REFUSALS: Partial<Record<number, string>> = {
  [HTTP_STATUS.NOT_FOUND]: C.REFUSED.NOT_FOUND,
  [HTTP_STATUS.CONFLICT]: C.REFUSED.SUSPENDED,
  [HTTP_STATUS.GONE]: C.REFUSED.DELETING,
};

// Other 403s keep the server's reason: the level cap names the level and scope it hit.
const refusalMessage = (error: unknown, fallback: string): string => {
  const meta = (error as ExtendedAxiosError | undefined)?.normalized;
  const byStatus = meta?.status ? REFUSALS[meta.status] : undefined;
  if (byStatus) return byStatus;
  if (!meta?.isForbidden) return fallback;
  return meta.message.includes(UC.PATTERNS.ENROLL_LINK_RECOVERY)
    ? C.REFUSED.RECOVERY
    : meta.message;
};

interface BlockInputs {
  canManage: boolean;
  isSelf: boolean;
  aboveCaller: boolean;
}

// The refusals the row can tell on its own; auth still checks every one of them.
const blockReason = (target: User, { canManage, isSelf, aboveCaller }: BlockInputs) => {
  if (!canManage) return C.BLOCKED.NO_PERMISSION;
  if (isSelf) return C.BLOCKED.SELF;
  if (target.bootstrap) return UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP;
  if (aboveCaller) return C.BLOCKED.ABOVE_CALLER;
  return undefined;
};

export const useUserEnrollLink = (target: User) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  const canManage = usePermission(MANAGE.scope, MANAGE.level);
  const groups = useSelector((state: RootState) => state.groups.groups);
  const aboveCaller = useHasRoleAboveCaller()(getEffectiveRoleRefs(target, groups));
  const isSelf = target.id === getCurrentUser()?.id;

  // The URL holds the token, so closing the dialog drops it; the expiry stays for the fade-out.
  const [url, setUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const create = useCallback(async () => {
    try {
      const link = await createUserEnrollLink(target.id);
      setUrl(buildEnrollUrl(link.token, target.email));
      setExpiresAt(link.expiresAt);
      dispatch(fetchAllUsersSilentThunk());
    } catch (error) {
      message.error(refusalMessage(error, C.CREATE_FAILED));
    }
  }, [target.id, target.email, dispatch, message]);

  const revoke = useCallback(async () => {
    setRevoking(true);
    try {
      await revokeUserEnrollLink(target.id);
      message.success(C.REVOKED);
      dispatch(fetchAllUsersSilentThunk());
    } catch (error) {
      message.error(refusalMessage(error, C.REVOKE_FAILED));
    } finally {
      setRevoking(false);
    }
  }, [target.id, dispatch, message]);

  const closeLink = useCallback(() => setUrl(null), []);
  const openRevoke = useCallback(() => setRevokeOpen(true), []);
  const closeRevoke = useCallback(() => setRevokeOpen(false), []);

  return {
    blocked: blockReason(target, { canManage, isSelf, aboveCaller }),
    createBlocked: target.status.phase === 'suspended' ? C.BLOCKED.SUSPENDED : undefined,
    revokeBlocked: target.status.invite ? undefined : C.BLOCKED.NO_INVITE,
    url,
    expiresAt,
    create,
    closeLink,
    revoke,
    revoking,
    revokeOpen,
    openRevoke,
    closeRevoke,
  };
};
