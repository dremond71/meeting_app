import App from './components/App.js';


function propagateNewStreamToOthers(newStream, peersListExcludingMe) {
            
    if (peersListExcludingMe && (peersListExcludingMe.length>0) ) {

        console.log(`There are peers to contact : ${peersListExcludingMe.length}`);

        // this should be sharing stream
        const mediaStream = newStream;

        for(const aPeer of peersListExcludingMe) {

            const sendersList = aPeer.call?.peerConnection?.getSenders();
            sendersList.map( (sender) => {
                if(sender.track.kind == "audio") {
                    if(mediaStream.getAudioTracks().length > 0){
                        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                    }
                }
                if(sender.track.kind == "video") {
                    if(mediaStream.getVideoTracks().length > 0){
                        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                    }
                }
            });
  
        } //for 

    } // there are peers

}

const store = new Vuex.Store({
    state: {
       product:`Meet-Free` ,
       description:'Free Video-conferencing App',
       connectedList : [],
       infoBarMessage:"  ",
       sharingTemp : {
        shareStream: undefined,
        originalUserStream: undefined
       }
       
    },
    getters: {
        connected:(state) => {
            return state.connectedList;
        },
        connectedContainsId: function(state) {
            // return a function so we can provide our own parameter
            return function(id){
            
                return state.connectedList.some( connectedItem => {
                    return connectedItem.id === id;
               } );

            };
        },
        myConnectedItem:(state) => {

            return state.connectedList.find( item => {
                return item.isMe === true;
           } );
        },        
        

    },
    mutations: {
        addConnected (state, connectedItem) {
           //console.log(`adding id ${connectedItem.id} to store`);
           state.connectedList.push(connectedItem);
           state.infoBarMessage = `User ${connectedItem.id} has joined`;
        },
        updateConnected (state, connectedItem) {
           
            // update a stream for a userId
            const existingConnection = state.connectedList.find( item => {
                return item.id === connectedItem.id;
           } );
           if (existingConnection){
               //console.log(`updating id ${connectedItem.id} to store`);
               existingConnection.stream = connectedItem.stream;
           }
           else {
            console.log(`Could not find id ${connectedItem.id} in store`);
           }

         },
         updateAudioEnabled (state, data) {
           
            // update audio track state for a userId
            const existingConnection = state.connectedList.find( item => {
                return item.id === data.id;
           } );
           if (existingConnection){
               //console.log(`updating id ${data.id}'s audio track enabled state to store`);
               existingConnection.audioEnabled = data.enabled;
           }
           else {
            console.log(`Could not find id ${data.id} in store`);
           }

         },
         updateVideoEnabled (state, data) {
           
            // update video track state for a userId
            const existingConnection = state.connectedList.find( item => {
                return item.id === data.id;
           } );
           if (existingConnection){
               //console.log(`updating id ${data.id}'s video track enabled state to store`);
               existingConnection.videoEnabled = data.enabled;
           }
           else {
            console.log(`Could not find id ${data.id} in store`);
           }

         },                  
         deleteConnected (state, userId) {
            const foundIndex = state.connectedList.findIndex( item => {
                return item.id === userId;
            });
            if ( foundIndex > -1){
                // remove 1 item from the array at the given index
                state.connectedList.splice(foundIndex,1);
                //console.log(`Deleted id ${userId} in store`);
                state.infoBarMessage = `User ${userId.id} has left`;
            } 
            else {
                console.log(`Could not find/delete id ${userId} in store`);
            }
         },
         startSharingSomething (state, shareStream) {
           
            const myInfo = state.connectedList.find( item => {
                return item.isMe === true;
            } );

            if (myInfo){
                myInfo.sharing = true;
                // save original webcam/microphone stream
                state.sharingTemp.originalUserStream = myInfo.stream;
                // store my shared stream here
                state.sharingTemp.shareStream = shareStream;
                myInfo.stream = shareStream;

                // need to call all peers to replace my existing stream
                //https://dev.to/arjhun777/video-chatting-and-screen-sharing-with-react-node-webrtc-peerjs-18fg
                const peersListExcludingMe = state.connectedList.filter( item => {
                    return item.isMe === false;
                } );

                propagateNewStreamToOthers(myInfo.stream, peersListExcludingMe);

            }

            
         },    
         stopSharingSomething(state) {

            const myInfo = state.connectedList.find( item => {
                return item.isMe === true;
            } );

            if (myInfo){
                myInfo.sharing = false;
                // restore my webcam/mic stream
                myInfo.stream = state.sharingTemp.originalUserStream; 
                state.sharingTemp.originalUserStream = undefined;
                try {
                    const tracks = state.sharingTemp.shareStream.getTracks();
                    tracks.forEach(track => track.stop());
                }
                catch(err) {
                       console.log(`Error closing stream`);
                }
                state.sharingTemp.shareStream = undefined;

                // need to call all peers to replace my existing stream
                //https://dev.to/arjhun777/video-chatting-and-screen-sharing-with-react-node-webrtc-peerjs-18fg
                const peersListExcludingMe = state.connectedList.filter( item => {
                    return item.isMe === false;
                } );

                propagateNewStreamToOthers(myInfo.stream, peersListExcludingMe);

            }

         }     
         
      },
    
    actions : {
        addConnection(context, connectedItem) {
            context.commit('addConnected', connectedItem);
       },
       updateConnection(context, connectedItem) {
        context.commit('updateConnected', connectedItem);
       },
       updateAudioMuted(context, data) {
        context.commit('updateAudioEnabled', data);
       },
       updateVideoMuted(context, data) {
        context.commit('updateVideoEnabled', data);
       },
       deleteConnection(context, userId) {
        context.commit('deleteConnected', userId);
       },
       startSharing(context, shareStream) {
        context.commit('startSharingSomething', shareStream);
       },
       stopSharing(context) {
        context.commit('stopSharingSomething');
       },

    },

});

new Vue({
    store,
    render: h => h(App),
}).$mount(`#app`);
