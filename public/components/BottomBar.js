import MyAudioButton from './MyAudioButton.js';
import MyVideoButton from './MyVideoButton.js';
import MyShareButton from './MyShareButton.js';
import MyPostDebugDataButton from './MyPostDebugDataButton.js';

/**
 * NOTE: Close Button that executes 'window.close()' is not allowed
 *       in Chrome unless the script actually opened it.
 */
export default {
  name: 'BottomBar',
  components: {
    MyAudioButton,
    MyVideoButton,
    MyShareButton,
    MyPostDebugDataButton,
  },
  template: `
<div class="w3-bar w3-center w3-blue w3-padding" style="position: fixed; bottom: 0; width: 100%;">
  <MyPostDebugDataButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyPostDebugDataButton>
  <MyAudioButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyAudioButton>
  <MyVideoButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyVideoButton>
  <MyShareButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyShareButton>
</div>`,
  computed: {
    myConnectionExists() {
      return this.$store.getters.myConnectedItem ? true : false;
    },

    myConnection() {
      return this.$store.getters.myConnectedItem;
    },
  },
};
