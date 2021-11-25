import App from './components/App.js';

function propagateNewStreamToOthers(newStream, peersListExcludingMe) {
  console.log('\n\npropagateNewStreamToOthers(): start');

  if (peersListExcludingMe && peersListExcludingMe.length > 0) {
    console.log(`There are peers to contact : ${peersListExcludingMe.length}`);

    // this should be sharing stream
    const mediaStream = newStream;

    // ran into problems where sound is lost as soon as I start sharing a screen.
    // found this : https://stackoverflow.com/questions/42825338/webrtc-change-video-stream-in-the-middle-of-communication
    //
    for (const aPeer of peersListExcludingMe) {
      console.log(
        `  adjusting stream for user: ${aPeer.userName} (${aPeer.id})`
      );
      const sendersList = aPeer.call?.peerConnection?.getSenders();
      if (sendersList) {
        let senderIndex = 1;
        sendersList.map((sender) => {
          console.log(`  processing sender ${senderIndex++}`);
          // if (sender.track.kind == 'audio') {
          //   if (mediaStream.getAudioTracks().length > 0) {
          //     sender.replaceTrack(mediaStream.getAudioTracks()[0]);
          //   }
          // }
          if (sender.track.kind == 'video') {
            if (mediaStream.getVideoTracks().length > 0) {
              sender.replaceTrack(mediaStream.getVideoTracks()[0]);
            }
          }
        });
      } else {
        console.log(`     NO sendersList`);
      }
    } //for
  } // there are peers

  console.log('\n\npropagateNewStreamToOthers(): end\n\n');
}

function closeStream(someStream) {
  try {
    const tracks = someStream.getTracks();
    tracks.forEach((track) => track.stop());
    someStream = undefined;
    console.log(`stopped tracks of stream and set it to undefined`);
  } catch (error) {
    console.log(error);
  }
}

