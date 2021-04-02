# replica limit

If replica is greater than 1, then http and socket requests
are scattered across the pods, and two people cannot connect
with each other properly.

For example, here is the output of 3 pod logs when 2 people
connect

```sh
'pod meeting-app-79b779b6cf-77nhd'
server is listening on port 3001
server.js:socket.on:join-room:event: SOCKET_ID: xbEzTT4UYrX_O-m-AAAB room: videochat, userid: 1b6e0625-8001-4bf7-8632-3fd37c6132ee, userName:dom
server.js:socket.on:disconnect:event: room: videochat, userid: 1b6e0625-8001-4bf7-8632-3fd37c6132ee, user name dom
server.js:socket.on:join-room:event: SOCKET_ID: PQGdNxetrqIaJux8AAAV room: videochat, userid: 66f2dec4-cf5a-4297-8c1e-ce84b907a464, userName:marc
server.js:socket.on:disconnect:event: room: videochat, userid: 66f2dec4-cf5a-4297-8c1e-ce84b907a464, user name marc

'pod meeting-app-79b779b6cf-cghsz'
server is listening on port 3001
/room and userName is marc

'pod meeting-app-79b779b6cf-r9fnr'
server is listening on port 3001
/room and userName is dom
server.js:socket.on:muted-audio:event: room: videochat, userid: 1b6e0625-8001-4bf7-8632-3fd37c6132ee
/room and userName is marc

```

So, based on this, it is best to set `replicas` to 1.

Or perhaps I should read this workaround:

https://github.com/socketio/socket.io/issues/3539

https://stackoverflow.com/questions/54253752/how-can-i-enable-session-affinity-by-client-ip-on-a-kubernetes-loadbalancer-in-g

https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip

On the service, I tried

sessionAffinity: ClientIP

it didn't work.

Then I tried:

externalTrafficPolicy: Local

it didn't work.
