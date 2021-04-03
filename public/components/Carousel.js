import CarouselWidget from './CarouselWidget.js';

export default {
  name: 'Carousel',
  components: {
    CarouselWidget,
  },
  template: `
<div class="w3-container w3-center w3-blue">
    <h2>Carousel</h2>
    <button class="w3-button w3-margin-top w3-margin-bottom" v-on:click="moveUp" v-bind:disabled="upDisabled">
        <i class="bi bi-arrow-up-circle-fill"></i>
    </button>
    <CarouselWidget v-for="item in carouselContent"  v-bind:key="item.id"  v-bind:connectedItem="item" v-bind:carouselMode="isCarouselMode"/>   
    <button class="w3-button w3-margin-top w3-margin-bottom" v-on:click="moveDown" v-bind:disabled="downDisabled">
      <i class="bi bi-arrow-down-circle-fill"></i>
    </button>
</div>
`,
  data: function () {
    return {
      rowIndex: 0,
      maxContentLimit: 4,
      contentLength: 0,
    };
  },
  computed: {
    isCarouselMode() {
      return 'yes';
    },
    upDisabled() {
      return this.rowIndex === 0;
    },
    downDisabled() {
      return this.rowIndex === this.contentLength - 1;
    },
    carouselContent() {
      console.log(`In carouselContent`);

      let originalArray;

      // when someone is sharing, everyone shows up
      // in the carousel
      if (this.$store.getters.somebodySharing) {
        // always place me at the top of the carousel
        // for ease of determining of what my camera sees.

        // make a duplicate array so we don't modify the array
        // in the store
        const duplicateArray = [...this.$store.getters.connected];
        // I am always bottom of array
        // so 'pop' me out
        const me = duplicateArray.pop();
        // create an array with me at the front, and everyone
        // else after me
        originalArray = [me, ...duplicateArray];
      } else {
        // when noone is sharing, only I get put
        // into the carousel.
        // all other participants show up in
        // main area (video grid)
        originalArray = [];
        if (this.$store.getters.myConnectedItem) {
          originalArray.push(this.$store.getters.myConnectedItem);
        }
      }

      // need to break a long array into separate arrays of max length of maxContentLimit.
      const rowDataArray = [];
      let tempArray = [];
      let rowIdCounter = 1;
      for (let i = 0; i < originalArray.length; i++) {
        tempArray.push(originalArray[i]);

        if (
          tempArray.length == this.maxContentLimit ||
          i == originalArray.length - 1
        ) {
          rowDataArray.push({ id: rowIdCounter++, content: tempArray });
          tempArray = [];
        }
      }

      this.contentLength = rowDataArray.length;
      // safety check for rowIndex
      if (this.rowIndex < 0 || this.rowIndex > rowDataArray.length - 1) {
        this.rowIndex = 0;
      }

      const dataToReturn =
        rowDataArray.length == 0 ? [] : rowDataArray[this.rowIndex].content;
      return dataToReturn;
    },
  },
  methods: {
    moveUp() {
      console.log(`Move Up!`);
      if (this.rowIndex > 0) {
        this.rowIndex--;
      } else {
        console.log(`Already at lower index`);
      }
    },
    moveDown() {
      console.log(`Move Down!`);
      if (this.rowIndex < this.contentLength - 1) {
        this.rowIndex++;
      } else {
        console.log(`Already at upper index`);
      }
    },
  },
};
