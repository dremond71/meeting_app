import NavBar from './NavBar.js';
import VideoGrid from './VideoGrid.js';
import BottomBar from './BottomBar.js';

export default {
    name: 'App',
    components: {
        NavBar,
        VideoGrid,
        BottomBar 
    },
    template: `
<div>

<div class="w3-container w3-blue">
<h1 align="center"><b>{{ product }}</b></h1>
<p align="center"><b>{{ description }}</b></p>
</div>
    <NavBar></NavBar>
    <VideoGrid></VideoGrid>
    <BottomBar></BottomBar>
 
</div>`,

data: function () {
    return {
      myPeer: undefined,
      myConnection: { id: undefined, roomId:undefined, stream: undefined, isMe: false, audioEnabled: false, videoEnabled:false, sharing:false, call:undefined}
    }
  },
mounted () {

//console.log(`\npeer config\n${JSON.stringify(peerConfig,null,2)}\n`);
this.myPeer = new Peer(undefined, peerConfig);
   
socket.on('user-disconnected', userId =>{
    console.log(`User disconnected: ${userId}`);
    this.deleteConnectedItemInStore(userId);
});

socket.on('user-muted-audio', userId =>{
    console.log(`User ${userId} muted audio`);
    this.updateAudioMutedInStore( {id: userId, enabled: false});
});

socket.on('user-unmuted-audio', userId =>{
    console.log(`User ${userId} unmuted audio`);
    this.updateAudioMutedInStore( {id: userId, enabled: true});
});

socket.on('user-muted-video', userId =>{
    console.log(`User ${userId} muted video`);
    this.updateVideoMutedInStore( {id: userId, enabled: false});
});

socket.on('user-unmuted-video', userId =>{
    console.log(`User ${userId} unmuted video`);
    this.updateVideoMutedInStore( {id: userId, enabled: true});
});

 this.myPeer.on('open', id => {
    console.log(`myPeer.on: user ${id} joining room ${ROOM_ID}`);
    this.myConnection.id = id;
    this.myConnection.roomId = ROOM_ID;
    socket.emit('join-room', ROOM_ID, id);

    // START MEDIA
    navigator.mediaDevices.getUserMedia({video:true, audio:true}).then( stream => {

        this.myConnection.stream = stream;
        this.myConnection.isMe = true; // mutes my video; even though muted=true doesn't show in video HTML element ;)
        this.myConnection.audioEnabled = true;
        this.myConnection.videoEnabled = true;
        this.addConnectedItemToStore(this.myConnection);
       
    
        this.myPeer.on('call', call => {
    
            // IF THIS FUNCTION IS NOT HERE, THE CODE IN sendMyStreamToNewUserAndAcceptUserStream NEVER GETS A STREAM.
            // ALSO THESE console.log() LINES NEVER PRINT OUT, AND DO NOT TRIGGER BREAKPOINTS
            console.log(`${call.peer} calling me. Answering call`);
            call.answer(stream);
            
            call.on('stream', userVideoStream => {
                
                setTimeout(() => {
                    console.log(`this.Peer.on:call:event:stream:event ${call.peer}`);
                    this.acceptNewUserStream(call,userVideoStream);
                }, 2000);
    
            });
        });
    
        socket.on('user-connected', userId =>{            
            setTimeout(() => {
            console.log(`app.js"socket.on:user-connected:event: Send my stream to user ${userId}`);
            // user joined
            this.sendMyStreamToNewUserAndAcceptUserStream(userId, stream);
        }, 2000);
        });
    
          
          
    }); 
    // END MEDIA
});


},
computed: {
    product () {
        return this.$store.state.product;
    },
    description () {
        return this.$store.state.description;
    }
},
methods: {
    increment () {
        this.$store.dispatch('incrementAsync');
    },
    addConnectedItemToStore(userData) {
        this.$store.dispatch('addConnection', userData );
    },
    updateConnectedItemInStore(userData) {
        this.$store.dispatch('updateConnection', userData );
    },
    updateAudioMutedInStore(data) {
        this.$store.dispatch('updateAudioMuted', data );
    },
    updateVideoMutedInStore(data) {
        this.$store.dispatch('updateVideoMuted', data );
    },
    deleteConnectedItemInStore(userId) {
        this.$store.dispatch('deleteConnection', userId );
    },
    addVideoStream(theVideoElement, theStream, appendToVideoGrid=true){
        theVideoElement.srcObject = theStream;
        theVideoElement.addEventListener('loadedmetadata', () => {
            theVideoElement.play();
        });
    },

    acceptNewUserStream(call, userStream){
        // need to accept call as a parameter since we need to store the actual call
        // in order to help with screen sharing. In this case, we need to replace
        // webcam/microphone stream with sharing stream to all connected users.
        const userId = call.peer;
        const userConnection =  { id: userId, roomId: this.myConnection.roomId, stream: userStream, isMe: false, audioEnabled:true, videoEnabled:true, sharing:false,call:call};
        if (!this.$store.getters.connectedContainsId(userId)){

            this.addConnectedItemToStore(userConnection);
          }
          else {
              console.log(`Updating user ${userId}'s stream in store`);
              this.updateConnectedItemInStore(userConnection);
          }
    },
    sendMyStreamToNewUserAndAcceptUserStream(userId, stream){
        
        console.log(`sendMyStreamToNewUserAndAcceptUserStream ${userId}`);
        // sending my stream to a user through a call
        const call = this.myPeer.call(userId,stream);

        // preparing most of user connection data here; but don't yet have stream
        const userConnection =  { id: userId, roomId: this.myConnection.roomId, stream: undefined, isMe: false, audioEnabled:true, videoEnabled:true, sharing:false,call:call};
        
        call.on('stream', userVideoStream => {
          // have the user's stream now, so can finally add user connection data to the store.
          userConnection.stream = userVideoStream;

          if (!this.$store.getters.connectedContainsId(userId)){

            this.addConnectedItemToStore(userConnection);
          }
          else {
            console.log(`Updating user ${userId}'s stream in store`);
            this.updateConnectedItemInStore(userConnection);
          }
          
        });

        // // never called
        // call.on('close',() => {
        //     console.log(`${call.peer} call just closed`);
        // });
         
      }
},

}