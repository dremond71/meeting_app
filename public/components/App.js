import NavBar from './NavBar.js';
import VideoGrid from './VideoGrid.js';
import BottomBar from './BottomBar.js';
import ShareArea from './ShareArea.js';
import SidePanel from './SidePanel.js';

import {
  playSound_JoinMeeting,
  playSound_LeaveMeeting,
  playSound_ChatReceived,
} from './sounds.js';

export default {
  name: 'App',
  components: {
    NavBar,
    ShareArea,
    VideoGrid,
    BottomBar,
    SidePanel,
  },
  template: `
<div class="w3-light-blue">

    <div class="w3-container w3-blue">
      <p align="center"><b>{{ product }}</b></p>
    </div>
    <NavBar></NavBar>

    <div class="w3-row">
      <div class="w3-col m9">
         <ShareArea></ShareArea>
         <VideoGrid></VideoGrid>
      </div>

      <div class="w3-col m3">
        <SidePanel></SidePanel>
      </div>
     </div>

    <BottomBar></BottomBar>
    
</div>`,

  data: function () {
    return {
      myPeer: undefined,
      myConnection: {
        id: undefined,
        userName: undefined,
        roomId: undefined,
        stream: undefined,
        isMe: false,
        audioEnabled: false,
        videoEnabled: false,
        sharing: false,
        call: undefined,
        socketID: undefined,
      },
    };
  },
  mounted() {
    // needed for function below
    const component_this = this;

    /**
     * This function helps to connect to users who joined the room
     * but spent too much time dealing with browser's 'Allow camera and mic'
     * dialog, that they missed my call which passes my stream.
     * So find these people and send them my stream :)
     */
    function whoNeedsACallFromMe() {
      const peersWithNoStreamMap =
        component_this.$store.getters.peersWithNoStream;
      for (let [key, value] of peersWithNoStreamMap) {
        console.log(
          `whoNeedsACallFromMe => id: ${value.id}, user name: ${value.userName} in room: ${value.roomId} with my stream`
        );
        // TODO check if I need to send shareStream instead here.
        component_this.sendMyStreamToNewUserAndAcceptUserStream(
          value.id,
          value.userName,
          value.socketID
        );
      }
    }

    // every 8 seconds, call the function above
    setInterval(whoNeedsACallFromMe, 8000);

    this.myPeer = new Peer(undefined, peerConfig);

    socket.on('user-disconnected', (userId, userName) => {
      console.log(`User disconnected: id ${userId}, user name ${userName} `);

      // let's keep track of connected users to help keep track of
      // whether or not they received our stream.
      // Sometimes there's too much of a delay when other user
      // is dealing with the browser's 'Allow Camera and Microphone'
      this.removePeerWithoutStreamActionInStore({
        id: userId,
        roomId: this.myConnection.roomId,
      });

      playSound_LeaveMeeting();
      this.deleteConnectedItemInStore(userId);
    });

    socket.on('user-name', (userId, userName) => {
      console.log(`User ${userId} has user name ${userName}`);
      this.updateUserNameInStore({ id: userId, userName: userName });
    });

    socket.on('socket-id', (userId, socketId) => {
      console.log(`User ${userId} has socketId ${socketId}`);
      this.updateSocketIdInStore({ id: userId, socketId: socketId });
    });

    socket.on('user-muted-audio', (userId) => {
      console.log(`User ${userId} muted audio`);
      this.updateAudioMutedInStore({ id: userId, enabled: false });
    });

    socket.on('user-unmuted-audio', (userId) => {
      console.log(`User ${userId} unmuted audio`);
      this.updateAudioMutedInStore({ id: userId, enabled: true });
    });

    socket.on('user-muted-video', (userId) => {
      console.log(`User ${userId} muted video`);
      this.updateVideoMutedInStore({ id: userId, enabled: false });
    });

    socket.on('user-unmuted-video', (userId) => {
      console.log(`User ${userId} unmuted video`);
      this.updateVideoMutedInStore({ id: userId, enabled: true });
    });

    socket.on('user-starting-share', (userId) => {
      console.log(`User ${userId} sharing screen`);
      this.updateWhoIsSharingInStore({ id: userId, enabled: true });
    });

    socket.on('user-stopping-share', (userId) => {
      console.log(`User ${userId} stopped sharing screen`);
      this.updateWhoIsSharingInStore({ id: userId, enabled: false });
    });

    socket.on('chat_message_everyone', (userId, userName, chatMessage) => {
      console.log(
        `chat_message_everyone: userId '${userId}' userName '${userName}' sent public chat message '${chatMessage}'`
      );

      const chatMessageData = {
        id: Date.now(),
        from: userName,
        to: 'Everyone',
        message: chatMessage,
      };

      this.putChatMessageInStore(chatMessageData);
      playSound_ChatReceived();
    });

    socket.on('chat_message_specific', (userId, userName, chatMessage) => {
      console.log(
        `chat_message_specific: userId '${userId}' userName: '${userName}' sent private chat message '${chatMessage}'`
      );

      const chatMessageData = {
        id: Date.now(),
        from: userName,
        to: 'Me',
        message: chatMessage,
      };

      this.putChatMessageInStore(chatMessageData);
      playSound_ChatReceived();

      //
      // check if user sent message '@refresh-stream'
      //
      if (chatMessage.trim() === '@refresh-stream') {
        //
        // send my latest stream to this person
        //
        this.resendMyCurrentStreamAgain(userName);
      }
    });

    /**
     * Emitting this event from server.js was the only way
     * I could figure out how to get MY socket id.
     */
    socket.on('some_socket_id', (roomId, userId, userName, socketID) => {
      console.log(
        `some_socket_id: userId '${userId}', roomId: '${roomId}', userName: '${userName}', socketId: '${socketID}' `
      );

      const socketData = {
        userId: userId,
        roomId: roomId,
        userName: userName,
        socketID: socketID,
      };

      this.processSomeSocketData(socketData);
    });

    this.myPeer.on('open', (id) => {
      console.log(
        `myPeer.on: user ${id}, user name '${USER_NAME}' joining room ${ROOM_ID}`
      );
      this.myConnection.id = id;
      this.myConnection.userName = USER_NAME;
      this.myConnection.roomId = ROOM_ID;
      // not sure how to get my socket id....yet...
      this.myConnection.socketID = undefined;
      socket.emit('join-room', ROOM_ID, id, USER_NAME);

      // START MEDIA
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (!stream) {
            throw new Error(
              'navigator.mediaDevices.getUserMedia({ video: true, audio: true }) returned a null stream :('
            );
          }

          this.myConnection.stream = stream;
          this.myConnection.isMe = true; // mutes my video; even though muted=true doesn't show in video HTML element ;)
          this.myConnection.audioEnabled = true;
          this.myConnection.videoEnabled = true;

          // see if I can obtain my socket Id BEFORE
          // adding my other connection data to the store.
          const mySocketId = this.getMySocketId(id);
          if (mySocketId) {
            console.log(
              `found my socket id before adding my connection to store`
            );
            this.myConnection.socketID = mySocketId;
          } else {
            console.log(
              `did NOT find my socket id before adding my connection to store`
            );
          }

          // this is fine since my initial stream from camera is fine.
          // but, later in this code, get my stream from store getters.
          this.addConnectedItemToStore(this.myConnection);

          this.myPeer.on('call', (call) => {
            // IF THIS FUNCTION IS NOT HERE, THE CODE IN sendMyStreamToNewUserAndAcceptUserStream NEVER GETS A STREAM.
            // ALSO THESE console.log() LINES NEVER PRINT OUT, AND DO NOT TRIGGER BREAKPOINTS
            console.log(`${call.peer} calling me. Answering call`);

            // obtain my current stream (video/audio, or share stream)
            const myCurrentStream = this.$store.getters.myCurrentStream;
            call.answer(myCurrentStream);

            call.on('stream', (userVideoStream) => {
              setTimeout(() => {
                console.log(
                  `this.Peer.on:call:event:stream:event ${call.peer}`
                );
                this.acceptNewUserStream(call, userVideoStream);
              }, 2000);
            });
          });

          socket.on('user-connected', (userId, userName, socketID) => {
            // let's keep track of connected users to help keep track of
            // whether or not they received our stream.
            // Sometimes there's too much of a delay when other user
            // is dealing with the browser's 'Allow Camera and Microphone'
            this.addPeerWithoutStreamActionInStore({
              id: userId,
              roomId: this.myConnection.roomId,
              userName: userName,
              socketID: socketID,
            });

            playSound_JoinMeeting();
            setTimeout(() => {
              console.log(
                `app.js"socket.on:user-connected:event: Send my stream to user ${userId}, user name ${userName}`
              );
              // user joined
              this.sendMyStreamToNewUserAndAcceptUserStream(
                userId,
                userName,
                socketID
              );
            }, 2000);
          });
        })
        .catch((error) => {
          // figuring out WHY a person's computer won't allow them to have
          // a video or microphone feed is difficult.
          // let's display the error to the user
          // to help with debugging their problem
          alert(error);
        });
      // END MEDIA
    });
  },
  computed: {
    product() {
      return this.$store.state.product;
    },
  },
  methods: {
    getMySocketId(userId) {
      let socketId = undefined;
      const socketData = this.$store.getters.getSocketDataById(userId);
      if (socketData) {
        socketId = socketData.socketID;
      }

      return socketId;
    },
    processSomeSocketData(socketData) {
      this.$store.dispatch('addTheSocketInfo', socketData);
    },

    putChatMessageInStore(chatMessageData) {
      this.$store.dispatch('addTheChatMessage', chatMessageData);
    },

    resendMyCurrentStreamAgain(toThisUserName) {
      this.$store.dispatch('resendMyCurrentStreamAgain', toThisUserName);
    },
    broadcastMyStatusAttributes() {
      const myConnection = this.$store.getters.myConnectedItem;

      // my audio status
      if (myConnection.audioEnabled) {
        console.log(`broadcasting I am unmuted...`);
        socket.emit('unmuted-audio', myConnection.roomId, myConnection.id);
      } else {
        console.log(`broadcasting I am muted...`);
        socket.emit('muted-audio', myConnection.roomId, myConnection.id);
      }

      // my video status
      if (myConnection.videoEnabled) {
        console.log(`broadcasting my video is unmuted...`);
        socket.emit('unmuted-video', myConnection.roomId, myConnection.id);
      } else {
        console.log(`broadcasting my video is muted...`);
        socket.emit('muted-video', myConnection.roomId, myConnection.id);
      }

      // my share status
      if (myConnection.sharing) {
        console.log(`broadcasting i am sharing...`);
        socket.emit('starting-share', myConnection.roomId, myConnection.id);
      } else {
        console.log(`broadcasting i am not sharing...`);
        socket.emit('stopping-share', myConnection.roomId, myConnection.id);
      }

      // my user name
      if (myConnection.userName) {
        socket.emit(
          'broadcast-username',
          myConnection.roomId,
          myConnection.id,
          myConnection.userName
        );
      }

      if (myConnection.socketID) {
        socket.emit(
          'broadcast-socket-id',
          myConnection.roomId,
          myConnection.id,
          myConnection.socketID
        );
      }
    },
    increment() {
      this.$store.dispatch('incrementAsync');
    },
    addPeerWithoutStreamActionInStore(userData) {
      this.$store.dispatch('addPeerWithoutStreamAction', userData);
    },
    removePeerWithoutStreamActionInStore(userData) {
      this.$store.dispatch('removePeerWithoutStreamAction', userData);
    },
    addConnectedItemToStore(userData) {
      this.$store.dispatch('addConnection', userData);
    },
    updateConnectedItemInStore(userData) {
      this.$store.dispatch('updateConnection', userData);
    },
    updateUserNameInStore(data) {
      this.$store.dispatch('updateTheUserName', data);
    },
    updateSocketIdInStore(data) {
      this.$store.dispatch('updateTheSocketId', data);
    },
    updateAudioMutedInStore(data) {
      this.$store.dispatch('updateAudioMuted', data);
    },
    updateVideoMutedInStore(data) {
      this.$store.dispatch('updateVideoMuted', data);
    },
    updateWhoIsSharingInStore(data) {
      this.$store.dispatch('updateWhoIsSharing', data);
    },
    deleteConnectedItemInStore(userId) {
      this.$store.dispatch('deleteConnection', userId);
    },

    acceptNewUserStream(call, userStream) {
      // need to accept call as a parameter since we need to store the actual call
      // in order to help with screen sharing. In this case, we need to replace
      // webcam/microphone stream with sharing stream to all connected users.
      const userId = call.peer;
      console.log(`acceptNewUserStream ${userId}, userName=...`);
      // until user broadcasts the user name, we will give it temporary label.
      const userConnection = {
        id: userId,
        userName: '...',
        roomId: this.myConnection.roomId,
        stream: userStream,
        isMe: false,
        audioEnabled: true,
        videoEnabled: true,
        sharing: false,
        call: call,
        socketID: undefined,
      };
      if (!this.$store.getters.connectedContainsId(userId)) {
        this.addConnectedItemToStore(userConnection);
      } else {
        this.updateConnectedItemInStore(userConnection);
      }
    },
    sendMyStreamToNewUserAndAcceptUserStream(userId, userName, socketID) {
      console.log(
        `sendMyStreamToNewUserAndAcceptUserStream ${userId}, ${userName}, ${socketID}`
      );

      // obtain my current stream (video/audio, or share stream)
      const myCurrentStream = this.$store.getters.myCurrentStream;

      // sending my stream to a user through a call
      const call = this.myPeer.call(userId, myCurrentStream);

      // preparing most of user connection data here; but don't yet have stream
      const userConnection = {
        id: userId,
        userName: userName,
        roomId: this.myConnection.roomId,
        stream: undefined,
        isMe: false,
        audioEnabled: true,
        videoEnabled: true,
        sharing: false,
        call: call,
        socketID: socketID,
      };

      let broadcastedMyStatusToThisUser = false;

      call.on('stream', (userVideoStream) => {
        // let's keep track of connected users to help keep track of
        // whether or not they received our stream.
        // Sometimes there's too much of a delay when other user
        // is dealing with the browser's 'Allow Camera and Microphone'
        this.removePeerWithoutStreamActionInStore({
          id: userId,
          roomId: this.myConnection.roomId,
        });

        // have the user's stream now, so can finally add user connection data to the store.
        userConnection.stream = userVideoStream;

        if (!this.$store.getters.connectedContainsId(userId)) {
          this.addConnectedItemToStore(userConnection);
        } else {
          this.updateConnectedItemInStore(userConnection);
        }

        // only broadcast once to this user
        if (!broadcastedMyStatusToThisUser) {
          // let this user know of my different status attributes
          // a delay is required
          setTimeout(() => {
            this.broadcastMyStatusAttributes();
          }, 5000);

          broadcastedMyStatusToThisUser = true;
        } else {
          console.log(`Already broadcasted my status to user id ${userId}`);
        }
      });

      call.on('close', () => {
        console.log(`User closed call: id ${userId}, user name ${userName} `);
        this.deleteConnectedItemInStore(userId);
      });
    },
  },
};
