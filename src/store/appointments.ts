import { Appointment } from '@prisma/client';
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

export const getAppointments = createAsyncThunk('getAppointments', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
    method: 'GET',
  });
  const parsedResponse = await response.json();
  return parsedResponse as Appointment[];
});

export const postAppointments = createAsyncThunk(
  'postAppointments',
  async (data: any) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const parsedResponse = await response.json();
    return parsedResponse as Appointment;
  },
);

export const deleteAppointments = createAsyncThunk(
  'deleteAppointments',
  async (id: number) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    const parsedResponse = await response.json();
    return parsedResponse as Appointment;
  },
);

const appointmentsAdapter = createEntityAdapter<Appointment>({
  sortComparer: (a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
});

export const appointmentsSelectors = appointmentsAdapter.getSelectors();

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: appointmentsAdapter.getInitialState({
    ...initialState,
    error: null,
    snackbar: null,
    snackbarDelete: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppointments.pending, (state) => {
      state.loading = PENDING;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.setAll(state, action.payload);
      state.error = null;
      state.loading = SUCCESS;
    });
    builder.addCase(getAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = ERROR;
    });
    builder.addCase(postAppointments.fulfilled, (state) => {
      appointmentsAdapter.addOne;
      state.snackbar = 'SUCCESS';
    });
    builder.addCase(postAppointments.pending, (state) => {
      state.snackbar = null;
    });
    builder.addCase(deleteAppointments.fulfilled, (state) => {
      appointmentsAdapter.removeOne;
      state.snackbarDelete = 'SUCCESS';
    });
    builder.addCase(deleteAppointments.pending, (state) => {
      state.snackbarDelete = null;
    });
  },
});

export default appointmentsSlice;
