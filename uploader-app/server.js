const net = require('net');
const fs = require('fs/promises');

const PORT = 4000;

const server = net.createServer(() => {});

server.on('connection', (socket) => {
  console.log('New Connection');
  let fileHandle, fileStream;
  socket.on('data', async (data) => {
    if (!fileHandle) {
      console.log(data.toString('utf-8'));
      const indexOfDiv = data.indexOf('------');
      const fileName = data.subarray(10, indexOfDiv).toString();
      console.log(fileName);
      socket.pause();
      fileHandle = await fs.open(`storage/${fileName}`, 'w');
      fileStream = fileHandle.createWriteStream();
      fileStream.write(data.subarray(indexOfDiv + 6));
      socket.resume();

      fileStream.on('drain', () => {
        socket.resume();
      });
    } else {
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on('end', () => {
    fileHandle.close();
    fileHandle = undefined;
    fileStream = undefined;
    console.log('Connection Ended');
  });
});

server.listen(PORT, '::1', () => {
  console.log(`Server listening on PORT:${PORT} at`, server.address());
});
