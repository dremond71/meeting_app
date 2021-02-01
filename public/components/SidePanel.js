
import Carousel from './Carousel.js';
import ChatArea from './ChatArea.js';
export default {
    name: 'SidePanel',
    components: {
     Carousel,
     ChatArea   
    },
    template: `
    <div>
      <Carousel v-if="someoneSharing"></Carousel>
      <ChatArea></ChatArea>
    </div>
`,
computed: {
  someoneSharing() {   
    return this.sharedItem ? true: false;
},
sharedItem() {
  return this.$store.getters.somebodySharing;
},
}

}