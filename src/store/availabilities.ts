import { Availability } from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

import { IDLE, PENDING, ERROR, SUCCESS } from './stateMachine';

const initialState: { loading: string } = {
  loading: IDLE,
};

export const getAvailabilities = createAsyncThunk(
  'getAvailabilities',
  async (practitionerId: number) => {
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/availabilities?practitionerId=${practitionerId}`,
      {
        method: 'GET',
      },
    );
    const parsedResponse = await response.json();
    return parsedResponse as Availability[];
  },
);

export const deleteAvailabilities = createAsyncThunk(
  'deleteAvailabilities',
  async (id: number) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/availabilities`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    const parsedResponse = await response.json();
    return parsedResponse as Availability[];
  },
);

const availabilitiesAdapter = createEntityAdapter<Availability>({
  sortComparer: (a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
});

export const availabilitiesSelectors = availabilitiesAdapter.getSelectors();

const availabilitiesSlice = createSlice({
  name: 'availabilities',
  initialState: availabilitiesAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAvailabilities.pending, (state) => {
      state.loading = PENDING;
    });
    builder.addCase(getAvailabilities.fulfilled, (state, action) => {
      availabilitiesAdapter.setAll(state, action.payload);
      state.loading = SUCCESS;
    });
    builder.addCase(getAvailabilities.rejected, (state) => {
      state.loading = ERROR;
    });
    builder.addCase(deleteAvailabilities.fulfilled, () => {
      availabilitiesAdapter.removeOne;
    });
  },
});

export default availabilitiesSlice;
