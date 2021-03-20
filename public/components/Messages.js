export default {
  name: 'Messages',
  components: {},
  template: `
  <div>
    <button class="w3-button w3-margin-top w3-margin-bottom">
        <i class="bi bi-arrow-up-circle-fill"></i>
    </button>
    <button class="w3-button w3-margin-top w3-margin-bottom">
        <i class="bi bi-arrow-down-circle-fill"></i>
    </button>
    <div class="w3-panel w3-round-xlarge w3-light-blue w3-border-white">
        <table align="center">
        <tr>
        <td align="right"><b>From:</b></td>
        <td align="left">Everyone</td>
        </tr>
        <tr>
        <td align="right"><b>To:</b></td>
        <td align="left">Me</td>
        </tr>
        </table>
        <p>London is the most populous city in the United Kingdom, with a metropolitan area of over 9 million inhabitants.</p>
    </div>
  </div>
`,
};
