
export default {
    name: 'ChatSearchBar',
    components: {
    },
    template: `
<div v-if="show" class="">
  <h2>{{ description }}</h2>
</div>`,
computed: {
    description () {
        return 'Search Bar [=====]';
    },
    connectedItems() {
        return this.$store.getters.everyoneButMe;
    },
    show() {
        return this.connectedItems.length > 0;
    },
}

}