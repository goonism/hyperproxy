# hyperproxy-node
Hyperproxy node is a module that provides proxying capabilities to any WebRTC swarm it is placed in. This means that if you put a Hyperproxy node in your WebRTC swarm pertaining to a specific public key, you are guaranteed a gateway into the Dat ecosystem's native nodes for that same public key. 

# hyperproxy-hub
The Hyperproxy Hub is a WebRTC Signalhubws server that is used as a lobby channel for peers to discover each other. In addition to being a Signalhubws server, it also automatically creates and injects a Hyperproxy node into each swarm that it creates. This guarantees that any given swarm will have at least one Hyperproxy node. 

# hyperproxy-browser
A Hyperproxy Browser is a regular WebRTC participant who joins a swarm like any other DAT node, used as a test client and for marketing purposes to show Hyperproxy in action.
