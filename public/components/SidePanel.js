
import Carousel2 from './Carousel2.js';
import ChatArea from './ChatArea.js';
export default {
    name: 'SidePanel',
    components: {
     Carousel2,
     ChatArea   
    },
    template: `
    <div>
      <Carousel2></Carousel2>
      <ChatArea></ChatArea>
    </div>
`,
computed: {
}

}