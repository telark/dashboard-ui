import { PayloadAction } from '@reduxjs/toolkit';
import type { PasskeysState, Passkey } from '../../../features/auth/models/passkeys';

export const handleFetchPasskeysPending = (state: PasskeysState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchPasskeysFulfilled = (
  state: PasskeysState,
  action: PayloadAction<Passkey[]>,
) => {
  state.loading = false;
  state.passkeys = action.payload;
  state.error = null;
};

export const handleFetchPasskeysRejected = (
  state: PasskeysState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleFetchPasskeyDetailsPending = (state: PasskeysState) => {
  state.loading = true;
  state.details = null; // Clear details on new fetch
  state.error = null;
};

export const handleFetchPasskeyDetailsFulfilled = (
  state: PasskeysState,
  action: PayloadAction<Passkey>,
) => {
  state.loading = false;
  const updatedPasskey = action.payload;
  state.details = updatedPasskey; // Populate details with fresh data

  // Also update the passkey in the list if it exists
  const index = state.passkeys.findIndex((p) => p.credentialId === updatedPasskey.credentialId);
  if (index !== -1) {
    state.passkeys[index] = updatedPasskey;
  }
};

export const handleFetchPasskeyDetailsRejected = (
  state: PasskeysState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
