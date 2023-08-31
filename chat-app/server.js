const net = require('net');

const PORT = 3000;
const HOST = '::1';
const clients = [];
const server = net.createServer(() => {});

server.on('connection', (socket) => {
  console.log('A new client connected!');
  const clientId = clients.length + 1;

  clients.map((client) => {
    client.socket.write(`User ${clientId} Joined the Chat!`);
  });

  clients.push({ id: clientId.toString(), socket });

  socket.write(`id-${clientId}`);

  socket.on('data', (data) => {
    const dataString = data.toString('utf-8');
    const id = dataString.substring(0, dataString.indexOf('-'));
    const message = dataString.substring(dataString.indexOf('-message-') + 9);
    for (const client of clients) {
      client.socket.write(`> User ${id}: ${message}`);
    }
  });

  socket.on('close', () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} Left the Chat!`);
    });
  });

  socket.on('error', () => {
    socket.end();
  });
});

server.listen(PORT, HOST, () => {
  console.log('Server listening on port 3000');
});
