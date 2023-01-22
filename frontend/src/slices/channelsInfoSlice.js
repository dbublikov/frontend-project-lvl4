import { createSlice } from '@reduxjs/toolkit';

const channelsInfoSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setInitialState: (state, { payload: { channels, currentChannelId } }) => ({
      channels: [...channels],
      currentChannelId,
    }),
    setCurrentChannelId: (state, { payload: { id } }) => {
      /* eslint-disable no-param-reassign */
      state.currentChannelId = id;
    },
    addChannel: (state, { payload: { channel } }) => {
      state.channels.push(channel);
      state.currentChannelId = channel.id;
    },
    removeChannel: (state, { payload: { id } }) => {
      state.channels = state.channels.filter((channel) => (channel.id !== id));
      state.currentChannelId = 1;
    },
    renameChannel: (state, { payload: { id, name } }) => {
      const channel = state.channels.find((ch) => (ch.id === id));
      channel.name = name;
    },
  },
});

export const {
  setInitialState, setCurrentChannelId, addChannel, removeChannel, renameChannel,
} = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
