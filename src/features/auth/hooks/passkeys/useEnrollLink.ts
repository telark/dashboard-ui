import { useCallback, useState } from 'react';
import { App as AntdApp } from 'antd';
import { createEnrollLink } from '../../clients';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { APP_ROUTES } from '../../../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';

export interface UseEnrollLinkResult {
  enrollUrl: string | null;
  enrollLoading: boolean;
  createLink: () => Promise<void>;
  clearLink: () => void;
}

export const useEnrollLink = (): UseEnrollLinkResult => {
  const { message } = AntdApp.useApp();
  const [enrollUrl, setEnrollUrl] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const createLink = useCallback(async () => {
    setEnrollLoading(true);
    try {
      const { token } = await createEnrollLink();
      const query = `${REGISTER_CONSTANTS.QUERY.ENROLL}=${encodeURIComponent(token)}`;
      setEnrollUrl(`${globalThis.location.origin}${APP_ROUTES.REGISTER}?${query}`);
    } catch (error) {
      if (isDevelopment()) {
        logger.error(PPC.LOGS.FAILED_TO_CREATE_ENROLL_LINK, error);
      }
      message.error(PPC.ENROLL.CREATE_FAILED);
    } finally {
      setEnrollLoading(false);
    }
  }, [message]);

  const clearLink = useCallback(() => setEnrollUrl(null), []);

  return { enrollUrl, enrollLoading, createLink, clearLink };
};
