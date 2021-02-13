export default {
  name: 'MyShareButton',
  components: {},
  template: `
    <button v-if="show" class="w3-button w3-round-xxlarge  w3-light-blue w3-margin-left" v-on:click="toggleSharing"  v-bind:disabled="isDisabled">{{ sharingButtonText}} </button>
    `,
  props: ['connectedItem'],
  computed: {
    isMobile() {
      // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    show() {
      return !this.isMobile;
    },
    sharingButtonText() {
      return this.connectedItem.sharing ? 'Stop Sharing' : 'Share Screen';
    },
    isDisabled() {
      // don't allow sharing unless there are 2 people
      if (this.$store.getters.connected.length < 2) return true;

      const personSharing = this.$store.getters.somebodySharing;
      let value = false;
      if (personSharing) {
        if (!personSharing.isMe) {
          value = true;
        }
      }
      return value;
    },
  },
  methods: {
    async toggleSharing() {
      if (this.connectedItem.sharing) {
        this.$store.dispatch('stopSharing');
      } else {
        await this.startCapture();
      }
    },
    async startCapture() {
      let captureStream = null;

      const gdmOptions = {
        video: {
          cursor: 'always',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(
          gdmOptions
        );
        this.$store.dispatch('startSharing', captureStream);
        console.log('');
      } catch (err) {
        console.error('Error: ' + err);
      }
    },
  },
};
