export default {
  name: 'MyPostDebugDataButton',
  components: {},
  template: `
  <button class="w3-button w3-round-xxlarge  w3-light-blue w3-margin-left" v-on:click="postDebugData">{{ buttonText}} </button>
   
  `,
  props: ['connectedItem'],
  computed: {
    buttonText() {
      return 'Post Debug Data';
    },
  },
  methods: {
    postDebugData() {
      const data = {};
      data.id = this.connectedItem.id;
      data.userName = this.connectedItem.userName;
      data.roomId = this.connectedItem.roomId;
      data.isMe = this.connectedItem.isMe;
      data.audioEnabled = this.connectedItem.audioEnabled;
      data.videoEnabled = this.connectedItem.videoEnabled;
      data.sharing = this.connectedItem.sharing;
      data.sharingUUID = this.connectedItem.sharingUUID;
      data.socketID = this.connectedItem.socketID;
      data.streamExists = !!this.connectedItem.stream;
      data.shareStreamExists = !!this.connectedItem.shareStream;
      data.callExists = !!this.connectedItem.call;
      data.peersWithoutStream = this.$store.getters.peersWithNoStream;

      data.peers = this.$store.getters.everyoneButMe.map((person) => {
        const pd = {};
        pd.id = person.id;
        pd.userName = person.userName;
        pd.roomId = person.roomId;
        pd.isMe = person.isMe;
        pd.audioEnabled = person.audioEnabled;
        pd.videoEnabled = person.videoEnabled;
        pd.sharing = person.sharing;
        pd.sharingUUID = person.sharingUUID;
        pd.socketID = person.socketID;
        pd.streamExists = !!person.stream;
        pd.shareStreamExists = !!person.shareStream;
        pd.callExists = !!person.call;
        pd.callConnectionId = person.call?.connectionId
          ? person.call.connectionId
          : 'dunno';
        return pd;
      });

      this.$store.dispatch('postDebugData', data);
    },
  },
};
