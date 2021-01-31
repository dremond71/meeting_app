import MyWidget from './MyWidget.js';

export default {
    name: 'Carousel',
    components: {
        MyWidget,
    },
    template:`
<div class="w3-row">
  <div class="w3-col m3 w3-center w3-grey">left</div>

  <div class="w3-col m6 w3-center">center</div>

  <div class="w3-col m3 w3-center">right</div>
</div>
    `,
    template2: `
<div class="w3-row">
   <div class="w3-col" style="width:30%"></div>
   <div id="carousel" class="w3-col" style="width:30%">
   <MyWidget v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item" v-bind:carouselMode="isCarouselMode"/>
   </div>
   <div class="w3-col" style="width:30%"></div>
</div>
`, 
props: ['connectedItems'],
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