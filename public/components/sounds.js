const sounds = {
  join: {
    url: './components/sounds/join1.mp3',
    volumeLevel: 1.0,
  },
  leave: {
    url: './components/sounds/leave1.mp3',
    volumeLevel: 1.0,
  },
  chat_received: {
    url: './components/sounds/chat_received.mp3',
    volumeLevel: 0.1,
  },
};

function playSound(name) {
  // ensure the sound is valid
  const soundInfo = sounds[name];
  if (soundInfo && window.domAudioElements) {
    // only play the sound if its name exists
    // and we have already loaded all sounds
    // into the windows object
    const tempURL = soundInfo.url.replace('./', '');
    // find the sound by its url
    const audioElement = window.domAudioElements.find((element) => {
      return element.src.indexOf(tempURL) !== -1;
    });
    if (audioElement) {
      try {
        audioElement.play();
      } catch (err) {
        console.log(err);
      }
    }
  }
}
export function putAudioElementsInWindowObject() {
  if (!window.domAudioElements) {
    // sound files have not yet been loaded
    // for iOS devices
    window.domAudioElements = [];
    let myAudioElement;
    for (const [soundName, soundInfo] of Object.entries(sounds)) {
      myAudioElement = new Audio(soundInfo.url);
      myAudioElement.volume = soundInfo.volumeLevel;
      myAudioElement.load();
      window.domAudioElements.push(myAudioElement);
    }
  }
}

export function playSound_JoinMeeting() {
  playSound('join');
}

export function playSound_LeaveMeeting() {
  playSound('leave');
}

export function playSound_ChatReceived() {
  playSound('chat_received');
}
