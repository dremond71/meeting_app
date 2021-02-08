
import ParticipantList from './ParticipantList.js';

export default {
    name: 'ChatArea',
    components: {
       
        ParticipantList
    },
    template: `
<div v-if="show" class="w3-center w3-container w3-border w3-round-large w3-white" style="margin-top:10px;margin-right:10px;">
  <ParticipantList></ParticipantList>
  <div class="w3-white" style="height:80px;"></div>
</div>`,
computed: {
  show() {
    return  this.$store.getters.everyoneButMe.length>0;
  } 
}

}