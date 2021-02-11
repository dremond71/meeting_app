import ShareScreen from './ShareScreen.js';
import Carousel from './Carousel.js';

export default {
  name: 'ShareArea',
  components: {
    Carousel,
    ShareScreen,
  },
  template: `
<div>
    <ShareScreen v-if="someoneSharing" v-bind:connectedItem="sharedItem"></ShareScreen>
</div>
`,
  computed: {
    someoneSharing() {
      return this.sharedItem ? true : false;
    },
    sharedItem() {
      return this.$store.getters.somebodySharing;
    },
    showCarousel() {
      // only show if there are 2 or more people and someone is sharing
      return this.someoneSharing && this.itemsForCarousel.length > 1;
    },
    itemsForCarousel() {
      return this.$store.getters.connected;
    },
  },

  // <Carousel v-if="showCarousel" v-bind:connectedItems="itemsForCarousel"></Carousel>
};
