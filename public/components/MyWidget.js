export default {
    name: 'MyWidget',
    components: {
    },
    template: `
<div class="w3-col m3 w3-margin" >
  <div>
      <video v-bind:id="connectedItem.id" v-bind:muted="connectedItem.isMe"></video>
      <div class="w3-bar w3-center">
        <button v-bind:class="audioClasses" v-on:click="toggleAudio" v-bind:disabled="!connectedItem.isMe">{{ audioButtonText}} <i v-bind:class="audioIconClass"></i> </button>
        <button v-bind:class="videoClasses" v-on:click="toggleVideo" v-bind:disabled="!connectedItem.isMe">{{ videoButtonText}} <i v-bind:class="videoIconClass"></i> </button>
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
    audioClasses() {
      let classes = "w3-button w3-purple";
    //   if (!this.connectedItem.isMe){
    //       classes = classes + ` w3-disabled`;
    //   }
      return classes;
    },
    videoClasses() {
        let classes = "w3-button w3-red";
        // if (!this.connectedItem.isMe){
        //     classes = classes + ` w3-disabled`;
        // }
        return classes;
      },
      audioIconClass () {
        return  this.connectedItem.audioEnabled ? 'bi bi-mic-fill' : 'bi-mic-mute-fill'; 
    },

    videoIconClass () {
        return  this.connectedItem.videoEnabled ? 'bi bi-camera-video-fill' : 'bi bi-camera-video-off-fill'; 
    },    

    audioButtonText () {
        return  this.connectedItem.audioEnabled ? 'Mic (on)' : 'Mic (off)'; 
    },

    videoButtonText () {
        return this.connectedItem.videoEnabled ? 'Camera (on)' : 'Camera (off)'; 
    }
},
methods: {
    getAudioTrack() {
        return  this.connectedItem.stream.getAudioTracks()[0];
    },
    getVideoTrack() {
        return  this.connectedItem.stream.getVideoTracks()[0];
    },
    updateAudioMutedInStore(data) {
        this.$store.dispatch('updateAudioMuted', data );
    },
    updateVideoMutedInStore(data) {
        this.$store.dispatch('updateVideoMuted', data );
    },

    toggleAudio () {
        //
        // I can only affect the enabled state of my stream on my end, not anyone else's.
        // The toggle button is disabled if this widget is for someone else.
        //
        const audioTrack =  this.getAudioTrack();
        audioTrack.enabled = !audioTrack.enabled; 
 
        // update the store with the enabled state of my audio
        this.updateAudioMutedInStore( {id: this.connectedItem.id,enabled: audioTrack.enabled});  

        // send signal to other participants that I muted/unmuted my audio track 
        if (!audioTrack.enabled) {
            socket.emit('muted-audio', this.connectedItem.roomId,this.connectedItem.id);
        }
        else {
            socket.emit('unmuted-audio', this.connectedItem.roomId,this.connectedItem.id);
        }
    },
    toggleVideo () {
        const videoTrack =  this.getVideoTrack();
        videoTrack.enabled = !videoTrack.enabled;
       // update the store with the enabled state of my video
       this.updateVideoMutedInStore( {id: this.connectedItem.id,enabled: videoTrack.enabled});  

       // send signal to other participants that I muted/unmuted my video track 
       if (!videoTrack.enabled) {
           socket.emit('muted-video', this.connectedItem.roomId,this.connectedItem.id);
       }
       else {
           socket.emit('unmuted-video', this.connectedItem.roomId,this.connectedItem.id);
       }        
    },
},
    
}