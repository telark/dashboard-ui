import { persistor } from '../../../../store/persistor';
import { clearNotificationsCache } from '../../../notifications';

// Persisted slices hold the previous user's directory and cluster data; the next browser user must not read them.
export const purgeLocalUserData = async (): Promise<void> => {
  clearNotificationsCache();
  await persistor.purge();
};
