import Clock from './Clock.js';
import ConnectedBadge from './ConnectedBadge.js';
import ChatNotifier from './ChatNotifier.js';

export default {
  name: 'NavBar',
  components: {
    Clock,
    ChatNotifier,
    ConnectedBadge,
  },
  template: `
    <div class="w3-bar w3-black">
      <Clock></Clock>
      <ChatNotifier></ChatNotifier>
      <ConnectedBadge></ConnectedBadge>
    </div>`,
};
