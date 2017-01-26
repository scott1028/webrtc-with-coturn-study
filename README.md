# Usage

- SimpleWebRTC Project For Frontend UI Interface. update index.html `config.url`.
- SignalingMaster, a webrtc signaling server to config where turn, stun and user crendential.

```
$ node ./SimpleWebRTC/server.js
$ node ./signalmaster/server.js
```

- index.html

```
var webrtc = new SimpleWebRTC({
    url: 'http://127.0.0.1:7002',  // signalingMaster server, https://github.com/andyet/signalmaster.git
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    // force using turn server(relay server)
    peerConnectionConfig: {
        iceTransports: 'relay'
    }
});
```

- config/development.json in sigalmaster, add turn server config

```
{
  "isDev": true,
  "server": {
    "port": 7002,
    "/* secure */": "/* whether this connects via https */",
    "secure": false,
    "key": null,
    "cert": null,
    "password": null
  },
  "rooms": {
    "/* maxClients */": "/* maximum number of clients per room. 0 = no limit */",
    "maxClients": 0
  },
  "stunservers": [
    {
      "url": "stun:stun.l.google.com:19302"
    }
  ],
  "turnservers": [
    {
      "urls": ["turn:127.0.0.1:3478"],
      "username": "test2",
      "credential": "testp",
      "expiry": 86400
    }
  ]
}

```

- sockets.js

```
credentials.push({
    // username: username,
    // credential: hmac.digest('base64'),
    username: server.username,
    credential: server.secret,
    urls: server.urls || server.url
});
```

- coturn create a user with test, password.
- 如果 ROOM 出現雙方 Video 影像就正確了！

![Alt text](https://raw.githubusercontent.com/scott1028/webrtc-with-coturn-study/master/coturnlog.jpg "coturnlog.jpg")
![Alt text](https://raw.githubusercontent.com/scott1028/webrtc-with-coturn-study/master/coturn401errorInWireshark1.jpg "coturn401errorInWireshark1.jpg")
![Alt text](https://raw.githubusercontent.com/scott1028/webrtc-with-coturn-study/master/coturn401errorInWireshark2.jpg "coturn401errorInWireshark2.jpg")
![Alt text](https://raw.githubusercontent.com/scott1028/webrtc-with-coturn-study/master/coturn401errorInWireshark3.jpg "coturn401errorInWireshark3.jpg")