import { createSlice } from '@reduxjs/toolkit';
import { setInitialState, removeChannel } from './channelsInfoSlice.js';

const messagesInfoSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, { payload: { messages } }) => ({
      messages: [...messages],
    }));
    builder.addCase(removeChannel, (state, { payload: { id } }) => {
      /* eslint-disable no-param-reassign */
      state.messages = state.messages.filter(({ channelId }) => (channelId !== id));
    });
  },
});

export const { addMessage } = messagesInfoSlice.actions;
export default messagesInfoSlice.reducer;
