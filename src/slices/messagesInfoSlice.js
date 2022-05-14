import { createSlice } from '@reduxjs/toolkit';

import { setInitialState } from './channelsInfoSlice.js';

const messagesInfoSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, { payload: { messages } }) => ({
      messages: [...messages],
    }));
  },
});

export default messagesInfoSlice.reducer;
