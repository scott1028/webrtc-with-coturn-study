# Quickstart

- run `http-server`
- open `http://127.0.0.1:8080?host` as caller and check browser's devTool console
- open `http://127.0.0.1:8080` as receiver and check browser's devTool console
- execute statement like below on receiver's console
```
setRemoteSessionDescriptionAndIceCandidatesHelper(
  {
    "type": "offer",
    "sdp": "v=0\r\no=- 3053324786663600956 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:8Zwx\r\na=ice-pwd:dLlImvjTPVZDkVl5oPD4NVA+\r\na=ice-options:trickle\r\na=fingerprint:sha-256 67:18:41:CA:C7:EE:B5:C8:D6:EC:D6:6E:5A:D3:85:26:F2:E0:4E:95:1A:BB:B2:CD:CE:5F:C1:D5:87:8C:67:B0\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"
  },   {
    "candidate": "candidate:3988902457 1 udp 2113937151 3899ae21-4c90-4a92-8fd0-407e8638e749.local 53593 typ host generation 0 ufrag 8Zwx network-cost 999",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  },  {
    "candidate": "candidate:842163049 1 udp 1677729535 123.241.225.92 53593 typ srflx raddr 0.0.0.0 rport 0 generation 0 ufrag 8Zwx network-cost 999",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  }
)
```
- execute statement like below on caller's console
```
setRemoteSessionDescriptionAndIceCandidatesHelper({
  "type": "answer",
  "sdp": "v=0\r\no=- 6791035423455736806 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:oFAw\r\na=ice-pwd:Woqia++R3gQe/JaPdxcyFKY8\r\na=ice-options:trickle\r\na=fingerprint:sha-256 23:06:91:80:86:8D:3D:8C:44:69:B3:45:76:11:62:F1:24:1E:FE:D5:1A:72:46:67:7F:82:C2:4B:B3:CB:E7:9E\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"
},  {
  "candidate": "candidate:3988902457 1 udp 2113937151 8e36df6e-8494-4105-bfd4-3564fb3742d1.local 59794 typ host generation 0 ufrag oFAw network-cost 999",
  "sdpMid": "0",
  "sdpMLineIndex": 0
})
```
- check if `onopen: xxxxx` log displayed. After connection opened, you can try `console.log` on both of devTool console

# UML Diagram
- ![P2P connection workflow](https://raw.githubusercontent.com/scott1028/webrtc-with-coturn-study/master/nativeWebRTC/workflow.png)
  - Signaling-server: privode SDP & ICE Candidate information exchange.
  - Turn Server: provide data relay once real P2P can not be used between two network endpoint.

- ![Browser campatible sheet](https://github.com/scott1028/webrtc-with-coturn-study/blob/master/nativeWebRTC/campatible-table.jpg)

# Terminology
- sessionDescription specifies the configuration to be applied to the local end of the connection.
- iceCandidate. ICE(Interactive Connectivity Establishment) is a framework for P2P connection of WebRTC. (https://developer.mozilla.org/en-US/docs/Glossary/ICE)
  - connection candidate objects. It could be a array, the browser will try the stunnel from `local network` to `turn server base` in priority.

# Reference
- https://ithelp.ithome.com.tw/articles/10209725

