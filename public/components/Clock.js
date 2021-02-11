export default {
  name: 'Clock',
  components: {},
  template: `
    <div id="clock" class="w3-bar-item w3-left">
      {{ time }}
    </div>
`,
  data: function () {
    return {
      time: '',
    };
  },
  mounted() {
    // every second, update the time property with a new date

    setInterval(
      function () {
        const newTime = new Date().toLocaleString();
        //console.log(`Changed time to: ${newTime}`);
        this.time = newTime;
      }.bind(this),
      1000
    );
  },
};
