export default {
    name: 'InfoBar',
    components: {
    },
    template: `
<div class="">
  {{ message }}
</div>`,
computed: {
    message () {
        return this.$store.state.infoBarMessage;
    }
}

}