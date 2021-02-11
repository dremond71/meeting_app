export default {
  name: 'MyAudioButton',
  components: {},
  template: `
<button class="w3-button w3-round-xxlarge  w3-light-blue w3-margin-left" v-on:click="toggleAudio">{{ audioButtonText}} <i v-bind:class="audioIconClass"></i> </button>
 
`,
  props: ['connectedItem'],
  computed: {
    audioButtonText() {
      return this.connectedItem.audioEnabled ? 'Mic (on)' : 'Mic (off)';
    },
    audioIconClass() {
      return this.connectedItem.audioEnabled
        ? 'bi bi-mic-fill'
        : 'bi-mic-mute-fill';
    },
  },
  methods: {
    getAudioTrack() {
      return this.connectedItem.stream.getAudioTracks()[0];
    },

    updateAudioMutedInStore(data) {
      this.$store.dispatch('updateAudioMuted', data);
    },

    toggleAudio() {
      //
      // I can only affect the enabled state of my stream on my end, not anyone else's.
      // The toggle button is disabled if this widget is for someone else.
      //
      const audioTrack = this.getAudioTrack();
      audioTrack.enabled = !audioTrack.enabled;

      // update the store with the enabled state of my audio
      this.updateAudioMutedInStore({
        id: this.connectedItem.id,
        enabled: audioTrack.enabled,
      });

      // send signal to other participants that I muted/unmuted my audio track
      if (!audioTrack.enabled) {
        socket.emit(
          'muted-audio',
          this.connectedItem.roomId,
          this.connectedItem.id
        );
      } else {
        socket.emit(
          'unmuted-audio',
          this.connectedItem.roomId,
          this.connectedItem.id
        );
      }
    },
  },
};
