# hyperproxy-node
The HyperProxy Node is a node with concept similar to a webtorrent hybrid client. Its main job is to route any given request to the larger TCP/UDP nodes in the DAT ecosystem and return the result back to the original request initiator.

# hyperproxy-hub
The HyperProxy Hub is a webrtc signalhubws server that is used as a lobby channel for peer to discover each other. In milestone 3, it is also used to ensure that for every peer contacted it, there is at least one hyperproxy-node available to serve that peer request.

# hyperproxy-browser
A HyperProxy Browser is a regular WebRTC participant who join the swarm like any other DAT node, used as a test client for plain browser node.
