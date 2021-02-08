import ParticipantChat from './ParticipantChat.js';

export default {
    name: 'ParticipantList',
    components: {
        ParticipantChat,
    },
    template: `
<div class="w3-container w3-white">
  <h5>{{ title }}</h5>
  <input v-model="searchString" class="w3-border" style="width:130px" placeholder="Search...">
  <ParticipantChat v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item"></ParticipantChat>
</div>`,
data: function () {
    return {
      searchString: '',
    }
  },
computed: {
    title() {
       return `Participants (${this.$store.getters.everyoneButMe.length})`;
    },
    theSearchString() {
       return this.searchString;
    },
    connectedItems() {
        let items = this.$store.getters.everyoneButMe;

        if (this.theSearchString.trim() !== ''){
            console.log(`filtering on ${this.theSearchString}`);
           items = items.filter( connectedItem => {
               
                let nameFoundIndex=-1;

                if (connectedItem.userName)
                 nameFoundIndex = connectedItem.userName.indexOf(this.theSearchString);

                return (nameFoundIndex != -1);
            } );
        }

        return items ;
    }
    
   
},

}