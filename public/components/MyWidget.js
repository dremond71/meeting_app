export default {
    name: 'MyWidget',
    components: {
    },
    template: `
<div class="w3-col m3 w3-margin" >
  <div>
      <img src="./components/icons/screenShareIcon.png" v-if="isSharingScreen"></src>
      <video v-if="isNotSharingScreen" v-bind:id="connectedItem.id" v-bind:muted="connectedItem.isMe" v-bind:inCarouselMode="carouselMode"></video>
      <div class="w3-bar w3-center">
        <div>
          <i v-bind:class="audioIconClass" ></i>
          <i v-bind:class="videoIconClass" ></i>
          <i>{{ sharingText}}</i>
        </div>
       
        
      </div>
  </div>   
</div>`,
props: ['connectedItem','carouselMode'],
mounted () {
   this.mounted = true;
   this.setVideoSrc();
},
data: function () {
  return {
    mounted: false,
    videoMetaDataListener: undefined
  }
},
computed: {

      sharingText() {
          this.setVideoSrc();
          // return empty string
          // we are using this computed function to
          // trigger a change to the video element
          return this.connectedItem.sharing ? '' : ''
      },

      audioIconClass () {
        return  this.connectedItem.audioEnabled ? 'bi bi-mic-fill'  : 'bi-mic-mute-fill' ; 
    },

    videoIconClass () {
       
        return  this.connectedItem.videoEnabled ? 'bi bi-camera-video-fill' : 'bi bi-camera-video-off-fill' ; 
    },    
    isSharingScreen() {
      return this.connectedItem.sharing;
    },
    isNotSharingScreen() {
      return !this.connectedItem.sharing;
    },

},
methods : {
   setVideoSrc() {

    if (this.mounted){

      // find the video element in the DOM
      const theVideoElement = document.getElementById(this.connectedItem.id);
      
      // attach a stream to the video element
      theVideoElement.srcObject = this.connectedItem.stream;
      
      // create a handler function for the video element
      const handler = () => {
        theVideoElement.play();
      };

      // remove the previous handler if any
      if (this.videoMetaDataListener){
        theVideoElement.removeEventListener('loadedmetadata', this.videoMetaDataListener );
        this.videoMetaDataListener = undefined;
      }

      // keep a reference to the handler function for possible deletion later
      this.videoMetaDataListener = handler;

      // attach the handler function to the video element
      theVideoElement.addEventListener('loadedmetadata', handler );
    }

   }
}  
}