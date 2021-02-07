
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
        let theName = this.connectedItem.userName;
        // if user name is undefined or empty string, use id value.
        if (!theName || theName.trim() === ''){
            theName = this.connectedItem.id;
        }
        console.log(`The name of participant is ${theName}`);
        return theName;
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