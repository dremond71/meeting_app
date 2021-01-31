import CarouselWidget from './CarouselWidget.js';

export default {
    name: 'Carousel2',
    components: {
        CarouselWidget
    },
    template: `
<div class="w3-center">

    <button class="w3-button w3-margin-top w3-margin-bottom" onclick="plusDivs(-1)">
        <i class="bi bi-arrow-up-circle-fill"></i>
    </button>

    
    <CarouselWidget v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item" v-bind:carouselMode="isCarouselMode"/>   
    


    <button class="w3-button w3-margin-top w3-margin-bottom" onclick="plusDivs(1)">
      <i class="bi bi-arrow-down-circle-fill"></i>
    </button>

</div>
`,
data: function () {
    return {
      carouselPage: 1
   
    }
  },
computed: {
    connectedItems() {
        return  this.$store.getters.connected;
    },
    isCarouselMode() {
        return true;
    }
}

}