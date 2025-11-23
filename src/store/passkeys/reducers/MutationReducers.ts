import { PayloadAction } from '@reduxjs/toolkit';
import type { PasskeysState, Passkey } from '../../../features/auth/models/passkeys';

export const handleCreatePasskeyPending = (state: PasskeysState) => {
  state.loading = true;
  state.error = null;
};

export const handleCreatePasskeyFulfilled = (
  state: PasskeysState,
  action: PayloadAction<Passkey>,
) => {
  state.loading = false;
  state.passkeys.push(action.payload);
  state.error = null;
};

export const handleCreatePasskeyRejected = (
  state: PasskeysState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleUpdatePasskeyPending = (state: PasskeysState) => {
  state.loading = true;
  state.error = null;
};

export const handleUpdatePasskeyFulfilled = (
  state: PasskeysState,
  action: PayloadAction<Passkey>,
) => {
  state.loading = false;
  const updatedPasskey = action.payload;

  // Update in list
  const index = state.passkeys.findIndex((p) => p.credentialId === updatedPasskey.credentialId);
  if (index !== -1) {
    state.passkeys[index] = updatedPasskey;
  }

  // Update details if it's the same passkey
  if (state.details?.credentialId === updatedPasskey.credentialId) {
    state.details = updatedPasskey;
  }

  state.error = null;
};

export const handleUpdatePasskeyRejected = (
  state: PasskeysState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleDeletePasskeyPending = (state: PasskeysState) => {
  state.loading = true;
  state.error = null;
};

export const handleDeletePasskeyFulfilled = (
  state: PasskeysState,
  action: PayloadAction<string>,
) => {
  state.loading = false;
  state.passkeys = state.passkeys.filter((p) => p.credentialId !== action.payload);

  // Clear details if it's the deleted passkey
  if (state.details?.credentialId === action.payload) {
    state.details = null;
  }

  state.error = null;
};

export const handleDeletePasskeyRejected = (
  state: PasskeysState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
