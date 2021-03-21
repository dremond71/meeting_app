import Message from './Message.js';

export default {
  name: 'Messages',
  components: { Message },
  template: `
  <div>
    <table align="center">
      <tr>
        <td>
          <button class="w3-button w3-margin-top w3-margin-bottom w3-margin-right" v-on:click="moveUp" v-bind:disabled="upDisabled">
            <i class="bi bi-arrow-up-circle-fill"></i>
          </button>        
        </td>
        <td>
          <b>{{messagesTitle}}</b>
        </td>
        <td>
          <button class="w3-button w3-margin-left w3-margin-top w3-margin-bottom" v-on:click="moveDown" v-bind:disabled="downDisabled">
            <i class="bi bi-arrow-down-circle-fill"></i>
          </button>        
        </td>
      </tr>
    </table>
    <Message v-for="theMessage in theChatMessagesToShow" v-bind:message="theMessage" v-bind:key="theMessage.id"></Message>
  </div>
`,
  data: function () {
    return {
      messageIndex: 0,
    };
  },
  computed: {
    messagesTitle() {
      return this.theChatMessages.length > 0
        ? `Messages (${this.theChatMessages.length})`
        : 'Messages';
    },
    theChatMessages() {
      return this.$store.getters.allChatMessages;
    },
    theChatMessagesToShow() {
      // at the moment, I decided to only show 1
      // message at the time
      return [this.$store.getters.allChatMessages[this.messageIndex]];
    },
    upDisabled() {
      return this.messageIndex === 0;
    },
    downDisabled() {
      return this.messageIndex === this.theChatMessages.length - 1;
    },
  },
  methods: {
    moveUp() {
      if (this.messageIndex > 0) {
        this.messageIndex--;
      }
    },
    moveDown() {
      if (this.messageIndex < this.theChatMessages.length - 1) {
        this.messageIndex++;
      }
    },
  },
};
