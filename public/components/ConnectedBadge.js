export default {
    name: 'ConnectedBadge',
    components: {
    },
    template: `
<div class="w3-bar-item w3-right">
    {{count}}
</div>   
`,
computed: {
    count () {
        return `Users connected: ${this.$store.getters.connected.length}`;
       
    }
}

}