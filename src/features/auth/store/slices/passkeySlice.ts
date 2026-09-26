import { createSlice } from '@reduxjs/toolkit';
import type { PasskeysState } from '../../models/passkeys';
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
  reducers: {},
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

export default passkeySlice.reducer;
