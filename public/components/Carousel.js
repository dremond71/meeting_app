import MyWidget from './MyWidget.js';

export default {
    name: 'Carousel',
    components: {
        MyWidget,
    },
    template: `
<div class="w3-row-padding">
   <div id="carousel" class="w3-col m3 w3-margin">
   <MyWidget v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item" v-bind:carouselMode="isCarouselMode"/>
   </div>
</div>
`, 
props: ['connectedItems'],
data: function () {
    return {
      carouselPage: 1
   
    }
  },
computed: {
    show () {
       return true;
    },
    connectedItems() {
        return  this.$store.getters.connected;
    },
    isCarouselMode() {
        return true;
    }
}
}