const serverConnection = {
  send(sessionDescription) {
    console.debug('server received sessionDescription:', JSON.stringify(sessionDescription, null, 2));
  },
  sendIce(candidate) {
    console.debug('server received candidate:', JSON.stringify(candidate, null, 2));
  },
}

const peerConnectionConfig = {
  // Google provider free stun server we can use directly.
  'iceServers': [
    { 'urls': 'stun:stun.l.google.com:19302' },
    { 'urls': 'stun:stun1.l.google.com:19302' },
    { 'urls': 'stun:stun2.l.google.com:19302' },
    { 'urls': 'stun:stun3.l.google.com:19302' },
    { 'urls': 'stun:stun4.l.google.com:19302' },
  ]
};

// RTC Variables and dataChannel references
var peerConnection = null;
var dataChannel = null;

// Prepare WebRTC connection instance
peerConnection = new RTCPeerConnection(peerConnectionConfig);
peerConnection.onicecandidate = (event) => {
  if (event.candidate != null) {
    serverConnection.sendIce(event.candidate); // ---------------------------------------------------------------NOTE: 2. send host ice candidate back to client side automatically x N times
  }
}

if (/host/.exec(location.search)) {
  // As host page(caller)

  // Attach event callback function
  dataChannel = peerConnection.createDataChannel('myTestChannel'); // -------------------------------------------NOTE: open data channel for remote client
  dataChannel.onmessage = (event) => console.debug('onmessage:', event.data, dataChannel.readyState);
  dataChannel.onopen = (...args) => {
    console.debug('onopen:', ...args, dataChannel.readyState);
    console._log = console.log;
    console.log = (...msg) => {
      dataChannel.send(...msg);
      console.debug(...msg);
    }
  };
  dataChannel.onclose = (...args) => console.debug('onclose:', ...args, dataChannel.readyState);

  // start to create connection offer as host
  peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => serverConnection.send(peerConnection.localDescription)) // --------------------------------------NOTE: 1. send sessionDescription for remote client side
    .catch((...msg) => console.error('msg:', ...msg));
  
  window.setRemoteDescription = (sessionDescription) => {                // --------------------------------------NOTE: handle answer sessionDescription of client
    // From `serverConnection.send` of client
    if (sessionDescription) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription))
        .then(() => {
          console.debug('after set up sessionDescription of client');
        })
        .catch((...msg) => console.error('msg:', ...msg));;
    }
  }

  window.setRemoteIceCandidate = (candidate) => { // ------------------------------------------------------------NOTE: 3.3 host need to set ice canidate sent back by client.
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .then(() => console.debug('added ice candidate'))
      .catch((...msg) => console.error('msg:', ...msg));
  };
} else {
  // As receiver(called)
  peerConnection.ondatachannel = (event) => { // ----------------------------------------------------------------NOTE: triggered once dataChannel ready paired with `peerConnection.createDataChannel` of host

    // Attach event callback function
    dataChannel = event.channel;
    dataChannel.onmessage = (event) => console.debug('onmessage:', event.data, dataChannel.readyState);
    dataChannel.onopen = (...args) => {
      console.debug('onopen:', ...args, dataChannel.readyState);
      console._log = console.log;
      console.log = (...msg) => {
        dataChannel.send(...msg);
        console.debug(...msg);
      }
    };
    dataChannel.onclose = (...args) => console.debug('onclose:', ...args, dataChannel.readyState);;
  };

  window.setRemoteDescription = (sessionDescription) => { // -----------------------------------------------------NOTE: 3.1 client need to set sessionDescription sent by host
    // From `serverConnection.send` of host
    if (sessionDescription) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription))
        .then(() => {
          if (sessionDescription.type === 'offer')
            peerConnection.createAnswer()
              .then(pairedSessionDescription => peerConnection.setLocalDescription(pairedSessionDescription)) // NOTE: set paired sessionDescription with remote host
              .then(() => serverConnection.send(peerConnection.localDescription)) //-----------------------------NOTE: also send paired sessionDescription back to host and trigger `peerConnection.onicecandidate` of host 
              .catch((...msg) => console.error('msg:', ...msg));
        });
    }
  };
  window.setRemoteIceCandidate = (candidate) => { // ------------------------------------------------------------NOTE: 3.2 client need to set ice canidate sent back by host.
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .then(() => console.debug('added ice candidate'))
      .catch((...msg) => console.error('msg:', ...msg));
  };
};

// Helper function
window.setRemoteSessionDescriptionAndIceCandidatesHelper = (sessionDescription, ...iceCandidates) => {
  window.setRemoteDescription(sessionDescription);
  if (iceCandidates.length) {
    iceCandidates.forEach(setRemoteIceCandidate);
  }
};
