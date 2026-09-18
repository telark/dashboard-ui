import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PasskeysState, Passkey } from '../../models/passkeys';
import {
  fetchAllPasskeysThunk,
  fetchAllPasskeysSilentThunk,
  fetchPasskeyDetailsThunk,
} from '../thunks/fetchThunks';
import {
  createPasskeyThunk,
  updatePasskeyThunk,
  deletePasskeyThunk,
} from '../thunks/mutationThunks';
import {
  handleFetchPasskeysPending,
  handleFetchPasskeysFulfilled,
  handleFetchPasskeysRejected,
  handleFetchPasskeyDetailsPending,
  handleFetchPasskeyDetailsFulfilled,
  handleFetchPasskeyDetailsRejected,
} from '../reducers/fetchReducers';
import {
  handleCreatePasskeyPending,
  handleCreatePasskeyFulfilled,
  handleCreatePasskeyRejected,
  handleUpdatePasskeyPending,
  handleUpdatePasskeyFulfilled,
  handleUpdatePasskeyRejected,
  handleDeletePasskeyPending,
  handleDeletePasskeyFulfilled,
  handleDeletePasskeyRejected,
} from '../reducers/mutationReducers';

const initialState: PasskeysState = {
  passkeys: [],
  details: null,
  loading: false,
  error: null,
};

const passkeySlice = createSlice({
  name: 'passkeys',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null; // Clear previous details to avoid stale data
    },
    // Keep these actions for backward compatibility with existing code
    addPasskey: (state, action: PayloadAction<Passkey>) => {
      state.passkeys.push(action.payload);
    },
    updatePasskey: (state, action: PayloadAction<Passkey>) => {
      const index = state.passkeys.findIndex((p) => p.credentialId === action.payload.credentialId);
      if (index !== -1) {
        state.passkeys[index] = action.payload;
      }
    },
    deletePasskey: (state, action: PayloadAction<string>) => {
      state.passkeys = state.passkeys.filter((p) => p.credentialId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPasskeysThunk.pending, handleFetchPasskeysPending)
      .addCase(fetchAllPasskeysThunk.fulfilled, handleFetchPasskeysFulfilled)
      .addCase(fetchAllPasskeysThunk.rejected, handleFetchPasskeysRejected)
      // Fetch all passkeys (silent) - only handle fulfilled, skip pending/rejected to avoid UI updates
      .addCase(fetchAllPasskeysSilentThunk.fulfilled, handleFetchPasskeysFulfilled)
      .addCase(fetchPasskeyDetailsThunk.pending, handleFetchPasskeyDetailsPending)
      .addCase(fetchPasskeyDetailsThunk.fulfilled, handleFetchPasskeyDetailsFulfilled)
      .addCase(fetchPasskeyDetailsThunk.rejected, handleFetchPasskeyDetailsRejected)
      .addCase(createPasskeyThunk.pending, handleCreatePasskeyPending)
      .addCase(createPasskeyThunk.fulfilled, handleCreatePasskeyFulfilled)
      .addCase(createPasskeyThunk.rejected, handleCreatePasskeyRejected)
      .addCase(updatePasskeyThunk.pending, handleUpdatePasskeyPending)
      .addCase(updatePasskeyThunk.fulfilled, handleUpdatePasskeyFulfilled)
      .addCase(updatePasskeyThunk.rejected, handleUpdatePasskeyRejected)
      .addCase(deletePasskeyThunk.pending, handleDeletePasskeyPending)
      .addCase(deletePasskeyThunk.fulfilled, handleDeletePasskeyFulfilled)
      .addCase(deletePasskeyThunk.rejected, handleDeletePasskeyRejected);
  },
});

export const { clearDetails, addPasskey, updatePasskey, deletePasskey } = passkeySlice.actions;

export default passkeySlice.reducer;
