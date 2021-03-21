import { playSound_ChatReceived } from './sounds.js';
import Messages from './Messages.js';

export default {
  name: 'ParticipantChat',
  components: {
    Messages,
  },
  template: `
  <div   class="w3-container w3-blue w3-center" style="width:100%;">
    <h2>Chat</h2>
    <label for="selectNames"><b>Send Message To:</b></label>
    <select v-model="selected" name="selectNames" class="form-select form-select-lg mb-3 w3-light-blue w3-border-white" aria-label=".form-select-lg example" style="width:100%">
        <option  key="chat_placeholder" disabled value="">Select...</option> 
        <option v-for="item in chatItems"   v-bind:value="item.value" >{{item.text}}</option>     
    </select>
    <textarea id="sendText" name="sendText" v-model="messageToSend" rows="6"  class="w3-margin-top w3-light-blue w3-border-white" style="width:100%;resize:none;">
    </textarea>
    <button class="w3-button w3-round-xxlarge w3-light-blue w3-border-white" style="width:100%;" v-on:click="sendTheChat" v-bind:disabled="isDisabled">Send</button>
    <hr v-if="thereAreMessages"/>
    <Messages v-if="thereAreMessages"></Messages>
    <div class="w3-blue" style="height:80px;margin-bottom:10px;"></div>
  </div>`,
  data: function () {
    return {
      open: false,
      selected: '',
      messageToSend: '',
    };
  },
  computed: {
    chatItems() {
      const listItems = [];
      const everyoneItem = {
        value: 'chat_everyone',
        text: 'Everyone',
      };
      listItems.push(everyoneItem);
      let items = this.$store.getters.everyoneButMe;
      for (const item of items) {
        listItems.push({
          value: `chat_${item.id}`,
          text: item.userName ? item.userName : item.id,
        });
      }

      const currentlySelected = this.selected;
      if (currentlySelected !== '') {
        // a chat participant may have dropped out,
        // so check if we need to reset selected value
        const foundSelected = listItems.find((item) => {
          return item.value === currentlySelected;
        });
        if (!foundSelected) {
          this.selected = '';
        }
      }
      return listItems;
    },
    isDisabled() {
      return this.selected === '';
    },
    thereAreMessages() {
      return this.$store.getters.allChatMessages.length > 0;
    },
  },
  methods: {
    sendTheChat() {
      const chatMessage = this.messageToSend.trim();
      if (this.selected !== '') {
        // remove 'chat_' from selected value to
        // obtain the destination id (everyone, or peer id)
        const destinationId = this.selected.replace('chat_', '');
        console.log(
          `Send chat message '${chatMessage}' to destinationId '${destinationId}'`
        );

        const myConnectedItem = this.$store.getters.myConnectedItem;

        if (myConnectedItem) {
          let sendToID = destinationId;
          let userName = 'Everyone';
          if (sendToID !== 'everyone') {
            const destinationItem = this.$store.getters.getSpecificConnectedItem(
              destinationId
            );
            if (!destinationItem) {
              console.log(
                `ERROR: could not retrieve item with id ${destinationId}`
              );
              sendToID = 'everyone';
            } else {
              // use socket id instead of peer id.
              sendToID = destinationItem.socketID;
              userName = destinationItem.userName;
            }
          }

          // save my chat message going out
          const myChatMessage = {
            id: Date.now(),
            from: 'Me',
            to: userName,
            message: chatMessage,
          };
          this.$store.dispatch('addTheChatMessage', myChatMessage);

          socket.emit(
            'send_chat_message',
            myConnectedItem.roomId,
            myConnectedItem.id,
            myConnectedItem.userName,
            sendToID,
            chatMessage
          );

          this.messageToSend = '';
          playSound_ChatReceived();
        }
      }
    },
  },
};
