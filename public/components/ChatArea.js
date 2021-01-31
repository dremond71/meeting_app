export default {
    name: 'ChatArea',
    components: {
    },
    template: `
<div class="w3-center">
 <p>Chat Area</p>
</div>`,
computed: {
    message () {
        return this.$store.state.infoBarMessage;
    }
}

}