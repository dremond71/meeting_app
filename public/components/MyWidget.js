import { isIOSDevice } from './ios_helper.js';

export default {
  name: 'MyWidget',
  components: {},
  template: `
<div v-bind:class="theClassValues" align="center" >
  <div>
      <img src="./components/icons/screenShareIcon.png" v-if="isSharingScreen"></src>
      <video v-if="isNotSharingScreen" v-bind:id="connectedItem.id" v-bind:muted="connectedItem.isMe" v-bind:inCarouselMode="carouselMode" v-bind:playsinline="isAnIOSDevice"></video>
      <div class="w3-center"> {{ userName }} </div>
      <div class="w3-bar w3-center">
        <div>       
          <i v-bind:class="audioIconClass" ></i>
          <i v-bind:class="videoIconClass" ></i>
          <i>{{ sharingText}}</i>
        </div>   
      </div>
  </div>   
</div>`,
  props: ['connectedItem', 'carouselMode'],
  mounted() {
    this.mounted = true;
    this.setVideoSrc();
  },
  data: function () {
    return {
      mounted: false,
      videoMetaDataListener: undefined,
    };
  },
  computed: {
    theClassValues() {
      if (this.$store.getters.connected.length <= 2) {
        // there is 1 person (me) OR
        // there are 2 people: me and another person.
        // if only me, my widget in video grid should take up entire screen.
        // if me and 1 other person, I will be in carousel, and the only other
        // person gets full screen
        return 'w3-col m6 w3-margin';
      } else {
        return 'w3-col m3 w3-margin';
      }
    },

    isAnIOSDevice() {
      return isIOSDevice();
    },
    sharingText() {
      this.setVideoSrc();
      // return empty string
      // we are using this computed function to
      // trigger a change to the video element
      return this.connectedItem.sharing || this.connectedItem.sharingUUID
        ? ''
        : '';
    },
    userName() {
      return this.connectedItem.userName;
    },
    audioIconClass() {
      return this.connectedItem.audioEnabled
        ? 'bi bi-mic-fill'
        : 'bi-mic-mute-fill';
    },

    videoIconClass() {
      return this.connectedItem.videoEnabled
        ? 'bi bi-camera-video-fill'
        : 'bi bi-camera-video-off-fill';
    },
    isSharingScreen() {
      return this.connectedItem.sharing;
    },
    isNotSharingScreen() {
      return !this.connectedItem.sharing;
    },
  },
  methods: {
    setVideoSrc() {
      if (this.mounted) {
        // find the video element in the DOM
        const theVideoElement = document.getElementById(this.connectedItem.id);

        // attach a stream to the video element
        theVideoElement.srcObject = this.connectedItem.stream;

        // create a handler function for the video element
        const handler = () => {
          theVideoElement.play();
        };

        // remove the previous handler if any
        if (this.videoMetaDataListener) {
          theVideoElement.removeEventListener(
            'loadedmetadata',
            this.videoMetaDataListener
          );
          this.videoMetaDataListener = undefined;
        }

        // keep a reference to the handler function for possible deletion later
        this.videoMetaDataListener = handler;

        // attach the handler function to the video element
        theVideoElement.addEventListener('loadedmetadata', handler);
      }
    },
  },
};
