import ChatSearchBar from './ChatSearchBar.js';
import ParticipantList from './ParticipantList.js';

export default {
    name: 'ChatArea',
    components: {
        ChatSearchBar,
        ParticipantList
    },
    template: `
<div class="w3-center w3-container">
  <ChatSearchBar></ChatSearchBar>
  <ParticipantList></ParticipantList>
</div>`,
computed: {
   
}

}