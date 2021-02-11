export default {
  name: 'MyVideoButton',
  components: {},
  template: `
<button class="w3-button w3-round-xxlarge  w3-light-blue w3-margin-left" v-on:click="toggleVideo">{{ videoButtonText}} <i v-bind:class="videoIconClass"></i> </button>
 
`,
  props: ['connectedItem'],
  computed: {
    videoButtonText() {
      return this.connectedItem.videoEnabled ? 'Camera (on)' : 'Camera (off)';
    },
    videoIconClass() {
      return this.connectedItem.videoEnabled
        ? 'bi bi-camera-video-fill'
        : 'bi bi-camera-video-off-fill';
    },
  },
  methods: {
    getVideoTrack() {
      return this.connectedItem.stream.getVideoTracks()[0];
    },

    updateVideoMutedInStore(data) {
      this.$store.dispatch('updateVideoMuted', data);
    },

    toggleVideo() {
      const videoTrack = this.getVideoTrack();
      videoTrack.enabled = !videoTrack.enabled;
      // update the store with the enabled state of my video
      this.updateVideoMutedInStore({
        id: this.connectedItem.id,
        enabled: videoTrack.enabled,
      });

      // send signal to other participants that I muted/unmuted my video track
      if (!videoTrack.enabled) {
        socket.emit(
          'muted-video',
          this.connectedItem.roomId,
          this.connectedItem.id
        );
      } else {
        socket.emit(
          'unmuted-video',
          this.connectedItem.roomId,
          this.connectedItem.id
        );
      }
    },
  },
};
