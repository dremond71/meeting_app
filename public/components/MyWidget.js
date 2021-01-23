export default {
    name: 'MyWidget',
    components: {
    },
    template: `
<div class="w3-col m3 w3-margin" >
  <div>
      <video v-bind:id="connectedItem.id" v-bind:muted="connectedItem.isMe"></video>
      <div class="w3-bar w3-center">
        <div>
          <i v-bind:class="audioIconClass" ></i>
          <i v-bind:class="videoIconClass" ></i>
        </div>
       
        
      </div>
  </div>   
</div>`,
props: ['connectedItem'],
mounted () {
    const theVideoElement = document.getElementById(this.connectedItem.id);

    theVideoElement.srcObject = this.connectedItem.stream;
    theVideoElement.addEventListener('loadedmetadata', () => {
        theVideoElement.play();
    });

},

computed: {

      audioIconClass () {
        
        return  this.connectedItem.audioEnabled ? 'bi bi-mic-fill'  : 'bi-mic-mute-fill' ; 
    },

    videoIconClass () {
       
        return  this.connectedItem.videoEnabled ? 'bi bi-camera-video-fill' : 'bi bi-camera-video-off-fill' ; 
    },    

},
    
}