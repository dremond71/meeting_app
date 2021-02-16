export default {
  name: 'ParticipantChat2',
  components: {},
  template: `
  <div class="w3-container w3-margin-top">
  <select class="form-select form-select-sm" aria-label=".form-select-sm example">
        <option  v-for="item in connectedItems" v-bind:key="item.id"   v-bind:value="item.id">{{item.value}}</option>     
    </select>
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
