import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import Rename from './RenameChannel.jsx';

const modals = {
  addChannel: AddChannel,
  removeChannel: RemoveChannel,
  renameChannel: Rename,
};

export default (modalName) => modals[modalName];
