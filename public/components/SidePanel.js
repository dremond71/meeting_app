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
      <Carousel v-if="showCarousel"></Carousel>
      <ParticipantChat v-if="someoneToChatWith"></ParticipantChat>
    </div>
`,
  computed: {
    showCarousel() {
      return this.atLeastTwoPeople || this.someoneSharing;
    },
    atLeastTwoPeople() {
      return this.someoneToChatWith;
    },
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
