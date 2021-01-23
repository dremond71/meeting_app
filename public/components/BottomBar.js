import MyAudioButton from './MyAudioButton.js';
import MyVideoButton from './MyVideoButton.js';

export default {
    name: 'BottomBar',
    components: {
      MyAudioButton,
      MyVideoButton,
     
    },
    template: `
<div class="w3-bar w3-center w3-blue w3-padding" style="position: fixed; bottom: 0; width: 100%;">
  <MyAudioButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyAudioButton>
  <MyVideoButton v-if="myConnectionExists" v-bind:connectedItem="myConnection"></MyVideoButton>
</div>`,
computed: {
    myConnectionExists () {
        return this.$store.getters.myConnectedItem ? true : false;
  },

  myConnection () {
    return this.$store.getters.myConnectedItem;
}


}

}