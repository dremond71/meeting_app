export default {
  name: 'ShareScreen',
  components: {},
  template: `
<div class="w3-center" style="background-color:#f0f0f0;">
    <p class="w3-center">{{whoIsSharing}}</p>
       <video id="shared"></video>
       <p>  </p>
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
    };
  },
  computed: {
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
