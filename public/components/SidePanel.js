import Carousel from './Carousel.js';
import ParticipantChat from './ParticipantChat.js';
export default {
  name: 'SidePanel',
  components: {
    Carousel,
    ParticipantChat,
  },
  template: `
    <div>
      <Carousel v-if="someoneSharing"></Carousel>
      <ParticipantChat v-if="someoneToChatWith"></ParticipantChat>
    </div>
`,
  computed: {
    someoneSharing() {
      return this.sharedItem ? true : false;
    },
    someoneToChatWith() {
      return this.$store.getters.everyoneButMe.length > 0;
    },
    sharedItem() {
      return this.$store.getters.somebodySharing;
    },
  },
};
