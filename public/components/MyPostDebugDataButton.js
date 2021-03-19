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
      data.socketID = this.connectedItem.socketID;
      data.streamExists = !!this.connectedItem.stream;
      data.callExists = !!this.connectedItem.call;

      data.peers = this.$store.getters.everyoneButMe.map((person) => {
        const pd = {};
        pd.id = person.id;
        pd.userName = person.userName;
        pd.roomId = person.roomId;
        pd.isMe = person.isMe;
        pd.audioEnabled = person.audioEnabled;
        pd.videoEnabled = person.videoEnabled;
        pd.sharing = person.sharing;
        pd.socketID = person.socketID;
        pd.streamExists = !!person.stream;
        pd.callExists = !!person.call;
        return pd;
      });

      this.$store.dispatch('postDebugData', data);
    },
  },
};
