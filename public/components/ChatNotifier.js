export default {
  name: 'ChatNotifier',
  components: {},
  template: `
  <div v-if="thereAreMessages" v-bind:class="theClasses">
      Chat Messages: {{chatMessageCount}}
  </div>   
  `,
  data: function () {
    return {
      notifyColor: 'w3-black',
      number: 0,
      processingChange: false,
    };
  },
  computed: {
    theClasses() {
      return `w3-bar-item w3-right ${this.notifyColor}`;
    },
    someoneToChatWith() {
      return this.$store.getters.everyoneButMe.length > 0;
    },
    thereAreMessages() {
      return this.chatMessageCount > 0 && this.someoneToChatWith;
    },
    chatMessageCount() {
      const latestCount = this.$store.getters.allChatMessages.length;

      // if a new message came in, turn background yellow
      // for 2 seconds to notify the user visually
      // (over and above the notification sound)
      if (this.number !== latestCount) {
        if (!this.processingChange) {
          this.processingChange = true;
          this.notifyColor = 'w3-yellow';
          setTimeout(() => {
            this.number = this.$store.getters.allChatMessages.length;
            this.notifyColor = 'w3-black';
            this.processingChange = false;
          }, 2000);
        }
      }

      return latestCount;
    },
  },
};
