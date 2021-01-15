export default {
    name: 'MyWidget',
    components: {
    },
    template: `
<div class="w3-col m3 w3-margin" >
  <div>
      <video v-bind:id="connectedItem.id" v-bind:muted="connectedItem.isMe"></video>
  </div>   
</div>`,
props: ['connectedItem'],
mounted () {
    const theVideoElement = document.getElementById(this.connectedItem.id);
    theVideoElement.srcObject = this.connectedItem.stream;
    theVideoElement.addEventListener('loadedmetadata', () => {
        theVideoElement.play();
    });
}    
}