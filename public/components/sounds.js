function playSound(url, volumeLevel) {
  try {
    const myAudioElement = new Audio(url);
    myAudioElement.volume = volumeLevel;
    myAudioElement.addEventListener('canplaythrough', (event) => {
      myAudioElement.play();
    });
  } catch (err) {
    console.log(err);
  }
}

export function playSound_JoinMeeting() {
  const url = './components/sounds/join1.mp3';
  playSound(url, 1.0);
}

export function playSound_LeaveMeeting() {
  const url = './components/sounds/leave1.mp3';
  playSound(url, 1.0);
}

export function playSound_ChatReceived() {
  const url = './components/sounds/chat_received.mp3';
  playSound(url, 0.1);
}
