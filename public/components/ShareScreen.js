import { isIOSDevice } from './ios_helper.js';

export default {
  name: 'ShareScreen',
  components: {},
  template: `
<div class="w3-center w3-light-blue">
    <p align="center"><b>{{whoIsSharing}}</b></p>
    <table align="center">
     <tr>
       <td>Zoom Contols:</td><td><button class="w3-button w3-round-xxlarge w3-blue" v-on:click="zoomIn">+</button></td><td><button class="w3-button w3-round-xxlarge w3-blue" v-on:click="zoomOut">-</button></td><td><button class="w3-button w3-round-xxlarge w3-blue" v-on:click="resetZoom">Reset</button></td>
     </tr>
    </table>
    <div style="overflow:auto;height:100%;width:100%;align-content:center;">
        <video id="shared" v-bind:playsinline="isAnIOSDevice" v-bind:style="zoomStyle"></video>
    </div>
    <p style="height:100px;">  </p>
</div>
`,
  mounted() {
    this.setVideoSrc();
  },
  props: ['connectedItem'],
  data: function () {
    return {
      mounted: false,
      videoMetaDataListener: undefined,
      originalZoom: 75,
      zoom: 75,
      zoomFactor: 10,
    };
  },
  computed: {
    zoomStyle() {
      return `height:${this.zoom}%;width:${this.zoom}%;margin:0;padding:0;`;
    },
    isAnIOSDevice() {
      return isIOSDevice();
    },
    whoIsSharing() {
      return this.connectedItem.isMe
        ? `I am sharing`
        : `${this.connectedItem.userName} is sharing`;
    },
    heightWidthStyle() {
      return 'height:50%;width:50%;margin:0;padding:0;';
    },
  },
  methods: {
    resetZoom() {
      this.zoom = this.originalZoom;
    },
    zoomIn() {
      this.zoom += this.zoomFactor;
    },
    zoomOut() {
      if (this.zoom - this.zoomFactor > 0) {
        this.zoom -= this.zoomFactor;
      }
    },
    setVideoSrc() {
      if (this.connectedItem) {
        // find the video element in the DOM
        const theVideoElement = document.getElementById('shared');
        if (theVideoElement) {
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
      }
    },
  },
};
