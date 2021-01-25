import ShareScreen from './ShareScreen.js';

export default {
    name: 'ShareArea',
    components: {
        ShareScreen
    },
    template: `
<div>
    <ShareScreen v-if="someoneSharing" v-bind:connectedItem="sharedItem"></ShareScreen>
</div>
`,
computed: {
    someoneSharing() {
        
        return this.sharedItem ? true: false;

    },
    sharedItem() {
        return this.$store.getters.somebodySharing;
    }
},

}