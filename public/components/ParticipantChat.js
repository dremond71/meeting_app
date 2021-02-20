export default {
  name: 'ParticipantChat',
  components: {},
  template: `
  <div class="w3-container w3-margin-top" style="width:100%">
    <h3>Chat</h3>
    <label for="receivedText" class="w3-margin-top"><b>Messages</b></label>
    <textarea id="receivedText" name="receivedText" rows="8" style="width:100%;resize:none;" class="w3-margin-bottom;" readonly>
    </textarea>
    <hr/>
    <label for="selectNames"><b>Send Message To:</b></label>
    <select name="selectNames" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" style="width:100%">
        <option v-for="item in connectedItems" v-bind:key="item.id"   v-bind:value="item.id" >{{item.value}}</option>     
    </select>
    <textarea id="sendText" name="sendText" rows="6"  class="w3-margin-top" style="width:100%;resize:none;">
    </textarea>
    <button class="w3-button w3-round-xxlarge w3-light-blue" style="width:100%;">Send</button>
  </div>`,
  data: function () {
    return {
      open: false,
    };
  },
  computed: {
    connectedItems() {
      const listItems = [];
      const everyoneItem = {
        id: 'everyone',
        chatId: 'chat_everyone',
        value: 'Everyone',
      };
      listItems.push(everyoneItem);
      let items = this.$store.getters.everyoneButMe;
      for (const item of items) {
        listItems.push({
          id: item.id,
          chatId: `chat_${item.id}`,
          value: item.userName,
        });
      }
      return listItems;
    },
  },
};
