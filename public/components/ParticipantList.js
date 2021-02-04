
import ParticipantChat from './ParticipantChat.js';

export default {
    name: 'ParticipantList',
    components: {
        ParticipantChat
    },
    template: `
<div v-if="show" class="w3-container">
  <h2>{{ title }}</h2>
  <ParticipantChat v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item">{{ item.id }}</ParticipantChat>
</div>`,
computed: {
    title() {
       return `Participants (${this.connectedItems.length})`;
    },
    connectedItems() {
        return this.$store.getters.everyoneButMe;
    },
    show() {
        return this.connectedItems.length > 0;
    },
},

}