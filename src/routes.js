// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
  login: () => [host, prefix, 'login'].join('/'),
  data: () => [host, prefix, 'data'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
};
