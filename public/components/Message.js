export default {
  name: 'Message',
  components: {},
  template: `
<div class="w3-panel w3-round-xlarge w3-light-blue w3-border-white">
    <table align="center">
      <tr>
        <td><b>From:</b></td>
        <td>{{fromValue}}</td>
        <td  style="padding-left:20px;"><b>To:</b></td>
        <td>{{toValue}}</td>
      </tr>
    </table>
    <p>{{messageValue}}</p>
</div>  
  `,
  props: ['message'],
  computed: {
    fromValue() {
      return this.message.from;
    },
    toValue() {
      return this.message.to;
    },
    messageValue() {
      return this.message.message;
    },
  },
};
