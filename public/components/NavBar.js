import Clock from './Clock.js';
import ConnectedBadge from './ConnectedBadge.js';
export default {
  name: 'NavBar',
  components: {
    Clock,
    ConnectedBadge,
  },
  template: `
    <div class="w3-bar w3-black">
      <Clock></Clock>
      <ConnectedBadge></ConnectedBadge>
    </div>`,
};
