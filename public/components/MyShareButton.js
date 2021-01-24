export default {
    name: 'MyShareButton',
    components: {
    },
    template:  `
    <button class="w3-button w3-round-xxlarge  w3-light-blue w3-margin-left" v-on:click="toggleSharing">{{ sharingButtonText}} </button>
    `,
    props: ['connectedItem'],
    computed: {
        sharingButtonText () {
            return  this.connectedItem.sharing ? 'Sharing' : 'Share Screen'; 
        },   
    },
    methods: {
        async toggleSharing () {
            
            if (this.connectedItem.sharing){
                this.$store.dispatch('stopSharing');
            }
            else {

                await this.startCapture();}
            
        },
        async startCapture(displayMediaOptions) {
            let captureStream = null;
          
            const gdmOptions = {
                video: {
                  cursor: "always"
                },
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: 44100
                }
              };

            try {
               
              captureStream = await navigator.mediaDevices.getDisplayMedia(gdmOptions);
              this.$store.dispatch('startSharing', captureStream );
              console.log('');
            } catch(err) {
              console.error("Error: " + err);
            }

           
            
        }     
    }, 
}