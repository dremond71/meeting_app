
export default {
    name: 'ParticipantChat',
    components: {
    },
    template: `
<div class="w3-container w3-border w3-margin-top">
    <div  class="w3-panel w3-blue w3-round-xlarge" v-on:click="toggle">{{ name }}</div>
    <div id="Demo1" v-bind:class="sectionClasses">
    The contents are for {{ name }}
    </div>
</div>`,
props: ['connectedItem'],
data: function () {
    return {
      open: false,
    }
  },
computed: {
    name () {
        return this.connectedItem.userName ? this.connectedItem.userName : this.connectedItem.id;
    },
    sectionClasses() {
        let someClasses = "w3-container w3-border w3-margin-bottom";
        if (!this.open){
            someClasses += ' w3-hide';
        }
        return someClasses;
    }

},
methods: {
    toggle() {
        this.open = !this.open;
    }
}

}