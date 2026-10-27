import { authenticateWithPasskey, extractLoginOptions } from '../../auth/utils';
import { finishAssertion, startAssertion } from '../clients/bootstrap';
import type { BootstrapAction, BootstrapRequestResult } from '../models/bootstrap';

// A fresh, user-verified passkey assertion over this request and this action: no session is created or used.
export const decideRequest = async (
  requestId: string,
  action: BootstrapAction,
): Promise<BootstrapRequestResult> => {
  const options = extractLoginOptions(await startAssertion(requestId, action));
  const credential = await authenticateWithPasskey(options);
  return await finishAssertion(requestId, action, credential);
};