const store = new Vuex.Store({
  state: {
    product: `Meet-Free`,
    description: 'Free Video-conferencing App',
    peersWithoutStream: new Map(),
    chatMessages: [],
    connectedList: [],
    socketInfo: [],
    sharingTemp: {
      shareStream: undefined,
      originalUserStream: undefined,
    },
  },
  getters: {
    myCurrentStream: (state) => {
      // find my connection info
      const myInfo = state.connectedList.find((item) => {
        return item.isMe === true;
      });

      let myStream = undefined;
      if (myInfo) {
        // sharing or not, my stream is always this
        myStream = myInfo.stream;
      }
      return myStream;
    },
    peersWithNoStream: (state) => {
      return state.peersWithoutStream;
    },
    connected: (state) => {
      return state.connectedList;
    },
    everyoneButMe: (state) => {
      return state.connectedList.filter((connectedItem) => {
        return connectedItem.isMe === false;
      });
    },
    connectedContainsId: function (state) {
      // return a function so we can provide our own parameter
      return function (id) {
        return state.connectedList.some((connectedItem) => {
          return connectedItem.id === id;
        });
      };
    },

    getSpecificConnectedItem: function (state) {
      // return a function so we can provide our own parameter
      return function (id) {
        return state.connectedList.find((connectedItem) => {
          return connectedItem.id === id;
        });
      };
    },

    somebodySharing: (state) => {
      return state.connectedList.find((connectedItem) => {
        return connectedItem.sharing === true;
      });
    },

    myConnectedItem: (state) => {
      return state.connectedList.find((item) => {
        return item.isMe === true;
      });
    },
    allChatMessages: (state) => {
      return state.chatMessages;
    },
    getSocketDataById: (state) => {
      // return a function so we can provide our own parameter
      return function (id) {
        return state.socketInfo.find((socketData) => {
          return socketData.userId === id;
        });
      };
    },
  },
  mutations: {
    addPeerWithoutStream(state, data) {
      const key = `${data.id}_${data.roomId}`;
      state.peersWithoutStream.set(key, {
        id: data.id,
        roomId: data.roomId,
        userName: data.userName,
        socketID: data.socketID,
      });
    },
    removePeerWithoutStream(state, data) {
      const key = `${data.id}_${data.roomId}`;
      if (state.peersWithoutStream.has(key)) {
        state.peersWithoutStream.delete(key);
      }
    },
    addConnected(state, connectedItem) {
      console.log(`adding id ${connectedItem.id} to store`);
      // add new items to the beginning of the array
      // this is to keep my stream at the bottom
      // and other participants appear at the top
      // of the array.
      state.connectedList.unshift(connectedItem);
    },
    updateConnected(state, connectedItem) {
      console.log(`updating id ${connectedItem.id} in store`);
      // update a stream for a userId
      const existingConnection = state.connectedList.find((item) => {
        return item.id === connectedItem.id;
      });
      if (existingConnection) {
        //console.log(`updating id ${connectedItem.id} to store`);
        existingConnection.stream = connectedItem.stream;
      } else {
        console.log(`Could not find id ${connectedItem.id} in store`);
      }
    },
    updateUserName(state, data) {
      // update user name for a userId
      const existingConnection = state.connectedList.find((item) => {
        return item.id === data.id;
      });
      if (existingConnection) {
        existingConnection.userName = data.userName;
      } else {
        console.log(`Could not find id ${data.id} in store`);
      }
    },
    updateSocketId(state, data) {
      // update socket id for a userId
      const existingConnection = state.connectedList.find((item) => {
        return item.id === data.id;
      });
      if (existingConnection) {
        existingConnection.socketID = data.socketId;
      } else {
        console.log(`Could not find id ${data.id} in store`);
      }
    },
    updateAudioEnabled(state, data) {
      // update audio track state for a userId
      const existingConnection = state.connectedList.find((item) => {
        return item.id === data.id;
      });
      if (existingConnection) {
        //console.log(`updating id ${data.id}'s audio track enabled state to store`);
        existingConnection.audioEnabled = data.enabled;
      } else {
        console.log(`Could not find id ${data.id} in store`);
      }
    },
    updateVideoEnabled(state, data) {
      // update video track state for a userId
      const existingConnection = state.connectedList.find((item) => {
        return item.id === data.id;
      });
      if (existingConnection) {
        //console.log(`updating id ${data.id}'s video track enabled state to store`);
        existingConnection.videoEnabled = data.enabled;
      } else {
        console.log(`Could not find id ${data.id} in store`);
      }
    },

    updateWhichPersonIsSharing(state, data) {
      const existingConnection = state.connectedList.find((item) => {
        return item.id === data.id;
      });
      if (existingConnection) {
        existingConnection.sharing = data.enabled;
      } else {
        console.log(`Could not find id ${data.id} in store`);
      }
    },

    deleteConnected(state, userId) {
      console.log(`main_vuejs:deleteConnected() userId:${userId}`);
      const foundIndex = state.connectedList.findIndex((item) => {
        return item.id === userId;
      });
      if (foundIndex > -1) {
        let connectionItem = state.connectedList[foundIndex];

        // remove 1 item from the array at the given index
        state.connectedList.splice(foundIndex, 1);

        // clean up after deleted item
        if (connectionItem) {
          try {
            // close the call
            if (connectionItem.call) {
              connectionItem.call.close();
            }

            // delete their stream
            if (connectionItem.stream) {
              closeStream(connectionItem.stream);
            }

            // clean up a temp object which may contain
            // their original stream and possibly a
            // sharing stream
            if (connectionItem.sharingTemp) {
              if (connectionItem.sharingTemp.originalUserStream) {
                closeStream(connectionItem.sharingTemp.originalUserStream);
              }
              if (connectionItem.sharingTemp.shareStream) {
                closeStream(connectionItem.sharingTemp.shareStream);
              }
            }
            connectionItem = undefined;
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        console.log(`Could not find/delete id ${userId} in store`);
      }
    },
    startSharingSomething(state, shareStream) {
      const myInfo = state.connectedList.find((item) => {
        return item.isMe === true;
      });

      if (myInfo) {
        myInfo.sharing = true;
        // save original webcam/microphone stream
        state.sharingTemp.originalUserStream = myInfo.stream;
        // store my shared stream here
        state.sharingTemp.shareStream = shareStream;
        myInfo.stream = shareStream;

        // need to call all peers to replace my existing stream
        //https://dev.to/arjhun777/video-chatting-and-screen-sharing-with-react-node-webrtc-peerjs-18fg
        const peersListExcludingMe = state.connectedList.filter((item) => {
          return item.isMe === false;
        });

        propagateNewStreamToOthers(myInfo.stream, peersListExcludingMe);

        socket.emit('starting-share', myInfo.roomId, myInfo.id);
      }
    },
    stopSharingSomething(state) {
      const myInfo = state.connectedList.find((item) => {
        return item.isMe === true;
      });

      if (myInfo) {
        myInfo.sharing = false;
        // restore my webcam/mic stream
        myInfo.stream = state.sharingTemp.originalUserStream;
        state.sharingTemp.originalUserStream = undefined;
        try {
          const tracks = state.sharingTemp.shareStream.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (err) {
          console.log(`Error closing stream`);
        }
        state.sharingTemp.shareStream = undefined;

        // need to call all peers to replace my existing stream
        //https://dev.to/arjhun777/video-chatting-and-screen-sharing-with-react-node-webrtc-peerjs-18fg
        const peersListExcludingMe = state.connectedList.filter((item) => {
          return item.isMe === false;
        });

        propagateNewStreamToOthers(myInfo.stream, peersListExcludingMe);

        socket.emit('stopping-share', myInfo.roomId, myInfo.id);
      }
    },
    resendMyCurrentStream(state, someUserName) {
      const myInfo = state.connectedList.find((item) => {
        return item.isMe === true;
      });

      if (myInfo) {
        const otherUser = state.connectedList.find((item) => {
          return item.userName === someUserName;
        });
        if (otherUser) {
          propagateNewStreamToOthers(myInfo.stream, [otherUser]);
        }
      }
    },

    addChatMessage(state, data) {
      console.log(
        `adding chat message id: '${data.id}' from: '${data.from}' to: '${data.to}' to store`
      );
      state.chatMessages.unshift(data);
    },

    addSocketInfo(state, data) {
      console.log(`adding socket info to store`);
      state.socketInfo.push(data);
    },
  },

  actions: {
    addPeerWithoutStreamAction(context, data) {
      context.commit('addPeerWithoutStream', data);
    },
    removePeerWithoutStreamAction(context, data) {
      context.commit('removePeerWithoutStream', data);
    },
    addConnection(context, connectedItem) {
      context.commit('addConnected', connectedItem);
    },
    updateConnection(context, connectedItem) {
      context.commit('updateConnected', connectedItem);
    },
    updateTheUserName(context, data) {
      context.commit('updateUserName', data);
    },
    updateTheSocketId(context, data) {
      context.commit('updateSocketId', data);
    },
    updateAudioMuted(context, data) {
      context.commit('updateAudioEnabled', data);
    },
    updateVideoMuted(context, data) {
      context.commit('updateVideoEnabled', data);
    },
    updateWhoIsSharing(context, data) {
      context.commit('updateWhichPersonIsSharing', data);
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
    addTheChatMessage(context, data) {
      context.commit('addChatMessage', data);
    },
    addTheSocketInfo(context, data) {
      context.commit('addSocketInfo', data);
    },
    resendMyCurrentStreamAgain(context, userName) {
      context.commit('resendMyCurrentStream', userName);
    },

    async postDebugData(context, data) {
      try {
        const config = {
          method: 'post',
          url: 'https://free-meeting.twc-kungfu.com/debugdata',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };
        const res = await axios(config);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },
  },
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount(`#app`);
