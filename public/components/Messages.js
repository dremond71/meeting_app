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
      numberOfMessages: 1,
    };
  },
  computed: {
    messagesTitle() {
      return `Messages (${this.theChatMessages.length})`;
    },
    theChatMessages() {
      return this.$store.getters.allChatMessages;
    },
    theChatMessagesToShow() {
      // at the moment, I decided to only show 1
      // message at the time

      if (this.theChatMessages.length > this.numberOfMessages) {
        this.numberOfMessages = this.theChatMessages.length;

        // the number of chat messages has increased since
        // this component was mounted

        if (this.messageIndex !== 0) {
          // if we were focused on an item further into the array
          // when the size of the array changed, we need to bump
          // up the index to say focused on the same item.
          this.messageIndex++;
        }
      }

      const message = this.theChatMessages[this.messageIndex];
      return [message];
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
