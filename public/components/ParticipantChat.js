export default {
  name: 'ParticipantChat',
  components: {},
  template: `
  <div class="w3-container w3-margin-top" style="width:100%">
    <h3>Chat</h3>
    <label for="receivedText" class="w3-margin-top"><b>Messages</b></label>
    <textarea id="receivedText" name="receivedText" rows="8" style="width:100%;resize:none;" class="w3-margin-bottom;" readonly>
       {{ theChatMessages }}
    </textarea>
    <hr/>
    <label for="selectNames"><b>Send Message To:</b></label>
    <select v-model="selected" name="selectNames" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" style="width:100%">
        <option  key="chat_placeholder" disabled value="">Select...</option> 
        <option v-for="item in chatItems"   v-bind:value="item.value" >{{item.text}}</option>     
    </select>
    <textarea id="sendText" name="sendText" v-model="messageToSend" rows="6"  class="w3-margin-top" style="width:100%;resize:none;">
    </textarea>
    <button class="w3-button w3-round-xxlarge w3-light-blue" style="width:100%;" v-on:click="sendTheChat" v-bind:disabled="isDisabled">Send</button>
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
    theChatMessages() {
      let messages = '';

      const chatMessages = this.$store.getters.allChatMessages;
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        const cm = chatMessages[i];
        const thisMessage = `\nFrom: ${cm.from}, To: ${cm.to}\n[\n${cm.message}\n]`;
        messages += thisMessage;
      }

      return messages;
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
        }
      }
    },
  },
};
