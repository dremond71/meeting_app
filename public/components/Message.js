import { anchorAnyURLs } from './url_helper.js';
export default {
  name: 'Message',
  components: {},
  template: `
  <div class="w3-panel w3-round-xlarge w3-light-blue w3-border-white">
      <table align="center">
        <tr>
          <td><b>#:</b></td>
          <td>{{currentMessageTitle}}</td>
          <td style="padding-left:10px;"><b>From:</b></td>
          <td>{{fromValue}}</td>
          <td  style="padding-left:10px;"><b>To:</b></td>
          <td>{{toValue}}</td>
        </tr>
      </table>
      <p v-html="messageValue"></p>
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
      return anchorAnyURLs(this.message.message);
    },
    showCurrentMessageTitle() {
      return this.reversedChatMessages.length > 1;
    },
    reversedChatMessages() {
      return this.$store.getters.allChatMessages.slice().reverse();
    },
    currentMessageTitle() {
      let value = '';
      const theMessages = this.reversedChatMessages;
      const index = theMessages.findIndex((m) => {
        return m.id === this.message.id;
      });
      if (index >= 0) {
        value = `${index + 1}`;
      }
      return value;
    },
  },
};
