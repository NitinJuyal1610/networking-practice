const net = require('net');

const server = net.createServer((socket) => {
  //socket is the connection channel established between client & server (duplex stream)
  socket.on('data', (data) => {
    console.log(data.toString('utf-8'));
  });
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on port 3000', server.address());
});
