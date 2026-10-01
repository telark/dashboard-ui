import { useCallback, useState } from 'react';
import { App as AntdApp } from 'antd';
import { createEnrollLink } from '../../clients';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { buildEnrollUrl } from '../../utils/flow/register';
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
      setEnrollUrl(buildEnrollUrl(token));
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
